import React from "react";
import { Keyboard, HelpCircle, Laptop, Settings, Compass, Sparkles, RefreshCw, X, FileJson, FileText, Image, Grid } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Translation } from "../utils/i18n/types";

interface KeyboardShortcutsModalProps {
  onClose: () => void;
  t: Translation["keyboardShortcutsModal"];
}

interface ShortcutItem {
  keys: string[];
  description: string;
  icon?: React.ReactNode;
}

interface ShortcutCategory {
  title: string;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose, t }) => {
  const shortcutData: ShortcutCategory[] = [
    {
      title: t.categories.general,
      items: [
        { keys: ["?"], description: t.keys.help, icon: <HelpCircle size={16} /> },
        { keys: [t.keys.esc], description: t.keys.close, icon: <X size={16} /> },
        { keys: [t.keys.alt, "G"], description: t.keys.theme, icon: <Laptop size={16} /> },
        { keys: [t.keys.alt, "R"], description: t.keys.refresh, icon: <RefreshCw size={16} /> }
      ]
    },
    {
      title: t.categories.navigation,
      items: [
        { keys: [t.keys.alt, "S"], description: t.keys.settings, icon: <Settings size={16} /> },
        { keys: [t.keys.alt, "B"], description: t.keys.benchmark, icon: <Compass size={16} /> },
        { keys: [t.keys.alt, "A"], description: t.keys.ai, icon: <Sparkles size={16} /> },
        { keys: [t.keys.alt, "N"], description: t.keys.network, icon: <Grid size={16} /> },
        { keys: [t.keys.alt, "D"], description: t.keys.display, icon: <Laptop size={16} /> },
        { keys: [t.keys.alt, "M"], description: t.keys.hardware, icon: <Grid size={16} /> },
        { keys: [t.keys.alt, "T"], description: t.keys.translate, icon: <HelpCircle size={16} /> }
      ]
    },
    {
      title: t.categories.export,
      items: [
        { keys: [t.keys.alt, "J"], description: t.keys.exportJson, icon: <FileJson size={16} /> },
        { keys: [t.keys.alt, "P"], description: t.keys.exportPdf, icon: <FileText size={16} /> },
        { keys: [t.keys.alt, "I"], description: t.keys.exportImage, icon: <Image size={16} /> }
      ]
    }
  ];

  return (
    <Modal
      title={t.title}
      onClose={onClose}
      size="2xl"
      icon={<Keyboard className="text-indigo-600 dark:text-indigo-400" size={24} />}
    >
      <div className="space-y-6 py-2">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {t.desc}
        </p>

        <div className="space-y-6">
          {shortcutData.map((category, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {item.description}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 ml-4">
                      {item.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          {keyIdx > 0 && (
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              +
                            </span>
                          )}
                          <kbd className="px-2 py-1 min-w-[24px] text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-[0_1.5px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1.5px_0_rgba(255,255,255,0.05)] select-none">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
