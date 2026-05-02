import React from 'react';
import { InfoCard } from '../InfoCard';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Bot } from 'lucide-react';
import { useEnvironmentAssessment } from '../../hooks/useEnvironmentAssessment';

interface EnvironmentCardProps {
    t: any;
}

export const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ t }) => {
    const assessment = useEnvironmentAssessment();
    const isCN = !!t?.status?.safe; // simple check if t is zh-CN or EN. We'll use english defaults if not mapped

    const tEnv = isCN ? {
        safe: "环境安全",
        suspicious: "环可能被篡改",
        danger: "高危：检测到自动化工具或特征篡改",
        score: "信任分数",
        anomalies: "检测到的异常:",
        loading: "正在评估环境...",
        tooltipSafe: "未检测到明显的浏览器指纹篡改或自动化工具痕迹。",
        tooltipDanger: "高度疑似机器人、爬虫或使用了指纹多开浏览器。",
        bot: "可疑的脚本或自动化",
        tampering: "指纹篡改",
    } : {
        safe: "Environment Trusted",
        suspicious: "Suspicious Environment",
        danger: "Danger: Automation / Tampering Detected",
        score: "Trust Score",
        anomalies: "Anomalies Detected:",
        loading: "Assessing environment...",
        tooltipSafe: "No clear signs of tampering or automation tools were found.",
        tooltipDanger: "High probability of being a bot, scraper, or anti-detect browser.",
        bot: "Suspicious Automation",
        tampering: "Fingerprint Tampering",
    };

    if (assessment.isLoading) {
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

    // Determine colors
    const isSafe = assessment.level === 'safe';
    const isSuspicious = assessment.level === 'suspicious';
    const colorClass = isSafe ? 'text-emerald-500' : (isSuspicious ? 'text-amber-500' : 'text-rose-500');
    const bgClass = isSafe ? 'bg-emerald-50 dark:bg-emerald-500/10' : (isSuspicious ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-rose-50 dark:bg-rose-500/10');
    const borderColor = isSafe ? 'border-emerald-200 dark:border-emerald-500/20' : (isSuspicious ? 'border-amber-200 dark:border-amber-500/20' : 'border-rose-200 dark:border-rose-500/20');

    // Mappings for localized anomalies (quick manual map)
    const anomalyMap: Record<string, { labelCN: string, labelEN: string }> = {
        'webdriver': { labelCN: '检测到WebDriver (自动化浏览器)', labelEN: 'WebDriver signal detected (Automated browser)' },
        'headless_dims': { labelCN: '无头浏览器尺寸异常 (宽/高为0)', labelEN: 'Window dimensions are zero (Typical of headless browsers)' },
        'missing_chrome': { labelCN: 'Chrome环境下丢失 window.chrome', labelEN: 'Missing window.chrome object in Chrome browser' },
        'phantomjs': { labelCN: '检测到 PhantomJS 运行环境', labelEN: 'PhantomJS runtime detected' },
        'dom_automation': { labelCN: '检测到 DOM Automation 对象', labelEN: 'DOM Automation object detected' },
        'ua_override': { labelCN: 'userAgent 属性遭到篡改或覆盖', labelEN: 'UserAgent property has been tampered with' },
        'platform_override': { labelCN: 'platform 属性遭到篡改或覆盖', labelEN: 'Platform property has been tampered with' },
        'os_mismatch': { labelCN: 'UA和Platform反应的操作系统不匹配', labelEN: 'UserAgent vs Platform OS mismatch' },
        'no_languages': { labelCN: '语言列表为空 (navigator.languages)', labelEN: 'No languages specified in navigator' },
        'permission_mismatch': { labelCN: 'Permissions API 与 Notification API 冲突', labelEN: 'Permissions API response contradicts Notification API' },
        'engine_mismatch': { labelCN: 'JS引擎堆栈格式与用户代理不符', labelEN: 'JS Engine error stack format contradicts UserAgent claims' }
    };

    return (
        <InfoCard title={isCN ? "环境可信度评估" : "Environment & Trust Assessment"} icon={isSafe ? ShieldCheck : (isSuspicious ? AlertTriangle : Bot)}>
            <div className="p-6">
                <div className={`p-4 rounded-xl border ${bgClass} ${borderColor} flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4`}>
                    <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm border ${borderColor}`}>
                        {isSafe && <ShieldCheck size={32} className="text-emerald-500" />}
                        {isSuspicious && <AlertTriangle size={32} className="text-amber-500" />}
                        {!isSafe && !isSuspicious && <Bot size={32} className="text-rose-500" />}
                    </div>
                
                <div className="flex-1 text-center sm:text-left">
                    <h3 className={`text-lg font-bold mb-1 ${colorClass}`}>
                        {isSafe ? tEnv.safe : (isSuspicious ? tEnv.suspicious : tEnv.danger)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isSafe ? tEnv.tooltipSafe : tEnv.tooltipDanger}
                    </p>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm w-24">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1 shrink-0 whitespace-nowrap">{tEnv.score}</span>
                    <span className={`text-2xl font-black ${colorClass}`}>{assessment.score}</span>
                </div>
            </div>

            {assessment.anomalies.length > 0 && (
                <div className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Info size={16} className="text-slate-400" />
                        {tEnv.anomalies}
                    </div>
                    <div className="grid gap-2">
                        {assessment.anomalies.map((anomaly, idx) => {
                            const isDang = anomaly.level === 'danger';
                            return (
                                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <div className="shrink-0 mt-0.5">
                                        {isDang ? <ShieldAlert size={16} className="text-rose-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                                    </div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className={`font-semibold mr-2 ${isDang ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                            [{isDang ? tEnv.bot : tEnv.tampering}]
                                        </span>
                                        {isCN ? (anomalyMap[anomaly.id]?.labelCN || anomaly.description) : (anomalyMap[anomaly.id]?.labelEN || anomaly.description)}
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
};
