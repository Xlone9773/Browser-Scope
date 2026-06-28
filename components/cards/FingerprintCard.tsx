
import React from 'react';
import { Fingerprint, ChevronRight, ZoomIn, FileCode, ExternalLink, Settings } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { Button } from '../ui/Button';

interface FingerprintCardProps {
  data: BrowserData['fingerprints'];
  audioSampleRate: string;
  t: Translation;
  simpleMode: boolean;
  onOpenScore: () => void;
  onOpenCanvas: () => void;
  onOpenBase64: () => void;
  onOpenWebgl: () => void;
  onOpenFingerprintModal: () => void;
  onOpenAudioLatency?: () => void;
}

export const FingerprintCard: React.FC<FingerprintCardProps> = React.memo(({ 
    data, 
    audioSampleRate, 
    t, 
    simpleMode,
    onOpenScore,
    onOpenCanvas,
    onOpenBase64,
    onOpenWebgl,
    onOpenFingerprintModal,
    onOpenAudioLatency
}) => {
  const getScoreColor = (score: number) => {
      if (score > 80) return 'text-red-500';
      if (score > 60) return 'text-orange-500';
      if (score > 30) return 'text-yellow-500';
      return 'text-green-600';
  };

  return (
    <InfoCard title={t.sections.fingerprints} icon={Fingerprint}>
        <div className="flex items-center justify-between p-3 mb-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.labels.fp_score}</span>
                <span className={`text-2xl font-bold ${getScoreColor(data.score.totalScore)}`}>{data.score.totalScore}/100</span>
            </div>
            <Button variant="secondary" size="xs" onClick={onOpenScore} rightIcon={<ChevronRight size={12} />}>
                {t.actions.view_details}
            </Button>
        </div>
        <InfoItem label={t.labels.canvas_hash} value={data.canvasHash} />
        <div className="relative group my-2 border border-slate-100 dark:border-slate-700 rounded p-1 bg-white flex justify-center cursor-pointer" onClick={onOpenCanvas}>
            <img src={data.canvasImage} alt="Canvas Fingerprint" className="h-10 object-contain opacity-80" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
            <ZoomIn className="text-white" size={16} />
            </div>
        </div>
        {!simpleMode && (
            <>
            <div className="flex justify-center mb-2">
                <button onClick={onOpenBase64} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                    <FileCode size={12} />
                    {t.actions.view_base64}
                </button>
            </div>
            <InfoItem label={t.labels.webgl_hash} value={data.webglHash} />
            <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-2 -mx-2 rounded">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">WebGL</span>
                <Button variant="soft" size="xs" onClick={onOpenWebgl} rightIcon={<ExternalLink size={10} />} className="px-2 py-1 h-auto min-h-0">
                    {t.actions.view_extensions}
                </Button>
            </div>
            <InfoItem label={t.labels.audio_rate} value={audioSampleRate} />
            <div 
                className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 group cursor-pointer transition-all duration-200 px-2 -mx-2 rounded"
                onClick={onOpenAudioLatency}
                title={t.audioLatencyProbing?.title || "Audio Output Latency & Channel Probing"}
            >
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {t.labels.audio_latency}
                </span>
                <div className="flex items-center gap-1.5 text-right">
                    <span className="text-sm text-slate-800 dark:text-slate-200 break-all font-mono font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {data.audioLatency}
                    </span>
                    <ChevronRight size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                </div>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-700/50 flex justify-center">
                <Button fullWidth variant="soft" size="sm" onClick={onOpenFingerprintModal} leftIcon={<Settings size={16} />}>
                    {t.fingerprintModal.title}
                </Button>
            </div>
            </>
        )}
    </InfoCard>
  );
});
