import React from 'react';
import { Translation } from '../../utils/i18n/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ModuleSettingsDropdown } from './modules/ModuleSettingsDropdown';
import { 
    Package, Power, Zap, ShieldCheck, CircleOff, Lock, Trash2,
    Camera, Mic, Layers, Palette, Binary, Info, Compass, Award, 
    Fingerprint, Gauge, Wrench, Brain, Gamepad2, Laptop, Eye, 
    Wifi, Flame, Video, Sliders, Music, HardDrive, Globe, Sun, 
    Puzzle, Languages, ShieldAlert, KeyRound, Monitor, Volume2, 
    Activity, BookOpen, Keyboard, Settings
} from 'lucide-react';

const getModuleIcon = (id: string, isSystem?: boolean) => {
    if (isSystem) return <ShieldCheck size={18} />;
    
    switch (id) {
        case "camera":
            return <Camera size={18} />;
        case "audio":
            return <Mic size={18} />;
        case "webgl":
            return <Layers size={18} />;
        case "canvas":
            return <Palette size={18} />;
        case "base64":
            return <Binary size={18} />;
        case "about":
            return <Info size={18} />;
        case "attributions":
            return <BookOpen size={18} />;
        case "shortcuts":
            return <Keyboard size={18} />;
        case "sensor":
            return <Compass size={18} />;
        case "score":
            return <Award size={18} />;
        case "fingerprint":
            return <Fingerprint size={18} />;
        case "benchmark":
            return <Gauge size={18} />;
        case "tools":
            return <Wrench size={18} />;
        case "ai":
            return <Brain size={18} />;
        case "gamepad":
            return <Gamepad2 size={18} />;
        case "webDevice":
            return <Laptop size={18} />;
        case "vision":
            return <Eye size={18} />;
        case "speed":
            return <Wifi size={18} />;
        case "compute":
            return <Flame size={18} />;
        case "video":
            return <Video size={18} />;
        case "graphics":
            return <Monitor size={18} />;
        case "speech":
            return <Volume2 size={18} />;
        case "midi":
            return <Music size={18} />;
        case "storageBench":
            return <HardDrive size={18} />;
        case "heatmap":
            return <Globe size={18} />;
        case "rayTracing":
            return <Sun size={18} />;
        case "extensions":
            return <Puzzle size={18} />;
        case "networkTools":
            return <Globe size={18} />;
        case "displayTools":
            return <Sliders size={18} />;
        case "googleTranslate":
            return <Languages size={18} />;
        case "audioLatency":
            return <Activity size={18} />;
        case "poisoning":
            return <ShieldAlert size={18} />;
        case "ja3":
            return <KeyRound size={18} />;
        default:
            return <Package size={18} />;
    }
};

export interface ModuleState {
    id: string;
    name: string;
    isOpen: boolean;
    setOpen: (val: boolean) => void;
    impact: 'High' | 'Medium' | 'Low';
    isSystem?: boolean;
    isLoaded?: boolean;
    onUnload?: () => void;
}

interface ModulesTabProps {
    t: Translation['settings']['modules'];
    modules: ModuleState[];
    disableCache: boolean;
    toggleDisableCache: (val: boolean) => void;
    disableLazyLoading: boolean;
    toggleDisableLazyLoading: (val: boolean) => void;
    alwaysShowLoading: boolean;
    toggleAlwaysShowLoading: (val: boolean) => void;
    lazyTabChange: boolean;
    toggleLazyTabChange: (val: boolean) => void;
}

export const ModulesTab: React.FC<ModulesTabProps> = ({ 
    t, 
    modules,
    disableCache,
    toggleDisableCache,
    disableLazyLoading,
    toggleDisableLazyLoading,
    alwaysShowLoading,
    toggleAlwaysShowLoading,
    lazyTabChange,
    toggleLazyTabChange,
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeCount = modules.filter(m => m.isOpen).length;
    const cachedCount = modules.filter(m => !m.isOpen && m.isLoaded).length;
    const idleCount = modules.filter(m => !m.isOpen && !m.isLoaded).length;
    
    const activeOrLoadedNonSystemCount = modules.filter(m => !m.isSystem && (m.isOpen || m.isLoaded)).length;
    
    const sortedModules = [...modules].sort((a, b) => {
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;
        if (a.isLoaded && !b.isLoaded) return -1;
        if (!a.isLoaded && b.isLoaded) return 1;
        return 0;
    });
    
    const closeAll = () => {
        modules.forEach(m => {
            if (!m.isSystem && (m.isOpen || m.isLoaded)) {
                if (m.onUnload) m.onUnload();
                else m.setOpen(false);
            }
        });
    };

    const getImpactColor = (impact: string): 'error' | 'warning' | 'success' | 'neutral' => {
        switch(impact) {
            case 'High': return 'error';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'neutral';
        }
    };

    const getImpactLabel = (impact: string) => {
        switch(impact) {
            case 'High': return t?.impact?.high;
            case 'Medium': return t?.impact?.med;
            case 'Low': return t?.impact?.low;
            default: return impact;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg">
                        <Package size={22} className="text-indigo-500" />
                        {t?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                        {t?.desc}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 w-full xl:w-auto relative">
                    <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-6 flex-1">
                        <div className="text-center min-w-[3rem]">
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold mb-0.5">{t?.status?.active}</div>
                            <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">{activeCount}</div>
                        </div>
                        
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                        <div className="text-center min-w-[3rem]">
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold mb-0.5">{t?.status?.cached}</div>
                            <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">{cachedCount}</div>
                        </div>

                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                        <div className="text-center min-w-[3rem]">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">{t?.status?.inactive}</div>
                            <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">{idleCount}</div>
                        </div>
                    </div>

                    <div className="w-full h-px sm:w-px sm:h-8 bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="danger-soft" 
                            size="sm" 
                            onClick={closeAll}
                            disabled={activeOrLoadedNonSystemCount === 0}
                            leftIcon={<Power size={16} />}
                            className="whitespace-nowrap justify-center flex-1 sm:flex-none"
                        >
                            {t?.actions?.unloadAll}
                        </Button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`p-2 rounded-lg border transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${isSettingsOpen ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400" : "bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
                            >
                                <Settings size={18} className={isSettingsOpen ? "rotate-45 duration-200" : "duration-200"} />
                            </button>

                            {isSettingsOpen ? (
                                <ModuleSettingsDropdown
                                    t={t}
                                    disableCache={disableCache}
                                    toggleDisableCache={toggleDisableCache}
                                    disableLazyLoading={disableLazyLoading}
                                    toggleDisableLazyLoading={toggleDisableLazyLoading}
                                    alwaysShowLoading={alwaysShowLoading}
                                    toggleAlwaysShowLoading={toggleAlwaysShowLoading}
                                    lazyTabChange={lazyTabChange}
                                    toggleLazyTabChange={toggleLazyTabChange}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider w-1/3">{t?.headers?.name}</th>
                            <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">{t?.headers?.status}</th>
                            <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">{t?.headers?.impact}</th>
                            <th className="px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">{t?.headers?.action}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {sortedModules.map((mod) => (
                            <tr key={mod.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${mod.isOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            {getModuleIcon(mod.id, mod.isSystem)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-semibold ${mod.isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {mod.name}
                                            </span>
                                            {mod.isSystem ? (<span className="text-[10px] text-slate-400 leading-none">{t?.status?.system}</span>) : null}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    {mod.isOpen ? (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                                            <span className="relative flex h-2 w-2">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t?.status?.active}</span>
                                        </div>
                                    ) : mod.isLoaded ? (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t?.status?.cached}</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            <CircleOff size={10} className="text-slate-400" />
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t?.status?.inactive}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <Badge variant={getImpactColor(mod.impact)} icon={<Zap size={10} />}>
                                        {getImpactLabel(mod.impact)}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    {mod.isSystem ? (
                                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium cursor-not-allowed select-none opacity-60">
                                            <Lock size={12} />
                                            <span>{t?.status?.locked}</span>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => mod.onUnload ? mod.onUnload() : mod.setOpen(false)}
                                            disabled={!mod.isOpen ? !mod.isLoaded : undefined}
                                            variant={mod.isOpen ? "danger-soft" : "secondary"}
                                            size="xs"
                                            leftIcon={mod.isOpen ? <Power size={14} /> : <Trash2 size={14} />}
                                            className={!mod.isOpen && !mod.isLoaded ? "opacity-0" : "transition-opacity"}
                                        >
                                            {t?.actions?.unload}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
