
import React from 'react';
import { Wifi, Activity } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface NetworkCardProps {
  data: BrowserData['network'];
  t: Translation;
  simpleMode: boolean;
  onOpenSpeedTest?: () => void;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ data, t, simpleMode, onOpenSpeedTest }) => {
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
                
                {onOpenSpeedTest && (
                    <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50">
                        <button 
                            onClick={onOpenSpeedTest}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                            <Activity size={14} />
                            {t.actions.open_speedtest}
                        </button>
                    </div>
                )}
            </>
        )}
    </InfoCard>
  );
};
