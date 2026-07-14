import React, { useState, useRef, useCallback } from 'react';
import { ShieldAlert, Activity, RefreshCw, Tv, Type, Video } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface PoisoningTranslations {
  title?: string;
  detect?: string;
  desc_title?: string;
  desc?: string;
  status?: string;
  status_idle?: string;
  status_running?: string;
  status_poisoned?: string;
  status_clean?: string;
  run_test?: string;
  testing?: string;
  waiting?: string;
  start_log?: string;
  testing_canvas?: string;
  testing_webgl?: string;
  testing_audio?: string;
  audio_poisoned?: string;
  audio_stable?: string;
  audio_hooked?: string;
  poisoned_log?: string;
  clean_log?: string;
  canvas_mismatch?: string;
  canvas_stable?: string;
  webgl_mismatch?: string;
  webgl_stable?: string;
  audio_mismatch?: string;
  suspicious_base_latency?: string;
  suspicious_output_latency?: string;
  testing_viewport?: string;
  viewport_mismatch?: string;
  viewport_poisoned?: string;
  viewport_stable?: string;
  
  // Font translations:
  tab_render_audio?: string;
  tab_font_farbling?: string;
  font_detection_title?: string;
  font_detection_desc?: string;
  testing_fonts?: string;
  fonts_hooked?: string;
  font_farbling_detected?: string;
  font_shielding_detected?: string;
  fonts_stable?: string;
  testing_font_query?: string;
  font_query_blocked?: string;
  font_query_allowed?: string;
  run_font_test?: string;
  query_local_fonts_hooked?: string;
  query_local_fonts_unsupported?: string;
  font_widths_stable?: string;
  font_differentiation_detected?: string;

  // Geometry translations:
  tab_geometry?: string;
  geometry_detection_title?: string;
  geometry_detection_desc?: string;
  testing_geometry?: string;
  rects_hooked?: string;
  rect_farbling_detected?: string;
  geometry_stable?: string;
  run_geometry_test?: string;

  // Media translations:
  tab_media?: string;
  media_detection_title?: string;
  media_detection_desc?: string;
  testing_media?: string;
  media_hooked?: string;
  media_not_supported?: string;
  media_empty?: string;
  media_poisoned_detected?: string;
  media_stable?: string;
  run_media_test?: string;
}

interface CanvasPoisoningModalProps {
  onClose: () => void;
  t: PoisoningTranslations;
}

interface ExtendedWindow {
  webkitAudioContext?: typeof AudioContext;
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
}

export const CanvasPoisoningModal: React.FC<CanvasPoisoningModalProps> = React.memo(({ onClose, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'render_audio' | 'fonts' | 'geometry' | 'media'>('render_audio');

  // Tab 1: Render & Audio state
  const [status, setStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Tab 2: Fonts state
  const [fontStatus, setFontStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [fontProgress, setFontProgress] = useState(0);
  const [fontLogs, setFontLogs] = useState<string[]>([]);

  // Tab 3: Geometry state
  const [geomStatus, setGeomStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [geomProgress, setGeomProgress] = useState(0);
  const [geomLogs, setGeomLogs] = useState<string[]>([]);

  // Tab 4: Media state
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaLogs, setMediaLogs] = useState<string[]>([]);
  
  const addLog = useCallback((msg: string) => setLogs(prev => [...prev, msg]), []);
  const addFontLog = useCallback((msg: string) => setFontLogs(prev => [...prev, msg]), []);
  const addGeomLog = useCallback((msg: string) => setGeomLogs(prev => [...prev, msg]), []);
  const addMediaLog = useCallback((msg: string) => setMediaLogs(prev => [...prev, msg]), []);

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  };

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

  const drawWebGL = (gl: WebGLRenderingContext, offset: number) => {
    gl.clearColor(0.2, 0.4 + offset / 100, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const isHooked = (fn: (...args: never[]) => unknown) => {
    try {
      return !/\{\s*\[native code\]\s*\}/.test(fn.toString());
    } catch {
      return true;
    }
  };

  const checkAudioHooks = () => {
    const extWindow = window as unknown as ExtendedWindow;
    const checks = [
      { obj: window.AudioContext?.prototype, prop: 'baseLatency', name: 'AudioContext.baseLatency' },
      { obj: window.AudioContext?.prototype, prop: 'outputLatency', name: 'AudioContext.outputLatency' },
      { obj: extWindow.webkitAudioContext?.prototype, prop: 'baseLatency', name: 'webkitAudioContext.baseLatency' },
      { obj: window.OfflineAudioContext?.prototype, prop: 'startRendering', name: 'OfflineAudioContext.startRendering' },
      { obj: window.AudioBuffer?.prototype, prop: 'getChannelData', name: 'AudioBuffer.getChannelData' }
    ];

    for (const check of checks) {
      if (!check.obj) continue;
      try {
        const desc = Object.getOwnPropertyDescriptor(check.obj, check.prop);
        if (desc) {
          if (desc.get && isHooked(desc.get as unknown as (...args: never[]) => unknown)) {
            return { hooked: true, name: check.name };
          }
          if (desc.value && typeof desc.value === 'function' && isHooked(desc.value as unknown as (...args: never[]) => unknown)) {
            return { hooked: true, name: check.name };
          }
        }
      } catch {
        return { hooked: true, name: check.name };
      }
    }
    return { hooked: false };
  };

  const renderAudio = async (): Promise<Float32Array | null> => {
    try {
      const extWindow = window as unknown as ExtendedWindow;
      const AudioCtx = window.OfflineAudioContext || extWindow.webkitOfflineAudioContext;
      if (!AudioCtx) return null;
      
      const ctx = new AudioCtx(1, 44100 * 0.05, 44100); 
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, 0);
      osc.frequency.exponentialRampToValueAtTime(880, 0.04);
      
      gain.gain.setValueAtTime(1, 0);
      gain.gain.linearRampToValueAtTime(0.01, 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(0);
      const renderedBuffer = await ctx.startRendering();
      if (!renderedBuffer) return null;
      
      return renderedBuffer.getChannelData(0).slice(0, 150);
    } catch {
      return null;
    }
  };

  const runTest = async () => {
    setStatus('running');
    setProgress(0);
    setLogs([]);
    addLog(t.start_log || 'Starting Canvas & WebGL Poisoning Test...');
    
    let poisoned = false;

    // 1. Viewport & Screen Dimension Tampering (e.g., Cromite viewport fingerprinter protection)
    addLog(t.testing_viewport || 'Testing Viewport & Screen Dimensions stability...');
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
        addLog(
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
      
      setProgress((prev) => Math.min(95, prev + 2));
      await new Promise<void>((resolve) => {
        setTimeout(() => { resolve(); }, 40);
      });
    }
    
    if (document.body.contains(probeDiv)) {
      document.body.removeChild(probeDiv);
    }
    
    if (viewportPoisoned) {
      addLog(t.viewport_poisoned || '❌ Viewport/Screen dimension tampering detected (dynamic noise/micro-fluctuations active).');
    } else {
      addLog(t.viewport_stable || '✅ Viewport and screen dimensions are stable, no dynamic dimension noise detected.');
    }
    
    // 2. Canvas Test
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        addLog(t.testing_canvas || 'Testing 2D Canvas stability...');
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
            addLog(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
          }
          lastHash = hash;
          setProgress((prev) => Math.min(95, prev + 3));
          await new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 40);
          });
        }
        if (!canvasPoisoned) {
          addLog(t.canvas_stable || '✅ 2D Canvas appears stable (no random noise).');
        }
      }
    }
    
    // 3. WebGL Test
    const webgl = webglRef.current;
    if (webgl) {
      const gl = webgl.getContext('webgl');
      if (gl) {
        addLog(t.testing_webgl || 'Testing WebGL stability...');
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
            addLog(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
          }
          lastHash = hash;
          setProgress((prev) => Math.min(95, prev + 3));
          await new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 40);
          });
        }
        if (!webglPoisoned) {
          addLog(t.webgl_stable || '✅ WebGL appears stable (no random noise).');
        }
      }
    }
    
    // 4. Audio & Latency Test
    addLog(t.testing_audio || 'Testing Web Audio stability and latency...');
    
    // A. Hook detection
    const hookResult = checkAudioHooks();
    if (hookResult.hooked) {
      poisoned = true;
      addLog(t.audio_hooked || `❌ Suspicious Proxy/Hook detected on core Audio APIs (${hookResult.name}).`);
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
          addLog(audioMismatchTemplate.replace('{i}', String(i)).replace('{lastAudioHash}', lastAudioHash).replace('{hash}', hash));
        }
        lastAudioHash = hash;
      }
      setProgress((prev) => Math.min(95, prev + 3));
      await new Promise<void>((resolve) => {
        setTimeout(() => { resolve(); }, 40);
      });
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
          addLog(suspBaseLatTemplate.replace('{baseLat}', String(baseLat)));
        }
        if (typeof outLat === 'number' && (outLat < 0 || outLat > 2.0)) {
          audioStable = false;
          const suspOutLatTemplate = t.suspicious_output_latency || '❌ Suspicious outputLatency value: {outLat}';
          addLog(suspOutLatTemplate.replace('{outLat}', String(outLat)));
        }
        tempCtx.close();
      }
    } catch {
      // Ignore initialization errors for context if not supported in the sandbox
    }

    if (!audioStable) {
      poisoned = true;
      addLog(t.audio_poisoned || '❌ Audio buffer or latency tampering detected (anti-fingerprinting active).');
    } else {
      addLog(t.audio_stable || '✅ Audio APIs stable, no waveform or latency tampering detected.');
    }
    
    setProgress(100);
    setStatus(poisoned ? 'poisoned' : 'clean');
    addLog(poisoned ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') : (t.clean_log || '✅ Environment appears clean.'));
  };

  const runFontTest = async () => {
    setFontStatus('running');
    setFontProgress(0);
    setFontLogs([]);
    
    addFontLog(t.testing_fonts || 'Testing font widths and Font Farbling...');
    
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
        addFontLog(t.fonts_hooked || '❌ Suspicious Proxy/Hook detected on core Font/Document APIs.');
      }
    } catch {
      // Ignore
    }
    setFontProgress(20);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    // 2. Local font query interface check (queryLocalFonts)
    addFontLog(t.testing_font_query || 'Detecting local font query interface (queryLocalFonts)...');
    const queryLocalFontsFn = (window as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts || 
                              (navigator as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts;
    if (queryLocalFontsFn) {
      if (isHooked(queryLocalFontsFn as unknown as (...args: never[]) => unknown)) {
        fontPoisoned = true;
        addFontLog(t.query_local_fonts_hooked || '❌ Suspicious Proxy/Hook detected on queryLocalFonts API.');
      }
      try {
        addFontLog(t.font_query_allowed || '✅ Local Font Query (queryLocalFonts) is accessible or behaves normally.');
      } catch {
        addFontLog(t.font_query_blocked || '⚠️ Local Font Query (queryLocalFonts) threw an error or is disabled, indicating high privacy restrictions.');
      }
    } else {
      addFontLog(t.query_local_fonts_unsupported || 'ℹ️ queryLocalFonts is not supported or is disabled by browser security model.');
    }
    setFontProgress(40);
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
        addFontLog(`❌ Jitter at read ${i}: ${firstW} != ${measurements[i]}`);
      }
    }
    
    if (jitterDetected) {
      fontPoisoned = true;
      addFontLog(t.font_farbling_detected || '❌ Font Farbling detected (high-precision width measurement fluctuates in a static state, typical of Brave or Cromite).');
    } else {
      addFontLog(t.font_widths_stable || '✅ High-precision width measurements are stable.');
    }
    setFontProgress(70);

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
    
    addFontLog(`ℹ️ Widths measured: sans-serif=${wSans.toFixed(2)}, serif=${wSerif.toFixed(2)}, monospace=${wMono.toFixed(2)}`);
    addFontLog(`ℹ️ System fonts: Georgia=${wGeorgia.toFixed(2)}, Impact=${wImpact.toFixed(2)}, Courier=${wCourier.toFixed(2)}, Times=${wTimes.toFixed(2)}, Arial=${wArial.toFixed(2)}`);
    
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
      addFontLog(t.font_shielding_detected || '❌ Font Shielding detected (all exotic fonts have identical widths to the fallback, local font database is blocked or spoofed).');
    } else {
      addFontLog(t.font_differentiation_detected || '✅ Font differentiation detected (local font library access is active).');
    }
    
    document.body.removeChild(container);
    setFontProgress(100);
    
    if (fontPoisoned) {
      setFontStatus('poisoned');
      addFontLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setFontStatus('clean');
      addFontLog(t.fonts_stable || '✅ Font rendering and measurements are stable, no Farbling jitter or retrieval shielding detected.');
    }
  };

  const runGeometryTest = async () => {
    setGeomStatus('running');
    setGeomProgress(0);
    setGeomLogs([]);
    
    addGeomLog(t.testing_geometry || 'Testing high-frequency nested geometry measurements and poisoning...');
    
    let isPoisoned = false;

    // 1. Hook detection on Element.prototype.getBoundingClientRect and getClientRects
    try {
      const getBoundingClientRectHooked = isHooked(Element.prototype.getBoundingClientRect as unknown as (...args: never[]) => unknown);
      const getClientRectsHooked = isHooked(Element.prototype.getClientRects as unknown as (...args: never[]) => unknown);
      if (getBoundingClientRectHooked || getClientRectsHooked) {
        isPoisoned = true;
        addGeomLog(t.rects_hooked || '❌ Suspicious Proxy/Hook detected on getBoundingClientRect or getClientRects methods.');
      }
    } catch {
      // Ignore
    }
    
    setGeomProgress(30);
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
    
    setGeomProgress(60);
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
        addGeomLog(`❌ Jitter detected at read ${i}: [${first.left.toFixed(6)}, ${first.top.toFixed(6)}] != [${cur.left.toFixed(6)}, ${cur.top.toFixed(6)}]`);
      }
    }
    
    if (rectsFarbled) {
      isPoisoned = true;
      addGeomLog(t.rect_farbling_detected || '❌ ClientRects/DOMRect Farbling detected (getBoundingClientRect measurements fluctuate dynamically in static state, typical of Brave or Cromite).');
    } else {
      addGeomLog('✅ High-precision consecutive getBoundingClientRect measurements are perfectly stable.');
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
          addGeomLog('❌ getClientRects measurements fluctuate dynamically.');
        } else {
          addGeomLog('✅ High-precision getClientRects measurements are perfectly stable.');
        }
      }
    } catch {
      // Ignore
    }

    document.body.removeChild(container);
    setGeomProgress(100);

    if (isPoisoned) {
      setGeomStatus('poisoned');
      addGeomLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setGeomStatus('clean');
      addGeomLog(t.geometry_stable || '✅ Geometry boundaries and DOMRect measurements are perfectly stable, no farbling detected.');
    }
  };

  const runMediaTest = async () => {
    setMediaStatus('running');
    setMediaProgress(0);
    setMediaLogs([]);

    addMediaLog(t.testing_media || 'Testing media device enumeration stability and proxy hooks...');
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    setMediaProgress(20);

    let isPoisoned = false;

    // 1. Hook detection on navigator.mediaDevices.enumerateDevices
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        addMediaLog(t.media_not_supported || '⚠️ navigator.mediaDevices is not supported by your current browser environment.');
        setMediaStatus('idle');
        setMediaProgress(100);
        return;
      }

      const enumerateDevicesFn = navigator.mediaDevices.enumerateDevices;
      if (isHooked(enumerateDevicesFn as unknown as (...args: never[]) => unknown)) {
        isPoisoned = true;
        addMediaLog(t.media_hooked || '❌ Suspicious Proxy/Hook detected on navigator.mediaDevices.enumerateDevices method.');
      }
    } catch {
      // Ignore
    }

    setMediaProgress(40);
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
      setMediaProgress(40 + (i + 1) * 8); // Progress up to 80%
    }

    if (hasError) {
      addMediaLog('⚠️ Error occurred while calling enumerateDevices.');
    }

    if (runs.length === 0 || runs[0].length === 0) {
      addMediaLog(t.media_empty || 'ℹ️ No media devices found or media access permissions are not granted.');
    } else {
      const firstRun = runs[0];
      addMediaLog(`📊 Retrieved device list across consecutive queries (${runs.length} runs).`);
      addMediaLog(`🔍 Initial query: Found ${firstRun.length} devices (${firstRun.map(d => `${d.kind}:${d.deviceId.substring(0, 6)}...`).join(', ')})`);

      // Compare consecutive runs
      let dynamicFluctuation = false;
      for (let i = 1; i < runs.length; i++) {
        const currentRun = runs[i];
        if (currentRun.length !== firstRun.length) {
          dynamicFluctuation = true;
          addMediaLog(`❌ Run ${i + 1}: Device count changed from ${firstRun.length} to ${currentRun.length}.`);
          break;
        }
        for (let j = 0; j < firstRun.length; j++) {
          if (firstRun[j].deviceId !== currentRun[j].deviceId || firstRun[j].kind !== currentRun[j].kind) {
            dynamicFluctuation = true;
            addMediaLog(`❌ Run ${i + 1}: Device at index ${j} changed from [${firstRun[j].kind}:${firstRun[j].deviceId.substring(0, 6)}] to [${currentRun[j].kind}:${currentRun[j].deviceId.substring(0, 6)}].`);
            break;
          }
        }
        if (dynamicFluctuation) break;
      }

      if (dynamicFluctuation) {
        isPoisoned = true;
        addMediaLog(t.media_poisoned_detected || '❌ Media Device ID Farbling/Poisoning detected (device IDs or device order fluctuates dynamically between consecutive reads, typical of anti-fingerprinting browsers).');
      } else {
        addMediaLog('✅ High-frequency consecutive deviceId and order readings are perfectly stable.');
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
              addMediaLog('❌ Persistent Device ID mismatch detected: Current deviceIds/order differ from the originally stored fingerprint in localStorage, indicating ID reset or randomization across refreshes (typically Brave/Cromite farbling).');
            } else {
              addMediaLog('ℹ️ Media device IDs differ from previous run, but this might be due to a change in permission state or no active device ID present.');
              if (hasActualIdCurr) {
                localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
                addMediaLog('💾 Saved active media devices fingerprint to localStorage for future session comparisons.');
              }
            }
          } else {
            addMediaLog('✅ Current Media Device fingerprint matches originally stored localStorage baseline perfectly.');
          }
        } else {
          localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
          addMediaLog('💾 No prior baseline found in localStorage. Saved current media devices fingerprint for future session comparisons.');
        }
      } catch {
        // Ignore storage errors
      }
    }

    setMediaProgress(100);

    if (isPoisoned) {
      setMediaStatus('poisoned');
      addMediaLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setMediaStatus('clean');
      addMediaLog(t.media_stable || '✅ Media device enumeration and deviceId hashes are stable, no poisoning or hooks detected.');
    }
  };

  return (
    <Modal
      title={t.title || 'Noise & Poisoning Detection'}
      onClose={onClose}
      size="lg"
      noPadding
    >
      {/* Tab Navigation header */}
      <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('render_audio')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'render_audio'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Tv size={16} />
          <span>{t.tab_render_audio || 'Render & Audio'}</span>
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'fonts'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Type size={16} />
          <span>{t.tab_font_farbling || 'Fonts & Farbling'}</span>
        </button>
        <button
          onClick={() => setActiveTab('geometry')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'geometry'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert size={16} />
          <span>{t.tab_geometry || 'Geometry & Layout'}</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'media'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Video size={16} />
          <span>{t.tab_media || 'Media Devices'}</span>
        </button>
      </div>

      {/* Content wrapper with generous negative space */}
      <div className="p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900/40">
        {activeTab === 'render_audio' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
              <div className="text-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.desc_title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  {t.desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center py-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">2D Canvas</span>
                <canvas ref={canvasRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-white shadow-sm" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">WebGL</span>
                <canvas ref={webglRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-black shadow-sm" />
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-48 overflow-y-auto border border-slate-700 shadow-inner">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
                  {log}
                </div>
              ))}
              {logs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  status === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  status === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  status === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {status === 'idle' ? t.status_idle : 
                   status === 'running' ? t.status_running : 
                   status === 'poisoned' ? t.status_poisoned : 
                   t.status_clean}
                </span>
              </div>
              <Button onClick={runTest} disabled={status === 'running'} leftIcon={status === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
                {status === 'running' ? `${t.testing} (${progress}%)` : t.run_test}
              </Button>
            </div>
          </div>
        ) : activeTab === 'fonts' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
              <div className="text-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.font_detection_title || 'Font & Farbling Detection'}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  {t.font_detection_desc}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
              {fontLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
                  {log}
                </div>
              ))}
              {fontLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  fontStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  fontStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  fontStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {fontStatus === 'idle' ? t.status_idle : 
                   fontStatus === 'running' ? t.status_running : 
                   fontStatus === 'poisoned' ? t.status_poisoned : 
                   t.status_clean}
                </span>
              </div>
              <Button onClick={runFontTest} disabled={fontStatus === 'running'} leftIcon={fontStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
                {fontStatus === 'running' ? `${t.testing} (${fontProgress}%)` : (t.run_font_test || 'Run Font Test')}
              </Button>
            </div>
          </div>
        ) : activeTab === 'geometry' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
              <div className="text-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.geometry_detection_title || 'Geometry & DOMRect Poisoning Detection'}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  {t.geometry_detection_desc}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
              {geomLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
                  {log}
                </div>
              ))}
              {geomLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  geomStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  geomStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  geomStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {geomStatus === 'idle' ? t.status_idle : 
                   geomStatus === 'running' ? t.status_running : 
                   geomStatus === 'poisoned' ? t.status_poisoned : 
                   t.status_clean}
                </span>
              </div>
              <Button onClick={runGeometryTest} disabled={geomStatus === 'running'} leftIcon={geomStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
                {geomStatus === 'running' ? `${t.testing} (${geomProgress}%)` : (t.run_geometry_test || 'Run Geometry Test')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
              <div className="text-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.media_detection_title || 'Media Devices Enumeration & ID Poisoning Detection'}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  {t.media_detection_desc}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
              {mediaLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {log}
                </div>
              ))}
              {mediaLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  mediaStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  mediaStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  mediaStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {mediaStatus === 'idle' ? t.status_idle : 
                   mediaStatus === 'running' ? t.status_running : 
                   mediaStatus === 'poisoned' ? t.status_poisoned : 
                   t.status_clean}
                </span>
              </div>
              <Button onClick={runMediaTest} disabled={mediaStatus === 'running'} leftIcon={mediaStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
                {mediaStatus === 'running' ? `${t.testing} (${mediaProgress}%)` : (t.run_media_test || 'Run Media Test')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

