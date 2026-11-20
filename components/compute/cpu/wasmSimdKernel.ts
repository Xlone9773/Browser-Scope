// Inline zero-dependency WebAssembly SIMD (v128 f32x4) compute kernel builder
// + bit-exact Math.fround CPU reference verifier.
// Executes 8 independent v128 vector accumulators across 4 unrolled FMA-style
// steps per loop iteration, saturating AVX2 / SSE / NEON CPU SIMD pipelines.

export type CpuComputeMode = 'wasm-simd' | 'scalar-js';

export const WASM_SIMD_FLOPS_PER_ITERATION = 264;
export const WASM_SIMD_REDUCTION_FLOPS = 31;

const SEEDS_BASE: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.11, 0.22, 0.33, 0.44],
  [0.15, 0.25, 0.35, 0.45],
  [0.19, 0.29, 0.39, 0.49],
  [0.23, 0.33, 0.43, 0.53],
  [-0.11, 0.22, -0.33, 0.44],
  [-0.15, 0.25, -0.35, 0.45],
  [-0.19, 0.29, -0.39, 0.49],
  [-0.23, 0.33, -0.43, 0.53],
];

const MUL_CONST: readonly [number, number, number, number] = [0.9961, 0.9963, 0.9965, 0.9967];
const ADD_A: readonly [number, number, number, number] = [0.0031, -0.0029, 0.0027, -0.0025];
const ADD_B: readonly [number, number, number, number] = [-0.0019, 0.0023, -0.0017, 0.0021];
const SEED_SCALE: readonly [number, number, number, number] = [0.0007, -0.0005, 0.0009, -0.0003];
const DRIVE_SCALE: readonly [number, number, number, number] = [0.00001, -0.00001, 0.00002, -0.00002];

const encodeLebU32 = (value: number): number[] => {
  const out: number[] = [];
  let v = value >>> 0;
  do {
    let b = v & 0x7f;
    v >>>= 7;
    if (v !== 0) b |= 0x80;
    out.push(b);
  } while (v !== 0);
  return out;
};

const encodeSection = (id: number, bytes: number[]): number[] => [
  id,
  ...encodeLebU32(bytes.length),
  ...bytes,
];

const encodeSimdOp = (opcode: number): number[] => [0xfd, ...encodeLebU32(opcode)];

const f32x4Const = (a: number, b: number, c: number, d: number): number[] => {
  const buf = new ArrayBuffer(16);
  const view = new DataView(buf);
  view.setFloat32(0, a, true);
  view.setFloat32(4, b, true);
  view.setFloat32(8, c, true);
  view.setFloat32(12, d, true);
  return [0xfd, 0x0c, ...new Uint8Array(buf)];
};

const localGet = (idx: number): number[] => [0x20, ...encodeLebU32(idx)];
const localSet = (idx: number): number[] => [0x21, ...encodeLebU32(idx)];
const localTee = (idx: number): number[] => [0x22, ...encodeLebU32(idx)];

const OP_F32X4_SPLAT = [0xfd, 0x13];
const OP_F32X4_ADD = encodeSimdOp(0xe4);
const OP_F32X4_MUL = encodeSimdOp(0xe6);

const buildWasmSimdBytes = (): Uint8Array => {
  const initVecs: number[] = [
    ...SEEDS_BASE.flatMap((row, idx) => [
      ...f32x4Const(row[0], row[1], row[2], row[3]),
      ...localGet(1),
      ...OP_F32X4_SPLAT,
      ...OP_F32X4_ADD,
      ...localSet(2 + idx),
    ]),
    ...f32x4Const(MUL_CONST[0], MUL_CONST[1], MUL_CONST[2], MUL_CONST[3]),
    ...localSet(10),
    ...f32x4Const(ADD_A[0], ADD_A[1], ADD_A[2], ADD_A[3]),
    ...localSet(11),
    ...f32x4Const(ADD_B[0], ADD_B[1], ADD_B[2], ADD_B[3]),
    ...localSet(12),
    ...localGet(1),
    ...OP_F32X4_SPLAT,
    ...f32x4Const(SEED_SCALE[0], SEED_SCALE[1], SEED_SCALE[2], SEED_SCALE[3]),
    ...OP_F32X4_MUL,
    ...localSet(13),
  ];

  const buildStep = (addReg: number): number[] => {
    const ops: number[] = [];
    for (let k = 2; k <= 9; k++) {
      ops.push(
        ...localGet(k),
        ...localGet(10),
        ...OP_F32X4_MUL,
        ...localGet(addReg),
        ...OP_F32X4_ADD,
        ...localSet(k),
      );
    }
    return ops;
  };

  const body: number[] = [
    0x01,
    13,
    0x7b, // 13 v128 locals (slots 2..14)
    ...initVecs,
    ...localGet(0),
    0x41,
    0x00,
    0x4a, // local0 > 0
    0x04,
    0x40, // if
    0x03,
    0x40, // loop
    ...localGet(0),
    0x41,
    0xff,
    0x01,
    0x71, // (i & 255)
    0xb2, // f32.convert_i32_s
    ...OP_F32X4_SPLAT,
    ...f32x4Const(DRIVE_SCALE[0], DRIVE_SCALE[1], DRIVE_SCALE[2], DRIVE_SCALE[3]),
    ...OP_F32X4_MUL,
    ...localGet(13),
    ...OP_F32X4_ADD,
    ...localSet(14),
    ...buildStep(11),
    ...buildStep(14),
    ...buildStep(12),
    ...buildStep(14),
    ...localGet(0),
    0x41,
    0x01,
    0x6b,
    ...localTee(0),
    0x0d,
    0x00, // br_if 0
    0x0b, // end loop
    0x0b, // end if
    ...localGet(2),
    ...localGet(3),
    ...OP_F32X4_ADD,
    ...localGet(4),
    ...OP_F32X4_ADD,
    ...localGet(5),
    ...OP_F32X4_ADD,
    ...localGet(6),
    ...OP_F32X4_ADD,
    ...localGet(7),
    ...OP_F32X4_ADD,
    ...localGet(8),
    ...OP_F32X4_ADD,
    ...localGet(9),
    ...OP_F32X4_ADD,
    ...localSet(2),
    ...localGet(2),
    0xfd,
    0x1f,
    0x00,
    ...localGet(2),
    0xfd,
    0x1f,
    0x01,
    0x92,
    ...localGet(2),
    0xfd,
    0x1f,
    0x02,
    0x92,
    ...localGet(2),
    0xfd,
    0x1f,
    0x03,
    0x92,
    0x0b,
  ];

  return new Uint8Array([
    0x00,
    0x61,
    0x73,
    0x6d,
    0x01,
    0x00,
    0x00,
    0x00,
    ...encodeSection(1, [0x01, 0x60, 0x02, 0x7f, 0x7d, 0x01, 0x7d]),
    ...encodeSection(3, [0x01, 0x00]),
    ...encodeSection(7, [0x01, 0x03, 0x6b, 0x65, 0x72, 0x00, 0x00]),
    ...encodeSection(10, [0x01, ...encodeLebU32(body.length), ...body]),
  ]);
};

export type WasmSimdRunner = (iterations: number, seed: number) => number;

let cachedBytes: Uint8Array | null = null;
let cachedRunner: WasmSimdRunner | null | undefined = undefined;

export const getWasmSimdRunner = (): WasmSimdRunner | null => {
  if (cachedRunner !== undefined) return cachedRunner;
  if (typeof WebAssembly === 'undefined') {
    cachedRunner = null;
    return null;
  }

  try {
    cachedBytes ??= buildWasmSimdBytes();
    if (!WebAssembly.validate(cachedBytes)) {
      cachedRunner = null;
      return null;
    }
    const mod = new WebAssembly.Module(cachedBytes);
    const inst = new WebAssembly.Instance(mod);
    const ker = inst.exports.ker;
    if (typeof ker === 'function') {
      cachedRunner = ker as WasmSimdRunner;
      return cachedRunner;
    }
  } catch {
    // Graceful fallback to scalar JS if CSP or runtime blocks WebAssembly compilation
  }

  cachedRunner = null;
  return null;
};

/**
 * Pure TypeScript IEEE-754 f32 (Math.fround) reference matching the Wasm SIMD
 * f32x4 bytecode, allowing independent main-thread verification of worker results.
 */
export const executeWasmSimdReference = (
  iterations: number,
  seed: number,
): number => {
  const f = Math.fround;
  const safeIterations = Math.max(0, Math.floor(iterations));
  const s = f(Number.isFinite(seed) ? seed : 0);

  const vecs = SEEDS_BASE.map((row) => [
    f(f(row[0]) + s),
    f(f(row[1]) + s),
    f(f(row[2]) + s),
    f(f(row[3]) + s),
  ]);
  const m = [f(MUL_CONST[0]), f(MUL_CONST[1]), f(MUL_CONST[2]), f(MUL_CONST[3])];
  const addA = [f(ADD_A[0]), f(ADD_A[1]), f(ADD_A[2]), f(ADD_A[3])];
  const addB = [f(ADD_B[0]), f(ADD_B[1]), f(ADD_B[2]), f(ADD_B[3])];
  const sVec = [
    f(s * f(SEED_SCALE[0])),
    f(s * f(SEED_SCALE[1])),
    f(s * f(SEED_SCALE[2])),
    f(s * f(SEED_SCALE[3])),
  ];
  const dScale = [
    f(DRIVE_SCALE[0]),
    f(DRIVE_SCALE[1]),
    f(DRIVE_SCALE[2]),
    f(DRIVE_SCALE[3]),
  ];

  for (let i = safeIterations; i > 0; i--) {
    const dScalar = f(i & 255);
    const dyn0 = f(f(dScalar * dScale[0]) + sVec[0]);
    const dyn1 = f(f(dScalar * dScale[1]) + sVec[1]);
    const dyn2 = f(f(dScalar * dScale[2]) + sVec[2]);
    const dyn3 = f(f(dScalar * dScale[3]) + sVec[3]);

    for (let v = 0; v < 8; v++) {
      const vec = vecs[v];
      vec[0] = f(f(vec[0] * m[0]) + addA[0]);
      vec[1] = f(f(vec[1] * m[1]) + addA[1]);
      vec[2] = f(f(vec[2] * m[2]) + addA[2]);
      vec[3] = f(f(vec[3] * m[3]) + addA[3]);
    }
    for (let v = 0; v < 8; v++) {
      const vec = vecs[v];
      vec[0] = f(f(vec[0] * m[0]) + dyn0);
      vec[1] = f(f(vec[1] * m[1]) + dyn1);
      vec[2] = f(f(vec[2] * m[2]) + dyn2);
      vec[3] = f(f(vec[3] * m[3]) + dyn3);
    }
    for (let v = 0; v < 8; v++) {
      const vec = vecs[v];
      vec[0] = f(f(vec[0] * m[0]) + addB[0]);
      vec[1] = f(f(vec[1] * m[1]) + addB[1]);
      vec[2] = f(f(vec[2] * m[2]) + addB[2]);
      vec[3] = f(f(vec[3] * m[3]) + addB[3]);
    }
    for (let v = 0; v < 8; v++) {
      const vec = vecs[v];
      vec[0] = f(f(vec[0] * m[0]) + dyn0);
      vec[1] = f(f(vec[1] * m[1]) + dyn1);
      vec[2] = f(f(vec[2] * m[2]) + dyn2);
      vec[3] = f(f(vec[3] * m[3]) + dyn3);
    }
  }

  let acc0 = f(0);
  let acc1 = f(0);
  let acc2 = f(0);
  let acc3 = f(0);
  for (let v = 0; v < 8; v++) {
    acc0 = f(acc0 + vecs[v][0]);
    acc1 = f(acc1 + vecs[v][1]);
    acc2 = f(acc2 + vecs[v][2]);
    acc3 = f(acc3 + vecs[v][3]);
  }
  return f(f(f(acc0 + acc1) + acc2) + acc3);
};
