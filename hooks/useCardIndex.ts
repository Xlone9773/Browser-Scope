import { useMemo } from 'react';
import { BrowserData } from '../types';
import { Translation } from '../utils/i18n/types';

export function useCardIndex(browserData: BrowserData | null, t: Translation) {
    return useMemo(() => {
        if (!browserData || !t) return {};

        // Helper to recursively extract all string values from an object, excluding base64 and huge strings
        const extractStrings = (obj: unknown): string => {
            if (!obj) return "";
            if (typeof obj === 'string') {
                // Skip base64 data URLs or extremely long strings that pollute search
                if (obj.startsWith("data:") || obj.length > 300) {
                    return "";
                }
                return obj + " ";
            }
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj) + " ";
            if (Array.isArray(obj)) return obj.map(extractStrings).join("");
            if (typeof obj === 'object') {
                return Object.values(obj as Record<string, unknown>).map(extractStrings).join("");
            }
            return "";
        };

        const index: Record<string, { category: string, title: string, value: string }> = {};

        const add = (id: string, category: unknown, titleObj: unknown, valueObjs: unknown[]) => {
            const title = typeof titleObj === 'string' ? titleObj : extractStrings(titleObj);
            const value = valueObjs.map(v => typeof v === 'string' ? v + " " : extractStrings(v)).join(" ");
            index[id] = { category: String(category || ""), title, value };
        };

        // Group: Environment & Trust
        add('environment', t.groups?.environment, t.environment, [
            t.quickSummary?.allClear,
            t.quickSummary?.webrtcLeaked,
            t.quickSummary?.botDetected,
            t.quickSummary?.insecureContext,
            t.quickSummary?.adBlocker,
            t.quickSummary?.privacyBrowser,
            t.quickSummary?.cookiesDisabled,
            "environment info trust safety risk adblock webrtc bot automation ssl https 环境 安全 信任 泄露 机器人 自动化 广告拦截 隐私"
        ]);

        // Group: Browser
        add('browser', t.groups?.browser, [t.browserCard, t.labels?.browser], [
            browserData.system,
            t.labels?.os,
            t.labels?.platform,
            t.labels?.browser,
            t.labels?.language,
            t.labels?.pref_langs,
            t.labels?.cookies,
            t.labels?.dnt,
            "browser chrome safari firefox edge opera system os cookie language 浏览器 操作系统 平台 语言 首选语言 偏好 cookie 请勿追踪"
        ]);

        // Group: System
        add('system', t.groups?.system, t.sections?.system, [
            browserData.system,
            t.labels?.os,
            t.labels?.platform_ver,
            t.labels?.arch,
            t.labels?.bitness,
            t.labels?.local_time,
            t.labels?.timezone,
            t.labels?.locale,
            t.labels?.calendar,
            "system platform engine user agent architecture bitness local time timezone locale calendar 系统 引擎 平台 核心 架构 位宽 本地时间 时区 区域 日历"
        ]);

        add('hardware', t.groups?.system, t.sections?.hardware, [
            browserData.hardware,
            t.labels?.cpu,
            t.labels?.cpu_model,
            t.labels?.memory,
            t.labels?.gpu_renderer,
            t.labels?.battery,
            t.labels?.gamepads,
            t.labels?.shader_precision,
            "hardware cpu cores memory ram gpu rendering renderer card vendor battery charging gamepads touch shader precision 硬件 处理器 核心 内存 显卡 图形 渲染 电池 充电 触控 触控点 手柄 着色器"
        ]);

        add('display', t.groups?.system, t.sections?.display, [
            browserData.display,
            t.labels?.resolution,
            t.labels?.refresh_rate,
            t.labels?.avail_size,
            t.labels?.pixel_ratio,
            t.labels?.color_depth,
            t.labels?.screen_extended,
            t.labels?.orientation,
            t.labels?.hdr,
            t.labels?.display_mode,
            t.labels?.dark_mode,
            "display screen resolution refresh rate size window dpr pixel color depth extended orientation hdr dark dark mode color gamut color space 显示 屏幕 分辨率 刷新率 尺寸 窗口 像素比 颜色 深度 扩展 方向 hdr 深色 浅色 黑暗 亮度 色域 颜色空间"
        ]);

        // Group: Network & Security
        add('network', t.groups?.network, t.sections?.network, [
            browserData.network,
            t.labels?.online,
            t.labels?.conn_type,
            t.labels?.net_type,
            t.labels?.downlink,
            t.labels?.downlink_max,
            t.labels?.rtt,
            t.labels?.save_data,
            t.labels?.webrtc_ip,
            "network online connection speed latency rtt ping downlink wifi cellular ethernet webrtc public ip local ip dns speedtest 网络 连接 在线 离线 下行 延迟 网速 无线 蜂窝 宽带 真实 ip dns"
        ]);

        add('security', t.groups?.network, t.sections?.security, [
            browserData.security,
            t.labels?.cookies,
            t.labels?.is_bot,
            t.labels?.ad_block,
            t.labels?.secure_context,
            t.labels?.gpc_enabled,
            t.labels?.pdf_viewer,
            "security privacy privacy settings bot automation webdriver adblock block secure https ssl gpc cookies pdf incognito 隐私 安全 机器人 自动化 广告拦截 插件 拦截 安全上下文 https 全球隐私控制 gpc pdf 阅读器 无痕 缓存 跟踪"
        ]);

        add('fingerprint', t.groups?.network, t.sections?.fingerprints, [
            browserData.fingerprints,
            t.labels?.fp_score,
            t.labels?.canvas_hash,
            t.labels?.webgl_hash,
            t.labels?.audio_rate,
            t.labels?.audio_latency,
            t.poisoning?.title,
            t.ja3?.title,
            t.fingerprintModal?.title,
            "fingerprint canvas webgl audio latency poisoning noise ja3 ja4 tls hash score unique tracking base64 指纹 设备指纹 canvas 画布 图像 音频 延迟 采样率 独特 评分 扰动 毒化 噪声 混淆 干扰 哈希 ja3 ja4 tls 签名"
        ]);

        // Group: Advanced / Capabilities
        add('ai', t.groups?.advanced, t.sections?.ai_compute, [
            browserData.ai,
            t.labels?.ai_readiness,
            t.labels?.window_ai,
            t.labels?.webnn,
            "ai artificial intelligence ml machine learning webgpu onnx compute inference model neural slm llm flops tflops ai 人工智能 机器学习 深度学习 计算 推理 模型 算力 浮点 神经网络"
        ]);

        add('location', t.groups?.advanced, t.sections?.location, [
            browserData.localization,
            t.labels?.geo_lat,
            t.labels?.geo_long,
            t.labels?.geo_acc,
            t.labels?.timezone,
            "location coordinates lat long latitude longitude accuracy timezone region gps maps geo 定位 地理位置 坐标 纬度 经度 精度 误差 时区 地区 地图"
        ]);

        add('storage', t.groups?.advanced, t.sections?.storage, [
            browserData.storage,
            t.labels?.storage_quota,
            t.labels?.storage_usage,
            t.labels?.storage_persisted,
            "storage quota usage disk filesystem persistent memory db indexeddb cache 存储 磁盘 配额 已用 空间 剩余 持久化"
        ]);

        add('permissions', t.groups?.advanced, t.sections?.permissions, [
            t.labels?.perm_notif,
            t.labels?.perm_midi,
            t.labels?.perm_geo,
            t.labels?.perm_camera,
            t.labels?.perm_mic,
            "permissions camera microphone geolocation notification midi status api 权限 摄像头 麦克风 定位 通知 剪贴板 媒体"
        ]);

        add('media_devices', t.groups?.advanced, t.sections?.media_devices, [
            t.labels?.media_devices,
            "devices media camera mic microphone speaker audio video input output hardware 设备 媒体设备 摄像头 话筒 麦克风 扬声器 输入 输出 视频 音频"
        ]);

        add('media_capabilities', t.groups?.advanced, t.sections?.media_sup, [
            browserData.media,
            t.labels?.video_codecs,
            t.labels?.audio_codecs,
            t.labels?.image_formats,
            t.labels?.drm_support,
            "media codecs audio video codec mp4 mkv webm h264 h265 hevc av1 vp9 aac mp3 opus flac image png jpeg webp avif drm widevine playready support 媒体 编解码 编码 解码 格式 视频 音频 图像 支持 版权保护 硬件加速"
        ]);

        add('user_agent', t.groups?.advanced, t.sections?.user_agent, [
            browserData.system?.userAgent,
            browserData.system?.clientHints,
            t.labels?.browser,
            t.labels?.os,
            "user agent ua client hints browser headers platform info agent client useragent 代理 浏览器标识 客户端提示 头部 系统 平台 版本"
        ]);
        
        // Group: PWA and Features
        add('pwa', t.groups?.advanced, t.sections?.pwa, [
            browserData.system?.isPwaInstalled,
            browserData.pwaFeatures,
            t.labels?.pwa_install_status,
            "pwa progressive web app install service worker standalone manifest features applications installable 应用 安装 离线 渐进式 桌面上"
        ]);

        add('features', t.groups?.advanced, t.sections?.features, [
            browserData.features,
            "features webgl webgpu webrtc wasm websocket bluetooth nfc usb midi geolocation speech battery apis support 特性 浏览器功能 支持 蓝牙 媒体 存储 加密"
        ]);

        return index;
    }, [browserData, t]);
}
