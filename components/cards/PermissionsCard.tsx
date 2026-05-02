
import React, { useState } from 'react';
import { Shield, Bell, Music, Send } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { Button } from '../ui/Button';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'notifications' | 'midi' | 'geolocation';

interface PermissionsCardProps {
  permStatus: Record<PermissionKey, PermissionStatusType>;
  geoData: { latitude: number; longitude: number; accuracy: number; } | null;
  t: Translation;
  onRequestPermission: (key: PermissionKey) => void;
}

export const PermissionsCard: React.FC<PermissionsCardProps> = ({ permStatus, geoData, t, onRequestPermission }) => {
  const [showNotifTest, setShowNotifTest] = useState(false);
  const [notifTitle, setNotifTitle] = useState('Test Notification');
  const [notifBody, setNotifBody] = useState('This is a test notification from BrowserScope!');
  const [notifBtnText, setNotifBtnText] = useState('Acknowledge');

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

  const handleTestNotification = () => {
    if (permStatus.notifications === 'granted') {
      const swRegistration = navigator.serviceWorker.ready;
      swRegistration.then((reg) => {
        reg.showNotification(notifTitle || 'Test Notification', {
          body: notifBody || 'This is a test notification from BrowserScope!',
          icon: '/icon512_maskable.png',
          badge: '/icon-192x192.png',
          // @ts-ignore: TS doesn't have actions in NotificationOptions by default sometimes
          actions: notifBtnText ? [
              { action: 'ack', title: notifBtnText }
          ] : []
        });
      }).catch(() => {
        // Fallback if ServiceWorker is not available
        new Notification(notifTitle || 'Test Notification', {
            body: notifBody || 'This is a test notification from BrowserScope!',
        });
      });
    } else {
        onRequestPermission('notifications');
    }
  };

  return (
    <InfoCard title={t.sections.permissions} icon={Shield}>
        {/* Notifications */}
        <div className="flex flex-col py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <Bell size={14} className="text-slate-400"/>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_notif}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${getPermColor(permStatus.notifications)}`}>{getPermLabel(permStatus.notifications)}</span>
                    <Button onClick={() => {
                        if (permStatus.notifications === 'granted') {
                            setShowNotifTest(!showNotifTest);
                        } else {
                            onRequestPermission('notifications');
                        }
                    }} variant="soft" size="xs">
                        {permStatus.notifications === 'granted' ? (showNotifTest ? 'Cancel' : 'Test') : t.actions.check}
                    </Button>
                </div>
            </div>
            
            {showNotifTest && permStatus.notifications === 'granted' && (
                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col gap-2">
                    <input 
                        type="text" 
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="Notification Title" 
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <textarea 
                        value={notifBody}
                        onChange={(e) => setNotifBody(e.target.value)}
                        placeholder="Notification Body text..." 
                        rows={2}
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none"
                    ></textarea>
                    <input 
                        type="text" 
                        value={notifBtnText}
                        onChange={(e) => setNotifBtnText(e.target.value)}
                        placeholder="Action Button Label (Optional)" 
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex justify-end mt-1">
                        <Button onClick={handleTestNotification} size="xs" variant="primary" leftIcon={<Send size={12}/>}>
                            Send Test
                        </Button>
                    </div>
                </div>
            )}
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
                    <Button onClick={() => onRequestPermission('midi')} variant="soft" size="xs">
                        {t.actions.check}
                    </Button>
                )}
            </div>
        </div>
    </InfoCard>
  );
};
