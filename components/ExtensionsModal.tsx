import React, { useEffect, useState } from 'react';
import { Puzzle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { detectExtensions, DetectedExtension } from '../services/detectors/extensions';
import { Translation } from '../utils/i18n/types';

export const ExtensionsModal = ({ onClose, t }: { onClose: () => void; t?: Translation['extensionsModal'] }) => {
  const [extensions, setExtensions] = useState<DetectedExtension[]>([]);

  useEffect(() => {
    // Some extensions might inject objects asynchronously or slightly after load
    const timer = setTimeout(() => {
      setExtensions(detectExtensions().filter(e => e.detected));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const trans = t || {
    title: "Browser Extension Inventory",
    note_strong: "Note:",
    note_text: "Browsers do not provide a native API.",
    no_extensions: "No extensions detected.",
    detected: "Detected",
    categories: {},
    names: {},
    descs: {}
  };

  const names = (trans.names || {}) as Record<string, string>;
  const categories = (trans.categories || {}) as Record<string, string>;
  const descs = (trans.descs || {}) as Record<string, string>;

  return (
    <Modal title={trans.title} icon={<Puzzle size={24} className="text-indigo-500" />} onClose={onClose} noPadding>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-4 mb-4 text-amber-900 dark:text-amber-100 text-sm">
          <p>
            <strong>{trans.note_strong}</strong> {trans.note_text}
          </p>
        </div>

        {extensions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>{trans.no_extensions}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extensions.map(ext => (
              <div key={ext.id} className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900 dark:text-slate-200">
                    {names[ext.id] || ext.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded whitespace-nowrap">
                    {categories[ext.category] || ext.category}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex-grow">
                  {descs[ext.id] || ext.description}
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded flex items-center gap-1 w-fit mt-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span> {trans.detected}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
