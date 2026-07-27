// Multi-threaded CPU stress benchmark worker. Runs a dependent chain of
// scalar FMA-style updates in fixed-size batches, yielding back to the event
// loop between batches (via setTimeout) so a 'stop' message can actually be
// processed — a tight synchronous while(true) loop would starve the worker's
// own message queue and never see it.

// Each loop iteration runs 5 unrolled blocks of 8 `x = x * a + b` statements
// (40 statements total), each statement being 1 multiply + 1 add = 2 flops.
const FLOPS_PER_LOOP_ITERATION = 40 * 2;
const BATCH_ITERATIONS = 40000;

let isRunning = false;

function runBatch() {
  if (!isRunning) return;

  let x0 = 1.0, x1 = 1.1, x2 = 1.2, x3 = 1.3, x4 = 1.4, x5 = 1.5, x6 = 1.6, x7 = 1.7;

  for (let i = 0; i < BATCH_ITERATIONS; i++) {
    x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
    x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
    x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
    x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

    x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
    x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
    x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
    x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

    x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
    x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
    x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
    x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

    x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
    x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
    x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
    x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

    x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
    x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
    x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
    x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;
  }

  // Keep the compiler from treating the loop as dead code, without the cost
  // of a real postMessage payload per iteration.
  if (x0 === Infinity) console.log(x0, x1, x2, x3, x4, x5, x6, x7);

  self.postMessage({ cmd: 'progress', ops: BATCH_ITERATIONS * FLOPS_PER_LOOP_ITERATION });

  if (isRunning) {
    setTimeout(runBatch, 0);
  }
}

self.onmessage = (e: MessageEvent) => {
  if (e.data?.cmd === 'stop') {
    isRunning = false;
    return;
  }
  if (e.data?.cmd === 'start') {
    isRunning = true;
    runBatch();
  }
};
