
import React from 'react';
import { Zap } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { FeatureItem } from '../../types';
import { SectionGroup } from '../ui/SectionGroup';

interface FeaturesSectionProps {
  features: FeatureItem[];
  t: Translation;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, t }) => {
  return (
    <SectionGroup title={t.sections.features} icon={<Zap className="text-amber-500" size={24} />}>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <div key={feature.key} className={`relative p-4 rounded-lg border transition-all duration-200 ${feature.supported ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${feature.supported ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                    {/* @ts-expect-error */}
                                    {t.features[feature.key] || feature.name}
                                </h3>
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${feature.supported ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {/* @ts-expect-error */}
                                {t.featureDescs[feature.key] || feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </SectionGroup>
  );
};
