import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
    Gauge, 
    Zap, 
    Shield, 
    Video, 
    Cpu, 
    Compass, 
    Check, 
    X, 
    AlertTriangle, 
    RefreshCw, 
    ShieldCheck, 
    CpuIcon, 
    FileCode, 
    Info 
} from 'lucide-react';
import { Translation } from '../../utils/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select, SelectOption } from '../ui/Select';

const getGrade = (score: number): string => {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'A-';
    if (score >= 60) return 'B';
    if (score >= 45) return 'C';
    return 'D';
};

const getGradeColorClass = (grade: string): string => {
    if (grade === 'S') return 'text-indigo-500 dark:text-indigo-400';
    if (grade.startsWith('A')) return 'text-emerald-500 dark:text-emerald-400';
    if (grade === 'B') return 'text-blue-500 dark:text-blue-400';
    if (grade === 'C') return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
};

interface TestItem {
    id: string;
    name: string;
    supported: boolean;
    displayValue?: string;
}

interface DimensionResult {
    score: number;
    items: TestItem[];
}

interface ReportResults {
    rendering: DimensionResult;
    computing: DimensionResult;
    codecs: DimensionResult;
    apis: DimensionResult;
    privacy: DimensionResult;
    overallScore: number;
    ratingKey: 'perfect' | 'excellent' | 'good' | 'standard' | 'weak';
}

interface BrowserReportProps {
    t: Translation;
}

type DimensionKey = 'rendering' | 'computing' | 'codecs' | 'apis' | 'privacy';

export const BrowserReport: React.FC<BrowserReportProps> = ({ t }) => {
    const [isAuditing, setIsAuditing] = useState<boolean>(false);
    const [results, setResults] = useState<ReportResults | null>(null);
    const [activeTab, setActiveTab] = useState<DimensionKey>('rendering');
    const [scoreDisplayMode, setScoreDisplayMode] = useState<'number' | 'grade'>('number');

    const reportT = t.browserReport || {
        title: "Browser Audit Report",
        subtitle: "Comprehensive check on rendering, core computation, codecs, API levels, and privacy",
        startAudit: "Run Audit",
        reAudit: "Re-Audit",
        evaluating: "Auditing browser capabilities...",
        overallScore: "Overall Score",
        rating: "Overall Rating",
        dimensions: {
            rendering: "Graphics & Rendering",
            computing: "Core Compute Power",
            codecs: "Media Codecs",
            apis: "System APIs Support",
            privacy: "Privacy Safeguards"
        },
        dimensionDescs: {
            rendering: "WebGL, WebGPU, and modern CSS rendering standards",
            computing: "Multi-threading, WASM execution speed, and CPU concurrency",
            codecs: "Hardware/software AV1, VP9, AAC, Opus decoding capabilities",
            apis: "FileSystem, WebUSB, Geolocation, and modern Web APIs",
            privacy: "DoNotTrack, cookie storage sandbox, and leak prevention"
        },
        ratings: {
            perfect: "Exemplary",
            excellent: "Excellent",
            good: "Good",
            standard: "Standard",
            weak: "Weak"
        },
        ratingsDesc: {
            perfect: "Your browser has outstanding capabilities, fully supporting cutting-edge WebGPU graphics, high-performance WASM computing, rich modern APIs, and strict privacy protection.",
            excellent: "Excellent performance with high graphics and api support. Suitable for complex modern web applications and media playback.",
            good: "Good performance, covering major modern specifications. Some niche system APIs or hardware capabilities are not enabled.",
            standard: "Basic web capabilities are supported, but modern high-performance rendering (WebGPU/WebGL2) or strict privacy configurations are missing.",
            weak: "Limited browser features, with potential security leaks or lacking modern rendering engines."
        },
        status: {
            supported: "Supported",
            unsupported: "Unsupported",
            enabled: "Enabled",
            disabled: "Disabled"
        },
        advises: "Professional Recommendations",
        adviseItems: {
            upgrade: "Consider updating your browser or operating system to unlock full WebGPU/WebAssembly capabilities.",
            privateMode: "Enabling Do Not Track and hardening WebRTC can enhance your privacy security.",
            acceleration: "Make sure hardware acceleration is enabled in browser settings for optimal rendering performance.",
            allSet: "Your browser is fully optimized. Keep it updated for continued security and performance."
        },
        displayModeOptionNumber: "Score (0-100)",
        displayModeOptionGrade: "Grade (S-D)"
    };

    const runDiagnostic = useCallback((): void => {
        setIsAuditing(true);

        setTimeout((): void => {
            // 1. Rendering
            const hasWebGL: boolean = typeof window !== 'undefined' && (!!window.WebGLRenderingContext || !!document.createElement('canvas').getContext('webgl'));
            const hasWebGPU: boolean = typeof navigator !== 'undefined' && ('gpu' in navigator);
            const hasCanvas: boolean = typeof document !== 'undefined' && (!!document.createElement('canvas').getContext);
            const hasContainerQueries: boolean = typeof CSS !== 'undefined' && CSS.supports('container-type: inline-size');
            const hasViewTransitions: boolean = typeof document !== 'undefined' && ('startViewTransition' in document);

            const renderingItems: TestItem[] = [
                { id: 'webgpu', name: 'WebGPU (Next-gen Graphics)', supported: hasWebGPU },
                { id: 'webgl', name: 'WebGL (3D Context)', supported: hasWebGL },
                { id: 'canvas', name: 'Canvas 2D Rendering', supported: hasCanvas },
                { id: 'container_queries', name: 'CSS Container Queries', supported: hasContainerQueries },
                { id: 'view_transitions', name: 'View Transitions API', supported: hasViewTransitions }
            ];
            const renderingScore: number = Math.round((renderingItems.filter((i: TestItem) => i.supported).length / renderingItems.length) * 100);

            // 2. Computing
            const hasWorkers: boolean = typeof Worker !== 'undefined';
            const hasWASM: boolean = typeof WebAssembly !== 'undefined';
            const cpuCores: number = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 1 : 1;
            const hasSharedArrayBuffer: boolean = typeof SharedArrayBuffer !== 'undefined';
            const hasWebNN: boolean = typeof navigator !== 'undefined' && ('ml' in navigator || 'webnn' in navigator);

            const computingItems: TestItem[] = [
                { id: 'wasm', name: 'WebAssembly (WASM)', supported: hasWASM },
                { id: 'workers', name: 'Web Workers (Multi-threading)', supported: hasWorkers },
                { id: 'shared_array_buffer', name: 'SharedArrayBuffer', supported: hasSharedArrayBuffer },
                { id: 'cpu_concurrency', name: `High Concurrency (CPU Cores: ${cpuCores})`, supported: cpuCores >= 4 },
                { id: 'webnn', name: 'WebNN (Neural Network API)', supported: hasWebNN }
            ];
            const computingScore: number = Math.round((computingItems.filter((i: TestItem) => i.supported).length / computingItems.length) * 100);

            // 3. Codecs
            let hasVP9: boolean = false;
            let hasAV1: boolean = false;
            let hasAAC: boolean = false;
            let hasOpus: boolean = false;

            if (typeof document !== 'undefined') {
                const video: HTMLVideoElement = document.createElement('video');
                const audio: HTMLAudioElement = document.createElement('audio');
                hasVP9 = video.canPlayType('video/webm; codecs="vp9"') !== '';
                hasAV1 = video.canPlayType('video/mp4; codecs="av01.0.05M.08"') !== '';
                hasAAC = audio.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== '';
                hasOpus = audio.canPlayType('audio/webm; codecs="opus"') !== '';
            }

            const codecsItems: TestItem[] = [
                { id: 'av1', name: 'AV1 Video Decoding', supported: hasAV1 },
                { id: 'vp9', name: 'VP9 Video Decoding', supported: hasVP9 },
                { id: 'aac', name: 'AAC Audio Decoding', supported: hasAAC },
                { id: 'opus', name: 'Opus Audio Decoding', supported: hasOpus }
            ];
            const codecsScore: number = Math.round((codecsItems.filter((i: TestItem) => i.supported).length / codecsItems.length) * 100);

            // 4. APIs
            const hasFS: boolean = typeof window !== 'undefined' && ('showOpenFilePicker' in window);
            const hasGeo: boolean = typeof navigator !== 'undefined' && ('geolocation' in navigator);
            const hasNotification: boolean = typeof window !== 'undefined' && ('Notification' in window);
            const hasClipboard: boolean = typeof navigator !== 'undefined' && ('clipboard' in navigator);

            const apisItems: TestItem[] = [
                { id: 'filesystem', name: 'FileSystem Access API', supported: hasFS },
                { id: 'geolocation', name: 'Geolocation API', supported: hasGeo },
                { id: 'notification', name: 'Notification API', supported: hasNotification },
                { id: 'clipboard', name: 'Clipboard Read/Write API', supported: hasClipboard }
            ];
            const apisScore: number = Math.round((apisItems.filter((i: TestItem) => i.supported).length / apisItems.length) * 100);

            // 5. Privacy
            const isDNT: boolean = typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || ('doNotTrack' in window ? (window as unknown as Record<string, string>).doNotTrack === '1' : false));
            const hasCookies: boolean = typeof navigator !== 'undefined' && navigator.cookieEnabled;
            const hasStoragePersist: boolean = typeof navigator !== 'undefined' && ('storage' in navigator && 'persist' in navigator.storage);
            const isSecure: boolean = typeof window !== 'undefined' && window.isSecureContext;

            const privacyItems: TestItem[] = [
                { id: 'dnt', name: 'Do Not Track (DNT) Signal', supported: isDNT, displayValue: isDNT ? reportT.status.enabled : reportT.status.disabled },
                { id: 'cookies', name: 'Cookie Security Sandbox', supported: hasCookies, displayValue: hasCookies ? reportT.status.enabled : reportT.status.disabled },
                { id: 'storage_persist', name: 'Persistent Storage API', supported: hasStoragePersist },
                { id: 'secure_context', name: 'HTTPS Secure Context', supported: isSecure }
            ];
            const privacyScore: number = Math.round((privacyItems.filter((i: TestItem) => i.supported).length / privacyItems.length) * 100);

            // Overall Score
            const overallScore: number = Math.round((renderingScore + computingScore + codecsScore + apisScore + privacyScore) / 5);

            let ratingKey: 'perfect' | 'excellent' | 'good' | 'standard' | 'weak' = 'weak';
            if (overallScore >= 90) {
                ratingKey = 'perfect';
            } else if (overallScore >= 75) {
                ratingKey = 'excellent';
            } else if (overallScore >= 60) {
                ratingKey = 'good';
            } else if (overallScore >= 40) {
                ratingKey = 'standard';
            }

            setResults({
                rendering: { score: renderingScore, items: renderingItems },
                computing: { score: computingScore, items: computingItems },
                codecs: { score: codecsScore, items: codecsItems },
                apis: { score: apisScore, items: apisItems },
                privacy: { score: privacyScore, items: privacyItems },
                overallScore,
                ratingKey
            });
            setIsAuditing(false);
        }, 1200);
    }, [reportT.status.enabled, reportT.status.disabled]);

    useEffect((): void => {
        // Run diagnosis on initial load to populate first report
        runDiagnostic();
    }, [runDiagnostic]);

    const getTabIcon = (tab: DimensionKey): React.ReactNode => {
        switch (tab) {
            case 'rendering':
                return <Zap size={16} />;
            case 'computing':
                return <Cpu size={16} />;
            case 'codecs':
                return <Video size={16} />;
            case 'apis':
                return <Compass size={16} />;
            case 'privacy':
                return <Shield size={16} />;
            default:
                return null;
        }
    };

    return (
        <div id="browser-quality-report" className="mt-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 p-6 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Gauge className="text-indigo-500 animate-pulse" size={22} />
                        {reportT.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xl">
                        {reportT.subtitle}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                    <div className="w-40">
                        <Select
                            value={scoreDisplayMode}
                            options={[
                                { id: 'number', label: reportT.displayModeOptionNumber || 'Score (0-100)' },
                                { id: 'grade', label: reportT.displayModeOptionGrade || 'Grade (S-D)' }
                            ]}
                            onChange={(val: unknown) => setScoreDisplayMode(val as 'number' | 'grade')}
                            size="sm"
                            fullWidth={true}
                        />
                    </div>
                    <Button
                        id="btn-trigger-browser-audit"
                        onClick={runDiagnostic}
                        disabled={isAuditing}
                        isLoading={isAuditing}
                        leftIcon={<RefreshCw size={14} className={isAuditing ? "animate-spin" : ""} />}
                        size="sm"
                        variant="primary"
                        className="shadow-sm"
                    >
                        {results ? reportT.reAudit : reportT.startAudit}
                    </Button>
                </div>
            </div>

            {isAuditing ? (
                <div id="audit-loading-indicator" className="py-16 flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {reportT.evaluating}
                    </p>
                </div>
            ) : results ? (
                <div id="audit-results-panel" className="mt-6">
                    {/* Summary Card with circular score */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 mb-6">
                        <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-6">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                {/* Circular progress track */}
                                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="42" 
                                        stroke="currentColor" 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                        className="text-slate-200 dark:text-slate-800"
                                    />
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="42" 
                                        stroke="currentColor" 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                        strokeDasharray="263.89" 
                                        strokeDashoffset={263.89 - (263.89 * results.overallScore) / 100}
                                        className={`${scoreDisplayMode === 'grade' ? getGradeColorClass(getGrade(results.overallScore)) : 'text-indigo-500'} transition-all duration-500`}
                                    />
                                </svg>
                                <div className="text-center">
                                    {scoreDisplayMode === 'grade' ? (
                                        <>
                                            <span className={`text-4xl font-extrabold ${getGradeColorClass(getGrade(results.overallScore))}`}>
                                                {getGrade(results.overallScore)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block mt-0.5">{results.overallScore}/100</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                                                {results.overallScore}
                                            </span>
                                            <span className="text-xs text-slate-400 block mt-0.5">/100</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <span className="text-xs font-semibold text-slate-400 block">{reportT.overallScore}</span>
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                <Badge variant="indigo">
                                    {reportT.rating}
                                </Badge>
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    {reportT.ratings[results.ratingKey]}
                                </h4>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                                {reportT.ratingsDesc[results.ratingKey]}
                            </p>
                        </div>
                    </div>

                    {/* Dimensions & Test Details Tabs */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Tab list */}
                        <div className="lg:col-span-5 flex flex-col gap-2">
                            {(Object.keys(reportT.dimensions) as DimensionKey[]).map((key: DimensionKey) => (
                                <button
                                    id={`tab-btn-${key}`}
                                    key={key}
                                    onClick={(): void => setActiveTab(key)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                                        activeTab === key 
                                            ? "bg-indigo-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                                            : "bg-transparent border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-600 dark:text-slate-400"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                            activeTab === key 
                                                ? "bg-indigo-500 text-white" 
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-500"
                                        }`}>
                                            {getTabIcon(key)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold block leading-tight">
                                                {reportT.dimensions[key]}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block line-clamp-1 max-w-[200px]">
                                                {reportT.dimensionDescs[key]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                            <div 
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                                                style={{ width: `${results[key].score}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold leading-none shrink-0 w-8 text-right">
                                            {results[key].score}%
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Selected Tab content */}
                        <div className="lg:col-span-7 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 p-5">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0">
                                    {getTabIcon(activeTab)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        {reportT.dimensions[activeTab]}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                        {reportT.dimensionDescs[activeTab]}
                                    </p>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-2">
                                {results[activeTab].items.map((item: TestItem) => (
                                    <div key={item.id} className="flex items-center justify-between py-3">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                            {item.name}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {item.displayValue ? (
                                                <Badge variant="neutral">
                                                    {item.displayValue}
                                                </Badge>
                                            ) : null}
                                            {item.supported ? (
                                                <Badge variant="success" icon={<Check size={10} strokeWidth={2.5} />}>
                                                    {reportT.status.supported}
                                                </Badge>
                                            ) : (
                                                <Badge variant="error" icon={<X size={10} strokeWidth={2.5} />}>
                                                    {reportT.status.unsupported}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customized professional recommendations */}
                    <div className="mt-6 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/20 p-5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                            <Info className="text-indigo-500 shrink-0" size={16} />
                            {reportT.advises}
                        </h4>
                        <div className="space-y-3">
                            {/* Recommend 1: Hardware Acceleration / Upgrade */}
                            {results.overallScore < 90 ? (
                                <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl">
                                    <CpuIcon className="text-amber-500 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {reportT.dimensions.rendering} & {reportT.dimensions.computing}
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {results.rendering.score < 80 ? reportT.adviseItems.acceleration : reportT.adviseItems.upgrade}
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Recommend 2: Privacy Signal Enhancement */}
                            {results.privacy.score < 100 ? (
                                <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl">
                                    <ShieldCheck className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {reportT.dimensions.privacy}
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {reportT.adviseItems.privateMode}
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Perfect Configuration Notice */}
                            {results.overallScore >= 90 ? (
                                <div className="flex gap-3 items-start bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 p-3 rounded-xl">
                                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            Excellent Environment State
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {reportT.adviseItems.allSet}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
