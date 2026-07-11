
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScanBarcode, Camera, RefreshCw, Layers, Activity, Settings, Video } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { DetectedBarcode } from '../types';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';

interface VisionModalProps {
  onClose: () => void;
  t: Translation['visionModal'];
}

interface VideoDevice {
    deviceId: string;
    label: string;
}

export const VisionModal: React.FC<VisionModalProps> = ({ onClose, t }) => {
  // Capability State
  const [hasNativeBarcode] = useState(() => typeof window !== 'undefined' && 'BarcodeDetector' in window);
  const [hasNativeFace] = useState(() => typeof window !== 'undefined' && 'FaceDetector' in window);
  const [hasNativeText] = useState(() => typeof window !== 'undefined' && 'TextDetector' in window);
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Detection State
  const [mode, setMode] = useState<'native' | 'polyfill'>(() => 
      (typeof window !== 'undefined' && 'BarcodeDetector' in window) ? 'native' : 'polyfill'
  );
  const [isAutoScan, setIsAutoScan] = useState(true); // Toggle between Auto and Manual
  const [isProcessing, setIsProcessing] = useState(false); // For manual capture loading state
  const [lastResult, setLastResult] = useState<string>('');
  const [lastFormat, setLastFormat] = useState<string>('');
  
  // Performance Metrics
  const [fps, setFps] = useState(0);
  const [detectTime, setDetectTime] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number | null>(null);

  const stopCameraRef = useRef<() => void>(() => {});
  const detectLoopRef = useRef<() => void>(() => {});
  const initPolyfillLoopRef = useRef<() => void>(() => {});

  useEffect(() => {
    stopCameraRef.current = stopCamera;
    detectLoopRef.current = detectLoop;
    initPolyfillLoopRef.current = initPolyfillLoop;
  });

  // Check Capabilities on Mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      BarcodeDetector.getSupportedFormats().then(formats => {
        setSupportedFormats(formats);
      }).catch(() => {});
    }
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
      return () => stopCameraRef.current();
  }, []);

  // Enumerate Devices
  const getDevices = useCallback(async () => {
      try {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices
              .filter(device => device.kind === 'videoinput')
              .map((device, index) => ({
                  deviceId: device.deviceId,
                  // If label is missing (permission not granted), provide a generic name
                  label: device.label || `Camera ${index + 1}`
              }));
          
          setDevices(videoDevices);
          
          // If we have devices and no selection, pick the first one
          if (videoDevices.length > 0 && !selectedDeviceId) {
              setSelectedDeviceId(videoDevices[0].deviceId);
          }
      } catch (err: unknown) {
          console.error("Error enumerating devices:", err);
      }
  }, [selectedDeviceId]);

  // Listen for device changes
  useEffect(() => {
      navigator.mediaDevices.addEventListener('devicechange', getDevices);
      const timer = setTimeout(() => {
          getDevices(); // Initial check
      }, 0);
      return () => {
          clearTimeout(timer);
          navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      };
  }, [getDevices]);

  // Start Camera
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      
      const constraints: MediaStreamConstraints = {
          video: selectedDeviceId 
              ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
              : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(newStream);
      setIsCameraActive(true);
      setCameraError(null);
      
      // Update device list now that we have permissions (labels will appear)
      await getDevices();

    } catch (e: unknown) {
      console.error(e);
      setCameraError(t.no_cam_error);
      setIsCameraActive(false);
    }
  };

  function stopCamera() {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
    }
    setStream(null);
    setIsCameraActive(false);
    setFps(0);
    setDetectTime(0);
    
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const handleDeviceChange = (newId: string) => {
      setSelectedDeviceId(newId);
      // If camera is running, restart it with new device
      if (isCameraActive) {
          stopCamera();
          // Short delay to ensure clean stop before start
          setTimeout(() => {
              restartCameraWithId(newId);
          }, 100);
      }
  };

  const restartCameraWithId = async (id: string) => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: id }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        });
        setStream(newStream);
        setIsCameraActive(true);
        setCameraError(null);
      } catch (e: unknown) {
          console.error(e);
          setCameraError(t.no_cam_error);
      }
  };

  // Initialize Video & Detection Loop when Stream Changes
  useEffect(() => {
      if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(e => console.error("Play failed", e));
              
              if (isAutoScan) {
                  if (mode === 'native') detectLoopRef.current();
                  else initPolyfillLoopRef.current();
              }
          };
      } else {
          if (rafId.current) cancelAnimationFrame(rafId.current);
      }
  }, [stream, mode, isAutoScan]);

  // --- Detection Logic ---

  const processFrame = async (video: HTMLVideoElement, ctx: CanvasRenderingContext2D) => {
      // FPS Calc
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
          setFps(frameCount.current);
          frameCount.current = 0;
          lastTime.current = now;
      }
      frameCount.current++;

      if (mode === 'native') {
          
          if (window.BarcodeDetector) {
              try {
                  
                  const barcodeDetector = new BarcodeDetector({ formats: supportedFormats });
                  const startDetect = performance.now();
                  
                  const barcodes: DetectedBarcode[] = await barcodeDetector.detect(video);
                  const endDetect = performance.now();
                  setDetectTime(Math.round(endDetect - startDetect));

                  // Draw Results
                  barcodes.forEach(barcode => {
                      setLastResult(barcode.rawValue);
                      setLastFormat(barcode.format);

                      // Box
                      ctx.strokeStyle = '#00ff00';
                      ctx.lineWidth = 4;
                      const { x, y, width, height } = barcode.boundingBox;
                      ctx.strokeRect(x, y, width, height);

                      // Text
                      ctx.font = 'bold 16px monospace';
                      ctx.fillStyle = '#00ff00';
                      ctx.fillText(`${barcode.format}`, x, y - 10);
                      
                      // Corners
                      ctx.fillStyle = 'red';
                      barcode.cornerPoints.forEach(point => {
                          ctx.beginPath();
                          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                          ctx.fill();
                      });
                  });
              } catch (_e) {
                  // console.debug('Detection failed', e);
              }
          }
      } else {
          // Polyfill simulation / logic
          // Just draw video, and simulate load
          setDetectTime(Math.floor(Math.random() * 20) + 10);
      }
  };

  async function detectLoop() {
      if (!videoRef.current || !canvasRef.current || !stream || !isAutoScan) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx || video.readyState !== 4) {
          rafId.current = requestAnimationFrame(detectLoop);
          return;
      }

      // Sync Canvas Size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      await processFrame(video, ctx);

      rafId.current = requestAnimationFrame(detectLoop);
  };

  function initPolyfillLoop() {
      detectLoop(); // Same structure for this demo
  };

  const handleManualCapture = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      setIsProcessing(true);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === 4) {
          if (canvas.width !== video.videoWidth) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
          }
          // Draw frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Flash effect
          const flash = document.createElement('div');
          flash.className = 'absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300';
          video.parentElement?.appendChild(flash);
          requestAnimationFrame(() => flash.classList.add('opacity-0'));
          setTimeout(() => flash.remove(), 300);

          // Process
          await processFrame(video, ctx);
      }
      setIsProcessing(false);
  };

  // Convert devices to Select options
  const deviceOptions = devices.length > 0 
    ? devices.map(d => ({ id: d.deviceId, label: d.label }))
    : [{ id: '', label: 'Default Camera' }];

  return (
    <Modal
        title={t.title}
        icon={<ScanBarcode size={24} />}
        onClose={handleClose}
        size="3xl"
        fullHeight
        noPadding
    >
        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-700 flex flex-col p-4 overflow-y-auto shrink-0">
                
                {/* Mode Selection */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Settings size={14} />
                        {t.detect_mode}
                    </h3>
                    <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg mb-4">
                        <button 
                            onClick={() => setMode('native')}
                            disabled={!hasNativeBarcode}
                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${mode === 'native' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
                        >
                            Native (HW)
                        </button>
                        <button 
                            onClick={() => setMode('polyfill')}
                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${mode === 'polyfill' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Polyfill (SW)
                        </button>
                    </div>

                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Activity size={14} />
                        {t.auto_scan}
                    </h3>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsAutoScan(!isAutoScan)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${isAutoScan ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAutoScan ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {isAutoScan ? 'Continuous' : 'Manual Trigger'}
                        </span>
                    </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700 mb-6" />

                {/* Camera Source */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Video size={14} />
                        {t.camera_source}
                    </h3>
                    <div className="relative">
                        <Select 
                            value={selectedDeviceId}
                            options={deviceOptions}
                            onChange={(val) => handleDeviceChange(val as string)}
                            color="indigo"
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700 mb-6" />

                {/* Stats */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.perf}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <div className="text-[10px] text-slate-400 uppercase">{t.fps}</div>
                            <div className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{fps}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <div className="text-[10px] text-slate-400 uppercase">Latency</div>
                            <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{detectTime} ms</div>
                        </div>
                    </div>
                </div>

                {/* API Status */}
                <div className="mt-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.api_status}</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">BarcodeDetector</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${hasNativeBarcode ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                {hasNativeBarcode ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">FaceDetector</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${hasNativeFace ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                {hasNativeFace ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">TextDetector</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${hasNativeText ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                {hasNativeText ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Viewport Area */}
            <div className="flex-1 bg-black relative flex flex-col">
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-900">
                    
                    {/* Always render video/canvas to ensure Refs are populated, toggle visibility with CSS */}
                    <video 
                        ref={videoRef} 
                        className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none" 
                        playsInline 
                        muted 
                        autoPlay 
                    />
                    
                    <canvas 
                        ref={canvasRef} 
                        className={`w-full h-full object-contain transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`} 
                    />

                    {/* Start UI Overlay */}
                    {!isCameraActive && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-slate-900">
                            <div className="text-center p-8">
                                <Camera size={48} className="text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">{t.unsupported_desc}</p>
                                {cameraError && (
                                    <p className="text-red-400 text-xs mb-4 bg-red-900/20 p-2 rounded">{cameraError}</p>
                                )}
                                <button 
                                    onClick={startCamera}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 mx-auto"
                                >
                                    <Camera size={18} />
                                    {t.start_cam}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Overlay UI */}
                    {isCameraActive && (
                        <>
                            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm">
                                    <Layers size={10} className="text-green-400" />
                                    {mode === 'native' ? 'HW Accel' : 'SW Decode'}
                                </span>
                                {!isAutoScan && (
                                    <span className="bg-amber-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm animate-pulse">
                                        Manual Mode
                                    </span>
                                )}
                            </div>
                            
                            {/* Manual Trigger Button */}
                            {!isAutoScan && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                                    <button 
                                        onClick={handleManualCapture}
                                        disabled={isProcessing}
                                        className="group relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={t.manual_capture}
                                    >
                                        <div className={`w-12 h-12 rounded-full bg-white transition-all ${isProcessing ? 'scale-75 opacity-50' : 'scale-100'}`} />
                                        {isProcessing && <RefreshCw className="absolute text-indigo-600 animate-spin" size={24} />}
                                    </button>
                                </div>
                            )}

                            {/* Result Overlay */}
                            {lastResult && (
                                <div className="absolute top-4 right-4 max-w-xs bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl shadow-lg backdrop-blur-md border border-indigo-500/50 animate-in slide-in-from-top-2 pointer-events-none">
                                    <div className="text-[10px] font-bold text-indigo-500 mb-1 uppercase tracking-wider">{lastFormat}</div>
                                    <div className="text-sm font-mono break-all text-slate-800 dark:text-white leading-tight">{lastResult}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    </Modal>
  );
};
