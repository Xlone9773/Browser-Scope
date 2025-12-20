
import React from 'react';
import { Smartphone } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface SystemCardProps {
  data: BrowserData['system'];
  t: Translation;
  simpleMode: boolean;
}

export const SystemCard: React.FC<SystemCardProps> = ({ data, t, simpleMode }) => {
  const trVal = (val: boolean) => val ? t.values.supported : t.values.not_supported;

  return (
    <InfoCard title={t.sections.system} icon={Smartphone}>
      <InfoItem label={t.labels.os} value={data.os} />
      <InfoItem label={t.labels.platform} value={data.platform} />
      <InfoItem label={t.labels.browser} value={`${data.browserName} ${data.browserVersion}`} />
      {!simpleMode && (
          <>
              <InfoItem label={t.labels.language} value={data.language} />
              <InfoItem label={t.labels.pref_langs} value={data.preferredLanguages.join(', ')} />
              <InfoItem label={t.labels.cookies} value={trVal(data.cookiesEnabled)} />
              <InfoItem label={t.labels.dnt} value={data.doNotTrack || 'Off'} />
          </>
      )}
    </InfoCard>
  );
};
