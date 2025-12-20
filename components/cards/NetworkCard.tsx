
import React from 'react';
import { Wifi } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface NetworkCardProps {
  data: BrowserData['network'];
  t: Translation;
  simpleMode: boolean;
}

export const NetworkCard: React.FC<NetworkCardProps> = ({ data, t, simpleMode }) => {
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
            </>
        )}
    </InfoCard>
  );
};
