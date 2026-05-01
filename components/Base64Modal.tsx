
import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface Base64ModalProps {
  data: string;
  onClose: () => void;
  t: Translation['base64Tool'];
}

export const Base64Modal: React.FC<Base64ModalProps> = ({ data, onClose, t }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
        title={t.title}
        icon={<FileCode size={24} />}
        onClose={onClose}
        size="4xl"
        fullHeight
        noPadding
    >
        {({ close }) => (
            <>
                {/* Content */}
                <div className="flex-1 overflow-hidden p-0 relative group flex flex-col">
                    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500 font-mono">
                        {t.desc}
                    </div>
                    <textarea 
                        className="flex-1 w-full p-6 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-300 resize-none outline-none border-none leading-relaxed"
                        readOnly
                        value={data}
                    />
                </div>
                
                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex items-center gap-4">
                    <div className="text-xs text-slate-400 font-mono mr-auto">
                        Length: {data.length} chars
                    </div>
                    
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all active:scale-95 font-medium text-sm"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : t.copy}
                    </button>
                </div>
            </>
        )}
    </Modal>
  );
};
