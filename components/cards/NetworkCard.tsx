
import React from 'react';
import { Wifi, Activity, Globe } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';
import { useModalManager } from '../../hooks/useModalManager';

interface NetworkCardProps {
  data: BrowserData['network'];
  t: Translation;
  simpleMode: boolean;
  onOpenSpeedTest?: () => void;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ data, t, simpleMode, onOpenSpeedTest }) => {
  const { open } = useModalManager();
  
  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    return val;
  };

  return (
    <InfoCard title={t.sections.network} icon={Wifi}>
        <InfoItem label={t.labels.online} value={data.online ? t.values.connected : t.values.offline} isFeature />
        <InfoItem label={t.labels.conn_type} value={data.effectiveType} />
        <InfoItem label={t.labels.net_type} value={data.type} />
        <InfoItem label={t.labels.downlink} value={data.downlink} />
        {!simpleMode && (
            <>
                <InfoItem label={t.labels.downlink_max} value={data.downlinkMax} />
                <InfoItem label={t.labels.rtt} value={data.rtt} />
                <InfoItem label={t.labels.save_data} value={trVal(data.saveData)} />
                
                <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50 grid grid-cols-2 gap-2">
                    {onOpenSpeedTest && (
                        <Button variant="soft" size="xs" onClick={onOpenSpeedTest} leftIcon={<Activity size={14} />}>
                            {t.actions.open_speedtest}
                        </Button>
                    )}
                    {/* Using global event listener from App.tsx or direct open if context was available. 
                        Since InfoCard props are rigid, we'll dispatch a custom event for now 
                        OR ideally we assume App.tsx passes a handler. 
                        Let's rely on the established pattern: The parent should probably pass a handler.
                        However, since I can't easily change the prop interface in all files without a huge diff,
                        I will use the custom event pattern established in StorageBenchmark.
                    */}
                    <Button 
                        variant="secondary" 
                        size="xs" 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-heatmap'))} 
                        leftIcon={<Globe size={14} />}
                    >
                        {t.actions.open_heatmap}
                    </Button>
                </div>
            </>
        )}
    </InfoCard>
  );
};
