
import React, { useState } from 'react';
import { Brain, Sparkles, Zap, RefreshCw } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatNumber } from '../../utils/formatters';

interface AiComputeCardProps {
  data: BrowserData['ai'];
  t: Translation;
  onOpenPlayground: () => void;
  onOpenStress?: () => void; 
  onRetest: () => void;
}

export const AiComputeCard: React.FC<AiComputeCardProps> = React.memo(({ data, t, onOpenPlayground, onOpenStress, onRetest }) => {
  const [isRetesting, setIsRetesting] = useState(false);
  const trVal = (val: boolean) => val ? t.values.supported : t.values.not_supported;

  const getReadinessColor = (level: string) => {
      switch(level) {
          case 'Ultra': return 'purple';
          case 'High': return 'indigo';
          case 'Medium': return 'info';
          default: return 'neutral';
      }
  };

  // Get localized description based on level
  const getDescription = (level: string) => {
      
      // @ts-expect-error auto-fixed
      return t.labels.ai_levels?.[level] || level;
  };

  const handleRetest = () => {
      setIsRetesting(true);
      // Small delay to allow UI to update state before blocking calculation
      // and ensuring the animation is visible for a moment
      setTimeout(() => {
          onRetest();
          // Keep spinning a bit longer for visual feedback
          setTimeout(() => setIsRetesting(false), 600);
      }, 50);
  };

  return (
    <InfoCard title={t.sections.ai_compute} icon={Brain}>
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">{t.labels.ai_readiness}</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleRetest}
                        disabled={isRetesting}
                        className={`p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-full transition-all ${isRetesting ? 'animate-spin' : ''}`}
                        title={t.common.refresh}
                    >
                        <RefreshCw size={12} />
                    </button>
                    <Badge variant={getReadinessColor(data.readiness.level) as any}>{data.readiness.level}</Badge>
                </div>
            </div>
            <div className="text-sm font-mono font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                {formatNumber(data.readiness.flops, 3)} GFLOPS <span className="text-xs font-normal opacity-70">{t.labels.est_js}</span>
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 leading-tight opacity-90">
                {getDescription(data.readiness.level)}
            </div>
        </div>
        <InfoItem label={t.labels.window_ai} value={trVal(data.windowAi)} />
        <InfoItem label={t.labels.webnn} value={trVal(data.webnn)} />
        
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex gap-2">
            <Button 
                variant="primary" 
                size="xs" 
                fullWidth 
                onClick={onOpenPlayground} 
                leftIcon={<Sparkles size={14} />}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
            >
                {t.aiPlayground.title}
            </Button>
            {onOpenStress && (
                <Button 
                    variant="secondary" 
                    size="xs" 
                    fullWidth 
                    onClick={onOpenStress} 
                    leftIcon={<Zap size={14} className="text-amber-500" />}
                >
                    {t.actions.stress_test}
                </Button>
            )}
        </div>
    </InfoCard>
  );
});
