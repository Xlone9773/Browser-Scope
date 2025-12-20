
import React from 'react';
import { Film, Check, X, Mic2, Music } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { BrowserData } from '../../types';

interface MediaCapabilitiesCardProps {
  data: BrowserData['media'];
  t: Translation;
}

export const MediaCapabilitiesCard: React.FC<MediaCapabilitiesCardProps> = ({ data, t }) => {
  return (
    <InfoCard title={t.sections.media_sup} icon={Film}>
        <div className="mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.video_codecs}</span>
            <div className="grid grid-cols-2 gap-2">
            {data.video.map(c => (
                <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
            ))}
            </div>
        </div>
        <div className="mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.audio_codecs}</span>
            <div className="grid grid-cols-2 gap-2">
            {data.audio.map(c => (
                <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
            ))}
            </div>
        </div>
        <div className="mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.image_formats}</span>
            <div className="grid grid-cols-2 gap-2">
            {data.images.map(c => (
                <div key={c.name} className={`text-xs px-2 py-1 rounded border ${c.supported ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>{c.name}</div>
            ))}
            </div>
        </div>
        <div className="mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">{t.labels.drm_support}</span>
            <div className="flex flex-col gap-2">
            {data.drm.map(d => (
                <div key={d.name} className={`text-xs px-2 py-1.5 rounded border flex justify-between items-center ${d.supported ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800 text-sky-700 dark:text-sky-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                    <span className="font-medium">{d.name}</span>
                    {d.supported ? <Check size={12} /> : <X size={12} />}
                </div>
            ))}
            </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
                <Mic2 size={14} className="text-slate-400"/>
                <span className="text-xs font-medium text-slate-500">{t.labels.speech_voices}</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{data.speechVoices}</span>
        </div>
        <div className="mt-1 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
                <Music size={14} className="text-slate-400"/>
                <span className="text-xs font-medium text-slate-500">{t.labels.audio_channels}</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{data.audioChannels}</span>
        </div>
    </InfoCard>
  );
};
