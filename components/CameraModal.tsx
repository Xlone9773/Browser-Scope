import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Camera as CameraIcon, Download, RefreshCw, Image as ImageIcon, Video, Square, FlipHorizontal, Activity } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface CameraModalProps {
  onClose: () => void;
  t: Translation['cameraTool'];
}

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);

  const [resolution, setResolution] = useState<{width: number, height: number} | null>(null);
  const [maxResolution, setMaxResolution] = useState<{width: number, height: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Get list of cameras
  const getDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`
        }));
      
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
      setError(t.no_devices);
    }
  }, [selectedDeviceId, t.no_devices]);

  // Start video stream
  useEffect(() => {
    if (!selectedDeviceId) return;

    let localStream: MediaStream | null = null;

    const startCamera = async () => {
      // Helper to map error to message
      const handleError = (e: any) => {
           if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
               setError(t.permission_denied);
           } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
               setError(t.no_devices);
           } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
               setError(t.error_hardware);
           } else {
               setError(t.error_generic);
           }
      };

      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        // Request audio as well for recording
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 3840 },
            height: { ideal: 2160 } 
          },
          audio: true 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          setStream(localStream);
          setError(null);
          
          // Get track settings
          const videoTrack = localStream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          
          if (settings.width && settings.height) {
            setResolution({ width: settings.width, height: settings.height });
          }

          // Try to get capabilities for max resolution (Chrome/Edge only)
          // @ts-ignore
          if (videoTrack.getCapabilities) {
             // @ts-ignore
             const caps = videoTrack.getCapabilities();
             if (caps.width && caps.height && caps.width.max && caps.height.max) {
                 setMaxResolution({ width: caps.width.max, height: caps.height.max });
             }
          }
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        // Try without audio if it failed (maybe mic permission denied or mic not found)
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
             try {
                 localStream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        deviceId: { exact: selectedDeviceId },
                        width: { ideal: 3840 },
                        height: { ideal: 2160 } 
                    },
                    audio: false
                 });
                 if (videoRef.current) {
                    videoRef.current.srcObject = localStream;
                    setStream(localStream);
                    setError(null);
                     const videoTrack = localStream.getVideoTracks()[0];
                     const settings = videoTrack.getSettings();
                     if (settings.width && settings.height) {
                         setResolution({ width: settings.width, height: settings.height });
                     }
                 }
                 return; // Successfully recovered without audio
             } catch (retryErr: any) {
                 handleError(retryErr);
             }
        } else {
            handleError(err);
        }
      }
    };

    startCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId]);

  // Initial load
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && resolution) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = resolution.width;
      canvas.height = resolution.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the image. If mirrored, flip it.
        if (isMirrored) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, resolution.width, resolution.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
      }
    }
  };

  const startRecording = () => {
      if (!stream) return;
      recordedChunks.current = [];
      const options = { mimeType: 'video/webm' };
      
      try {
          const recorder = new MediaRecorder(stream, options);
          
          recorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  recordedChunks.current.push(event.data);
              }
          };

          recorder.onstop = () => {
              const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
              const url = URL.createObjectURL(blob);
              setVideoUrl(url);
          };

          recorder.start();
          mediaRecorderRef.current = recorder;
          setIsRecording(true);
      } catch (e) {
          console.error("Recording error:", e);
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  const downloadMedia = (type: 'image' | 'video') => {
    const link = document.createElement('a');
    if (type === 'image' && image) {
      link.href = image;
      link.download = `camera-capture-${new Date().getTime()}.png`;
    } else if (type === 'video' && videoUrl) {
      link.href = videoUrl;
      link.download = `video-record-${new Date().getTime()}.webm`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const reset = () => {
      setImage(null);
      setVideoUrl(null);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
      isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CameraIcon className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          
          {/* Top Controls */}
          {!image && !videoUrl && (
            <div className="flex flex-col md:flex-row gap-4 mb-4">
               <div className="flex-1">
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                   {t.select_device}
                 </label>
                 <div className="relative">
                   <select 
                     value={selectedDeviceId} 
                     onChange={(e) => setSelectedDeviceId(e.target.value)}
                     className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                     disabled={isRecording}
                   >
                     {devices.map(device => (
                       <option key={device.deviceId} value={device.deviceId}>
                         {device.label}
                       </option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <RefreshCw size={14} />
                   </div>
                 </div>
               </div>
               
               {/* Resolution Info */}
               <div className="flex-1 flex gap-4">
                  <div className="flex-1 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                     <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-400">{t.current_res}</span>
                        <span className="flex relative h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                     </div>
                     <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {resolution ? `${resolution.width} x ${resolution.height}` : '-'}
                     </span>
                  </div>
                  {maxResolution && (
                    <div className="flex-1 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-slate-400">{t.max_res}</span>
                            <Activity size={10} className="text-emerald-500" />
                        </div>
                        <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {`${maxResolution.width} x ${maxResolution.height}`}
                        </span>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Viewport */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center group">
            {error ? (
              <div className="text-red-400 text-center p-4">
                <p>{error}</p>
              </div>
            ) : image ? (
               <img src={image} alt="Capture" className="w-full h-full object-contain" />
            ) : videoUrl ? (
               <video controls src={videoUrl} className="w-full h-full object-contain" />
            ) : (
               <>
                   <video 
                     ref={videoRef} 
                     autoPlay 
                     playsInline 
                     muted // Mute locally to prevent feedback loop during recording
                     className="w-full h-full object-contain transition-transform duration-300"
                     style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
                   />
                   {isRecording && (
                       <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 text-white rounded-full text-xs font-bold animate-pulse">
                           <div className="w-2 h-2 bg-white rounded-full" />
                           REC
                       </div>
                   )}
                   {/* Mirror Toggle Overlay */}
                   <button 
                       onClick={() => setIsMirrored(!isMirrored)}
                       className="absolute top-4 left-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                       title={t.mirror}
                   >
                       <FlipHorizontal size={20} />
                   </button>
               </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-center gap-4">
          {!image && !videoUrl ? (
             <div className="flex gap-4">
                 <button 
                    onClick={captureImage}
                    disabled={!!error || isRecording}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                    <CameraIcon size={20} />
                    {t.take_photo}
                 </button>
                 
                 {!isRecording ? (
                     <button 
                        onClick={startRecording}
                        disabled={!!error}
                        className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <Video size={20} />
                        {t.start_record}
                     </button>
                 ) : (
                    <button 
                        onClick={stopRecording}
                        className="px-6 py-3 bg-slate-800 text-white rounded-full font-semibold shadow-lg hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2"
                     >
                        <Square size={20} fill="currentColor" />
                        {t.stop_record}
                     </button>
                 )}
             </div>
          ) : (
             <>
               <button 
                  onClick={reset}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
               >
                  <RefreshCw size={18} />
                  {t.retake}
               </button>
               {image && (
                   <button 
                      onClick={() => downloadMedia('image')}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                   >
                      <Download size={18} />
                      {t.download_photo}
                   </button>
               )}
               {videoUrl && (
                   <button 
                      onClick={() => downloadMedia('video')}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                   >
                      <Download size={18} />
                      {t.download_video}
                   </button>
               )}
             </>
          )}
        </div>
      </div>
    </div>
  );
};