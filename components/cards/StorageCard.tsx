
import React from 'react';
import { HardDrive, Database } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface StorageCardProps {
  data: BrowserData['storage'];
  t: Translation;
}

export const StorageCard: React.FC<StorageCardProps> = ({ data, t }) => {
  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    return val;
  };

  // Parse quota and usage for progress bar
  let percentage = 0;
  let usageBytes = 0;
  let quotaBytes = 0;

  // Simple heuristic parsing (since we format it in the service as string "XX GB")
  // Ideally, the service should return raw numbers, but for now we parse or assume
  // Note: Real implementation would pass raw numbers. 
  // Let's assume specific format "X.XX GB" or "X.XX MB"
  const parseSize = (str: string) => {
      const num = parseFloat(str);
      if (str.includes('GB')) return num * 1024 * 1024 * 1024;
      if (str.includes('MB')) return num * 1024 * 1024;
      return 0;
  };

  if (data.quota !== 'Unknown' && data.usage !== 'Unknown') {
      quotaBytes = parseSize(data.quota);
      usageBytes = parseSize(data.usage);
      if (quotaBytes > 0) {
          percentage = Math.min((usageBytes / quotaBytes) * 100, 100);
      }
  }

  return (
    <InfoCard title={t.sections.storage} icon={HardDrive}>
        
        {/* Usage Visualizer */}
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.labels.storage_usage}</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {percentage < 0.1 && percentage > 0 ? '< 0.1%' : `${percentage.toFixed(1)}%`}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                    style={{ width: `${Math.max(percentage, 1)}%` }} // Minimum 1% visible
                />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono">
                <span>{data.usage}</span>
                <span>{data.quota}</span>
            </div>
        </div>

        <InfoItem label={t.labels.storage_quota} value={data.quota} />
        <InfoItem label={t.labels.storage_persisted} value={trVal(data.persisted)} />
    </InfoCard>
  );
};
