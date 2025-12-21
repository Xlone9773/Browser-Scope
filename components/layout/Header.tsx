
import React, { useState } from 'react';
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
  ChevronDown 
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
  onOpenBenchmark
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { formatNativeLanguageName } = useFormatter(lang);

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Monitor className="text-indigo-600 dark:text-indigo-400" size={32} />
          {t.title}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">{t.subtitle}</p>
      </div>
      <div className="flex gap-3 relative z-40 flex-wrap">
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
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        
        <Button 
            variant="secondary" 
            onClick={onOpenSettings} 
            title={t.settingsModal.title}
        >
            <Sliders size={16} />
        </Button>
        
        <Button 
            variant="secondary" 
            onClick={onOpenAbout} 
            title={t.actions.about}
        >
            <Info size={16} />
        </Button>
        
        <div className="relative">
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
                    <button key={code} onClick={() => { setLang(code as Language); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${lang === code ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}>
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
        
        <Button 
            variant="primary" 
            onClick={onRefresh} 
            leftIcon={<RefreshCw size={16} />}
        >
            {t.refresh}
        </Button>
      </div>
    </header>
  );
};
