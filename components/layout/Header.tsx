
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
import { languageNames } from '../../utils/i18n/index';
import { Theme } from '../../appearance/theme';

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
        <button onClick={onOpenBenchmark} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all shadow-sm active:scale-95">
            <Activity size={16} />
            <span className="hidden sm:inline">{t.actions.run_benchmark}</span>
        </button>
        <button onClick={toggleTheme} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={onOpenSettings} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95" title={t.settingsModal.title}>
            <Sliders size={16} />
        </button>
        <button onClick={onOpenAbout} className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95" title={t.actions.about}>
            <Info size={16} />
        </button>
        <div className="relative">
            <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95">
                <Languages size={16} />
                <span>{languageNames[lang]}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 transform transition-all duration-200 origin-top-right ${isLangMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                {Object.entries(languageNames).map(([code, name]) => (
                    <button key={code} onClick={() => { setLang(code as Language); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${lang === code ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}>
                        {name}
                    </button>
                ))}
            </div>
        </div>
        <button onClick={onExport} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95">
            <Download size={16} />
            <span className="hidden sm:inline">{t.actions.export_json}</span>
        </button>
        <button onClick={onRefresh} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 border border-indigo-600 dark:border-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-sm active:scale-95">
            <RefreshCw size={16} />
            {t.refresh}
        </button>
      </div>
    </header>
  );
};
