import { jsPDF } from "jspdf";
import { BrowserData, GeoPosition } from "../types";

interface ExportPdfMessage {
    data: BrowserData;
    permStatus: Record<string, string>;
    geoData: GeoPosition | null;
    t: any;
    filename: string;
}

self.onmessage = async (event: MessageEvent<ExportPdfMessage>) => {
    try {
        const { data, permStatus, geoData, t, filename } = event.data;

        // Initialize jsPDF (A4 size: 210mm x 297mm, units: mm)
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const marginX = 15;
        const contentWidth = pageWidth - (marginX * 2); // 180mm

        let currentY = 20;

        // Helper: Check page overflow and add page if necessary
        const checkPageOverflow = (heightNeeded: number) => {
            if (currentY + heightNeeded > pageHeight - 25) {
                doc.addPage();
                drawPageBackground();
                drawHeaderFooter();
                currentY = 25; // Reset to top margin
            }
        };

        // Helper: Draw decorative background gradients / styles
        const drawPageBackground = () => {
            // Soft background
            doc.setFillColor(248, 250, 252); // slate-50
            doc.rect(0, 0, pageWidth, pageHeight, "F");

            // Corner decorative accent
            doc.setFillColor(99, 102, 241); // indigo-500
            doc.rect(0, 0, 4, pageHeight, "F");
        };

        // Helper: Draw Header & Footer on each page except cover if we want a cover
        const drawHeaderFooter = () => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate-400

            // Top Header Line
            doc.text("BrowserScope Diagnostics", marginX, 10);
            doc.line(marginX, 12, pageWidth - marginX, 12);

            // Bottom Footer Line
            doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
            doc.text("https://browserscope.dev", marginX, pageHeight - 8);
            
            // Page number
            const pageCount = doc.getNumberOfPages();
            doc.text(`Page ${pageCount}`, pageWidth - marginX - 10, pageHeight - 8);
        };

        // Draw background for Page 1
        drawPageBackground();

        // --- TITLE SECTION ---
        doc.setFillColor(15, 23, 42); // slate-900 (Deep elegant card)
        doc.rect(marginX, currentY, contentWidth, 35, "F");

        // Decorative inner accent
        doc.setFillColor(99, 102, 241); // Indigo
        doc.rect(marginX, currentY, 3, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("BrowserScope Diagnostic Report", marginX + 8, currentY + 12);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // slate-400
        const exportTimeStr = new Date().toLocaleString();
        doc.text(`Generated: ${exportTimeStr}  |  Version: 1.5.0`, marginX + 8, currentY + 19);
        doc.text(`Environment: Secure HTTPS Context`, marginX + 8, currentY + 24);

        // Score display inside title card
        const scoreVal = data.fingerprints?.score?.totalScore ?? 100;
        const levelVal = data.fingerprints?.score?.rating ?? "Standard";
        doc.setFillColor(99, 102, 241); // Indigo background for badge
        doc.rect(pageWidth - marginX - 45, currentY + 6, 38, 22, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Trust Score", pageWidth - marginX - 34, currentY + 12);
        doc.setFontSize(14);
        doc.text(`${scoreVal}/100`, pageWidth - marginX - 35, currentY + 19);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Level: ${levelVal}`, pageWidth - marginX - 34, currentY + 24);

        currentY += 45;

        // Define a beautiful row component
        const drawSectionHeader = (title: string) => {
            checkPageOverflow(15);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text(title, marginX, currentY);
            
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.setLineWidth(0.5);
            doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
            currentY += 8;
        };

        const drawGridRow = (label1: string, val1: string, label2: string, val2: string) => {
            checkPageOverflow(12);

            // Left Col
            doc.setFillColor(255, 255, 255);
            doc.rect(marginX, currentY, contentWidth / 2 - 2, 10, "F");
            doc.setDrawColor(241, 245, 249); // slate-100
            doc.rect(marginX, currentY, contentWidth / 2 - 2, 10, "S");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(label1, marginX + 4, currentY + 6);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(15, 23, 42); // slate-900
            doc.setFontSize(8);
            const cleanVal1 = String(val1).length > 25 ? String(val1).substring(0, 22) + "..." : String(val1);
            doc.text(cleanVal1, marginX + 40, currentY + 6);

            // Right Col
            doc.setFillColor(255, 255, 255);
            doc.rect(marginX + contentWidth / 2 + 2, currentY, contentWidth / 2 - 2, 10, "F");
            doc.rect(marginX + contentWidth / 2 + 2, currentY, contentWidth / 2 - 2, 10, "S");

            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 116, 139);
            doc.text(label2, marginX + contentWidth / 2 + 6, currentY + 6);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(15, 23, 42);
            const cleanVal2 = String(val2).length > 25 ? String(val2).substring(0, 22) + "..." : String(val2);
            doc.text(cleanVal2, marginX + contentWidth / 2 + 42, currentY + 6);

            currentY += 12;
        };

        const drawFullRow = (label: string, val: string) => {
            checkPageOverflow(14);
            doc.setFillColor(255, 255, 255);
            doc.rect(marginX, currentY, contentWidth, 12, "F");
            doc.setDrawColor(241, 245, 249);
            doc.rect(marginX, currentY, contentWidth, 12, "S");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(label, marginX + 4, currentY + 7);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(15, 23, 42);

            // Wrap text for long lines
            const splitText = doc.splitTextToSize(String(val), contentWidth - 46);
            doc.text(splitText, marginX + 42, currentY + 7);

            currentY += 14;
        };

        // --- 1. SYSTEM INFORMATION ---
        drawSectionHeader(t.system?.title || "System Information");
        drawGridRow(
            "OS", data.system?.os || "Unknown",
            "Platform", data.system?.platform || "Unknown"
        );
        drawGridRow(
            "Browser", `${data.system?.browserName || "Unknown"} ${data.system?.browserVersion || ""}`,
            "Language", data.system?.language || "Unknown"
        );
        drawGridRow(
            "PWA Installed", data.system?.isPwaInstalled ? "Yes" : "No",
            "Cookies Enabled", data.system?.cookiesEnabled ? "Yes" : "No"
        );
        
        // Render system permissions
        const cameraPerm = permStatus?.camera || "Unknown";
        const microPerm = permStatus?.microphone || "Unknown";
        const geoPerm = permStatus?.geolocation || "Unknown";
        const notificationsPerm = permStatus?.notifications || "Unknown";
        const permissionsText = `Camera: ${cameraPerm} | Mic: ${microPerm} | Geo: ${geoPerm} | Notify: ${notificationsPerm}`;
        drawFullRow("Permissions", permissionsText);

        if (geoData) {
            const lat = geoData.latitude?.toFixed(4) ?? "N/A";
            const lon = geoData.longitude?.toFixed(4) ?? "N/A";
            const accuracy = geoData.accuracy?.toFixed(1) ?? "N/A";
            drawFullRow("Geolocation Data", `Latitude: ${lat}, Longitude: ${lon} (Accuracy: ${accuracy}m)`);
        }

        drawFullRow("User Agent", data.system?.userAgent || "Unknown");

        currentY += 4;

        // --- 2. HARDWARE SPECIFICATIONS ---
        drawSectionHeader(t.hardware?.title || "Hardware Specifications");
        drawGridRow(
            "CPU Cores", String(data.hardware?.cpuCores || "Unknown"),
            "Memory", `${data.hardware?.memory || "Unknown"} GB`
        );
        drawGridRow(
            "GPU Vendor", data.hardware?.gpuVendor || "Unknown",
            "GPU Renderer", data.hardware?.gpuRenderer || "Unknown"
        );
        drawGridRow(
            "Battery Level", data.hardware?.batteryLevel || "Unknown",
            "Battery Status", data.hardware?.isCharging === "Yes" ? "Charging" : "Discharging/Unknown"
        );
        drawGridRow(
            "Touch Points", String(data.hardware?.touchPoints || 0),
            "Audio Rate", `${data.hardware?.audioSampleRate || "Unknown"} Hz`
        );

        currentY += 4;

        // --- 3. DISPLAY PROFILE ---
        drawSectionHeader(t.display?.title || "Display Profile");
        drawGridRow(
            "Screen Resolution", data.display?.resolution || "Unknown",
            "Available Size", data.display?.availableSize || "Unknown"
        );
        drawGridRow(
            "Window Size", data.display?.windowSize || "Unknown",
            "Pixel Ratio", String(data.display?.pixelRatio || 1),
        );
        drawGridRow(
            "Color Depth", `${data.display?.colorDepth || 24}-bit`,
            "HDR Support", data.display?.hdr ? "Supported" : "Not Detected"
        );

        currentY += 4;

        // --- 4. NETWORK DIAGNOSTICS ---
        drawSectionHeader(t.network?.title || "Network Diagnostics");
        drawGridRow(
            "Online Status", data.network?.online ? "Online" : "Offline",
            "Connection Type", data.network?.effectiveType || "Unknown"
        );
        drawGridRow(
            "Downlink Max", data.network?.downlinkMax || "Unknown",
            "RTT Latency", `${data.network?.rtt || "Unknown"} ms`
        );
        drawFullRow("WebRTC Local IP", data.network?.webrtcIp || "Permission required or not detected");

        currentY += 4;

        // --- 5. FINGERPRINTS & SECURITY ---
        drawSectionHeader(t.fingerprints?.title || "Fingerprints & Security");
        drawFullRow("Canvas Fingerprint Hash", data.fingerprints?.canvasHash || "Not Generated");
        drawFullRow("WebGL Fingerprint Hash", data.fingerprints?.webglHash || "Not Generated");
        
        // Barcode / Advanced features count
        const adBlockStatus = data.security?.adBlockEnabled ? "Active" : "Inactive";
        const botCheck = data.security?.isBot ? "Suspicious (Bot)" : "Pass (Human)";
        drawGridRow(
            "AdBlocker", adBlockStatus,
            "Bot Diagnostic", botCheck
        );
        drawGridRow(
            "GPC Enabled", data.security?.gpcEnabled ? "Yes" : "No",
            "Secure Context", data.security?.secureContext ? "Yes" : "No"
        );

        // Draw Header & Footer for all pages that were created
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            drawHeaderFooter();
        }

        // Generate PDF as Blob
        const pdfBlob = doc.output("blob");

        // Send back to the main thread
        self.postMessage({ type: "success", blob: pdfBlob, filename });
    } catch (err: any) {
        self.postMessage({ type: "error", message: err?.message || "PDF generation worker error" });
    }
};
