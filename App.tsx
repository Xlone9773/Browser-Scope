
import React, { useEffect, useState, Suspense } from 'react';
import { RefreshCw, Monitor, Smartphone, ShieldAlert, Cpu, Loader2 } from 'lucide-react';
import { getAllData } from './services/detectionService';
import { runAiReadinessCheck } from './services/detectors/hardware';
import { exportAsJson } from './services/exporter';
import { BrowserData, GeoPosition } from './types';
import { translations, Language } from './utils/i18n/index';
import { applyTheme, getSavedTheme, Theme } from './appearance/theme';
import { FloatingWindow } from './components/ui/FloatingWindow';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ModalLoading } from './components/ui/ModalLoading';
import { SectionGroup } from './components/ui/SectionGroup';
import { useModalManager } from './hooks/useModalManager';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { EnvironmentCard } from './components/cards/EnvironmentCard';
import { SystemCard } from './components/cards/SystemCard';
import { HardwareCard } from './components/cards/HardwareCard';
import { DisplayCard } from './components/cards/DisplayCard';

const SecurityCard = React.lazy(() => import('./components/cards/SecurityCard').then(m => ({ default: m.SecurityCard })));
const AiComputeCard = React.lazy(() => import('./components/cards/AiComputeCard').then(m => ({ default: m.AiComputeCard })));
const FingerprintCard = React.lazy(() => import('./components/cards/FingerprintCard').then(m => ({ default: m.FingerprintCard })));
const NetworkCard = React.lazy(() => import('./components/cards/NetworkCard').then(m => ({ default: m.NetworkCard })));
const StorageCard = React.lazy(() => import('./components/cards/StorageCard').then(m => ({ default: m.StorageCard })));
const LocationCard = React.lazy(() => import('./components/cards/LocationCard').then(m => ({ default: m.LocationCard })));
const PermissionsCard = React.lazy(() => import('./components/cards/PermissionsCard').then(m => ({ default: m.PermissionsCard })));
const MediaDevicesCard = React.lazy(() => import('./components/cards/MediaDevicesCard').then(m => ({ default: m.MediaDevicesCard })));
const MediaCapabilitiesCard = React.lazy(() => import('./components/cards/MediaCapabilitiesCard').then(m => ({ default: m.MediaCapabilitiesCard })));
const UserAgentCard = React.lazy(() => import('./components/cards/UserAgentCard').then(m => ({ default: m.UserAgentCard })));
const PwaSection = React.lazy(() => import('./components/sections/PwaSection').then(m => ({ default: m.PwaSection })));
const FeaturesSection = React.lazy(() => import('./components/sections/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
import { ModuleState } from './components/settings/ModulesTab';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'camera' | 'microphone' | 'geolocation' | 'notifications' | 'midi';

const App: React.FC = () => {
  const [data, setData] = useState<BrowserData | null>(null);
  
  // Loading State
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  
  // Settings State
  const [lang, setLang] = useState<Language>(() => {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'zh-CN';
  });

  const changeLang = (newLang: Language) => {
      setLang(newLang);
      localStorage.setItem('language', newLang);
      document.documentElement.lang = newLang; // Optional, also good for accessibility
  };
  const [theme, setTheme] = useState<Theme>('system');
  const [themeColor, setThemeColor] = useState<string>(() => localStorage.getItem('themeColor') || 'indigo');
  const [animationStyle, setAnimationStyle] = useState<string>(() => localStorage.getItem('animationStyle') || 'slide-up');
  const [simpleMode, setSimpleMode] = useState<boolean>(() => localStorage.getItem('simpleMode') === 'true');
  const [hideScrollbar, setHideScrollbar] = useState<boolean>(() => localStorage.getItem('hideScrollbar') === 'true');
  const [globalHideScrollbar, setGlobalHideScrollbar] = useState<boolean>(() => localStorage.getItem('globalHideScrollbar') === 'true');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>(() => {
      const saved = localStorage.getItem('timeFormat');
      return (saved === '12' || saved === '24') ? saved : '24';
  });
  const [disableBlur, setDisableBlur] = useState<boolean>(() => localStorage.getItem('disableBlur') === 'true');
  const [disableAnimations, setDisableAnimations] = useState<boolean>(() => localStorage.getItem('disableAnimations') === 'true');
  const [fastAnimations, setFastAnimations] = useState<boolean>(() => localStorage.getItem('fastAnimations') === 'true');
  const [collapseHeader, setCollapseHeader] = useState<boolean>(() => localStorage.getItem('collapseHeader') === 'true');
  const [hiddenCards, setHiddenCards] = useState<string[]>(() => {
      try {
          const stored = localStorage.getItem('hiddenCards');
          return stored ? JSON.parse(stored) : [];
      } catch { return []; }
  });

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
  
  // Modal Manager Hook
  const { visibility, open, close, unload, loadedModules, Components } = useModalManager();

  const t = translations[lang];

  // Construct Module States for Settings Tab
  const settingsTitle = t.settings?.title;
  const developerTabTitle = t.settings?.nav?.developer;

  const modalStates: ModuleState[] = [
      { id: 'settings', name: settingsTitle, isOpen: visibility.settings, setOpen: (v) => v ? open('settings') : close('settings'), impact: 'Low', isSystem: true, isLoaded: true },
      { id: 'camera', name: t.cameraTool.title, isOpen: visibility.camera, setOpen: (v) => v ? open('camera') : close('camera'), impact: 'High', onUnload: () => unload('camera'), isLoaded: loadedModules.has('camera') },
      { id: 'audio', name: t.audioTool.title, isOpen: visibility.audio, setOpen: (v) => v ? open('audio') : close('audio'), impact: 'Medium', onUnload: () => unload('audio'), isLoaded: loadedModules.has('audio') },
      { id: 'webgl', name: t.webglTool.title, isOpen: visibility.webgl, setOpen: (v) => v ? open('webgl') : close('webgl'), impact: 'Low', onUnload: () => unload('webgl'), isLoaded: loadedModules.has('webgl') },
      { id: 'canvas', name: 'Canvas Detail', isOpen: visibility.canvas, setOpen: (v) => v ? open('canvas') : close('canvas'), impact: 'Low', onUnload: () => unload('canvas'), isLoaded: loadedModules.has('canvas') },
      { id: 'base64', name: t.base64Tool.title, isOpen: visibility.base64, setOpen: (v) => v ? open('base64') : close('base64'), impact: 'Low', onUnload: () => unload('base64'), isLoaded: loadedModules.has('base64') },
      { id: 'about', name: t.aboutModal.title, isOpen: visibility.about, setOpen: (v) => v ? open('about') : close('about'), impact: 'Low', onUnload: () => unload('about'), isLoaded: loadedModules.has('about') },
      { id: 'sensor', name: t.sensorModal.sensor_title, isOpen: visibility.sensor, setOpen: (v) => v ? open('sensor') : close('sensor'), impact: 'Medium', onUnload: () => unload('sensor'), isLoaded: loadedModules.has('sensor') },
      { id: 'score', name: t.scoreModal.score_details_title, isOpen: visibility.score, setOpen: (v) => v ? open('score') : close('score'), impact: 'Low', onUnload: () => unload('score'), isLoaded: loadedModules.has('score') },
      { id: 'fingerprint', name: t.fingerprintModal.title, isOpen: visibility.fingerprint, setOpen: (v) => v ? open('fingerprint') : close('fingerprint'), impact: 'Medium', onUnload: () => unload('fingerprint'), isLoaded: loadedModules.has('fingerprint') },
      { id: 'benchmark', name: t.benchmarkModal.title, isOpen: visibility.benchmark, setOpen: (v) => v ? open('benchmark') : close('benchmark'), impact: 'High', onUnload: () => unload('benchmark'), isLoaded: loadedModules.has('benchmark') },
      { id: 'tools', name: t.hardwareToolsModal.title, isOpen: visibility.tools, setOpen: (v) => v ? open('tools') : close('tools'), impact: 'Medium', onUnload: () => unload('tools'), isLoaded: loadedModules.has('tools') },
      { id: 'ai', name: t.aiPlayground.title, isOpen: visibility.ai, setOpen: (v) => v ? open('ai') : close('ai'), impact: 'High', onUnload: () => unload('ai'), isLoaded: loadedModules.has('ai') },
      { id: 'gamepad', name: t.gamepadTool.title, isOpen: visibility.gamepad, setOpen: (v) => v ? open('gamepad') : close('gamepad'), impact: 'Medium', onUnload: () => unload('gamepad'), isLoaded: loadedModules.has('gamepad') },
      { id: 'webDevice', name: t.webDevice.title, isOpen: visibility.webDevice, setOpen: (v) => v ? open('webDevice') : close('webDevice'), impact: 'Medium', onUnload: () => unload('webDevice'), isLoaded: loadedModules.has('webDevice') },
      { id: 'vision', name: t.visionModal.title, isOpen: visibility.vision, setOpen: (v) => v ? open('vision') : close('vision'), impact: 'High', onUnload: () => unload('vision'), isLoaded: loadedModules.has('vision') },
      { id: 'speed', name: t.speedTest.title, isOpen: visibility.speed, setOpen: (v) => v ? open('speed') : close('speed'), impact: 'Medium', onUnload: () => unload('speed'), isLoaded: loadedModules.has('speed') },
      { id: 'compute', name: t.computeStress.title, isOpen: visibility.compute, setOpen: (v) => v ? open('compute') : close('compute'), impact: 'High', onUnload: () => unload('compute'), isLoaded: loadedModules.has('compute') },
      { id: 'video', name: t.actions.open_video_test, isOpen: visibility.video, setOpen: (v) => v ? open('video') : close('video'), impact: 'High', onUnload: () => unload('video'), isLoaded: loadedModules.has('video') },
      { id: 'graphics', name: t.graphicsModal.title, isOpen: visibility.graphics, setOpen: (v) => v ? open('graphics') : close('graphics'), impact: 'Medium', onUnload: () => unload('graphics'), isLoaded: loadedModules.has('graphics') },
      { id: 'speech', name: t.speechModal.title, isOpen: visibility.speech, setOpen: (v) => v ? open('speech') : close('speech'), impact: 'Medium', onUnload: () => unload('speech'), isLoaded: loadedModules.has('speech') },
      { id: 'midi', name: t.midiModal.title, isOpen: visibility.midi, setOpen: (v) => v ? open('midi') : close('midi'), impact: 'Low', onUnload: () => unload('midi'), isLoaded: loadedModules.has('midi') },
      { id: 'storageBench', name: t.storageBenchmark.title, isOpen: visibility.storageBench, setOpen: (v) => v ? open('storageBench') : close('storageBench'), impact: 'High', onUnload: () => unload('storageBench'), isLoaded: loadedModules.has('storageBench') },
      { id: 'heatmap', name: t.heatmap.title, isOpen: visibility.heatmap, setOpen: (v) => v ? open('heatmap') : close('heatmap'), impact: 'Medium', onUnload: () => unload('heatmap'), isLoaded: loadedModules.has('heatmap') },
      { id: 'rayTracing', name: t.rayTracing.title, isOpen: visibility.rayTracing, setOpen: (v) => v ? open('rayTracing') : close('rayTracing'), impact: 'High', onUnload: () => unload('rayTracing'), isLoaded: loadedModules.has('rayTracing') },
      { id: 'extensions', name: 'Browser Extensions', isOpen: visibility.extensions, setOpen: (v) => v ? open('extensions') : close('extensions'), impact: 'Low', onUnload: () => unload('extensions'), isLoaded: loadedModules.has('extensions') },
  ];

  // Initialize and listen to theme changes
  useEffect(() => {
      const savedTheme = getSavedTheme();
      setTheme(savedTheme);
      applyTheme(savedTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
          if (getSavedTheme() === 'system') {
              applyTheme('system');
          }
      };

      if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleSystemThemeChange);
          return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else if (mediaQuery.addListener) { // Fallback for older browsers
          mediaQuery.addListener(handleSystemThemeChange);
          return () => mediaQuery.removeListener(handleSystemThemeChange);
      }
  }, []);

  // Theme color class sync
  useEffect(() => {
      const colors = ['theme-indigo', 'theme-emerald', 'theme-rose', 'theme-amber', 'theme-blue', 'theme-violet', 'theme-sky', 'theme-cherry', 'theme-ice'];
      document.documentElement.classList.remove(...colors);
      if (themeColor !== 'indigo') {
          document.documentElement.classList.add(`theme-${themeColor}`);
      }
  }, [themeColor]);

  // Event listener for Storage Card custom event
  useEffect(() => {
      const handleStorageBench = () => open('storageBench');
      const handleHeatmap = () => open('heatmap');
      const handleRayTracing = () => open('rayTracing');
      
      window.addEventListener('open-storage-benchmark', handleStorageBench);
      window.addEventListener('open-heatmap', handleHeatmap);
      window.addEventListener('open-ray-tracing', handleRayTracing);
      
      return () => {
          window.removeEventListener('open-storage-benchmark', handleStorageBench);
          window.removeEventListener('open-heatmap', handleHeatmap);
          window.removeEventListener('open-ray-tracing', handleRayTracing);
      };
  }, [open]);

  // Initialize scrollbar state
  useEffect(() => {
      if (hideScrollbar) {
          document.documentElement.classList.add('scrollbar-hide');
      } else {
          document.documentElement.classList.remove('scrollbar-hide');
      }
  }, [hideScrollbar]);

  useEffect(() => {
      if (globalHideScrollbar) {
          document.documentElement.classList.add('global-scrollbar-hide');
      } else {
          document.documentElement.classList.remove('global-scrollbar-hide');
      }
  }, [globalHideScrollbar]);

  // Initialize blur state
  useEffect(() => {
      if (disableBlur) {
          document.body.classList.add('no-blur');
      } else {
          document.body.classList.remove('no-blur');
      }
  }, [disableBlur]);

  // Initialize animations state
  useEffect(() => {
      if (disableAnimations) {
          document.body.classList.add('disable-animations');
          document.body.classList.remove('fast-animations');
          let style = document.getElementById('disable-animations-style');
          if (!style) {
              style = document.createElement('style');
              style.id = 'disable-animations-style';
              style.innerHTML = `
                  *, *::before, *::after {
                      transition: none !important;
                      animation: none !important;
                      scroll-behavior: auto !important;
                  }
              `;
              document.head.appendChild(style);
          }
      } else {
          document.body.classList.remove('disable-animations');
          const style = document.getElementById('disable-animations-style');
          if (style) {
              style.remove();
          }

          if (fastAnimations) {
               document.body.classList.add('fast-animations');
          } else {
               document.body.classList.remove('fast-animations');
          }
      }
  }, [disableAnimations, fastAnimations]);

  const toggleTheme = () => {
      let newTheme: Theme;
      if (theme === 'system') newTheme = 'light';
      else if (theme === 'light') newTheme = 'dark';
      else newTheme = 'system';
      
      const updateTheme = () => {
          setTheme(newTheme);
          applyTheme(newTheme);
      };

      if (!document.startViewTransition || disableAnimations) {
          updateTheme();
      } else {
          document.startViewTransition(() => {
              updateTheme();
          });
      }
  };

  const updateHiddenCards = (cards: string[]) => {
      setHiddenCards(cards);
      localStorage.setItem('hiddenCards', JSON.stringify(cards));
      
      const advancedCards = ['hardware', 'fingerprint', 'ai', 'location', 'storage', 'permissions', 'media_devices', 'media_capabilities', 'pwa', 'features', 'user_agent'];
      const hasAllAdvanced = advancedCards.every(c => cards.includes(c));
      if (simpleMode !== hasAllAdvanced) {
          setSimpleMode(hasAllAdvanced);
          localStorage.setItem('simpleMode', String(hasAllAdvanced));
      }
  };

  const toggleSimpleMode = (value: boolean) => {
      setSimpleMode(value);
      localStorage.setItem('simpleMode', String(value));
      
      // 当用户打开/关闭极简模式时同步卡片的启用状态
      const advancedCards = ['hardware', 'fingerprint', 'ai', 'location', 'storage', 'permissions', 'media_devices', 'media_capabilities', 'pwa', 'features', 'user_agent'];
      if (value) {
          const newHidden = Array.from(new Set([...hiddenCards, ...advancedCards]));
          setHiddenCards(newHidden);
          localStorage.setItem('hiddenCards', JSON.stringify(newHidden));
      } else {
          const newHidden = hiddenCards.filter(c => !advancedCards.includes(c));
          setHiddenCards(newHidden);
          localStorage.setItem('hiddenCards', JSON.stringify(newHidden));
      }
  };

  const updateThemeColor = (color: string) => {
      setThemeColor(color);
      localStorage.setItem('themeColor', color);
  };

  const updateAnimationStyle = (style: string) => {
      setAnimationStyle(style);
      localStorage.setItem('animationStyle', style);
  };

  const toggleHideScrollbar = (value: boolean) => {
      setHideScrollbar(value);
      localStorage.setItem('hideScrollbar', String(value));
  };

  const toggleGlobalHideScrollbar = (value: boolean) => {
      setGlobalHideScrollbar(value);
      localStorage.setItem('globalHideScrollbar', String(value));
  };

  const updateTimeFormat = (format: '12' | '24') => {
      setTimeFormat(format);
      localStorage.setItem('timeFormat', format);
  };

  const toggleDisableBlur = (value: boolean) => {
      setDisableBlur(value);
      localStorage.setItem('disableBlur', String(value));
  };

  const toggleDisableAnimations = (value: boolean) => {
      setDisableAnimations(value);
      localStorage.setItem('disableAnimations', String(value));
  };

  const toggleFastAnimations = (value: boolean) => {
      setFastAnimations(value);
      localStorage.setItem('fastAnimations', String(value));
  };

  const toggleCollapseHeader = (value: boolean) => {
      setCollapseHeader(value);
      localStorage.setItem('collapseHeader', String(value));
  };

  const fetchData = async () => {
    // Reset to hidden state first
    setFadeLoader(true);
    setShowLoader(true);
    
    // Trigger entrance animation
    await new Promise(r => setTimeout(r, 50));
    setFadeLoader(false);
    
    // Start simulating steps immediately
    let stepIndex = 0;
    // Fix: access loading_steps from common
    const steps = t.common.loading_steps || [t.common.loading];
    setLoadingText(steps[0]);

    const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
            setLoadingText(steps[steps.length - 1]);
        }
    }, 250); 

    // Fetch data immediately without extra delays
    const info = await getAllData();
    clearInterval(interval);
    
    if (steps.length > 0) {
        setLoadingText(steps[steps.length - 1]);
    }
    
    setData(info);
    
    // Start fade out instantly
    setFadeLoader(true);
    setTimeout(() => {
        setShowLoader(false);
    }, 500);
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
                     (pos) => setGeoData({
                         latitude: pos.coords.latitude,
                         longitude: pos.coords.longitude,
                         accuracy: pos.coords.accuracy,
                         altitude: pos.coords.altitude,
                         altitudeAccuracy: pos.coords.altitudeAccuracy,
                         heading: pos.coords.heading,
                         speed: pos.coords.speed
                     }),
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
            open('camera');
        } else if (type === 'microphone') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            updatePermStatus('microphone', 'granted');
            stream.getTracks().forEach(t => t.stop());
            open('audio');
        } else if (type === 'geolocation') {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    updatePermStatus('geolocation', 'granted');
                    setGeoData({
                         latitude: pos.coords.latitude,
                         longitude: pos.coords.longitude,
                         accuracy: pos.coords.accuracy,
                         altitude: pos.coords.altitude,
                         altitudeAccuracy: pos.coords.altitudeAccuracy,
                         heading: pos.coords.heading,
                         speed: pos.coords.speed
                     });
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
                open('midi');
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
    exportAsJson(data, permStatus, geoData);
  };

  const handleAiRetest = () => {
      if (!data) return;
      const readiness = runAiReadinessCheck();
      setData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              ai: {
                  ...prev.ai,
                  readiness
              }
          };
      });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 scrollbar-hide relative">
      
      {/* Loading Overlay */}
      {showLoader && (
          <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out backdrop-blur-xl ${
                fadeLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                backgroundColor: 'rgba(var(--bg-slate-50), 0.8)' 
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

      {/* Lazy Loaded Modals wrapped in Suspense and ErrorBoundary */}
      <ErrorBoundary name="Modals">
        <Suspense fallback={<ModalLoading initializingText={(t as any).common?.modal_loading?.initializing} loadingText={(t as any).common?.modal_loading?.loading_module} />}>
            {isDevToolsFloating && (
                <FloatingWindow 
                    title={developerTabTitle} 
                    onClose={() => setIsDevToolsFloating(false)}
                    initialWidth={600}
                    initialHeight={400}
                >
                    <Components.developer 
                        t={t.settings.developer} 
                        isFloating={true} 
                        toggleFloat={() => setIsDevToolsFloating(false)} 
                    />
                </FloatingWindow>
            )}

            {visibility.camera && <Components.camera onClose={() => close('camera')} t={t.cameraTool} />}
            {visibility.audio && <Components.audio onClose={() => close('audio')} t={t.audioTool} />}
            {visibility.webgl && <Components.webgl extensions={data?.fingerprints.webglExtensions || []} onClose={() => close('webgl')} t={t.webglTool} />}
            {visibility.canvas && <Components.canvas imageSrc={data?.fingerprints.canvasImage || ''} onClose={() => close('canvas')} t={t.imageDetails} />}
            {visibility.base64 && <Components.base64 data={data?.fingerprints.canvasImage || ''} onClose={() => close('base64')} t={t.base64Tool} />}
            {visibility.about && <Components.about onClose={() => close('about')} t={t.aboutModal} />}
            {visibility.sensor && <Components.sensor onClose={() => close('sensor')} t={t.sensorModal} />}
            {visibility.score && data && <Components.score scoreData={data.fingerprints.score} onClose={() => close('score')} t={t.scoreModal} />}
            {visibility.fingerprint && <Components.fingerprint onClose={() => close('fingerprint')} t={t.fingerprintModal} />}
            {visibility.speed && <Components.speed onClose={() => close('speed')} t={t.speedTest} />}
            {visibility.compute && <Components.compute onClose={() => close('compute')} t={t.computeStress} />}
            
            {visibility.settings && (
                <Components.settings
                    onClose={() => close('settings')}
                    t={t} /* Pass root translation object to support modular settings */
                    themeColor={themeColor}
                    setThemeColor={updateThemeColor}
                    animationStyle={animationStyle}
                    setAnimationStyle={updateAnimationStyle}
                    simpleMode={simpleMode}
                    toggleSimpleMode={toggleSimpleMode}
                    hideScrollbar={hideScrollbar}
                    toggleHideScrollbar={toggleHideScrollbar}
                    globalHideScrollbar={globalHideScrollbar}
                    toggleGlobalHideScrollbar={toggleGlobalHideScrollbar}
                    timeFormat={timeFormat}
                    setTimeFormat={updateTimeFormat}
                    disableBlur={disableBlur}
                    toggleDisableBlur={toggleDisableBlur}
                    disableAnimations={disableAnimations}
                    toggleDisableAnimations={toggleDisableAnimations}
                    fastAnimations={fastAnimations}
                    toggleFastAnimations={toggleFastAnimations}
                    collapseHeader={collapseHeader}
                    toggleCollapseHeader={toggleCollapseHeader}
                    hiddenCards={hiddenCards}
                    setHiddenCards={updateHiddenCards}
                    isDevToolsFloating={isDevToolsFloating}
                    setDevToolsFloating={setIsDevToolsFloating}
                    moduleStates={modalStates}
                />
            )}
            
            {visibility.benchmark && <Components.benchmark onClose={() => close('benchmark')} t={t.benchmarkModal} />}
            {visibility.tools && (
                <Components.tools 
                    onClose={() => close('tools')} 
                    t={t.hardwareToolsModal} 
                    values={t.values} 
                    labels={t.labels} 
                />
            )}
            
            {visibility.ai && <Components.ai onClose={() => close('ai')} t={t.aiPlayground} />}
            {visibility.gamepad && <Components.gamepad onClose={() => close('gamepad')} t={t.gamepadTool} />}
            {visibility.webDevice && <Components.webDevice onClose={() => close('webDevice')} t={t.webDevice} />}
            {visibility.vision && <Components.vision onClose={() => close('vision')} t={t.visionModal} />}
            {visibility.video && (
                <Components.video 
                    onClose={() => close('video')} 
                    t={t.hardwareToolsModal}
                    values={t.values}
                    labels={t.labels}
                />
            )}
            {visibility.graphics && (
                <Components.graphics 
                    onClose={() => close('graphics')} 
                    t={t.graphicsModal} 
                />
            )}
            {visibility.speech && (
                <Components.speech 
                    onClose={() => close('speech')} 
                    t={t.speechModal} 
                />
            )}
            {visibility.midi && (
                <Components.midi 
                    onClose={() => close('midi')} 
                    t={t.midiModal} 
                />
            )}
            {visibility.storageBench && (
                <Components.storageBench 
                    onClose={() => close('storageBench')} 
                    t={t.storageBenchmark} 
                />
            )}
            {visibility.heatmap && (
                <Components.heatmap 
                    onClose={() => close('heatmap')} 
                    t={t.heatmap} 
                />
            )}
            {visibility.rayTracing && (
                <Components.rayTracing 
                    onClose={() => close('rayTracing')} 
                    t={t.rayTracing} 
                />
            )}
            {visibility.extensions && (
                <Components.extensions 
                    onClose={() => close('extensions')} 
                    t={(t as any).extensionsModal}
                />
            )}
        </Suspense>
      </ErrorBoundary>

      <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        
        <Header 
          t={t}
          lang={lang}
          setLang={changeLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onRefresh={fetchData}
          onExport={handleExportJSON}
          onOpenSettings={() => open('settings')}
          onOpenAbout={() => open('about')}
          onOpenBenchmark={() => open('benchmark')}
          collapseHeader={collapseHeader}
        />

        {/* Main Content - Only render if data exists */}
        {data && (
            <ErrorBoundary name="MainContent">
                <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>}>
                    <div key={animationStyle} className={`space-y-6 ${animationStyle === 'slide-up' ? 'anim-slide-up' : animationStyle === 'fade' ? 'anim-fade' : animationStyle === 'fly-in' ? 'anim-fly-in' : animationStyle === 'zoom' ? 'anim-zoom' : ''}`}>
                    
                    {/* Group 0: Environment & Trust */}
                    {!hiddenCards.includes('environment') && (
                    <SectionGroup title={(t as any).groups?.environment || 'Environment & Trust'} icon={<ShieldAlert className="text-emerald-500" />}>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <EnvironmentCard t={t} />
                        </div>
                    </SectionGroup>
                    )}

                    {/* Group 1: Device & System */}
                    {(!hiddenCards.includes('system') || !hiddenCards.includes('hardware') || !hiddenCards.includes('display')) && (
                    <SectionGroup title={(t as any).groups?.system || 'Device & System Core'} icon={<Smartphone className="text-indigo-500" />}>
                        {!hiddenCards.includes('system') && (
                        <SystemCard 
                            data={data.system} 
                            t={t} 
                            simpleMode={simpleMode}
                            lang={lang}
                        />
                        )}

                        {!hiddenCards.includes('hardware') && (
                        <HardwareCard 
                            data={data.hardware} 
                            t={t} 
                            onOpenGamepad={() => open('gamepad')}
                            onOpenWebDevice={() => open('webDevice')}
                            onOpenSensors={() => open('sensor')}
                            onOpenTools={() => open('tools')}
                            onOpenVision={() => open('vision')}
                            onOpenGraphics={() => open('graphics')}
                            onOpenMidi={() => requestPermission('midi')}
                        />
                        )}

                        {!hiddenCards.includes('display') && (
                        <DisplayCard 
                            data={data.display} 
                            screenExtended={data.hardware.screenExtended} 
                            t={t} 
                            simpleMode={simpleMode} 
                        />
                        )}
                    </SectionGroup>
                    )}

                    {/* Group 2: Network & Security */}
                    {(!hiddenCards.includes('network') || !hiddenCards.includes('security') || !hiddenCards.includes('fingerprint')) && (
                    <SectionGroup title={(t as any).groups?.network || 'Network & Security'} icon={<ShieldAlert className="text-emerald-500" />}>
                        {!hiddenCards.includes('network') && (
                        <NetworkCard 
                            data={data.network} 
                            t={t} 
                            simpleMode={simpleMode} 
                            onOpenSpeedTest={() => open('speed')}
                        />
                        )}
                        
                        {!hiddenCards.includes('security') && (
                        <SecurityCard 
                            data={data.security} 
                            webrtcIp={data.network.webrtcIp} 
                            t={t} 
                            simpleMode={simpleMode} 
                            onOpenExtensions={() => open('extensions')}
                        />
                        )}

                        {!hiddenCards.includes('fingerprint') && (
                        <FingerprintCard 
                            data={data.fingerprints}
                            audioSampleRate={data.hardware.audioSampleRate}
                            t={t}
                            simpleMode={simpleMode}
                            onOpenScore={() => open('score')}
                            onOpenCanvas={() => open('canvas')}
                            onOpenBase64={() => open('base64')}
                            onOpenWebgl={() => open('webgl')}
                            onOpenFingerprintModal={() => open('fingerprint')}
                        />
                        )}
                    </SectionGroup>
                    )}

                    {/* Group 3: Advanced Capabilities & APIs */}
                    {(!hiddenCards.includes('ai') || !hiddenCards.includes('location') || !hiddenCards.includes('storage') || !hiddenCards.includes('permissions') || !hiddenCards.includes('media_devices') || !hiddenCards.includes('media_capabilities') || !hiddenCards.includes('user_agent')) && (
                    <SectionGroup title={(t as any).groups?.advanced || 'Capabilities & APIs'} icon={<Cpu className="text-amber-500" />}>
                                {!hiddenCards.includes('ai') && (
                                <AiComputeCard 
                                    data={data.ai} 
                                    t={t} 
                                    onOpenPlayground={() => open('ai')} 
                                    onOpenStress={() => open('compute')}
                                    onRetest={handleAiRetest}
                                />
                                )}
                                
                                {!hiddenCards.includes('location') && (
                                <LocationCard 
                                    data={data.localization}
                                    geoData={geoData}
                                    permStatus={permStatus.geolocation}
                                    t={t}
                                    onRequestPermission={() => requestPermission('geolocation')}
                                    timeFormat={timeFormat}
                                    lang={lang}
                                />
                                )}

                                {!hiddenCards.includes('storage') && (
                                <StorageCard data={data.storage} t={t} />
                                )}
                                
                                {!hiddenCards.includes('permissions') && (
                                <PermissionsCard 
                                    permStatus={permStatus} 
                                    geoData={geoData} 
                                    t={t} 
                                    onRequestPermission={requestPermission} 
                                />
                                )}

                                {!hiddenCards.includes('media_devices') && (
                                <MediaDevicesCard 
                                    permStatus={permStatus}
                                    t={t}
                                    onRequestPermission={requestPermission}
                                    onOpenCamera={() => open('camera')}
                                    onOpenMic={() => open('audio')}
                                />
                                )}

                                {!hiddenCards.includes('media_capabilities') && (
                                <MediaCapabilitiesCard 
                                    data={data.media} 
                                    t={t} 
                                    onOpenVideoTest={() => open('video')}
                                    onOpenSpeech={() => open('speech')}
                                />
                                )}

                                {!hiddenCards.includes('user_agent') && (
                                <UserAgentCard userAgent={data.system.userAgent} clientHints={data.system.clientHints} t={t} />
                                )}
                            </SectionGroup>
                            )}

                            {!hiddenCards.includes('pwa') && (
                            <div className="anim-slide-up delay-100">
                                <PwaSection isPwaInstalled={data.system.isPwaInstalled} features={data.pwaFeatures} t={t} />
                            </div>
                            )}
                            
                            {!hiddenCards.includes('features') && (
                            <div className="anim-slide-up delay-200">
                                <FeaturesSection features={data.features} t={t} />
                            </div>
                            )}
                </div>
                </Suspense>
            </ErrorBoundary>
        )}

        <Footer text={t.meta.footer} />
      </div>
    </div>
  );
};
export default App;
