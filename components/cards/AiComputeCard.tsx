
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface AiComputeCardProps {
  data: BrowserData['ai'];
  t: Translation;
  onOpenPlayground: () => void;
}

export const AiComputeCard: React.FC<AiComputeCardProps> = ({ data, t, onOpenPlayground }) => {
  const trVal = (val: boolean) => val ? t.values.supported : t.values.not_supported;

  return (
    <InfoCard title={t.sections.ai_compute} icon={Brain}>
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">{t.labels.ai_readiness}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-700">{data.readiness.level}</span>
            </div>
            <div className="text-sm font-mono font-bold text-indigo-900 dark:text-indigo-100 mt-1">{data.readiness.flops}</div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 leading-tight opacity-90">{data.readiness.description}</div>
        </div>
        <InfoItem label={t.labels.window_ai} value={trVal(data.windowAi)} />
        <InfoItem label={t.labels.webnn} value={trVal(data.webnn)} />
        
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50">
            <button onClick={onOpenPlayground} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">
                <Sparkles size={14} />
                {t.aiPlayground.title}
            </button>
        </div>
    </InfoCard>
  );
};
