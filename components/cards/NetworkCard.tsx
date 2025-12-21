
import React from 'react';
import { Wifi, Activity } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';

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
                        <Button fullWidth variant="soft" size="xs" onClick={onOpenSpeedTest} leftIcon={<Activity size={14} />}>
                            {t.actions.open_speedtest}
                        </Button>
                    </div>
                )}
            </>
        )}
    </InfoCard>
  );
};
