
export const modules = {
  // Tool Modals
  speedTest: {
    title: "Network Speed Test",
    action: {
        start: "Start Test",
        stop: "Stop"
    },
    metrics: {
        ping: "Ping",
        jitter: "Jitter",
        download: "Download",
        upload: "Upload",
        latency: "Latency",
        mbps: "Mbps"
    },
    status: {
        idle: "Ready to start",
        ping: "Testing Latency...",
        download: "Testing Download...",
        upload: "Testing Upload...",
        done: "Test Complete",
        error: "Connection Failed"
    },
    settings: {
        server: "Server",
        test_size: "Test Size",
        backend: "Backend",
        custom_url: "Custom Download URL",
        custom_placeholder: "https://example.com/large-file.zip",
        cors_note: "Note: URL must support CORS. Upload test will be skipped."
    },
    preset_names: {
        cloudflare: "Cloudflare (Global)",
        cachefly: "CacheFly (Global CDN)",
        ustc_cn: "USTC Mirror (China/Hefei)",
        nju_cn: "NJU Mirror (China/Nanjing)",
        selectel_ru: "Selectel (Russia/St. Petersburg)",
        tele2_kz: "Tele2 (Kazakhstan/Almaty)",
        hetzner_de: "Hetzner (Germany/Falkenstein)",
        hetzner_fi: "Hetzner (Finland/Helsinki)",
        scaleway_fr: "Scaleway (France/Paris)",
        vultr_nj: "Vultr (US East/New Jersey)",
        vultr_la: "Vultr (US West/Los Angeles)",
        vultr_sg: "Vultr (Singapore)",
        vultr_tokyo: "Vultr (Japan/Tokyo)",
        vultr_sydney: "Vultr (Australia/Sydney)",
        custom: "Custom URL"
    }
  },

  cameraTool: {
    title: "Camera Test",
    btn_open: "Open Camera",
    select_device: "Select Device",
    take_photo: "Take Photo",
    start_record: "Record Video",
    stop_record: "Stop Recording",
    retake: "Retake",
    download_photo: "Download Photo",
    download_video: "Download Video",
    current_res: "Current Res",
    max_res: "Max Res",
    mirror: "Mirror",
    no_devices: "No video devices found",
    permission_denied: "Camera permission denied",
    error_hardware: "Hardware in use or unreadable",
    error_generic: "Unknown error occurred"
  },

  audioTool: {
    title: "Microphone Test",
    btn_open: "Open Mic",
    listening: "Listening...",
    start_record: "Record",
    stop_record: "Stop",
    download: "Download",
    details_size: "Size",
    details_rate: "Rate",
    details_type: "Format",
    error_mic: "Cannot access microphone",
    close: "Close"
  },

  webglTool: {
    title: "WebGL Extensions",
    count: "extensions",
    search_placeholder: "Search extensions...",
    spec_link: "View Spec",
    close: "Close"
  },

  imageDetails: {
    dimensions: "Dimensions",
    size: "Size"
  },

  base64Tool: {
    title: "Base64 Data",
    desc: "Raw Fingerprint Data",
    copy: "Copy All",
    close: "Close"
  },

  aboutModal: {
    title: "About BrowserScope",
    desc: "BrowserScope is a comprehensive detection tool running entirely in your browser. It does not collect any private data to servers; all calculations are done locally.",
    version: "Version",
    latest_update: "Latest Update",
    history: "History",
    features: {
        privacy: {
            title: "Privacy First",
            desc: "100% Client-side execution. Zero data collection. Your fingerprint stays on your device."
        },
        tech: {
            title: "Frontier Tech",
            desc: "Powered by WebGPU, WebNN, and WASM to test the bleeding edge of browser capabilities."
        },
        deepScan: {
            title: "Deep Scan",
            desc: "Analyzes 100+ hardware and software signals to generate high-entropy identifiers."
        },
        stack: {
            title: "Innovation Stack"
        },
        openSource: {
            title: "Open Source",
            license: "MIT License"
        }
    },
    updates: [
        {
            version: "1.7.0",
            date: "2024-05-01",
            changes: ["Added WebGPU Ray Tracing Benchmark", "Enhanced GPU detection"]
        },
        {
            version: "1.6.0",
            date: "2024-04-12",
            changes: ["Added Real Network Speed Test (Cloudflare)", "Added I18n Dynamic Translations", "Enhanced Intl support"]
        },
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["Added Developer Tools (Console/Inspector)", "Enhanced Codec Matrix (HDR/Dolby/Bit-depth)", "Added IP Source Selection", "Floating Window Support"]
        },
        {
            version: "1.4.0",
            date: "2024-03-25",
            changes: ["Added Vision Capabilities (Barcode/QR)", "Added CPU/GPU Mapping Update"]
        },
        {
            version: "1.3.0",
            date: "2024-03-20",
            changes: ["Added Hardware Tools (Pressure/Video)", "Optimized mobile layout", "Added Russian support"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["Added Network Tools (WebRTC/DNS/Proto)", "Added Gamut & HDR tests", "Improved fingerprint scoring"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["Added AI Playground", "Bluetooth & Gamepad support", "Added Settings panel"]
        }
    ],
    close: "Close"
  },

  sensorModal: {
    sensor_title: "Device Sensors",
    sensor_permission_desc: "Permission is required to access device sensors like Gyroscope.",
    sensor_allow: "Allow Access",
    accelerometer: "Accelerometer",
    gyroscope: "Gyroscope",
    magnetometer: "Magnetometer",
    ambient_light: "Ambient Light",
    linear_accel: "Linear Acceleration",
    gravity: "Gravity",
    abs_orientation: "Absolute Orientation",
    xaxis: "X-Axis",
    yaxis: "Y-Axis",
    zaxis: "Z-Axis",
    alpha: "Alpha",
    beta: "Beta",
    gamma: "Gamma",
    dark: "Dark",
    room: "Room",
    bright: "Bright",
    sensor_unavailable: "Sensor unavailable.",
    data_source_desc: "Data provided by DeviceMotion, DeviceOrientation & Generic Sensor APIs.",
    close: "Close"
  },

  scoreModal: {
    score_details_title: "Fingerprint Score Details",
    tracking_potential: "Tracking Potential",
    score_explanation: "This score represents the likelihood of your browser being uniquely identified. Higher scores mean your device fingerprint is more unique.",
    contributing_factors: "Contributing Factors",
    close: "Close",
    factors: {
        canvas_hash: "Canvas Hash",
        webgl_hash: "WebGL Hash",
        hardware_concurrency: "Hardware Concurrency",
        user_agent: "User Agent Complexity",
        resolution: "Screen Resolution",
        audio_context: "Audio Fingerprint",
        battery_status: "Battery API",
        locale_time: "Timezone & Locale"
    },
    values: {
        val_unique: "Unique/Rare Value",
        val_generic: "Generic/Common Value",
        val_specific: "Too Specific",
        val_readable: "Readable",
        val_protected: "Protected/Masked"
    },
    descriptions: {
        desc_canvas_unique: "Canvas rendering is highly unique.",
        desc_canvas_generic: "Canvas returned generic or protected noise.",
        desc_webgl_unique: "GPU rendering features are unique.",
        desc_webgl_generic: "WebGL is protected or masked.",
        desc_hardware_unique: "CPU/Memory combo is rare.",
        desc_hardware_generic: "Common hardware config.",
        desc_ua_unique: "UA string reveals too much info.",
        desc_res_unique: "Non-standard screen resolution.",
        desc_audio_unique: "Audio hardware characteristics identified.",
        desc_battery_unique: "Battery API exposed specific levels.",
        desc_battery_generic: "Battery API unavailable or generic.",
        desc_locale_unique: "Timezone/Language combo aids ID."
    }
  },

  fingerprintModal: {
    title: "Fingerprint Generator",
    desc: "Generate and analyze browser fingerprints",
    tab_v5: "FingerprintJS v5",
    tab_v4: "FingerprintJS v4",
    tab_v2: "FingerprintJS v2",
    tab_fonts: "Font Detection",
    salt_label: "Custom Salt (Noise)",
    font_detect_desc: "Detect installed system fonts",
    visitor_id: "Visitor ID (Hash)",
    time_taken: "Time Taken",
    generating: "Generating...",
    components_label: "Fingerprint Components",
    select_all: "Select All",
    deselect_all: "Deselect All",
    font_list_title: "Detected Fonts",
    copy: "Copy ID",
    copied: "Copied",
    regenerate: "Regenerate",
    close: "Close"
  },

  benchmarkModal: {
    title: "Performance Benchmark",
    start_btn: "Start Full Suite",
    running: "Running...",
    score: "Total Score",
    cpu_test: "CPU Primes",
    math_test: "Math Operations",
    memory_test: "Memory Throughput",
    dom_test: "DOM Manipulation",
    gpu_test: "Canvas Rendering",
    storage_test: "Database IOPS",
    worker_status: "Web Worker Active (Multi-Threaded)"
  },

  aiPlayground: {
    title: "AI Playground",
    desc: "Run lightweight AI models locally in your browser via WebAssembly. Privacy first - no data leaves your device.",
    select_task: "Select Model Task",
    perf_metrics: "Performance Metrics",
    tasks: {
        sentiment: {
            title: "Sentiment Analysis",
            desc: "Detect emotion in text (DistilBERT)",
            input: "Enter English text to analyze sentiment...",
            btn: "Analyze"
        },
        generation: {
            title: "Text Generation",
            desc: "AI Autocomplete (DistilGPT2)",
            input: "Start typing a sentence...",
            btn: "Generate"
        },
        translation: {
            title: "Translation",
            desc: "English to German/French (T5-Small)",
            input: "Enter English text to translate...",
            btn: "Translate"
        }
    },
    status: {
        loading_model: "Downloading Model",
        ready: "Model Ready",
        computing: "Computing...",
        idle: "Idle"
    },
    metrics: {
        time_load: "Load Time",
        time_inference: "Inference",
        device: "Device"
    },
    result_label: "Result",
    confidence: "Confidence",
    btn_load: "Load Model"
  },

  computeStress: {
    title: "Frontier Compute Stress Test",
    warning: "Warning: This test maximizes GPU load. It may cause high battery drain, heating, or temporary system freeze. Use with caution.",
    start: "Start Neural Stress",
    stop: "Stop",
    intensity: "Tensor Size",
    status_active: "CRUNCHING",
    status_idle: "IDLE",
    metric_gflops: "GFLOPS",
    metric_usage: "Operations/Sec",
    backend_webgpu: "Backend: WebGPU (Matrix Multiply)",
    backend_fallback: "Backend: WebGL (GPGPU Fallback)",
    error_webgpu: "WebGPU is not supported on this browser. Falling back to legacy methods.",
    use_fp16: "Use FP16 (Half Precision)",
    fp16_desc: "Accelerate on AI Tensor Cores",
    stability: "Stability",
    peak: "Peak"
  },

  gamepadTool: {
    title: "Gamepad",
    tab_gamepad: "Gamepad",
    tab_bluetooth: "Bluetooth",
    no_gamepad: "No Gamepad Detected",
    connect_instruction: "Connect gamepad and press any button to activate",
    btn_scan_bt: "Scan Bluetooth",
    bt_scanning: "Scanning...",
    bt_devices: "Discovered Devices",
    bt_no_devices: "No devices found",
    bt_not_supported: "Web Bluetooth API not supported"
  },

  hardwareToolsModal: {

    tab_drm: "DRM",
    drm_title: "DRM Capabilities (EME)",
    btn_test_drm: "Run DRM Test",
    title: "Hardware Tools",
    tab_vibrate: "Vibration",
    tab_touch: "Multi-Touch",
    tab_keyboard: "Keyboard",
    tab_mouse: "Mouse Hz",
    tab_pointer: "Pointer/Pen",
    tab_video: "Video Matrix",
    // Ray Tracing Tab Translations
    gpu_title: "WebGPU Ray Tracing",
    gpu_desc: "Run a real-time Path Tracing benchmark directly in your browser. This test utilizes WebGPU Compute Shaders to simulate light physics (reflections, refractions, shadows) on your GPU.",
    btn_launch: "Launch Benchmark",
    // Existing keys
    vibrate_not_supported: "Vibration API not supported on this device",
    vibrate_short: "Short (200ms)",
    vibrate_medium: "Medium (500ms)",
    vibrate_pattern: "Pulse Pattern",
    touch_instruction: "Touch or move on the screen area below",
    touch_count: "Touch Points",
    key_instruction: "Press any key to test input...",
    key_last: "Last Press",
    key_history: "Detected Keys",
    key_input_placeholder: "Type here to test keyboard...",
    mouse_instruction: "Move your mouse cursor quickly inside this box to measure event polling rate.",
    mouse_rate: "Current Rate",
    mouse_peak: "Peak Rate",
    pointer_instruction: "Draw here. Supports Pressure, Tilt & Pen inputs.",
    pointer_pressure: "Pressure",
    pointer_tilt: "Tilt (X/Y)",
    pointer_type: "Input Type",
    video_instruction: "Testing hardware decoding capabilities...",
    video_codec: "Codec",
    video_res: "Resolution",
    video_efficient: "Power Efficient (Hardware)",
    video_smooth: "Smooth Playback",
    filter_supported: "Show Supported Only",
    action_retest: "Retest",
    video_title: "Video & Audio Decoding Matrix",
    status_api_error: "API Error",
    status_api_na: "API N/A",
    status_hw: "HW",
    status_sw: "SW",
    status_software: "Software",
    tooltip_hw: "Hardware Accelerated (Efficient)",
    tooltip_sw: "Software Decoding (Power Hungry)",
    tooltip_drop: "May Drop Frames",
    status_done: "Done"
  },

  visionModal: {
    title: "Vision Capabilities",
    unsupported_desc: "Your browser does not support the native BarcodeDetector API. You can still use the Polyfill mode (software decoding) to test vision capabilities.",
    api_status: "API Support Status",
    detect_mode: "Detection Mode",
    camera_source: "Camera Source",
    latency: "Latency",
    hw_accel: "Hardware Acceleration",
    sw_decode: "Software Decoding",
    sw_warning: "Software decoding is CPU intensive and may be slower.",
    native_api: "Native API (HW)",
    polyfill: "Polyfill (SW)",
    detecting: "Detecting...",
    formats: "Supported Formats",
    perf: "Performance",
    fps: "FPS",
    last_result: "Last Detection",
    start_cam: "Start Camera",
    stop_cam: "Stop Camera",
    switch_cam: "Switch Camera",
    no_cam_error: "Camera not found or permission denied",
    auto_scan: "Auto Scan",
    manual_capture: "Capture & Detect"
  },

  midiModal: {
    title: "Web MIDI Studio",
    no_inputs: "No MIDI inputs found. Connect a device to play.",
    inputs: "Input Devices",
    outputs: "Output Devices",
    log: "Signal Log",
    clear: "Clear",
    octave: "Octave",
    waveform: "Waveform",
    sine: "Sine",
    square: "Square",
    sawtooth: "Sawtooth",
    triangle: "Triangle",
    velocity: "Vel",
    note: "Note"
  },

  storageBenchmark: {
    title: "Storage Benchmark Pro",
    start: "Start Benchmark",
    stop: "Stop",
    target_label: "Storage Target",
    size_label: "Payload Size",
    chunk_size: "Chunk Size",
    opfs: "OPFS (File System)",
    idb: "IndexedDB",
    cache: "Cache API",
    write: "Write",
    read: "Read",
    mbps: "MB/s",
    iops: "IOPS",
    results: "Results Log",
    warning: "This test writes temporary data to your disk. It will be cleared automatically, but ensure you have free space.",
    latency: "Avg/Peak Latency",
    export_csv: "Export CSV",
    clear_logs: "Clear Logs",
    chunk_size_64: "64 KB (High IOPS)",
    chunk_size_256: "256 KB",
    chunk_size_1024: "1 MB (Balanced)",
    chunk_size_4096: "4 MB (High Throughput)",
    table_time: "Time",
    table_target: "Target",
    table_op: "Type",
    table_chunk: "Chunk",
    table_speed: "Throughput",
    table_latency: "Latency (Avg/Peak)",
    op_read: "Read",
    op_write: "Write"
  },
  heatmap: {
    title: "Global Network Quality",
    start: "Quick Scan",
    stop: "Stop",
    region: "Region",
    latency: "Latency",
    status: "Status",
    status_pending: "Pending",
    status_error: "Timeout",
    desc: "Click a node to run a continuous Link Quality Trace (MTR simulation).",
    back: "Back to Map",
    mtr_title: "Link Quality Trace",
    packet_loss: "Packet Loss",
    jitter: "Jitter",
    avg_latency: "Avg Latency",
    current: "Current",
    samples: "Samples",
    regions: {
        us_east: "US East (N. Virginia)",
        us_west: "US West (California)",
        ca_central: "Canada (Montreal)",
        sa_brazil: "Brazil (São Paulo)",
        sa_chile: "Chile (Santiago)",
        eu_uk: "UK (London)",
        eu_ger: "Germany (Frankfurt)",
        eu_fr: "France (Paris)",
        eu_se: "Sweden (Stockholm)",
        ap_india: "India (Mumbai)",
        ap_sg: "Singapore",
        ap_jp: "Japan (Tokyo)",
        ap_kr: "South Korea (Seoul)",
        ap_au: "Australia (Sydney)",
        cn_sh: "China (Shanghai)",
        cn_hk: "China (Hong Kong)",
        cn_tw: "China (Taipei)",
        af_sa: "South Africa (Cape Town)"
    }
  }
};
