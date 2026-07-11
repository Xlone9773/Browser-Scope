
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera as CameraIcon, Download, RefreshCw, Video, Square, FlipHorizontal, Activity } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';

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
  const streamRef = useRef<MediaStream | null>(null);
  const isUnmounted = useRef(false);
  
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recordingMimeType, setRecordingMimeType] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);

  const [resolution, setResolution] = useState<{width: number, height: number} | null>(null);
  const [maxResolution, setMaxResolution] = useState<{width: number, height: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stop camera function
  const stopCameraStream = useCallback(() => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
          setStream(null);
      }
  }, []);

  const handleClose = () => {
      stopCameraStream();
      onClose();
  };

  useEffect(() => {
     isUnmounted.current = false;
     return () => {
         isUnmounted.current = true;
         stopCameraStream();
     };
  }, [stopCameraStream]);

  // Get list of cameras
  const getDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId || `camera-${index}`,
          label: device.label || `Camera ${index + 1}`
        }));
      
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err: unknown) {
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
      const handleError = (e: unknown) => {
           const errObj = e instanceof Error ? e : (typeof e === 'object' && e !== null ? e as Record<string, unknown> : {});
           const errName = errObj.name || '';
           if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
               setError(t.permission_denied);
           } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
               setError(t.no_devices);
           } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
               setError(t.error_hardware);
           } else {
               setError(t.error_generic);
           }
      };

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
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

        if (isUnmounted.current) {
            localStream.getTracks().forEach(track => track.stop());
            return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          streamRef.current = localStream;
          setStream(localStream);
          setError(null);
          
          // Get track settings
          const videoTrack = localStream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          
          if (settings.width && settings.height) {
            setResolution({ width: settings.width, height: settings.height });
          }

          // Try to get capabilities for max resolution (Chrome/Edge only)
          
          if (videoTrack.getCapabilities) {
             
             const caps = videoTrack.getCapabilities();
             if (caps.width && caps.height && caps.width.max && caps.height.max) {
                 setMaxResolution({ width: caps.width.max, height: caps.height.max });
             }
          }
        }
      } catch (err: unknown) {
        console.error("Error accessing camera:", err);
        // Try without audio if it failed (maybe mic permission denied or mic not found)
        const errName = err instanceof Error ? err.name : (typeof err === 'object' && err !== null ? (err as Record<string, unknown>).name : '');
        if (errName === 'NotAllowedError' || errName === 'NotFoundError') {
             try {
                 localStream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        deviceId: { exact: selectedDeviceId },
                        width: { ideal: 3840 },
                        height: { ideal: 2160 } 
                    },
                    audio: false
                 });

                 if (isUnmounted.current) {
                     localStream.getTracks().forEach(track => track.stop());
                     return;
                 }

                 if (videoRef.current) {
                    videoRef.current.srcObject = localStream;
                    streamRef.current = localStream;
                    setStream(localStream);
                    setError(null);
                     const videoTrack = localStream.getVideoTracks()[0];
                     const settings = videoTrack.getSettings();
                     if (settings.width && settings.height) {
                         setResolution({ width: settings.width, height: settings.height });
                     }
                 }
                 return; // Successfully recovered without audio
             } catch (retryErr: unknown) {
                                  handleError(retryErr);
             }
        } else {
             handleError(err);
        }
      }
    };

    startCamera();

    return () => {
      stopCameraStream();
    };
  }, [selectedDeviceId, stopCameraStream, t.error_generic, t.error_hardware, t.no_devices, t.permission_denied]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      getDevices();
    }, 0);
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      clearTimeout(timer);
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  const getBase64Size = (base64Str: string | null): string => {
    if (!base64Str) return '';
    const parts = base64Str.split(',');
    if (parts.length < 2) return '';
    const base64Content = parts[1];
    const sizeInBytes = Math.round((base64Content.length * 3) / 4);
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB > 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
    return `${sizeInKB.toFixed(2)} KB`;
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && resolution) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const width = video.videoWidth || resolution.width;
      const height = video.videoHeight || resolution.height;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the image. If mirrored, flip it.
        if (isMirrored) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);
        // Using image/jpeg with 0.9 quality instead of PNG dramatically reduces size from ~10MB to <3MB for 13MP while keeping exceptional quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
      }
    }
  };

  const startRecording = () => {
      if (!stream) return;
      recordedChunks.current = [];
      
      // Determine supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];

      let selectedType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          break;
        }
      }
      
      if (!selectedType && MediaRecorder.isTypeSupported('video/mp4')) {
          selectedType = 'video/mp4'; // Fallback check
      }

      setRecordingMimeType(selectedType);

      try {
          const options = selectedType ? { mimeType: selectedType } : undefined;
          const recorder = new MediaRecorder(stream, options);
          
          recorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  recordedChunks.current.push(event.data);
              }
          };

          recorder.onstop = () => {
              const type = recorder.mimeType || selectedType;
              const blob = new Blob(recordedChunks.current, { type });
              const url = URL.createObjectURL(blob);
              setVideoUrl(url);
          };

          recorder.start();
          mediaRecorderRef.current = recorder;
          setIsRecording(true);
      } catch (e: unknown) {
          console.error("Recording error:", e);
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  const downloadMedia = (type: 'image' | 'video') => {
    const link = document.createElement('a');
    if (type === 'image' && image) {
      link.href = image;
      link.download = `camera-capture-${new Date().getTime()}.jpg`;
    } else if (type === 'video' && videoUrl) {
      link.href = videoUrl;
      let ext = 'webm';
      if (recordingMimeType && recordingMimeType.includes('mp4')) {
          ext = 'mp4';
      }
      link.download = `video-record-${new Date().getTime()}.${ext}`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const reset = () => {
      setImage(null);
      setVideoUrl(null);
      setRecordingMimeType('');
      if (videoUrl) URL.revokeObjectURL(videoUrl);
  };

  return (
    <Modal
        title={t.title}
        icon={<CameraIcon size={24} />}
        onClose={handleClose}
        size="2xl"
        noPadding={true}
    >
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
                   <Select 
                     value={selectedDeviceId} 
                     options={devices.map(device => ({ id: device.deviceId, label: device.label }))}
                     onChange={(val) => setSelectedDeviceId(val as string)}
                     disabled={isRecording}
                     color="indigo"
                   />
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
                        {resolution ? `${resolution.width} x ${resolution.height} (${((resolution.width * resolution.height) / 1000000).toFixed(1)} MP)` : '-'}
                     </span>
                  </div>
                  {maxResolution ? (
                    <div className="flex-1 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-slate-400">{t.max_res}</span>
                            <Activity size={10} className="text-emerald-500" />
                        </div>
                        <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {`${maxResolution.width} x ${maxResolution.height} (${((maxResolution.width * maxResolution.height) / 1000000).toFixed(1)} MP)`}
                        </span>
                    </div>
                  ) : null}
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
               <div className="relative w-full h-full">
                  <img src={image} alt="Capture" className="w-full h-full object-contain" />
                  <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-md flex flex-col gap-0.5 border border-white/10 select-none">
                     <span className="font-semibold text-[10px] text-indigo-300 uppercase tracking-wider">{t.photo_details}</span>
                     <span className="font-mono text-xs">{t.format_jpeg}</span>
                     <span className="font-mono text-xs">{t.resolution} {resolution ? `${resolution.width} x ${resolution.height} (${((resolution.width * resolution.height) / 1000000).toFixed(1)} MP)` : ''}</span>
                     <span className="font-mono text-xs font-semibold text-green-400">{t.file_size} {getBase64Size(image)}</span>
                  </div>
               </div>
            ) : videoUrl ? (
               <video 
                 controls 
                 playsInline 
                 src={videoUrl} 
                 className="w-full h-full object-contain" 
               />
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
                   {isRecording ? (
                       <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 text-white rounded-full text-xs font-bold animate-pulse">
                           <div className="w-2 h-2 bg-white rounded-full" />
                           REC
                       </div>
                   ) : null}
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
               {image ? (
                   <button 
                      onClick={() => downloadMedia('image')}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                   >
                      <Download size={18} />
                      {t.download_photo}
                   </button>
               ) : null}
               {videoUrl ? (
                   <button 
                      onClick={() => downloadMedia('video')}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                   >
                      <Download size={18} />
                      {t.download_video}
                   </button>
               ) : null}
             </>
          )}
        </div>
    </Modal>
  );
};
