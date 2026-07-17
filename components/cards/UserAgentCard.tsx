
import React, { useState } from 'react';
import { Globe, Copy, Check, SwitchCamera } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';
import { useToast } from '../../hooks/useToast';

interface UserAgentCardProps {
  userAgent: string;
  clientHints?: unknown;
  t: Translation;
}

export const UserAgentCard: React.FC<UserAgentCardProps> = React.memo(({ userAgent, clientHints, t }) => {
  const [copied, setCopied] = useState(false);
  const [showClientHints, setShowClientHints] = useState(false);
  const toast = useToast();

  const dataToCopy = showClientHints ? JSON.stringify(clientHints, null, 2) : userAgent;

  const handleCopy = () => {
      navigator.clipboard.writeText(dataToCopy);
      setCopied(true);
      toast.success(
        showClientHints ? t.common.toasts.client_hints_copied : t.common.toasts.user_agent_copied,
        t.sections.user_agent
      );
      setTimeout(() => setCopied(false), 2000);
  };

  const hasClientHints = clientHints && Object.keys(clientHints).length > 0;

  return (
    <div className="md:col-span-2 lg:col-span-3">
        <InfoCard 
            title={t.sections.user_agent} 
            icon={Globe}
            action={hasClientHints ? (
                <button 
                    onClick={() => setShowClientHints(!showClientHints)}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    <SwitchCamera size={14} />
                    {showClientHints ? "Show Legacy UA" : "Show Client Hints"}
                </button>
            ) : undefined}
        >
            <div className="relative group">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 break-all leading-relaxed pr-12 min-h-[5rem] max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {showClientHints ? JSON.stringify(clientHints, null, 2) : userAgent}
                </div>
                <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={t.actions.copy}>
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                {Boolean(copied) && <div className="absolute top-1 right-12 px-2 py-1 bg-black/75 text-white text-xs rounded shadow-sm animate-in fade-in slide-in-from-right-2">{t.actions.copied}</div>}
            </div>
        </InfoCard>
    </div>
  );
});
