import { Translation } from './types';

export const zhTW: Translation = {
  loading: "正在掃描系統能力...",
  title: "BrowserScope",
  subtitle: "全面檢測您的瀏覽器環境、硬體能力、網路狀態及前沿 Web API 支援情況。",
  refresh: "重新整理",
  footer: "所有資料均在本地瀏覽器中檢測，不會上傳任何個人隱私資訊。",
  
  sections: {
    system: "系統與軟體",
    hardware: "硬體與圖形",
    display: "顯示與螢幕",
    network: "網路與連線",
    storage_loc: "儲存與本地化",
    media_sup: "媒體與編碼能力",
    user_agent: "使用者代理 (User Agent)",
    fingerprints: "數位指紋與追蹤",
    features: "Web API 能力檢測",
    pwa: "PWA 與離線能力",
    permissions: "權限管理"
  },
  
  labels: {
    os: "作業系統",
    platform: "系統平台",
    browser: "瀏覽器核心",
    language: "系統語言",
    pref_langs: "首選語言列表",
    cookies: "Cookies 啟用",
    dnt: "Do Not Track",
    
    cpu: "CPU 邏輯核心",
    memory: "裝置記憶體 (估算)",
    gpu_vendor: "GPU 供應商",
    gpu_renderer: "GPU 渲染器",
    max_texture: "最大紋理尺寸",
    audio_rate: "音訊採樣率",
    battery: "電池電量",
    charging: "充電狀態",
    touch: "最大觸控點數",
    canvas_hash: "Canvas 指紋 (Hash)",
    webgl_hash: "WebGL 指紋 (Hash)",
    audio_latency: "音訊延遲",
    fp_score: "唯一性評分",
    
    resolution: "螢幕解析度",
    refresh_rate: "螢幕更新率 (估算)",
    avail_size: "可用尺寸",
    window_size: "視窗尺寸",
    pixel_ratio: "像素密度 (DPR)",
    color_depth: "色彩深度",
    orientation: "螢幕方向",
    dark_mode: "深色模式",
    color_gamut: "色域範圍",
    hdr: "HDR 支援",
    display_mode: "顯示模式",
    
    online: "線上狀態",
    conn_type: "連線類型",
    downlink: "下載速度",
    rtt: "延遲 (RTT)",
    save_data: "流量節省模式",
    
    timezone: "目前時區",
    locale: "區域設定",
    calendar: "日曆格式",
    storage_quota: "可用儲存配額",
    storage_usage: "已用儲存",
    storage_persisted: "持久化儲存",
    
    video_codecs: "影片編碼支援",
    audio_codecs: "音訊編碼支援",

    media_devices: "媒體設備",
    perm_camera: "相機",
    perm_mic: "麥克風",
    perm_geo: "地理位置",
    perm_notif: "系統通知",
    perm_midi: "MIDI 裝置",

    geo_lat: "緯度",
    geo_long: "經度",
    geo_acc: "精度 (公尺)"
  },
  
  values: {
    connected: "已連線",
    offline: "離線",
    supported: "支援",
    not_supported: "不支援",
    yes: "是",
    no: "否",
    unknown: "未知"
  },

  actions: {
    check: "點擊檢查",
    export_json: "匯出 JSON",
    view_extensions: "檢視擴充功能",
    view_base64: "Base64 原始碼",
    view_details: "檢視詳情",
    open_sensors: "開啟感測器",
    copy: "複製",
    copied: "已複製",
    zoom: "放大",
    theme_dark: "深色",
    theme_light: "淺色",
    about: "關於 / 更新日誌"
  },

  status: {
    idle: "未檢查",
    granted: "已授權",
    denied: "已拒絕",
    prompt: "需詢問",
    error: "檢測錯誤"
  },

  cameraTool: {
    title: "相機工具",
    btn_open: "開啟相機",
    select_device: "選擇設備",
    no_devices: "未發現視訊輸入設備",
    take_photo: "拍攝照片",
    start_record: "錄製影片",
    stop_record: "停止錄製",
    mirror: "畫面鏡像",
    retake: "重新拍攝",
    download_photo: "下載照片",
    download_video: "下載影片",
    close: "關閉",
    current_res: "目前輸出解析度",
    max_res: "硬體最大解析度 (WebRTC)",
    permission_denied: "相機權限已被拒絕",
    error_hardware: "相機已被占用或硬體錯誤",
    error_generic: "無法存取相機"
  },

  audioTool: {
    title: "錄音工具",
    btn_open: "開啟錄音機",
    start_record: "開始錄音",
    stop_record: "停止錄音",
    download: "下載音訊",
    close: "關閉",
    listening: "正在監聽...",
    error_mic: "麥克風存取被拒絕或出錯",
    details_size: "檔案大小",
    details_rate: "取樣率",
    details_type: "音訊格式"
  },

  webglTool: {
    title: "WebGL 擴充功能",
    count: "個擴充",
    search_placeholder: "搜尋擴充...",
    close: "關閉"
  },

  base64Tool: {
    title: "Canvas Base64 資料",
    desc: "Canvas 指紋渲染結果的原始資料表示。",
    copy: "複製 Base64",
    close: "關閉"
  },

  aboutModal: {
    title: "關於 BrowserScope",
    version: "目前版本",
    desc: "一個輕量級、注重隱私的瀏覽器能力檢測工具，可快速檢視硬體資訊、網路狀態及 Web API 支援情況。",
    changelog: "更新日誌",
    latest_update: "新增螢幕更新率檢測、儲存持久化狀態及感測器 API 支援檢測。",
    close: "關閉"
  },

  sensorModal: {
    sensor_title: "即時感測器資料",
    accelerometer: "加速計 (Accelerometer)",
    gyroscope: "陀螺儀 (Gyroscope)",
    sensor_permission_desc: "此功能需要存取裝置運動感測器權限。請允許以繼續。",
    sensor_allow: "允許存取感測器",
    close: "關閉"
  },

  scoreModal: {
    score_details_title: "指紋評分詳情",
    tracking_potential: "追蹤風險",
    score_explanation: "分數越高表示暴露給網站的唯一識別資料越多，被追蹤的風險越大。",
    contributing_factors: "影響因素",
    close: "關閉"
  },

  imageDetails: {
    dimensions: "影像尺寸",
    size: "檔案大小"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "後台同步 (Background Sync)",
    pushApi: "推播通知 (Push API)",
    notification: "系統通知 (Notification)",
    appBadges: "應用程式標記 (App Badges)",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn 認證",
    bluetooth: "Web 藍牙",
    usb: "Web USB",
    payment: "支付請求 API",
    nfc: "Web NFC",
    wakeLock: "螢幕喚醒鎖",
    fsAccess: "檔案系統存取",
    broadcast: "廣播頻道 (Broadcast)",
    webShare: "原生分享 API",
    clipboard: "剪貼簿 API",
    pip: "子母畫面模式",
    geo: "地理位置定位",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs 編碼",
    compression: "原生壓縮流",
    webTransport: "Web Transport",
    eyeDropper: "滴管工具 (EyeDropper)",
    accelerometer: "加速計 (Accelerometer)",
    gyroscope: "陀螺儀 (Gyroscope)",
    ambientLight: "環境光感測器 (Ambient Light)",
  },
  
  featureDescs: {
    serviceWorker: "離線存取與 PWA 支援",
    bgSync: "網路恢復時自動同步資料",
    pushApi: "接收伺服器推播訊息",
    notification: "系統級通知訊息",
    appBadges: "在應用程式圖示上顯示標記",
    webgpu: "新一代高效能圖形 API",
    webxr: "虛擬實境與擴增實境能力",
    webauthn: "無密碼安全認證標準",
    bluetooth: "連接附近的藍牙裝置",
    usb: "連接 USB 硬體裝置",
    payment: "瀏覽器原生支付流程",
    nfc: "近場通訊能力",
    wakeLock: "防止螢幕自動關閉",
    fsAccess: "讀寫本地檔案系統",
    broadcast: "跨分頁/視窗通訊",
    webShare: "呼叫系統級分享面板",
    clipboard: "非同步讀寫剪貼簿",
    pip: "懸浮影片播放視窗",
    geo: "取得使用者地理位置",
    wasm: "高效能二進位程式碼執行",
    webCodecs: "底層音視訊編解碼處理",
    compression: "原生 GZIP/Deflate 壓縮",
    webTransport: "低延遲雙向資料傳輸",
    eyeDropper: "系統級螢幕取色",
    accelerometer: "運動檢測感測器 (API 支援)",
    gyroscope: "方向檢測感測器 (API 支援)",
    ambientLight: "環境亮度檢測 (API 支援)",
  }
};