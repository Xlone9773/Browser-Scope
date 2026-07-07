import { BrowserData, GeoPosition } from '../types';
import { generateFilenameTimestamp } from '../utils/formatters';

export const exportAsJson = (
    data: BrowserData, 
    permStatus: Record<string, string>, 
    geoData: GeoPosition | null,
    onStart?: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
) => {
    if (onStart) onStart();

    const timestampStr = generateFilenameTimestamp();
    const filename = `browserscope-${timestampStr}.json`;

    // Instantiate a dedicated worker on-the-fly for the JSON export
    const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });

    // Post data to web worker with type: 'json'
    worker.postMessage({
        type: 'json',
        data,
        permStatus,
        geoData,
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
            console.error("JSON Export failed inside worker:", message);
            if (onError) onError(message || "Worker generation failed");
        }
        
        // Terminate worker immediately to avoid leaks
        worker.terminate();
    };

    worker.onerror = (err) => {
        console.error("JSON Export worker runtime error:", err);
        if (onError) onError("Worker execution failed");
        worker.terminate();
    };
};

export const exportAsPdf = (
    data: BrowserData,
    permStatus: Record<string, string>,
    geoData: GeoPosition | null,
    t: any,
    lang: string,
    onStart?: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
) => {
    if (onStart) onStart();

    const timestampStr = generateFilenameTimestamp();
    const filename = `browserscope-${timestampStr}.pdf`;

    // Instantiate a dedicated worker on-the-fly for this task
    const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });

    // Post data to web worker with type: 'pdf' and selected language
    worker.postMessage({
        type: 'pdf',
        data,
        permStatus,
        geoData,
        t,
        filename,
        lang
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
        
        // Terminate worker immediately to avoid leaks
        worker.terminate();
    };

    worker.onerror = (err) => {
        console.error("PDF Export worker runtime error:", err);
        if (onError) onError("Worker execution failed");
        worker.terminate();
    };
};
