
export const modals = {
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
    storage_test: "Database IOPS"
  },
  graphicsModal: {
    title: "Graphics Limits & Features",
    tab_webgl: "WebGL Limits",
    tab_webgpu: "WebGPU Limits",
    tab_features: "Features",
    loading: "Querying GPU capabilities...",
    not_supported: "WebGPU is not supported in this browser.",
    copy: "Copy Report",
    search: "Search parameters..."
  },
  speechModal: {
    title: "Speech Synthesis Explorer",
    lang_filter: "Filter by Language",
    play: "Play",
    default: "Default",
    local: "Local",
    remote: "Remote",
    no_voices: "No voices found. Ensure your system supports Text-to-Speech.",
    loading: "Loading voices..."
  }
};
