
import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  RefreshCw, 
  Download, 
  Activity, 
  Sun, 
  Moon, 
  Sliders, 
  Info, 
  Languages, 
  ChevronDown,
  Maximize,
  Minimize,
  MoreVertical
} from 'lucide-react';
import { Translation, Language } from '../../utils/i18n/types';
import { Theme } from '../../appearance/theme';
import { useFormatter } from '../../hooks/useFormatter';
import { Button } from '../ui/Button';

// List of supported language codes
const SUPPORTED_LANGUAGES: Language[] = ['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'];

interface HeaderProps {
  t: Translation;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenBenchmark: () => void;
  collapseHeader?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  lang,
  setLang,
  theme,
  toggleTheme,
  onRefresh,
  onExport,
  onOpenSettings,
  onOpenAbout,
  onOpenBenchmark,
  collapseHeader = false
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { formatNativeLanguageName } = useFormatter(lang);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
     const handleClickOutside = (e: MouseEvent) => {
         if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
             setIsLangMenuOpen(false);
         }
         if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
             setIsMoreMenuOpen(false);
         }
     };
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsMoreMenuOpen(false);
  };
  
  const handleExport = () => {
      onExport();
      setIsMoreMenuOpen(false);
  };
  
  const handleAbout = () => {
      onOpenAbout();
      setIsMoreMenuOpen(false);
  };
  
  const handleLangSelect = (code: Language) => {
      setLang(code);
      setIsLangMenuOpen(false);
      setIsMoreMenuOpen(false);
  };

  const useCollapsed = collapseHeader ? "hidden" : "hidden sm:inline-flex md:inline-flex lg:inline-flex";
  const mobileAlwaysHidden = "hidden lg:inline-flex"; 
  const displayClass = collapseHeader ? mobileAlwaysHidden : useCollapsed;

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 relative z-40">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Monitor className="text-indigo-600 dark:text-indigo-400" size={32} />
          {t.meta.title}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">{t.meta.subtitle}</p>
      </div>
      <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
        <Button 
            variant="soft" 
            onClick={onOpenBenchmark} 
            leftIcon={<Activity size={16} />}
        >
            <span className="hidden sm:inline">{t.actions.run_benchmark}</span>
        </Button>
        
        <Button 
            variant="secondary" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        
        <Button 
            variant="secondary" 
            onClick={onOpenSettings} 
            title={t.settings.title}
        >
            <Sliders size={16} />
        </Button>
        
        {/* Items that collapse based on setting or mobile. In purely mobile view, always hidden. */}
        <div className={`gap-2 sm:gap-3 ${collapseHeader ? 'hidden' : 'hidden lg:flex'}`}>
            <Button 
                variant="secondary" 
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
            
            <Button 
                variant="secondary" 
                onClick={onOpenAbout} 
                title={t.actions.about}
            >
                <Info size={16} />
            </Button>
            
            <div className="relative" ref={langMenuRef}>
                <Button 
                    variant="secondary" 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                    leftIcon={<Languages size={16} />}
                    rightIcon={<ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />}
                >
                    <span className="capitalize">{formatNativeLanguageName(lang)}</span>
                </Button>
                
                <div className={`absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 origin-top-right ${isLangMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                    {SUPPORTED_LANGUAGES.map((code) => (
                        <button key={code} onClick={() => handleLangSelect(code as Language)} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${lang === code ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}>
                            {formatNativeLanguageName(code)}
                        </button>
                    ))}
                </div>
            </div>
            
            <Button 
                variant="secondary" 
                onClick={onExport} 
                leftIcon={<Download size={16} />}
            >
                <span className="hidden sm:inline">{t.actions.export_json}</span>
            </Button>
        </div>
        
        {/* The More menu visible when items are collapsed */}
        <div className={`relative ${collapseHeader ? 'flex' : 'flex lg:hidden'}`} ref={moreMenuRef}>
            <Button 
                variant="secondary" 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} 
                title="More options"
            >
                <MoreVertical size={16} />
            </Button>
            
            <div className={`absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50 transform transition-all duration-200 origin-top-right flex flex-col ${isMoreMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                
                <div className="px-3 pb-2 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    Menu
                </div>
                
                <button onClick={toggleFullscreen} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors">
                    <span className="text-slate-400">{isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}</span>
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
                
                <button onClick={handleAbout} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors">
                    <span className="text-slate-400"><Info size={14} /></span>
                    {t.actions.about}
                </button>
                
                <button onClick={handleExport} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors">
                    <span className="text-slate-400"><Download size={14} /></span>
                    {t.actions.export_json}
                </button>
                
                <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-700">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((code) => (
                        <button key={code} onClick={() => handleLangSelect(code as Language)} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2 ${lang === code ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                            {lang === code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                            <span className={lang === code ? '' : 'ml-3'}>{formatNativeLanguageName(code)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <Button 
            variant="primary" 
            onClick={onRefresh} 
            leftIcon={<RefreshCw size={16} />}
        >
            <span className="hidden sm:inline">{t.common.refresh}</span>
        </Button>
      </div>
    </header>
  );
};
