
import React from 'react';
import { Shield, Bell, Music, MapPin } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'notifications' | 'midi' | 'geolocation';

interface PermissionsCardProps {
  permStatus: Record<PermissionKey, PermissionStatusType>;
  geoData: { latitude: number; longitude: number; accuracy: number; } | null;
  t: Translation;
  onRequestPermission: (key: PermissionKey) => void;
}

export const PermissionsCard: React.FC<PermissionsCardProps> = ({ permStatus, geoData, t, onRequestPermission }) => {
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
    <InfoCard title={t.sections.permissions} icon={Shield}>
        {/* Notifications */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
            <div className="flex items-center gap-2">
                <Bell size={14} className="text-slate-400"/>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_notif}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${getPermColor(permStatus.notifications)}`}>{getPermLabel(permStatus.notifications)}</span>
                {(permStatus.notifications === 'prompt' || permStatus.notifications === 'idle') && (
                    <button onClick={() => onRequestPermission('notifications')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                )}
            </div>
        </div>
        
        {/* MIDI */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
            <div className="flex items-center gap-2">
                <Music size={14} className="text-slate-400"/>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_midi}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${getPermColor(permStatus.midi)}`}>{getPermLabel(permStatus.midi)}</span>
                {permStatus.midi !== 'granted' && (
                    <button onClick={() => onRequestPermission('midi')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                )}
            </div>
        </div>

        {/* Geolocation Status Only */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
            <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400"/>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_geo}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${getPermColor(permStatus.geolocation)}`}>{getPermLabel(permStatus.geolocation)}</span>
                {permStatus.geolocation !== 'granted' && (
                    <button onClick={() => onRequestPermission('geolocation')} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50">{t.actions.check}</button>
                )}
            </div>
        </div>
    </InfoCard>
  );
};
