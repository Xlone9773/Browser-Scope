import { BrowserData, GeoPosition } from '../types';
import { Translation } from '../utils/i18n/types';
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
    t: Translation,
    lang: string,
    format: 'a4' | 'letter' | 'legal',
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
        lang,
        format
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

// Remove unused function sanitizeCssForSvg

export const exportAsImage = async (
    containerId: string,
    theme: string,
    scale: number,
    onStart?: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
) => {
    if (onStart) onStart();

    const timestampStr = generateFilenameTimestamp();
    const filename = `browserscope-${timestampStr}.png`;

    try {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Element with id "${containerId}" not found`);
        }

        const htmlToImage = await import("html-to-image");

        // Use standard html-to-image to generate the snapshot
        const isDark = document.documentElement.classList.contains("dark") || theme === "dark";
        const backgroundColor = isDark ? "#0f172a" : "#f8fafc";
        
        // Suppress specific html-to-image console.error messages about cross-origin stylesheets
        const originalConsoleError = console.error;
        console.error = (...args: unknown[]) => {
            if (typeof args[0] === 'string' && (
                args[0].includes('Error inlining remote css file') ||
                args[0].includes('Error loading remote stylesheet') ||
                args[0].includes('Error while reading CSS rules from')
            )) {
                return; // Ignore html-to-image CORS stylesheet errors
            }
            originalConsoleError.apply(console, args);
        };

        let dataUrl;
        try {
            // Helper to determine if a stylesheet is cross-origin
            const isCrossOrigin = (href: string | null) => {
                if (!href) return false;
                try {
                    const url = new URL(href, window.location.origin);
                    return url.origin !== window.location.origin;
                } catch {
                    return true;
                }
            };

            dataUrl = await htmlToImage.toPng(element, {
                backgroundColor,
                pixelRatio: scale || 2, // Retinal high resolution
                style: {
                    transform: 'none',
                },
                styleSheetsFilter: (sheet: CSSStyleSheet) => {
                    // Ignore cross-origin stylesheets to avoid security errors and "Failed to fetch" exceptions
                    return !isCrossOrigin(sheet.href);
                },
                filter: (node: HTMLElement) => {
                    // Ignore elements that shouldn't be captured
                    if (node?.hasAttribute && node.hasAttribute('data-html2canvas-ignore')) {
                        return false;
                    }
                    if (node?.classList && node.classList.contains('html2canvas-ignore')) {
                        return false;
                    }
                    return true;
                }
            } as any);
        } finally {
            // Restore console.error
            console.error = originalConsoleError;
        }

        // Convert base64 dataUrl to Blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        
        triggerDownload(blob, filename);
        if (onSuccess) onSuccess();

    } catch (error: unknown) {
        console.error("[ImageExport] Export exception thrown:", error);
        const errMsg = error instanceof Error ? error.message : "Failed to trigger image export";
        if (onError) onError(errMsg);
    }
};

/**
 * Triggers a browser-compliant silent file download of the generated binary blob.
 */
const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

