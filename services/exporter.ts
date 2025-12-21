
import { BrowserData, GeoPosition } from '../types';
import { generateFilenameTimestamp } from '../utils/formatters';

export const exportAsJson = (
    data: BrowserData, 
    permStatus: Record<string, string>, 
    geoData: GeoPosition | null
) => {
    const exportPayload = {
        meta: {
            appName: "BrowserScope",
            version: "1.5.0",
            exportTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${window.screen.width}x${window.screen.height}`,
            window: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio
        },
        permissions: permStatus,
        geolocation: geoData || 'Permission not granted or unavailable',
        data: data
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    // Use Intl based formatter for consistent filename
    const timestampStr = generateFilenameTimestamp();
    const filename = `browserscope-${timestampStr}.json`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
