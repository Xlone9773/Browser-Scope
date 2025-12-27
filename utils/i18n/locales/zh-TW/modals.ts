
export const modals = {
  aboutModal: {
    title: "關於 BrowserScope",
    desc: "BrowserScope 是一個運行在瀏覽器端的綜合檢測工具。它不收集任何用戶隱私數據到伺服器，所有計算均在本地完成。旨在幫助開發者和用戶了解目前瀏覽器的真實能力、指紋特徵及系統環境。",
    version: "目前版本",
    latest_update: "最近更新",
    history: "更新歷史",
    features: {
        privacy: {
            title: "隱私優先",
            desc: "100% 客戶端執行。零數據上傳。您的指紋特徵僅留存在本地裝置。"
        },
        tech: {
            title: "前沿技術",
            desc: "基於 WebGPU, WebNN 和 WASM 構建，測試瀏覽器的極限能力邊界。"
        },
        deepScan: {
            title: "深度掃描",
            desc: "分析 100+ 項硬體與軟體訊號，生成高熵值的裝置指紋標識。"
        },
        stack: {
            title: "創新技術棧"
        },
        openSource: {
            title: "開源專案",
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
            changes: ["新增進階硬體互動工具 (壓感/視訊解碼)", "優化行動端佈局", "增加俄語支援"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["新增網絡診斷工具 (WebRTC/DNS/協定檢測)", "新增螢幕色域與 HDR 測試", "優化指紋評分演算法"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["新增 AI 效能評估遊樂場", "支援藍牙與手把檢測", "增加設定面板"]
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
        hardware_concurrency: "硬體並發資訊",
        user_agent: "User Agent 複雜度",
        resolution: "螢幕解析度",
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
        desc_hardware_generic: "常見的硬體配置。",
        desc_ua_unique: "UA 字串包含過多特有資訊。",
        desc_res_unique: "非標準的螢幕解析度。",
        desc_audio_unique: "音訊硬體特徵可被識別。",
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
  graphicsModal: {
    title: "顯示卡深度資訊 & 極限參數",
    tab_webgl: "WebGL 極限參數",
    tab_webgpu: "WebGPU 極限參數",
    tab_features: "特性支援",
    loading: "正在查詢 GPU 能力...",
    not_supported: "目前瀏覽器不支援 WebGPU。",
    copy: "複製報告",
    search: "搜尋參數..."
  },
  speechModal: {
    title: "語音合成瀏覽器",
    lang_filter: "按語言篩選",
    play: "試聽",
    default: "預設",
    local: "本地",
    remote: "線上",
    no_voices: "未找到語音包。請檢查您的系統是否支援文字轉語音。",
    loading: "載入語音庫..."
  }
};
