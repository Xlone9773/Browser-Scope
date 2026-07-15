
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Play, Square, Activity, ArrowLeft, Zap, LayoutDashboard } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { measureLatency, LATENCY_REGIONS, LatencyResult, LatencyRegion } from '../services/detectors/globalLatency';
import { WorldMap } from './heatmap/WorldMap';
import { TraceGraph } from './heatmap/TraceGraph';


interface NetworkHeatmapModalProps {
  onClose: () => void;
  t: Translation['heatmap'];
}

interface TraceStats {
    count: number;
    lossCount: number;
    min: number;
    max: number;
    avg: number;
    jitter: number;
    last: number | null;
}

export const NetworkHeatmapModal: React.FC<NetworkHeatmapModalProps> = ({ onClose, t }) => {
  // Global Map State
  const [isRunningMap, setIsRunningMap] = useState(false);
  const [results, setResults] = useState<Record<string, LatencyResult>>({});
  
  // Detail/Trace View State
  const [selectedRegion, setSelectedRegion] = useState<LatencyRegion | null>(null);
  const [traceData, setTraceData] = useState<(number | null)[]>([]); // null = timeout
  const [isRunningTrace, setIsRunningTrace] = useState(false);
  const [traceStats, setTraceStats] = useState<TraceStats>({
      count: 0,
      lossCount: 0,
      min: Infinity,
      max: 0,
      avg: 0,
      jitter: 0,
      last: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const traceIntervalRef = useRef<number | null>(null);

  const handleClose = () => {
      stopTest();
      stopTrace();
      onClose();
  };

  const stopTest = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      setIsRunningMap(false);
  };

  const stopTrace = () => {
      if (traceIntervalRef.current) {
          window.clearTimeout(traceIntervalRef.current);
          traceIntervalRef.current = null;
      }
      setIsRunningTrace(false);
  };

  // --- Global Map Logic ---
  const runTest = async () => {
      if (isRunningMap) return;
      setIsRunningMap(true);
      setResults({});
      abortControllerRef.current = new AbortController();

      // Batch requests to avoid choking browser
      const batchSize = 3;
      const queue = [...LATENCY_REGIONS];

      while (queue.length > 0 && !abortControllerRef.current.signal.aborted) {
          const batch = queue.splice(0, batchSize);
          
          // Mark as pending
          setResults(prev => {
              const next = { ...prev };
              batch.forEach(r => next[r.id] = { id: r.id, latency: 0, status: 'pending' });
              return next;
          });

          await Promise.all(batch.map(async (region) => {
              try {
                  const latency = await measureLatency(region.url);
                  setResults(prev => ({
                      ...prev,
                      [region.id]: { id: region.id, latency, status: 'success' }
                  }));
              } catch {
                  setResults(prev => ({
                      ...prev,
                      [region.id]: { id: region.id, latency: 0, status: 'error' }
                  }));
              }
          }));
          
          // Small delay between batches
          await new Promise(r => setTimeout(r, 200));
      }

      setIsRunningMap(false);
  };

  // --- Trace Logic (Pseudo-MTR) ---
  const startTrace = () => {
      if (isRunningTrace || !selectedRegion) return;
      
      // Reset stats on start if trace data is empty or if restarting manually
      if (traceData.length === 0 || !isRunningTrace) {
          setTraceData(Array.from({ length: 60 }, () => 0)); 
          setTraceStats({ count: 0, lossCount: 0, min: Infinity, max: 0, avg: 0, jitter: 0, last: 0 });
      }
      
      setIsRunningTrace(true);
      
      const region = selectedRegion;

      const loop = async () => {
          const targetUrl = `${region.url}?t=${Date.now()}`;
          const start = performance.now();
          let latency: number | null = null;

          try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2000);
              
              await fetch(targetUrl, { 
                  mode: 'no-cors', 
                  cache: 'no-store', 
                  method: 'HEAD',
                  signal: controller.signal
              });
              clearTimeout(timeoutId);
              const end = performance.now();
              latency = Math.round(end - start);
          } catch {
              latency = null; // Timeout or error
          }

          // Update Data & Stats
          setTraceData(prev => [...prev.slice(1), latency]);
          
          setTraceStats(prev => {
              const newCount = prev.count + 1;
              const isLoss = latency === null;
              const newLossCount = prev.lossCount + (isLoss ? 1 : 0);
              
              if (isLoss) {
                  return { ...prev, count: newCount, lossCount: newLossCount };
              }

              const val = latency!;
              const newMin = Math.min(prev.min, val);
              const newMax = Math.max(prev.max, val);
              const newAvg = Math.round(prev.avg + (val - prev.avg) / (newCount - newLossCount));
              const newJitter = prev.last ? Math.abs(val - prev.last) : 0;
              const smoothJitter = Math.round(prev.jitter * 0.9 + newJitter * 0.1);

              return {
                  count: newCount,
                  lossCount: newLossCount,
                  min: newMin,
                  max: newMax,
                  avg: newAvg,
                  jitter: smoothJitter,
                  last: val
              };
          });

          if (traceIntervalRef.current) {
              traceIntervalRef.current = window.setTimeout(loop, 500);
          }
      };

      traceIntervalRef.current = window.setTimeout(loop, 0);
  };

  const handleStartTrace = () => {
      startTrace();
  };

  const handleStopTrace = () => {
      stopTrace();
  };

  // Reset when changing regions
  useEffect(() => {
      const timer = setTimeout(() => {
          if (selectedRegion) {
              stopTrace(); 
              setTraceData(Array.from({ length: 60 }, () => 0));
              setTraceStats({ count: 0, lossCount: 0, min: Infinity, max: 0, avg: 0, jitter: 0, last: 0 });
          } else {
              stopTrace();
          }
      }, 0);
      return () => {
          clearTimeout(timer);
          stopTrace();
      };
  }, [selectedRegion]);


  // Helpers
  const getLatencyColor = (latency: number) => {
      if (latency === 0) return 'text-slate-400';
      if (latency < 100) return 'text-emerald-500';
      if (latency < 200) return 'text-yellow-500';
      return 'text-red-500';
  };

  const getRegionName = (id: string, defaultName: string) => {
      
      // @ts-expect-error auto-fixed
      return t.regions?.[id] || defaultName;
  };

  const localizedRegions = LATENCY_REGIONS.map(r => ({
      ...r,
      name: getRegionName(r.id, r.name)
  }));

  return (
    <Modal
        title={selectedRegion ? t.mtr_title : t.title}
        icon={selectedRegion ? <Activity size={24} /> : <Globe size={24} />}
        onClose={handleClose}
        size="3xl"
        fullHeight
        noPadding
    >
        {/* Style injection for animations */}
        <style>{`
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .animate-slide-right { animation: slideInRight 0.3s ease-out forwards; }
            .animate-slide-left { animation: slideInLeft 0.3s ease-out forwards; }
        `}</style>

        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            
            {selectedRegion ? (
                // --- VIEW B: DETAILED TRACE (Full Overlay) ---
                <div className="flex flex-col h-full w-full absolute inset-0 bg-slate-50 dark:bg-slate-900 z-10 animate-slide-right">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between shadow-sm z-20">
                        <button 
                            onClick={() => setSelectedRegion(null)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            {t.back}
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-slate-800 dark:text-white">
                                {getRegionName(selectedRegion.id, selectedRegion.name)}
                            </span>
                            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />
                            <span className="font-mono text-xs text-slate-400 hidden sm:block">{selectedRegion.url.split('/')[2]}</span>
                        </div>
                        
                        {/* Prominent Controls */}
                        {!isRunningTrace ? (
                            <button 
                                onClick={handleStartTrace}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Play size={16} fill="currentColor" />
                                {t.start}
                            </button>
                        ) : (
                            <button 
                                onClick={handleStopTrace}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2 animate-pulse"
                            >
                                <Square size={16} fill="currentColor" />
                                {t.stop}
                            </button>
                        )}
                    </div>

                    {/* Main Graph Area */}
                    <div className="flex-1 p-6 bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center min-h-0">
                        <div className={`absolute inset-0 transition-opacity duration-500 ${isRunningTrace ? 'opacity-80' : 'opacity-30 blur-sm'}`}>
                            <TraceGraph data={traceData} height={300} />
                        </div>
                        
                        {/* Overlay for Idle State */}
                        {!isRunningTrace && traceStats.count === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                <button 
                                    onClick={handleStartTrace}
                                    className="group relative flex flex-col items-center justify-center w-32 h-32 rounded-full bg-emerald-600/90 text-white shadow-2xl hover:scale-105 hover:bg-emerald-500 transition-all cursor-pointer backdrop-blur-sm border-4 border-white/10"
                                >
                                    <Zap size={40} className="mb-2 fill-white" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{t.start}</span>
                                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping pointer-events-none"></div>
                                </button>
                            </div>
                        )}

                        {/* Center Metric (Only show if we have data) */}
                        {traceStats.count > 0 && (
                            <div className="relative z-10 text-center mix-blend-difference">
                                <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                                    {traceStats.last ?? '--'}
                                </div>
                                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1">ms {t.current}</div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                        <div className="p-4 border-r border-slate-100 dark:border-slate-700 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{t.packet_loss}</div>
                            <div className={`text-xl font-bold tabular-nums ${traceStats.lossCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {traceStats.count > 0 ? ((traceStats.lossCount / traceStats.count) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                        <div className="p-4 border-r border-slate-100 dark:border-slate-700 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{t.jitter}</div>
                            <div className={`text-xl font-bold tabular-nums ${traceStats.jitter > 10 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                {traceStats.jitter} ms
                            </div>
                        </div>
                        <div className="p-4 border-r border-slate-100 dark:border-slate-700 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{t.avg_latency}</div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                {traceStats.avg} ms
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{t.samples}</div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                {traceStats.count}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- VIEW A: MAP & LIST (Dashboard Layout) ---
                <div className="flex flex-col lg:flex-row h-full w-full absolute inset-0 bg-slate-50 dark:bg-slate-900 z-0 animate-slide-left">
                    
                    {/* Left/Top: Map Area */}
                    <div className="relative shrink-0 lg:flex-1 bg-slate-100 dark:bg-black/20 flex flex-col justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 min-h-[300px] lg:min-h-0">
                        <div className="w-full h-full p-6 flex items-center justify-center">
                             {/* Map Container */}
                             <div className="w-full max-w-5xl h-full">
                                <WorldMap 
                                    regions={localizedRegions} 
                                    results={results} 
                                    onRegionSelect={setSelectedRegion} 
                                />
                             </div>
                        </div>
                        
                        {/* Overlay Controls */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
                             <button 
                                onClick={isRunningMap ? stopTest : runTest}
                                className={`
                                    pointer-events-auto px-8 py-3 rounded-full font-bold text-white shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-white/10 backdrop-blur-sm
                                    ${isRunningMap 
                                        ? 'bg-red-600/90 hover:bg-red-700' 
                                        : 'bg-indigo-600/90 hover:bg-indigo-700'}
                                `}
                            >
                                {isRunningMap ? (
                                    <>
                                        <Square size={18} fill="currentColor" />
                                        {t.stop}
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} fill="currentColor" />
                                        {t.start}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right/Bottom: List Area */}
                    <div className="flex-1 lg:w-[400px] xl:w-[450px] lg:flex-none bg-white dark:bg-slate-800 flex flex-col min-h-0 shadow-xl z-20 relative">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 shrink-0 flex justify-between items-center backdrop-blur-sm">
                             <div className="flex items-center gap-2">
                                <LayoutDashboard size={16} className="text-slate-400" />
                                <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Regional Nodes</h3>
                             </div>
                             <div className="text-xs text-slate-400 font-mono">
                                 {localizedRegions.length} nodes
                             </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0 bg-slate-50/30 dark:bg-transparent">
                             {/* Responsive Grid: 1 col on mobile, 2 cols on wide list (tablet mode), back to 1 col on desktop sidebar, 2 cols on very wide desktop */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
                                {LATENCY_REGIONS.map((region) => {
                                    const res = results[region.id];
                                    return (
                                        <div 
                                            key={region.id} 
                                            onClick={() => setSelectedRegion(region)}
                                            className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-md group"
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-2">
                                                    {getRegionName(region.id, region.name)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">{region.url.split('/')[2]}</span>
                                            </div>
                                            <div className="text-right flex items-center gap-3 shrink-0">
                                                {res ? (
                                                    res.status === 'pending' ? (
                                                        <Activity size={16} className="text-indigo-500 animate-pulse" />
                                                    ) : res.status === 'error' ? (
                                                        <span className="text-xs font-bold text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">{t.status_error}</span>
                                                    ) : (
                                                        <span className={`text-sm font-mono font-bold ${getLatencyColor(res.latency)}`}>
                                                            {res.latency} <span className="text-[10px] font-normal text-slate-400">ms</span>
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-slate-300 dark:text-slate-600">-</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Modal>
  );
};
