
import React from 'react';
import { Video, Camera, Mic } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type MediaPermissionKey = 'camera' | 'microphone';

interface MediaDevicesCardProps {
  permStatus: Record<MediaPermissionKey, PermissionStatusType>;
  t: Translation;
  onRequestPermission: (key: MediaPermissionKey) => void;
  onOpenCamera: () => void;
  onOpenMic: () => void;
}

export const MediaDevicesCard: React.FC<MediaDevicesCardProps> = ({ 
    permStatus, 
    t, 
    onRequestPermission,
    onOpenCamera,
    onOpenMic
}) => {
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

  return (
    <InfoCard title={t.labels.media_devices} icon={Video}>
        <div className="flex flex-col gap-4 py-1">
            {/* Camera */}
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
                        <button onClick={() => onRequestPermission('camera')} className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm text-xs font-medium">{t.actions.check}</button>
                        ) : (
                        <button onClick={onOpenCamera} className="px-3 py-1.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm text-xs font-medium">{t.cameraTool.btn_open}</button>
                        )}
                </div>
            </div>
            
            {/* Microphone */}
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
                        <button onClick={() => onRequestPermission('microphone')} className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm text-xs font-medium">{t.actions.check}</button>
                        ) : (
                        <button onClick={onOpenMic} className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm text-xs font-medium">{t.audioTool.btn_open}</button>
                        )}
                </div>
            </div>
        </div>
    </InfoCard>
  );
};
