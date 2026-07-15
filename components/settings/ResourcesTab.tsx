
import React, { useState, useEffect } from 'react';
import { Translation } from '../../utils/i18n/types';

interface ResourcesTabProps {
    t: Translation['settings']['resources'];
}

interface ResourceItem {
    name: string;
    type: string;
    duration: number;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ t }) => {
    const [resources, setResources] = useState<ResourceItem[]>([]);

    useEffect(() => {
        const perfEntries = performance.getEntriesByType('resource');
        const resList: ResourceItem[] = perfEntries.map(entry => ({
            name: entry.name,
            type: (entry as PerformanceResourceTiming).initiatorType,
            duration: entry.duration
        }));
        setResources(resList);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.title} ({resources.length})</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{t.columns.name}</th>
                            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-32">{t.columns.type}</th>
                            <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-32 text-right">{t.columns.duration}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {resources.map((res, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-2 max-w-xs md:max-w-md lg:max-w-xl truncate text-slate-700 dark:text-slate-300 font-mono text-xs" title={res.name}>
                                    {res.name}
                                </td>
                                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                                        {res.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right font-mono text-slate-600 dark:text-slate-400">
                                    {res.duration.toFixed(1)} ms
                                </td>
                            </tr>
                        ))}
                        {resources.length === 0 ? (<tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No external resources detected via Performance API.</td>
                        </tr>) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
