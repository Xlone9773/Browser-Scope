
import React from 'react';
import { Smartphone } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation, Language } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { useFormatter } from '../../hooks/useFormatter';

interface SystemCardProps {
  data: BrowserData['system'];
  t: Translation;
  simpleMode: boolean;
  lang?: Language; // Pass current UI lang to hook
}

export const SystemCard: React.FC<SystemCardProps> = ({ data, t, simpleMode, lang = 'en' }) => {
  const trVal = (val: boolean) => val ? t.values.supported : t.values.not_supported;
  const { formatLanguageName, list } = useFormatter(lang);

  // Advanced: Convert codes like 'zh-CN' to 'Chinese (Simplified)' in current UI language
  const readableLanguages = data.preferredLanguages.map(code => {
      const name = formatLanguageName(code);
      // If name matches code (DisplayNames failed or not found), keep code
      return name === code ? code : name;
  });

  return (
    <InfoCard title={t.sections.system} icon={Smartphone}>
      <InfoItem label={t.labels.os} value={data.os} />
      <InfoItem label={t.labels.platform} value={data.platform} />
      <InfoItem label={t.labels.browser} value={`${data.browserName} ${data.browserVersion}`} />
      {!simpleMode && (
          <>
              <InfoItem label={t.labels.language} value={formatLanguageName(data.language)} subValue={data.language} />
              <InfoItem label={t.labels.pref_langs} value={list(readableLanguages)} />
              <InfoItem label={t.labels.cookies} value={trVal(data.cookiesEnabled)} />
              <InfoItem label={t.labels.dnt} value={data.doNotTrack || 'Off'} />
          </>
      )}
    </InfoCard>
  );
};
