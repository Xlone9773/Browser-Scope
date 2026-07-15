
export interface IpInfo {
    ip?: string;
    success?: boolean;
    type?: string;
    continent?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    regionCode?: string;
    city?: string;
    isp?: string;
    asn?: number;
    timezone?: string;
    longitude?: string;
    latitude?: string;
    postalCode?: string;
    fraudScore?: number;
    isResidential?: boolean;
    isBroadcast?: boolean;
    userAgent?: string;
    error?: string;
}

export interface WebRTCCandidate {
    id: string;
    ip: string;
    port: number;
    protocol: string;
    type: string;
    raw: string;
}

interface CustomFetchResponse {
    ok: boolean;
    status: number;
    json(): Promise<unknown>;
    text(): Promise<string>;
}

const customFetch = async (url: string, enableUdp: boolean, options: RequestInit = {}): Promise<CustomFetchResponse> => {
    const doProxyFetch = async (): Promise<CustomFetchResponse> => {
        const res = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, method: options.method || 'GET', useUdp: true })
        });
        
        let proxyData: { status: number; data: string; error?: string };
        try {
            proxyData = await res.json();
        } catch {
            throw new Error(`HTTP ${res.status}: Proxy server error or unreachable.`);
        }
        
        if (!res.ok) {
            throw new Error(`Proxy Error: ${proxyData.error || res.statusText}`);
        }
        
        return {
            ok: true,
            status: proxyData.status,
            json: async () => {
                try {
                    return JSON.parse(proxyData.data);
                } catch {
                    throw new Error("Unable to parse JSON response from proxy. The endpoint might be blocking requests.");
                }
            },
            text: async () => proxyData.data
        };
    };

    if (enableUdp) {
        return doProxyFetch();
    }

    try {
        const response = await fetch(url, options);
        return response as CustomFetchResponse;
    } catch (err: unknown) {
        const errorName = err instanceof Error ? err.name : '';
        const errorMessage = err instanceof Error ? err.message : '';
        if (errorMessage === 'Failed to fetch' || errorName === 'TypeError') {
            console.warn(`Direct fetch failed for ${url}, falling back to server proxy...`);
            return doProxyFetch();
        }
        throw err;
    }
};

export const fetchIpInfoFromSource = async (source: string, enableUdp: boolean = false): Promise<IpInfo> => {
    try {
        if (source === 'ippure') {
            const res = await customFetch('https://my.ippure.com/v1/info', enableUdp, { referrerPolicy: 'no-referrer' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as Record<string, unknown>;
            return {
                ip: json.ip as string,
                success: true,
                type: 'IPv4/IPv6', 
                country: json.country as string,
                countryCode: json.countryCode as string,
                region: json.region as string,
                regionCode: json.regionCode as string,
                city: json.city as string,
                isp: json.asOrganization as string,
                asn: json.asn as number,
                timezone: json.timezone as string,
                longitude: json.longitude as string,
                latitude: json.latitude as string,
                postalCode: json.postalCode as string,
                fraudScore: json.fraudScore as number,
                isResidential: json.isResidential as boolean,
                isBroadcast: json.isBroadcast as boolean,
                userAgent: json.userAgent as string,
            };
        } else if (source === 'ipwhois') {
            const res = await customFetch('https://ipwho.is/', enableUdp, { referrerPolicy: 'no-referrer' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as Record<string, unknown>;
            if (!json.success && json.message) throw new Error(json.message as string);
            const connection = json.connection as Record<string, unknown> | undefined;
            const timezone = json.timezone as Record<string, unknown> | undefined;
            return {
                ip: json.ip as string,
                success: true,
                type: (json.type as string) || 'IPv4',
                continent: json.continent as string,
                country: json.country as string,
                countryCode: json.country_code as string,
                region: json.region as string,
                regionCode: json.region_code as string,
                city: json.city as string,
                isp: (connection?.org || connection?.isp) as string,
                asn: connection?.asn as number,
                timezone: (timezone?.id || (typeof json.timezone === 'string' ? json.timezone : undefined)) as string,
                longitude: json.longitude ? String(json.longitude) : undefined,
                latitude: json.latitude ? String(json.latitude) : undefined,
                postalCode: json.postal as string,
                userAgent: json.userAgent as string
            };
        } 
        else if (source === 'ipapi') {
            const res = await customFetch('https://ipapi.co/json/', enableUdp, { referrerPolicy: 'no-referrer' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as Record<string, unknown>;
            if (json.error) throw new Error((json.reason as string) || 'API Error');
            return {
                ip: json.ip as string,
                success: true,
                type: (json.version as string) || 'IPv4',
                continent: json.continent_code as string,
                country: json.country_name as string,
                region: json.region as string,
                city: json.city as string,
                isp: json.org as string
            };
        }
        else if (source === 'cloudflare') {
            const res = await customFetch('https://www.cloudflare.com/cdn-cgi/trace', enableUdp);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text: string = await res.text();
            const lines: string[] = text.split('\n');
            const ipLine = lines.find((l: string) => l.startsWith('ip='));
            const ip = ipLine ? ipLine.split('=')[1] : 'Unknown';
            const locLine = lines.find((l: string) => l.startsWith('loc='));
            const loc = locLine ? locLine.split('=')[1] : '';
            return {
                ip,
                success: true,
                type: 'IPv4',
                country: loc,
                isp: 'Cloudflare Trace'
            };
        }
        else { // ipify default
            const res = await customFetch('https://api.ipify.org?format=json', enableUdp);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as Record<string, unknown>;
            return {
                ip: json.ip as string,
                success: true,
                type: 'IPv4',
                isp: 'Ipify'
            };
        }
    } catch (e: unknown) {
        console.error("IP fetch failed", e);
        return { error: "Detection failed. Check network or AdBlock." };
    }
};

export const detectIpv6 = async (source: string, enableUdp: boolean = false): Promise<string> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        let url = 'https://api6.ipify.org?format=json';
        if (source === 'seeip') url = 'https://ip6.seeip.org/json';
        if (source === 'icanhazip') url = 'https://ipv6.icanhazip.com';

        const res = await customFetch(url, enableUdp, { 
            signal: controller.signal,
            mode: 'cors' 
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Failed');
        
        if (source === 'icanhazip') {
            return (await res.text()).trim();
        } else {
            const data = (await res.json()) as Record<string, unknown>;
            return data.ip as string;
        }
    } catch {
        return 'fail';
    }
};

export const runWebRTCScan = (onCandidate: (c: WebRTCCandidate) => void): Promise<void> => {
    return new Promise((resolve) => {
        try {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    const c = e.candidate;
                    const parts = c.candidate.split(' ');
                    
                    const candidateObj: WebRTCCandidate = {
                        id: Math.random().toString(36).substr(2, 9),
                        ip: c.address || parts[4] || '?',
                        port: c.port || parseInt(parts[5]) || 0,
                        protocol: c.protocol || parts[2] || '?',
                        type: c.type || parts[7] || '?',
                        raw: c.candidate
                    };
                    onCandidate(candidateObj);
                }
            };

            pc.createDataChannel('test');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));

            setTimeout(() => {
                pc.close();
                resolve();
            }, 5000);

        } catch (e: unknown) {
            console.error("WebRTC Error", e);
            resolve();
        }
    });
};

export const detectDns = async (enableUdp: boolean = false): Promise<{ ip: string; geo: string } | null> => {
    try {
        const res = await customFetch('https://edns.ip-api.com/json', enableUdp);
        if (!res.ok) throw new Error("API Unreachable");
        const data = (await res.json()) as { dns?: { ip?: string; geo?: string } } | undefined;
        
        if (data && data.dns) {
            return {
                ip: data.dns.ip || 'Unknown',
                geo: data.dns.geo || 'Unknown'
            };
        }
        return null;
    } catch {
        throw new Error("Failed to detect resolver");
    }
};

export const detectProtocols = async (): Promise<{ h2: string; h3: string }> => {
    try {
        const testH2 = 'https://www.google.com/generate_204'; 
        const testH3 = 'https://www.cloudflare.com/cdn-cgi/trace';

        await Promise.allSettled([
            fetch(testH2, { mode: 'no-cors', cache: 'no-store' }),
            fetch(testH3, { mode: 'no-cors', cache: 'no-store' })
        ]);

        // Wait for timing API to populate
        await new Promise(r => setTimeout(r, 300));

        const getProto = (url: string) => {
            const entries = performance.getEntriesByName(url);
            if (entries.length > 0) {
                
                                // @ts-expect-error fixed implicitly typed external libraries
                                return entries[entries.length - 1].nextHopProtocol || 'any';
            }
            return 'any';
        };

        return {
            h2: getProto(testH2),
            h3: getProto(testH3)
        };
    } catch {
        return { h2: 'error', h3: 'error' };
    }
};
