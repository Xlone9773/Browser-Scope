
import React from 'react';
import { Sparkles, History, Monitor } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface AboutModalProps {
  onClose: () => void;
  t: Translation['aboutModal'];
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, t }) => {
  return (
    <Modal
        title={t.title}
        icon={<Monitor size={24} />}
        onClose={onClose}
        size="lg"
    >
        {({ close }) => (
            <>
                {/* Content */}
                <div className="mb-8">
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {t.desc}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.version}</span>
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono font-bold">
                            v{t.updates && t.updates[0] ? t.updates[0].version : '1.6.0'}
                        </span>
                    </div>
                </div>

                {/* Latest Highlight */}
                <div className="mb-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-indigo-500" />
                        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{t.latest_update}</h3>
                    </div>
                    <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed opacity-90">
                        {t.updates && t.updates[0] ? t.updates[0].changes[0] : "New features available."}
                    </p>
                </div>

                {/* Changelog History */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <History size={16} className="text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{t.history}</h3>
                    </div>
                    
                    <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-2 space-y-8 pl-6 pb-2">
                        {t.updates && t.updates.map((update, idx) => (
                            <div key={idx} className="relative">
                                {/* Dot */}
                                <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 ${idx === 0 ? 'bg-indigo-500 border-indigo-100 dark:border-indigo-900' : 'bg-slate-300 dark:bg-slate-600 border-slate-50 dark:border-slate-800'}`}></div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                    <span className={`text-sm font-bold ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>v{update.version}</span>
                                    <span className="text-xs text-slate-400 font-mono">{update.date}</span>
                                </div>
                                
                                <ul className="space-y-2">
                                    {update.changes.map((change, cIdx) => (
                                        <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                                            {change}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer (Custom Footer for this modal if needed, otherwise use padding) */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button 
                        onClick={close}
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        {t.close}
                    </button>
                </div>
            </>
        )}
    </Modal>
  );
};
