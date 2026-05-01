
import { BrowserData, GeoPosition } from '../types';
import { generateFilenameTimestamp } from '../utils/formatters';

export const exportAsJson = (
    data: BrowserData, 
    permStatus: Record<string, string>, 
    geoData: GeoPosition | null
) => {
    // Clone data to avoid mutating application state
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // Remove heavy/unnecessary raw image data from the export
    if (cleanData.fingerprints && cleanData.fingerprints.canvasImage) {
        delete cleanData.fingerprints.canvasImage;
    }

    const exportPayload = {
        meta: {
            appName: "BrowserScope",
            version: "1.5.0",
            exportTime: new Date().toISOString()
        },
        permissions: permStatus,
        geolocation: geoData || 'Permission not granted or unavailable',
        data: cleanData
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
