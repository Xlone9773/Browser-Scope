
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

export const SystemCard: React.FC<SystemCardProps> = React.memo(({ data, t, simpleMode, lang = 'en' }) => {
  const trVal = (val: boolean) => val ? t.values.supported : t.values.not_supported;
  const { formatLanguageName, list } = useFormatter(lang);

  // Advanced: Convert codes like 'zh-CN' to 'Chinese (Simplified)' in current UI language
  const readableLanguages = data.preferredLanguages.map(code => {
      const name = formatLanguageName(code);
      // If name matches code (DisplayNames failed or not found), keep code
      return name === code ? code : name;
  });

  const hasClientHints = !!data.clientHints && Object.keys(data.clientHints).length > 0;

  return (
    <InfoCard title={t.sections.system} icon={Smartphone}>
      <InfoItem label={t.labels.os} value={data.os} />
      
      {/* Platform / Bitness from Hints if available */}
      {hasClientHints && data.clientHints?.platformVersion ? (
          <InfoItem label={t.labels.platform_ver} value={data.clientHints.platformVersion} subValue={data.clientHints.bitness ? `${data.clientHints.bitness}-bit` : undefined} />
      ) : (
          <InfoItem label={t.labels.platform} value={data.platform} />
      )}
      
      <InfoItem label={t.labels.browser} value={`${data.browserName} ${data.browserVersion}`} />
      
      {/* Specific Client Hints */}
      {hasClientHints && !simpleMode && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 my-1 border border-slate-100 dark:border-slate-700/50">
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">Client Hints (Deep Scan)</div>
             {data.clientHints?.model && <InfoItem label={t.labels.model} value={data.clientHints.model} />}
             {data.clientHints?.architecture && <InfoItem label={t.labels.arch} value={data.clientHints.architecture} />}
             {data.clientHints?.bitness && <InfoItem label={t.labels.bitness} value={data.clientHints.bitness} />}
          </div>
      )}

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
});
