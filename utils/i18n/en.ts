
import { Translation } from './types';

export const en: Translation = {
  loading: "Scanning system capabilities...",
  loading_steps: [
    "Initializing environment...",
    "Detecting hardware & GPU...",
    "Analyzing network status...",
    "Checking security & privacy...",
    "Benchmarking AI readiness...",
    "Finalizing report..."
  ],
  title: "BrowserScope",
  subtitle: "A comprehensive analysis of your browser environment, hardware capabilities, and supported Web APIs.",
  refresh: "Refresh Analysis",
  footer: "All data is detected locally within your browser. No personal data is uploaded.",
  
  // ... rest of file remains the same ...
  sections: {
    system: "System & Software",
    hardware: "Hardware & Graphics",
    display: "Display & Screen",
    network: "Network & Connection",
    storage: "Storage",
    location: "Location & Time",
    media_sup: "Media Capabilities",
    fingerprints: "Fingerprinting & Tracking",
    features: "Web API Capabilities",
    permissions: "Permissions",
    pwa: "PWA Capabilities",
    user_agent: "User Agent",
    security: "Privacy & Security",
    ai_compute: "AI & Compute"
  },

  settingsModal: {
    title: "Settings & Tools",
    tab_general: "General",
    tab_network: "Network",
    tab_display: "Display",
    tab_storage: "Storage",
    tab_resources: "Resources",
    tab_developer: "Developer",
    
    simple_mode_title: "Simple Mode",
    simple_mode_desc: "Hide technical details and show only core system information.",
    scrollbar_title: "Hide Scrollbar",
    scrollbar_desc: "Hide the browser scrollbar to maximize screen real estate.",
    time_format_title: "24-Hour Clock",
    time_format_desc: "Switch between 12-hour (AM/PM) and 24-hour time formats.",
    disable_blur_title: "Disable Blur Effects",
    disable_blur_desc: "Turn off frosted glass effects to reduce GPU usage. Recommended for older devices.",
    
    public_ip: "Public IP Address",
    fetch_ip: "Detect IP",
    ipv6_title: "IPv6 Connectivity",
    check_ipv6: "Check IPv6",
    ipv6_success: "IPv6 Supported",
    ipv6_fail: "Not Detected / IPv4 Only",
    ip_info: "IP Details",
    provider: "ISP / Provider",
    location: "Location",
    cdn_status: "CDN Status",
    latency: "Latency",
    check_all: "Check All",
    url_placeholder: "Enter URL (e.g., https://google.com)",
    test_conn: "Test Connection",
    test_result: "Result",

    display_test: "Screen Defects Test",
    dead_pixel_title: "Dead Pixel Check",
    dead_pixel_desc: "Click a color to enter full screen. Check for pixels that don't light up or change color.",
    color_red: "Red",
    color_green: "Green",
    color_blue: "Blue",
    color_white: "White",
    color_black: "Black",
    
    gamut_test_title: "Wide Gamut Visualizer (P3)",
    gamut_test_desc: "If your display supports Wide Color Gamut (P3), you will see a shape or text faintly inside the colored squares.",
    hdr_test_title: "Color Depth & Banding",
    hdr_test_desc: "Check for smooth gradients. Visible banding indicates 8-bit color depth or compression.",
    unsupported_p3: "Browser does not support color(display-p3) syntax",
    hdr_status_title: "HDR Capabilities",
    hdr_support: "HDR Support",
    hdr_dynamic_range: "Dynamic Range",
    hdr_video_dynamic_range: "Video Dynamic Range",
    hdr_brightness_test: "Peak Brightness (EDR) Test",
    hdr_brightness_desc: "If your display supports Extended Dynamic Range (HDR), the center square should appear significantly brighter than the surrounding 'Standard White'.",
    hdr_sdr_white: "SDR White (Standard)",
    hdr_edr_white: "HDR White (High Brightness)",

    storage_title: "Local Data",
    clear_data: "Clear Site Data",
    clear_btn: "Clear Storage",
    sw_title: "Service Workers",
    sw_desc: "Unregister active Service Workers to reset PWA state.",
    sw_btn: "Unregister",

    resource_list: "Loaded Resources",
    res_name: "Resource URL",
    res_type: "Type",
    res_duration: "Duration",

    dev_events: "Event Monitor",
    dev_inspector: "Object Inspector",
    dev_console: "JS Console",
    dev_console_placeholder: "Enter JavaScript... ('\\' for presets)",
    dev_run: "Run",
    dev_clear: "Clear Log",
    dev_copy_log: "Copy Log",
    dev_float: "Float Window",
    dev_warning_title: "Developer Mode Warning",
    dev_warning_desc: "This tool allows executing arbitrary JavaScript and inspecting internal browser objects. Running malicious code could compromise your security. Proceed only if you understand the risks.",
    dev_warning_agree: "I understand and proceed",

    dev_quick_commands: "Quick Commands",
    dev_result_placeholder: "Execution result will appear here...",
    dev_events_placeholder: "Listening for window events...",
    dev_input_clear: "Clear Input",
    dev_output_copy: "Copy Output",
    dev_output_download: "Download Output",
    dev_output_clear: "Clear Output",
    dev_dock_back: "Dock Back",
    dev_run_now: "Run Immediately",

    network_adv_title: "Advanced Diagnostics",
    network_webrtc_title: "WebRTC Leak Test",
    network_webrtc_desc: "Analyze ICE candidates generated by your browser to detect local IP leaks and STUN/TURN connectivity.",
    network_webrtc_btn: "Start WebRTC Analysis",
    network_dns_title: "DNS Leak Test",
    network_dns_desc: "Attempt to identify the DNS resolver used by your connection to check for potential leaks.",
    network_dns_btn: "Check DNS Resolver",
    
    col_type: "Type",
    col_ip: "IP Address",
    col_protocol: "Protocol",
    col_port: "Port",
    
    lbl_resolution: "Resolution",
    lbl_dns_ip: "Resolver IP",
    lbl_dns_geo: "Location",
    
    proto_title: "Protocol Support",
    proto_desc: "Check browser support for modern transport protocols (HTTP/2, HTTP/3 QUIC).",
    proto_check_btn: "Check Protocols",
    proto_http2: "HTTP/2",
    proto_http3: "HTTP/3 (QUIC)",

    close: "Close"
  },

  labels: {
    os: "Operating System",
    platform: "Platform",
    browser: "Browser Engine",
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
    
    resolution: "Screen Resolution",
    refresh_rate: "Refresh Rate",
    avail_size: "Available Size",
    window_size: "Window Size",
    pixel_ratio: "Pixel Ratio (DPR)",
    color_depth: "Color Depth",
    orientation: "Orientation",
    orientation_angle: "Angle", 
    screen_extended: "Extended Screen",
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
    webrtc_ip: "WebRTC Exposed IP",
    
    timezone: "Time Zone",
    locale: "Locale",
    calendar: "Calendar",
    local_time: "Local Time",
    storage_quota: "Storage Quota",
    storage_usage: "Used Storage",
    storage_persisted: "Persisted Storage",
    
    video_codecs: "Video Codecs",
    audio_codecs: "Audio Codecs",
    image_formats: "Image Formats", 
    speech_voices: "TTS Voices",
    audio_channels: "Audio Channels", 
    drm_support: "DRM Support",

    is_bot: "Automation (Bot)",
    ad_block: "Ad Blocker",
    secure_context: "Secure Context",
    gpc_enabled: "Global Privacy Control",
    pdf_viewer: "PDF Viewer",

    ai_readiness: "AI Readiness",
    window_ai: "Chrome Built-in AI",
    webnn: "Web Neural Network API",

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

    pwa_install_status: "Install Status",
    gamepads: "Connected Gamepads"
  },

  values: {
    connected: "Connected",
    offline: "Offline",
    supported: "Supported",
    not_supported: "Not Supported",
    yes: "Yes",
    no: "No",
    unknown: "Unknown",
    installed: "Installed",
    not_installed: "Not Installed",
    detected: "Detected",
    none: "None",
    hidden: "Hidden/Protected"
  },

  actions: {
    check: "Check",
    theme_light: "Switch to Light Mode",
    theme_dark: "Switch to Dark Mode",
    about: "About App",
    export_json: "Export JSON",
    open_sensors: "Sensors",
    open_tools: "Hardware Tools",
    run_benchmark: "Benchmark",
    view_details: "View Details",
    view_base64: "View Base64",
    view_extensions: "View Extensions",
    copy: "Copy",
    copied: "Copied!",
    open_map: "Open Maps"
  },

  status: {
    idle: "Idle",
    granted: "Granted",
    denied: "Denied",
    prompt: "Prompt",
    error: "Error"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "Background Sync",
    pushApi: "Push API",
    notification: "Notification API",
    appBadges: "App Badges",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
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
    ambientLight: "Ambient Light Sensor"
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
    error_hardware: "Camera hardware error",
    error_generic: "Camera access error",
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
    error_mic: "Microphone access error"
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
    desc: "Generates a unique visitor identifier using various browser attributes. You can toggle parameters below to see how they affect the hash.",
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
    font_detect_desc: "Detects installed system fonts by measuring text rendering width. This is a common fingerprinting vector.",
    font_list_title: "Detected Fonts"
  },

  imageDetails: {
    dimensions: "Dimensions",
    size: "Size"
  },

  aboutModal: {
    title: "About BrowserScope",
    desc: "BrowserScope is a comprehensive browser analysis tool designed to verify your system capabilities and fingerprint uniqueness, all locally.",
    version: "Version",
    changelog: "Changelog",
    latest_update: "Added Hardware Tools & Storage Benchmarks",
    close: "Close",
    history: "Update History",
    updates: [
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: [
                "Added Hardware Interaction Tools (Vibration & Multi-touch).",
                "Added Storage I/O Benchmark (IndexedDB).",
                "Added Font Fingerprinting detection.",
                "Improved WebGL Extensions viewer with grouping and search.",
                "Fixed UI animations and modal interactions."
            ]
        },
        {
            version: "1.1.0",
            date: "2024-02-28",
            changes: [
                "Introduced AI & Compute capabilities (WebNN, Gemini Nano).",
                "Added Camera & Microphone diagnostic tools.",
                "Enhanced Device Sensor visualization (Accelerometer, Gyroscope)."
            ]
        },
        {
            version: "1.0.0",
            date: "2024-01-10",
            changes: [
                "Initial release with core system detection.",
                "Browser Fingerprinting (Canvas, WebGL).",
                "Network speed and latency estimation."
            ]
        }
    ]
  },

  sensorModal: {
    sensor_title: "Device Sensors",
    sensor_permission_desc: "Permission is required to access motion sensors.",
    sensor_allow: "Allow Access",
    accelerometer: "Accelerometer",
    gyroscope: "Gyroscope",
    magnetometer: "Magnetometer",
    close: "Close"
  },

  scoreModal: {
    score_details_title: "Fingerprint Score Details",
    tracking_potential: "Tracking Potential",
    score_explanation: "A higher score means more unique identifying data is available to websites, increasing tracking risk.",
    contributing_factors: "Contributing Factors",
    close: "Close",

    factors: {
      canvas_hash: "Canvas Fingerprint",
      webgl_hash: "WebGL Fingerprint",
      hardware_concurrency: "Hardware (CPU/RAM)",
      user_agent: "User Agent",
      resolution: "Screen Resolution",
      audio_context: "Audio Context",
      battery_status: "Battery Status",
      locale_time: "Locale & Time"
    },
    values: {
      val_unique: "Unique / High Entropy",
      val_generic: "Generic / Confusing",
      val_specific: "Specific",
      val_readable: "Readable",
      val_protected: "Protected",
      val_unknown: "Unknown"
    },
    descriptions: {
      desc_canvas_unique: "Canvas rendering differences expose GPU/Driver stack.",
      desc_canvas_generic: "Canvas fingerprint failed or is blocked.",
      desc_webgl_unique: "WebGL report exposes specific graphics hardware.",
      desc_webgl_generic: "WebGL fingerprint failed or is blocked.",
      desc_hardware_unique: "CPU core count and device memory are identifying factors.",
      desc_hardware_generic: "Hardware details are partially hidden.",
      desc_ua_unique: "Detailed User Agent string reveals browser and OS versions.",
      desc_res_unique: "Screen dimensions combined with window size create a unique footprint.",
      desc_audio_unique: "Audio hardware sample rate and latency.",
      desc_battery_unique: "Battery API allows tracking users across sessions.",
      desc_battery_generic: "Battery status is hidden or unsupported.",
      desc_locale_unique: "Timezone and language settings narrow down location."
    }
  },

  benchmarkModal: {
    title: "Performance Benchmark",
    start_btn: "Start Tests",
    running: "Running...",
    score: "Total Score",
    cpu_test: "CPU Primes",
    math_test: "Math Operations",
    memory_test: "Memory Throughput",
    dom_test: "DOM Manipulation",
    gpu_test: "Canvas 2D Render",
    storage_test: "Storage I/O"
  },

  hardwareToolsModal: {
    title: "Hardware Tools",
    tab_vibrate: "Vibration",
    tab_touch: "Multi-Touch",
    vibrate_not_supported: "Vibration API not supported on this device",
    vibrate_short: "Short (200ms)",
    vibrate_medium: "Medium (500ms)",
    vibrate_pattern: "Pulse Pattern",
    touch_instruction: "Touch or move on the screen area below",
    touch_count: "Touch Points"
  },

  aiPlayground: {
    title: "AI Playground",
    desc: "Run lightweight AI models locally in your browser. No data leaves your device.",
    model_name: "Model",
    loading_model: "Loading Model...",
    input_placeholder: "Enter text for sentiment analysis...",
    result_label: "Analysis Result",
    confidence: "Confidence"
  },

  gamepadTool: {
    title: "Gamepad Tester",
    tab_gamepad: "Gamepad",
    tab_bluetooth: "Bluetooth",
    no_gamepad: "No Gamepad Detected",
    connect_instruction: "Connect your controller and press any button to activate.",
    bt_devices: "Discovered Devices",
    bt_scanning: "Scanning...",
    btn_scan_bt: "Scan Bluetooth",
    bt_not_supported: "Web Bluetooth not supported",
    bt_no_devices: "No devices found"
  }
};