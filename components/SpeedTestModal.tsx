
import React, { useState, useMemo, useEffect } from 'react';
import { Play, Square, Wifi, ArrowDown, ArrowUp, Activity, Globe, AlertCircle, Settings2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber, formatBytes } from '../utils/formatters';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { useSpeedTest, TestConfig, SPEED_TEST_PRESETS } from '../hooks/useSpeedTest';
import { SpeedGraph } from './speedtest/SpeedGraph';

interface SpeedTestModalProps {
  onClose: () => void;
  // Updated type definition to point to the new modular structure
  t: Translation['speedTest'];
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ onClose, t }) => {
  // Config State (Local UI state)
  const [downloadSize, setDownloadSize] = useState(25000000); // Default 25MB
  const [backend, setBackend] = useState<string>('cloudflare');
  const [customUrl, setCustomUrl] = useState('');

  // Use the hook
  const { testState, metrics, errorMsg, speedHistory, progress, start, stop } = useSpeedTest();

  // Derived state
  const selectedBackend = useMemo(() => SPEED_TEST_PRESETS.find(p => p.id === backend) || SPEED_TEST_PRESETS[0], [backend]);
  
  // Update available sizes when backend changes
  const availableSizes = useMemo(() => {
      if (selectedBackend.isDynamic) {
          // Standard dynamic sizes
          return [
            { id: 10000000, label: '10 MB' },
            { id: 25000000, label: '25 MB (Default)' },
            { id: 50000000, label: '50 MB' },
            { id: 100000000, label: '100 MB' },
            { id: 200000000, label: '200 MB' },
            { id: 500000000, label: '500 MB' },
            { id: 1000000000, label: '1 GB' }
          ];
      } else if (selectedBackend.sizeMap) {
          // Static sizes from map
          return Object.keys(selectedBackend.sizeMap)
            .map(k => Number(k))
            .sort((a, b) => a - b)
            .map(bytes => ({
                id: bytes,
                label: formatBytes(bytes) // Use our generic formatter
            }));
      }
      return [];
  }, [selectedBackend]);

  // Reset download size if current size is invalid for new backend
  useEffect(() => {
      if (availableSizes.length > 0) {
          const isValid = availableSizes.some(s => s.id === downloadSize);
          if (!isValid) {
              // Default to 100MB if available, else first option
              const defaultOption = availableSizes.find(s => s.id === 100 * 1024 * 1024) || availableSizes[0];
              setDownloadSize(defaultOption.id);
          }
      }
  }, [availableSizes, downloadSize]);

  // Format presets for Select
  const presetOptions = useMemo(() => SPEED_TEST_PRESETS.map(p => ({
      id: p.id,
      // Using new structure: preset_names is now inside speedTest object
      // @ts-ignore
      label: t.preset_names?.[p.id] || p.name 
  })), [t]);

  const handleStart = () => {
      const config: TestConfig = {
          backend,
          downloadSize,
          customUrl
      };
      start(config);
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  const getStatusText = () => {
      switch(testState) {
          case 'idle': return t.status.idle;
          case 'ping': return t.status.ping;
          case 'download': return t.status.download;
          case 'upload': return t.status.upload;
          case 'done': return t.status.done;
          case 'error': return t.status.error;
          default: return '';
      }
  };

  return (
    <Modal
        title={t.title}
        icon={<Activity size={24} />}
        onClose={handleClose}
        size="3xl"
    >
        <div className="flex flex-col gap-6">
            
            {/* Settings Area (Visible when idle) */}
            {testState === 'idle' && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Settings2 size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuration</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Backend Selector */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.settings.backend}</label>
                            <Select 
                                value={backend} 
                                options={presetOptions}
                                onChange={(val) => setBackend(val)}
                                color="indigo"
                            />
                        </div>

                        {/* Size Selector */}
                        {availableSizes.length > 0 && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.settings.test_size}</label>
                                <Select 
                                    value={downloadSize} 
                                    options={availableSizes}
                                    onChange={(val) => setDownloadSize(Number(val))}
                                    color="indigo"
                                />
                            </div>
                        )}
                        
                        {/* Static File Note (If no sizes available) */}
                        {availableSizes.length === 0 && backend !== 'custom' && (
                            <div className="flex items-end pb-2">
                                <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-lg w-full">
                                    Fixed file size. Upload test disabled for this provider.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Custom URL Input */}
                    {backend === 'custom' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.settings.custom_url}</label>
                            <input 
                                type="text"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                placeholder={t.settings.custom_placeholder}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-shadow"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">{t.settings.cors_note}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {testState === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Failed to connect. {errorMsg}</span>
                </div>
            )}

            {/* Top Stats: Ping & Jitter */}
            <div className="flex gap-4">
                <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wifi size={18} className="text-indigo-500" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.metrics.ping}</span>
                    </div>
                    <div className="font-mono font-bold text-slate-800 dark:text-white">
                        {metrics.ping !== null ? `${formatNumber(metrics.ping, 0)} ms` : '--'}
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-indigo-500" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.metrics.jitter}</span>
                    </div>
                    <div className="font-mono font-bold text-slate-800 dark:text-white">
                        {metrics.jitter !== null ? `${formatNumber(metrics.jitter, 0)} ms` : '--'}
                    </div>
                </div>
            </div>

            {/* Main Gauge Area */}
            <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-700 flex items-center justify-center">
                {/* Visual Graph Component */}
                <SpeedGraph data={speedHistory} testState={testState} />
                
                {/* Central Speed Text */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-lg">
                        {formatNumber(metrics.current, 1)}
                    </div>
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-2">{t.metrics.mbps}</div>
                    
                    <div className="mt-6 px-4 py-1.5 bg-black/40 rounded-full backdrop-blur-md text-xs font-medium text-slate-300 border border-white/10 flex items-center gap-2">
                        {testState === 'download' && <ArrowDown size={12} className="text-emerald-400 animate-bounce" />}
                        {testState === 'upload' && <ArrowUp size={12} className="text-purple-400 animate-bounce" />}
                        {testState === 'ping' && <Wifi size={12} className="text-amber-400 animate-pulse" />}
                        {getStatusText()}
                    </div>
                </div>
                
                {/* Provider Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <Globe size={12} />
                    <span className="max-w-[150px] truncate" title={selectedBackend.name}>
                        {/* @ts-ignore: Safe access via key */}
                        {t.preset_names?.[backend] || selectedBackend.name}
                    </span>
                </div>

                {/* Progress Bar (Absolute Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out shadow-[0_-2px_10px_rgba(129,140,248,0.5)]" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Bottom Stats: Download & Upload */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border transition-all ${testState === 'download' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDown size={18} className="text-emerald-500" />
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t.metrics.download}</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {metrics.download !== null ? formatNumber(metrics.download, 1) : '--'} <span className="text-xs font-normal text-slate-400">Mbps</span>
                    </div>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${testState === 'upload' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 shadow-md ring-1 ring-purple-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUp size={18} className="text-purple-500" />
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t.metrics.upload}</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {metrics.upload !== null 
                            ? formatNumber(metrics.upload, 1) 
                            : !selectedBackend.supportsUpload ? <span className="text-xs text-slate-400">N/A</span> : '--'
                        } 
                        {selectedBackend.supportsUpload && <span className="text-xs font-normal text-slate-400">Mbps</span>}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button 
                onClick={testState === 'idle' || testState === 'done' || testState === 'error' ? handleStart : stop}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    testState === 'idle' || testState === 'done' || testState === 'error' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' 
                    : 'bg-slate-700 hover:bg-slate-800'
                }`}
            >
                {testState === 'idle' || testState === 'done' || testState === 'error' ? <Play size={20} fill="currentColor" /> : <Square size={20} fill="currentColor" />}
                {testState === 'idle' || testState === 'done' || testState === 'error' ? t.action.start : t.action.stop}
            </button>

        </div>
    </Modal>
  );
};
