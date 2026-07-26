

// Shader for standard Float32 (Hybrid Bandwidth)
export const MATMUL_SHADER_F32 = `
struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
    return;
  }

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }
  let resultCell = vec2<u32>(global_id.x, global_id.y);
  
  var result = 0.0;
  for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
    let a = i + resultCell.x * u32(firstMatrix.size.y);
    let b = resultCell.y + i * u32(secondMatrix.size.y);
    result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
  }

  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = result;
}
`;

// Shader optimized for Float16 if supported (Hybrid Bandwidth)
export const MATMUL_SHADER_F16 = `
enable f16;

struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
    return;
  }

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }
  let resultCell = vec2<u32>(global_id.x, global_id.y);
  
  var result = 0.0h; // half-precision accumulator
  
  for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
    let a = i + resultCell.x * u32(firstMatrix.size.y);
    let b = resultCell.y + i * u32(secondMatrix.size.y);
    // Explicit cast to f16 for math operation
    result = result + f16(firstMatrix.numbers[a]) * f16(secondMatrix.numbers[b]);
  }

  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = f32(result); // Cast back for storage
}
`;

// Pure ALU Vector SIMD Shader (Float32) - minimized global mem, heavy register computations.
// Each iteration is clamp(fma(...)) rather than the trig-based clamp this used to use: clamp
// is a plain min/max ALU op with a well-defined FLOP cost, whereas sin/cos run on a separate
// special-function unit whose throughput has no standard FLOP-equivalent and would otherwise
// make the reported GFLOPS partly unaccountable. clamp() serves the same numerical-stability
// role (bounding magnitude every iteration so the multiplicative recurrence can't overflow).
export const ALU_SIMD_SHADER_F32 = `
struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
    return;
  }

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }
  let resultCell = vec2<u32>(global_id.x, global_id.y);

  // High-intensity SIMD FMA loops in registers
  var val0 = vec4<f32>(firstMatrix.numbers[resultCell.x], secondMatrix.numbers[resultCell.y], 1.0, 2.0);
  var val1 = vec4<f32>(3.0, 4.0, 5.0, 6.0);

  // Heavy inner ALU loop to push FP32 floating point processing unit (ALU) to its limits
  for (var i = 0u; i < 200u; i = i + 1u) {
    val0 = clamp(fma(val0, val1, vec4<f32>(0.0001)), vec4<f32>(-4.0), vec4<f32>(4.0));
    val1 = clamp(fma(val1, val0, vec4<f32>(0.0002)), vec4<f32>(-4.0), vec4<f32>(4.0));
  }

  let finalVal = dot(val0, val1);
  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = finalVal;
}
`;

// Pure ALU Vector SIMD Shader (Float16) - see ALU_SIMD_SHADER_F32 for why clamp() replaces sin/cos.
export const ALU_SIMD_SHADER_F16 = `
enable f16;

struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
    return;
  }

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }
  let resultCell = vec2<u32>(global_id.x, global_id.y);

  // High-intensity SIMD FMA loops in registers with f16
  var val0 = vec4<f16>(f16(firstMatrix.numbers[resultCell.x]), f16(secondMatrix.numbers[resultCell.y]), 1.0h, 2.0h);
  var val1 = vec4<f16>(3.0h, 4.0h, 5.0h, 6.0h);

  // Heavy inner ALU loop to push FP16 Tensor Core equivalent ALU processing units
  for (var i = 0u; i < 200u; i = i + 1u) {
    val0 = clamp(fma(val0, val1, vec4<f16>(0.0001h)), vec4<f16>(-4.0h), vec4<f16>(4.0h));
    val1 = clamp(fma(val1, val0, vec4<f16>(0.0002h)), vec4<f16>(-4.0h), vec4<f16>(4.0h));
  }

  let finalVal = dot(val0, val1);
  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = f32(finalVal);
}
`;

// Tiled Matrix Multiplication (Float32) using workgroup shared memory. Each workgroup
// cooperatively stages 8x8 tiles of A and B into fast on-chip shared memory once, then every
// invocation in the workgroup reuses those same tiles for its dot-product terms instead of
// re-reading global memory per term. This is the actual fix for the "cache" preset — the
// previous implementation only ever read from global storage buffers (just via vec4-sized
// reads instead of scalar ones), so it never touched the memory hierarchy its name promised.
export const CACHE_MATMUL_SHADER_F32 = `
struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

const TILE_SIZE = 8u;

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

var<workgroup> tileA : array<array<f32, TILE_SIZE>, TILE_SIZE>;
var<workgroup> tileB : array<array<f32, TILE_SIZE>, TILE_SIZE>;

@compute @workgroup_size(TILE_SIZE, TILE_SIZE)
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>,
  @builtin(local_invocation_id) local_id : vec3<u32>
) {
  let M = u32(firstMatrix.size.x);
  let K = u32(firstMatrix.size.y);
  let N = u32(secondMatrix.size.y);

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }

  let row = global_id.x;
  let col = global_id.y;
  let localRow = local_id.x;
  let localCol = local_id.y;

  var sum = 0.0;
  let tileCount = (K + TILE_SIZE - 1u) / TILE_SIZE;

  for (var t = 0u; t < tileCount; t = t + 1u) {
    let tiledK = t * TILE_SIZE;

    if (row < M && (tiledK + localCol) < K) {
      tileA[localRow][localCol] = firstMatrix.numbers[row * K + (tiledK + localCol)];
    } else {
      tileA[localRow][localCol] = 0.0;
    }

    if ((tiledK + localRow) < K && col < N) {
      tileB[localRow][localCol] = secondMatrix.numbers[(tiledK + localRow) * N + col];
    } else {
      tileB[localRow][localCol] = 0.0;
    }

    // Every invocation in the workgroup must reach this barrier before any of
    // them reads the tiles the others just wrote — bounds-checked invocations
    // above fall through to here rather than returning early.
    workgroupBarrier();

    for (var k = 0u; k < TILE_SIZE; k = k + 1u) {
      sum = sum + tileA[localRow][k] * tileB[k][localCol];
    }

    workgroupBarrier();
  }

  if (row < M && col < N) {
    resultMatrix.numbers[row * N + col] = sum;
  }
}
`;

// Tiled Matrix Multiplication (Float16) - see CACHE_MATMUL_SHADER_F32 for the tiling strategy.
export const CACHE_MATMUL_SHADER_F16 = `
enable f16;

struct Matrix {
  size : vec2<f32>,
  numbers : array<f32>,
}

const TILE_SIZE = 8u;

@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

var<workgroup> tileA : array<array<f16, TILE_SIZE>, TILE_SIZE>;
var<workgroup> tileB : array<array<f16, TILE_SIZE>, TILE_SIZE>;

@compute @workgroup_size(TILE_SIZE, TILE_SIZE)
fn main(
  @builtin(global_invocation_id) global_id : vec3<u32>,
  @builtin(local_invocation_id) local_id : vec3<u32>
) {
  let M = u32(firstMatrix.size.x);
  let K = u32(firstMatrix.size.y);
  let N = u32(secondMatrix.size.y);

  if (global_id.x == 0u && global_id.y == 0u) {
    resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
  }

  let row = global_id.x;
  let col = global_id.y;
  let localRow = local_id.x;
  let localCol = local_id.y;

  var sum = 0.0h;
  let tileCount = (K + TILE_SIZE - 1u) / TILE_SIZE;

  for (var t = 0u; t < tileCount; t = t + 1u) {
    let tiledK = t * TILE_SIZE;

    if (row < M && (tiledK + localCol) < K) {
      tileA[localRow][localCol] = f16(firstMatrix.numbers[row * K + (tiledK + localCol)]);
    } else {
      tileA[localRow][localCol] = 0.0h;
    }

    if ((tiledK + localRow) < K && col < N) {
      tileB[localRow][localCol] = f16(secondMatrix.numbers[(tiledK + localRow) * N + col]);
    } else {
      tileB[localRow][localCol] = 0.0h;
    }

    workgroupBarrier();

    for (var k = 0u; k < TILE_SIZE; k = k + 1u) {
      sum = sum + tileA[localRow][k] * tileB[k][localCol];
    }

    workgroupBarrier();
  }

  if (row < M && col < N) {
    resultMatrix.numbers[row * N + col] = f32(sum);
  }
}
`;

