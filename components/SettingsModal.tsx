
import React, { useState, useEffect } from 'react';
import { X, Network, Globe, Database, Activity, Wifi, CheckCircle, AlertCircle, RefreshCw, Sliders, ToggleLeft, ToggleRight, Monitor, Trash2, MapPin } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface SettingsModalProps {
  onClose: () => void;
  t: Translation['settingsModal'];
  simpleMode: boolean;
  toggleSimpleMode: (value: boolean) => void;
}

interface CDNStatus {
  name: string;
  url: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  latency: number;
}

interface ResourceItem {
  name: string;
  type: string;
  duration: number;
}

interface IpInfo {
    ip: string;
    success: boolean;
    type: string;
    continent: string;
    country: string;
    region: string;
    city: string;
    isp: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, t, simpleMode, toggleSimpleMode }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'network' | 'display' | 'storage' | 'res'>('general');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Network: IP Info
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loadingIp, setLoadingIp] = useState(false);

  // Network: CDN State
  const [cdns, setCdns] = useState<CDNStatus[]>([
    { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com', status: 'idle', latency: 0 },
    { name: 'Lucide Icons', url: 'https://esm.sh/lucide-react@0.263.1', status: 'idle', latency: 0 },
    { name: 'React', url: 'https://esm.sh/react@18.2.0', status: 'idle', latency: 0 },
    { name: 'FingerprintJS', url: 'https://esm.sh/@fingerprintjs/fingerprintjs@4.5.1', status: 'idle', latency: 0 }
  ]);

  // Network: Connectivity State
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{status: string, latency?: number, code?: number} | null>(null);
  const [testingConn, setTestingConn] = useState(false);

  // Display Test State
  const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);

  // Storage State
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [sessionStorageCount, setSessionStorageCount] = useState(0);
  const [swCount, setSwCount] = useState<number | null>(null);

  // Resources State
  const [resources, setResources] = useState<ResourceItem[]>([]);

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

  // --- Network Logic ---
  const fetchIpInfo = async () => {
      setLoadingIp(true);
      try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          setIpInfo(data);
      } catch (e) {
          console.error("IP Fetch Error", e);
      }
      setLoadingIp(false);
  };

  const checkCDN = async (index: number) => {
      const cdn = cdns[index];
      const newCdns = [...cdns];
      newCdns[index].status = 'loading';
      setCdns(newCdns);

      const start = performance.now();
      try {
          await fetch(cdn.url, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
          const end = performance.now();
          newCdns[index].status = 'success';
          newCdns[index].latency = Math.round(end - start);
      } catch (e) {
          console.error(e);
          newCdns[index].status = 'error';
      }
      setCdns([...newCdns]);
  };

  const checkAllCDNs = () => {
      cdns.forEach((_, idx) => checkCDN(idx));
  };

  const runConnectivityTest = async () => {
      if (!testUrl) return;
      setTestingConn(true);
      setTestResult(null);

      let urlToTest = testUrl;
      if (!/^https?:\/\//i.test(urlToTest)) {
          urlToTest = 'https://' + urlToTest;
      }

      const start = performance.now();
      try {
          await fetch(urlToTest, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
          const end = performance.now();
          setTestResult({
              status: 'Success',
              latency: Math.round(end - start),
              code: 200
          });
      } catch (e) {
          setTestResult({
              status: 'Failed (Network Error)',
          });
      }
      setTestingConn(false);
  };

  // --- Storage Logic ---
  useEffect(() => {
      if (activeTab === 'storage') {
          setLocalStorageCount(localStorage.length);
          setSessionStorageCount(sessionStorage.length);
          if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(regs => {
                  setSwCount(regs.length);
              });
          }
      }
  }, [activeTab]);

  const clearStorage = () => {
      localStorage.clear();
      sessionStorage.clear();
      setLocalStorageCount(0);
      setSessionStorageCount(0);
  };

  const unregisterSW = async () => {
      if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) {
              await reg.unregister();
          }
          setSwCount(0);
      }
  };

  // --- Resources Logic ---
  useEffect(() => {
      if (activeTab === 'res') {
          const perfEntries = performance.getEntriesByType('resource');
          const resList: ResourceItem[] = perfEntries.map(entry => ({
              name: entry.name,
              type: (entry as PerformanceResourceTiming).initiatorType,
              duration: entry.duration
          }));
          setResources(resList);
      }
  }, [activeTab]);


  // Full Screen Color Overlay
  if (fullScreenColor) {
      return (
          <div 
            className="fixed inset-0 z-[100] cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: fullScreenColor }}
            onClick={() => setFullScreenColor(null)}
          >
              <div className="bg-black/50 text-white px-4 py-2 rounded-full text-xs pointer-events-none select-none backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity">
                  Click anywhere to exit
              </div>
          </div>
      );
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="text-indigo-600 dark:text-indigo-400" />
                {t.title}
              </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Layout Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shrink-0 md:w-56 overflow-x-auto md:overflow-visible">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'general' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Sliders size={16} />
                    {t.tab_general}
                </button>
                <button 
                    onClick={() => setActiveTab('network')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'network' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Globe size={16} />
                    {t.tab_network}
                </button>
                <button 
                    onClick={() => setActiveTab('display')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'display' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Monitor size={16} />
                    {t.tab_display}
                </button>
                <button 
                    onClick={() => setActiveTab('storage')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'storage' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Database size={16} />
                    {t.tab_storage}
                </button>
                <button 
                    onClick={() => setActiveTab('res')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'res' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Activity size={16} />
                    {t.tab_resources}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
                
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    {t.simple_mode_title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                    {t.simple_mode_desc}
                                </p>
                            </div>
                            <button 
                                onClick={() => toggleSimpleMode(!simpleMode)}
                                className={`text-3xl transition-colors ${simpleMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}
                            >
                                {simpleMode ? <ToggleRight size={40} fill="currentColor" className="opacity-20" /> : <ToggleLeft size={40} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Network Tab (Combined) */}
                {activeTab === 'network' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                        
                        {/* Public IP Section */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.public_ip}</h3>
                                <button 
                                    onClick={fetchIpInfo}
                                    disabled={loadingIp}
                                    className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors font-medium flex items-center gap-1"
                                >
                                    {loadingIp ? <Activity size={12} className="animate-spin" /> : <Globe size={12} />}
                                    {t.fetch_ip}
                                </button>
                            </div>
                            
                            {ipInfo ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono tracking-tight">{ipInfo.ip}</span>
                                        <span className="text-xs text-slate-400 mt-1">{ipInfo.type}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Network size={14} className="text-indigo-500" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{ipInfo.isp}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-emerald-500" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{ipInfo.city}, {ipInfo.country}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                                    Click to detect public IP information
                                </div>
                            )}
                        </div>

                        {/* Connectivity Test */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{t.test_conn}</h3>
                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="text" 
                                    value={testUrl}
                                    onChange={(e) => setTestUrl(e.target.value)}
                                    placeholder={t.url_placeholder}
                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && runConnectivityTest()}
                                />
                                <button 
                                    onClick={runConnectivityTest}
                                    disabled={testingConn || !testUrl}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    {testingConn ? <Activity className="animate-spin" size={18} /> : <Wifi size={18} />}
                                    Test
                                </button>
                            </div>
                            {testResult && (
                                <div className={`p-4 rounded-lg flex items-center justify-between ${testResult.status.includes('Success') ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300'}`}>
                                    <span className="font-medium">{testResult.status}</span>
                                    {testResult.latency !== undefined && (
                                        <span className="font-mono font-bold">{testResult.latency} ms</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CDN Status */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.cdn_status}</h3>
                                <button onClick={checkAllCDNs} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                    {t.check_all}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {cdns.map((cdn, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                                        <div className="flex flex-col min-w-0 mr-4">
                                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{cdn.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {cdn.status === 'idle' && <span className="w-2 h-2 rounded-full bg-slate-300" />}
                                            {cdn.status === 'loading' && <Activity className="animate-spin text-indigo-500" size={16} />}
                                            {cdn.status === 'success' && <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">{cdn.latency}ms</span>}
                                            {cdn.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Display Test Tab */}
                {activeTab === 'display' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center mb-6">
                            <Monitor size={48} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t.dead_pixel_title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.dead_pixel_desc}</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                <button onClick={() => setFullScreenColor('#ff0000')} className="h-16 rounded-lg bg-red-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_red}</button>
                                <button onClick={() => setFullScreenColor('#00ff00')} className="h-16 rounded-lg bg-green-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_green}</button>
                                <button onClick={() => setFullScreenColor('#0000ff')} className="h-16 rounded-lg bg-blue-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_blue}</button>
                                <button onClick={() => setFullScreenColor('#ffffff')} className="h-16 rounded-lg bg-white border border-slate-200 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-black font-bold text-xs">{t.color_white}</button>
                                <button onClick={() => setFullScreenColor('#000000')} className="h-16 rounded-lg bg-black hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_black}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Storage Tab */}
                {activeTab === 'storage' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        
                        {/* Local Data */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.storage_title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.clear_data}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={clearStorage}
                                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    {t.clear_btn}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 mb-1">Local Storage Items</div>
                                    <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{localStorageCount}</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 mb-1">Session Storage Items</div>
                                    <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{sessionStorageCount}</div>
                                </div>
                            </div>
                        </div>

                        {/* Service Workers */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.sw_title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.sw_desc}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={unregisterSW}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {t.sw_btn}
                                </button>
                            </div>
                            {swCount !== null && (
                                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Registrations</span>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{swCount}</span>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'res' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.resource_list} ({resources.length})</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{t.res_name}</th>
                                        <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-32">{t.res_type}</th>
                                        <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-32 text-right">{t.res_duration}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {resources.map((res, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-2 max-w-xs md:max-w-md lg:max-w-xl truncate text-slate-700 dark:text-slate-300 font-mono text-xs" title={res.name}>
                                                {res.name}
                                            </td>
                                            <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                                                    {res.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right font-mono text-slate-600 dark:text-slate-400">
                                                {res.duration.toFixed(1)} ms
                                            </td>
                                        </tr>
                                    ))}
                                    {resources.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No external resources detected via Performance API.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end">
            <button 
                onClick={handleClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                {t.close}
            </button>
        </div>

      </div>
    </div>
  );
};
