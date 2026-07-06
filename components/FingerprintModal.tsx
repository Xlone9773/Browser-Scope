
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Fingerprint, Settings, Copy, Check, Info, Box, Type, RefreshCw } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

// Simple MurmurHash3 implementation for custom component hashing
function murmurhash3_32_gc(key: string, seed: number) {
  let remainder, bytes, h1, h1b, c1, _c1b, c2, _c2b, k1, i;

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
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1 >>> 16) + 0xe654) & 0xffff) << 16));
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
  value: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  enabled: boolean;
}

interface FingerprintModalProps {
  onClose: () => void;
  t: Translation['fingerprintModal'];
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'v5' | 'v4' | 'v2' | 'fonts'>('v5');
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]);
  const [visitorId, setVisitorId] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [salt, setSalt] = useState('');
  const [copied, setCopied] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    workerRef.current = new Worker(new URL('../services/app.worker.ts', import.meta.url), { type: 'module' });

    return () => {
      isMountedRef.current = false;
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Font Detection Logic
  const detectFonts = useCallback(() => {
      setLoading(true);
      // Defer the CPU-heavy DOM manipulation to the next tick, allowing React to complete tab-switching transition rendering smoothly.
      setTimeout(() => {
          if (!isMountedRef.current) return;
          const startTime = performance.now();
          
          const fontList = [
              'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 
              'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
              'Microsoft YaHei', 'SimSun', 'SimHei', 'PingFang SC', 'Hiragino Sans GB'
          ];
          
          const baseFonts = ['monospace', 'sans-serif', 'serif'];
          const testString = "mmmmmmmmmmlli";
          const testSize = "72px";
          const h = document.getElementsByTagName("body")[0];
          if (!h) {
              setLoading(false);
              return;
          }
          
          const s = document.createElement("span");
          s.style.fontSize = testSize;
          s.innerHTML = testString;
          s.style.visibility = "hidden";
          s.style.position = "absolute";
          s.style.left = "-9999px";
          
          const defaultWidths: Record<string, number> = {};
          
          // Get base widths
          baseFonts.forEach(base => {
              s.style.fontFamily = base;
              h.appendChild(s);
              defaultWidths[base] = s.offsetWidth;
              h.removeChild(s);
          });
          
          const detected: string[] = [];
          
          fontList.forEach(font => {
              let matched = false;
              for (const base of baseFonts) {
                  s.style.fontFamily = `'${font}', ${base}`;
                  h.appendChild(s);
                  const w = s.offsetWidth;
                  h.removeChild(s);
                  if (w !== defaultWidths[base]) {
                      matched = true;
                      break;
                  }
              }
              if (matched) detected.push(font);
          });
          
          if (!isMountedRef.current) return;
          setDetectedFonts(detected);
          const elapsed = Math.round(performance.now() - startTime);
          setTimeTaken(elapsed);
          setLoading(false);

          // Save to localStorage
          try {
              localStorage.setItem('browserscope_fp_fonts_data', JSON.stringify({
                  detectedFonts: detected,
                  timeTaken: elapsed
              }));
          } catch (err) {
              console.error('Failed to save fonts cache to localStorage:', err);
          }
      }, 50);
  }, []);

  // Recalculate hash based on enabled components and salt
  const calculateHash = useCallback((currentComponents: Component[], currentSalt: string, startTime?: number) => {
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

      const saveToCache = (hexHash: string, elapsed: number) => {
          if (!isMountedRef.current) return;
          try {
              const cacheKey = `browserscope_fp_${activeTab}_data`;
              localStorage.setItem(cacheKey, JSON.stringify({
                  visitorId: hexHash,
                  components: currentComponents,
                  timeTaken: elapsed,
                  salt: currentSalt
              }));
          } catch (err) {
              console.error(`Failed to save ${activeTab} cache to localStorage:`, err);
          }
      };

      if (workerRef.current) {
          const handleResult = (e: MessageEvent) => {
              if (e.data.type === 'hash') {
                  workerRef.current?.removeEventListener('message', handleResult);
                  if (e.data.success && isMountedRef.current) {
                      setVisitorId(e.data.hexHash);
                      const elapsed = Math.round(performance.now() - start);
                      setTimeTaken(elapsed);
                      setLoading(false);
                      saveToCache(e.data.hexHash, elapsed);
                  }
              }
          };
          workerRef.current.addEventListener('message', handleResult);
          workerRef.current.postMessage({ type: 'hash', key: joined, seed: 31 });
      } else {
          // Fallback if worker isn't loaded yet
          const hash = murmurhash3_32_gc(joined, 31);
          const hexHash = hash.toString(16).padStart(8, '0'); // emulate typical 32bit hash hex
          if (isMountedRef.current) {
              setVisitorId(hexHash);
              const elapsed = Math.round(performance.now() - start);
              setTimeTaken(elapsed);
              setLoading(false);
              saveToCache(hexHash, elapsed);
          }
      }
  }, [activeTab]);

  // Run Fingerprint Logic
  const runFingerprint = useCallback(async (force = false) => {
    if (activeTab === 'fonts') {
        if (!force) {
            // Check localStorage cache first
            try {
                const cached = localStorage.getItem('browserscope_fp_fonts_data');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed && Array.isArray(parsed.detectedFonts)) {
                        setDetectedFonts(parsed.detectedFonts);
                        setTimeTaken(parsed.timeTaken || 0);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error('Failed to load fonts cache from localStorage:', err);
            }
        }
        detectFonts();
        return;
    }

    // Check if cached result exists for standard tabs
    if (!force) {
        try {
            const cacheKey = `browserscope_fp_${activeTab}_data`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && parsed.visitorId && Array.isArray(parsed.components)) {
                    setComponents(parsed.components);
                    setVisitorId(parsed.visitorId);
                    setTimeTaken(parsed.timeTaken || 0);
                    setSalt(parsed.salt || '');
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            console.error(`Failed to load ${activeTab} cache from localStorage:`, err);
        }
    }

    setLoading(true);
    const startTime = performance.now();
    setComponents([]);
    setVisitorId('');

    try {
      const rawComponents: Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */> = {};

      if (activeTab === 'v5') {
        // Load v5
        const fpPromise = import('fpjs-v5')
          .then((FingerprintJS) => FingerprintJS.load());
        
        const fp = await fpPromise;
        const result = await fp.get();
        
        // Convert v5 components object to our format
        if (result.components) {
            Object.entries(result.components).forEach(([key, val]: [string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */]) => {
                rawComponents[key] = val.value;
            });
        }
      } else if (activeTab === 'v4') {
        // Load v4
        const fpPromise = import('@fingerprintjs/fingerprintjs')
          .then((FingerprintJS) => FingerprintJS.load());
        
        const fp = await fpPromise;
        const result = await fp.get();
        
        // Convert v4 components object to our format
        if (result.components) {
            Object.entries(result.components).forEach(([key, val]: [string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */]) => {
                rawComponents[key] = val.value;
            });
        }
      } else {
        // Load v2 (Fingerprintjs2)
        // @ts-expect-error auto-fixed
        const Fingerprint2 = await import('fingerprintjs2');
        
        // V2 uses a callback pattern usually, but we wrap in promise
        const componentsV2 = await new Promise<any /* eslint-disable-line @typescript-eslint/no-explicit-any */[]>((resolve) => {
            if (typeof window.requestIdleCallback === 'function') {
                requestIdleCallback(() => {
                    // @ts-expect-error auto-fixed
                    Fingerprint2.default.get((components) => resolve(components));
                });
            } else {
                setTimeout(() => {
                    // @ts-expect-error auto-fixed
                    Fingerprint2.default.get((components) => resolve(components));
                }, 500);
            }
        });

        componentsV2.forEach((c) => {
            rawComponents[c.key] = c.value;
        });
      }

      if (!isMountedRef.current) return;

      // Transform to state format
      const comps: Component[] = Object.keys(rawComponents).map(key => ({
          key,
          value: rawComponents[key],
          enabled: true
      }));

      // SECURITY: Explicitly drop reference to raw fingerprint result out of memory
      // to avoid snapshot bleeding
      for (const key in rawComponents) {
         delete rawComponents[key];
      }
      Object.keys(rawComponents).forEach(key => delete rawComponents[key]);

      setComponents(comps);
      
      // Initial Hash Calculation
      calculateHash(comps, salt, startTime);

    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error("Fingerprint error:", e);
      if (isMountedRef.current) {
          setVisitorId("Error loading library");
          setLoading(false);
      }
    }
  }, [activeTab, salt, detectFonts, calculateHash]);

  // Effect to run on tab change
  useEffect(() => {
      runFingerprint();
  }, [activeTab]); 

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
    <Modal
        title={t.title}
        icon={<Fingerprint size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight
        noPadding
    >
        {({ close: _close }) => (
            <>
                {/* Tabs & Controls */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shrink-0">
                    {/* Version Tabs */}
                    <div className="md:col-span-6 flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('v5')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                activeTab === 'v5' 
                                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            {t.tab_v5}
                        </button>
                        <button
                            onClick={() => setActiveTab('v4')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                activeTab === 'v4' 
                                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            {t.tab_v4}
                        </button>
                        <button
                            onClick={() => setActiveTab('v2')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                activeTab === 'v2' 
                                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            {t.tab_v2}
                        </button>
                        <button
                            onClick={() => setActiveTab('fonts')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                activeTab === 'fonts' 
                                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            {t.tab_fonts}
                        </button>
                    </div>

                    {/* Salt Input - Only for standard fingerprints */}
                    {activeTab !== 'fonts' ? (
                        <div className="md:col-span-3 relative">
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
                    ) : (
                        <div className="md:col-span-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Info size={16} />
                            <span>{t.font_detect_desc}</span>
                        </div>
                    )}

                    {/* Result Box */}
                    <div className="md:col-span-3 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-indigo-400 uppercase font-semibold tracking-wider">
                                {activeTab === 'fonts' ? 'Count' : t.visitor_id}
                            </span>
                            {loading ? (
                                <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 animate-pulse">{t.generating}</span>
                            ) : (
                                <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-300">
                                    {activeTab === 'fonts' ? detectedFonts.length : visitorId}
                                </span>
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
                    
                    {activeTab !== 'fonts' ? (
                        <>
                            {/* Components List */}
                            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
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
                                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
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
                        </>
                    ) : (
                        // Font Viewer
                        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto w-full">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Type size={16} />
                                {t.font_list_title}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {detectedFonts.map(font => (
                                    <div key={font} className="p-4 py-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm flex flex-col items-center justify-center text-center shadow-sm gap-4 transition hover:border-indigo-300 dark:hover:border-indigo-500">
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block truncate w-full px-2" title={font}>{font}</span>
                                        <span style={{ fontFamily: font }} className="text-4xl text-slate-800 dark:text-slate-200">Aa</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 sm:hidden">{font}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end gap-3 items-center">
                    <Button
                        variant="secondary"
                        onClick={() => runFingerprint(true)}
                        disabled={loading}
                        leftIcon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
                    >
                        {t.regenerate || "Regenerate"}
                    </Button>
                    {activeTab !== 'fonts' && (
                        <Button 
                            variant="primary"
                            onClick={handleCopy}
                            leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                        >
                            {copied ? t.copied : t.copy}
                        </Button>
                    )}
                </div>
            </>
        )}
    </Modal>
  );
};
