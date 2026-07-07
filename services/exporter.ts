
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

export const exportAsPdf = (
    data: BrowserData,
    permStatus: Record<string, string>,
    geoData: GeoPosition | null,
    t: any,
    onStart?: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
) => {
    if (onStart) onStart();

    const timestampStr = generateFilenameTimestamp();
    const filename = `browserscope-${timestampStr}.pdf`;

    // Instantiate a dedicated worker on-the-fly for this task
    const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });

    // Post data to web worker
    worker.postMessage({
        data,
        permStatus,
        geoData,
        t,
        filename
    });

    // Handle background response
    worker.onmessage = (event: MessageEvent<{ type: string; blob?: Blob; filename?: string; message?: string }>) => {
        const { type, blob, filename: respFilename, message } = event.data;
        
        if (type === 'success' && blob && respFilename) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = respFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            if (onSuccess) onSuccess();
        } else {
            console.error("PDF Export failed inside worker:", message);
            if (onError) onError(message || "Worker generation failed");
        }
        
        // CRITICAL: Terminate worker immediately to ensure absolutely NO double triggers or leaks!
        worker.terminate();
    };

    worker.onerror = (err) => {
        console.error("PDF Export worker runtime error:", err);
        if (onError) onError("Worker execution failed");
        
        // CRITICAL: Terminate on error
        worker.terminate();
    };
};

