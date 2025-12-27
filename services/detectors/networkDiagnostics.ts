
export interface IpInfo {
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

export interface WebRTCCandidate {
    id: string;
    ip: string;
    port: number;
    protocol: string;
    type: string;
    raw: string;
}

export const fetchIpInfoFromSource = async (source: string): Promise<IpInfo> => {
    try {
        if (source === 'ipwhois') {
            const res = await fetch('https://ipwho.is/', { referrerPolicy: 'no-referrer' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (!json.success && json.message) throw new Error(json.message);
            return json;
        } 
        else if (source === 'ipapi') {
            const res = await fetch('https://ipapi.co/json/', { referrerPolicy: 'no-referrer' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.error) throw new Error(json.reason || 'API Error');
            return {
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
        else if (source === 'cloudflare') {
            const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const lines = text.split('\n');
            const ipLine = lines.find(l => l.startsWith('ip='));
            const ip = ipLine ? ipLine.split('=')[1] : 'Unknown';
            const locLine = lines.find(l => l.startsWith('loc='));
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
            const res = await fetch('https://api.ipify.org?format=json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return {
                ip: json.ip,
                success: true,
                type: 'IPv4',
                isp: 'Ipify'
            };
        }
    } catch (e) {
        console.error("IP fetch failed", e);
        return { error: "Detection failed. Check network or AdBlock." };
    }
};

export const detectIpv6 = async (source: string): Promise<string> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        let url = 'https://api6.ipify.org?format=json';
        if (source === 'seeip') url = 'https://ip6.seeip.org/json';
        if (source === 'icanhazip') url = 'https://ipv6.icanhazip.com';

        const res = await fetch(url, { 
            signal: controller.signal,
            mode: 'cors' 
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('Failed');
        
        if (source === 'icanhazip') {
            return (await res.text()).trim();
        } else {
            const data = await res.json();
            return data.ip;
        }
    } catch (e) {
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

        } catch (e) {
            console.error("WebRTC Error", e);
            resolve();
        }
    });
};

export const detectDns = async (): Promise<{ ip: string; geo: string } | null> => {
    try {
        const res = await fetch('https://edns.ip-api.com/json');
        if (!res.ok) throw new Error("API Unreachable");
        const data = await res.json();
        
        if (data && data.dns) {
            return {
                ip: data.dns.ip || 'Unknown',
                geo: data.dns.geo || 'Unknown'
            };
        }
        return null;
    } catch (e) {
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
                // @ts-ignore
                return entries[entries.length - 1].nextHopProtocol || 'unknown';
            }
            return 'unknown';
        };

        return {
            h2: getProto(testH2),
            h3: getProto(testH3)
        };
    } catch (e) {
        return { h2: 'error', h3: 'error' };
    }
};
