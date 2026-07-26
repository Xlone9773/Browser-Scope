

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

// Pure ALU Vector SIMD Shader (Float32) - minimized global mem, heavy register computations
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
    val0 = fma(val0, val1, vec4<f32>(0.0001));
    val1 = fma(val1, val0, vec4<f32>(0.0002));
    val0 = sin(val0);
    val1 = cos(val1);
  }
  
  let finalVal = dot(val0, val1);
  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = finalVal;
}
`;

// Pure ALU Vector SIMD Shader (Float16)
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
    val0 = fma(val0, val1, vec4<f16>(0.0001h));
    val1 = fma(val1, val0, vec4<f16>(0.0002h));
    val0 = sin(val0);
    val1 = cos(val1);
  }
  
  let finalVal = dot(val0, val1);
  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = f32(finalVal);
}
`;

// Register-Cached Matrix Multiplication (Float32) - optimizes global bandwidth, stresses register file
export const CACHE_MATMUL_SHADER_F32 = `
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
  
  let N = u32(firstMatrix.size.y);
  
  var sum = 0.0;
  
  // Register Caching: we read chunks of 8 elements from global memory into registers (local variables)
  // to avoid repeated global memory lookups in the nested accumulator loop.
  // This heavily utilizes the GPU's register file and L1 cache.
  for (var k = 0u; k < N; k = k + 8u) {
    var regA = vec4<f32>(0.0);
    var regB = vec4<f32>(0.0);
    var regA2 = vec4<f32>(0.0);
    var regB2 = vec4<f32>(0.0);
    
    if (k + 0u < N) {
      regA.x = firstMatrix.numbers[(k + 0u) + resultCell.x * N];
      regB.x = secondMatrix.numbers[resultCell.y + (k + 0u) * u32(secondMatrix.size.y)];
    }
    if (k + 1u < N) {
      regA.y = firstMatrix.numbers[(k + 1u) + resultCell.x * N];
      regB.y = secondMatrix.numbers[resultCell.y + (k + 1u) * u32(secondMatrix.size.y)];
    }
    if (k + 2u < N) {
      regA.z = firstMatrix.numbers[(k + 2u) + resultCell.x * N];
      regB.z = secondMatrix.numbers[resultCell.y + (k + 2u) * u32(secondMatrix.size.y)];
    }
    if (k + 3u < N) {
      regA.w = firstMatrix.numbers[(k + 3u) + resultCell.x * N];
      regB.w = secondMatrix.numbers[resultCell.y + (k + 3u) * u32(secondMatrix.size.y)];
    }
    if (k + 4u < N) {
      regA2.x = firstMatrix.numbers[(k + 4u) + resultCell.x * N];
      regB2.x = secondMatrix.numbers[resultCell.y + (k + 4u) * u32(secondMatrix.size.y)];
    }
    if (k + 5u < N) {
      regA2.y = firstMatrix.numbers[(k + 5u) + resultCell.x * N];
      regB2.y = secondMatrix.numbers[resultCell.y + (k + 5u) * u32(secondMatrix.size.y)];
    }
    if (k + 6u < N) {
      regA2.z = firstMatrix.numbers[(k + 6u) + resultCell.x * N];
      regB2.z = secondMatrix.numbers[resultCell.y + (k + 6u) * u32(secondMatrix.size.y)];
    }
    if (k + 7u < N) {
      regA2.w = firstMatrix.numbers[(k + 7u) + resultCell.x * N];
      regB2.w = secondMatrix.numbers[resultCell.y + (k + 7u) * u32(secondMatrix.size.y)];
    }

    // Accumulate locally using register-held values
    sum = sum + dot(regA, regB) + dot(regA2, regB2);
  }

  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = sum;
}
`;

// Register-Cached Matrix Multiplication (Float16)
export const CACHE_MATMUL_SHADER_F16 = `
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
  
  let N = u32(firstMatrix.size.y);
  
  var sum = 0.0h;
  
  for (var k = 0u; k < N; k = k + 8u) {
    var regA = vec4<f16>(0.0h);
    var regB = vec4<f16>(0.0h);
    var regA2 = vec4<f16>(0.0h);
    var regB2 = vec4<f16>(0.0h);
    
    if (k + 0u < N) {
      regA.x = f16(firstMatrix.numbers[(k + 0u) + resultCell.x * N]);
      regB.x = f16(secondMatrix.numbers[resultCell.y + (k + 0u) * u32(secondMatrix.size.y)]);
    }
    if (k + 1u < N) {
      regA.y = f16(firstMatrix.numbers[(k + 1u) + resultCell.x * N]);
      regB.y = f16(secondMatrix.numbers[resultCell.y + (k + 1u) * u32(secondMatrix.size.y)]);
    }
    if (k + 2u < N) {
      regA.z = f16(firstMatrix.numbers[(k + 2u) + resultCell.x * N]);
      regB.z = f16(secondMatrix.numbers[resultCell.y + (k + 2u) * u32(secondMatrix.size.y)]);
    }
    if (k + 3u < N) {
      regA.w = f16(firstMatrix.numbers[(k + 3u) + resultCell.x * N]);
      regB.w = f16(secondMatrix.numbers[resultCell.y + (k + 3u) * u32(secondMatrix.size.y)]);
    }
    if (k + 4u < N) {
      regA2.x = f16(firstMatrix.numbers[(k + 4u) + resultCell.x * N]);
      regB2.x = f16(secondMatrix.numbers[resultCell.y + (k + 4u) * u32(secondMatrix.size.y)]);
    }
    if (k + 5u < N) {
      regA2.y = f16(firstMatrix.numbers[(k + 5u) + resultCell.x * N]);
      regB2.y = f16(secondMatrix.numbers[resultCell.y + (k + 5u) * u32(secondMatrix.size.y)]);
    }
    if (k + 6u < N) {
      regA2.z = f16(firstMatrix.numbers[(k + 6u) + resultCell.x * N]);
      regB2.z = f16(secondMatrix.numbers[resultCell.y + (k + 6u) * u32(secondMatrix.size.y)]);
    }
    if (k + 7u < N) {
      regA2.w = f16(firstMatrix.numbers[(k + 7u) + resultCell.x * N]);
      regB2.w = f16(secondMatrix.numbers[resultCell.y + (k + 7u) * u32(secondMatrix.size.y)]);
    }

    sum = sum + dot(regA, regB) + dot(regA2, regB2);
  }

  let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
  resultMatrix.numbers[index] = f32(sum);
}
`;

