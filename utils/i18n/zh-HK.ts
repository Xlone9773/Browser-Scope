
// ... existing imports
import { Translation } from './types';

export const zhHK: Translation = {
  // ... existing code ...
  meta: {
    title: "BrowserScope",
    subtitle: "現代瀏覽器的深度指紋與能力檢測工具",
    footer: "BrowserScope - 瀏覽器能力檢測工具",
  },
  // ... existing common ...
  common: {
    loading: "正在掃描系統能力...",
    loading_steps: [
        "正在初始化環境...",
        "檢測圖形渲染能力...",
        "評估網絡連線狀態...",
        "檢查私隱與安全...",
        "評估 AI 效能...",
        "即將完成報告..."
    ],
    refresh: "重新檢測",
    actions: {
        start: "開始",
        stop: "停止",
        close: "關閉",
        copy: "複製",
        copied: "已複製",
        download: "下載",
        view_details: "查看詳情",
        check: "檢查",
        open: "打開",
        reset: "重置",
        export: "匯出 JSON"
    }
  },
  // ... existing settings ...
  settings: {
    title: "設定",
    nav: {
        general: "通用",
        network: "網絡工具",
        display: "屏幕檢測",
        storage: "儲存管理",
        resources: "資源監控",
        developer: "開發者",
        modules: "模組管理"
    },
    general: {
        simpleMode: {
            title: "極簡模式",
            desc: "隱藏部分複雜的技術細節，僅顯示核心資訊。"
        },
        scrollbar: {
            title: "隱藏捲軸",
            desc: "強制隱藏系統預設的捲軸樣式。"
        },
        timeFormat: {
            title: "時間格式",
            desc: "在 12 小時制和 24 小時制之間切換。"
        },
        performance: {
            title: "高性能模式",
            desc: "禁用模糊特效與透明度以降低 GPU 負載。"
        }
    },
    network: {
        ip: {
            title: "IP 配置資訊",
            ipv4: "IPv4",
            ipv4_desc: "標準互聯網協議",
            ipv6: "IPv6",
            ipv6_desc: "下一代互聯網協議",
            fetch: "查詢 IP",
            check_v6: "檢測 IPv6",
            success_v6: "支援 IPv6",
            fail_v6: "不支援 IPv6"
        },
        diagnostics: {
            title: "進階網絡診斷",
            webrtc: {
                title: "WebRTC 洩漏檢測",
                desc: "通過 STUN 伺服器嘗試獲取真實的區域網絡或公網 IP。",
                btn: "開始檢測",
                columns: { type: "類型", ip: "IP 位址", proto: "協定", port: "連接埠" }
            },
            dns: {
                title: "DNS 洩漏檢測",
                desc: "嘗試檢測您目前使用的 DNS 解析伺服器。",
                btn: "檢測 DNS",
                label_ip: "DNS 伺服器 IP",
                label_geo: "DNS 地理位置"
            },
            proto: {
                title: "協定支援",
                desc: "檢測瀏覽器對 HTTP/2 和 HTTP/3 (QUIC) 的支援情況。",
                btn: "檢查協定",
                h2: "HTTP/2 支援",
                h3: "HTTP/3 支援"
            }
        },
        connectivity: {
            title: "連通性測試",
            placeholder: "輸入網址 (例如 google.com)",
            btn: "測試"
        },
        cdn: {
            title: "CDN 狀態",
            check_all: "檢查全部"
        }
    },
    display: {
        deadPixel: {
            title: "壞點檢測",
            desc: "全屏幕顯示純色背景，幫助您尋找屏幕上的壞點或亮點。點擊任意處退出。",
            colors: { red: "紅", green: "綠", blue: "藍", white: "白", black: "黑" }
        },
        hdr: {
            title: "HDR 狀態",
            desc: "檢測目前顯示器和瀏覽器對高動態範圍內容的支援。",
            rangeScreen: "屏幕動態範圍",
            rangeVideo: "視訊動態範圍",
            brightnessTest: "EDR 亮度測試",
            brightnessDesc: "如果支援 HDR/EDR，中間的方塊應比白色背景更亮。",
            labelSdr: "SDR 白色",
            labelEdr: "EDR 高亮白"
        },
        gamut: {
            title: "廣色域測試 (P3)",
            desc: "如果在紅色方塊中能看到 Logo，說明您的裝置支援 P3 廣色域。",
            unsupported: "您的瀏覽器不支援 Display-P3 色域檢測。"
        },
        gradient: {
            title: "色深與灰階",
            desc: "檢查色彩過渡是否平滑（無斷層）以及暗部細節。"
        }
    },
    storage: {
        local: {
            title: "本地資料",
            clearDesc: "清除所有網站資料",
            clearBtn: "清除"
        },
        sw: {
            title: "Service Workers",
            desc: "管理後台運行的 Service Worker 腳本。",
            unregisterBtn: "登出所有"
        },
        usageLabel: "儲存空間使用率"
    },
    resources: {
        title: "外部資源載入列表",
        columns: { name: "資源名稱", type: "類型", duration: "耗時" }
    },
    developer: {
        warning: {
            title: "操作極度危險！",
            desc: "這裡是為開發者準備的偵錯區域。如果不清楚自己在做什麼，請立即關閉視窗！\n\n任何誘導你在此處貼上代碼的人都是詐騙。執行未知代碼可能導致你的私隱洩露、帳號被盜或裝置被惡意控制。",
            agree: "我已知曉風險，繼續"
        },
        nav: {
            events: "事件流",
            inspector: "物件檢查",
            console: "控制台"
        },
        actions: {
            float: "浮動視窗",
            dock: "恢復到底部"
        },
        events: {
            placeholder: "等待系統事件...",
            copy: "複製日誌",
            clear: "清空"
        },
        console: {
            placeholder: "輸入 JS 代碼 (輸入 '\\' 查看預設)...",
            clearInput: "清除輸入",
            resultPlaceholder: "運行結果將顯示在這裡...",
            copy: "複製結果",
            download: "下載結果",
            clear: "清空結果",
            quickCommands: "快捷指令",
            run: "立即運行"
        }
    },
    modules: {
        title: "模組管理",
        desc: "監控和管理已載入的模態框組件。卸載未使用的模組可以釋放記憶體和 GPU 資源。",
        headers: {
            name: "模組名稱",
            status: "狀態",
            impact: "資源佔用",
            action: "操作"
        },
        status: {
            active: "運行中",
            inactive: "閒置",
            cached: "已緩存",
            system: "系統核心"
        },
        impact: {
            low: "低",
            med: "中",
            high: "高"
        },
        actions: {
            unload: "強制關閉",
            unloadAll: "卸載所有活動模組"
        }
    }
  },
  // ... existing speedTest ...
  speedTest: {
    title: "網絡速度測試",
    action: {
        start: "開始測速",
        stop: "停止"
    },
    metrics: {
        ping: "延遲 (Ping)",
        jitter: "抖動",
        download: "下載速度",
        upload: "上傳速度",
        latency: "網絡延遲",
        mbps: "Mbps"
    },
    status: {
        idle: "準備就緒",
        ping: "正在測試延遲...",
        download: "正在測試下載...",
        upload: "正在測試上傳...",
        done: "測試完成",
        error: "連線失敗"
    },
    settings: {
        server: "伺服器",
        test_size: "測試大小",
        backend: "測速節點",
        custom_url: "自定義下載連結",
        custom_placeholder: "https://example.com/large-file.zip",
        cors_note: "注意：URL 必須支援 CORS。上載測試將被跳過。"
    },
    preset_names: {
        cloudflare: "Cloudflare (全球)",
        cachefly: "CacheFly (全球 CDN)",
        ustc_cn: "中科大鏡像站 (中國/合肥)",
        nju_cn: "南京大學鏡像站 (中國/南京)",
        selectel_ru: "Selectel (俄羅斯/聖彼得堡)",
        tele2_kz: "Tele2 (哈薩克/阿拉木圖)",
        hetzner_de: "Hetzner (德國/法爾肯施泰因)",
        hetzner_fi: "Hetzner (芬蘭/赫爾辛基)",
        scaleway_fr: "Scaleway (法國/巴黎)",
        vultr_nj: "Vultr (美東/新澤西)",
        vultr_la: "Vultr (美西/洛杉磯)",
        vultr_sg: "Vultr (新加坡)",
        vultr_tokyo: "Vultr (日本/東京)",
        vultr_sydney: "Vultr (澳洲/悉尼)",
        custom: "自定義 URL"
    }
  },
  // ... existing legacy mappings ...
  title: "BrowserScope",
  subtitle: "現代瀏覽器的深度指紋與能力檢測工具",
  loading: "正在掃描系統能力...",
  loading_steps: [
    "正在初始化環境...",
    "檢測圖形渲染能力...",
    "評估網絡連線狀態...",
    "檢查私隱與安全...",
    "評估 AI 效能...",
    "即將完成報告..."
  ],
  footer: "BrowserScope - 瀏覽器能力檢測工具",
  refresh: "重新檢測",
  
  sections: {
    system: "系統環境",
    hardware: "硬件資訊",
    display: "顯示與屏幕",
    network: "網絡連接",
    security: "私隱與安全",
    ai_compute: "AI 與運算",
    fingerprints: "裝置指紋",
    location: "地理位置",
    permissions: "權限狀態",
    media_sup: "多媒體能力",
    user_agent: "User Agent",
    pwa: "PWA 支援",
    features: "進階特性",
    storage: "儲存狀態"
  },

  labels: {
    os: "作業系統",
    platform: "平台架構",
    browser: "瀏覽器",
    language: "主要語言",
    pref_langs: "語言偏好",
    cookies: "Cookies",
    dnt: "Do Not Track",
    cpu: "CPU 核心數",
    cpu_model: "CPU 型號 (估算)",
    memory: "裝置記憶體",
    gpu_renderer: "GPU 渲染器",
    battery: "電池狀態",
    gamepads: "遊戲手掣",
    resolution: "屏幕解像度",
    refresh_rate: "刷新率",
    avail_size: "可用尺寸",
    pixel_ratio: "像素比 (DPR)",
    color_depth: "色彩深度",
    screen_extended: "多屏幕擴展",
    orientation: "屏幕方向",
    hdr: "HDR 支援",
    display_mode: "顯示模式",
    dark_mode: "深色模式",
    online: "連線狀態",
    conn_type: "連線類型",
    net_type: "網絡類型",
    downlink: "下載速度",
    downlink_max: "最大下載",
    rtt: "延遲 (RTT)",
    save_data: "省流模式",
    is_bot: "自動化程式",
    ad_block: "廣告攔截",
    secure_context: "安全上下文 (HTTPS)",
    webrtc_ip: "WebRTC 真實 IP",
    gpc_enabled: "全球私隱控制 (GPC)",
    pdf_viewer: "內置 PDF 閱讀器",
    ai_readiness: "AI 就緒度",
    window_ai: "Window.AI API",
    webnn: "WebNN API",
    fp_score: "指紋獨特性評分",
    canvas_hash: "Canvas 指紋",
    webgl_hash: "WebGL 指紋",
    audio_rate: "音訊採樣率",
    audio_latency: "音訊延遲",
    storage_quota: "儲存配額",
    storage_usage: "已用空間",
    storage_persisted: "持久化儲存",
    local_time: "本地時間",
    timezone: "時區",
    locale: "區域格式",
    calendar: "日曆類型",
    geo_lat: "緯度",
    geo_long: "經度",
    geo_acc: "精度",
    perm_notif: "通知權限",
    perm_midi: "MIDI 裝置",
    perm_geo: "地理位置",
    perm_camera: "相機",
    perm_mic: "米高峰",
    media_devices: "媒體裝置",
    video_codecs: "視訊編碼支援",
    audio_codecs: "音訊編碼支援",
    image_formats: "圖片格式支援",
    drm_support: "DRM 支援",
    speech_voices: "語音合成人聲",
    audio_channels: "音訊聲道數",
    pwa_install_status: "安裝狀態"
  },

  values: {
    supported: "支援",
    not_supported: "不支援",
    detected: "已檢測",
    none: "無",
    hidden: "隱藏/屏蔽",
    yes: "是",
    no: "否",
    connected: "已連線",
    offline: "離線",
    installed: "已安裝",
    not_installed: "未安裝"
  },

  status: {
    granted: "已授權",
    denied: "已拒絕",
    prompt: "詢問中",
    error: "錯誤",
    idle: "未請求",
    running: "運行中",
    supported: "支援",
    not_supported: "不支援",
    detected: "已檢測",
    none: "無",
    hidden: "隱藏",
    yes: "是",
    no: "否",
    unknown: "未知"
  },

  actions: {
    run_benchmark: "效能跑分",
    about: "關於",
    export_json: "匯出 JSON",
    open_sensors: "感測器詳情",
    open_tools: "硬件互動測試",
    open_vision: "視覺識別 (Vision)",
    open_speedtest: "網絡測速",
    view_details: "查看詳情",
    view_base64: "查看 Base64",
    view_extensions: "擴充列表",
    copy: "複製",
    copied: "已複製",
    check: "檢查",
    open_map: "打開地圖",
    stress_test: "壓力測試",
    open_video_test: "視訊解碼測試"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "背景同步",
    pushApi: "推播通知",
    notification: "通知 API",
    appBadges: "應用程式標記",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn (生物辨識)",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "支付請求",
    nfc: "Web NFC",
    wakeLock: "屏幕常亮",
    fsAccess: "檔案系統存取",
    broadcast: "跨分頁通訊",
    webShare: "原生分享",
    clipboard: "剪貼簿 API",
    pip: "畫中畫模式",
    geo: "地理位置",
    wasm: "WebAssembly",
    webCodecs: "WebCodecs",
    compression: "壓縮串流 API",
    webTransport: "WebTransport",
    eyeDropper: "取色器",
    accelerometer: "加速度計",
    gyroscope: "陀螺儀",
    ambientLight: "環境光感測器"
  },

  featureDescs: {
    serviceWorker: "支援離線存取和 PWA 核心功能",
    bgSync: "網絡恢復後自動同步資料",
    pushApi: "接收伺服器推播訊息",
    notification: "發送系統級通知",
    appBadges: "在應用程式圖示上顯示標記",
    webgpu: "下一代高效能圖形 API",
    webxr: "虛擬實境和擴增實境支援",
    webauthn: "無密碼身分驗證標準",
    bluetooth: "連接附近的藍牙裝置",
    usb: "連接 USB 裝置",
    payment: "瀏覽器原生支付介面",
    nfc: "近場通訊讀取與寫入",
    wakeLock: "防止屏幕自動變暗或鎖定",
    fsAccess: "讀寫用戶本地檔案",
    broadcast: "不同分頁間傳送訊息",
    webShare: "調用系統原生分享選單",
    clipboard: "非同步讀寫剪貼簿內容",
    pip: "影片懸浮播放",
    geo: "獲取用戶地理位置資訊",
    wasm: "高效能二進位代碼執行",
    webCodecs: "底層音視訊編解碼",
    compression: "原生資料流壓縮與解壓",
    webTransport: "低延遲雙向資料傳輸",
    eyeDropper: "螢幕顏色提取工具",
    accelerometer: "檢測裝置運動加速度",
    gyroscope: "檢測裝置旋轉方向",
    ambientLight: "檢測環境光照強度"
  },

  cameraTool: {
    title: "相機測試",
    btn_open: "打開相機",
    select_device: "選擇裝置",
    take_photo: "拍照",
    start_record: "開始錄影",
    stop_record: "停止錄影",
    retake: "重試",
    download_photo: "下載照片",
    download_video: "下載影片",
    current_res: "目前解像度",
    max_res: "最大解像度",
    mirror: "鏡像畫面",
    no_devices: "未找到視訊輸入裝置",
    permission_denied: "相機權限被拒絕",
    error_hardware: "硬件被佔用或無法讀取",
    error_generic: "發生未知錯誤"
  },

  audioTool: {
    title: "米高峰測試",
    btn_open: "打開米高峰",
    listening: "正在監聽...",
    start_record: "錄音",
    stop_record: "停止",
    download: "下載",
    details_size: "檔案大小",
    details_rate: "取樣率",
    details_type: "格式",
    error_mic: "無法存取米高峰",
    close: "關閉"
  },

  webglTool: {
    title: "WebGL 擴充",
    count: "個擴充",
    search_placeholder: "搜尋擴充名稱...",
    spec_link: "查看規範文件",
    close: "關閉"
  },

  imageDetails: {
    dimensions: "尺寸",
    size: "大小"
  },

  base64Tool: {
    title: "Base64 資料",
    desc: "指紋原始資料",
    copy: "複製全部",
    close: "關閉"
  },

  aboutModal: {
    title: "關於 BrowserScope",
    desc: "BrowserScope 是一個運行在瀏覽器端的綜合檢測工具。它不收集任何用戶私隱數據到伺服器，所有計算均在本地完成。旨在幫助開發者和用戶了解目前瀏覽器的真實能力、指紋特徵及系統環境。",
    version: "目前版本",
    latest_update: "最近更新",
    history: "更新歷史",
    features: {
        privacy: {
            title: "私隱優先",
            desc: "100% 客戶端執行。零數據上傳。您的指紋特徵僅留存在本地裝置。"
        },
        tech: {
            title: "前沿技術",
            desc: "基於 WebGPU, WebNN 和 WASM 構建，測試瀏覽器的極限能力邊界。"
        },
        deepScan: {
            title: "深度掃描",
            desc: "分析 100+ 項硬件與軟件訊號，生成高熵值的裝置指紋標識。"
        },
        stack: {
            title: "創新技術棧"
        },
        openSource: {
            title: "開源項目",
            license: "MIT 協議"
        }
    },
    updates: [
        {
            version: "1.6.0",
            date: "2024-04-12",
            changes: ["新增真實網速測試 (Cloudflare)", "新增 I18n 動態國際化支援", "增強 Intl 本地化格式"]
        },
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["新增開發者工具箱 (控制台/檢查器)", "增強媒體解碼檢測 (HDR/杜比/色深)", "支援切換 IP 查詢來源", "支援懸浮視窗模式"]
        },
        {
            version: "1.4.0",
            date: "2024-03-25",
            changes: ["新增視覺能力檢測 (條碼/二維碼)", "更新 CPU/GPU 映射資料庫"]
        },
        {
            version: "1.3.0",
            date: "2024-03-20",
            changes: ["新增進階硬件互動工具 (壓感/視訊解碼)", "優化流動端佈局", "增加俄語支援"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["新增網絡診斷工具 (WebRTC/DNS/協定檢測)", "新增屏幕色域與 HDR 測試", "優化指紋評分演算法"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["新增 AI 效能評估遊樂場", "支援藍牙與手掣檢測", "增加設定面板"]
        }
    ],
    close: "關閉"
  },

  sensorModal: {
    sensor_title: "裝置感測器",
    sensor_permission_desc: "需要您的授權才能存取裝置感測器數據（如陀螺儀）。",
    sensor_allow: "允許存取",
    accelerometer: "加速度計",
    gyroscope: "陀螺儀",
    magnetometer: "磁力計",
    ambient_light: "環境光",
    close: "關閉"
  },

  scoreModal: {
    score_details_title: "指紋評分詳情",
    tracking_potential: "追蹤風險",
    score_explanation: "此分數表示您目前的瀏覽器環境被唯一識別的可能性。分數越高，您的裝置指紋越獨特，越容易被網站追蹤。",
    contributing_factors: "評分影響因子",
    close: "關閉",
    factors: {
        canvas_hash: "Canvas 指紋",
        webgl_hash: "WebGL 指紋",
        hardware_concurrency: "硬件並發資訊",
        user_agent: "User Agent 複雜度",
        resolution: "屏幕解像度",
        audio_context: "音訊指紋",
        battery_status: "電池 API",
        locale_time: "時區與語言"
    },
    values: {
        val_unique: "獨特/罕見值",
        val_generic: "通用/常見值",
        val_specific: "過於具體",
        val_readable: "可讀取",
        val_protected: "受保護/模糊化"
    },
    descriptions: {
        desc_canvas_unique: "Canvas 渲染結果具有高度唯一性。",
        desc_canvas_generic: "Canvas 返回了通用或受保護的結果。",
        desc_webgl_unique: "GPU 渲染特徵具有唯一性。",
        desc_webgl_generic: "WebGL 受到保護或被屏蔽。",
        desc_hardware_unique: "CPU/記憶體組合較為罕見。",
        desc_hardware_generic: "常見的硬件配置。",
        desc_ua_unique: "UA 字串包含過多特有資訊。",
        desc_res_unique: "非標準的屏幕解像度。",
        desc_audio_unique: "音訊硬件特徵可被識別。",
        desc_battery_unique: "電池狀態 API 暴露了具體電量。",
        desc_battery_generic: "電池 API 不可用或返回通用值。",
        desc_locale_unique: "時區與語言組合可用於輔助識別。"
    }
  },

  fingerprintModal: {
    title: "指紋產生器",
    desc: "生成並分析瀏覽器指紋",
    tab_v4: "FingerprintJS v4",
    tab_v2: "FingerprintJS v2",
    tab_fonts: "字體檢測",
    salt_label: "自定義 Salt (干擾項)",
    font_detect_desc: "檢測系統已安裝的字體列表",
    visitor_id: "訪客 ID (Hash)",
    time_taken: "耗時",
    generating: "生成中...",
    components_label: "指紋組件",
    select_all: "全選",
    deselect_all: "取消全選",
    font_list_title: "已檢測到的字體",
    copy: "複製 ID",
    copied: "已複製",
    close: "關閉"
  },

  benchmarkModal: {
    title: "效能基準測試",
    start_btn: "開始全套測試",
    running: "測試進行中...",
    score: "綜合跑分",
    cpu_test: "CPU 素數計算",
    math_test: "浮點運算效能",
    memory_test: "記憶體讀寫吞吐",
    dom_test: "DOM 操作效能",
    gpu_test: "Canvas 渲染效能",
    storage_test: "資料庫 IOPS"
  },

  aiPlayground: {
    title: "AI 遊樂場",
    desc: "在瀏覽器本地運行輕量級 AI 模型 (DistilBERT)。無需上傳數據。",
    model_name: "情感分析模型",
    loading_model: "正在載入模型權重...",
    input_placeholder: "輸入一段英文文本進行情感分析...",
    result_label: "分析結果",
    confidence: "置信度"
  },

  computeStress: {
    title: "前沿算力壓力測試",
    warning: "警告：此測試將最大化 GPU 負載。可能會導致電池耗盡、發熱或系統暫時凍結。請謹慎使用。",
    start: "開始神經壓測",
    stop: "停止",
    intensity: "張量大小",
    status_active: "運算中",
    status_idle: "閒置",
    metric_gflops: "GFLOPS",
    metric_usage: "運算次數/秒",
    backend_webgpu: "後端: WebGPU (矩陣乘法)",
    backend_fallback: "後端: WebGL (GPGPU 回退)",
    error_webgpu: "目前瀏覽器不支援 WebGPU，將回退到傳統方法。",
    use_fp16: "啟用 FP16 (半精度浮點)",
    fp16_desc: "加速 AI Tensor Cores 運算",
    stability: "穩定性",
    peak: "峰值"
  },

  gamepadTool: {
    title: "手掣與藍牙",
    tab_gamepad: "遊戲手掣",
    tab_bluetooth: "藍牙裝置",
    no_gamepad: "未檢測到手掣",
    connect_instruction: "請連接手掣並按下任意按鍵以啟用",
    btn_scan_bt: "掃描藍牙裝置",
    bt_scanning: "掃描中...",
    bt_devices: "已發現裝置",
    bt_no_devices: "暫無裝置",
    bt_not_supported: "目前瀏覽器不支援 Web Bluetooth API"
  },

  hardwareToolsModal: {
    title: "硬件互動工具",
    tab_vibrate: "振動",
    tab_touch: "觸控",
    tab_keyboard: "鍵盤測試",
    tab_mouse: "滑鼠回報率",
    tab_pointer: "壓感/手寫筆",
    tab_video: "解碼能力",
    vibrate_not_supported: "您的裝置不支援振動 API",
    vibrate_short: "短振動 (200ms)",
    vibrate_medium: "中振動 (500ms)",
    vibrate_pattern: "脈衝模式",
    touch_instruction: "請在屏幕上觸摸或移動",
    touch_count: "觸控點數",
    key_instruction: "按下任意鍵進行測試...",
    key_last: "目前按鍵",
    key_history: "已檢測按鍵",
    key_input_placeholder: "在此處輸入以測試鍵盤...",
    mouse_instruction: "在此區域內快速移動滑鼠以測量事件回報率 (Polling Rate)。",
    mouse_rate: "目前回報率",
    mouse_peak: "峰值回報率",
    pointer_instruction: "在此繪圖。支援壓感、傾斜度及手寫筆輸入。",
    pointer_pressure: "壓力感應",
    pointer_tilt: "傾斜角度 (X/Y)",
    pointer_type: "輸入類型",
    video_instruction: "正在檢測硬件視訊解碼能力矩陣...",
    video_codec: "編碼格式",
    video_res: "解像度",
    video_efficient: "高效能 (硬件加速)",
    video_smooth: "流暢播放",
    filter_supported: "僅顯示支援項",
    // New Keys
    video_title: "音視訊解碼能力矩陣",
    status_api_error: "API 錯誤",
    status_api_na: "API 不可用",
    status_hw: "硬解",
    status_sw: "軟解",
    status_software: "軟體解碼",
    tooltip_hw: "硬體加速 (高效)",
    tooltip_sw: "軟體解碼 (高耗電)",
    tooltip_drop: "可能掉幀",
    status_done: "完成"
  },

  visionModal: {
    title: "視覺能力 (Vision)",
    unsupported_desc: "您的瀏覽器不支援原生的 BarcodeDetector API。您可以使用 Polyfill 模式（軟體解碼）來測試視覺識別能力。",
    api_status: "API 支援狀態",
    detect_mode: "檢測模式",
    camera_source: "相機來源",
    latency: "延遲",
    hw_accel: "硬體加速",
    sw_decode: "軟體解碼",
    sw_warning: "軟體解碼佔用 CPU 較高，速度可能較慢。",
    native_api: "原生 API (硬體加速)",
    polyfill: "Polyfill (軟體模擬)",
    detecting: "檢測中...",
    formats: "支持格式",
    perf: "性能指標",
    fps: "幀率",
    last_result: "最新檢測",
    start_cam: "啟動相機",
    stop_cam: "停止",
    switch_cam: "切換相機",
    no_cam_error: "未找到相機或權限被拒絕",
    auto_scan: "自動掃描",
    manual_capture: "手動拍攝"
  }
};
