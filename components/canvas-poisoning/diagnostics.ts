// src/components/canvas-poisoning/diagnostics.ts

import { PoisoningTranslations, ExtendedWindow } from './types';
import { isHooked, hashString, checkAudioHooks, renderAudio } from './utils';

export interface DiagnosticResult {
  status: 'clean' | 'poisoned';
  logs: string[];
}

export interface BenchmarkResult {
  concurrency: number;
  ops: number;
  speedup: number;
}

const workerCode = `
  self.onmessage = function(e) {
    const duration = e.data || 50;
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < duration) {
      ops += Math.sin(ops) + Math.cos(ops);
    }
    self.postMessage(ops);
  };
`;

// Helper for drawing 2D canvas in the same way as RenderAudioTab
const drawCanvas = (ctx: CanvasRenderingContext2D, offset: number) => {
  ctx.clearRect(0, 0, 200, 50);
  const gradient = ctx.createLinearGradient(0, 0, 200, 50);
  gradient.addColorStop(0, '#ff0000');
  gradient.addColorStop(0.5, '#00ff00');
  gradient.addColorStop(1, '#0000ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px "Arial", sans-serif';
  ctx.fillText('Noise Test ' + offset, 10, 30);
  ctx.beginPath();
  ctx.arc(150, 25, 10, 0, Math.PI * 2);
  ctx.stroke();
};

// Helper for drawing WebGL
const drawWebGL = (gl: WebGLRenderingContext, offset: number) => {
  gl.clearColor(0.2, 0.4 + offset / 100, 0.6, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * 1. Geometry & DOMRect Diagnostics
 */
export const runGeometryDiagnostic = async (
  t: PoisoningTranslations,
  onLog: (msg: string) => void,
  onProgress: (p: number) => void
): Promise<DiagnosticResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    onLog(msg);
  };

  log(t.testing_geometry || 'Testing high-frequency nested geometry measurements and poisoning...');
  onProgress(0);

  let isPoisoned = false;

  // 1. Hook detection on Element.prototype.getBoundingClientRect and getClientRects
  try {
    const getBoundingClientRectHooked = isHooked(Element.prototype.getBoundingClientRect as unknown as (...args: never[]) => unknown);
    const getClientRectsHooked = isHooked(Element.prototype.getClientRects as unknown as (...args: never[]) => unknown);
    if (getBoundingClientRectHooked || getClientRectsHooked) {
      isPoisoned = true;
      log(t.rects_hooked || '❌ Suspicious Proxy/Hook detected on getBoundingClientRect or getClientRects methods.');
    }
  } catch {
    // Ignore
  }

  onProgress(30);
  await new Promise<void>(resolve => setTimeout(resolve, 50));

  // 2. High-frequency boundary measurements on nested graphics and 3D CSS transformed elements
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 500px;
    height: 500px;
    perspective: 1000px;
    transform-style: preserve-3d;
    visibility: hidden;
    pointer-events: none;
  `;

  const nested3D = document.createElement('div');
  nested3D.style.cssText = `
    width: 100%;
    height: 100%;
    transform: rotateX(45deg) rotateY(30deg) translateZ(50px);
    transform-style: preserve-3d;
  `;

  const svgNS = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(svgNS, "svg");
  svgEl.setAttribute("width", "300");
  svgEl.setAttribute("height", "300");
  svgEl.style.cssText = "transform: scale(1.5) translate3d(10px, 20px, 30px);";

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M10 10 H 90 V 90 H 10 Z");
  path.setAttribute("fill", "blue");
  svgEl.appendChild(path);

  nested3D.appendChild(svgEl);
  container.appendChild(nested3D);
  document.body.appendChild(container);

  onProgress(60);
  await new Promise<void>(resolve => setTimeout(resolve, 50));

  const measurements: { left: number; top: number; width: number; height: number }[] = [];
  let rectsFarbled = false;

  for (let i = 0; i < 15; i++) {
    const r = path.getBoundingClientRect();
    measurements.push({ left: r.left, top: r.top, width: r.width, height: r.height });
    await new Promise<void>(resolve => setTimeout(resolve, 10));
  }

  const first = measurements[0];
  for (let i = 1; i < measurements.length; i++) {
    const cur = measurements[i];
    if (
      Math.abs(cur.left - first.left) > 0.00001 ||
      Math.abs(cur.top - first.top) > 0.00001 ||
      Math.abs(cur.width - first.width) > 0.00001 ||
      Math.abs(cur.height - first.height) > 0.00001
    ) {
      rectsFarbled = true;
      log((t.geometry_jitter_log || '❌ Jitter detected at read {i}: [{firstLeft}, {firstTop}] != [{curLeft}, {curTop}]').replace('{i}', String(i)).replace('{firstLeft}', first.left.toFixed(6)).replace('{firstTop}', first.top.toFixed(6)).replace('{curLeft}', cur.left.toFixed(6)).replace('{curTop}', cur.top.toFixed(6)));
    }
  }

  if (rectsFarbled) {
    isPoisoned = true;
    log(t.rect_farbling_detected || '❌ ClientRects/DOMRect Farbling detected (getBoundingClientRect measurements fluctuate dynamically in static state, typical of Brave or Cromite).');
  } else {
    log(t.getBoundingClientRect_stable || '✅ High-precision consecutive getBoundingClientRect measurements are perfectly stable.');
  }

  try {
    const clientRectsList = path.getClientRects();
    if (clientRectsList.length > 0) {
      const clientRectsMeasurements: { left: number; top: number }[] = [];
      let clientRectsFarbled = false;
      for (let i = 0; i < 15; i++) {
        const list = path.getClientRects();
        if (list.length > 0) {
          clientRectsMeasurements.push({ left: list[0].left, top: list[0].top });
        }
        await new Promise<void>(resolve => setTimeout(resolve, 10));
      }

      const firstCR = clientRectsMeasurements[0];
      for (let i = 1; i < clientRectsMeasurements.length; i++) {
        const curCR = clientRectsMeasurements[i];
        if (Math.abs(curCR.left - firstCR.left) > 0.00001 || Math.abs(curCR.top - firstCR.top) > 0.00001) {
          clientRectsFarbled = true;
        }
      }
      if (clientRectsFarbled) {
        isPoisoned = true;
        log(t.getClientRects_mismatch || '❌ getClientRects measurements fluctuate dynamically.');
      } else {
        log(t.getClientRects_stable || '✅ High-precision getClientRects measurements are perfectly stable.');
      }
    }
  } catch {
    // Ignore
  }

  document.body.removeChild(container);
  onProgress(100);

  if (isPoisoned) {
    log(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
  } else {
    log(t.geometry_stable || '✅ Geometry boundaries and DOMRect measurements are perfectly stable, no farbling detected.');
  }

  return {
    status: isPoisoned ? 'poisoned' : 'clean',
    logs
  };
};

/**
 * 2. Fonts & Font Farbling Diagnostics
 */
export const runFontDiagnostic = async (
  t: PoisoningTranslations,
  onLog: (msg: string) => void,
  onProgress: (p: number) => void
): Promise<DiagnosticResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    onLog(msg);
  };

  log(t.testing_fonts || 'Testing font widths and Font Farbling...');
  onProgress(0);

  let fontPoisoned = false;

  // 1. Hook detection on document.fonts
  try {
    const fontsProto = Object.getPrototypeOf(document.fonts);
    const isForEachHooked = isHooked(document.fonts.forEach as unknown as (...args: never[]) => unknown) || 
                            (fontsProto && isHooked(fontsProto.forEach as unknown as (...args: never[]) => unknown));
    const isValuesHooked = isHooked(document.fonts.values as unknown as (...args: never[]) => unknown) || 
                           (fontsProto && isHooked(fontsProto.values as unknown as (...args: never[]) => unknown));
    if (isForEachHooked || isValuesHooked) {
      fontPoisoned = true;
      log(t.fonts_hooked || '❌ Suspicious Proxy/Hook detected on core Font/Document APIs.');
    }
  } catch {
    // Ignore
  }
  onProgress(20);
  await new Promise<void>(resolve => setTimeout(resolve, 50));

  // 2. Local font query interface check (queryLocalFonts)
  log(t.testing_font_query || 'Detecting local font query interface (queryLocalFonts)...');
  const queryLocalFontsFn = (window as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts || 
                            (navigator as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts;
  if (queryLocalFontsFn) {
    if (isHooked(queryLocalFontsFn as unknown as (...args: never[]) => unknown)) {
      fontPoisoned = true;
      log(t.query_local_fonts_hooked || '❌ Suspicious Proxy/Hook detected on queryLocalFonts API.');
    }
    try {
      log(t.font_query_allowed || '✅ Local Font Query (queryLocalFonts) is accessible or behaves normally.');
    } catch {
      log(t.font_query_blocked || '⚠️ Local Font Query (queryLocalFonts) threw an error or is disabled, indicating high privacy restrictions.');
    }
  } else {
    log(t.query_local_fonts_unsupported || 'ℹ️ queryLocalFonts is not supported or is disabled by browser security model.');
  }
  onProgress(40);
  await new Promise<void>(resolve => setTimeout(resolve, 50));

  // 3. High-precision font width fluctuation (Font Farbling Jitter)
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:nowrap;font-size:72px;font-family:"Times New Roman", Times, serif;';
  const span = document.createElement('span');
  span.textContent = 'Farbling Jitter Check: High-Precision Font Widths Fluctuation Testing !!! @#$%^&*()';
  container.appendChild(span);
  document.body.appendChild(container);

  const measurements: number[] = [];
  let jitterDetected = false;

  for (let i = 0; i < 15; i++) {
    const rect = span.getBoundingClientRect();
    measurements.push(rect.width);
    await new Promise<void>(resolve => setTimeout(resolve, 15));
  }

  const firstW = measurements[0];
  for (let i = 1; i < measurements.length; i++) {
    if (Math.abs(measurements[i] - firstW) > 0.00001) {
      jitterDetected = true;
      log('❌ ' + (t.font_jitter_log || 'Jitter at read {i}: {firstW} != {currentW}').replace('{i}', String(i)).replace('{firstW}', String(firstW)).replace('{currentW}', String(measurements[i])));
    }
  }

  if (jitterDetected) {
    fontPoisoned = true;
    log(t.font_farbling_detected || '❌ Font Farbling detected (high-precision width measurement fluctuates in a static state, typical of Brave or Cromite).');
  } else {
    log(t.font_widths_stable || '✅ High-precision width measurements are stable.');
  }
  onProgress(70);

  // 4. All-font equal width anomaly detection (Font Shielding)
  const measureFont = (family: string) => {
    const testSpan = document.createElement('span');
    testSpan.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    testSpan.style.fontFamily = family;
    container.appendChild(testSpan);
    const width = testSpan.getBoundingClientRect().width;
    container.removeChild(testSpan);
    return width;
  };

  const wSans = measureFont('sans-serif');
  const wSerif = measureFont('serif');
  const wMono = measureFont('monospace');

  const wGeorgia = measureFont('Georgia, serif');
  const wImpact = measureFont('Impact, sans-serif');
  const wCourier = measureFont('Courier New, monospace');
  const wTimes = measureFont('Times New Roman, serif');
  const wArial = measureFont('Arial, sans-serif');
  const wFake = measureFont('NonexistentFakeFontAlphaOmega, sans-serif');

  log((t.widths_measured_log || 'ℹ️ Widths measured: sans-serif={sans}, serif={serif}, monospace={mono}').replace('{sans}', wSans.toFixed(2)).replace('{serif}', wSerif.toFixed(2)).replace('{mono}', wMono.toFixed(2)));
  log((t.system_fonts_log || 'ℹ️ System fonts: Georgia={georgia}, Impact={impact}, Courier={courier}, Times={times}, Arial={arial}').replace('{georgia}', wGeorgia.toFixed(2)).replace('{impact}', wImpact.toFixed(2)).replace('{courier}', wCourier.toFixed(2)).replace('{times}', wTimes.toFixed(2)).replace('{arial}', wArial.toFixed(2)));

  const hasDifferentSystemFonts = (wGeorgia !== wFake) || (wImpact !== wFake) || (wCourier !== wFake) || (wTimes !== wFake);

  let shieldingDetected = false;
  if (!hasDifferentSystemFonts) {
    if (wSans === wSerif && wSans === wMono) {
      shieldingDetected = true;
    } else {
      shieldingDetected = true;
    }
  }

  if (shieldingDetected) {
    fontPoisoned = true;
    log(t.font_shielding_detected || '❌ Font Shielding detected (all exotic fonts have identical widths to the fallback, local font database is blocked or spoofed).');
  } else {
    log(t.font_differentiation_detected || '✅ Font differentiation detected (local font library access is active).');
  }

  document.body.removeChild(container);
  onProgress(100);

  if (fontPoisoned) {
    log(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
  } else {
    log(t.fonts_stable || '✅ Font rendering and measurements are stable, no Farbling jitter or retrieval shielding detected.');
  }

  return {
    status: fontPoisoned ? 'poisoned' : 'clean',
    logs
  };
};

/**
 * 3. Media Devices Enumeration & ID Poisoning Diagnostics
 */
export const runMediaDiagnostic = async (
  t: PoisoningTranslations,
  onLog: (msg: string) => void,
  onProgress: (p: number) => void
): Promise<DiagnosticResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    onLog(msg);
  };

  log(t.testing_media || 'Testing media device enumeration stability and proxy hooks...');
  onProgress(0);
  await new Promise<void>(resolve => setTimeout(resolve, 50));
  onProgress(20);

  let isPoisoned = false;

  // 1. Hook detection on navigator.mediaDevices.enumerateDevices
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      log(t.media_not_supported || '⚠️ navigator.mediaDevices is not supported by your current browser environment.');
      onProgress(100);
      return {
        status: 'clean',
        logs
      };
    }

    const enumerateDevicesFn = navigator.mediaDevices.enumerateDevices;
    if (isHooked(enumerateDevicesFn as unknown as (...args: never[]) => unknown)) {
      isPoisoned = true;
      log(t.media_hooked || '❌ Suspicious Proxy/Hook detected on navigator.mediaDevices.enumerateDevices method.');
    }
  } catch {
    // Ignore
  }

  onProgress(40);
  await new Promise<void>(resolve => setTimeout(resolve, 50));

  // 2. Query enumerateDevices multiple times to check for dynamic randomization/ordering changes (Farbling)
  interface SimpleDevice {
    kind: string;
    deviceId: string;
    label: string;
  }
  const runs: SimpleDevice[][] = [];
  let hasError = false;

  for (let i = 0; i < 5; i++) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      runs.push(devices.map(d => ({ kind: d.kind, deviceId: d.deviceId, label: d.label })));
    } catch {
      hasError = true;
    }
    await new Promise<void>(resolve => setTimeout(resolve, 30));
    onProgress(40 + (i + 1) * 8); // Progress up to 80%
  }

  if (hasError) {
    log(t.media_error || '⚠️ Error occurred while calling enumerateDevices.');
  }

  if (runs.length === 0 || runs[0].length === 0) {
    log(t.media_empty || 'ℹ️ No media devices found or media access permissions are not granted.');
  } else {
    const firstRun = runs[0];
    log((t.media_runs_log || '📊 Retrieved device list across consecutive queries ({count} runs).').replace('{count}', String(runs.length)));
    log((t.media_initial_query_log || '🔍 Initial query: Found {count} devices ({devices})').replace('{count}', String(firstRun.length)).replace('{devices}', firstRun.map(d => `${d.kind}:${d.deviceId.substring(0, 6)}...`).join(', ')));

    // Compare consecutive runs
    let dynamicFluctuation = false;
    for (let i = 1; i < runs.length; i++) {
      const currentRun = runs[i];
      if (currentRun.length !== firstRun.length) {
        dynamicFluctuation = true;
        log((t.media_run_count_changed || '❌ Run {i}: Device count changed from {firstCount} to {currentCount}.').replace('{i}', String(i + 1)).replace('{firstCount}', String(firstRun.length)).replace('{currentCount}', String(currentRun.length)));
        break;
      }
      for (let j = 0; j < firstRun.length; j++) {
        if (firstRun[j].deviceId !== currentRun[j].deviceId || firstRun[j].kind !== currentRun[j].kind) {
          dynamicFluctuation = true;
          log((t.media_run_device_changed || '❌ Run {i}: Device at index {index} changed from [{firstKind}:{firstId}] to [{currentKind}:{currentId}].').replace('{i}', String(i + 1)).replace('{index}', String(j)).replace('{firstKind}', firstRun[j].kind).replace('{firstId}', firstRun[j].deviceId.substring(0, 6)).replace('{currentKind}', currentRun[j].kind).replace('{currentId}', currentRun[j].deviceId.substring(0, 6)));
          break;
        }
      }
      if (dynamicFluctuation) break;
    }

    if (dynamicFluctuation) {
      isPoisoned = true;
      log(t.media_poisoned_detected || '❌ Media Device ID Farbling/Poisoning detected (device IDs or device order fluctuates dynamically between consecutive reads, typical of anti-fingerprinting browsers).');
    } else {
      log(t.media_stable_reading || '✅ High-frequency consecutive deviceId and order readings are perfectly stable.');
    }

    // 3. Persistent ID comparison via localStorage (设备 ID 固化比对)
    try {
      const serializedFirstRun = JSON.stringify(firstRun.map(d => ({ kind: d.kind, deviceId: d.deviceId })));
      const storedFirstRun = localStorage.getItem('browserscope_first_media_devices');
      if (storedFirstRun) {
        const parsedStored: { kind: string; deviceId: string }[] = JSON.parse(storedFirstRun);
        let match = true;
        if (parsedStored.length !== firstRun.length) {
          match = false;
        } else {
          for (let j = 0; j < firstRun.length; j++) {
            if (parsedStored[j].deviceId !== firstRun[j].deviceId || parsedStored[j].kind !== firstRun[j].kind) {
              match = false;
              break;
            }
          }
        }

        if (!match) {
          const hasActualIdPrev = parsedStored.some(d => d.deviceId && d.deviceId !== 'default');
          const hasActualIdCurr = firstRun.some(d => d.deviceId && d.deviceId !== 'default');
          
          if (hasActualIdPrev && hasActualIdCurr) {
            isPoisoned = true;
            log(t.media_persistent_mismatch || '❌ Persistent Device ID mismatch detected: Current deviceIds/order differ from the originally stored fingerprint in localStorage, indicating ID reset or randomization across refreshes (typically Brave/Cromite farbling).');
          } else {
            log(t.media_persistent_info_changed || 'ℹ️ Media device IDs differ from previous run, but this might be due to a change in permission state or no active device ID present.');
            if (hasActualIdCurr) {
              localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
              log(t.media_persistent_saved || '💾 Saved active media devices fingerprint to localStorage for future session comparisons.');
            }
          }
        } else {
          log(t.media_persistent_match || '✅ Current Media Device fingerprint matches originally stored localStorage baseline perfectly.');
        }
      } else {
        localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
        log(t.media_persistent_no_baseline || '💾 No prior baseline found in localStorage. Saved current media devices fingerprint for future session comparisons.');
      }
    } catch {
      // Ignore storage errors
    }
  }

  onProgress(100);

  if (isPoisoned) {
    log(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
  } else {
    log(t.media_stable || '✅ Media device enumeration and deviceId hashes are stable, no poisoning or hooks detected.');
  }

  return {
    status: isPoisoned ? 'poisoned' : 'clean',
    logs
  };
};

/**
 * 4. Render & Audio Diagnostics (Includes Viewport, Canvas, WebGL, Web Audio)
 */
export const runRenderAudioDiagnostic = async (
  t: PoisoningTranslations,
  onLog: (msg: string) => void,
  onProgress: (p: number) => void,
  canvasElement?: HTMLCanvasElement | null,
  webglElement?: HTMLCanvasElement | null
): Promise<DiagnosticResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    onLog(msg);
  };

  log(t.start_log || 'Starting Canvas & WebGL Poisoning Test...');
  onProgress(0);

  let poisoned = false;

  // 1. Viewport & Screen Dimension Tampering (e.g., Cromite viewport fingerprinter protection)
  log(t.testing_viewport || 'Testing Viewport & Screen Dimensions stability...');
  let viewportPoisoned = false;
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  let lastAvailW = screen.availWidth;
  let lastAvailH = screen.availHeight;

  // Create a temporary hidden full-viewport element to check clientWidth / clientHeight stability
  const probeDiv = document.createElement('div');
  probeDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none;z-index:-9999;';
  document.body.appendChild(probeDiv);
  let lastDivW = probeDiv.clientWidth;
  let lastDivH = probeDiv.clientHeight;

  for (let i = 0; i < 10; i++) {
    const currentW = window.innerWidth;
    const currentH = window.innerHeight;
    const currentAvailW = screen.availWidth;
    const currentAvailH = screen.availHeight;
    const currentDivW = probeDiv.clientWidth;
    const currentDivH = probeDiv.clientHeight;

    if (
      currentW !== lastW || 
      currentH !== lastH || 
      currentAvailW !== lastAvailW || 
      currentAvailH !== lastAvailH ||
      currentDivW !== lastDivW ||
      currentDivH !== lastDivH
    ) {
      viewportPoisoned = true;
      poisoned = true;
      log(
        `${t.viewport_mismatch || '❌ Viewport dimension fluctuation detected:'} ` +
        `[W:${lastW}, H:${lastH}, Div:${lastDivW}x${lastDivH}, Avail:${lastAvailW}x${lastAvailH}] -> ` +
        `[W:${currentW}, H:${currentH}, Div:${currentDivW}x${currentDivH}, Avail:${currentAvailW}x${currentAvailH}]`
      );
    }
    lastW = currentW;
    lastH = currentH;
    lastAvailW = currentAvailW;
    lastAvailH = currentAvailH;
    lastDivW = currentDivW;
    lastDivH = currentDivH;

    onProgress(Math.min(95, (i + 1) * 3));
    await new Promise<void>((resolve) => setTimeout(resolve, 40));
  }

  if (document.body.contains(probeDiv)) {
    document.body.removeChild(probeDiv);
  }

  if (viewportPoisoned) {
    log(t.viewport_poisoned || '❌ Viewport/Screen dimension tampering detected (dynamic noise/micro-fluctuations active).');
  } else {
    log(t.viewport_stable || '✅ Viewport and screen dimensions are stable, no dynamic dimension noise detected.');
  }

  // 2. Canvas Test (use passed element or create a temporary offscreen one)
  const canvas = canvasElement || document.createElement('canvas');
  if (canvas) {
    if (!canvasElement) {
      canvas.width = 200;
      canvas.height = 50;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      log(t.testing_canvas || 'Testing 2D Canvas stability...');
      let lastHash = '';
      let canvasPoisoned = false;
      for (let i = 0; i < 10; i++) {
        drawCanvas(ctx, 0);
        const dataURL = canvas.toDataURL();
        const hash = hashString(dataURL);
        if (i > 0 && hash !== lastHash) {
          canvasPoisoned = true;
          poisoned = true;
          const mismatchTemplate = t.canvas_mismatch || '❌ 2D Canvas mismatch at iteration {i}: {lastHash} != {hash}';
          log(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
        }
        lastHash = hash;
        onProgress(Math.min(95, 30 + i * 3));
        await new Promise<void>((resolve) => setTimeout(resolve, 40));
      }
      if (!canvasPoisoned) {
        log(t.canvas_stable || '✅ 2D Canvas appears stable (no random noise).');
      }
    }
  }

  // 3. WebGL Test (use passed element or create a temporary offscreen one)
  const webgl = webglElement || document.createElement('canvas');
  if (webgl) {
    if (!webglElement) {
      webgl.width = 200;
      webgl.height = 50;
    }
    const gl = webgl.getContext('webgl');
    if (gl) {
      log(t.testing_webgl || 'Testing WebGL stability...');
      let lastHash = '';
      let webglPoisoned = false;
      for (let i = 0; i < 10; i++) {
        drawWebGL(gl, 0);
        const dataURL = webgl.toDataURL();
        const hash = hashString(dataURL);
        if (i > 0 && hash !== lastHash) {
          webglPoisoned = true;
          poisoned = true;
          const mismatchTemplate = t.webgl_mismatch || '❌ WebGL mismatch at iteration {i}: {lastHash} != {hash}';
          log(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
        }
        lastHash = hash;
        onProgress(Math.min(95, 60 + i * 3));
        await new Promise<void>((resolve) => setTimeout(resolve, 40));
      }
      if (!webglPoisoned) {
        log(t.webgl_stable || '✅ WebGL appears stable (no random noise).');
      }
    }
  }

  // 4. Audio & Latency Test
  log(t.testing_audio || 'Testing Web Audio stability and latency...');

  // A. Hook detection
  const hookResult = checkAudioHooks();
  if (hookResult.hooked) {
    poisoned = true;
    log(t.audio_hooked || `❌ Suspicious Proxy/Hook detected on core Audio APIs (${hookResult.name}).`);
  }

  // B. Dynamic rendering noise detection
  let lastAudioHash = '';
  let audioStable = true;
  for (let i = 0; i < 10; i++) {
    const samples = await renderAudio();
    if (samples) {
      let sampleStr = '';
      for (let s = 0; s < samples.length; s += 5) {
        sampleStr += samples[s].toFixed(5) + ',';
      }
      const hash = hashString(sampleStr);
      if (i > 0 && hash !== lastAudioHash) {
        audioStable = false;
        const audioMismatchTemplate = t.audio_mismatch || '❌ Audio buffer mismatch at iteration {i}: {lastAudioHash} != {hash}';
        log(audioMismatchTemplate.replace('{i}', String(i)).replace('{lastAudioHash}', lastAudioHash).replace('{hash}', hash));
      }
      lastAudioHash = hash;
    }
    onProgress(Math.min(95, 80 + i * 1.5));
    await new Promise<void>((resolve) => setTimeout(resolve, 40));
  }

  // C. Latency bounds check
  try {
    const extWindow = window as unknown as ExtendedWindow;
    const AudioContextClass = window.AudioContext || extWindow.webkitAudioContext;
    if (AudioContextClass) {
      const tempCtx = new AudioContextClass();
      const baseLat = tempCtx.baseLatency;
      const outLat = tempCtx.outputLatency;

      if (typeof baseLat === 'number' && (baseLat < 0 || baseLat > 2.0)) {
        audioStable = false;
        const suspBaseLatTemplate = t.suspicious_base_latency || '❌ Suspicious baseLatency value: {baseLat}';
        log(suspBaseLatTemplate.replace('{baseLat}', String(baseLat)));
      }
      if (typeof outLat === 'number' && (outLat < 0 || outLat > 2.0)) {
        audioStable = false;
        const suspOutLatTemplate = t.suspicious_output_latency || '❌ Suspicious outputLatency value: {outLat}';
        log(suspOutLatTemplate.replace('{outLat}', String(outLat)));
      }
      tempCtx.close();
    }
  } catch {
    // Ignore context initialization errors
  }

  if (!audioStable) {
    poisoned = true;
    log(t.audio_poisoned || '❌ Audio buffer or latency tampering detected (anti-fingerprinting active).');
  } else {
    log(t.audio_stable || '✅ Audio APIs stable, no waveform or latency tampering detected.');
  }

  onProgress(100);
  log(poisoned ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') : (t.clean_log || '✅ Environment appears clean.'));

  return {
    status: poisoned ? 'poisoned' : 'clean',
    logs
  };
};

/**
 * 5. Hardware Specifications & Concurrency Diagnostics
 */
export const runHardwareDiagnostic = async (
  t: PoisoningTranslations,
  onLog: (msg: string) => void,
  onProgress: (p: number) => void,
  onBenchmarkData?: (data: BenchmarkResult[]) => void,
  onCoresDetected?: (cores: number) => void
): Promise<DiagnosticResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    onLog(msg);
  };

  log(t.testing_hardware || 'Initializing Core Hardware Spec & Concurrency Detection...');
  onProgress(0);
  await new Promise<void>(resolve => setTimeout(resolve, 50));
  onProgress(5);

  let isPoisoned = false;

  // 1. Hook detection on hardwareConcurrency and deviceMemory
  try {
    const hcProto = Object.getPrototypeOf(navigator);
    const isHcHooked = isHooked(Object.getOwnPropertyDescriptor(hcProto, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown) ||
                        isHooked(Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown);
    const isDmHooked = isHooked(Object.getOwnPropertyDescriptor(hcProto, 'deviceMemory')?.get as unknown as (...args: never[]) => unknown) ||
                        isHooked(Object.getOwnPropertyDescriptor(navigator, 'deviceMemory')?.get as unknown as (...args: never[]) => unknown);
    if (isHcHooked || isDmHooked) {
      isPoisoned = true;
      log(t.hardware_concurrency_hooked || '❌ Suspicious Proxy/Hook detected on hardwareConcurrency or deviceMemory properties.');
    }
  } catch {
    // Ignore
  }

  const declaredCores = navigator.hardwareConcurrency || 1;
  const declaredMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0;

  const unknownText = t.hardware_unknown_spec || 'Unknown';
  const memoryString = declaredMemory ? `${declaredMemory} ${t.hardware_memory_gb || 'GB'}` : unknownText;
  const declaredLog = (t.hardware_declared_specs || '📊 Declared Specs: CPU Cores = {cores}, Memory = {memory}')
    .replace('{cores}', String(declaredCores))
    .replace('{memory}', memoryString);
  log(declaredLog);

  // 2. Concurrency tests using multi-threading Web Workers
  if (!window.Worker) {
    log(t.hardware_workers_not_supported || '⚠️ Web Workers are not supported in this browser, skipping benchmark.');
    onProgress(100);
    return {
      status: isPoisoned ? 'poisoned' : 'clean',
      logs
    };
  }

  const concurrencyLevels = [1, 2, 4, 8, 12, 16];
  const durationMs = 60; // 60ms duration per run to ensure reliable sampling
  const tempResults: BenchmarkResult[] = [];
  let baseOps = 1;

  // Run parallel worker loads for each concurrency level
  for (let cIdx = 0; cIdx < concurrencyLevels.length; cIdx++) {
    const c = concurrencyLevels[cIdx];
    const stepProgress = 10 + Math.floor((cIdx / concurrencyLevels.length) * 80);
    onProgress(stepProgress);

    const levelTemplate = t.hardware_testing_concurrency || 'Benchmarking with Web Worker concurrency: {concurrency}...';
    log(levelTemplate.replace('{concurrency}', String(c)));

    const runConcurrency = (C: number, duration: number): Promise<number> => {
      return new Promise((resolve) => {
        const workers: Worker[] = [];
        let completedCount = 0;
        let totalOps = 0;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        for (let i = 0; i < C; i++) {
          const worker = new Worker(workerUrl);
          worker.onmessage = (e) => {
            totalOps += e.data;
            completedCount++;
            worker.terminate();
            if (completedCount === C) {
              URL.revokeObjectURL(workerUrl);
              resolve(totalOps);
            }
          };
          worker.onerror = () => {
            completedCount++;
            worker.terminate();
            if (completedCount === C) {
              URL.revokeObjectURL(workerUrl);
              resolve(totalOps);
            }
          };
          workers.push(worker);
        }
        
        // Trigger execution
        workers.forEach(w => w.postMessage(duration));
      });
    };

    const ops = await runConcurrency(c, durationMs);
    if (c === 1) {
      baseOps = ops || 1;
    }
    const speedup = ops / baseOps;
    tempResults.push({ concurrency: c, ops, speedup });
    
    const compLog = (t.hardware_concurrency_completed || '   -> Concurrency {concurrency}: Completed {ops} ops, Relative speedup: {speedup}x')
      .replace('{concurrency}', String(c))
      .replace('{ops}', ops.toLocaleString())
      .replace('{speedup}', speedup.toFixed(2));
    log(compLog);
    await new Promise<void>(resolve => setTimeout(resolve, 30));
  }

  if (onBenchmarkData) {
    onBenchmarkData(tempResults);
  }
  onProgress(90);

  // Inflection point / saturation detection logic
  const maxSpeedupResult = tempResults.reduce((max, r) => r.speedup > max.speedup ? r : max, tempResults[0]);
  const maxSpeedup = maxSpeedupResult.speedup;
  const threshold = maxSpeedup * 0.82;

  let detected = 1;
  for (const r of tempResults) {
    if (r.speedup >= threshold) {
      detected = r.concurrency;
      break;
    }
  }

  // Refining based on real core counts
  if (detected === 12 && maxSpeedupResult.concurrency === 16 && maxSpeedupResult.speedup > 10) {
    detected = 16;
  } else if (detected === 8 && maxSpeedupResult.concurrency === 12 && maxSpeedupResult.speedup > 8) {
    detected = 12;
  } else if (detected === 4 && maxSpeedupResult.concurrency === 8 && maxSpeedupResult.speedup > 5.5) {
    detected = 8;
  } else if (detected === 2 && maxSpeedupResult.concurrency === 4 && maxSpeedupResult.speedup > 2.8) {
    detected = 4;
  }

  if (onCoresDetected) {
    onCoresDetected(detected);
  }

  const benchmarkCompleteLog = (t.hardware_benchmark_complete || '📈 Multi-threading Benchmark Complete. Max speedup: {speedup}x, Calculated saturation threshold: ~{detected} threads.')
    .replace('{speedup}', maxSpeedup.toFixed(2))
    .replace('{detected}', String(detected));
  log(benchmarkCompleteLog);

  // Spoofing Verification
  if (maxSpeedup >= declaredCores * 1.35 && declaredCores <= 8) {
    isPoisoned = true;
    const suspiciousTemplate = t.hardware_concurrency_suspicious || '❌ Concurrency mismatch detected: Declared cores is {declared}, but real multithreading benchmark achieved {detected}x speedup. navigator.hardwareConcurrency is spoofed (manually restricted/hardcoded).';
    log(suspiciousTemplate.replace('{declared}', String(declaredCores)).replace('{detected}', maxSpeedup.toFixed(1)));
  } else if (declaredCores >= 8 && detected <= 4 && maxSpeedup < 4.5) {
    isPoisoned = true;
    const performanceCappedLog = (t.hardware_performance_capped || '❌ Performance severely capped: Declared CPU cores is {declared}, but speedup saturated early at ~{detected} cores with max speedup of {speedup}x. Core count specifications are inconsistent with actual compute capabilities.')
      .replace('{declared}', String(declaredCores))
      .replace('{detected}', String(detected))
      .replace('{speedup}', maxSpeedup.toFixed(1));
    log(performanceCappedLog);
  } else {
    log(t.hardware_concurrency_normal || '✅ Multi-threaded scaling performance matches declared CPU core count.');
  }

  onProgress(100);

  if (isPoisoned) {
    log(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
  } else {
    log(t.hardware_concurrency_normal || '✅ Multi-threaded scaling performance matches declared CPU core count.');
  }

  return {
    status: isPoisoned ? 'poisoned' : 'clean',
    logs
  };
};
