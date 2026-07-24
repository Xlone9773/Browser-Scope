import React from 'react';
import { InfoCard } from '../InfoCard';
import { Monitor } from 'lucide-react';
import { BrowserData } from '../../types';
import { Translation } from '../../utils/i18n';
import { BrowserReport } from './BrowserReport';

interface BrowserCardProps {
    systemData: BrowserData['system'];
    t: Translation;
}

export const BrowserCard: React.FC<BrowserCardProps> = React.memo(({ systemData, t }) => {
    const cardT = t.browserCard || {
        title: 'Browser Identity',
        subtitle: 'Current actively used browser estimated by features',
        unknown: 'Unknown Browser'
    };

    return (
        <InfoCard title={cardT.title} icon={Monitor}>
            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-2">
                        {systemData.browserName || cardT.unknown}
                        <span className="text-xl text-slate-500 font-normal">{systemData.browserVersion}</span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {cardT.subtitle}
                    </p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-500 shrink-0">
                    <Monitor size={32} />
                </div>
            </div>
            <BrowserReport t={t} />
        </InfoCard>
    );
});
