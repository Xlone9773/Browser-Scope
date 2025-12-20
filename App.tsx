
import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Monitor, Zap } from 'lucide-react';
import { getAllData } from './services/detectionService';
import { BrowserData } from './types';
import { CameraModal } from './components/CameraModal';
import { AudioRecorderModal } from './components/AudioRecorderModal';
import { WebGLExtensionsModal } from './components/WebGLExtensionsModal';
import { CanvasModal } from './components/CanvasModal';
import { Base64Modal } from './components/Base64Modal';
import { AboutModal } from './components/AboutModal';
import { SensorModal } from './components/SensorModal';
import { ScoreModal } from './components/ScoreModal';
import { FingerprintModal } from './components/FingerprintModal';
import { SettingsModal } from './components/SettingsModal';
import { BenchmarkModal } from './components/BenchmarkModal';
import { HardwareToolsModal } from './components/HardwareToolsModal';
import { AiPlaygroundModal } from './components/AiPlaygroundModal';
import { GamepadToolModal } from './components/GamepadToolModal';
import { translations, Language } from './utils/i18n/index';
import { applyTheme, getSavedTheme, Theme } from './appearance/theme';
import { DeveloperTab } from './components/settings/DeveloperTab';
import { FloatingWindow } from './components/ui/FloatingWindow';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SecurityCard } from './components/cards/SecurityCard';
import { AiComputeCard } from './components/cards/AiComputeCard';
import { SystemCard } from './components/cards/SystemCard';
import { HardwareCard } from './components/cards/HardwareCard';
import { DisplayCard } from './components/cards/DisplayCard';
import { FingerprintCard } from './components/cards/FingerprintCard';
import { NetworkCard } from './components/cards/NetworkCard';
import { StorageCard } from './components/cards/StorageCard';
import { LocationCard } from './components/cards/LocationCard'; 
import { PermissionsCard } from './components/cards/PermissionsCard';
import { MediaDevicesCard } from './components/cards/MediaDevicesCard';
import { MediaCapabilitiesCard } from './components/cards/MediaCapabilitiesCard';
import { UserAgentCard } from './components/cards/UserAgentCard';
import { PwaSection } from './components/sections/PwaSection';
import { FeaturesSection } from './components/sections/FeaturesSection';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'camera' | 'microphone' | 'geolocation' | 'notifications' | 'midi';

interface GeoPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<BrowserData | null>(null);
  
  // Loading State
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(true); // Start invisible for animation
  const [loadingText, setLoadingText] = useState('');
  
  const [lang, setLang] = useState<Language>('zh-CN');
  const [theme, setTheme] = useState<Theme>('system');
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
      const saved = localStorage.getItem('simpleMode');
      return saved === 'true';
  });
  const [hideScrollbar, setHideScrollbar] = useState<boolean>(() => {
      const saved = localStorage.getItem('hideScrollbar');
      return saved === 'true';
  });
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>(() => {
      const saved = localStorage.getItem('timeFormat');
      return (saved === '12' || saved === '24') ? saved : '24';
  });
  const [disableBlur, setDisableBlur] = useState<boolean>(() => {
      const saved = localStorage.getItem('disableBlur');
      return saved === 'true';
  });

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isWebGLExtensionsOpen, setIsWebGLExtensionsOpen] = useState(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [isBase64ModalOpen, setIsBase64ModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
  const [isHardwareToolsModalOpen, setIsHardwareToolsModalOpen] = useState(false);
  const [isAiPlaygroundOpen, setIsAiPlaygroundOpen] = useState(false);
  const [isGamepadToolOpen, setIsGamepadToolOpen] = useState(false);
  
  // Developer Tools State
  const [isDevToolsFloating, setIsDevToolsFloating] = useState(false);
  
  const [permStatus, setPermStatus] = useState<Record<PermissionKey, PermissionStatusType>>({
    camera: 'idle',
    microphone: 'idle',
    geolocation: 'idle',
    notifications: 'idle',
    midi: 'idle'
  });

  const [geoData, setGeoData] = useState<GeoPosition | null>(null);

  const t = translations[lang];

  // Initialize theme
  useEffect(() => {
      const savedTheme = getSavedTheme();
      setTheme(savedTheme);
      applyTheme(savedTheme);
  }, []);

  // Initialize scrollbar state
  useEffect(() => {
      if (hideScrollbar) {
          document.documentElement.classList.add('scrollbar-hide');
      } else {
          document.documentElement.classList.remove('scrollbar-hide');
      }
  }, [hideScrollbar]);

  // Initialize blur state
  useEffect(() => {
      if (disableBlur) {
          document.body.classList.add('no-blur');
      } else {
          document.body.classList.remove('no-blur');
      }
  }, [disableBlur]);

  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      applyTheme(newTheme);
  };

  const toggleSimpleMode = (value: boolean) => {
      setSimpleMode(value);
      localStorage.setItem('simpleMode', String(value));
  };

  const toggleHideScrollbar = (value: boolean) => {
      setHideScrollbar(value);
      localStorage.setItem('hideScrollbar', String(value));
  };

  const updateTimeFormat = (format: '12' | '24') => {
      setTimeFormat(format);
      localStorage.setItem('timeFormat', format);
  };

  const toggleDisableBlur = (value: boolean) => {
      setDisableBlur(value);
      localStorage.setItem('disableBlur', String(value));
  };

  const fetchData = async () => {
    // Reset to hidden state first
    setFadeLoader(true);
    setShowLoader(true);
    
    // Trigger entrance animation
    // Small delay to ensure DOM is mounted with opacity-0 before transitioning
    await new Promise(r => setTimeout(r, 50));
    setFadeLoader(false);
    
    // Start simulating steps immediately
    let stepIndex = 0;
    const steps = t.loading_steps || [t.loading];
    setLoadingText(steps[0]);

    const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
            setLoadingText(steps[stepIndex]);
        }
    }, 250); // Fast cycle to look dynamic

    // Delay actual fetch slightly to allow UI to settle
    setTimeout(async () => {
        const info = await getAllData();
        clearInterval(interval);
        
        // Show final step briefly
        if (steps.length > 0) {
            setLoadingText(steps[steps.length - 1]);
        }
        
        setData(info);
        
        // Start fade out
        setTimeout(() => {
            setFadeLoader(true);
            // Remove loader after fade animation
            setTimeout(() => {
                setShowLoader(false);
            }, 500);
        }, 400);
    }, 100);
  };

  useEffect(() => {
    fetchData();
    checkPermissionStatus('notifications', 'notifications');
    checkPermissionStatus('geolocation', 'geolocation');
    checkPermissionStatus('camera', 'camera');
    checkPermissionStatus('microphone', 'microphone');
    checkPermissionStatus('midi', 'midi');
  }, []);

  const updatePermStatus = (key: PermissionKey, status: PermissionStatusType) => {
    setPermStatus(prev => ({ ...prev, [key]: status }));
  };

  const checkPermissionStatus = async (key: PermissionKey, name: string) => {
      try {
          if (navigator.permissions && navigator.permissions.query) {
             // @ts-ignore
             const result = await navigator.permissions.query({ name: name as any });
             updatePermStatus(key, result.state as PermissionStatusType);
             
             if (key === 'geolocation' && result.state === 'granted') {
                 navigator.geolocation.getCurrentPosition(
                     (pos) => setGeoData(pos.coords),
                     (err) => console.error(err)
                 );
             }

             result.onchange = () => {
                updatePermStatus(key, result.state as PermissionStatusType);
             };
          }
      } catch (e) {
          console.debug(`Permission query failed for ${name}`, e);
      }
  };

  const requestPermission = async (type: PermissionKey) => {
    try {
        if (type === 'camera') {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            updatePermStatus('camera', 'granted');
            stream.getTracks().forEach(t => t.stop());
            setIsCameraModalOpen(true);
        } else if (type === 'microphone') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            updatePermStatus('microphone', 'granted');
            stream.getTracks().forEach(t => t.stop());
            setIsAudioModalOpen(true);
        } else if (type === 'geolocation') {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    updatePermStatus('geolocation', 'granted');
                    setGeoData(pos.coords);
                },
                (err) => {
                    console.error(err);
                    updatePermStatus('geolocation', 'denied');
                }
            );
        } else if (type === 'notifications') {
            const result = await Notification.requestPermission();
            updatePermStatus('notifications', result === 'default' ? 'prompt' : result);
        } else if (type === 'midi') {
            // @ts-ignore
            if (navigator.requestMIDIAccess) {
                // @ts-ignore
                await navigator.requestMIDIAccess();
                updatePermStatus('midi', 'granted');
            } else {
                updatePermStatus('midi', 'error');
            }
        }
    } catch (error: any) {
        console.error(`Error requesting permission for ${type}:`, error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            updatePermStatus(type, 'denied');
        } else {
            updatePermStatus(type, 'error');
        }
    }
  };

  const handleExportJSON = () => {
    if (!data) return;
    const exportData = {
        ...data,
        geolocation: geoData || 'Permission not granted'
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0');
    const filename = `browserscope-${dateStr}-${timeStr}.json`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 scrollbar-hide relative">
      
      {/* Loading Overlay */}
      {showLoader && (
          <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out backdrop-blur-xl ${
                fadeLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                backgroundColor: 'rgba(var(--bg-slate-50), 0.8)' // Fallback handled via classes usually, here inline for dynamic blend
            }}
          >
              <div 
                className={`bg-white/80 dark:bg-slate-800/80 p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col items-center gap-6 max-w-sm w-full mx-4 backdrop-blur-md transition-all duration-500 ease-out transform ${
                    fadeLoader ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
                }`}
              >
                  <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Monitor className="text-indigo-500" size={24} />
                      </div>
                  </div>
                  <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">BrowserScope</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse font-mono">
                          {loadingText}
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Global Floating Dev Tools */}
      {isDevToolsFloating && (
          <FloatingWindow 
            title={t.settingsModal.tab_developer} 
            onClose={() => setIsDevToolsFloating(false)}
            initialWidth={600}
            initialHeight={400}
          >
              <DeveloperTab 
                  t={t.settingsModal} 
                  isFloating={true} 
                  toggleFloat={() => setIsDevToolsFloating(false)} 
              />
          </FloatingWindow>
      )}

      {/* Modals */}
      {isCameraModalOpen && <CameraModal onClose={() => setIsCameraModalOpen(false)} t={t.cameraTool} />}
      {isAudioModalOpen && <AudioRecorderModal onClose={() => setIsAudioModalOpen(false)} t={t.audioTool} />}
      {isWebGLExtensionsOpen && <WebGLExtensionsModal extensions={data?.fingerprints.webglExtensions || []} onClose={() => setIsWebGLExtensionsOpen(false)} t={t.webglTool} />}
      {isCanvasModalOpen && <CanvasModal imageSrc={data?.fingerprints.canvasImage || ''} onClose={() => setIsCanvasModalOpen(false)} t={t.imageDetails} />}
      {isBase64ModalOpen && <Base64Modal data={data?.fingerprints.canvasImage || ''} onClose={() => setIsBase64ModalOpen(false)} t={t.base64Tool} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} t={t.aboutModal} />}
      {isSensorModalOpen && <SensorModal onClose={() => setIsSensorModalOpen(false)} t={t.sensorModal} />}
      {isScoreModalOpen && data && <ScoreModal scoreData={data.fingerprints.score} onClose={() => setIsScoreModalOpen(false)} t={t.scoreModal} />}
      {isFingerprintModalOpen && <FingerprintModal onClose={() => setIsFingerprintModalOpen(false)} t={t.fingerprintModal} />}
      
      {isSettingsModalOpen && (
          <SettingsModal
            onClose={() => setIsSettingsModalOpen(false)}
            t={t.settingsModal}
            simpleMode={simpleMode}
            toggleSimpleMode={toggleSimpleMode}
            hideScrollbar={hideScrollbar}
            toggleHideScrollbar={toggleHideScrollbar}
            timeFormat={timeFormat}
            setTimeFormat={updateTimeFormat}
            disableBlur={disableBlur}
            toggleDisableBlur={toggleDisableBlur}
            isDevToolsFloating={isDevToolsFloating}
            setDevToolsFloating={setIsDevToolsFloating}
          />
      )}
      
      {isBenchmarkModalOpen && <BenchmarkModal onClose={() => setIsBenchmarkModalOpen(false)} t={t.benchmarkModal} />}
      {isHardwareToolsModalOpen && <HardwareToolsModal onClose={() => setIsHardwareToolsModalOpen(false)} t={t.hardwareToolsModal} />}
      
      {/* New Feature Modals */}
      {isAiPlaygroundOpen && <AiPlaygroundModal onClose={() => setIsAiPlaygroundOpen(false)} t={t.aiPlayground} />}
      {isGamepadToolOpen && <GamepadToolModal onClose={() => setIsGamepadToolOpen(false)} t={t.gamepadTool} />}

      <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        
        <Header 
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onRefresh={fetchData}
          onExport={handleExportJSON}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onOpenBenchmark={() => setIsBenchmarkModalOpen(true)}
        />

        {/* Main Grid Content - Only render if data exists */}
        {data && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
                
                <SecurityCard 
                    data={data.security} 
                    webrtcIp={data.network.webrtcIp} 
                    t={t} 
                    simpleMode={simpleMode} 
                />

                <AiComputeCard 
                    data={data.ai} 
                    t={t} 
                    onOpenPlayground={() => setIsAiPlaygroundOpen(true)} 
                />

                <SystemCard 
                    data={data.system} 
                    t={t} 
                    simpleMode={simpleMode} 
                />

                <HardwareCard 
                    data={data.hardware} 
                    t={t} 
                    onOpenGamepad={() => setIsGamepadToolOpen(true)}
                    onOpenSensors={() => setIsSensorModalOpen(true)}
                    onOpenTools={() => setIsHardwareToolsModalOpen(true)}
                />

                <DisplayCard 
                    data={data.display} 
                    screenExtended={data.hardware.screenExtended} 
                    t={t} 
                    simpleMode={simpleMode} 
                />

                <FingerprintCard 
                    data={data.fingerprints}
                    audioSampleRate={data.hardware.audioSampleRate}
                    t={t}
                    simpleMode={simpleMode}
                    onOpenScore={() => setIsScoreModalOpen(true)}
                    onOpenCanvas={() => setIsCanvasModalOpen(true)}
                    onOpenBase64={() => setIsBase64ModalOpen(true)}
                    onOpenWebgl={() => setIsWebGLExtensionsOpen(true)}
                    onOpenFingerprintModal={() => setIsFingerprintModalOpen(true)}
                />

                <NetworkCard 
                    data={data.network} 
                    t={t} 
                    simpleMode={simpleMode} 
                />
                
                {!simpleMode && (
                    <>
                        <LocationCard 
                            data={data.localization}
                            geoData={geoData}
                            permStatus={permStatus.geolocation}
                            t={t}
                            onRequestPermission={() => requestPermission('geolocation')}
                            timeFormat={timeFormat}
                        />

                        <StorageCard data={data.storage} t={t} />
                        
                        <PermissionsCard 
                            permStatus={permStatus} 
                            geoData={geoData} 
                            t={t} 
                            onRequestPermission={requestPermission} 
                        />

                        <MediaDevicesCard 
                            permStatus={permStatus}
                            t={t}
                            onRequestPermission={requestPermission}
                            onOpenCamera={() => setIsCameraModalOpen(true)}
                            onOpenMic={() => setIsAudioModalOpen(true)}
                        />

                        <MediaCapabilitiesCard data={data.media} t={t} />

                        <UserAgentCard userAgent={data.system.userAgent} t={t} />
                    </>
                )}
                </div>

                <div className="animate-in fade-in duration-700 slide-in-from-bottom-8 delay-100">
                    <PwaSection isPwaInstalled={data.system.isPwaInstalled} features={data.pwaFeatures} t={t} />
                </div>
                
                <div className="animate-in fade-in duration-700 slide-in-from-bottom-8 delay-200">
                    <FeaturesSection features={data.features} t={t} />
                </div>
            </>
        )}

        <Footer text={t.footer} />
      </div>
    </div>
  );
};

export default App;
