// components/VideoDecodeModal.tsx
import React, { useState, useMemo, useRef } from 'react';
import {
    Film,
    Battery,
    Zap,
    Check,
    X,
    MonitorPlay,
    Filter,
    Music,
    Speaker,
    Tv,
    ShieldCheck,
    ShieldAlert,
    RotateCcw,
    Search,
    Download,
    CheckCircle2,
    Layers,
    Sparkles,
    Cpu
} from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Tabs, TabItem } from './ui/Tabs';
import {
    useVideoDecodeTests,
    VideoCodecRow,
    AudioCodecRow,
    VideoTestResultItem,
    AudioTestResultItem
} from '../hooks/useVideoDecodeTests';
import { VideoSummaryStats } from './video/VideoSummaryStats';
import { WebCodecsCard } from './video/WebCodecsCard';
import { LiveBenchmarkCard } from './video/LiveBenchmarkCard';

interface VideoDecodeModalProps {
    onClose: () => void;
    t: Translation['hardwareToolsModal'];
    values: Translation['values'];
    labels: Translation['labels'];
}

type FilterCategory = 'all' | 'sdr' | 'hdr' | 'nextgen' | 'dolby' | 'webrtc' | 'audio' | 'drm';

export const VideoDecodeModal: React.FC<VideoDecodeModalProps> = ({ onClose, t, values, labels }) => {
    const {
        videoResults,
        audioResults,
        drmResults,
        webCodecsResult,
        progress,
        isTesting,
        summaryStats,
        runTests
    } = useVideoDecodeTests();

    const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSupportedOnly, setShowSupportedOnly] = useState(false);
    const [showCopiedToast, setShowCopiedToast] = useState(false);

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'HDR10':
            case 'HDR10+':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
            case 'HLG':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
            case 'Dolby':
                return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
            case 'NextGen':
                return 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800/60';
            case 'Pro':
            case 'ProRes':
                return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800/60';
            case 'WebRTC':
                return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60';
            case 'Alpha':
                return 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/60';
            case 'DTS':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/60';
            case 'Hi-Res':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
            case 'Spatial':
                return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
            case 'SDR':
            case 'Web':
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const getCodecDescription = (description?: string): string => {
        if (!description) return '';
        const descMap: Record<string, keyof Translation['hardwareToolsModal']> = {
            'Universal Web & Streaming Standard': 'codec_desc_universal_web',
            'Low-latency Mobile & RTC Standard': 'codec_desc_low_latency_rtc',
            'Hi10P Anime & Master Distribution': 'codec_desc_hi10p_anime',
            'Out-of-band parameter sets (Standard MP4)': 'codec_desc_out_of_band',
            'In-band parameter sets (Apple/Safari Native)': 'codec_desc_in_band',
            'YouTube 4K Mainstream Standard': 'codec_desc_youtube_4k',
            'Legacy WebRTC & WebM Standard': 'codec_desc_legacy_webrtc',
            'Next-Gen Royalty-Free Standard': 'codec_desc_nextgen_royalty_free',
            '4K UHD Blu-ray & Streaming HDR Standard': 'codec_desc_uhd_bluray_hdr',
            'Broadcast HDR (BBC/NHK)': 'codec_desc_broadcast_hlg',
            'Dynamic Metadata HDR (Samsung / Prime Video)': 'codec_desc_dynamic_hdr10_plus',
            'YouTube HDR Video Streaming': 'codec_desc_youtube_hdr',
            'Next-Gen Royalty-Free HDR10': 'codec_desc_nextgen_hdr10',
            'Royalty-Free Broadcast HLG': 'codec_desc_royalty_free_hlg',
            'MPEG-I Versatile Video Coding (50% bitrate reduction over HEVC)': 'codec_desc_vvc_versatile',
            'VVC HDR 10-bit Ultra HD': 'codec_desc_vvc_hdr',
            'AV1 Professional Color Sampling': 'codec_desc_av1_pro_color',
            'AV1 Cinema & Studio Grade 12-bit': 'codec_desc_av1_cinema',
            'High-end Broadcast Camera Output': 'codec_desc_broadcast_camera',
            'Streaming standard (Netflix, Disney+, Apple TV+)': 'codec_desc_streaming_mainstream',
            'Cross-compatible with HDR10 hardware': 'codec_desc_cross_compatible_hdr10',
            'iPhone 12-16 Camera Native HDR Recording': 'codec_desc_iphone_camera',
            'Alpha Channel Transparent Video for Web UI': 'codec_desc_alpha_channel',
            'Apple Post-production Intermediate Codec': 'codec_desc_apple_prores',
            'Lossless Visual Quality with Transparency': 'codec_desc_lossless_transparent',
            'Hardware USB Webcam & Industrial Capture': 'codec_desc_usb_webcam',
        };
        const key = descMap[description];
        if (key && t[key]) {
            return (t[key] as string) || description;
        }
        return description;
    };

    const getAudioLabel = (label: string): string => {
        const audioMap: Record<string, keyof Translation['hardwareToolsModal']> = {
            'Advanced Audio Coding': 'audio_label_aac',
            'AAC + SBR': 'audio_label_he_aac',
            'Interactive Audio': 'audio_label_opus',
            'Surround 5.1': 'audio_label_ac3',
            'Enhanced AC-3 / Atmos': 'audio_label_eac3',
            'Free Lossless Audio Codec': 'audio_label_flac',
            'Apple Lossless': 'audio_label_alac',
            'Uncompressed Linear PCM': 'audio_label_pcm',
        };
        const key = audioMap[label];
        if (key && t[key]) {
            return (t[key] as string) || label;
        }
        return label;
    };

    const getTagLabel = (tag: string): string => {
        const tagMap: Record<string, keyof Translation['hardwareToolsModal']> = {
            'Dolby': 'tag_dolby_vision',
            'Universal': 'tag_universal',
            'Mobile': 'tag_mobile',
            'Low-Latency': 'tag_low_latency',
            'Lossless': 'tag_lossless',
            'ProRes': 'tag_prores',
            'Alpha': 'tag_alpha',
        };
        const key = tagMap[tag];
        if (key && t[key]) {
            return (t[key] as string) || tag;
        }
        return tag;
    };

    // Filter Video Codecs
    const filteredVideo = useMemo(() => {
        if (activeCategory === 'audio' || activeCategory === 'drm') {
            return [];
        }

        return videoResults
            .filter((row) => {
                if (activeCategory !== 'all' && row.category !== activeCategory) {
                    return false;
                }
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const matchesName = row.codec.toLowerCase().includes(query);
                    const matchesProfile = row.profile.toLowerCase().includes(query);
                    const matchesTag = row.tag.toLowerCase().includes(query);
                    const matchesDesc = row.description?.toLowerCase().includes(query) ?? false;
                    if (!matchesName && !matchesProfile && !matchesTag && !matchesDesc) {
                        return false;
                    }
                }
                return true;
            })
            .map((row) => {
                if (!showSupportedOnly) return row;
                return {
                    ...row,
                    tests: row.tests.filter((t) => t.supported)
                };
            })
            .filter((row) => !showSupportedOnly || row.tests.length > 0);
    }, [videoResults, activeCategory, searchQuery, showSupportedOnly]);

    // Filter Audio Codecs
    const filteredAudio = useMemo(() => {
        if (
            activeCategory === 'sdr' ||
            activeCategory === 'hdr' ||
            activeCategory === 'nextgen' ||
            activeCategory === 'dolby' ||
            activeCategory === 'webrtc' ||
            activeCategory === 'drm'
        ) {
            return [];
        }

        return audioResults
            .filter((row) => {
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const matchesName = row.codec.toLowerCase().includes(query);
                    const matchesLabel = row.label.toLowerCase().includes(query);
                    const matchesTag = row.tag.toLowerCase().includes(query);
                    if (!matchesName && !matchesLabel && !matchesTag) {
                        return false;
                    }
                }
                return true;
            })
            .map((row) => {
                if (!showSupportedOnly) return row;
                return {
                    ...row,
                    tests: row.tests.filter((t) => t.supported)
                };
            })
            .filter((row) => !showSupportedOnly || row.tests.length > 0);
    }, [audioResults, activeCategory, searchQuery, showSupportedOnly]);

    // Filter DRM systems
    const filteredDrm = useMemo(() => {
        if (activeCategory !== 'all' && activeCategory !== 'drm') {
            return [];
        }
        return showSupportedOnly ? drmResults.filter((sys) => sys.supported) : drmResults;
    }, [drmResults, activeCategory, showSupportedOnly]);

    // Export test report as JSON to clipboard
    const handleExportReport = () => {
        const report = {
            exportDate: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            summary: summaryStats,
            webCodecs: webCodecsResult,
            drmCapabilities: drmResults,
            videoCapabilities: videoResults.map((v) => ({
                codec: v.codec,
                profile: v.profile,
                bitDepth: v.bitDepth,
                tag: v.tag,
                resolutions: v.tests.map((t) => ({
                    label: t.label,
                    supported: t.supported ?? false,
                    smooth: t.smooth ?? false,
                    efficient: t.efficient ?? false
                }))
            })),
            audioCapabilities: audioResults.map((a) => ({
                codec: a.codec,
                label: a.label,
                tag: a.tag,
                configurations: a.tests.map((t) => ({
                    label: t.label,
                    supported: t.supported ?? false,
                    smooth: t.smooth ?? false,
                    efficient: t.efficient ?? false
                }))
            }))
        };

        const jsonString = JSON.stringify(report, null, 2);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonString).then(() => {
                setShowCopiedToast(true);
                setTimeout(() => setShowCopiedToast(false), 3000);
            });
        }
    };

    const contentRef = useRef<HTMLDivElement>(null);

    const handleCategoryChange = (id: FilterCategory) => {
        setActiveCategory(id);
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const categoryTabs: TabItem<FilterCategory>[] = [
        { id: 'all', label: t.filter_all || 'All', icon: <Layers size={14} /> },
        { id: 'sdr', label: t.filter_sdr || 'SDR', icon: <Tv size={14} /> },
        { id: 'hdr', label: t.filter_hdr || 'HDR / WCG', icon: <Sparkles size={14} /> },
        { id: 'nextgen', label: t.filter_nextgen || 'Next-Gen & Pro', icon: <Cpu size={14} /> },
        { id: 'dolby', label: t.filter_dolby || 'Dolby Vision', icon: <Zap size={14} /> },
        { id: 'webrtc', label: t.filter_webrtc || 'WebRTC', icon: <MonitorPlay size={14} /> },
        { id: 'audio', label: t.filter_audio || 'Audio', icon: <Music size={14} /> },
        { id: 'drm', label: t.filter_drm || 'DRM & APIs', icon: <ShieldCheck size={14} /> }
    ];

    return (
        <Modal
            title={t.tab_video}
            icon={<Film size={24} />}
            onClose={onClose}
            size="5xl"
            fullHeight
            noPadding
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
                {/* Pre-made Tab Navigation with Auto-Scroll */}
                <Tabs<FilterCategory>
                    id="video-decode-category-tabs"
                    items={categoryTabs}
                    activeTab={activeCategory}
                    onChange={handleCategoryChange}
                    variant="modal"
                    autoScroll={true}
                />

                {/* Sub-header Toolbar: Status & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs shrink-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <MonitorPlay size={16} className="text-indigo-500" />
                        <span>{isTesting ? t.video_instruction : t.video_title}</span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
                        {/* Search Field */}
                        <div className="relative w-full sm:w-60">
                            <Search
                                size={14}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.search_placeholder || 'Search codecs...'}
                                className="w-full pl-8 pr-7 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                            {isTesting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {progress}%
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={runTests}
                                        disabled={isTesting}
                                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs cursor-pointer"
                                    >
                                        <RotateCcw size={13} className={isTesting ? 'animate-spin' : ''} />
                                        {t.action_retest}
                                    </button>

                                    <button
                                        onClick={() => setShowSupportedOnly(!showSupportedOnly)}
                                        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                            showSupportedOnly
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300'
                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 shadow-2xs'
                                        }`}
                                    >
                                        <Filter size={13} />
                                        {t.filter_supported}
                                    </button>

                                    <button
                                        onClick={handleExportReport}
                                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs cursor-pointer"
                                        title={t.btn_export_report || 'Export Report'}
                                    >
                                        <Download size={13} />
                                        {t.btn_export || t.btn_export_report || 'Export'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Copied Toast Alert */}
                {showCopiedToast && (
                    <div className="fixed top-16 right-6 z-50 px-3.5 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-600" />
                        <span>{t.toast_report_copied || 'Decode capability report copied to clipboard'}</span>
                    </div>
                )}

                {/* Scrollable Content */}
                <div ref={contentRef} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* Summary Metric Stats */}
                    <VideoSummaryStats stats={summaryStats} t={t} isTesting={isTesting} />

                    {/* Live Stress Benchmark (shown when in 'all' or 'drm' tab) */}
                    {(activeCategory === 'all' || activeCategory === 'drm') && !searchQuery && (
                        <LiveBenchmarkCard t={t} />
                    )}

                    {/* WebCodecs Low-Latency Card (shown when in 'all' or 'drm' tab) */}
                    {(activeCategory === 'all' || activeCategory === 'drm') && !searchQuery && (
                        <WebCodecsCard data={webCodecsResult} t={t} />
                    )}

                    {/* DRM Section */}
                    {filteredDrm.length > 0 && (
                        <div className="mb-6 p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                {t.drm_title}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {filteredDrm.map((sys) => (
                                    <div
                                        key={sys.id}
                                        className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                                            sys.supported
                                                ? 'border-emerald-200/80 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/50 dark:text-emerald-300'
                                                : 'border-slate-100 bg-slate-50/60 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700/60'
                                        }`}
                                    >
                                        {sys.supported ? (
                                            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                                        ) : (
                                            <ShieldAlert size={18} className="opacity-40 shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold truncate">{sys.name}</div>
                                            <div className="text-[10px] font-mono opacity-70 truncate">{sys.id}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Codecs Section */}
                    {filteredVideo.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Film size={14} className="text-indigo-500" />
                                    {labels.video_codecs}
                                    <span className="text-[10px] font-normal text-slate-400">
                                        ({filteredVideo.length})
                                    </span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredVideo.map((row) => (
                                    <div
                                        key={`${row.codec}-${row.profile}`}
                                        className="@container bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col justify-between"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate" title={row.codec}>
                                                    {row.codec}
                                                </h4>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate shrink" title={row.profile}>
                                                    ({row.profile})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                    {row.bitDepth}-bit
                                                </span>
                                                <span
                                                    className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${getTagColor(
                                                        row.tag
                                                    )}`}
                                                >
                                                    {getTagLabel(row.tag)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description if available */}
                                        {row.description && (
                                            <div
                                                className="px-3.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/20 border-b border-slate-100/60 dark:border-slate-800/40 leading-relaxed truncate"
                                                title={getCodecDescription(row.description)}
                                            >
                                                {getCodecDescription(row.description)}
                                            </div>
                                        )}

                                        {/* Resolution Matrix Grid: 3列在多列卡片时，宽卡片平铺6列，告别横向滚动条 */}
                                        <div className="grid grid-cols-3 @[480px]:grid-cols-6 divide-x divide-y @[480px]:divide-y-0 divide-slate-100 dark:divide-slate-700/60 border-t border-slate-100 dark:border-slate-700/60">
                                            {row.tests.map((test: VideoTestResultItem, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`p-2 flex flex-col gap-1 items-center justify-center text-center transition-colors ${
                                                        test.supported
                                                            ? ''
                                                            : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-55'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                                        {test.label}
                                                    </span>

                                                    {test.error ? (
                                                        <span className="text-[10px] text-red-400 whitespace-nowrap">
                                                            {t.status_api_error}
                                                        </span>
                                                    ) : !test.supported ? (
                                                        <span className="text-xs font-bold text-slate-300 dark:text-slate-600 whitespace-nowrap">
                                                            {values.not_supported}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 shrink-0">
                                                            {/* HW vs SW */}
                                                            <div
                                                                className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-medium shrink-0 ${
                                                                    test.efficient
                                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50'
                                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50'
                                                                }`}
                                                                title={
                                                                    test.efficient
                                                                        ? t.tooltip_hw
                                                                        : t.tooltip_sw
                                                                }
                                                            >
                                                                {test.efficient ? (
                                                                    <Battery size={11} />
                                                                ) : (
                                                                    <Zap size={11} />
                                                                )}
                                                                <span className="whitespace-nowrap font-semibold">
                                                                    {test.efficient ? t.status_hw : t.status_sw}
                                                                </span>
                                                            </div>

                                                            {/* Smooth Playback */}
                                                            <div
                                                                className={`flex items-center justify-center w-4.5 h-4.5 rounded text-[10px] shrink-0 ${
                                                                    test.smooth
                                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50'
                                                                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/60 dark:border-red-800/50'
                                                                }`}
                                                                title={
                                                                    test.smooth ? t.video_smooth : t.tooltip_drop
                                                                }
                                                            >
                                                                {test.smooth ? <Check size={11} /> : <X size={11} />}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Audio Codecs Section */}
                    {filteredAudio.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Music size={14} className="text-violet-500" />
                                    {labels.audio_codecs}
                                    <span className="text-[10px] font-normal text-slate-400">
                                        ({filteredAudio.length})
                                    </span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredAudio.map((row) => (
                                    <div
                                        key={row.codec}
                                        className="@container bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col justify-between"
                                    >
                                        <div className="bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                <Speaker size={14} className="text-slate-400 shrink-0" />
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate" title={row.codec}>
                                                    {row.codec}
                                                </h4>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate shrink" title={getAudioLabel(row.label)}>
                                                    ({getAudioLabel(row.label)})
                                                </span>
                                            </div>
                                            <span
                                                className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${getTagColor(
                                                    row.tag
                                                )}`}
                                            >
                                                {row.tag === 'Dolby' && <Tv size={10} />}
                                                {getTagLabel(row.tag)}
                                            </span>
                                        </div>

                                        {/* Audio tests - 2x2 网格或4列平铺，告别横向滚动条 */}
                                        <div className="grid grid-cols-2 @[360px]:grid-cols-4 divide-x divide-y @[360px]:divide-y-0 divide-slate-100 dark:divide-slate-700/60 border-t border-slate-100 dark:border-slate-700/60">
                                            {row.tests.map((test: AudioTestResultItem, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`p-2 flex flex-col gap-1 items-center justify-center text-center transition-colors ${
                                                        test.supported
                                                            ? ''
                                                            : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-55'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                                        {test.label}
                                                    </span>
                                                    {!test.supported ? (
                                                        <span className="text-xs font-bold text-slate-300 dark:text-slate-600 whitespace-nowrap">
                                                            {values.not_supported}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-1.5 shrink-0">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shrink-0">
                                                                <Check size={12} />
                                                            </div>
                                                            {test.efficient && (
                                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 px-1 py-0.2 rounded shrink-0 whitespace-nowrap">
                                                                    {t.status_hw}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty search state */}
                    {filteredVideo.length === 0 && filteredAudio.length === 0 && filteredDrm.length === 0 && (
                        <div className="py-16 text-center text-slate-400 text-sm">
                            <Film size={36} className="mx-auto mb-2 opacity-40" />
                            <p>{t.empty_search_result || 'No codecs or formats match your current search and filter criteria.'}</p>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="mt-6 flex gap-4 text-xs text-slate-500 dark:text-slate-400 justify-center pb-2 flex-wrap border-t border-slate-200/60 dark:border-slate-800 pt-4">
                        <div className="flex items-center gap-1.5">
                            <Battery size={13} className="text-emerald-500" />
                            <span>{t.video_efficient}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap size={13} className="text-amber-500" />
                            <span>{t.status_software}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check size={13} className="text-blue-500" />
                            <span>{t.video_smooth}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default VideoDecodeModal;
