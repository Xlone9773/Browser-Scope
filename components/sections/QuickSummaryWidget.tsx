import React from 'react';
import { BrowserData } from '../../types';
import { Translation } from '../../utils/i18n/types';
import { ShieldAlert, ShieldCheck, Info, AlertTriangle, X } from 'lucide-react';

interface QuickSummaryWidgetProps {
  data: BrowserData;
  t: any;
  onClose?: () => void;
}

interface SecurityFlag {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  titleKey: string;
  descKey: string;
}

export const QuickSummaryWidget: React.FC<QuickSummaryWidgetProps> = ({ data, t, onClose }) => {
  const flags: SecurityFlag[] = [];

  const webrtcLeaked = data.network.webrtcIp && data.network.webrtcIp !== 'N/A' && data.network.webrtcIp !== 'Local' && !data.network.webrtcIp.includes('Error');
  if (webrtcLeaked) {
    flags.push({
      id: 'webrtc',
      type: 'critical',
      titleKey: 'webrtcLeaked',
      descKey: 'webrtcLeakedDesc'
    });
  }

  if (data.security.isBot) {
    flags.push({
      id: 'bot',
      type: 'critical',
      titleKey: 'botDetected',
      descKey: 'botDetectedDesc'
    });
  }

  if (!data.security.secureContext) {
    flags.push({
      id: 'insecure',
      type: 'critical',
      titleKey: 'insecureContext',
      descKey: 'insecureContextDesc'
    });
  }

  if (data.security.adBlockEnabled) {
    flags.push({
      id: 'adblock',
      type: 'info',
      titleKey: 'adBlocker',
      descKey: 'adBlockerDesc'
    });
  }
  
  if (data.system.browserName === 'Brave' || data.system.browserName.includes('Tor')) {
    flags.push({
      id: 'privacyBrowser',
      type: 'info',
      titleKey: 'privacyBrowser',
      descKey: 'privacyBrowserDesc'
    });
  }

  if (data.system.cookiesEnabled === false) {
    flags.push({
      id: 'cookiesDisabled',
      type: 'warning',
      titleKey: 'cookiesDisabled',
      descKey: 'cookiesDisabledDesc'
    });
  }

  // Pick top 3 (Critical > Warning > Info)
  const sortedFlags = flags.sort((a, b) => {
    const weight = { critical: 3, warning: 2, info: 1, success: 0 };
    return weight[b.type] - weight[a.type];
  }).slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert className="text-red-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      default: return <ShieldCheck className="text-emerald-500" size={20} />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'warning': return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'info': return 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default: return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    }
  };

  if (sortedFlags.length === 0) {
    return (
      <div className="relative w-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 pr-12 flex items-center gap-4 group">
        <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
        <div>
          <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
            {t?.quickSummary?.allClear}
          </h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {t?.quickSummary?.allClearDesc}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-3.5 p-1.5 rounded-lg text-emerald-500 hover:text-red-600 dark:text-emerald-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
            title="隐藏概要"
            aria-label="Hide Summary"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full relative mb-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedFlags.map((flag, idx) => (
          <div 
            key={flag.id} 
            className={`relative rounded-xl p-4 border flex items-start gap-3 transition-colors ${getColorClass(flag.type)} ${
              idx === sortedFlags.length - 1 ? 'pr-12' : ''
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {getIcon(flag.type)}
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                {t?.quickSummary?.[flag.titleKey]}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t?.quickSummary?.[flag.descKey]}
              </p>
            </div>
          </div>
        ))}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer z-10"
          title="隐藏概要"
          aria-label="Hide Summary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
