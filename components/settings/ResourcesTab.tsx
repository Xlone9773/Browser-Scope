// src/components/settings/ResourcesTab.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Translation } from '../../utils/i18n/types';
import { networkLogger, NetworkLogItem } from '../../utils/networkLogger';
import { Trash2, Search, Wifi, Terminal, Activity, Filter, Info, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ResourcesTabProps {
    t: Translation['settings']['resources'];
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ t }) => {
    const [logs, setLogs] = useState<NetworkLogItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'native' | 'udp' | 'script'>('all');
    const [selectedRequest, setSelectedRequest] = useState<NetworkLogItem | null>(null);

    // Subscribe to networkLogger updates in real-time
    useEffect(() => {
        const unsubscribe = networkLogger.subscribe((newLogs) => {
            setLogs(newLogs);
        });
        return unsubscribe;
    }, []);

    // Clear logs
    const handleClear = () => {
        networkLogger.clear();
        setSelectedRequest(null);
    };

    // Filter logs based on search term and selected tab
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = log.url.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'all' || log.type === selectedType;
            return matchesSearch && matchesType;
        }).reverse(); // Latest requests on top
    }, [logs, searchTerm, selectedType]);

    // Format duration helper
    const formatDuration = (ms: number) => {
        if (ms < 1) return '< 1 ms';
        return `${ms} ms`;
    };

    return (
        <div className="space-y-4">
            {/* Header & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
                        {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t.subtitle}
                    </p>
                </div>
                <Button
                    variant="danger-soft"
                    size="sm"
                    onClick={handleClear}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    className="self-start sm:self-center shrink-0"
                >
                    {t.clear}
                </Button>
            </div>

            {/* Controls: Search and Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder || "Search URL..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                </div>

                {/* Filter Chips using pre-built Button components */}
                <div className="flex flex-wrap gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/60 rounded-lg border border-slate-200/50 dark:border-slate-800/80 shrink-0">
                    <Button
                        size="xs"
                        variant={selectedType === 'all' ? 'primary' : 'ghost'}
                        onClick={() => setSelectedType('all')}
                        className="h-7 px-2.5"
                    >
                        {t.all || "All"} ({logs.length})
                    </Button>
                    <Button
                        size="xs"
                        variant={selectedType === 'native' ? 'soft' : 'ghost'}
                        onClick={() => setSelectedType('native')}
                        leftIcon={<Wifi className="w-3 h-3" />}
                        className="h-7 px-2.5 text-indigo-600 dark:text-indigo-400"
                    >
                        {t.types.native} ({logs.filter(l => l.type === 'native').length})
                    </Button>
                    <Button
                        size="xs"
                        variant={selectedType === 'udp' ? 'soft' : 'ghost'}
                        onClick={() => setSelectedType('udp')}
                        leftIcon={<Filter className="w-3 h-3" />}
                        className="h-7 px-2.5 text-emerald-600 dark:text-emerald-400"
                    >
                        {t.types.udp} ({logs.filter(l => l.type === 'udp').length})
                    </Button>
                    <Button
                        size="xs"
                        variant={selectedType === 'script' ? 'soft' : 'ghost'}
                        onClick={() => setSelectedType('script')}
                        leftIcon={<Terminal className="w-3 h-3" />}
                        className="h-7 px-2.5 text-amber-600 dark:text-amber-400"
                    >
                        {t.types.script} ({logs.filter(l => l.type === 'script').length})
                    </Button>
                </div>
            </div>

            {/* Layout: Main grid or empty state */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Request Table List in prebuilt Card */}
                <Card
                    noPadding={true}
                    className={`lg:col-span-2 ${selectedRequest ? '' : 'lg:col-span-3'} transition-all`}
                >
                    <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 border-b border-slate-200 dark:border-slate-700 z-10">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-24">{t.columns.method}</th>
                                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{t.columns.url}</th>
                                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-28">{t.columns.type}</th>
                                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-20">{t.columns.status}</th>
                                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 w-24 text-right">{t.columns.duration}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredLogs.map((log) => {
                                    const isSelected = selectedRequest?.id === log.id;
                                    return (
                                        <tr
                                            key={log.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedRequest(log);
                                            }}
                                            className={`cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 font-medium border-l-2 border-indigo-500'
                                                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/40'
                                            }`}
                                        >
                                            {/* Method */}
                                            <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                                {log.method}
                                            </td>

                                            {/* URL */}
                                            <td className="px-4 py-3 max-w-xs md:max-w-sm lg:max-w-md truncate text-slate-700 dark:text-slate-300 font-mono text-xs" title={log.url}>
                                                {log.url}
                                            </td>

                                            {/* Type Badge using prebuilt Badge component */}
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        log.type === 'native'
                                                            ? 'indigo'
                                                            : log.type === 'udp'
                                                            ? 'success'
                                                            : log.type === 'script'
                                                            ? 'warning'
                                                            : 'neutral'
                                                    }
                                                >
                                                    {log.type === 'native' ? t.types.native : log.type === 'udp' ? t.types.udp : log.type === 'script' ? t.types.script : t.types.unknown}
                                                </Badge>
                                            </td>

                                            {/* Status Badge using prebuilt Badge component */}
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        typeof log.status === 'number'
                                                            ? (log.status >= 200 && log.status < 300
                                                                ? 'success'
                                                                : log.status >= 300 && log.status < 400
                                                                ? 'warning'
                                                                : 'error')
                                                            : (log.status === 'PENDING' ? 'info' : 'error')
                                                    }
                                                    className={log.status === 'PENDING' ? 'animate-pulse' : ''}
                                                >
                                                    {log.status}
                                                </Badge>
                                            </td>

                                            {/* Duration */}
                                            <td className="px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                                                {log.status === 'PENDING' ? '...' : formatDuration(log.duration)}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Info className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                                <span className="text-sm">{t.empty}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Request Detail Panel in prebuilt Card (Bento Sidebar) */}
                {selectedRequest && (
                    <Card className="h-full flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                            {/* Drawer Header */}
                            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {t.details?.title || "Request Details"}
                                    </h4>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold font-mono text-slate-600 dark:text-slate-300 mt-1">
                                        {t.details?.id || "ID"}: {selectedRequest.id}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setSelectedRequest(null)}
                                    className="h-6 w-6 p-0 rounded-full text-slate-400 hover:text-slate-600"
                                >
                                    &times;
                                </Button>
                            </div>

                            {/* Info Rows */}
                            <div className="space-y-3.5 text-xs">
                                {/* URL */}
                                <div className="space-y-1">
                                    <span className="text-slate-400 font-medium">
                                        {t.details?.url || "Request URL"}:
                                    </span>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-150 dark:border-slate-800 font-mono text-[11px] break-all max-h-24 overflow-y-auto text-slate-700 dark:text-slate-300">
                                        {selectedRequest.url}
                                    </div>
                                </div>

                                {/* Method & Type */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-slate-400 font-medium">
                                            {t.details?.method || "Method"}:
                                        </span>
                                        <p className="font-mono font-bold text-slate-850 dark:text-slate-100 mt-0.5">{selectedRequest.method}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium">
                                            {t.details?.type || "Request Type"}:
                                        </span>
                                        <div className="mt-1">
                                            <Badge
                                                variant={
                                                    selectedRequest.type === 'native'
                                                        ? 'indigo'
                                                        : selectedRequest.type === 'udp'
                                                        ? 'success'
                                                        : selectedRequest.type === 'script'
                                                        ? 'warning'
                                                        : 'neutral'
                                                }
                                            >
                                                {selectedRequest.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Duration */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-slate-400 font-medium">
                                            {t.details?.status || "Response Status"}:
                                        </span>
                                        <div className="mt-1">
                                            <Badge
                                                variant={
                                                    typeof selectedRequest.status === 'number'
                                                        ? (selectedRequest.status >= 200 && selectedRequest.status < 300
                                                            ? 'success'
                                                            : selectedRequest.status >= 300 && selectedRequest.status < 400
                                                            ? 'warning'
                                                            : 'error')
                                                        : (selectedRequest.status === 'PENDING' ? 'info' : 'error')
                                                }
                                            >
                                                {selectedRequest.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-medium">
                                            {t.details?.duration || "Duration"}:
                                        </span>
                                        <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                                            {selectedRequest.status === 'PENDING' ? (t.details?.pending || 'Pending...') : formatDuration(selectedRequest.duration)}
                                        </p>
                                    </div>
                                </div>

                                {/* Initiator */}
                                <div>
                                    <span className="text-slate-400 font-medium">
                                        {t.details?.initiator || "Initiator"}:
                                    </span>
                                    <p className="text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5 font-medium">
                                        {selectedRequest.initiator === 'UDP Proxy Engine' && <Filter className="w-3.5 h-3.5 text-emerald-500" />}
                                        {selectedRequest.initiator === 'Tampermonkey Bypass' && <Terminal className="w-3.5 h-3.5 text-amber-500" />}
                                        {selectedRequest.initiator === 'Native Browser Fetch' && <Wifi className="w-3.5 h-3.5 text-indigo-500" />}
                                        {selectedRequest.initiator}
                                    </p>
                                </div>

                                {/* Timestamp */}
                                <div>
                                    <span className="text-slate-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {t.details?.timestamp || "Timestamp"}:
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                                        {selectedRequest.timestamp.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Link (If URL is external and valid) styled beautifully as a Button */}
                        {selectedRequest.url.startsWith('http') && (
                            <a
                                href={selectedRequest.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500 shadow-sm px-3 py-2 text-xs gap-1.5 w-full"
                            >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <span>{t.details?.openUrl || "Open Target URL"}</span>
                            </a>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};
