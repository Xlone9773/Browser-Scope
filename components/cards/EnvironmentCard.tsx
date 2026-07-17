import React from 'react';
import { InfoCard } from '../InfoCard';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Bot, Fingerprint, Cpu } from 'lucide-react';
import { useEnvironmentAssessment, AnomalyCategory } from '../../hooks/useEnvironmentAssessment';
import { Translation } from '../../utils/i18n';

interface EnvironmentCardProps {
    t: Translation;
}

export const EnvironmentCard: React.FC<EnvironmentCardProps> = React.memo(({ t }) => {
    const assessment = useEnvironmentAssessment();
    const envT = t.environment;

    if (assessment.isLoading || !envT) {
        return (
            <InfoCard title="Trust Assessment" icon={ShieldCheck}>
                <div className="flex animate-pulse items-center gap-4 py-2 p-6">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                </div>
            </InfoCard>
        );
    }

    // Determine colors for trust
    const isTrustSafe = assessment.trustLevel === 'safe';
    const isTrustSuspicious = assessment.trustLevel === 'suspicious';
    const trustColorClass = isTrustSafe ? 'text-emerald-500' : (isTrustSuspicious ? 'text-amber-500' : 'text-rose-500');
    const trustBgClass = isTrustSafe ? 'bg-emerald-50 dark:bg-emerald-500/10' : (isTrustSuspicious ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-rose-50 dark:bg-rose-500/10');
    const trustBorderColor = isTrustSafe ? 'border-emerald-200 dark:border-emerald-500/20' : (isTrustSuspicious ? 'border-amber-200 dark:border-amber-500/20' : 'border-rose-200 dark:border-rose-500/20');

    // Determine colors for normalcy
    const isNormSafe = assessment.normalcyLevel === 'safe';
    const isNormSuspicious = assessment.normalcyLevel === 'suspicious';
    const normColorClass = isNormSafe ? 'text-blue-500' : (isNormSuspicious ? 'text-amber-500' : 'text-rose-500');
    const normBgClass = isNormSafe ? 'bg-blue-50 dark:bg-blue-500/10' : (isNormSuspicious ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-rose-50 dark:bg-rose-500/10');
    const normBorderColor = isNormSafe ? 'border-blue-200 dark:border-blue-500/20' : (isNormSuspicious ? 'border-amber-200 dark:border-amber-500/20' : 'border-rose-200 dark:border-rose-500/20');

    const getAnomalyCategoryLabel = (category: AnomalyCategory, level: string) => {
        if (category === 'trust') {
            return level === 'danger' ? envT.bot : envT.tampering;
        }
        return envT.inconsistency;
    };

    return (
        <InfoCard title={t.groups?.environment} icon={isTrustSafe && isNormSafe ? ShieldCheck : (isTrustSuspicious || isNormSuspicious ? AlertTriangle : Bot)}>
            <div className="p-6 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Trust Score */}
                    <div className={`p-4 rounded-xl border ${trustBgClass} ${trustBorderColor} flex flex-col sm:flex-row items-center gap-4 sm:gap-6 h-full`}>
                        <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm border ${trustBorderColor}`}>
                            {isTrustSafe && <ShieldCheck size={32} className="text-emerald-500" />}
                            {isTrustSuspicious && <Fingerprint size={32} className="text-amber-500" />}
                            {!isTrustSafe && !isTrustSuspicious && <Bot size={32} className="text-rose-500" />}
                        </div>
                    
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className={`text-lg font-bold mb-1 ${trustColorClass}`}>
                                {isTrustSafe ? envT.safe : (isTrustSuspicious ? envT.suspicious : envT.danger)}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {isTrustSafe ? envT.tooltipSafe : envT.tooltipDanger}
                            </p>
                        </div>

                        <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm w-24 border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1 shrink-0 whitespace-nowrap text-center leading-tight">{envT.score}</span>
                            <span className={`text-2xl font-black ${trustColorClass}`}>{assessment.trustScore}</span>
                        </div>
                    </div>

                    {/* Normalcy Score */}
                    <div className={`p-4 rounded-xl border ${normBgClass} ${normBorderColor} flex flex-col sm:flex-row items-center gap-4 sm:gap-6 h-full`}>
                        <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm border ${normBorderColor}`}>
                            {isNormSafe && <Cpu size={32} className="text-blue-500" />}
                            {isNormSuspicious && <AlertTriangle size={32} className="text-amber-500" />}
                            {!isNormSafe && !isNormSuspicious && <AlertTriangle size={32} className="text-rose-500" />}
                        </div>
                    
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className={`text-lg font-bold mb-1 ${normColorClass}`}>
                                {isNormSafe ? envT.normalcy?.normal : envT.normalcy?.abnormal}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {isNormSafe ? envT.normalcy?.tooltipNormal : envT.normalcy?.tooltipAbnormal}
                            </p>
                        </div>

                        <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm w-24 border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1 shrink-0 whitespace-nowrap text-center leading-tight">{envT.normalcyScore}</span>
                            <span className={`text-2xl font-black ${normColorClass}`}>{assessment.normalcyScore}</span>
                        </div>
                    </div>
                </div>

                {/* Anomalies List */}
                {assessment.anomalies.length > 0 && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Info size={16} className="text-slate-400" />
                            {envT.anomalies}
                        </div>
                        <div className="grid gap-2">
                            {assessment.anomalies.map((anomaly, idx) => {
                                const isDang = anomaly.level === 'danger';
                                const catLabel = getAnomalyCategoryLabel(anomaly.category, anomaly.level);
                                const desc = (envT.anomaliesList && (envT.anomaliesList as Record<string, string>)[anomaly.id]) || anomaly.description;

                                return (
                                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <div className="shrink-0 mt-0.5">
                                            {isDang ? <ShieldAlert size={16} className="text-rose-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                                        </div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300">
                                            <span className={`font-semibold mr-2 ${isDang ? 'text-rose-600 dark:text-rose-400' : (anomaly.category === 'normalcy' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400')}`}>
                                                [{catLabel}]
                                            </span>
                                            {desc}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </InfoCard>
    );
});
