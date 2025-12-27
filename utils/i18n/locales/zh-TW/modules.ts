
export const modules = {
  settings: {
    title: "設定",
    nav: {
        general: "通用",
        network: "網絡工具",
        display: "螢幕檢測",
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
            ipv4_desc: "標準網際網路協定",
            ipv6: "IPv6",
            ipv6_desc: "下一代網際網路協定",
            fetch: "查詢 IP",
            check_v6: "檢測 IPv6",
            success_v6: "支援 IPv6",
            fail_v6: "不支援 IPv6"
        },
        diagnostics: {
            title: "進階網絡診斷",
            webrtc: {
                title: "WebRTC 洩漏檢測",
                desc: "通過 STUN 伺服器嘗試獲取真實的區域網路或公網 IP。",
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
            desc: "全螢幕顯示純色背景，幫助您尋找螢幕上的壞點或亮點。點擊任意處退出。",
            colors: { red: "紅", green: "綠", blue: "藍", white: "白", black: "黑" }
        },
        hdr: {
            title: "HDR 狀態",
            desc: "檢測目前顯示器和瀏覽器對高動態範圍內容的支援。",
            rangeScreen: "螢幕動態範圍",
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
            desc: "這裡是為開發者準備的偵錯區域。如果不清楚自己在做什麼，請立即關閉視窗！\n\n任何誘導你在此處貼上代碼的人都是詐騙。執行未知代碼可能導致你的隱私洩露、帳號被盜或裝置被惡意控制。",
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
            cached: "已快取",
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
        cors_note: "注意：URL 必須支援 CORS。上傳測試將被跳過。"
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
        vultr_nj: "Vultr (美東/紐澤西)",
        vultr_la: "Vultr (美西/洛杉磯)",
        vultr_sg: "Vultr (新加坡)",
        vultr_tokyo: "Vultr (日本/東京)",
        vultr_sydney: "Vultr (澳洲/雪梨)",
        custom: "自定義 URL"
    }
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
    current_res: "目前解析度",
    max_res: "最大解析度",
    mirror: "鏡像畫面",
    no_devices: "未找到視訊輸入裝置",
    permission_denied: "相機權限被拒絕",
    error_hardware: "硬體被佔用或無法讀取",
    error_generic: "發生未知錯誤"
  },

  audioTool: {
    title: "麥克風測試",
    btn_open: "打開麥克風",
    listening: "正在監聽...",
    start_record: "錄音",
    stop_record: "停止",
    download: "下載",
    details_size: "檔案大小",
    details_rate: "取樣率",
    details_type: "格式",
    error_mic: "無法存取麥克風",
    close: "關閉"
  },

  webglTool: {
    title: "WebGL 擴充",
    count: "個擴充",
    search_placeholder: "搜尋擴充名稱...",
    spec_link: "查看規範文件",
    close: "關閉"
  },

  base64Tool: {
    title: "Base64 資料",
    desc: "指紋原始資料",
    copy: "複製全部",
    close: "關閉"
  },

  imageDetails: {
    dimensions: "尺寸",
    size: "大小"
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
    title: "手把與藍牙",
    tab_gamepad: "遊戲手把",
    tab_bluetooth: "藍牙裝置",
    no_gamepad: "未檢測到手把",
    connect_instruction: "請連接手把並按下任意按鍵以啟用",
    btn_scan_bt: "掃描藍牙裝置",
    bt_scanning: "掃描中...",
    bt_devices: "已發現裝置",
    bt_no_devices: "暫無裝置",
    bt_not_supported: "目前瀏覽器不支援 Web Bluetooth API"
  },

  hardwareToolsModal: {
    title: "硬體互動工具",
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
    touch_instruction: "請在螢幕上觸摸或移動",
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
    video_instruction: "正在檢測硬體視訊解碼能力矩陣...",
    video_codec: "編碼格式",
    video_res: "解析度",
    video_efficient: "高效能 (硬體加速)",
    video_smooth: "流暢播放",
    filter_supported: "僅顯示支援項",
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
  },

  midiModal: {
    title: "Web MIDI 工作室",
    no_inputs: "未檢測到 MIDI 輸入裝置。請連接裝置。",
    inputs: "輸入裝置",
    outputs: "輸出裝置",
    log: "訊號日誌",
    clear: "清除",
    octave: "八度",
    waveform: "波形",
    sine: "正弦波",
    square: "方波",
    sawtooth: "鋸齒波",
    triangle: "三角波",
    velocity: "力度",
    note: "音符"
  }
};
