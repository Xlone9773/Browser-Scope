
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Download, Play, Pause, RefreshCw, Activity } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface AudioRecorderModalProps {
  onClose: () => void;
  t: Translation['audioTool'];
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({ onClose, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isUnmounted = useRef(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New info states
  const [fileSize, setFileSize] = useState<string>('');
  const [sampleRate, setSampleRate] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>('');

  const stopAudioTracks = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
              track.stop();
              track.enabled = false;
          });
          streamRef.current = null;
      }
      setStream(null);
  };

  const handleClose = () => {
    stopAudioTracks();
    onClose();
  };

  useEffect(() => {
     isUnmounted.current = false;
     return () => {
         isUnmounted.current = true;
         stopAudioTracks();
     };
  }, []);

  // Timer for duration
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio Playback Listener
  useEffect(() => {
      const player = audioPlayerRef.current;
      if (player) {
          const onEnded = () => setIsPlaying(false);
          const onPause = () => setIsPlaying(false);
          const onPlay = () => setIsPlaying(true);
          
          player.addEventListener('ended', onEnded);
          player.addEventListener('pause', onPause);
          player.addEventListener('play', onPlay);
          
          return () => {
              player.removeEventListener('ended', onEnded);
              player.removeEventListener('pause', onPause);
              player.removeEventListener('play', onPlay);
          }
      }
  }, [audioUrl]);

  // Visualizer Loop
  const isVisualizerActiveRef = useRef(false);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyzerRef.current || !dataArrayRef.current) return;

    if (isUnmounted.current || !isVisualizerActiveRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyzer = analyzerRef.current;
    const dataArray = dataArrayRef.current;

    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    analyzer.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgb(248, 250, 252)'; // slate-50 (This needs to be dynamic or transparent for dark mode)
    // Dark mode bg check (simple heuristic or use transparent clear)
    const isDark = document.documentElement.classList.contains('dark');
    if(isDark) ctx.fillStyle = 'rgb(15, 23, 42)'; // slate-900

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient color based on height
        const hue = 220 + (barHeight / canvas.height) * 40; // Blue/Indigo range
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }

    // Schedule next frame
    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  // Start visualizer only when recording or playing
  useEffect(() => {
      isVisualizerActiveRef.current = isRecording || isPlaying;
      if (isRecording || isPlaying) {
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume();
          }
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          drawVisualizer();
      } else {
          if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
          }
      }
      
      return () => {
          if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
          }
      }
  }, [isRecording, isPlaying]);

  // Audio Playback Node setup
  useEffect(() => {
      if (audioUrl && audioPlayerRef.current && audioContextRef.current && analyzerRef.current) {
          // Check to prevent creating MediaElementSource twice on the same element
          if (!(audioPlayerRef.current as any).hasSourceConnected) {
              const audioCtx = audioContextRef.current;
              // Add a new track source
              const source = audioCtx.createMediaElementSource(audioPlayerRef.current);
              source.connect(analyzerRef.current);
              // Important: We MUST connect it to destination to hear it, but we only create ONE analyzer!
              // For microphone record, we didn't connect analyzer to destination.
              // To hear playback, we can connect the element source straight to destination as well.
              source.connect(audioCtx.destination);
              (audioPlayerRef.current as any).hasSourceConnected = true;
          }
      }
  }, [audioUrl]);

  // Component cleanup
  useEffect(() => {
     let isAudioContextCleaned = false;

     return () => {
         if (animationRef.current) cancelAnimationFrame(animationRef.current);
         
         // Stop recording if active
         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
         }

         // Disconnect nodes
         if (sourceRef.current) sourceRef.current.disconnect();
         if (audioContextRef.current && !isAudioContextCleaned) {
             isAudioContextCleaned = true;
             if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
             }
         }

         // Stop all tracks to release microphone hardware
         stopAudioTracks();
     };
  }, []);

  const initAudioAndRecord = async () => {
    try {
      let localStream = streamRef.current;
      
      if (!localStream) {
          localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (isUnmounted.current) {
              localStream.getTracks().forEach(track => track.stop());
              return;
          }
          streamRef.current = localStream;
          setStream(localStream);
      }
      
      // Setup Audio Context for Visualizer if not already setup
      if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContext();
          setSampleRate(audioCtx.sampleRate);
          
          const analyzer = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(localStream);
          
          analyzer.fftSize = 2048;
          const bufferLength = analyzer.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          source.connect(analyzer);
          
          audioContextRef.current = audioCtx;
          analyzerRef.current = analyzer;
          dataArrayRef.current = dataArray;
          sourceRef.current = source;
      }
      
      // Try to start recording right away
      try {
          const recorder = new MediaRecorder(localStream);
          setMimeType(recorder.mimeType);
          const chunks: Blob[] = [];

          recorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
              // Create blob with actual mime type from recorder
              const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
              setAudioBlob(blob);
              setAudioUrl(URL.createObjectURL(blob));
              
              const sizeInKB = blob.size / 1024;
              setFileSize(sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(2)} MB` : `${sizeInKB.toFixed(2)} KB`);
          };

          recorder.start();
          mediaRecorderRef.current = recorder;
          setIsRecording(true);
          setRecordingDuration(0);
          setAudioBlob(null);
          setAudioUrl(null);
          
      } catch (e) {
          console.error("Recorder error:", e);
      }

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(t.error_mic);
    }
  };

  const startRecording = () => {
    initAudioAndRecord();
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          
          if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
          }
          
          // Optionally release mic directly after stopping
          stopAudioTracks();
      }
  };

  const togglePlayback = () => {
      if (audioPlayerRef.current) {
          if (isPlaying) {
              audioPlayerRef.current.pause();
          } else {
              audioPlayerRef.current.play();
          }
      }
  };

  const downloadAudio = () => {
      if (audioUrl) {
          const link = document.createElement('a');
          link.href = audioUrl;
          // Extract extension from mimeType if possible, default to webm
          const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
          link.download = `audio-recording-${Date.now()}.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  const reset = () => {
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingDuration(0);
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
        title={t.title}
        icon={<Mic size={24} />}
        onClose={handleClose}
        size="lg"
    >
        {({ close }) => (
            <>
                {/* Content */}
                <div className="flex flex-col gap-6 items-center">
                    
                    {error ? (
                        <div className="text-red-500 font-medium text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg w-full">
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Visualizer Area */}
                            <div className="w-full h-32 bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 dark:border-slate-700">
                                <canvas ref={canvasRef} width={500} height={128} className="w-full h-full" />
                                
                                {!isRecording && !isPlaying && !audioUrl && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-900 z-10">
                                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wide">
                                            {t.start_record}
                                        </span>
                                    </div>
                                )}

                                {!isRecording && !isPlaying && audioUrl && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                                        <span className="text-slate-400/80 dark:text-slate-500/80 text-xs font-semibold tracking-wide">
                                            {t.listening} {/* Or play text depending on localization */}
                                        </span>
                                    </div>
                                )}

                                {!audioUrl && isRecording && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-full z-20">
                                        <Activity size={12} className="text-slate-600 dark:text-slate-300" />
                                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                            Recording
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Timer */}
                            <div className="font-mono text-4xl font-bold text-slate-700 dark:text-slate-200 tracking-wider">
                                {formatTime(recordingDuration)}
                            </div>

                            {/* Controls */}
                            <div className="flex gap-4 items-center">
                                {!audioUrl ? (
                                    !isRecording ? (
                                        <button 
                                            onClick={startRecording}
                                            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 dark:shadow-red-900/50 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                                            title={t.start_record}
                                        >
                                            <Mic size={32} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={stopRecording}
                                            className="w-16 h-16 bg-slate-800 dark:bg-slate-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-slate-900 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
                                            title={t.stop_record}
                                        >
                                            <Square size={28} fill="currentColor" />
                                        </button>
                                    )
                                ) : (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={reset}
                                            className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                                            title="Reset"
                                        >
                                            <RefreshCw size={20} />
                                        </button>
                                        
                                        <button 
                                            onClick={togglePlayback}
                                            className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                        </button>
                                        
                                        <button 
                                            onClick={downloadAudio}
                                            className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                                            title={t.download}
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info Stats (Shows after recording) */}
                            {audioUrl && (
                                <div className="grid grid-cols-3 gap-2 w-full mt-2">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{t.details_size}</div>
                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{fileSize}</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{t.details_rate}</div>
                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{sampleRate} Hz</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{t.details_type}</div>
                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-xs break-all pt-1" title={mimeType}>
                                            {mimeType.split(';')[0]}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Hidden Audio Element */}
                            {audioUrl && (
                                <audio ref={audioPlayerRef} src={audioUrl} />
                            )}
                        </>
                    )}

                </div>
            </>
        )}
    </Modal>
  );
};
