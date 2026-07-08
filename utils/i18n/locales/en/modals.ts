
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
            license: "MIT License",
            viewLicense: "View License",
            hideLicense: "Hide License",
            downloadLicense: "Download License",
            licenseTitle: "LICENSE (MIT)",
            licenseText: `MIT License

Copyright (c) 2026 BrowserScope Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
        }
    },
    updates: [
        {
            version: "2.1.0",
            title: "Colors Update",
            date: "2026-05-04",
            changes: [
                "🎨 Added Custom Theme Color selector (Settings -> General)",
                "✨ Added Custom Entrance Animation styling",
                "🐛 Fixed system command invocation bugs"
            ]
        },
        {
            version: "2.0.0",
            date: "2026-05-03",
            changes: [
                "🚀 All-New Architecture & Experience Upgrade",
                "Fixed vConsole loading crash (DevTools runs perfectly now)", 
                "Enhanced UI by replacing native alerts with a modern system",
                "Added customizable Notification Action buttons and Icon support",
                "Improved and resolved multiple compatibility bugs across environments"
            ]
        },
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
    value_label: "Value",
    close: "Close",
    categories: {
        hardware: "Hardware",
        browser: "Browser",
        network: "Network",
        media: "Media",
        screen: "Screen"
    },
    factors: {
        canvas_hash: "Canvas Hash",
        webgl_hash: "WebGL Hash",
        hardware_concurrency: "Concurrency",
        user_agent: "User Agent",
        resolution: "Resolution",
        audio_context: "Audio Context",
        battery_status: "Battery API",
        locale_time: "Timezone & Locale",
        gpu_renderer: "GPU Renderer",
        webrtc_leak: "WebRTC Leak",
        screen_advanced: "Screen Advanced",
        drm_support: "DRM Systems",
        touch_support: "Touch Support"
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
        desc_ua_ch: "Client Hints expose specific model data.",
        desc_res_unique: "Non-standard screen resolution.",
        desc_audio_unique: "Audio hardware characteristics identified.",
        desc_battery_unique: "Battery API exposed specific levels.",
        desc_battery_generic: "Battery API unavailable or generic.",
        desc_locale_unique: "Timezone/Language combo aids ID.",
        desc_gpu_unique: "Exact GPU model string exposed.",
        desc_webrtc_leak: "Real local or public IP leaked via WebRTC.",
        desc_webrtc_safe: "WebRTC IP handling is obfuscated or disabled.",
        desc_screen_advanced: "Combination of color depth, HDR and DPR is unique.",
        desc_drm_unique: "Supported DRM systems narrow down OS/Browser combo."
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
  graphicsModal: {
    supported_features: "Supported Features",
    no_params_found: "No parameters found matching",
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
    op_write: "Write",
    worker_status: "Dedicated Web Worker Active (Fast Sync IO Enabled)"
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
  },
  aiPlayground: {
    title: "AI Playground",
    desc: "Run lightweight AI models locally in your browser via WebAssembly. Privacy first - no data leaves your device.",
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
  rayTracing: {
    title: "GPU Ray Tracing",
    start: "Start Benchmark",
    stop: "Stop",
    fps: "FPS",
    spp: "Samples Per Pixel",
    bounces: "Bounces",
    resolution: "Resolution",
    error_webgpu: "WebGPU is not supported in this browser. Please use Chrome 113+ or Edge.",
    desc: "Real-time Path Tracing Benchmark powered by WebGPU Compute Shaders.",
    controls: "Material Controls",
    roughness: "Roughness",
    metalness: "Metalness",
    color: "Sphere Color",
    reset: "Reset Camera"
  },
  "extensionsModal": {
    "title": "Browser Extension Inventory",
    "note_strong": "Note:",
    "note_text": "Browsers do not provide a native API for web pages to list installed extensions for privacy and security reasons. This inventory uses heuristics (e.g., detecting injected variables or DOM elements) to identify common extensions. It is not a complete list of your installed extensions.",
    "no_extensions": "No well-known extensions detected.",
    "detected": "Detected",
    "categories": {
      "Development": "Development",
      "Crypto": "Crypto",
      "Shopping": "Shopping",
      "Productivity": "Productivity",
      "Utility": "Utility"
    },
    "names": {
      "react-devtools": "React Developer Tools",
      "vue-devtools": "Vue.js devtools",
      "redux-devtools": "Redux DevTools",
      "apollo-devtools": "Apollo Client Devtools",
      "ember-inspector": "Ember Inspector",
      "metamask": "MetaMask",
      "phantom": "Phantom",
      "binance": "Binance Wallet",
      "coinbase": "Coinbase Wallet",
      "brave-wallet": "Brave Wallet",
      "sui-wallet": "Sui Wallet",
      "honey": "Honey",
      "grammarly": "Grammarly",
      "darkreader": "Dark Reader"
    },
    "descs": {
      "react-devtools": "Official React debugging extension",
      "vue-devtools": "Official Vue debugging extension",
      "redux-devtools": "Redux state debugging",
      "apollo-devtools": "GraphQL debugging",
      "ember-inspector": "Ember debugging",
      "metamask": "Web3 Ethereum wallet",
      "phantom": "Web3 Solana wallet",
      "binance": "Web3 Binance Chain wallet",
      "coinbase": "Web3 Coinbase wallet",
      "brave-wallet": "Built-in Brave crypto wallet",
      "sui-wallet": "Web3 Sui wallet",
      "honey": "Automatic Coupons",
      "grammarly": "Writing Assistant",
      "darkreader": "Dark mode for websites"
    }
  }
,
  "ja3Modal": {
    "title": "SSL/TLS Fingerprint (JA3/JA4)",
    "desc_title": "TLS Client Hello Fingerprinting",
    "desc": "During the HTTPS handshake, the browser sends a Client Hello message containing supported cipher suites, TLS extensions, etc. JA3/JA4 fingerprints these TCP/TLS characteristics to accurately identify the real browser engine or detect bots, proxies, and spoofed user agents.",
    "fetching": "Analyzing TLS Handshake...",
    "retry": "Retry",
    "ja3_title": "JA3 Fingerprint",
    "ja3_hash": "JA3 Hash (MD5)",
    "ja3_string": "JA3 String (Raw)",
    "ja3n_title": "JA3N Fingerprint",
    "ja3n_hash": "JA3N Hash (MD5)",
    "ja3n_string": "JA3N String (Raw)",
    "server_ua": "Server Detected User-Agent"
  },
  "attributionsModal": {
    "title": "Software & Asset Attributions",
    "subtitle": "Documenting third-party open source open-source libraries, frameworks, and typography that empower the BrowserScope analytics dashboard.",
    "search_placeholder": "Search libraries, packages or fonts...",
    "tab_all": "All Assets",
    "tab_libraries": "Libraries & Packages",
    "tab_fonts": "Typography & Fonts",
    "view_license": "View License Text",
    "hide_license": "Hide License Text",
    "license_type": "License",
    "role_label": "Role & Integration",
    "visit_site": "Visit Repository",
    "empty_search": "No attributions found matching \"{query}\"",
    "font_role": "High-legibility typography for the user interface, layout, headings, and data visualization.",
    "lib_role_react": "Modern reactive rendering engine and state architecture for modular interactive widgets.",
    "lib_role_fingerprint": "Multi-generational visitor identification engines to calculate entropy and verify device consistency.",
    "lib_role_transformers": "In-browser WebAssembly-based neural inference framework to evaluate local AI models on client CPU/GPU.",
    "lib_role_lucide": "Crisp, fully scalable SVG interface icons and metadata representations.",
    "lib_role_motion": "Hardware-accelerated fluid component layout, entrance, and transition animations.",
    "lib_role_screenshot": "High-fidelity canvas rendering of active DOM trees to generate exportable screenshot reports.",
    "lib_role_jspdf": "Multi-threaded client-side compilation of PDF document matrices.",
    "lib_role_devtools": "Mobile-optimized browser logs and inspect element debugging console suites.",
    "lib_role_pwa": "Offline-first asset precaching and service worker client management.",
    "lib_role_server": "Express server API routing, rate limiting, and secure HTTP header sanitization.",
    "lib_role_charts": "Responsive interactive charts, gauges, graphs, and network telemetry telemetry vectors.",
    "close": "Close"
  }

};
