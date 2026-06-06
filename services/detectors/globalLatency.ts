
export interface LatencyRegion {
    id: string;
    name: string; // Internal name, should be translated in UI
    url: string;
    coordinates: { x: number, y: number }; // Percentage 0-100 on map
}

export interface LatencyResult {
    id: string;
    latency: number;
    status: 'pending' | 'success' | 'error';
}

// Coordinate Mapping (Approximate for Equirectangular projection)
// X: 0 (West) -> 100 (East)
// Y: 0 (North) -> 100 (South)

export const LATENCY_REGIONS: LatencyRegion[] = [
    // North America
    { id: 'us_east', name: 'US East (N. Virginia)', url: 'https://dynamodb.us-east-1.amazonaws.com', coordinates: { x: 23, y: 33 } },
    { id: 'us_west', name: 'US West (California)', url: 'https://dynamodb.us-west-1.amazonaws.com', coordinates: { x: 12, y: 35 } },
    { id: 'ca_central', name: 'Canada (Montreal)', url: 'https://dynamodb.ca-central-1.amazonaws.com', coordinates: { x: 25, y: 30 } },
    
    // South America
    { id: 'sa_brazil', name: 'Brazil (São Paulo)', url: 'https://dynamodb.sa-east-1.amazonaws.com', coordinates: { x: 32, y: 70 } },
    { id: 'sa_chile', name: 'Chile (Santiago)', url: 'https://dynamodb.us-west-2.amazonaws.com', coordinates: { x: 28, y: 82 } }, // Using reliable endpoint

    // Europe
    { id: 'eu_uk', name: 'UK (London)', url: 'https://dynamodb.eu-west-2.amazonaws.com', coordinates: { x: 47, y: 23 } },
    { id: 'eu_ger', name: 'Germany (Frankfurt)', url: 'https://dynamodb.eu-central-1.amazonaws.com', coordinates: { x: 50, y: 25 } },
    { id: 'eu_fr', name: 'France (Paris)', url: 'https://dynamodb.eu-west-3.amazonaws.com', coordinates: { x: 48, y: 27 } },
    { id: 'eu_se', name: 'Sweden (Stockholm)', url: 'https://dynamodb.eu-north-1.amazonaws.com', coordinates: { x: 52, y: 18 } },

    // Asia / Pacific
    { id: 'ap_india', name: 'India (Mumbai)', url: 'https://dynamodb.ap-south-1.amazonaws.com', coordinates: { x: 68, y: 45 } },
    { id: 'ap_sg', name: 'Singapore', url: 'https://dynamodb.ap-southeast-1.amazonaws.com', coordinates: { x: 78, y: 55 } },
    { id: 'ap_jp', name: 'Japan (Tokyo)', url: 'https://dynamodb.ap-northeast-1.amazonaws.com', coordinates: { x: 88, y: 33 } },
    { id: 'ap_kr', name: 'South Korea (Seoul)', url: 'https://dynamodb.ap-northeast-2.amazonaws.com', coordinates: { x: 86, y: 34 } },
    { id: 'ap_au', name: 'Australia (Sydney)', url: 'https://dynamodb.ap-southeast-2.amazonaws.com', coordinates: { x: 92, y: 78 } },

    // Greater China (Specific Cities for Neutrality/Accuracy)
    // Using widely available CDNs/Endpoints that usually have nodes in these cities
    { id: 'cn_sh', name: 'China (Shanghai)', url: 'https://www.baidu.com/favicon.ico', coordinates: { x: 82, y: 35 } }, // Baidu usually resolves fast in mainland
    { id: 'cn_hk', name: 'China (Hong Kong)', url: 'https://dynamodb.ap-east-1.amazonaws.com', coordinates: { x: 80, y: 40 } },
    { id: 'cn_tw', name: 'China (Taipei)', url: 'https://www.google.com.tw/favicon.ico', coordinates: { x: 84, y: 39 } }, // Or other reliable TW endpoint

    // Africa
    { id: 'af_sa', name: 'South Africa (Cape Town)', url: 'https://dynamodb.af-south-1.amazonaws.com', coordinates: { x: 53, y: 80 } },
];

export const measureLatency = async (url: string): Promise<number> => {
    const start = performance.now();
    // Use no-cors to allow measuring time even if CORS headers are missing
    // cache: no-store is critical to measure network, not disk
    await fetch(url, { mode: 'no-cors', cache: 'no-store', method: 'HEAD' });
    const end = performance.now();
    return Math.round(end - start);
};
