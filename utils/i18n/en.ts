
import { Translation } from './types';

export const en: Translation = {
  loading: "Scanning System Capabilities...",
  title: "BrowserScope",
  subtitle: "Detailed analysis of your browser environment, hardware capabilities, and supported web APIs.",
  refresh: "Refresh Analysis",
  footer: "Data is detected locally in your browser. No personal data is stored.",
  
  sections: {
    system: "System & Software",
    hardware: "Hardware & Graphics",
    display: "Display & Screen",
    network: "Network & Connection",
    storage_loc: "Storage & Localization",
    media_sup: "Media Capabilities",
    user_agent: "User Agent",
    features: "Web Capabilities & APIs",
    permissions: "Permissions",
    pwa: "PWA Features",
    fingerprints: "Fingerprints & Tracking",
    security: "Privacy & Security",
    ai_compute: "AI & Computing"
  },
  
  labels: {
    os: "Operating System",
    platform: "Platform",
    browser: "Browser",
    language: "Language",
    pref_langs: "Preferred Languages",
    cookies: "Cookies Enabled",
    dnt: "Do Not Track",
    
    cpu: "CPU Cores",
    cpu_model: "CPU Model (Est.)",
    memory: "Device Memory",
    gpu_vendor: "GPU Vendor",
    gpu_renderer: "GPU Renderer",
    max_texture: "Max Texture Size",
    audio_rate: "Audio Sample Rate",
    audio_latency: "Audio Latency",
    battery: "Battery Level",
    charging: "Charging State",
    charging_time: "Charging Time",
    discharging_time: "Discharging Time",
    touch: "Max Touch Points",
    screen_extended: "Screen Extended",
    gamepads: "Connected Gamepads",
    
    resolution: "Screen Resolution",
    refresh_rate: "Refresh Rate",
    avail_size: "Available Size",
    window_size: "Window Size",
    pixel_ratio: "Pixel Ratio",
    color_depth: "Color Depth",
    orientation: "Orientation",
    orientation_angle: "Angle",
    dark_mode: "Dark Mode",
    color_gamut: "Color Gamut",
    hdr: "HDR Support",
    display_mode: "Display Mode",
    
    online: "Online Status",
    conn_type: "Connection Type",
    net_type: "Network Tech",
    downlink: "Downlink Speed",
    downlink_max: "Max Downlink",
    rtt: "Latency (RTT)",
    save_data: "Data Saver",
    webrtc_ip: "WebRTC Local IP",
    
    timezone: "Time Zone",
    locale: "Locale",
    calendar: "Calendar",
    storage_quota: "Est. Storage Quota",
    storage_usage: "Used Storage",
    storage_persisted: "Persisted Storage",
    
    video_codecs: "Video Codecs",
    audio_codecs: "Audio Codecs",
    image_formats: "Image Formats",
    speech_voices: "TTS Voices",
    audio_channels: "Channels",

    camera_permission: "Camera Access",
    
    fp_score: "Fingerprint Score",
    canvas_hash: "Canvas Hash",
    webgl_hash: "WebGL Hash",

    perm_notif: "Notifications",
    perm_midi: "MIDI Access",
    perm_geo: "Geolocation",
    geo_lat: "Latitude",
    geo_long: "Longitude",
    geo_acc: "Accuracy",
    media_devices: "Media Devices",
    perm_camera: "Camera",
    perm_mic: "Microphone",

    is_bot: "Bot / Automation",
    gpc_enabled: "Global Privacy Control",
    pdf_viewer: "PDF Viewer",
    secure_context: "Secure Context",
    pwa_install_status: "Installation Status",

    // AI & Compute
    wasm_support: "WebAssembly",
    wasm_simd: "WASM SIMD",
    webnn: "WebNN API",
    window_ai: "Native AI (Gemini Nano)",
    webgpu_compute: "WebGPU Compute"
  },
  
  values: {
    connected: "Connected",
    offline: "Offline",
    supported: "Supported",
    not_supported: "Not Supported",
    yes: "Yes",
    no: "No",
    unknown: "Unknown",
    detected: "Detected",
    none: "None",
    hidden: "Hidden/Protected",
    installed: "Installed",
    not_installed: "Not Installed"
  },

  actions: {
    check: "Check Access",
    theme_light: "Switch to Light Mode",
    theme_dark: "Switch to Dark Mode",
    about: "About",
    export_json: "Export JSON",
    open_sensors: "Sensors",
    view_details: "Details",
    view_base64: "View Base64",
    view_extensions: "Extensions",
    copy: "Copy",
    copied: "Copied!",
    run_benchmark: "Run Benchmark",
    open_tools: "Interactive Tools"
  },

  status: {
    idle: "Not Checked",
    granted: "Access Granted",
    denied: "Access Denied",
    prompt: "Prompt",
    error: "Error / Unavailable"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "Background Sync",
    pushApi: "Push API",
    notification: "Notification API",
    appBadges: "App Badges",
    webgpu: "WebGPU",
    webxr: "WebXR",
    webauthn: "WebAuthn",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "Payment Request",
    nfc: "Web NFC",
    wakeLock: "Screen Wake Lock",
    fsAccess: "File System Access",
    broadcast: "Broadcast Channel",
    webShare: "Web Share API",
    clipboard: "Clipboard API",
    pip: "Picture-in-Picture",
    geo: "Geolocation",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs",
    compression: "Compression Streams",
    webTransport: "Web Transport",
    eyeDropper: "Eye Dropper",
    accelerometer: "Accelerometer",
    gyroscope: "Gyroscope",
    ambientLight: "Ambient Light"
  },
  
  featureDescs: {
    serviceWorker: "Offline capabilities & PWA support",
    bgSync: "Defer actions until user has connectivity",
    pushApi: "Receive push notifications from server",
    notification: "System level notifications",
    appBadges: "Set badges on app icon",
    webgpu: "Next-gen graphics API",
    webxr: "VR and AR capabilities",
    webauthn: "Passwordless authentication",
    bluetooth: "Connect to Bluetooth devices",
    usb: "Connect to USB devices",
    payment: "Native payment processing",
    nfc: "Near Field Communication",
    wakeLock: "Prevent screen from dimming",
    fsAccess: "Read/Write local files",
    broadcast: "Cross-tab communication",
    webShare: "Native sharing dialog",
    clipboard: "Async clipboard access",
    pip: "Floating video player",
    geo: "User location access",
    wasm: "High-performance binary code",
    webCodecs: "Low-level media processing",
    compression: "Native GZIP/Deflate",
    webTransport: "Low-latency bidirectional streaming",
    eyeDropper: "System color picker",
    accelerometer: "Motion sensor",
    gyroscope: "Orientation sensor",
    ambientLight: "Light level sensor"
  },

  cameraTool: {
    title: "Camera Tool",
    btn_open: "Open Camera",
    no_devices: "No camera devices found",
    permission_denied: "Camera permission denied",
    error_hardware: "Hardware error accessing camera",
    error_generic: "Error accessing camera",
    error_mic: "Microphone error",
    select_device: "Select Device",
    current_res: "Current Res",
    max_res: "Max Res",
    mirror: "Mirror",
    take_photo: "Take Photo",
    start_record: "Start Record",
    stop_record: "Stop Record",
    retake: "Retake",
    download_photo: "Download Photo",
    download_video: "Download Video"
  },

  audioTool: {
    title: "Audio Recorder",
    btn_open: "Open Recorder",
    listening: "Listening...",
    start_record: "Start",
    stop_record: "Stop",
    download: "Download",
    details_size: "Size",
    details_rate: "Sample Rate",
    details_type: "Format",
    close: "Close",
    error_mic: "Error accessing microphone"
  },

  webglTool: {
    title: "WebGL Extensions",
    count: "extensions supported",
    search_placeholder: "Search extensions...",
    close: "Close",
    vendor: "Vendor",
    spec_link: "Specification"
  },

  base64Tool: {
    title: "Base64 Data",
    desc: "Raw data representation of the generated fingerprint image",
    copy: "Copy to Clipboard",
    close: "Close"
  },

  fingerprintModal: {
    title: "Browser Fingerprinting",
    desc: "Generate a unique visitor identifier using various browser attributes. You can adjust the parameters below to see how they affect the hash.",
    tab_v4: "FingerprintJS v4 (Modern)",
    tab_v2: "FingerprintJS v2 (Legacy)",
    tab_fonts: "Font Detection",
    btn_run: "Calculate Fingerprint",
    generating: "Generating...",
    visitor_id: "Visitor ID",
    time_taken: "Time Taken",
    params_title: "Calculation Parameters",
    salt_label: "Custom Salt (Seed)",
    components_label: "Included Components",
    select_all: "Select All",
    deselect_all: "Deselect All",
    close: "Close",
    copy: "Copy ID",
    copied: "Copied!",
    font_detect_desc: "Detects installed fonts by measuring text width. This is a common technique for fingerprinting.",
    font_list_title: "Detected Fonts"
  },

  imageDetails: {
    dimensions: "Dimensions",
    size: "Size"
  },

  aboutModal: {
    title: "About BrowserScope",
    desc: "BrowserScope is a comprehensive browser analysis tool designed to verify your system's capabilities and fingerprint uniqueness. It runs entirely in your browser.",
    version: "Version",
    changelog: "Changelog",
    latest_update: "New Hardware Tools & Storage Benchmarking",
    close: "Close",
    history: "Update History",
    updates: [
        {
            version: "1.3.0",
            date: "2024-03-22",
            changes: [
                "Expanded Settings with Display Tests (Dead Pixels).",
                "Added Public IP Detection and Network Analysis.",
                "Added Storage Management tools.",
                "Unified Connectivity and CDN testing."
            ]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: [
                "Added Hardware Interaction Tools (Vibration & Multi-touch Test).",
                "Added Storage I/O Benchmark (IndexedDB) to Performance Test.",
                "Added Font Fingerprinting detection capability.",
                "Improved WebGL Extensions viewer with vendor grouping and search."
            ]
        },
        {
            version: "1.1.0",
            date: "2024-02-28",
            changes: [
                "Introduced AI & Computing capabilities section (WebNN, Gemini Nano).",
                "Added Camera & Microphone diagnostic tools.",
                "Enhanced device sensor visualization (Accelerometer, Gyroscope)."
            ]
        }
    ]
  },

  sensorModal: {
    sensor_title: "Device Sensors",
    sensor_permission_desc: "Permission is required to access device motion sensors.",
    sensor_allow: "Allow Access",
    accelerometer: "Accelerometer",
    gyroscope: "Gyroscope",
    magnetometer: "Magnetometer",
    close: "Close"
  },

  scoreModal: {
    score_details_title: "Fingerprint Score Details",
    tracking_potential: "Tracking Potential",
    score_explanation: "Higher score indicates more unique identifying data is available to websites, increasing trackability.",
    contributing_factors: "Contributing Factors",
    close: "Close",
    
    factors: {
      canvas_hash: "Canvas Fingerprint",
      webgl_hash: "WebGL Fingerprint",
      hardware_concurrency: "Hardware Concurrency",
      user_agent: "User Agent",
      resolution: "Screen Resolution",
      audio_context: "Audio Context",
      battery_status: "Battery Status",
      locale_time: "Locale & Time"
    },
    values: {
      val_unique: "Unique",
      val_generic: "Generic",
      val_specific: "Specific",
      val_readable: "Readable",
      val_protected: "Protected",
      val_unknown: "Unknown"
    },
    descriptions: {
      desc_canvas_unique: "Canvas rendering differences reveal GPU/Driver stack.",
      desc_canvas_generic: "Canvas fingerprinting failed or blocked.",
      desc_webgl_unique: "WebGL report exposes specific graphics hardware.",
      desc_webgl_generic: "WebGL fingerprinting failed or blocked.",
      desc_hardware_unique: "CPU core count and device memory are identifying factors.",
      desc_hardware_generic: "Hardware details partially hidden.",
      desc_ua_unique: "Detailed User Agent string reveals browser and OS version.",
      desc_res_unique: "Screen dimensions combined with window size create a unique footprint.",
      desc_audio_unique: "Audio hardware sample rate and latency.",
      desc_battery_unique: "Battery API allows tracking users across browsing sessions.",
      desc_battery_generic: "Battery status is hidden or unsupported.",
      desc_locale_unique: "Timezone and language settings narrow down location."
    }
  },

  settingsModal: {
    title: "Settings & Tools",
    tab_general: "General",
    tab_network: "Network",
    tab_display: "Display",
    tab_storage: "Storage",
    tab_resources: "Resources",
    simple_mode_title: "Simple Mode",
    simple_mode_desc: "Hide technical details and show only core information on the dashboard.",
    
    public_ip: "Public IP Address",
    fetch_ip: "Detect IP",
    ip_info: "IP Information",
    provider: "ISP / Provider",
    location: "Location",
    cdn_status: "CDN Status",
    latency: "Latency",
    check_all: "Check All",
    url_placeholder: "Enter URL (e.g., https://google.com)",
    test_conn: "Test Connectivity",
    test_result: "Result",

    display_test: "Screen Defects Test",
    dead_pixel_title: "Dead Pixel Check",
    dead_pixel_desc: "Click a color to enter full-screen mode. Look for pixels that do not change color.",
    color_red: "Red",
    color_green: "Green",
    color_blue: "Blue",
    color_white: "White",
    color_black: "Black",

    storage_title: "Local Data",
    clear_data: "Clear Site Data",
    clear_btn: "Clear Storage",
    sw_title: "Service Workers",
    sw_desc: "Unregister active service workers to reset PWA state.",
    sw_btn: "Unregister",

    resource_list: "External Resources",
    res_name: "Resource URL",
    res_type: "Type",
    res_duration: "Duration",
    close: "Close"
  },

  benchmarkModal: {
    title: "System Benchmark",
    start_btn: "Start Benchmark",
    running: "Running Tests...",
    score: "Benchmark Score",
    cpu_test: "CPU Prime Search",
    math_test: "Floating Point Math",
    memory_test: "Memory Throughput",
    dom_test: "DOM Operations",
    gpu_test: "2D Rendering",
    storage_test: "Storage I/O",
    status_pending: "Pending",
    status_running: "Computing...",
    status_done: "Done",
    results_title: "Test Results",
    close: "Close"
  },

  hardwareToolsModal: {
    title: "Interactive Hardware Tools",
    tab_vibrate: "Vibration",
    tab_touch: "Multi-Touch",
    vibrate_not_supported: "Vibration API is not supported on this device.",
    vibrate_short: "Short Pulse (200ms)",
    vibrate_medium: "Medium Pulse (500ms)",
    vibrate_pattern: "SOS Pattern",
    touch_instruction: "Touch the screen with multiple fingers to test support.",
    touch_count: "Active Touch Points",
    close: "Close"
  }
};
