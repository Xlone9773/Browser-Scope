
import { Translation } from './types';
import { zhCN } from './zh-CN';

export const zhTW: Translation = {
  ...zhCN,
  
  loading: "正在掃描系統能力...",
  title: "BrowserScope",
  subtitle: "全面檢測您的瀏覽器環境、硬體能力、網路狀態及前沿 Web API 支援情況。",
  refresh: "重新檢測",
  footer: "所有資料均在本地瀏覽器中檢測，不會上傳任何個人隱私資訊。",
  
  aboutModal: {
    ...zhCN.aboutModal,
    title: "關於 BrowserScope",
    desc: "BrowserScope 是一款全面的瀏覽器分析工具，旨在驗證您的系統能力和指紋唯一性，所有檢測均在本地完成。",
    version: "版本",
    changelog: "更新日誌",
    latest_update: "新增硬體交互工具與儲存跑分",
    close: "關閉",
    history: "更新歷史",
    updates: [
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: [
                "新增硬體交互工具（振動模式與多點觸控測試）。",
                "效能跑分中新增儲存 I/O 讀寫測試 (IndexedDB)。",
                "新增字型指紋 (Font Fingerprinting) 檢測能力。",
                "優化 WebGL 擴充檢視器，支援按供應商分組和搜尋。",
                "修復 UI 動畫卡頓與模態框交互問題。"
            ]
        },
        {
            version: "1.1.0",
            date: "2024-02-28",
            changes: [
                "引入 AI 與計算能力檢測 (WebNN, Gemini Nano)。",
                "新增相機與麥克風診斷工具。",
                "增強裝置感測器視覺化效果 (加速度計, 陀螺儀)。"
            ]
        },
        {
            version: "1.0.0",
            date: "2024-01-10",
            changes: [
                "初始發布，包含核心系統資訊檢測。",
                "瀏覽器指紋分析 (Canvas, WebGL)。",
                "網路速度與延遲估算功能。"
            ]
        }
    ]
  },

  sections: {
    ...zhCN.sections,
    system: "系統與軟體",
    hardware: "硬體與圖形",
    display: "顯示與螢幕",
    network: "網路與連線",
    storage_loc: "儲存與本地化",
    media_sup: "媒體與編碼能力",
    fingerprints: "指紋與追蹤",
    features: "Web API 能力檢測",
    permissions: "權限管理",
    pwa: "PWA 能力"
  },
  
  labels: {
    ...zhCN.labels,
    os: "作業系統",
    platform: "系統平台",
    browser: "瀏覽器核心",
    language: "系統語言",
    pref_langs: "偏好語言",
    cookies: "Cookies 啟用",
    
    cpu: "CPU 邏輯核心",
    cpu_model: "CPU 型號 (估算)",
    memory: "裝置記憶體 (估算)",
    gpu_vendor: "GPU 供應商",
    gpu_renderer: "GPU 渲染器",
    max_texture: "最大紋理尺寸",
    audio_rate: "音訊取樣率",
    audio_latency: "音訊延遲",
    battery: "電池電量",
    charging: "充電狀態",
    charging_time: "充電時間", 
    discharging_time: "放電時間", 
    touch: "最大觸控點數",
    
    resolution: "螢幕解析度",
    refresh_rate: "更新率",
    avail_size: "可用尺寸",
    window_size: "視窗尺寸",
    pixel_ratio: "像素密度 (DPR)",
    color_depth: "色彩深度",
    orientation: "螢幕方向",
    orientation_angle: "旋轉角度", 
    dark_mode: "深色模式",
    color_gamut: "色域範圍",
    hdr: "HDR 支援",
    display_mode: "顯示模式",
    
    online: "線上狀態",
    conn_type: "連線類型",
    net_type: "網路制式", 
    downlink: "下載速度",
    downlink_max: "最大下載", 
    rtt: "延遲 (RTT)",
    save_data: "流量節省模式",
    
    timezone: "目前時區",
    locale: "區域設定",
    calendar: "日曆格式",
    storage_quota: "可用儲存配額",
    storage_usage: "已用儲存",
    storage_persisted: "持久化儲存",
    
    video_codecs: "視訊編碼支援",
    audio_codecs: "音訊編碼支援",
    image_formats: "圖片格式支援", 
    speech_voices: "TTS 語音包",
    audio_channels: "聲道數", 

    camera_permission: "相機權限",

    fp_score: "指紋評分",
    canvas_hash: "Canvas 雜湊",
    webgl_hash: "WebGL 雜湊",

    perm_notif: "通知權限",
    perm_midi: "MIDI 存取",
    perm_geo: "地理位置",
    geo_lat: "緯度",
    geo_long: "經度",
    geo_acc: "精確度",
    media_devices: "媒體裝置",
    perm_camera: "相機",
    perm_mic: "麥克風",

    pwa_install_status: "安裝狀態"
  },
  
  values: {
    connected: "已連線",
    offline: "離線",
    supported: "支援",
    not_supported: "不支援",
    yes: "是",
    no: "否",
    unknown: "未知",
    installed: "已安裝",
    not_installed: "未安裝"
  },

  actions: {
    check: "點擊檢查",
    theme_light: "切換淺色模式",
    theme_dark: "切換深色模式",
    about: "關於",
    export_json: "匯出 JSON",
    open_sensors: "感測器",
    view_details: "詳情",
    view_base64: "查看 Base64",
    view_extensions: "擴充列表",
    copy: "複製",
    copied: "已複製!"
  },

  audioTool: {
    ...zhCN.audioTool,
    title: "錄音工具",
    btn_open: "開啟錄音機",
    listening: "監聽中...",
    start_record: "開始",
    stop_record: "停止",
    download: "下載",
    details_size: "大小",
    details_rate: "取樣率",
    details_type: "格式",
    close: "關閉",
    error_mic: "無法存取麥克風"
  },

  cameraTool: {
    ...zhCN.cameraTool,
    title: "相機工具",
    btn_open: "開啟相機",
    no_devices: "未找到相機裝置",
    permission_denied: "相機權限被拒絕",
    error_hardware: "存取相機硬體錯誤",
    error_generic: "存取相機出錯",
    error_mic: "麥克風錯誤",
    select_device: "選擇裝置",
    current_res: "目前解析度",
    max_res: "最大解析度",
    mirror: "鏡像",
    take_photo: "拍照",
    start_record: "開始錄影",
    stop_record: "停止錄影",
    retake: "重拍",
    download_photo: "下載照片",
    download_video: "下載影片"
  },

  fingerprintModal: {
    ...zhCN.fingerprintModal,
    title: "瀏覽器指紋計算",
    desc: "使用各種瀏覽器屬性生成唯一的訪客識別碼。您可以調整以下參數來觀察雜湊值的變化。",
    tab_v4: "FingerprintJS v4 (現代)",
    tab_v2: "FingerprintJS v2 (傳統)",
    tab_fonts: "字型檢測",
    btn_run: "計算指紋",
    generating: "生成中...",
    visitor_id: "訪客 ID",
    time_taken: "耗時",
    params_title: "計算參數配置",
    salt_label: "自訂 Salt (種子)",
    components_label: "包含的組件",
    select_all: "全選",
    deselect_all: "全不選",
    close: "關閉",
    copy: "複製 ID",
    copied: "已複製!",
    font_detect_desc: "通過測量特定文本的渲染寬度來檢測系統中安裝的字型。這是一種常見的指紋追蹤技術。",
    font_list_title: "已檢測到的字型"
  },

  features: {
    ...zhCN.features,
    serviceWorker: "Service Worker",
    bgSync: "背景同步",
    pushApi: "推播 API",
    notification: "通知 API",
    appBadges: "應用程式標記",
    webgpu: "WebGPU 圖形引擎",
    webauthn: "WebAuthn",
    bluetooth: "Web 藍牙",
    usb: "Web USB",
    payment: "支付請求",
    nfc: "Web NFC",
    wakeLock: "螢幕喚醒鎖",
    fsAccess: "檔案系統存取",
    broadcast: "廣播頻道",
    webShare: "原生分享 API",
    clipboard: "剪貼簿 API",
    pip: "畫中画模式",
    geo: "地理位置定位",
    webCodecs: "Web Codecs 編碼",
    compression: "壓縮流",
    eyeDropper: "吸管工具 (EyeDropper)",
    accelerometer: "加速度計",
    gyroscope: "陀螺儀",
    ambientLight: "環境光感測器"
  },
  
  featureDescs: {
    ...zhCN.featureDescs,
    serviceWorker: "離線存取與 PWA 支援",
    bgSync: "延遲到有網路時執行操作",
    pushApi: "接收伺服器推播通知",
    notification: "系統級通知",
    appBadges: "在應用程式圖示上設定徽章",
    webgpu: "新一代高效能圖形 API",
    webxr: "虛擬實境與擴增實境能力",
    webauthn: "無密碼認證",
    bluetooth: "連接附近的藍牙裝置",
    usb: "連接 USB 硬體裝置",
    payment: "原生支付處理",
    nfc: "近場通訊能力",
    wakeLock: "防止螢幕自動關閉",
    fsAccess: "讀寫本地檔案系統",
    broadcast: "跨分頁通訊",
    webShare: "調用系統級分享面板",
    clipboard: "非同步讀寫剪貼簿",
    pip: "懸浮影片播放視窗",
    geo: "獲取使用者地理位置",
    wasm: "高效能二進位程式碼執行",
    webCodecs: "底層音視訊編解碼處理",
    compression: "原生 GZIP/Deflate 支援",
    webTransport: "低延遲雙向資料傳輸",
    eyeDropper: "系統級螢幕取色",
    accelerometer: "運動感測器",
    gyroscope: "方向感測器",
    ambientLight: "光線強度感測器"
  },

  scoreModal: {
    score_details_title: "指紋評分詳情",
    tracking_potential: "追蹤風險",
    score_explanation: "分數越高表示暴露給網站的唯一識別資料越多，被追蹤的風險越大。",
    contributing_factors: "影響因素",
    close: "關閉",

    factors: {
      canvas_hash: "Canvas 指紋",
      webgl_hash: "WebGL 指紋",
      hardware_concurrency: "硬體並發 (CPU/記憶體)",
      user_agent: "使用者代理 (User Agent)",
      resolution: "螢幕解析度",
      audio_context: "音訊上下文",
      battery_status: "電池狀態 API",
      locale_time: "區域與時間"
    },
    values: {
      val_unique: "唯一 / 高辨識度",
      val_generic: "通用 / 混淆",
      val_specific: "特定",
      val_readable: "可讀取",
      val_protected: "受保護",
      val_unknown: "未知"
    },
    descriptions: {
      desc_canvas_unique: "Canvas 渲染差異暴露了您的 GPU 和驅動程式特徵。",
      desc_canvas_generic: "Canvas 指紋提取失敗或已被封鎖。",
      desc_webgl_unique: "WebGL 報告暴露了具體的顯卡硬體型號。",
      desc_webgl_generic: "WebGL 指紋提取失敗或已被封鎖。",
      desc_hardware_unique: "CPU 核心數和裝置記憶體大小是重要的識別特徵。",
      desc_hardware_generic: "硬體詳細資訊被部分隱藏。",
      desc_ua_unique: "詳細的 User Agent 字串暴露了瀏覽器和作業系統版本。",
      desc_res_unique: "螢幕尺寸結合視窗大小會產生獨特的指紋。",
      desc_audio_unique: "音訊硬體的取樣率和延遲參數。",
      desc_battery_unique: "電池 API 允許網站跨瀏覽工作階段追蹤使用者。",
      desc_battery_generic: "電池狀態已被隱藏或不支援。",
      desc_locale_unique: "時區和語言設定可縮小使用者的位置範圍。"
    }
  },

  settingsModal: {
    title: "設定與工具",
    tab_general: "一般",
    tab_network: "網絡分析",
    tab_display: "顯示測試",
    tab_storage: "儲存管理",
    tab_resources: "外部資源",
    simple_mode_title: "簡潔模式",
    simple_mode_desc: "隱藏不必要的技術細節，僅顯示核心系統資訊。",
    
    public_ip: "公網 IP 位址",
    fetch_ip: "檢測 IP",
    ipv6_title: "IPv6 連線能力",
    check_ipv6: "檢測 IPv6",
    ipv6_success: "支援 IPv6",
    ipv6_fail: "未檢測到 / 僅 IPv4",
    ip_info: "IP 詳細資訊",
    provider: "運營商 (ISP)",
    location: "地理位置",
    cdn_status: "CDN 狀態",
    latency: "延遲",
    check_all: "檢查所有",
    url_placeholder: "輸入 URL (如 https://google.com)",
    test_conn: "測試連線",
    test_result: "測試結果",

    display_test: "螢幕壞點/缺陷測試",
    dead_pixel_title: "壞點檢測",
    dead_pixel_desc: "點擊顏色進入全螢幕模式。檢查螢幕上是否有不發光或顏色異常的像素點。",
    color_red: "紅",
    color_green: "綠",
    color_blue: "藍",
    color_white: "白",
    color_black: "黑",

    storage_title: "本地數據",
    clear_data: "清除網站數據",
    clear_btn: "清除儲存",
    sw_title: "Service Workers",
    sw_desc: "註銷活動的 Service Workers 以重置 PWA 狀態。",
    sw_btn: "註銷 SW",

    resource_list: "已加載資源",
    res_name: "資源 URL",
    res_type: "類型",
    res_duration: "加載耗時",
    close: "關閉"
  },
};
