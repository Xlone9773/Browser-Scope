
import React, { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { InfoCard } from '../InfoCard';
import { Translation } from '../../utils/i18n/types';

interface UserAgentCardProps {
  userAgent: string;
  t: Translation;
}

export const UserAgentCard: React.FC<UserAgentCardProps> = ({ userAgent, t }) => {
  const [uaCopied, setUaCopied] = useState(false);

  const copyUserAgent = () => {
      navigator.clipboard.writeText(userAgent);
      setUaCopied(true);
      setTimeout(() => setUaCopied(false), 2000);
  };

  return (
    <div className="md:col-span-2 lg:col-span-3">
        <InfoCard title={t.sections.user_agent} icon={Globe}>
            <div className="relative group">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 break-all leading-relaxed pr-12">{userAgent}</div>
                <button onClick={copyUserAgent} className="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={t.actions.copy}>
                    {uaCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                {uaCopied && <div className="absolute top-1 right-12 px-2 py-1 bg-black/75 text-white text-xs rounded shadow-sm animate-in fade-in slide-in-from-right-2">{t.actions.copied}</div>}
            </div>
        </InfoCard>
    </div>
  );
};
