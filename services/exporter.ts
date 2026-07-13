import { generatePdfBlob } from "./pdf";
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

    try {
        const cleanData = JSON.parse(JSON.stringify(data));
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
        const link = document.createElement('a');
        link.classList.add("notranslate");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (onSuccess) onSuccess();
    } catch (err: any) {
        console.error("JSON Export failed:", err);
        if (onError) onError(err?.message || "Failed to stringify JSON data");
    }
};


export const exportAsPdf = async (
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

    try {
        const pdfBlob = await generatePdfBlob({
            data,
            permStatus,
            geoData,
            t,
            filename,
            lang,
            format
        });
        
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.classList.add("notranslate");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (onSuccess) onSuccess();
    } catch (error: any) {
        console.error("PDF Export failed:", error);
        
        const errMessage = error?.message || "PDF generation failed";
        const errStack = error?.stack || "No stack trace available";
        
        if (onError) onError(`${errMessage}\n\nStack:\n${errStack}`);
    }
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
            dataUrl = await htmlToImage.toPng(element, {
                backgroundColor,
                pixelRatio: scale || 2, // Retinal high resolution
                style: {
                    transform: 'none',
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
            });
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
            link.classList.add("notranslate");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

