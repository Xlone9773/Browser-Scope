
import React, { useState, useEffect } from 'react';
import { X, Network, Globe, Database, Activity, Wifi, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface SettingsModalProps {
  onClose: () => void;
  t: Translation['settingsModal'];
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

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'cdn' | 'conn' | 'res'>('cdn');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // CDN State
  const [cdns, setCdns] = useState<CDNStatus[]>([
    { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com', status: 'idle', latency: 0 },
    { name: 'Lucide Icons', url: 'https://esm.sh/lucide-react@0.263.1', status: 'idle', latency: 0 },
    { name: 'React', url: 'https://esm.sh/react@18.2.0', status: 'idle', latency: 0 },
    { name: 'FingerprintJS', url: 'https://esm.sh/@fingerprintjs/fingerprintjs@4.5.1', status: 'idle', latency: 0 }
  ]);

  // Connectivity State
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{status: string, latency?: number, code?: number} | null>(null);
  const [testingConn, setTestingConn] = useState(false);

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

  // --- CDN Logic ---
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
          // Note: mode: 'no-cors' usually allows opaque response which doesn't throw, 
          // but network errors (offline, DNS) will throw.
          console.error(e);
          newCdns[index].status = 'error';
      }
      setCdns([...newCdns]);
  };

  const checkAllCDNs = () => {
      cdns.forEach((_, idx) => checkCDN(idx));
  };

  // --- Connectivity Logic ---
  const runConnectivityTest = async () => {
      if (!testUrl) return;
      setTestingConn(true);
      setTestResult(null);

      // Add protocol if missing
      let urlToTest = testUrl;
      if (!/^https?:\/\//i.test(urlToTest)) {
          urlToTest = 'https://' + urlToTest;
      }

      const start = performance.now();
      try {
          // We use no-cors to avoid CORS errors blocking the fetch entirely, 
          // allowing us to measure time-to-first-byte roughly / connectivity.
          await fetch(urlToTest, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
          const end = performance.now();
          setTestResult({
              status: 'Success',
              latency: Math.round(end - start),
              code: 200 // Opaque response
          });
      } catch (e) {
          setTestResult({
              status: 'Failed (Network Error)',
          });
      }
      setTestingConn(false);
  };

  // --- Resources Logic ---
  useEffect(() => {
      if (activeTab === 'res') {
          // Get performance entries
          const perfEntries = performance.getEntriesByType('resource');
          const resList: ResourceItem[] = perfEntries.map(entry => ({
              name: entry.name,
              type: (entry as PerformanceResourceTiming).initiatorType,
              duration: entry.duration
          }));
          setResources(resList);
      }
  }, [activeTab]);


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
                <Network className="text-indigo-600 dark:text-indigo-400" />
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
            
            {/* Navigation Tabs (Top on mobile, Sidebar on Desktop) */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shrink-0 md:w-56 overflow-x-auto md:overflow-visible">
                <button 
                    onClick={() => setActiveTab('cdn')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'cdn' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Activity size={16} />
                    {t.tab_cdn}
                </button>
                <button 
                    onClick={() => setActiveTab('conn')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'conn' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Globe size={16} />
                    {t.tab_conn}
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
                    <Database size={16} />
                    {t.tab_resources}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
                
                {/* CDN Tab */}
                {activeTab === 'cdn' && (
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.cdn_status}</h3>
                            <button onClick={checkAllCDNs} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors font-medium flex items-center gap-1">
                                <RefreshCw size={12} />
                                {t.check_all}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {cdns.map((cdn, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                                    <div className="flex flex-col min-w-0 mr-4">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{cdn.name}</span>
                                        <span className="text-xs text-slate-400 truncate">{cdn.url}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {cdn.status === 'idle' && (
                                            <button onClick={() => checkCDN(idx)} className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-500 hover:bg-slate-200 transition-colors">Check</button>
                                        )}
                                        {cdn.status === 'loading' && (
                                            <Activity className="animate-spin text-indigo-500" size={18} />
                                        )}
                                        {cdn.status === 'success' && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{cdn.latency}ms</span>
                                                <CheckCircle className="text-emerald-500" size={18} />
                                            </div>
                                        )}
                                        {cdn.status === 'error' && (
                                            <AlertCircle className="text-red-500" size={18} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Connectivity Tab */}
                {activeTab === 'conn' && (
                    <div className="max-w-xl mx-auto space-y-6 pt-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target URL</label>
                            <div className="flex gap-2">
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
                                    {t.test_conn}
                                </button>
                            </div>
                        </div>

                        {testResult && (
                            <div className={`p-6 rounded-xl border ${testResult.status.includes('Success') ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'}`}>
                                <h4 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    {t.test_result}
                                    {testResult.status.includes('Success') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded">
                                        <span className="text-xs text-slate-500 block mb-1">Status</span>
                                        <span className="font-semibold">{testResult.status}</span>
                                    </div>
                                    {testResult.latency !== undefined && (
                                        <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded">
                                            <span className="text-xs text-slate-500 block mb-1">{t.latency}</span>
                                            <span className="font-mono font-semibold text-lg">{testResult.latency} ms</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
