
import React from 'react';
import { AppWindow, Download, CheckCircle } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { FeatureItem } from '../../types';
import { SectionGroup } from '../ui/SectionGroup';

interface PwaSectionProps {
  isPwaInstalled: boolean;
  features: FeatureItem[];
  t: Translation;
}

export const PwaSection: React.FC<PwaSectionProps> = ({ isPwaInstalled, features, t }) => {
  return (
    <SectionGroup title={t.sections.pwa} icon={<AppWindow className="text-sky-500" size={24} />}>
        {/* PWA Section uses 1 full-width column in the SectionGroup grid since it renders its own card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <div className={`p-3 rounded-full ${isPwaInstalled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {isPwaInstalled ? <CheckCircle size={24} /> : <Download size={24} />}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.labels.pwa_install_status}</div>
                            <div className={`text-lg font-bold ${isPwaInstalled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{isPwaInstalled ? t.values.installed : t.values.not_installed}</div>
                        </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <div key={feature.key} className={`relative p-4 rounded-lg border transition-all duration-200 ${feature.supported ? 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-900/30 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${feature.supported ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                    
                                    {(t.features as any)[feature.key] || feature.name}
                                </h3>
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${feature.supported ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                
                                {(t.featureDescs as any)[feature.key] || feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </SectionGroup>
  );
};
