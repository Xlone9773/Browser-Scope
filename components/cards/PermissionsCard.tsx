
import React, { useState, useEffect } from 'react';
import { Shield, Bell, Music, Send, Plus, X } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';

type PermissionStatusType = 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
type PermissionKey = 'notifications' | 'midi' | 'geolocation';

interface PermissionsCardProps {
  permStatus: Record<PermissionKey, PermissionStatusType>;
  geoData: { latitude: number; longitude: number; accuracy: number; } | null;
  t: Translation;
  onRequestPermission: (key: PermissionKey) => void;
}

export const PermissionsCard: React.FC<PermissionsCardProps> = React.memo(({ permStatus, geoData: _geoData, t, onRequestPermission }) => {
  const [showNotifTest, setShowNotifTest] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifIcon, setNotifIcon] = useState('');
  const [notifActions, setNotifActions] = useState<{title: string, type: 'alert' | 'url' | 'close', payload: string}[]>([]);
  const [actionAlert, setActionAlert] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
                setActionAlert({
                    title: 'Action Triggered',
                    message: `You clicked the action: ${event.data.title}`
                });
            } else if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
                window.focus();
            }
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);
        return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }
  }, []);

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

  const handleTestNotification = async () => {
    if (permStatus.notifications === 'granted') {
      const nt = t.notificationTest;
      const title = notifTitle || nt.titlePlaceholder || 'Test Notification';
      const body = notifBody || nt.bodyPlaceholder || 'This is a test notification from BrowserScope!';

      try {
          if ('serviceWorker' in navigator) {
              const reg = await navigator.serviceWorker.getRegistration();
              if (reg) {
                  const actionsConfig: Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */> = {};
                  const mappedActions = notifActions.map((act, i) => {
                      const actionId = `action-${i}`;
                      actionsConfig[actionId] = { type: act.type, payload: act.payload, title: act.title };
                      return {
                          action: actionId,
                          title: act.title || `Action ${i + 1}`
                      };
                  });
                  await reg.showNotification(title, {
                      body,
                      icon: notifIcon || '/icon512_maskable.png',
                      badge: '/icon-192x192.png',
                      actions: mappedActions
                  } as any /* eslint-disable-line @typescript-eslint/no-explicit-any */);
                  return;
              }
          }
          // Fallback if ServiceWorker is not available or getRegistration fails
          const n = new Notification(title, { body, icon: notifIcon || '/icon512_maskable.png' });
          n.onclick = () => { window.focus(); };
      } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
          console.error('Notification error:', error);
          const n = new Notification(title, { body, icon: notifIcon || '/icon512_maskable.png' });
          n.onclick = () => { window.focus(); };
      }
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
                        {permStatus.notifications === 'granted' ? (showNotifTest ? (t.notificationTest?.cancel || 'Cancel') : (t.notificationTest?.test || 'Test')) : t.actions.check}
                    </Button>
                </div>
            </div>
            
            {showNotifTest && permStatus.notifications === 'granted' && (
                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col gap-2">
                    <input 
                        type="text" 
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder={t.notificationTest?.titlePlaceholder || 'Notification Title'} 
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <textarea 
                        value={notifBody}
                        onChange={(e) => setNotifBody(e.target.value)}
                        placeholder={t.notificationTest?.bodyPlaceholder || 'Notification Body text...'} 
                        rows={2}
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none"
                    ></textarea>
                    <input 
                        type="text" 
                        value={notifIcon}
                        onChange={(e) => setNotifIcon(e.target.value)}
                        placeholder={t.notificationTest?.iconUrlPlaceholder || 'Icon URL (Optional)'} 
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    
                    {/* Actions List */}
                    <div className="flex flex-col gap-2 mt-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-500">
                                Actions ({notifActions.length}/{'Notification' in window ? ((Notification as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).maxActions || 2) : 2})
                            </span>
                            <Button 
                                size="xs" 
                                variant="ghost" 
                                onClick={() => {
                                    const maxAct = 'Notification' in window ? ((Notification as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).maxActions || 2) : 2;
                                    if (notifActions.length < maxAct) {
                                        setNotifActions([...notifActions, {title: '', type: 'alert', payload: ''}]);
                                    }
                                }}
                                disabled={notifActions.length >= ('Notification' in window ? ((Notification as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).maxActions || 2) : 2)}
                                leftIcon={<Plus size={12}/>}
                            >
                                {t.notificationTest?.addAction || 'Add Action'}
                            </Button>
                        </div>
                        {notifActions.map((act, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="flex justify-between items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={act.title}
                                        onChange={(e) => {
                                            const newActions = [...notifActions];
                                            newActions[idx] = { ...newActions[idx], title: e.target.value };
                                            setNotifActions(newActions);
                                        }}
                                        placeholder={t.notificationTest?.actionTitlePlaceholder || 'Action Title'}
                                        className="text-xs px-2 py-1 flex-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 min-w-0"
                                    />
                                    <button onClick={() => {
                                        const newActions = [...notifActions];
                                        newActions.splice(idx, 1);
                                        setNotifActions(newActions);
                                    }} className="text-slate-400 hover:text-rose-500 flex-shrink-0">
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-32 min-w-[128px] shrink-0">
                                        <Select 
                                            value={act.type}
                                            onChange={(val: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
                                                const newActions = [...notifActions];
                                                newActions[idx] = { ...newActions[idx], type: val };
                                                setNotifActions(newActions);
                                            }}
                                            options={[
                                                { id: 'alert', label: t.notificationTest?.actionTypeAlert || 'Alert' },
                                                { id: 'url', label: t.notificationTest?.actionTypeUrl || 'Open URL' },
                                                { id: 'close', label: t.notificationTest?.actionTypeClose || 'Close' }
                                            ]}
                                            size="sm"
                                        />
                                    </div>
                                    {act.type === 'url' && (
                                        <input 
                                            type="text" 
                                            value={act.payload}
                                            onChange={(e) => {
                                                const newActions = [...notifActions];
                                                newActions[idx] = { ...newActions[idx], payload: e.target.value };
                                                setNotifActions(newActions);
                                            }}
                                            placeholder={t.notificationTest?.actionPayloadPlaceholder || 'URL'}
                                            className="text-xs px-2 py-1 flex-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 min-w-0"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-1">
                        <Button onClick={handleTestNotification} size="xs" variant="primary" leftIcon={<Send size={12}/>}>
                            {t.notificationTest?.sendTest || 'Send Test'}
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
        
        {/* Action Alert Modal */}
        {actionAlert && (
            <Modal title={actionAlert.title} onClose={() => setActionAlert(null)} size="sm">
                <div className="flex flex-col items-center py-6 text-center">
                    <Bell size={48} className="text-indigo-500 mb-4 opacity-80" />
                    <p className="text-slate-700 dark:text-slate-300">
                        {actionAlert.message}
                    </p>
                    <Button variant="primary" className="mt-6 w-full" onClick={() => setActionAlert(null)}>
                        {t.notificationTest?.cancel || 'Close'}
                    </Button>
                </div>
            </Modal>
        )}
    </InfoCard>
  );
});
