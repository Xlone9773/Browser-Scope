
import React, { useEffect, useState } from 'react';
import { 
  Monitor, 
  Cpu, 
  Wifi, 
  Smartphone, 
  Layers, 
  Zap, 
  RefreshCw,
  Globe,
  HardDrive,
  Film,
  Languages,
  Shield,
  MapPin,
  Mic,
  Camera,
  Bell,
  Music,
  ChevronDown,
  Download,
  Fingerprint,
  Video,
  ExternalLink,
  Copy,
  Check,
  ZoomIn,
  Moon,
  Sun,
  FileCode,
  AppWindow,
  Info,
  Activity,
  ChevronRight,
  Lock,
  Gamepad2,
  Mic2,
  Settings,
  Network,
  Bot,
  Hammer,
  Sliders,
  CheckCircle,
  Brain,
  ShieldAlert,
  Eye,
  Key,
  X
} from 'lucide-react';
import { getAllData } from './services/detectionService';
import { BrowserData } from './types';
import { InfoCard, InfoItem } from './components/InfoCard';
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
import { RefreshRate } from './components/RefreshRate';
import { translations, languageNames, Language } from './utils/i18n/index';
import { applyTheme, getSavedTheme, Theme } from './appearance/theme';
import { DeveloperTab } from './components/settings/DeveloperTab'; // Import DevTab
import { FloatingWindow } from './components/ui/FloatingWindow'; // Import FloatingWindow

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'camera' | 'microphone' | 'geolocation' | 'notifications' | 'midi';

interface GeoPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<BrowserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('zh-CN');
  const [theme, setTheme] = useState<Theme>('system');
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
      const saved = localStorage.getItem('simpleMode');
      return saved === 'true';
  });

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
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
  
  // Developer Tools State (Lifted to App level)
  const [isDevToolsFloating, setIsDevToolsFloating] = useState(false);

  const [uaCopied, setUaCopied] = useState(false);
  
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

  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      applyTheme(newTheme);
  };

  const toggleSimpleMode = (value: boolean) => {
      setSimpleMode(value);
      localStorage.setItem('simpleMode', String(value));
  };

  const fetchData = async () => {
    setLoading(true);
    setTimeout(async () => {
        const info = await getAllData();
        setData(info);
        setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
    // Initial check for permissions that don't need prompt if possible
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
  
  const copyUserAgent = () => {
      if (data?.system.userAgent) {
          navigator.clipboard.writeText(data.system.userAgent);
          setUaCopied(true);
          setTimeout(() => setUaCopied(false), 2000);
      }
  };

  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    if (val === 'Yes') return t.values.yes;
    if (val === 'No') return t.values.no;
    if (val === 'Unknown') return t.values.unknown;
    return val;
  };

  const getPermColor = (status: PermissionStatusType) => {
      switch(status) {
          case 'granted': return 'text-green-600 dark:text-green-400';
          case 'denied': return 'text-red-500 dark:text-red-400';
          case 'prompt': return 'text-amber-500 dark:text-amber-400';
          case 'error': return 'text-slate-400';
          default: return 'text-slate-400';
      }
  };

  const getPermLabel = (status: PermissionStatusType) => {
      switch(status) {
          case 'granted': return t.status.granted;
          case 'denied': return t.status.denied;
          case 'prompt': return t.status.prompt;
          case 'error': return t.status.error;
          default: return t.status.idle;
      }
  };

  const getScoreColor = (score: number) => {
      if (score > 80) return 'text-red-500';
      if (score > 60) return 'text-orange-500';
      if (score > 30) return 'text-yellow-500';
      return 'text-green-600';
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin text-slate-400">
                <RefreshCw size={32} />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 scrollbar-hide">
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
      {isWebGLExtensionsOpen && <WebGLExtensionsModal extensions={data.fingerprints.webglExtensions || []} onClose={() => setIsWebGLExtensionsOpen(false)} t={t.webglTool} />}
      {isCanvasModalOpen && <CanvasModal imageSrc={data.fingerprints.canvasImage} onClose={() => setIsCanvasModalOpen(false)} t={t.imageDetails} />}
      {isBase64ModalOpen && <Base64Modal data={data.fingerprints.canvasImage} onClose={() => setIsBase64ModalOpen(false)} t={t.base64Tool} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} t={t.aboutModal} />}
      {isSensorModalOpen && <SensorModal onClose={() => setIsSensorModalOpen(false)} t={t.sensorModal} />}
      {isScoreModalOpen && <ScoreModal scoreData={data.fingerprints.score} onClose={() => setIsScoreModalOpen(false)} t={t.scoreModal} />}
      {isFingerprintModalOpen && <FingerprintModal onClose={() => setIsFingerprintModalOpen(false)} t={t.fingerprintModal} />}
      
      {isSettingsModalOpen && (
          <SettingsModal
            onClose={() => setIsSettingsModalOpen(false)}
            t={t.settingsModal}
            simpleMode={simpleMode}
            toggleSimpleMode={toggleSimpleMode}
            // Pass down state controls for DevTools
            isDevToolsFloating={isDevToolsFloating}
            setDevToolsFloating={setIsDevToolsFloating}
          />
      )}
      
      {isBenchmarkModalOpen && <BenchmarkModal onClose={() => setIsBenchmarkModalOpen(false)} t={t.benchmarkModal} />}
      {isHardwareToolsModalOpen && <HardwareToolsModal onClose={() => setIsHardwareToolsModalOpen(false)} t={t.hardwareToolsModal} />}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 relative">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Monitor className="text-indigo-600 dark:text-indigo-400" size={32} />
              {t.title}
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex gap-3 relative z-40 flex-wrap">
            <button onClick={() => setIsBenchmarkModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all shadow-sm active:scale-95">
                <Activity size={16} />
                <span className="hidden sm:inline">{t.actions.run_benchmark}</span>
            </button>
            <button onClick={toggleTheme} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95" title={t.settingsModal.title}>
                <Sliders size={16} />
            </button>
            <button onClick={() => setIsAboutModalOpen(true)} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95" title={t.actions.about}>
                <Info size={16} />
            </button>
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95">
                    <Languages size={16} />
                    <span>{languageNames[lang]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 origin-top-right ${isLangMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                    {Object.entries(languageNames).map(([code, name]) => (
                        <button key={code} onClick={() => { setLang(code as Language); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${lang === code ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}>
                            {name}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleExportJSON} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95">
                <Download size={16} />
                <span className="hidden sm:inline">{t.actions.export_json}</span>
            </button>
            <button onClick={fetchData} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 border border-indigo-600 dark:border-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-sm active:scale-95">
                <RefreshCw size={16} />
                {t.refresh}
            </button>
          </div>
        </header>

        {/* Main Grid Content ... (Keeping rest of the content exactly as is) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard title={t.sections.security} icon={ShieldAlert}>
              <InfoItem label={t.labels.is_bot} value={data.security.isBot ? t.values.detected : t.values.none} subValue={data.security.isBot ? "Navigator.webdriver" : undefined} />
              <InfoItem label={t.labels.ad_block} value={data.security.adBlockEnabled ? t.values.detected : t.values.none} />
              <InfoItem label={t.labels.secure_context} value={trVal(data.security.secureContext)} />
              {!simpleMode && (
                  <>
                    <InfoItem label={t.labels.webrtc_ip} value={data.network.webrtcIp || t.values.hidden} />
                    <InfoItem label={t.labels.gpc_enabled} value={trVal(data.security.gpcEnabled)} />
                    <InfoItem label={t.labels.pdf_viewer} value={trVal(data.security.pdfViewer)} />
                  </>
              )}
          </InfoCard>

          <InfoCard title={t.sections.ai_compute} icon={Brain}>
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">{t.labels.ai_readiness}</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-700">{data.ai.readiness.level}</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-indigo-900 dark:text-indigo-100 mt-1">{data.ai.readiness.flops}</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 leading-tight opacity-90">{data.ai.readiness.description}</div>
              </div>
              <InfoItem label={t.labels.window_ai} value={trVal(data.ai.windowAi)} />
              <InfoItem label={t.labels.webnn} value={trVal(data.ai.webnn)} />
              <InfoItem label={t.labels.webgpu_compute} value={trVal(data.ai.webgpuCompute)} />
              {!simpleMode && (
                  <>
                    <InfoItem label={t.labels.wasm_support} value={trVal(data.ai.wasmSupport)} />
                    <InfoItem label={t.labels.wasm_simd} value={trVal(data.ai.wasmSimd)} />
                  </>
              )}
          </InfoCard>

          <InfoCard title={t.sections.system} icon={Smartphone}>
            <InfoItem label={t.labels.os} value={data.system.os} />
            <InfoItem label={t.labels.platform} value={data.system.platform} />
            <InfoItem label={t.labels.browser} value={`${data.system.browserName} ${data.system.browserVersion}`} />
            {!simpleMode && (
                <>
                    <InfoItem label={t.labels.language} value={data.system.language} />
                    <InfoItem label={t.labels.pref_langs} value={data.system.preferredLanguages.join(', ')} />
                    <InfoItem label={t.labels.cookies} value={trVal(data.system.cookiesEnabled)} />
                    <InfoItem label={t.labels.dnt} value={data.system.doNotTrack || 'Off'} />
                </>
            )}
          </InfoCard>

          <InfoCard title={t.sections.hardware} icon={Cpu}>
            <InfoItem label={t.labels.cpu} value={data.hardware.cpuCores} />
            {data.hardware.cpuModel && <InfoItem label={t.labels.cpu_model} value={data.hardware.cpuModel} />}
            <InfoItem label={t.labels.memory} value={data.hardware.memory} />
            <InfoItem label={t.labels.gpu_renderer} value={data.hardware.gpuRenderer} />
            <div className="py-2">
                <InfoItem label={t.labels.battery} value={data.hardware.batteryLevel} />
                <InfoItem label={t.labels.charging} value={trVal(data.hardware.isCharging)} />
                {!simpleMode && data.hardware.isCharging === 'Yes' && data.hardware.chargingTime !== '-' && (
                    <InfoItem label={t.labels.charging_time} value={data.hardware.chargingTime} />
                )}
                {!simpleMode && data.hardware.isCharging === 'No' && data.hardware.dischargingTime !== '-' && (
                    <InfoItem label={t.labels.discharging_time} value={data.hardware.dischargingTime} />
                )}
            </div>
            {!simpleMode && (
                <>
                    <InfoItem label={t.labels.gpu_vendor} value={data.hardware.gpuVendor} />
                    <InfoItem label={t.labels.max_texture} value={data.hardware.maxTextureSize} />
                    <InfoItem label={t.labels.touch} value={data.hardware.touchPoints} />
                    <div className="flex items-center gap-1.5 py-2.5 border-b border-slate-50 last:border-0 px-2 -mx-2">
                        <Gamepad2 size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-500 font-medium">{t.labels.gamepads}</span>
                        <span className="ml-auto text-sm text-slate-800">{data.hardware.gamepads}</span>
                    </div>
                </>
            )}
            <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50 flex gap-2">
                <button onClick={() => setIsSensorModalOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                    <Activity size={14} />
                    {t.actions.open_sensors}
                </button>
                <button onClick={() => setIsHardwareToolsModalOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Hammer size={14} />
                    {t.actions.open_tools}
                </button>
            </div>
          </InfoCard>

          <InfoCard title={t.sections.display} icon={Layers}>
            <InfoItem label={t.labels.resolution} value={data.display.resolution} />
            <RefreshRate label={t.labels.refresh_rate} />
            {!simpleMode && (
                <>
                    <InfoItem label={t.labels.avail_size} value={data.display.availableSize} />
                    <InfoItem label={t.labels.pixel_ratio} value={`${data.display.pixelRatio}x`} />
                    <InfoItem label={t.labels.color_depth} value={`${data.display.colorDepth}-bit`} />
                    <InfoItem label={t.labels.screen_extended} value={trVal(data.hardware.screenExtended)} />
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded">
                        <span className="text-sm text-slate-500 font-medium">{t.labels.orientation}</span>
                        <div className="text-right flex items-center gap-2">
                            <span className="text-sm text-slate-800">{data.display.orientation}</span>
                            <span className="text-xs text-slate-400">({data.display.orientationAngle})</span>
                        </div>
                    </div>
                    <InfoItem label={t.labels.hdr} value={trVal(data.display.hdr)} />
                    <InfoItem label={t.labels.display_mode} value={data.display.displayMode} />
                    <InfoItem label={t.labels.dark_mode} value={trVal(data.display.darkMode)} />
                </>
            )}
          </InfoCard>

          <InfoCard title={t.sections.fingerprints} icon={Fingerprint}>
             <div className="flex items-center justify-between p-3 mb-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                 <div className="flex flex-col">
                     <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.labels.fp_score}</span>
                     <span className={`text-2xl font-bold ${getScoreColor(data.fingerprints.score.totalScore)}`}>{data.fingerprints.score.totalScore}/100</span>
                 </div>
                 <button onClick={() => setIsScoreModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                     {t.actions.view_details}
                     <ChevronRight size={12} />
                 </button>
             </div>
             <InfoItem label={t.labels.canvas_hash} value={data.fingerprints.canvasHash} />
             <div className="relative group my-2 border border-slate-100 dark:border-slate-700 rounded p-1 bg-white flex justify-center cursor-pointer" onClick={() => setIsCanvasModalOpen(true)}>
                 <img src={data.fingerprints.canvasImage} alt="Canvas Fingerprint" className="h-10 object-contain opacity-80" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    <ZoomIn className="text-white" size={16} />
                 </div>
             </div>
             {!simpleMode && (
                 <>
                    <div className="flex justify-center mb-2">
                        <button onClick={() => setIsBase64ModalOpen(true)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            <FileCode size={12} />
                            {t.actions.view_base64}
                        </button>
                    </div>
                    <InfoItem label={t.labels.webgl_hash} value={data.fingerprints.webglHash} />
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">WebGL</span>
                        <button onClick={() => setIsWebGLExtensionsOpen(true)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-2 py-1 rounded transition-colors">
                            {t.actions.view_extensions}
                            <ExternalLink size={10} />
                        </button>
                    </div>
                    <InfoItem label={t.labels.audio_rate} value={data.hardware.audioSampleRate} />
                    <InfoItem label={t.labels.audio_latency} value={data.fingerprints.audioLatency} />
                    <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50 flex justify-center">
                        <button onClick={() => setIsFingerprintModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors w-full justify-center">
                            <Settings size={16} />
                            {t.fingerprintModal.title}
                        </button>
                    </div>
                 </>
             )}
          </InfoCard>

          <InfoCard title={t.sections.network} icon={Wifi}>
            <InfoItem label={t.labels.online} value={data.network.online ? t.values.connected : t.values.offline} isFeature />
            <InfoItem label={t.labels.conn_type} value={data.network.effectiveType} />
            <InfoItem label={t.labels.net_type} value={data.network.type} />
            <InfoItem label={t.labels.downlink} value={data.network.downlink} />
            {!simpleMode && (
                <>
                    <InfoItem label={t.labels.downlink_max} value={data.network.downlinkMax} />
                    <InfoItem label={t.labels.rtt} value={data.network.rtt} />
                    <InfoItem label={t.labels.save_data} value={trVal(data.network.saveData)} />
                </>
            )}
          </InfoCard>
          
           {!simpleMode && (
               <InfoCard title={t.sections.storage_loc} icon={HardDrive}>
                <InfoItem label={t.labels.storage_quota} value={data.storage.quota} />
                <InfoItem label={t.labels.storage_usage} value={data.storage.usage} />
                <InfoItem label={t.labels.storage_persisted} value={trVal(data.storage.persisted)} />
                <InfoItem label={t.labels.timezone} value={data.localization.timeZone} />
                <InfoItem label={t.labels.locale} value={data.localization.locale} />
                <InfoItem label={t.labels.calendar} value={data.localization.calendar} />
              </InfoCard>
           )}
          
           {!simpleMode && (
               <InfoCard title={t.sections.permissions} icon={Shield}>
                 <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-2">
                        <Bell size={14} className="text-slate-400"/>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_notif}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${getPermColor(permStatus.notifications)}`}>{getPermLabel(permStatus.notifications)}</span>
                        {(permStatus.notifications === 'prompt' || permStatus.notifications === 'idle') && (
                            <button onClick={() => requestPermission('notifications')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                        )}
                    </div>
                 </div>
                 <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-2">
                        <Music size={14} className="text-slate-400"/>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_midi}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${getPermColor(permStatus.midi)}`}>{getPermLabel(permStatus.midi)}</span>
                        {permStatus.midi !== 'granted' && (
                            <button onClick={() => requestPermission('midi')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                        )}
                    </div>
                 </div>
                 <div className="flex flex-col py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400"/>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_geo}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${getPermColor(permStatus.geolocation)}`}>{getPermLabel(permStatus.geolocation)}</span>
                            {permStatus.geolocation !== 'granted' && (
                                <button onClick={() => requestPermission('geolocation')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                            )}
                        </div>
                    </div>
                    {permStatus.geolocation === 'granted' && geoData && (
                        <div className="mt-2 pl-6 grid grid-cols-2 gap-y-1 gap-x-4 text-xs">
                            <div className="flex flex-col">
                                <span className="text-slate-400">{t.labels.geo_lat}</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{geoData.latitude.toFixed(6)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400">{t.labels.geo_long}</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{geoData.longitude.toFixed(6)}</span>
                            </div>
                            <div className="flex flex-col col-span-2 mt-1">
                                <span className="text-slate-400">{t.labels.geo_acc}</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">±{geoData.accuracy.toFixed(1)}m</span>
                            </div>
                        </div>
                    )}
                 </div>
              </InfoCard>
           )}

           {!simpleMode && (
               <InfoCard title={t.labels.media_devices} icon={Video}>
                   <div className="flex flex-col gap-4 py-1">
                       <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                           <div className={`p-2.5 rounded-full ${permStatus.camera === 'granted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                               <Camera size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                               <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{t.labels.perm_camera}</div>
                               <div className={`text-xs ${getPermColor(permStatus.camera)}`}>{getPermLabel(permStatus.camera)}</div>
                           </div>
                           <div>
                               {permStatus.camera !== 'granted' ? (
                                    <button onClick={() => requestPermission('camera')} className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm text-xs font-medium">{t.actions.check}</button>
                                 ) : (
                                    <button onClick={() => setIsCameraModalOpen(true)} className="px-3 py-1.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm text-xs font-medium">{t.cameraTool.btn_open}</button>
                                 )}
                           </div>
                       </div>
                       <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                           <div className={`p-2.5 rounded-full ${permStatus.microphone === 'granted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                               <Mic size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                               <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{t.labels.perm_mic}</div>
                               <div className={`text-xs ${getPermColor(permStatus.microphone)}`}>{getPermLabel(permStatus.microphone)}</div>
                           </div>
                           <div>
                               {permStatus.microphone !== 'granted' ? (
                                    <button onClick={() => requestPermission('microphone')} className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm text-xs font-medium">{t.actions.check}</button>
                                 ) : (
                                    <button onClick={() => setIsAudioModalOpen(true)} className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm text-xs font-medium">{t.audioTool.btn_open}</button>
                                 )}
                           </div>
                       </div>
                   </div>
               </InfoCard>
           )}

           {!simpleMode && (
               <InfoCard title={t.sections.media_sup} icon={Film}>
                  <div className="mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.video_codecs}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {data.media.video.map(c => (
                            <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
                        ))}
                      </div>
                  </div>
                  <div className="mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.audio_codecs}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {data.media.audio.map(c => (
                            <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
                        ))}
                      </div>
                  </div>
                  <div className="mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.image_formats}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {data.media.images.map(c => (
                            <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
                        ))}
                      </div>
                  </div>
                  <div className="mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.drm_support}</span>
                      <div className="flex flex-col gap-2">
                        {data.media.drm.map(d => (
                            <div key={d.name} className={`text-xs px-2 py-1.5 rounded border flex justify-between items-center ${d.supported ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                <span className="font-medium">{d.name}</span>
                                {d.supported ? <Check size={12} /> : <X size={12} />}
                            </div>
                        ))}
                      </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                          <Mic2 size={14} className="text-slate-400"/>
                          <span className="text-xs font-medium text-slate-500">{t.labels.speech_voices}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{data.media.speechVoices}</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                          <Music size={14} className="text-slate-400"/>
                          <span className="text-xs font-medium text-slate-500">{t.labels.audio_channels}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{data.media.audioChannels}</span>
                  </div>
               </InfoCard>
           )}

          {!simpleMode && (
              <div className="md:col-span-2 lg:col-span-3">
                <InfoCard title={t.sections.user_agent} icon={Globe}>
                  <div className="relative group">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 break-all leading-relaxed pr-12">{data.system.userAgent}</div>
                      <button onClick={copyUserAgent} className="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={t.actions.copy}>
                          {uaCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                      {uaCopied && <div className="absolute top-1 right-12 px-2 py-1 bg-black/75 text-white text-xs rounded shadow-sm animate-in fade-in slide-in-from-right-2">{t.actions.copied}</div>}
                  </div>
                </InfoCard>
              </div>
          )}
        </div>

        <div className="pt-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><AppWindow className="text-sky-500" size={24} />{t.sections.pwa}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                     <div className={`p-3 rounded-full ${data.system.isPwaInstalled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {data.system.isPwaInstalled ? <CheckCircle size={24} /> : <Download size={24} />}
                     </div>
                     <div>
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.labels.pwa_install_status}</div>
                         <div className={`text-lg font-bold ${data.system.isPwaInstalled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{data.system.isPwaInstalled ? t.values.installed : t.values.not_installed}</div>
                     </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.pwaFeatures.map((feature) => (
                        <div key={feature.key} className={`relative p-4 rounded-lg border transition-all duration-200 ${feature.supported ? 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-900/30 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${feature.supported ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                    {/* @ts-ignore */}
                                    {t.features[feature.key] || feature.name}
                                </h3>
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${feature.supported ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {/* @ts-ignore */}
                                {t.featureDescs[feature.key] || feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="pt-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Zap className="text-amber-500" size={24} />{t.sections.features}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.features.map((feature) => (
                        <div key={feature.key} className={`relative p-4 rounded-lg border transition-all duration-200 ${feature.supported ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${feature.supported ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                    {/* @ts-ignore */}
                                    {t.features[feature.key] || feature.name}
                                </h3>
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${feature.supported ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {/* @ts-ignore */}
                                {t.featureDescs[feature.key] || feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <footer className="text-center py-8 text-sm text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
            <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
