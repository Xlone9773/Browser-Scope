export type WorkloadType = 'gemm' | 'alu_simd';
export type MemoryMode = 'hybrid' | 'cache';

// ALU SIMD shader body: 200 loop iterations, each with 2 vec4 clamp(fma(...))
// pairs (fma: 4 lanes x 2 flops; clamp: 4 lanes x 2 flops for the min+max),
// plus a closing vec4 dot product (4 muls + 3 adds). This is an exact count
// of the shader's ALU ops — clamp replaced the sin/cos calls this shader
// used to use for the same range-bounding role, since clamp has a
// well-defined FLOP cost and sin/cos do not (they run on a separate
// special-function unit with no standard FLOP-equivalent).
export const ALU_FLOPS_PER_INVOCATION = 200 * 2 * (4 * 2 + 4 * 2) + 7;

export const pipelineCacheKey = (workloadType: WorkloadType, memoryMode: MemoryMode, isF16: boolean): string =>
  `${workloadType}|${memoryMode}|${isF16 ? 'fp16' : 'fp32'}`;

// FLOPs per shader invocation (i.e. per output element), before multiplying
// by the matrixSize x matrixSize grid. GEMM computes one output element as a
// dot product over `matrixSize` terms (1 multiply + 1 add each = 2 flops).
export const flopsPerInvocation = (workloadType: WorkloadType, matrixSize: number): number =>
  workloadType === 'alu_simd' ? ALU_FLOPS_PER_INVOCATION : 2 * matrixSize;
