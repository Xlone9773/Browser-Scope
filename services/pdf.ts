// @ts-ignore
import { jsPDF } from "jspdf/dist/jspdf.umd.min.js";
import { BrowserData, GeoPosition, ExportPayload } from "../types";

interface ExportWorkerMessage {
    type?: "pdf" | "json";
    data: BrowserData;
    permStatus: Record<string, string>;
    geoData: GeoPosition | null;
    t: {
        sections?: {
            system?: string;
            hardware?: string;
            display?: string;
            network?: string;
            fingerprints?: string;
            ai_compute?: string;
            storage?: string;
            media_sup?: string;
        };
        system?: { title?: string };
        hardware?: { title?: string };
        display?: { title?: string };
        network?: { title?: string };
        fingerprints?: { title?: string };
    };
    filename: string;
    lang?: string;
    format?: 'a4' | 'letter' | 'legal';
}

const CACHE_NAME = "browserscope-fonts";
const FONT_KEYS: Record<string, string> = {
    "ru": "roboto",
    "zh-CN": "zcoolxiaowei",
    "zh-TW": "zcoolxiaowei",
    "zh-HK": "zcoolxiaowei",
    "ja": "sawarabigothic"
};

const FONT_MIRRORS: Record<string, string[]> = {
    "ru": [
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf"
    ],
    "zh-CN": [
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf",
        "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"
    ],
    "zh-TW": [
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf",
        "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"
    ],
    "zh-HK": [
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf",
        "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"
    ],
    "ja": [
        "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf",
        "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf"
    ]
};

const LOCAL_TRANS: Record<string, Record<string, string>> = {
    en: {
        report_title: "BrowserScope Diagnostic Report",
        generated: "Generated",
        secure_context: "Secure HTTPS Context",
        trust_score: "Trust Score",
        level: "Level",
        permissions: "Permissions",
        geolocation_data: "Geolocation Data",
        user_agent: "",
        pwa_installed: "PWA Installed",
        cookies_enabled: "Cookies Enabled",
        yes: "Yes",
        no: "No",
        unknown: "Unknown",
        charging: "Charging",
        discharging_unknown: "Discharging/Unknown",
        screen_res: "Screen Resolution",
        avail_size: "Available Size",
        window_size: "Window Size",
        pixel_ratio: "Pixel Ratio",
        color_depth: "Color Depth",
        hdr_support: "HDR Support",
        supported: "Supported",
        not_detected: "Not Detected",
        online_status: "Online Status",
        conn_type: "Connection Type",
        downlink_max: "Downlink Max",
        rtt_latency: "RTT Latency",
        webrtc_ip: "WebRTC Local IP",
        canvas_hash: "Canvas Fingerprint Hash",
        webgl_hash: "WebGL Fingerprint Hash",
        adblocker: "AdBlocker",
        bot_diagnostic: "Bot Diagnostic",
        gpc_enabled: "GPC Enabled",
        secure_context_lbl: "Secure Context",
        active: "Active",
        inactive: "Inactive",
        suspicious_bot: "Suspicious ",
        pass_human: "Pass ",
        // AI
        ai_title: "AI & Computational Readiness",
        wasm_support: "WebAssembly Support",
        wasm_simd: "Wasm SIMD",
        webnn: "WebNN API",
        window_ai: "Window AI",
        webgpu_compute: "WebGPU Compute",
        ai_score: "AI Performance Score",
        ai_flops: "AI FLOPs",
        ai_level: "Capability Level",
        // Storage
        storage_title: "Storage Status",
        storage_quota: "Quota Limit",
        storage_usage: "Storage Usage",
        storage_persisted: "Storage Persisted",
        // Localization
        loc_title: "Localization & Internationalization",
        time_zone: "Time Zone",
        locale: "Locale",
        calendar: "Calendar System",
        numbering: "Numbering System",
        intl_support: "Intl API Support",
        // Media
        media_title: "Media Capabilities",
        speech_voices: "Speech Synthesis Voices",
        audio_channels: "Audio Output Channels",
        video_codecs: "Video Codecs Supported",
        audio_codecs: "Audio Codecs Supported",
        image_formats: "Image Formats Supported",
        drm_systems: "DRM Systems Status"
    },
    "zh-CN": {
        report_title: "BrowserScope 浏览器安全与硬件诊断报告",
        generated: "生成时间",
        secure_context: "安全网络环境 ",
        trust_score: "信任评分",
        level: "评级级别",
        permissions: "系统权限",
        geolocation_data: "地理定位数据",
        user_agent: "浏览器 ",
        pwa_installed: "渐进式应用安装",
        cookies_enabled: "Cookie 启用状态",
        yes: "已启用/是",
        no: "未启用/否",
        unknown: "未知",
        charging: "充电中",
        discharging_unknown: "放电中/未知",
        screen_res: "屏幕分辨率",
        avail_size: "可用工作区大小",
        window_size: "窗口大小",
        pixel_ratio: "像素设备比例",
        color_depth: "色彩深度",
        hdr_support: "HDR 高动态范围支持",
        supported: "支持",
        not_detected: "未检测到/不支持",
        online_status: "在线状态",
        conn_type: "网络连接类型",
        downlink_max: "下行最大带宽",
        rtt_latency: "RTT 往返时延",
        webrtc_ip: "WebRTC 局域网 IP 地址",
        canvas_hash: "Canvas 画布指纹哈希",
        webgl_hash: "WebGL 绘图指纹哈希",
        adblocker: "广告拦截器",
        bot_diagnostic: "自动化脚本诊断",
        gpc_enabled: "GPC 全局隐私控制",
        secure_context_lbl: "安全上下文安全级别",
        active: "运行中/已拦截",
        inactive: "未运行",
        suspicious_bot: "异常 (疑似爬虫自动化)",
        pass_human: "正常 (真实用户访问)",
        // AI
        ai_title: "AI 与计算就绪度",
        wasm_support: "WebAssembly 支持",
        wasm_simd: "Wasm SIMD 加速",
        webnn: "WebNN API ",
        window_ai: "Window AI 浏览器原生大模型",
        webgpu_compute: "WebGPU 通用计算支持",
        ai_score: "AI 性能跑分",
        ai_flops: "估计浮点运算性能",
        ai_level: "算力分级评估",
        // Storage
        storage_title: "本地存储空间状态",
        storage_quota: "存储总容量限制",
        storage_usage: "已使用存储空间",
        storage_persisted: "持久化存储状态",
        // Localization
        loc_title: "本地化与国际化配置",
        time_zone: "系统时区",
        locale: "系统区域设置",
        calendar: "默认日历系统",
        numbering: "数字计数法系统",
        intl_support: "Intl 国际化 API 支持",
        // Media
        media_title: "多媒体格式支持度",
        speech_voices: "语音合成语音包数量",
        audio_channels: "音频最大输出声道",
        video_codecs: "支持的视频编解码器",
        audio_codecs: "支持的音频编解码器",
        image_formats: "支持的图片格式",
        drm_systems: "数字版权管理  支持"
    },
    "zh-TW": {
        report_title: "BrowserScope 瀏覽器安全與硬體診斷報告",
        generated: "生成時間",
        secure_context: "安全網路環境 ",
        trust_score: "信任評分",
        level: "評級級別",
        permissions: "系統權限",
        geolocation_data: "地理定位數據",
        user_agent: "瀏覽器 ",
        pwa_installed: "漸進式應用安裝",
        cookies_enabled: "Cookie 啟用狀態",
        yes: "已啟用/是",
        no: "未啟用/否",
        unknown: "未知",
        charging: "充電中",
        discharging_unknown: "放電中/未知",
        screen_res: "螢幕解析度",
        avail_size: "可用工作區大小",
        window_size: "視窗大小",
        pixel_ratio: "像素設備比例",
        color_depth: "色彩深度",
        hdr_support: "HDR 高動態範圍支援",
        supported: "支援",
        not_detected: "未檢測到/不支援",
        online_status: "在線狀態",
        conn_type: "網路連接類型",
        downlink_max: "下行最大頻寬",
        rtt_latency: "RTT 往返時延",
        webrtc_ip: "WebRTC 局域網 IP 地址",
        canvas_hash: "Canvas 画布指紋哈希",
        webgl_hash: "WebGL 繪圖指紋哈希",
        adblocker: "廣告攔截器",
        bot_diagnostic: "自動化腳本診斷",
        gpc_enabled: "GPC 全局隱私控制",
        secure_context_lbl: "安全上下文安全級別",
        active: "運行中/已攔截",
        inactive: "未運行",
        suspicious_bot: "異常 (疑似爬蟲自動化)",
        pass_human: "正常 (真實用戶訪問)",
        // AI
        ai_title: "AI 與計算就緒度",
        wasm_support: "WebAssembly 支援",
        wasm_simd: "Wasm SIMD 加速",
        webnn: "WebNN API (神經網路)",
        window_ai: "Window AI 瀏覽器原生大模型",
        webgpu_compute: "WebGPU 通用計算支援",
        ai_score: "AI 性能跑分",
        ai_flops: "估計浮點運算性能",
        ai_level: "算力分級評估",
        // Storage
        storage_title: "本地儲存空間狀態",
        storage_quota: "儲存總容量限制",
        storage_usage: "已使用儲存空間",
        storage_persisted: "持久化儲存狀態",
        // Localization
        loc_title: "本地化與國際化配置",
        time_zone: "系統時區",
        locale: "系統區域設置",
        calendar: "默認日曆系統",
        numbering: "數字計數法系統",
        intl_support: "Intl 國際化 API 支援",
        // Media
        media_title: "多媒體格式支援度",
        speech_voices: "語音合成語音包數量",
        audio_channels: "音訊最大輸出聲道",
        video_codecs: "支援的視訊編解碼器",
        audio_codecs: "支援的音訊編解碼器",
        image_formats: "支援的圖片格式",
        drm_systems: "數位版權管理  支援"
    },
    "zh-HK": {
        report_title: "BrowserScope 瀏覽器安全與硬件診斷報告",
        generated: "生成時間",
        secure_context: "安全網絡環境 ",
        trust_score: "信任評分",
        level: "評級級別",
        permissions: "系統權限",
        geolocation_data: "地理定位數據",
        user_agent: "瀏覽器 ",
        pwa_installed: "漸進式應用安裝",
        cookies_enabled: "Cookie 啟用狀態",
        yes: "已啟用/是",
        no: "未啟用/否",
        unknown: "未知",
        charging: "充電中",
        discharging_unknown: "放電中/未知",
        screen_res: "螢幕解析度",
        avail_size: "可用工作區大小",
        window_size: "視窗大小",
        pixel_ratio: "像素設備比例",
        color_depth: "色彩深度",
        hdr_support: "HDR 高動態範圍支援",
        supported: "支援",
        not_detected: "未檢測到/不支援",
        online_status: "在線狀態",
        conn_type: "網絡連接類型",
        downlink_max: "下行最大頻寬",
        rtt_latency: "RTT 往返時延",
        webrtc_ip: "WebRTC 局域網 IP 地址",
        canvas_hash: "Canvas 画布指紋哈希",
        webgl_hash: "WebGL 繪圖指紋哈希",
        adblocker: "廣告攔截器",
        bot_diagnostic: "自動化腳本診斷",
        gpc_enabled: "GPC 全局隱私控制",
        secure_context_lbl: "安全上下文安全級別",
        active: "運行中/已攔截",
        inactive: "未運行",
        suspicious_bot: "異常 (疑似爬蟲自動化)",
        pass_human: "正常 (真實用戶訪問)",
        // AI
        ai_title: "AI 與計算就緒度",
        wasm_support: "WebAssembly 支援",
        wasm_simd: "Wasm SIMD 加速",
        webnn: "WebNN API (神經網絡)",
        window_ai: "Window AI 瀏覽器原生大模型",
        webgpu_compute: "WebGPU 通用計算支援",
        ai_score: "AI 性能跑分",
        ai_flops: "估計浮點運算性能",
        ai_level: "算力分級評估",
        // Storage
        storage_title: "本地儲存空間狀態",
        storage_quota: "儲存總容量限制",
        storage_usage: "已使用儲存空間",
        storage_persisted: "持久化儲存狀態",
        // Localization
        loc_title: "本地化與國際化配置",
        time_zone: "系統時區",
        locale: "系統區域設置",
        calendar: "默認日曆系統",
        numbering: "數字計數法系統",
        intl_support: "Intl 國際化 API 支援",
        // Media
        media_title: "多媒體格式支援度",
        speech_voices: "語音合成語音包數量",
        audio_channels: "音訊最大輸出聲道",
        video_codecs: "支援的視訊編解碼器",
        audio_codecs: "支援的音訊編解碼器",
        image_formats: "支援的圖片格式",
        drm_systems: "數位版權管理  支援"
    },
    ja: {
        report_title: "BrowserScope ブラウザ診断＆ハードウェア分析レポート",
        generated: "生成日時",
        secure_context: "セキュアな環境 ",
        trust_score: "信頼スコア",
        level: "評価レベル",
        permissions: "システム権限設定",
        geolocation_data: "位置情報データ",
        user_agent: "ブラウザ ",
        pwa_installed: "PWA アプリのインストール",
        cookies_enabled: "Cookie 有効化",
        yes: "有効/はい",
        no: "無効/いいえ",
        unknown: "不明",
        charging: "充電中",
        discharging_unknown: "放電中/不明",
        screen_res: "画面解像度",
        avail_size: "利用可能ディスプレイ領域",
        window_size: "ウィンドウサイズ",
        pixel_ratio: "デバイスピクセル比",
        color_depth: "色深度",
        hdr_support: "HDR サポート",
        supported: "対応",
        not_detected: "未検出/非対応",
        online_status: "オンライン状態",
        conn_type: "接続タイプ",
        downlink_max: "最大ダウンロード速度",
        rtt_latency: "RTT 往復遅延時間",
        webrtc_ip: "WebRTC ローカル IP",
        canvas_hash: "Canvas フィンガープリント",
        webgl_hash: "WebGL フィンガープリント",
        adblocker: "広告ブロック",
        bot_diagnostic: "自動化ツール検出",
        gpc_enabled: "GPC プライバシー制御",
        secure_context_lbl: "セキュアコンテキスト",
        active: "有効/ブロック済み",
        inactive: "無効",
        suspicious_bot: "異常 (自動化ツールの疑い)",
        pass_human: "正常 (人間のアクセス)",
        // AI
        ai_title: "AI と計算能力の診断",
        wasm_support: "WebAssembly サポート",
        wasm_simd: "Wasm SIMD アクセラレーション",
        webnn: "WebNN API",
        window_ai: "Window AI ブラウザ内蔵モデル",
        webgpu_compute: "WebGPU コンピュート",
        ai_score: "AI 性能測定スコア",
        ai_flops: "推定浮点演算性能",
        ai_level: "算力レベル評価",
        // Storage
        storage_title: "ローカルストレージ状態",
        storage_quota: "ストレージ容量制限",
        storage_usage: "使用中ストレージ容量",
        storage_persisted: "ストレージ永続化",
        // Localization
        loc_title: "ローカルおよび国際化設定",
        time_zone: "システムタイムゾーン",
        locale: "システム言語設定",
        calendar: "カレンダーシステム",
        numbering: "数字表記システム",
        intl_support: "Intl 開発 API サポート",
        // Media
        media_title: "メディアフォーマット対応",
        speech_voices: "音声合成の声の数",
        audio_channels: "音声最大出力チャンネル数",
        video_codecs: "対応ビデオコーデック",
        audio_codecs: "対応オーディオコーデック",
        image_formats: "対応画像フォーマット",
        drm_systems: "デジタル著作権管理 "
    },
    ru: {
        report_title: "Диагностический отчет BrowserScope",
        generated: "Создан",
        secure_context: "Безопасное соединение ",
        trust_score: "Оценка доверия",
        level: "Уровень",
        permissions: "Разрешения системы",
        geolocation_data: "Геолокация",
        user_agent: " браузера",
        pwa_installed: "PWA Установлено",
        cookies_enabled: "Cookies включены",
        yes: "Да",
        no: "Нет",
        unknown: "Неизвестно",
        charging: "Заряжается",
        discharging_unknown: "Разряжается/Неизвестно",
        screen_res: "Разрешение экрана",
        avail_size: "Доступный размер",
        window_size: "Размер окна",
        pixel_ratio: "Пиксельное соотношение",
        color_depth: "Глубина цвета",
        hdr_support: "Поддержка HDR",
        supported: "Поддерживается",
        not_detected: "Не обнаружено",
        online_status: "Статус сети",
        conn_type: "Тип соединения",
        downlink_max: "Макс. скорость",
        rtt_latency: "Задержка RTT",
        webrtc_ip: "Локальный IP WebRTC",
        canvas_hash: "Хэш Canvas",
        webgl_hash: "Хэш WebGL",
        adblocker: "Блокировщик рекламы",
        bot_diagnostic: "Тест на робота",
        gpc_enabled: "Контроль конфиденциальности GPC",
        secure_context_lbl: "Безопасный контекст",
        active: "Активен",
        inactive: "Неактивен",
        suspicious_bot: "Подозрительно (Бот)",
        pass_human: "Пройден (Человек)",
        // AI
        ai_title: "Готовность к ИИ и вычислениям",
        wasm_support: "Поддержка WebAssembly",
        wasm_simd: "Wasm SIMD ускорение",
        webnn: "Интерфейс WebNN API",
        window_ai: "Встроенный ИИ (Window AI)",
        webgpu_compute: "Вычисления WebGPU",
        ai_score: "Оценка ИИ",
        ai_flops: "Оценка производительности",
        ai_level: "Уровень производительности вычислений",
        // Storage
        storage_title: "Статус хранилища данных",
        storage_quota: "Лимит хранилища",
        storage_usage: "Использовано места",
        storage_persisted: "Постоянное хранилище",
        // Localization
        loc_title: "Локализация и международные настройки",
        time_zone: "Часовой пояс",
        locale: "Системная локаль",
        calendar: "Система календаря",
        numbering: "Система счисления",
        intl_support: "Поддержка Intl API",
        // Media
        media_title: "Поддержка медиаформатов",
        speech_voices: "Голоса синтеза речи",
        audio_channels: "Выходные аудиоканалы",
        video_codecs: "Поддерживаемые видеокодеки",
        audio_codecs: "Поддерживаемые аудиокодеки",
        image_formats: "Поддерживаемые форматы изображений",
        drm_systems: "Статус защиты DRM"
    }
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function fetchFontWithFallbacks(lang: string): Promise<ArrayBuffer> {
    const cacheKey = FONT_KEYS[lang];
    if (cacheKey) {
        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(cacheKey);
            if (cachedResponse) {
                const buffer = await cachedResponse.arrayBuffer();
                if (buffer.byteLength > 4) {
                    console.log(`[PDF Worker] Loaded font from Cache Storage: ${cacheKey}`);
                    return buffer;
                }
            }
        } catch (err) {
            console.warn(`[PDF Worker] Failed to check Cache Storage for: ${cacheKey}`, err);
        }
    }

    const urls = FONT_MIRRORS[lang];
    if (!urls || urls.length === 0) {
        throw new Error(`No font URLs defined for language: ${lang}`);
    }

    let lastError: unknown = null;
    for (const url of urls) {
        try {
            let finalUrl = url;
            if (url.startsWith("/")) {
                // Ensure absolute local paths resolve relative to origin in the web worker
                finalUrl = self.location.origin + url;
            }
            const res = await fetch(finalUrl);
            if (res.ok) {
                const buffer = await res.arrayBuffer();
                if (buffer.byteLength > 4) {
                    const view = new DataView(buffer);
                    const tag = view.getUint32(0, false);
                    if (tag === 0x00010000 || tag === 0x4F54544F || tag === 0x74746366) {
                        if (buffer.byteLength > 12) {
                            const bytes = new Uint8Array(buffer, 0, 12);
                            let isCorrupted = false;
                            for (let i = 0; i < bytes.length - 2; i++) {
                                if (bytes[i] === 0xEF && bytes[i+1] === 0xBF && bytes[i+2] === 0xBD) {
                                    isCorrupted = true;
                                    break;
                                }
                            }
                            if (!isCorrupted) {
                                if (cacheKey) {
                                    try {
                                        const cache = await caches.open(CACHE_NAME);
                                        await cache.put(cacheKey, new Response(buffer.slice(0), {
                                            headers: {
                                                'Content-Type': 'font/ttf',
                                                'Content-Length': String(buffer.byteLength)
                                            }
                                        }));
                                        console.log(`[PDF Worker] Cached font to Cache Storage: ${cacheKey}`);
                                    } catch (cacheErr) {
                                        console.warn(`[PDF Worker] Failed to save font to cache: ${cacheKey}`, cacheErr);
                                    }
                                }
                                return buffer;
                            }
                        } else {
                            return buffer;
                        }
                    }
                }
            }
            throw new Error(`HTTP status ${res.status}`);
        } catch (err) {
            console.warn(`[PDF Worker] Failed to fetch font from mirror: ${url}`, err);
            lastError = err;
        }
    }
    throw lastError || new Error("Failed to fetch font from all mirrors");
}

export const generatePdfBlob = async (options: { data: BrowserData; permStatus: Record<string, string>; geoData: GeoPosition | null; t: any; filename: string; lang?: string; format?: "a4" | "letter" | "legal" }): Promise<Blob> => {
    try {
        const { data, permStatus, geoData, t, filename, lang = "en", format = "a4" } = options;

        // Initialize jsPDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: format
        });

        // Use dimensions based on the selected format
        let pageWidth = 210;
        let pageHeight = 297;
        
        if (format === 'letter') {
            pageWidth = 215.9; // 8.5 inch
            pageHeight = 279.4; // 11 inch
        } else if (format === 'legal') {
            pageWidth = 215.9; // 8.5 inch
            pageHeight = 355.6; // 14 inch
        }

        const marginX = 15;
        const contentWidth = pageWidth - (marginX * 2);

        let currentY = 20;
        let activeFontName = "helvetica";

        // Load custom Unicode fonts to support CJK/Cyrillic if non-English
        if (lang !== "en" && FONT_MIRRORS[lang]) {
            try {
                const buf = await fetchFontWithFallbacks(lang);
                const b64 = arrayBufferToBase64(buf);
                doc.addFileToVFS("CustomFont.ttf", b64);
                doc.addFont("CustomFont.ttf", "CustomFont", "normal");
                doc.addFont("CustomFont.ttf", "CustomFont", "bold");
                activeFontName = "CustomFont";
            } catch (e) {
                console.error("[PDF Worker] Failed to load custom font, falling back to helvetica:", e);
            }
        }

        const tLocal = LOCAL_TRANS[lang] || LOCAL_TRANS.en;

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

        // Helper: Draw Header & Footer on each page
        const drawHeaderFooter = () => {
            doc.setFont(activeFontName, "normal");
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
        doc.setFont(activeFontName, "bold");
        doc.setFontSize(14); // slightly smaller to comfortably fit translated long titles
        doc.text(tLocal.report_title, marginX + 8, currentY + 12);

        doc.setFont(activeFontName, "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        const exportTimeStr = new Date().toLocaleString(lang === "zh-CN" || lang === "zh-TW" || lang === "zh-HK" ? "zh-CN" : undefined);
        doc.text(`${tLocal.generated}: ${exportTimeStr}  |  Version: 1.5.0`, marginX + 8, currentY + 20);
        doc.text(`Environment: ${tLocal.secure_context}`, marginX + 8, currentY + 25);

        // Score display inside title card
        const scoreVal = data.fingerprints?.score?.totalScore ?? 100;
        const levelVal = data.fingerprints?.score?.rating ?? "Standard";
        doc.setFillColor(99, 102, 241); // Indigo background for badge
        doc.rect(pageWidth - marginX - 45, currentY + 6, 38, 22, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont(activeFontName, "bold");
        doc.setFontSize(9);
        doc.text(tLocal.trust_score, pageWidth - marginX - 35, currentY + 12);
        doc.setFontSize(12);
        doc.text(`${scoreVal}/100`, pageWidth - marginX - 35, currentY + 18);
        doc.setFontSize(7);
        doc.setFont(activeFontName, "normal");
        doc.text(`${tLocal.level}: ${levelVal}`, pageWidth - marginX - 35, currentY + 23);

        currentY += 45;

        // Define beautiful layout drawers
        const drawSectionHeader = (title: string) => {
            checkPageOverflow(15);
            doc.setFont(activeFontName, "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text(title, marginX, currentY);
            
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.setLineWidth(0.5);
            doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
            currentY += 8;
        };

        const drawGridRow = (label1: string, val1: string, label2?: string, val2?: string) => {
            checkPageOverflow(12);

            // Left Col
            doc.setFillColor(255, 255, 255);
            doc.rect(marginX, currentY, contentWidth / 2 - 2, 10, "F");
            doc.setDrawColor(241, 245, 249); // slate-100
            doc.rect(marginX, currentY, contentWidth / 2 - 2, 10, "S");

            doc.setFont(activeFontName, "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(label1, marginX + 4, currentY + 6);
            doc.setFont(activeFontName, "normal");
            doc.setTextColor(15, 23, 42); // slate-900
            doc.setFontSize(8);
            const cleanVal1 = String(val1).length > 25 ? String(val1).substring(0, 22) + "..." : String(val1);
            doc.text(cleanVal1, marginX + 40, currentY + 6);

            // Right Col (Optional)
            if (label2) {
                doc.setFillColor(255, 255, 255);
                doc.rect(marginX + contentWidth / 2 + 2, currentY, contentWidth / 2 - 2, 10, "F");
                doc.rect(marginX + contentWidth / 2 + 2, currentY, contentWidth / 2 - 2, 10, "S");

                doc.setFont(activeFontName, "bold");
                doc.setTextColor(100, 116, 139);
                doc.text(label2, marginX + contentWidth / 2 + 6, currentY + 6);
                doc.setFont(activeFontName, "normal");
                doc.setTextColor(15, 23, 42);
                const cleanVal2 = String(val2).length > 25 ? String(val2).substring(0, 22) + "..." : String(val2);
                doc.text(cleanVal2, marginX + contentWidth / 2 + 42, currentY + 6);
            }

            currentY += 12;
        };

        const drawFullRow = (label: string, val: string) => {
            checkPageOverflow(14);
            doc.setFillColor(255, 255, 255);
            doc.rect(marginX, currentY, contentWidth, 12, "F");
            doc.setDrawColor(241, 245, 249);
            doc.rect(marginX, currentY, contentWidth, 12, "S");

            doc.setFont(activeFontName, "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(label, marginX + 4, currentY + 7);

            doc.setFont(activeFontName, "normal");
            doc.setFontSize(8);
            doc.setTextColor(15, 23, 42);

            // Wrap text for long lines
            const splitText = doc.splitTextToSize(String(val), contentWidth - 46);
            doc.text(splitText, marginX + 42, currentY + 7);

            currentY += 14;
        };

        // --- 1. SYSTEM INFORMATION ---
        drawSectionHeader(t.sections?.system || t.system?.title || "System Information");
        drawGridRow(
            "OS", data.system?.os || tLocal.unknown,
            "Platform", data.system?.platform || tLocal.unknown
        );
        drawGridRow(
            "Browser", `${data.system?.browserName || tLocal.unknown} ${data.system?.browserVersion || ""}`,
            "Language", data.system?.language || tLocal.unknown
        );
        drawGridRow(
            tLocal.pwa_installed, data.system?.isPwaInstalled ? tLocal.yes : tLocal.no,
            tLocal.cookies_enabled, data.system?.cookiesEnabled ? tLocal.yes : tLocal.no
        );
        
        // Render system permissions
        const cameraPerm = permStatus?.camera || tLocal.unknown;
        const microPerm = permStatus?.microphone || tLocal.unknown;
        const geoPerm = permStatus?.geolocation || tLocal.unknown;
        const notificationsPerm = permStatus?.notifications || tLocal.unknown;
        const permissionsText = `Camera: ${cameraPerm} | Mic: ${microPerm} | Geo: ${geoPerm} | Notify: ${notificationsPerm}`;
        drawFullRow(tLocal.permissions, permissionsText);

        if (geoData) {
            const lat = geoData.latitude?.toFixed(4) ?? "N/A";
            const lon = geoData.longitude?.toFixed(4) ?? "N/A";
            const accuracy = geoData.accuracy?.toFixed(1) ?? "N/A";
            drawFullRow(tLocal.geolocation_data, `Latitude: ${lat}, Longitude: ${lon} (Accuracy: ${accuracy}m)`);
        }

        drawFullRow(tLocal.user_agent, data.system?.userAgent || tLocal.unknown);

        currentY += 4;

        // --- 2. HARDWARE SPECIFICATIONS ---
        drawSectionHeader(t.sections?.hardware || t.hardware?.title || "Hardware Specifications");
        drawGridRow(
            "CPU Cores", String(data.hardware?.cpuCores || tLocal.unknown),
            "Memory", `${data.hardware?.memory || tLocal.unknown} GB`
        );
        drawGridRow(
            "GPU Vendor", data.hardware?.gpuVendor || tLocal.unknown,
            "GPU Renderer", data.hardware?.gpuRenderer || tLocal.unknown
        );
        drawGridRow(
            "Battery Level", data.hardware?.batteryLevel || tLocal.unknown,
            "Battery Status", data.hardware?.isCharging === "Yes" ? tLocal.charging : tLocal.discharging_unknown
        );
        drawGridRow(
            "Touch Points", String(data.hardware?.touchPoints || 0),
            "Audio Rate", `${data.hardware?.audioSampleRate || tLocal.unknown} Hz`
        );

        currentY += 4;

        // --- 3. DISPLAY PROFILE ---
        drawSectionHeader(t.sections?.display || t.display?.title || "Display Profile");
        drawGridRow(
            tLocal.screen_res, data.display?.resolution || tLocal.unknown,
            tLocal.avail_size, data.display?.availableSize || tLocal.unknown
        );
        drawGridRow(
            tLocal.window_size, data.display?.windowSize || tLocal.unknown,
            tLocal.pixel_ratio, String(data.display?.pixelRatio || 1),
        );
        drawGridRow(
            tLocal.color_depth, `${data.display?.colorDepth || 24}-bit`,
            tLocal.hdr_support, data.display?.hdr ? tLocal.supported : tLocal.not_detected
        );

        currentY += 4;

        // --- 4. NETWORK DIAGNOSTICS ---
        drawSectionHeader(t.sections?.network || t.network?.title || "Network Diagnostics");
        drawGridRow(
            tLocal.online_status, data.network?.online ? tLocal.yes : tLocal.no,
            tLocal.conn_type, data.network?.effectiveType || tLocal.unknown
        );
        drawGridRow(
            tLocal.downlink_max, data.network?.downlinkMax || tLocal.unknown,
            tLocal.rtt_latency, `${data.network?.rtt || tLocal.unknown} ms`
        );
        drawFullRow(tLocal.webrtc_ip, data.network?.webrtcIp || tLocal.not_detected);

        currentY += 4;

        // --- 5. FINGERPRINTS & SECURITY ---
        drawSectionHeader(t.sections?.fingerprints || t.fingerprints?.title || "Fingerprints & Security");
        drawFullRow(tLocal.canvas_hash, data.fingerprints?.canvasHash || tLocal.not_detected);
        drawFullRow(tLocal.webgl_hash, data.fingerprints?.webglHash || tLocal.not_detected);
        
        const adBlockStatus = data.security?.adBlockEnabled ? tLocal.active : tLocal.inactive;
        const botCheck = data.security?.isBot ? tLocal.suspicious_bot : tLocal.pass_human;
        drawGridRow(
            tLocal.adblocker, adBlockStatus,
            tLocal.bot_diagnostic, botCheck
        );
        drawGridRow(
            tLocal.gpc_enabled, data.security?.gpcEnabled ? tLocal.yes : tLocal.no,
            tLocal.secure_context_lbl, data.security?.secureContext ? tLocal.yes : tLocal.no
        );

        currentY += 4;

        // --- 6. AI & COMPUTATIONAL READINESS ---
        drawSectionHeader(t.sections?.ai_compute || tLocal.ai_title);
        drawGridRow(
            tLocal.wasm_support, data.ai?.wasmSupport ? tLocal.yes : tLocal.no,
            tLocal.wasm_simd, data.ai?.wasmSimd ? tLocal.yes : tLocal.no
        );
        drawGridRow(
            tLocal.webnn, data.ai?.webnn ? tLocal.yes : tLocal.no,
            tLocal.window_ai, data.ai?.windowAi ? tLocal.yes : tLocal.no
        );
        drawGridRow(
            tLocal.webgpu_compute, data.ai?.webgpuCompute ? tLocal.yes : tLocal.no,
            tLocal.ai_level, data.ai?.readiness?.level || tLocal.unknown
        );
        drawGridRow(
            tLocal.ai_score, String(data.ai?.readiness?.score || 0),
            tLocal.ai_flops, `${(data.ai?.readiness?.flops || 0).toFixed(1)} GFLOPS`
        );

        currentY += 4;

        // --- 7. STORAGE STATUS ---
        drawSectionHeader(t.sections?.storage || tLocal.storage_title);
        drawGridRow(
            tLocal.storage_quota, data.storage?.quota || tLocal.unknown,
            tLocal.storage_usage, data.storage?.usage || tLocal.unknown
        );
        drawGridRow(
            tLocal.storage_persisted, data.storage?.persisted ? tLocal.yes : tLocal.no
        );

        currentY += 4;

        // --- 8. LOCALIZATION & INTERNATIONALIZATION ---
        drawSectionHeader(tLocal.loc_title);
        drawGridRow(
            tLocal.time_zone, data.localization?.timeZone || tLocal.unknown,
            tLocal.locale, data.localization?.locale || tLocal.unknown
        );
        drawGridRow(
            tLocal.calendar, data.localization?.calendar || tLocal.unknown,
            tLocal.numbering, data.localization?.numberingSystem || tLocal.unknown
        );
        
        const intl = data.localization?.intlSupport;
        if (intl) {
            const intlKeys = [];
            if (intl.listFormat) intlKeys.push("ListFormat");
            if (intl.relativeTimeFormat) intlKeys.push("RelativeTime");
            if (intl.displayNames) intlKeys.push("DisplayNames");
            if (intl.segmenter) intlKeys.push("Segmenter");
            if (intl.pluralRules) intlKeys.push("PluralRules");
            if (intl.collator) intlKeys.push("Collator");
            drawFullRow(tLocal.intl_support, intlKeys.join(", ") || tLocal.not_detected);
        }

        currentY += 4;

        // --- 9. MEDIA CAPABILITIES ---
        drawSectionHeader(t.sections?.media_sup || tLocal.media_title);
        drawGridRow(
            tLocal.speech_voices, String(data.media?.speechVoices || 0),
            tLocal.audio_channels, String(data.media?.audioChannels || 2)
        );

        const supportedVideoCount = data.media?.video?.filter(c => c.supported).length || 0;
        const totalVideoCount = data.media?.video?.length || 0;
        const supportedAudioCount = data.media?.audio?.filter(c => c.supported).length || 0;
        const totalAudioCount = data.media?.audio?.length || 0;
        const supportedImageCount = data.media?.images?.filter(c => c.supported).length || 0;
        const totalImageCount = data.media?.images?.length || 0;

        drawGridRow(
            tLocal.video_codecs, `${supportedVideoCount}/${totalVideoCount} ${tLocal.supported}`,
            tLocal.audio_codecs, `${supportedAudioCount}/${totalAudioCount} ${tLocal.supported}`
        );
        drawGridRow(
            tLocal.image_formats, `${supportedImageCount}/${totalImageCount} ${tLocal.supported}`
        );

        const drmSummary = data.media?.drm?.map(d => `${d.name}: ${d.supported ? tLocal.yes : tLocal.no}`).join(" | ");
        if (drmSummary) {
            drawFullRow(tLocal.drm_systems, drmSummary);
        }

        // Draw Header & Footer for all pages that were created
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            drawHeaderFooter();
        }

        // Generate PDF as Blob
        const pdfBlob = doc.output("blob");
        
        return pdfBlob;
    } catch (err: unknown) {
        throw err;
    }
};
