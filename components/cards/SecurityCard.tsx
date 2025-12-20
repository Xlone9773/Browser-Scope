
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface SecurityCardProps {
  data: BrowserData['security'];
  webrtcIp: string;
  t: Translation;
  simpleMode: boolean;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ data, webrtcIp, t, simpleMode }) => {
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
};
