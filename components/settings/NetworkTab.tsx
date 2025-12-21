
import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, Activity, Network, MapPin, Zap, Info, AlertCircle, Wifi, Copy, Check, Shield, Server, Radio } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface NetworkTabProps {
    t: Translation['settingsModal'];
}

interface IpInfo {
    ip?: string;
    success?: boolean;
    type?: string;
    continent?: string;
    country?: string;
    region?: string;
    city?: string;
    isp?: string;
    error?: string;
}

interface CDNStatus {
    name: string;
    url: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    latency: number;
}

interface WebRTCCandidate {
    id: string;
    ip: string;
    port: number;
    protocol: string;
    type: string;
    raw: string;
}

const IPV4_SOURCES = [
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

export const NetworkTab: React.FC<NetworkTabProps> = ({ t }) => {
    // IPv4 State
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [loadingIp, setLoadingIp] = useState(false);
    const [activeIpv4Source, setActiveIpv4Source] = useState(() => localStorage.getItem('ipv4_source') || 'ipwhois');
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

    // Persist backend choices
    useEffect(() => {
        localStorage.setItem('ipv4_source', activeIpv4Source);
    }, [activeIpv4Source]);

    useEffect(() => {
        localStorage.setItem('ipv6_source', activeIpv6Source);
    }, [activeIpv6Source]);

    // Logic
    const fetchIpInfo = async () => {
        setLoadingIp(true);
        setIpInfo(null);
        
        try {
            let data: IpInfo;
            
            if (activeIpv4Source === 'ipwhois') {
                const res = await fetch('https://ipwho.is/', { referrerPolicy: 'no-referrer' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (!json.success && json.message) throw new Error(json.message);
                data = json;
            } 
            else if (activeIpv4Source === 'ipapi') {
                const res = await fetch('https://ipapi.co/json/', { referrerPolicy: 'no-referrer' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (json.error) throw new Error(json.reason || 'API Error');
                data = {
                    ip: json.ip,
                    success: true,
                    type: json.version || 'IPv4',
                    continent: json.continent_code,
                    country: json.country_name,
                    region: json.region,
                    city: json.city,
                    isp: json.org
                };
            }
            else if (activeIpv4Source === 'cloudflare') {
                const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                const lines = text.split('\n');
                const ipLine = lines.find(l => l.startsWith('ip='));
                const ip = ipLine ? ipLine.split('=')[1] : 'Unknown';
                const locLine = lines.find(l => l.startsWith('loc='));
                const loc = locLine ? locLine.split('=')[1] : '';
                
                data = {
                    ip,
                    success: true,
                    type: 'IPv4',
                    country: loc,
                    isp: 'Cloudflare Trace'
                };
            }
            else { // ipify
                const res = await fetch('https://api.ipify.org?format=json');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                data = {
                    ip: json.ip,
                    success: true,
                    type: 'IPv4',
                    isp: 'Ipify'
                };
            }

            setIpInfo(data);
        } catch (e) {
            console.error("IP fetch failed", e);
            setIpInfo({ error: "Detection failed. Check network or AdBlock." });
        }
        setLoadingIp(false);
    };

    const checkIpv6 = async () => {
        setCheckingIpv6(true);
        setIpv6Address(null);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            let url = 'https://api6.ipify.org?format=json';
            if (activeIpv6Source === 'seeip') url = 'https://ip6.seeip.org/json';
            if (activeIpv6Source === 'icanhazip') url = 'https://ipv6.icanhazip.com';

            const res = await fetch(url, { 
                signal: controller.signal,
                mode: 'cors' 
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error('Failed');
            
            let ip = '';
            if (activeIpv6Source === 'icanhazip') {
                ip = (await res.text()).trim();
            } else {
                const data = await res.json();
                ip = data.ip;
            }
            
            setIpv6Address(ip);
        } catch (e) {
            setIpv6Address('fail');
        }
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
            await fetch(cdn.url, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
            const end = performance.now();
            newCdns[index].status = 'success';
            newCdns[index].latency = Math.round(end - start);
        } catch (e) {
            console.error(e);
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
            await fetch(urlToTest, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
            const end = performance.now();
            setTestResult({
                status: 'Success',
                latency: Math.round(end - start),
                code: 200
            });
        } catch (e) {
            setTestResult({
                status: 'Failed (Network Error)',
            });
        }
        setTestingConn(false);
    };

    // --- Advanced Diagnostics Functions ---

    const runWebRTCAnalysis = async () => {
        setScanningWebrtc(true);
        setWebrtcCandidates([]);
        
        try {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    const c = e.candidate;
                    // Simple parsing
                    const parts = c.candidate.split(' ');
                    
                    const candidateObj: WebRTCCandidate = {
                        id: Math.random().toString(36).substr(2, 9),
                        ip: c.address || parts[4] || '?',
                        port: c.port || parseInt(parts[5]) || 0,
                        protocol: c.protocol || parts[2] || '?',
                        type: c.type || parts[7] || '?',
                        raw: c.candidate
                    };

                    setWebrtcCandidates(prev => {
                        if (prev.some(x => x.ip === candidateObj.ip && x.port === candidateObj.port)) return prev;
                        return [...prev, candidateObj];
                    });
                }
            };

            pc.createDataChannel('test');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            setTimeout(() => {
                pc.close();
                setScanningWebrtc(false);
            }, 5000);

        } catch (e) {
            console.error("WebRTC Error", e);
            setScanningWebrtc(false);
        }
    };

    const checkDnsResolver = async () => {
        setCheckingDns(true);
        setDnsInfo(null);
        setDnsError(null);
        try {
            const res = await fetch('https://edns.ip-api.com/json');
            if (!res.ok) throw new Error("API Unreachable");
            const data = await res.json();
            
            if (data && data.dns) {
                setDnsInfo({
                    ip: data.dns.ip || 'Unknown',
                    geo: data.dns.geo || 'Unknown'
                });
            } else {
                throw new Error("Invalid response format");
            }
        } catch (e) {
            setDnsError("Failed to detect resolver (Likely blocked by AdBlock or CORS)");
        }
        setCheckingDns(false);
    };

    const checkProtocols = async () => {
        setCheckingProto(true);
        setProtocols(null);
        
        try {
            const testH2 = 'https://www.google.com/generate_204'; 
            const testH3 = 'https://www.cloudflare.com/cdn-cgi/trace';

            await Promise.allSettled([
                fetch(testH2, { mode: 'no-cors', cache: 'no-store' }),
                fetch(testH3, { mode: 'no-cors', cache: 'no-store' })
            ]);

            await new Promise(r => setTimeout(r, 500));

            const getProto = (url: string) => {
                const entries = performance.getEntriesByName(url);
                if (entries.length > 0) {
                    // @ts-ignore
                    return entries[entries.length - 1].nextHopProtocol || 'unknown';
                }
                return 'unknown';
            };

            setProtocols({
                h2: getProto(testH2),
                h3: getProto(testH3)
            });

        } catch (e) {
            console.error(e);
        }
        setCheckingProto(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Unified IP Information Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                    <Globe size={18} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">IP Configuration</h3>
                </div>

                <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
                    {/* IPv4 Section */}
                    <div className="p-6 transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/50 group">
                        <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">IPv4</span>
                                <span className="text-xs text-slate-400 hidden sm:inline-block">Standard Internet Protocol</span>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Select 
                                    value={activeIpv4Source}
                                    options={IPV4_SOURCES}
                                    onChange={setActiveIpv4Source}
                                    color="indigo"
                                    size="sm"
                                    fullWidth={false}
                                    className="min-w-[140px]"
                                />

                                <Button 
                                    onClick={fetchIpInfo}
                                    isLoading={loadingIp}
                                    variant="secondary"
                                    size="xs"
                                    leftIcon={<RefreshCw size={12} />}
                                >
                                    {t.fetch_ip}
                                </Button>
                            </div>
                        </div>

                        {ipInfo ? (
                            ipInfo.error ? (
                                <div className="py-4 text-sm text-red-500 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{ipInfo.error}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight break-all">
                                            {ipInfo.ip}
                                        </div>
                                        <button
                                            onClick={() => handleCopy(ipInfo.ip!, setIpv4Copied)}
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            title="Copy IPv4"
                                        >
                                            {ipv4Copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        {ipInfo.isp && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                                <Network size={14} className="text-indigo-500" />
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{ipInfo.isp}</span>
                                            </div>
                                        )}
                                        {(ipInfo.city || ipInfo.country) && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                                <MapPin size={14} className="text-emerald-500" />
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                                    {[ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="py-4 text-sm text-slate-400 italic flex items-center gap-2">
                                <Info size={16} />
                                Tap button to detect public IPv4
                            </div>
                        )}
                    </div>

                    {/* IPv6 Section */}
                    <div className="p-6 transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/50">
                        <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded-md dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">IPv6</span>
                                <span className="text-xs text-slate-400 hidden sm:inline-block">Next Generation Protocol</span>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Select 
                                    value={activeIpv6Source}
                                    options={IPV6_SOURCES}
                                    onChange={setActiveIpv6Source}
                                    color="purple"
                                    size="sm"
                                    fullWidth={false}
                                    className="min-w-[140px]"
                                />

                                <Button 
                                    onClick={checkIpv6}
                                    isLoading={checkingIpv6}
                                    variant="secondary"
                                    size="xs"
                                    leftIcon={<Zap size={12} />}
                                >
                                    {t.check_ipv6}
                                </Button>
                            </div>
                        </div>

                        {ipv6Address && ipv6Address !== 'fail' ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="font-mono text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight break-all">
                                        {ipv6Address}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(ipv6Address!, setIpv6Copied)}
                                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/50 dark:hover:text-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        title="Copy IPv6"
                                    >
                                        {ipv6Copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t.ipv6_success}</span>
                                    </div>
                                </div>
                            </div>
                        ) : ipv6Address === 'fail' ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <span className="text-sm font-medium">{t.ipv6_fail}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-2 text-sm text-slate-400 italic flex items-center gap-2">
                                <Info size={16} />
                                Tap button to detect IPv6 connectivity
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Diagnostics Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                    <Server size={18} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{t.network_adv_title}</h3>
                </div>
                
                <div className="p-6 space-y-8">
                    
                    {/* WebRTC */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Radio size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{t.network_webrtc_title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{t.network_webrtc_desc}</p>
                                </div>
                            </div>
                            <Button 
                                onClick={runWebRTCAnalysis}
                                isLoading={scanningWebrtc}
                                variant="primary"
                                size="xs"
                            >
                                {t.network_webrtc_btn}
                            </Button>
                        </div>
                        
                        {webrtcCandidates.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                        <tr>
                                            <th className="px-4 py-2">{t.col_type}</th>
                                            <th className="px-4 py-2">{t.col_ip}</th>
                                            <th className="px-4 py-2">{t.col_protocol}</th>
                                            <th className="px-4 py-2">{t.col_port}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {webrtcCandidates.map(c => (
                                            <tr key={c.id} className="text-slate-700 dark:text-slate-300 font-mono">
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 rounded ${c.type === 'host' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                        {c.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{c.ip}</td>
                                                <td className="px-4 py-2 uppercase">{c.protocol}</td>
                                                <td className="px-4 py-2">{c.port}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-700" />

                    {/* DNS Leak */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{t.network_dns_title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{t.network_dns_desc}</p>
                                </div>
                            </div>
                            <Button 
                                onClick={checkDnsResolver}
                                isLoading={checkingDns}
                                variant="secondary"
                                size="xs"
                            >
                                {t.network_dns_btn}
                            </Button>
                        </div>

                        {dnsInfo && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs text-slate-400 mb-1">{t.lbl_dns_ip}</div>
                                    <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{dnsInfo.ip}</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs text-slate-400 mb-1">{t.lbl_dns_geo}</div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">{dnsInfo.geo}</div>
                                </div>
                            </div>
                        )}
                        {dnsError && (
                            <div className="text-xs text-red-500 flex items-center gap-2 mt-2">
                                <AlertCircle size={14} />
                                {dnsError}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-700" />

                    {/* Protocol Support */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{t.proto_title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{t.proto_desc}</p>
                                </div>
                            </div>
                            <Button 
                                onClick={checkProtocols}
                                isLoading={checkingProto}
                                variant="secondary"
                                size="xs"
                            >
                                {t.proto_check_btn}
                            </Button>
                        </div>

                        {protocols && (
                            <div className="flex gap-4">
                                <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.proto_http2}</span>
                                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${protocols.h2 === 'h2' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500'}`}>
                                        {protocols.h2 === 'h2' ? 'Supported' : protocols.h2}
                                    </span>
                                </div>
                                <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.proto_http3}</span>
                                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${protocols.h3 === 'h3' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500'}`}>
                                        {protocols.h3 === 'h3' ? 'Supported' : protocols.h3}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Connectivity Test */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{t.test_conn}</h3>
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={testUrl}
                        onChange={(e) => setTestUrl(e.target.value)}
                        placeholder={t.url_placeholder}
                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && runConnectivityTest()}
                    />
                    <Button 
                        onClick={runConnectivityTest}
                        disabled={!testUrl}
                        isLoading={testingConn}
                        leftIcon={<Wifi size={18} />}
                    >
                        Test
                    </Button>
                </div>
                {testResult && (
                    <div className={`p-4 rounded-lg flex items-center justify-between ${testResult.status.includes('Success') ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300'}`}>
                        <span className="font-medium">{testResult.status}</span>
                        {testResult.latency !== undefined && (
                            <span className="font-mono font-bold">{testResult.latency} ms</span>
                        )}
                    </div>
                )}
            </div>

            {/* CDN Status */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.cdn_status}</h3>
                    <button onClick={checkAllCDNs} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                        {t.check_all}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cdns.map((cdn, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                            <div className="flex flex-col min-w-0 mr-4">
                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{cdn.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {cdn.status === 'idle' && <span className="w-2 h-2 rounded-full bg-slate-300" />}
                                {cdn.status === 'loading' && <Activity className="animate-spin text-indigo-500" size={16} />}
                                {cdn.status === 'success' && <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">{cdn.latency}ms</span>}
                                {cdn.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
