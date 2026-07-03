
import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, Activity, Network, MapPin, Zap, Info, AlertCircle, Wifi, Copy, Check, Shield, Server, Radio, Clock, Map as MapIcon, Home, Smartphone } from 'lucide-react';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { 
    fetchIpInfoFromSource, 
    detectIpv6, 
    runWebRTCScan, 
    detectDns, 
    detectProtocols, 
    IpInfo, 
    WebRTCCandidate 
} from '../services/detectors/networkDiagnostics';

interface NetworkToolsModalProps {
    onClose: () => void;
    t: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
    enableUdp?: boolean;
}

interface CDNStatus {
    name: string;
    url: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    latency: number;
}

const IPV4_SOURCES = [
    { id: 'ippure', label: 'my.ippure.com (Detailed)' },
    { id: 'ipwhois', label: 'ipwho.is (Detailed)' },
    { id: 'ipapi', label: 'ipapi.co (Detailed)' },
    { id: 'cloudflare', label: 'Cloudflare (Simple)' },
    { id: 'ipify', label: 'ipify (Simple)' },
];

const IPV6_SOURCES = [
    { id: 'ipify', label: 'ipify (Global)' },
    { id: 'seeip', label: 'seeip.org' },
    { id: 'icanhazip', label: 'icanhazip' },
];

export const NetworkToolsModal: React.FC<NetworkToolsModalProps> = ({ onClose, t, enableUdp = false }) => {
    const networkT = t.settings.network;

    // IPv4 State
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [loadingIp, setLoadingIp] = useState(false);
    const [activeIpv4Source, setActiveIpv4Source] = useState(() => localStorage.getItem('ipv4_source') || 'ippure');
    const [ipv4Copied, setIpv4Copied] = useState(false);

    // IPv6 State
    const [ipv6Address, setIpv6Address] = useState<string | null>(null);
    const [checkingIpv6, setCheckingIpv6] = useState(false);
    const [activeIpv6Source, setActiveIpv6Source] = useState(() => localStorage.getItem('ipv6_source') || 'ipify');
    const [ipv6Copied, setIpv6Copied] = useState(false);

    // Connectivity State
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState<{status: string, latency?: number, code?: number} | null>(null);
    const [testingConn, setTestingConn] = useState(false);

    // Advanced Diagnostics State
    const [webrtcCandidates, setWebrtcCandidates] = useState<WebRTCCandidate[]>([]);
    const [scanningWebrtc, setScanningWebrtc] = useState(false);
    
    const [dnsInfo, setDnsInfo] = useState<{ip: string, geo: string} | null>(null);
    const [checkingDns, setCheckingDns] = useState(false);
    const [dnsError, setDnsError] = useState<string | null>(null);

    const [protocols, setProtocols] = useState<{h2: string, h3: string} | null>(null);
    const [checkingProto, setCheckingProto] = useState(false);

    // CDN State
    const [cdns, setCdns] = useState<CDNStatus[]>([
        { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com', status: 'idle', latency: 0 },
        { name: 'Lucide Icons', url: 'https://esm.sh/lucide-react@0.263.1', status: 'idle', latency: 0 },
        { name: 'React', url: 'https://esm.sh/react@18.2.0', status: 'idle', latency: 0 },
        { name: 'FingerprintJS', url: 'https://esm.sh/@fingerprintjs/fingerprintjs@4.5.1', status: 'idle', latency: 0 }
    ]);

    useEffect(() => { localStorage.setItem('ipv4_source', activeIpv4Source); }, [activeIpv4Source]);
    useEffect(() => { localStorage.setItem('ipv6_source', activeIpv6Source); }, [activeIpv6Source]);

    const handleFetchIp = async () => {
        setLoadingIp(true);
        setIpInfo(null);
        const data = await fetchIpInfoFromSource(activeIpv4Source, enableUdp);
        setIpInfo(data);
        setLoadingIp(false);
    };

    const handleCheckIpv6 = async () => {
        setCheckingIpv6(true);
        setIpv6Address(null);
        const ip = await detectIpv6(activeIpv6Source, enableUdp);
        setIpv6Address(ip);
        setCheckingIpv6(false);
    };

    const handleCopy = (text: string, setCopied: (val: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const checkCDN = async (index: number) => {
        const cdn = cdns[index];
        const newCdns = [...cdns];
        newCdns[index].status = 'loading';
        setCdns(newCdns);

        const start = performance.now();
        try {
            if (enableUdp) {
                const res = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cdn.url, method: 'HEAD', useUdp: true })
                });
                if (!res.ok) throw new Error("Failed");
            } else {
                await fetch(cdn.url, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
            }
            const end = performance.now();
            newCdns[index].status = 'success';
            newCdns[index].latency = Math.round(end - start);
        } catch {
            newCdns[index].status = 'error';
        }
        setCdns([...newCdns]);
    };

    const checkAllCDNs = () => {
        cdns.forEach((_, idx) => checkCDN(idx));
    };

    const runConnectivityTest = async () => {
        if (!testUrl) return;
        setTestingConn(true);
        setTestResult(null);

        let urlToTest = testUrl;
        if (!/^https?:\/\//i.test(urlToTest)) {
            urlToTest = 'https://' + urlToTest;
        }

        const start = performance.now();
        try {
            if (enableUdp) {
                const res = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urlToTest, method: 'HEAD', useUdp: true })
                });
                if (!res.ok) throw new Error("Proxy error");
            } else {
                await fetch(urlToTest, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
            }
            const end = performance.now();
            setTestResult({
                status: 'Success',
                latency: Math.round(end - start),
                code: 200
            });
        } catch {
            setTestResult({ status: 'Failed (Network Error)' });
        }
        setTestingConn(false);
    };

    const handleWebRTC = async () => {
        setScanningWebrtc(true);
        setWebrtcCandidates([]);
        await runWebRTCScan((candidate) => {
            setWebrtcCandidates(prev => {
                if (prev.some(x => x.ip === candidate.ip && x.port === candidate.port)) return prev;
                return [...prev, candidate];
            });
        });
        setScanningWebrtc(false);
    };

    const handleDnsCheck = async () => {
        setCheckingDns(true);
        setDnsInfo(null);
        setDnsError(null);
        try {
            const info = await detectDns(enableUdp);
            if (info) setDnsInfo(info);
            else throw new Error('Unknown');
        } catch {
            setDnsError("Failed to detect resolver (Likely blocked by AdBlock or CORS)");
        }
        setCheckingDns(false);
    };

    const handleProtoCheck = async () => {
        setCheckingProto(true);
        setProtocols(null);
        const res = await detectProtocols();
        setProtocols(res);
        setCheckingProto(false);
    };

    const renderBentoItem = (icon: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, label: string, value: string | number | undefined | null | boolean, colorClass = 'text-slate-800 dark:text-slate-200', colSpan = 'col-span-1') => {
        if (value === undefined || value === null || value === '') return null;
        
        const displayValue = typeof value === 'boolean' ? (value ? networkT.ip.yes : networkT.ip.no) : value;

        return (
            <div className={`flex flex-col gap-1.5 p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${colSpan}`}>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    {React.createElement(icon, { size: 14, className: "opacity-70" })}
                    <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                </div>
                <div className={`text-sm font-medium break-words ${colorClass}`}>
                    {displayValue}
                </div>
            </div>
        );
    };

    return (
        <Modal 
            onClose={onClose}
            title={t.settings.nav.network} 
            icon={<Wifi size={24} className="text-indigo-500" />}
            size="4xl"
            fullHeight
        >
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Modern IP Configuration Card */}
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-500 dark:text-indigo-400">
                                <Globe size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">{networkT.ip.title}</h3>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* IPv4 Fetch Block */}
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-md ring-1 ring-inset ring-indigo-500/20">{networkT.ip.ipv4}</span>
                                    <Select 
                                        value={activeIpv4Source}
                                        options={IPV4_SOURCES}
                                        onChange={setActiveIpv4Source}
                                        size="sm"
                                        fullWidth={false}
                                        className="w-[200px]"
                                    />
                                    <Button 
                                        onClick={handleFetchIp}
                                        isLoading={loadingIp}
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<RefreshCw size={14} />}
                                    >
                                        {networkT.ip.fetch}
                                    </Button>
                                </div>

                                {ipInfo?.error && (
                                    <div className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <AlertCircle size={16} />
                                        <span>{ipInfo.error}</span>
                                    </div>
                                )}
                                
                                {ipInfo && !ipInfo.error && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                                        <div className="flex items-center gap-4 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/40">
                                            <div className="font-mono text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tighter break-all bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                                                {ipInfo.ip}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(ipInfo.ip!, setIpv4Copied)}
                                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/20 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm transition-all active:scale-95"
                                            >
                                                {ipv4Copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                            </button>
                                        </div>

                                        {/* Bento Grid layout for IP details */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {renderBentoItem(MapPin, networkT.ip.detail_location, [ipInfo.city, ipInfo.region, ipInfo.countryCode || ipInfo.country].filter(Boolean).join(', '), 'text-slate-800 dark:text-slate-200', 'col-span-2')}
                                            {renderBentoItem(Network, "ISP", ipInfo.isp, 'font-medium font-sans', 'col-span-2')}
                                            {renderBentoItem(Server, networkT.ip.detail_asn, ipInfo.asn ? `AS${ipInfo.asn}` : undefined)}
                                            {renderBentoItem(Clock, networkT.ip.detail_timezone, ipInfo.timezone, "font-mono text-xs")}
                                            {renderBentoItem(MapIcon, networkT.ip.detail_zip, ipInfo.postalCode)}
                                            {renderBentoItem(Shield, networkT.ip.detail_fraud, ipInfo.fraudScore, ipInfo.fraudScore !== undefined ? (ipInfo.fraudScore > 50 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold') : undefined)}
                                            {renderBentoItem(Home, networkT.ip.detail_residential, ipInfo.isResidential, ipInfo.isResidential ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500')}
                                            {renderBentoItem(Radio, networkT.ip.detail_broadcast, ipInfo.isBroadcast)}
                                            {renderBentoItem(Smartphone, networkT.ip.detail_ua, ipInfo.userAgent, 'text-xs text-slate-500 line-clamp-2', 'col-span-2 md:col-span-3 lg:col-span-4')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Separator for Desktop/Mobile */}
                            <div className="w-full lg:w-px h-px lg:h-auto bg-slate-200 dark:bg-slate-700/60 self-stretch my-2 lg:my-0"></div>

                            {/* IPv6 Fetch Block */}
                            <div className="space-y-4 lg:w-1/3 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-500/20 dark:text-purple-300 rounded-md ring-1 ring-inset ring-purple-500/20">{networkT.ip.ipv6}</span>
                                    <Button 
                                        onClick={handleCheckIpv6}
                                        isLoading={checkingIpv6}
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<Zap size={14} />}
                                    >
                                        {networkT.ip.check_v6}
                                    </Button>
                                </div>
                                <Select 
                                    value={activeIpv6Source}
                                    options={IPV6_SOURCES}
                                    onChange={setActiveIpv6Source}
                                    size="sm"
                                    fullWidth={true}
                                />

                                {ipv6Address && ipv6Address !== 'fail' ? (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="font-mono text-sm font-bold text-slate-800 dark:text-white break-all leading-tight">
                                                {ipv6Address}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(ipv6Address!, setIpv6Copied)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-colors shrink-0"
                                            >
                                                {ipv6Copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{networkT.ip.success_v6}</span>
                                        </div>
                                    </div>
                                ) : ipv6Address === 'fail' ? (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{networkT.ip.fail_v6}</span>
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 text-slate-400 text-sm">
                                        <Info size={16} />
                                        IPv6 status pending detection...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diagnostics and Utils Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Advanced Diagnostics Container */}
                    <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                            <Server size={18} className="text-slate-500 text-indigo-500" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">{networkT.diagnostics.title}</h3>
                        </div>
                        
                        <div className="p-6 space-y-6 flex-1 flex flex-col">
                            {/* WebRTC */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Radio size={16} className="text-blue-500" />
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{networkT.diagnostics.webrtc.title}</h4>
                                    </div>
                                    <Button onClick={handleWebRTC} isLoading={scanningWebrtc} variant="secondary" size="xs">{networkT.diagnostics.webrtc.btn}</Button>
                                </div>
                                {webrtcCandidates.length > 0 ? (
                                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
                                                <tr>
                                                    <th className="px-3 py-2 font-medium">{networkT.diagnostics.webrtc.columns.type}</th>
                                                    <th className="px-3 py-2 font-medium">{networkT.diagnostics.webrtc.columns.ip}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                                {webrtcCandidates.map(c => (
                                                    <tr key={c.id}>
                                                        <td className="px-3 py-2">
                                                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] uppercase">{c.type}</span>
                                                        </td>
                                                        <td className="px-3 py-2 font-mono font-medium text-slate-700 dark:text-slate-300">{c.ip} <span className="text-slate-400">:{c.port}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{networkT.diagnostics.webrtc.desc}</div>
                                )}
                            </div>

                            {/* DNS */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-orange-500" />
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{networkT.diagnostics.dns.title}</h4>
                                    </div>
                                    <Button onClick={handleDnsCheck} isLoading={checkingDns} variant="secondary" size="xs">{networkT.diagnostics.dns.btn}</Button>
                                </div>
                                {dnsInfo ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{networkT.diagnostics.dns.label_ip}</div>
                                            <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{dnsInfo.ip}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{networkT.diagnostics.dns.label_geo}</div>
                                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{dnsInfo.geo}</div>
                                        </div>
                                    </div>
                                ) : dnsError ? (
                                    <div className="text-xs text-red-500 flex items-center gap-1.5"><AlertCircle size={14} />{dnsError}</div>
                                ) : (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{networkT.diagnostics.dns.desc}</div>
                                )}
                            </div>

                            {/* Protocols */}
                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/60">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Zap size={16} className="text-emerald-500" />
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{networkT.diagnostics.proto.title}</h4>
                                    </div>
                                    <Button onClick={handleProtoCheck} isLoading={checkingProto} variant="secondary" size="xs">{networkT.diagnostics.proto.btn}</Button>
                                </div>
                                {protocols ? (
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex justify-between items-center">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">HTTP/2</span>
                                            <span className={`w-2.5 h-2.5 rounded-full ${protocols.h2 === 'h2' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                        </div>
                                        <div className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex justify-between items-center">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">HTTP/3</span>
                                            <span className={`w-2.5 h-2.5 rounded-full ${protocols.h3 === 'h3' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{networkT.diagnostics.proto.desc}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Connectivity Test Container */}
                        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Wifi size={18} className="text-indigo-500" />
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{networkT.connectivity.title}</h3>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={testUrl}
                                    onChange={(e) => setTestUrl(e.target.value)}
                                    placeholder={networkT.connectivity.placeholder}
                                    className="flex-1 min-w-0 px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                                    onKeyDown={(e) => e.key === 'Enter' && runConnectivityTest()}
                                />
                                <Button onClick={runConnectivityTest} disabled={!testUrl} isLoading={testingConn}>{networkT.connectivity.btn}</Button>
                            </div>
                            {testResult && (
                                <div className={`mt-4 p-4 rounded-xl flex flex-col gap-1 ${testResult.status.includes('Success') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-500/20'}`}>
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span>Status</span>
                                        <span>{testResult.status}</span>
                                    </div>
                                    {testResult.latency !== undefined && (
                                        <div className="flex justify-between items-center text-xs opacity-80">
                                            <span>Latency</span>
                                            <span className="font-mono">{testResult.latency} ms</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CDN Status */}
                        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-teal-500" />
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{networkT.cdn.title}</h3>
                                </div>
                                <Button onClick={checkAllCDNs} variant="secondary" size="xs">{networkT.cdn.check_all}</Button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {cdns.map((cdn, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{cdn.name}</span>
                                        <div className="flex items-center justify-end min-w-[60px]">
                                            {cdn.status === 'idle' && <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />}
                                            {cdn.status === 'loading' && <Activity className="animate-spin text-teal-500" size={14} />}
                                            {cdn.status === 'success' && <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-lg">{cdn.latency}ms</span>}
                                            {cdn.status === 'error' && <AlertCircle className="text-red-500" size={14} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    );
};
