
export const modules = {
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
