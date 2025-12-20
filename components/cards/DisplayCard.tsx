
import React from 'react';
import { Layers } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { RefreshRate } from '../RefreshRate';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface DisplayCardProps {
  data: BrowserData['display'];
  screenExtended: boolean;
  t: Translation;
  simpleMode: boolean;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({ data, screenExtended, t, simpleMode }) => {
  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    return val;
  };

  return (
    <InfoCard title={t.sections.display} icon={Layers}>
      <InfoItem label={t.labels.resolution} value={data.resolution} />
      <RefreshRate label={t.labels.refresh_rate} />
      {!simpleMode && (
          <>
              <InfoItem label={t.labels.avail_size} value={data.availableSize} />
              <InfoItem label={t.labels.pixel_ratio} value={`${data.pixelRatio}x`} />
              <InfoItem label={t.labels.color_depth} value={`${data.colorDepth}-bit`} />
              <InfoItem label={t.labels.screen_extended} value={trVal(screenExtended)} />
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors px-2 -mx-2 rounded">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.orientation}</span>
                  <div className="text-right flex items-center gap-2">
                      <span className="text-sm text-slate-800 dark:text-slate-200">{data.orientation}</span>
                      <span className="text-xs text-slate-400">({data.orientationAngle})</span>
                  </div>
              </div>
              <InfoItem label={t.labels.hdr} value={trVal(data.hdr)} />
              <InfoItem label={t.labels.display_mode} value={data.displayMode} />
              <InfoItem label={t.labels.dark_mode} value={trVal(data.darkMode)} />
          </>
      )}
    </InfoCard>
  );
};
