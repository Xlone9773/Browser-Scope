import React, { useState, useEffect } from "react";
import { X, Languages, Globe, LogOut } from "lucide-react";
import { Modal as BaseModal } from "./ui/Modal";

interface GoogleTranslateModalProps {
  onClose: () => void;
  t: unknown;
}

const SUPPORTED_LANGS = [
  { code: "ar", name: "العربية" },
  { code: "bg", name: "Български" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "es", name: "Español" },
  { code: "fi", name: "Suomi" },
  { code: "fr", name: "Français" },
  { code: "hi", name: "हिन्दी" },
  { code: "hu", name: "Magyar" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "it", name: "Italiano" },
  { code: "ko", name: "한국어" },
  { code: "nl", name: "Nederlands" },
  { code: "no", name: "Norsk" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "ro", name: "Română" },
  { code: "sk", name: "Slovenčina" },
  { code: "sv", name: "Svenska" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "uk", name: "Українська" },
  { code: "vi", name: "Tiếng Việt" },
];

const setGoogleTranslateCookie = (langCode: string) => {
  const hostname = window.location.hostname;
  const val = `/auto/${langCode}`;
  document.cookie = `googtrans=${val}; path=/;`;
  document.cookie = `googtrans=${val}; domain=.${hostname}; path=/;`;
};

const clearGoogleTranslateCookie = () => {
  const host = window.location.hostname;
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${host}; path=/;`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${host}; path=/;`;
};

export const GoogleTranslateModal: React.FC<GoogleTranslateModalProps> = ({
  onClose,
  t,
}) => {
  const [currentLang, setCurrentLang] = useState<string>("auto");

  useEffect(() => {
    // Check if googtrans cookie exists
    const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
    if (match) {
      const parts = match[2].split("/"); // e.g. /auto/en -> ["", "auto", "en"]
      if (parts.length > 2) {
        setCurrentLang(parts[2]);
      }
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    // We can simulate changing the google translate select
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
      onClose();
    } else {
      // Fallback if select not found: set cookie directly and reload
      setGoogleTranslateCookie(langCode);
      window.location.reload();
    }
  };

  const exitTranslation = () => {
    // Reset select if exists
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = "";
      selectEl.dispatchEvent(new Event("change"));
    }
    
    // Clear cookies
    clearGoogleTranslateCookie();
    
    window.location.reload();
  };

  // Safe checks for translations
  const titleText = t?.common?.googleTranslate;
  const descText = t?.common?.googleTranslateDesc;
  const exitText = t?.common?.googleTranslateExit;
  const poweredBy = t?.common?.poweredBy;

  return (
    <BaseModal onClose={onClose} title={titleText} icon={<Languages />}>
      <div className="space-y-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {descText}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGS.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  isActive
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex-1 text-left font-medium text-sm">
                  {lang.name}
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Globe size={16} />
            <span>{poweredBy}</span>
          </div>

          <button
            onClick={exitTranslation}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            {exitText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
