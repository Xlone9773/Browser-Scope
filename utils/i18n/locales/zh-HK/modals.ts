
export const modals = {
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
            version: "1.7.0",
            date: "2024-05-01",
            changes: ["新增 WebGPU 光線追蹤基準測試", "增強 GPU 檢測能力"]
        },
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
            changes: ["新增網絡診斷工具 (WebRTC/DNS/協定檢測)", "新增屏幕色域與 HDR 测试", "優化指紋評分演算法"]
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
    value_label: "數值",
    close: "關閉",
    categories: {
        hardware: "硬件",
        browser: "瀏覽器",
        network: "網絡",
        media: "多媒體",
        screen: "屏幕"
    },
    factors: {
        canvas_hash: "Canvas 指紋",
        webgl_hash: "WebGL 指紋",
        hardware_concurrency: "硬件並發資訊",
        user_agent: "User Agent 複雜度",
        resolution: "屏幕解像度",
        audio_context: "音訊指紋",
        battery_status: "電池 API",
        locale_time: "時區與語言",
        gpu_renderer: "GPU 渲染器",
        webrtc_leak: "WebRTC 洩漏",
        screen_advanced: "進階屏幕參數",
        drm_support: "DRM 支援",
        touch_support: "觸控支援"
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
        desc_ua_ch: "Client Hints 暴露了具體的設備型號。",
        desc_res_unique: "非標準的屏幕解像度。",
        desc_audio_unique: "音訊硬件特徵可被識別。",
        desc_battery_unique: "電池狀態 API 暴露了具體電量。",
        desc_battery_generic: "電池 API 不可用或返回通用值。",
        desc_locale_unique: "時區與語言組合可用於輔助識別。",
        desc_gpu_unique: "完整的顯示卡型號字串被暴露。",
        desc_webrtc_leak: "WebRTC 洩漏了真實的局域網或公網 IP。",
        desc_webrtc_safe: "WebRTC IP 已被混淆或禁用。",
        desc_screen_advanced: "色深、HDR 和像素比的組合較為獨特。",
        desc_drm_unique: "支援的 DRM 系統組合縮小了識別範圍。"
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
  },
  storageBenchmark: {
    title: "儲存效能基準測試 Pro",
    start: "開始測試",
    stop: "停止",
    target_label: "儲存目標",
    size_label: "測試規模",
    chunk_size: "分塊大小",
    opfs: "OPFS (私有檔案系統)",
    idb: "IndexedDB (資料庫)",
    cache: "Cache API (緩存)",
    write: "寫入速度",
    read: "讀取速度",
    mbps: "MB/s",
    iops: "次/秒",
    results: "測試日誌",
    warning: "此測試將在您的磁碟寫入臨時資料。資料會自動清除，但請確保有足夠的可用空間。",
    latency: "延遲 (平均/峰值)",
    export_csv: "匯出 CSV",
    clear_logs: "清空日誌",
    chunk_size_64: "64 KB (高 IOPS)",
    chunk_size_256: "256 KB",
    chunk_size_1024: "1 MB (均衡)",
    chunk_size_4096: "4 MB (高吞吐量)",
    table_time: "時間",
    table_target: "目標",
    table_op: "類型",
    table_chunk: "分塊",
    table_speed: "吞吐量",
    table_latency: "延遲 (平均/峰值)",
    op_read: "讀取",
    op_write: "寫入"
  },
  heatmap: {
    title: "全球網絡品質監測",
    start: "快速掃描",
    stop: "停止",
    region: "區域節點",
    latency: "延遲 (RTT)",
    status: "狀態",
    status_pending: "等待中",
    status_error: "逾時/錯誤",
    desc: "點擊節點可進入詳細的連線品質追蹤模式 (模擬 MTR) 進行持續檢測。",
    back: "返回地圖",
    mtr_title: "連線品質追蹤",
    packet_loss: "封包遺失",
    jitter: "抖動 (Jitter)",
    avg_latency: "平均延遲",
    current: "即時",
    samples: "樣本數",
    regions: {
        us_east: "美東 (維珍尼亞)",
        us_west: "美西 (加利福尼亞)",
        ca_central: "加拿大 (蒙特利爾)",
        sa_brazil: "巴西 (聖保羅)",
        sa_chile: "智利 (聖地亞哥)",
        eu_uk: "英國 (倫敦)",
        eu_ger: "德國 (法蘭克福)",
        eu_fr: "法國 (巴黎)",
        eu_se: "瑞典 (斯德哥爾摩)",
        ap_india: "印度 (孟買)",
        ap_sg: "新加坡",
        ap_jp: "日本 (東京)",
        ap_kr: "韓國 (首爾)",
        ap_au: "澳洲 (雪梨)",
        cn_sh: "中國 (上海)",
        cn_hk: "中國 (香港)",
        cn_tw: "中國 (台北)",
        af_sa: "南非 (開普敦)"
    }
  },
  aiPlayground: {
    title: "AI 遊樂場",
    desc: "在瀏覽器本地運行輕量級 AI 模型 (DistilBERT)。無需上傳數據。",
    select_task: "選擇模型任務",
    perf_metrics: "效能指標",
    tasks: {
        sentiment: {
            title: "情感分析",
            desc: "識別文本情緒 (DistilBERT)",
            input: "輸入英文文本進行情感分析...",
            btn: "開始分析"
        },
        generation: {
            title: "文本生成",
            desc: "智能文本續寫 (DistilGPT2)",
            input: "輸入開頭句子...",
            btn: "生成續寫"
        },
        translation: {
            title: "機器翻譯",
            desc: "英譯德/法 (T5-Small)",
            input: "輸入待翻譯的英文文本...",
            btn: "翻譯"
        }
    },
    status: {
        loading_model: "正在載入模型權重...",
        ready: "模型就緒",
        computing: "計算中...",
        idle: "閒置"
    },
    metrics: {
        time_load: "載入耗時",
        time_inference: "推理耗時",
        device: "計算裝置"
    },
    result_label: "分析結果",
    confidence: "置信度",
    btn_load: "載入模型"
  },
  rayTracing: {
    title: "GPU 光線追蹤",
    start: "開始測試",
    stop: "停止",
    fps: "幀率 (FPS)",
    spp: "每像素採樣 (SPP)",
    bounces: "反彈次數",
    resolution: "解像度",
    error_webgpu: "目前瀏覽器不支援 WebGPU。請使用 Chrome 113+ 或 Edge。",
    desc: "基於 WebGPU 計算著色器 (Compute Shaders) 的即時路徑追蹤基準測試。",
    controls: "材質控制",
    roughness: "粗糙度",
    metalness: "金屬度",
    color: "球體顏色",
    reset: "重置鏡頭"
  }
};
