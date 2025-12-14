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
    fingerprints: "Digital Fingerprints",
    features: "Web Capabilities & APIs",
    pwa: "PWA & Offline Capabilities",
    permissions: "Permissions"
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
    memory: "Device Memory",
    gpu_vendor: "GPU Vendor",
    gpu_renderer: "GPU Renderer",
    max_texture: "Max Texture Size",
    audio_rate: "Audio Sample Rate",
    battery: "Battery Level",
    charging: "Charging State",
    touch: "Max Touch Points",
    canvas_hash: "Canvas Hash",
    webgl_hash: "WebGL Hash",
    audio_latency: "Audio Latency",
    fp_score: "Uniqueness Score",
    
    resolution: "Screen Resolution",
    refresh_rate: "Refresh Rate (Est.)",
    avail_size: "Available Size",
    window_size: "Window Size",
    pixel_ratio: "Pixel Ratio",
    color_depth: "Color Depth",
    orientation: "Orientation",
    dark_mode: "Dark Mode",
    color_gamut: "Color Gamut",
    hdr: "HDR Support",
    display_mode: "Display Mode",
    
    online: "Online Status",
    conn_type: "Connection Type",
    downlink: "Downlink Speed",
    rtt: "Latency (RTT)",
    save_data: "Data Saver",
    
    timezone: "Time Zone",
    locale: "Locale",
    calendar: "Calendar",
    storage_quota: "Est. Storage Quota",
    storage_usage: "Used Storage",
    storage_persisted: "Persistence",
    
    video_codecs: "Video Codecs",
    audio_codecs: "Audio Codecs",

    media_devices: "Media Devices",
    perm_camera: "Camera",
    perm_mic: "Microphone",
    perm_geo: "Geolocation",
    perm_notif: "Notifications",
    perm_midi: "MIDI Devices",

    geo_lat: "Latitude",
    geo_long: "Longitude",
    geo_acc: "Accuracy"
  },
  
  values: {
    connected: "Connected",
    offline: "Offline",
    supported: "Supported",
    not_supported: "Not Supported",
    yes: "Yes",
    no: "No",
    unknown: "Unknown"
  },

  actions: {
    check: "Check Access",
    export_json: "Export JSON",
    view_extensions: "View Extensions",
    view_base64: "Base64",
    view_details: "View Details",
    open_sensors: "Open Sensors",
    copy: "Copy",
    copied: "Copied!",
    zoom: "Zoom",
    theme_dark: "Dark",
    theme_light: "Light",
    about: "About & Changelog"
  },

  status: {
    idle: "Not Checked",
    granted: "Access Granted",
    denied: "Access Denied",
    prompt: "Prompt / Ask",
    error: "Error / Unavailable"
  },

  cameraTool: {
    title: "Camera Tool",
    btn_open: "Open Camera",
    select_device: "Select Device",
    no_devices: "No video devices found",
    take_photo: "Take Photo",
    start_record: "Record Video",
    stop_record: "Stop Record",
    mirror: "Mirror",
    retake: "Retake",
    download_photo: "Download Photo",
    download_video: "Download Video",
    close: "Close",
    current_res: "Current Resolution",
    max_res: "Max Hardware Resolution",
    permission_denied: "Camera permission denied",
    error_hardware: "Camera in use or hardware error",
    error_generic: "Error accessing camera"
  },

  audioTool: {
    title: "Audio Recorder",
    btn_open: "Open Recorder",
    start_record: "Record Audio",
    stop_record: "Stop Recording",
    download: "Download Audio",
    close: "Close",
    listening: "Listening...",
    error_mic: "Microphone access denied or error",
    details_size: "File Size",
    details_rate: "Sample Rate",
    details_type: "Format"
  },

  webglTool: {
    title: "WebGL Extensions",
    count: "Extensions Found",
    search_placeholder: "Search extensions...",
    close: "Close"
  },

  base64Tool: {
    title: "Canvas Base64 Data",
    desc: "Raw data representation of the rendered canvas fingerprint.",
    copy: "Copy Base64",
    close: "Close"
  },

  aboutModal: {
    title: "About BrowserScope",
    version: "Version",
    desc: "A lightweight, privacy-focused tool to check your browser capabilities, hardware info, and network status locally.",
    changelog: "Changelog",
    latest_update: "Added real-time sensor monitor (accelerometer/gyro), fingerprint uniqueness scoring system, and improved UI details.",
    close: "Close"
  },

  sensorModal: {
    sensor_title: "Real-time Sensors",
    accelerometer: "Accelerometer",
    gyroscope: "Gyroscope",
    sensor_permission_desc: "This feature requires access to device motion sensors. Please allow access to proceed.",
    sensor_allow: "Allow Sensor Access",
    close: "Close"
  },

  scoreModal: {
    score_details_title: "Fingerprint Score Details",
    tracking_potential: "Tracking Potential",
    score_explanation: "Higher score indicates more unique identifying data is available to websites, increasing trackability.",
    contributing_factors: "Contributing Factors",
    close: "Close"
  },

  imageDetails: {
    dimensions: "Dimensions",
    size: "File Size"
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
    ambientLight: "Ambient Light Sensor",
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
    accelerometer: "Motion sensor (API support)",
    gyroscope: "Orientation sensor (API support)",
    ambientLight: "Light level sensor (API support)",
  }
};
