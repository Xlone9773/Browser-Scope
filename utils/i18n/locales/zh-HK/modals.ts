
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
            license: "MIT 協議",
            viewLicense: "查看許可證",
            hideLicense: "隱藏許可證",
            downloadLicense: "下載許可證",
            licenseTitle: "軟件許可證 (MIT)",
            licenseText: `MIT 許可證

版權所有 (c) 2026 BrowserScope 貢獻者

特此免費授權任何獲得本軟件及相關文檔文件（以下簡稱“軟件”）副本的人在不受限制的情況下處理本軟件的許可，包括但不限於使用、複製、修改、合併、發表、分發、再許可和/或銷售本软件副本的權利，並允許向其提供本软件的人做出上述行為，但須符合以下條件：

上述版權聲明和本許可聲明應包含在本軟件的所有副本或實質性部分中。

本軟件按“原樣”提供，不提供任何形式的明示或暗示保證，包括但不限於對適銷性、特定用途適用性和非侵权性的保證。在任何情況下，作者或版權持有人均不對因本軟件或本軟件的使用或其他交易而引起的、由本軟件引起的或與之相關的任何索賠、損害或其他責任（無論是合同訴訟、侵權訴訟還是其他訴訟）承擔責任。`
        }
    },
    updates: [
        {
            version: "2.0.0",
            date: "2026-05-03",
            changes: [
                "🚀 全新架構與完整體驗升級",
                "修復了 vConsole 載入報錯的問題（開發者工具完美運行）", 
                "增強了原生元件彈出視窗體驗（重新設計 UI）",
                "新增自訂通知動作按鈕 (Actions) 及圖示支援",
                "改善並修復了各環境多項相容性 Bug"
            ]
        },
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
    linear_accel: "線性加速度",
    gravity: "重力傳感器",
    abs_orientation: "絕對方向",
    xaxis: "X 軸",
    yaxis: "Y 軸",
    zaxis: "Z 軸",
    alpha: "Alpha (偏航角)",
    beta: "Beta (翻滾角)",
    gamma: "Gamma (俯仰角)",
    dark: "黑暗",
    room: "室內",
    bright: "明亮",
    sensor_unavailable: "傳感器不可用。",
    data_source_desc: "數據由 DeviceMotion、DeviceOrientation 與 Generic Sensor API 提供。",
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
    tab_v5: "FingerprintJS v5",
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
    regenerate: "重新生成",
    close: "關閉",
    font_count: "數量",
    complex_obj: "[複雜對象]",
    no_components: "未載入組件",
    active_source: "使用中的數據源",
    items_included: "個項目已包含",
    error_loading: "載入庫失敗"
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
    storage_test: "資料庫 IOPS",
    worker_status: "Web Worker 啟用中 (多線程高效率)"
  },
  graphicsModal: {
    supported_features: "支援的特性",
    no_params_found: "未找到匹配的參數：",
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
    op_write: "寫入",
    worker_status: "專有 Web Worker 運行中 (啟用多線程同步高速 IO)"
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
  },
  "extensionsModal": {
    "title": "瀏覽器擴展檢測",
    "note_strong": "注意：",
    "note_text": "基於私隱和安全性考量，瀏覽器不提供原生 API 來列出已安裝的擴充功能。此檢測工具使用啟發式方法（如檢測注入的變數或 DOM 元素）來識別常見的擴充功能。這並非您安裝的所有擴展的完整清單。",
    "no_extensions": "未檢測到已知的擴充功能。",
    "detected": "已檢測到",
    "categories": {
      "Development": "開發工具",
      "Crypto": "加密錢包",
      "Shopping": "購物/優惠券",
      "Productivity": "生產力",
      "Utility": "實用工具"
    },
    "names": {
      "react-devtools": "React 開發者工具",
      "vue-devtools": "Vue.js 開發者工具",
      "redux-devtools": "Redux 開發者工具",
      "apollo-devtools": "Apollo 開發者工具",
      "ember-inspector": "Ember 檢查器",
      "metamask": "MetaMask",
      "phantom": "Phantom",
      "binance": "幣安錢包",
      "coinbase": "Coinbase 錢包",
      "brave-wallet": "Brave 錢包",
      "sui-wallet": "Sui 錢包",
      "honey": "Honey (優惠券)",
      "grammarly": "Grammarly (寫作助手)",
      "darkreader": "Dark Reader"
    },
    "descs": {
      "react-devtools": "官方 React 偵錯擴充功能",
      "vue-devtools": "官方 Vue.js 偵錯擴充功能",
      "redux-devtools": "Redux 狀態偵錯",
      "apollo-devtools": "GraphQL 偵錯工具",
      "ember-inspector": "Ember 框架偵錯",
      "metamask": "Web3 乙太坊錢包",
      "phantom": "Web3 Solana 錢包",
      "binance": "Web3 幣安智能鏈錢包",
      "coinbase": "Web3 Coinbase 錢包",
      "brave-wallet": "Brave 瀏覽器內置加密錢包",
      "sui-wallet": "Web3 Sui 錢包",
      "honey": "自動查找並套用優惠券",
      "grammarly": "寫作助手與文法檢查",
      "darkreader": "為所有網頁生成深色主題"
    }
  }
,
  "ja3Modal": {
    "title": "SSL/TLS 指紋 (JA3/JA4)",
    "desc_title": "TLS Client Hello 指紋識別",
    "desc": "在 HTTPS 握手期間，瀏覽器會發送包含支援的密碼套件、TLS 擴充等資訊的 Client Hello 訊息。JA3/JA4 對這些 TCP/TLS 特徵進行指紋識別，以準確識別真實的瀏覽器引擎或檢測機器人、代理和偽造的用戶代理。",
    "fetching": "正在分析 TLS 握手...",
    "retry": "重試",
    "ja3_title": "JA3 指紋",
    "ja3_hash": "JA3 雜湊 (MD5)",
    "ja3_string": "JA3 字串 (原始)",
    "ja3n_title": "JA3N 指紋",
    "ja3n_hash": "JA3N 雜湊 (MD5)",
    "ja3n_string": "JA3N 字串 (原始)",
    "server_ua": "伺服器檢測到的 User-Agent"
  },
  "attributionsModal": {
    "title": "軟體與資產歸屬聲明",
    "subtitle": "記錄並致謝為 BrowserScope 瀏覽器分析儀表盤提供支援的第三方開源庫、開發框架及設計字型。",
    "search_placeholder": "搜尋庫、依賴項或字型...",
    "tab_all": "全部資產",
    "tab_libraries": "開源庫與框架",
    "tab_fonts": "排版與字型",
    "view_license": "查看許可證正文",
    "hide_license": "隱藏許可證正文",
    "license_type": "開源協定",
    "role_label": "功能與整合角色",
    "visit_site": "訪問開源倉庫",
    "empty_search": "未找到匹配 \"{query}\" 的歸屬資訊",
    "font_role": "高易讀性字型，用於系統介面、版面配置、大標題與數據視覺化面板。",
    "lib_role_react": "現代響應式 UI 渲染引擎及狀態管理架構，構建高內聚的互動組件。",
    "lib_role_fingerprint": "多代高級瀏覽器指紋特徵識別引擎，用於計算熵值及設備一致性驗證。",
    "lib_role_transformers": "基於 WebAssembly 的瀏覽器端神經網路推理引擎，執行本地端側 AI 模型。",
    "lib_role_lucide": "清晰精細、完全可伸縮的 SVG 系統介面圖示與元數據圖示。",
    "lib_role_motion": "基於硬體加速的系統元素流暢動畫、入場過渡與互動動效。",
    "lib_role_screenshot": "基於 canvas 渲染底層 DOM 節點，生成可供導出的高保真儀表盤螢幕截圖報告。",
    "lib_role_jspdf": "高保真用戶端 PDF 診斷報告文件多執行緒編譯。",
    "lib_role_devtools": "行動端優化的虛擬記錄輸出、DOM 節點審查及網頁檢查器主控台工具箱。",
    "lib_role_pwa": "離線優先資產預快取與 Service Worker 用戶端生命週期管理。",
    "lib_role_server": "Express 伺服器端介面路由分发、API 限流以及安全 HTTP 頭防護。",
    "lib_role_charts": "響應式互動圖表、儀表盤、圖表與網路診斷指標視覺化向量。",
    "close": "關閉"
  },
  "keyboardShortcutsModal": {
    "title": "鍵盤快捷鍵",
    "desc": "使用全域鍵盤快捷鍵，大幅提升操作效率。",
    "categories": {
      "general": "全域與通用操作",
      "navigation": "快捷導航與測試工具",
      "export": "數據匯出"
    },
    "keys": {
      "theme": "切換主題（深色 / 淺色）",
      "refresh": "重新掃描並刷新數據",
      "help": "打開 / 關閉此快捷鍵幫助",
      "close": "關閉當前彈窗 / 返回",
      "settings": "打開設置中心",
      "benchmark": "運行系统性能跑分",
      "ai": "進入 AI 實驗室 / Playground",
      "network": "網絡工具（Ping/端口/UDP）",
      "display": "顯示器測試工具",
      "hardware": "硬體高級測試",
      "translate": "Google 網頁翻譯",
      "exportJson": "匯出 JSON 诊断數據",
      "exportPdf": "匯出高保真 PDF 報告",
      "exportImage": "匯出儀表板高清長圖",
      "esc": "Esc",
      "alt": "Alt",
      "shift": "Shift"
    }
  }

};
