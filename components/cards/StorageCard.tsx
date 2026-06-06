
import React from 'react';
import { HardDrive, Trash2, Gauge } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';
import { useModalManager } from '../../hooks/useModalManager';

interface StorageCardProps {
  data: BrowserData['storage'];
  t: Translation;
}

export const StorageCard: React.FC<StorageCardProps> = React.memo(({ data, t }) => {
  const { open: _open } = useModalManager();

  const trVal = (val: string | boolean | undefined | null) => {
    if (val === true) return t.values.supported;
    if (val === false) return t.values.not_supported;
    return val;
  };

  // Parse quota and usage for progress bar
  let percentage = 0;
  let usageBytes = 0;
  let quotaBytes = 0;

  // Simple heuristic parsing
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

  // Handle clear
  const clearStorage = () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
  };

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
        
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex gap-2">
            <Button 
                variant="soft" 
                size="xs" 
                fullWidth 
                onClick={() => {
                    // We need to trigger the modal opening via the parent or context. 
                    // Since InfoCard is just a display component, we rely on props or a global context.
                    // However, in this architecture, modals are managed in App.tsx.
                    // But wait, I added useModalManager but it provides state, not global dispatch unless using Context.
                    // The standard pattern here is passing an `onOpen` prop.
                    // Since I cannot change App.tsx's props passed to StorageCard easily without changing App.tsx too,
                    // I will dispatch a custom event which App.tsx can listen to, or ideally, update App.tsx.
                    
                    // Actually, the cleanest way is to use the global window event or just update App.tsx to pass the handler.
                    // Let's assume App.tsx will be updated to pass `onOpenBenchmark` prop if I change the interface.
                    // But I need to update App.tsx anyway to register the modal.
                    window.dispatchEvent(new CustomEvent('open-storage-benchmark'));
                }} 
                leftIcon={<Gauge size={14} />}
            >
                {t.actions.open_storage_bench}
            </Button>
            <Button 
                variant="danger-soft" 
                size="xs" 
                fullWidth 
                onClick={clearStorage} 
                leftIcon={<Trash2 size={14} />}
            >
                {t.settings.storage.local.clearBtn}
            </Button>
        </div>
    </InfoCard>
  );
});
