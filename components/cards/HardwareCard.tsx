
import React from 'react';
import { Cpu, Gamepad2, ChevronRight, Activity, Hammer, Battery, BatteryCharging, Zap, ScanBarcode, Layers, Eye, Music } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';

interface HardwareCardProps {
  data: BrowserData['hardware'];
  t: Translation;
  onOpenGamepad: () => void;
  onOpenSensors: () => void;
  onOpenTools: () => void;
  onOpenVision?: () => void;
  onOpenGraphics?: () => void;
  onOpenMidi?: () => void;
}

export const HardwareCard: React.FC<HardwareCardProps> = ({ data, t, onOpenGamepad, onOpenSensors, onOpenTools, onOpenVision, onOpenGraphics, onOpenMidi }) => {
  
  // Parse battery level
  const batteryLevel = parseFloat(data.batteryLevel) || 0;
  const isCharging = data.isCharging === 'Yes' || data.isCharging === t.values.yes;
  
  // Battery color logic
  let batteryColor = 'text-slate-600 dark:text-slate-300';
  let batteryFillColor = 'bg-slate-500';
  
  if (isCharging) {
      batteryColor = 'text-green-600 dark:text-green-400';
      batteryFillColor = 'bg-green-500';
  } else if (batteryLevel < 20) {
      batteryColor = 'text-red-600 dark:text-red-400';
      batteryFillColor = 'bg-red-500';
  } else if (batteryLevel < 50) {
      batteryColor = 'text-amber-600 dark:text-amber-400';
      batteryFillColor = 'bg-amber-500';
  }

  return (
    <InfoCard title={t.sections.hardware} icon={Cpu}>
      <InfoItem label={t.labels.cpu} value={data.cpuCores} />
      {data.cpuModel && <InfoItem label={t.labels.cpu_model} value={data.cpuModel} />}
      <InfoItem label={t.labels.memory} value={data.memory} />
      <div className="group relative">
          <InfoItem label={t.labels.gpu_renderer} value={data.gpuRenderer} />
          {onOpenGraphics && (
              <button 
                onClick={onOpenGraphics}
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-sm"
                title="View Graphics Limits"
              >
                  <Eye size={12} />
              </button>
          )}
      </div>
      
      {/* GPU Precision Badge */}
      {data.gpuPrecision && (
          <div className="flex items-center justify-between py-1.5 px-2 -mx-2">
             <span className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                 <Layers size={14} className="text-slate-400" />
                 {t.labels.shader_precision}
             </span>
             <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                 {data.gpuPrecision.fragmentHigh}
             </span>
          </div>
      )}

      {/* Visual Battery Section */}
      <div className="py-3 mt-1 mb-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 px-3">
          <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  {isCharging ? <BatteryCharging size={14} /> : <Battery size={14} />}
                  {t.labels.battery}
              </span>
              <span className={`text-sm font-bold font-mono ${batteryColor}`}>
                  {data.batteryLevel !== 'Unknown' && data.batteryLevel !== 'Not Supported' ? data.batteryLevel : 'N/A'}
              </span>
          </div>
          {data.batteryLevel !== 'Unknown' && data.batteryLevel !== 'Not Supported' && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
                  <div 
                      className={`h-full ${batteryFillColor} transition-all duration-500 ease-out`} 
                      style={{ width: `${batteryLevel}%` }}
                  />
                  {isCharging && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
              </div>
          )}
          {isCharging && data.chargingTime !== 'Infinity' && data.chargingTime !== 'N/A' && (
              <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <Zap size={10} />
                  Full in {data.chargingTime}
              </div>
          )}
      </div>
      
      <div className="flex items-center gap-1.5 py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 px-2 -mx-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded transition-colors" onClick={onOpenGamepad}>
          <Gamepad2 size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <span className="text-sm text-slate-500 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t.labels.gamepads}</span>
          <span className="ml-auto text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1">
              {data.gamepads}
              <ChevronRight size={12} className="text-slate-400" />
          </span>
      </div>

      <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50 grid grid-cols-2 gap-2">
          <Button variant="soft" size="xs" onClick={onOpenSensors} leftIcon={<Activity size={14} />}>
              {t.actions.open_sensors}
          </Button>
          <Button variant="secondary" size="xs" onClick={onOpenTools} leftIcon={<Hammer size={14} />}>
              {t.actions.open_tools}
          </Button>
      </div>
      {/* New Vision Row */}
      <div className="mt-2 grid grid-cols-2 gap-2">
          {onOpenVision && (
              <Button fullWidth variant="soft" size="xs" onClick={onOpenVision} className="!bg-emerald-50 !text-emerald-600 dark:!bg-emerald-900/30 dark:!text-emerald-400 hover:!bg-emerald-100" leftIcon={<ScanBarcode size={14} />}>
                  {t.actions.open_vision}
              </Button>
          )}
          {onOpenMidi && (
              <Button fullWidth variant="soft" size="xs" onClick={onOpenMidi} className="!bg-purple-50 !text-purple-600 dark:!bg-purple-900/30 dark:!text-purple-400 hover:!bg-purple-100" leftIcon={<Music size={14} />}>
                  Web MIDI
              </Button>
          )}
      </div>
    </InfoCard>
  );
};
