
import React from 'react';
import { ShieldAlert, Puzzle } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface SecurityCardProps {
  data: BrowserData['security'];
  webrtcIp: string;
  t: Translation;
  simpleMode: boolean;
  onOpenExtensions: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = React.memo(({ data, webrtcIp, t, simpleMode, onOpenExtensions }) => {
  // Helper for translation values
  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    return val;
  };

  return (
    <InfoCard title={t.sections.security} icon={ShieldAlert}>
        <InfoItem label={t.labels.is_bot} value={data.isBot ? t.values.detected : t.values.none} subValue={data.isBot ? "Navigator.webdriver" : undefined} />
        <InfoItem label={t.labels.ad_block} value={data.adBlockEnabled ? t.values.detected : t.values.none} />
        
        <div className="py-2 border-t border-slate-100 dark:border-slate-800/50 mt-1">
           <button 
               onClick={onOpenExtensions}
               className="w-full text-left text-sm py-1.5 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 flex justify-between items-center text-slate-700 dark:text-slate-300 transition-colors"
           >
               <span className="flex items-center gap-2">
                   <Puzzle size={16} />
                   {(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).extensionsModal?.title || "Browser Extensions"}
               </span>
               <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{t.actions?.check || "Check"}</span>
           </button>
        </div>

        <InfoItem label={t.labels.secure_context} value={trVal(data.secureContext)} />
        {!simpleMode && (
            <>
              <InfoItem label={t.labels.webrtc_ip} value={webrtcIp || t.values.hidden} />
              <InfoItem label={t.labels.gpc_enabled} value={trVal(data.gpcEnabled)} />
              <InfoItem label={t.labels.pdf_viewer} value={trVal(data.pdfViewer)} />
            </>
        )}
    </InfoCard>
  );
});
