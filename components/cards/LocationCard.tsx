
import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Navigation, Globe2, BookA } from 'lucide-react';
import { InfoCard, InfoItem } from '../InfoCard';
import { Translation, Language } from '../../utils/i18n/types';
import { BrowserData } from '../../types';
import { useFormatter } from '../../hooks/useFormatter';

interface LocationCardProps {
  data: BrowserData['localization'];
  geoData: { latitude: number; longitude: number; accuracy: number; } | null;
  permStatus: 'idle' | 'granted' | 'denied' | 'prompt' | 'error';
  t: Translation;
  onRequestPermission: () => void;
  timeFormat: '12' | '24';
  lang?: Language;
}

const AnimatedClock = ({ timeFormat }: { timeFormat: '12' | '24' }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const secAngle = seconds * 6;
    const minAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;

    return (
        <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-400 dark:text-blue-500/50"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="12" x2="12" y2="7" transform={`rotate(${hourAngle} 12 12)`} className="transition-transform duration-300 ease-in-out" />
            <line x1="12" y1="12" x2="12" y2="4" transform={`rotate(${minAngle} 12 12)`} className="transition-transform duration-300 ease-in-out" />
            <line x1="12" y1="12" x2="12" y2="3" strokeWidth="1.5" transform={`rotate(${secAngle} 12 12)`} className="transition-transform duration-300 ease-linear opacity-60" />
        </svg>
    );
};

export const LocationCard: React.FC<LocationCardProps> = ({ 
    data, 
    geoData, 
    permStatus, 
    t, 
    onRequestPermission,
    timeFormat,
    lang = 'en'
}) => {
  const [time, setTime] = useState(new Date());
  const { formatRegionName, formatLanguageName } = useFormatter(lang);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openMap = () => {
      if (geoData) {
          window.open(`https://www.google.com/maps/search/?api=1&query=${geoData.latitude},${geoData.longitude}`, '_blank');
      }
  };

  // Try to extract Region from locale (e.g., "en-US" -> "US")
  let regionName = '';
  if (data.locale && data.locale.includes('-')) {
      const regionCode = data.locale.split('-')[1];
      if (regionCode) {
          regionName = formatRegionName(regionCode);
      }
  }

  return (
    <InfoCard title={t.sections.location} icon={MapPin}>
        
        {/* Real-time Clock */}
        <div className="flex items-center justify-between p-3 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="flex flex-col">
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">{t.labels.local_time}</span>
                <span className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
                    {time.toLocaleTimeString([], { hour12: timeFormat === '12' })}
                </span>
            </div>
            <AnimatedClock timeFormat={timeFormat} />
        </div>

        <InfoItem label={t.labels.timezone} value={data.timeZone} />
        <InfoItem 
            label={t.labels.locale} 
            value={data.locale} 
            subValue={regionName && regionName !== data.locale ? regionName : undefined} 
        />
        <InfoItem label={t.labels.calendar} value={data.calendar} />
        {data.numberingSystem && (
            <InfoItem label="Number System" value={data.numberingSystem} />
        )}

        {/* Intl API Capabilities */}
        {data.intlSupport && (
            <div className="mt-3 mb-2">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Globe2 size={12} />
                    Intl API Support
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className={`text-xs px-2 py-1 rounded border flex justify-between items-center ${data.intlSupport.relativeTimeFormat ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span>RelativeTime</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded border flex justify-between items-center ${data.intlSupport.listFormat ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span>ListFormat</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded border flex justify-between items-center ${data.intlSupport.segmenter ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span>Segmenter</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded border flex justify-between items-center ${data.intlSupport.displayNames ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span>DisplayNames</span>
                    </div>
                </div>
            </div>
        )}

        {/* Geolocation Section */}
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-slate-400"/>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.labels.perm_geo}</span>
                </div>
                {permStatus !== 'granted' && (
                    <button 
                        onClick={onRequestPermission} 
                        className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        {t.actions.check}
                    </button>
                )}
            </div>

            {permStatus === 'granted' && geoData ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase">{t.labels.geo_lat}</span>
                            <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{geoData.latitude.toFixed(6)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase">{t.labels.geo_long}</span>
                            <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{geoData.longitude.toFixed(6)}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <span className="text-[10px] text-slate-400 uppercase">{t.labels.geo_acc}</span>
                            <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">±{geoData.accuracy.toFixed(1)} meters</span>
                        </div>
                    </div>
                    <button 
                        onClick={openMap}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                    >
                        <ExternalLink size={12} />
                        {t.actions.open_map}
                    </button>
                </div>
            ) : permStatus === 'denied' ? (
                <div className="text-xs text-red-500 dark:text-red-400 px-2">
                    Permission denied. Enable location services to view coordinates.
                </div>
            ) : null}
        </div>
    </InfoCard>
  );
};
