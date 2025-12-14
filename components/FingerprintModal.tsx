
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Fingerprint, Settings, RefreshCw, Copy, Check, Info, Box, Cpu } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

// Simple MurmurHash3 implementation for custom component hashing
function murmurhash3_32_gc(key: string, seed: number) {
  let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

  remainder = key.length & 3; // key.length % 4
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
      k1 = 
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;
      
      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);
      
      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = ((((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

interface Component {
  key: string;
  value: any;
  enabled: boolean;
}

interface FingerprintModalProps {
  onClose: () => void;
  t: Translation['fingerprintModal'];
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'v4' | 'v2'>('v4');
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [visitorId, setVisitorId] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [salt, setSalt] = useState('');
  const [copied, setCopied] = useState(false);

  // Initial animation
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

  // Run Fingerprint Logic
  const runFingerprint = useCallback(async () => {
    setLoading(true);
    const startTime = performance.now();
    setComponents([]);
    setVisitorId('');

    try {
      let rawComponents: Record<string, any> = {};

      if (activeTab === 'v4') {
        // Load v4
        // @ts-ignore
        const fpPromise = import('https://esm.sh/@fingerprintjs/fingerprintjs@4.5.1')
          .then((FingerprintJS) => FingerprintJS.load());
        
        const fp = await fpPromise;
        const result = await fp.get();
        
        // Convert v4 components object to our format
        if (result.components) {
            Object.entries(result.components).forEach(([key, val]: [string, any]) => {
                rawComponents[key] = val.value;
            });
        }
      } else {
        // Load v2 (Fingerprintjs2)
        // @ts-ignore
        const Fingerprint2 = await import('https://esm.sh/fingerprintjs2@2.1.4');
        
        // V2 uses a callback pattern usually, but we wrap in promise
        const componentsV2 = await new Promise<any[]>((resolve) => {
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    // @ts-ignore
                    Fingerprint2.default.get((components) => resolve(components));
                });
            } else {
                setTimeout(() => {
                    // @ts-ignore
                    Fingerprint2.default.get((components) => resolve(components));
                }, 500);
            }
        });

        componentsV2.forEach((c) => {
            rawComponents[c.key] = c.value;
        });
      }

      // Transform to state format
      const comps: Component[] = Object.keys(rawComponents).map(key => ({
          key,
          value: rawComponents[key],
          enabled: true
      }));

      setComponents(comps);
      
      // Initial Hash Calculation
      calculateHash(comps, salt, startTime);

    } catch (e) {
      console.error("Fingerprint error:", e);
      setVisitorId("Error loading library");
      setLoading(false);
    }
  }, [activeTab, salt]);

  // Recalculate hash based on enabled components and salt
  const calculateHash = (currentComponents: Component[], currentSalt: string, startTime?: number) => {
      const start = startTime || performance.now();
      
      const enabledValues = currentComponents
        .filter(c => c.enabled)
        .map(c => {
            // Normalize value to string for hashing
            const val = c.value;
            return typeof val === 'object' ? JSON.stringify(val) : String(val);
        });
      
      // Add salt if present
      if (currentSalt) {
          enabledValues.push(currentSalt);
      }

      const joined = enabledValues.join(':::');
      const hash = murmurhash3_32_gc(joined, 31);
      const hexHash = hash.toString(16).padStart(8, '0'); // emulate typical 32bit hash hex

      setVisitorId(hexHash);
      setTimeTaken(Math.round(performance.now() - start));
      setLoading(false);
  };

  // Effect to run on tab change
  useEffect(() => {
      runFingerprint();
  }, [activeTab]); // Removed runFingerprint from dep to avoid loop, dependent only on activeTab

  // Handle Toggle Component
  const toggleComponent = (key: string) => {
      const updated = components.map(c => 
          c.key === key ? { ...c, enabled: !c.enabled } : c
      );
      setComponents(updated);
      calculateHash(updated, salt);
  };

  // Handle Select/Deselect All
  const toggleAll = (select: boolean) => {
      const updated = components.map(c => ({ ...c, enabled: select }));
      setComponents(updated);
      calculateHash(updated, salt);
  };

  // Handle Salt Change
  const handleSaltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSalt = e.target.value;
      setSalt(newSalt);
      calculateHash(components, newSalt);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(visitorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Fingerprint className="text-indigo-600 dark:text-indigo-400" />
                {t.title}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs & Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shrink-0">
            {/* Version Tabs */}
            <div className="md:col-span-4 flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('v4')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'v4' 
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                >
                    {t.tab_v4}
                </button>
                <button
                    onClick={() => setActiveTab('v2')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'v2' 
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                >
                    {t.tab_v2}
                </button>
            </div>

            {/* Salt Input */}
            <div className="md:col-span-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Settings size={14} className="text-slate-400" />
                </div>
                <input 
                    type="text" 
                    value={salt}
                    onChange={handleSaltChange}
                    placeholder={t.salt_label}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Result Box */}
            <div className="md:col-span-4 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-indigo-400 uppercase font-semibold tracking-wider">{t.visitor_id}</span>
                    {loading ? (
                        <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 animate-pulse">{t.generating}</span>
                    ) : (
                        <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-300">{visitorId}</span>
                    )}
                </div>
                {!loading && (
                    <div className="text-right">
                         <span className="text-[10px] text-slate-400 block">{t.time_taken}</span>
                         <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{timeTaken} ms</span>
                    </div>
                )}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Components List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.components_label}</span>
                    <div className="flex gap-2">
                         <button onClick={() => toggleAll(true)} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">{t.select_all}</button>
                         <button onClick={() => toggleAll(false)} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">{t.deselect_all}</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    {components.map((comp) => (
                        <label 
                            key={comp.key} 
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                                comp.enabled 
                                ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700' 
                                : 'bg-slate-50 dark:bg-slate-900/50 opacity-60'
                            }`}
                        >
                            <input 
                                type="checkbox" 
                                checked={comp.enabled} 
                                onChange={() => toggleComponent(comp.key)}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{comp.key}</div>
                                <div className="text-[10px] text-slate-400 truncate">
                                    {typeof comp.value === 'object' ? '[Complex Object]' : String(comp.value)}
                                </div>
                            </div>
                        </label>
                    ))}
                    {components.length === 0 && !loading && (
                        <div className="text-center p-8 text-slate-400 text-sm">No components loaded</div>
                    )}
                </div>
            </div>

            {/* JSON Viewer */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <Box size={14} className="text-slate-500" />
                         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Data Source</span>
                     </div>
                     <span className="text-[10px] text-slate-400">
                         {components.filter(c => c.enabled).length} items included
                     </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <pre className="font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all">
                        {JSON.stringify(
                            components.filter(c => c.enabled).reduce((acc, curr) => ({
                                ...acc,
                                [curr.key]: curr.value
                            }), {}), 
                            null, 
                            2
                        )}
                    </pre>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end gap-3">
            <button 
                onClick={handleCopy}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t.copied : t.copy}
            </button>
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
