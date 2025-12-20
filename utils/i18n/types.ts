
export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK' | 'ja' | 'ru';

export interface Translation {
  loading: string;
  loading_steps: string[]; // New
  title: string;
  subtitle: string;
  refresh: string;
  footer: string;

  sections: {
    system: string;
    hardware: string;
    display: string;
    network: string;
    storage: string;
    location: string;
    media_sup: string;
    fingerprints: string;
    features: string;
    permissions: string;
    pwa: string;
    user_agent: string;
    security: string;
    ai_compute: string;
  };

  labels: {
    os: string;
    platform: string;
    browser: string;
    language: string;
    pref_langs: string;
    cookies: string;
    dnt: string;
    
    cpu: string;
    cpu_model: string;
    memory: string;
    gpu_vendor: string;
    gpu_renderer: string;
    max_texture: string;
    audio_rate: string;
    audio_latency: string;
    battery: string;
    charging: string;
    charging_time: string;
    discharging_time: string;
    touch: string;
    
    resolution: string;
    refresh_rate: string;
    avail_size: string;
    window_size: string;
    pixel_ratio: string;
    color_depth: string;
    orientation: string;
    orientation_angle: string;
    screen_extended: string;
    dark_mode: string;
    color_gamut: string;
    hdr: string;
    display_mode: string;
    
    online: string;
    conn_type: string;
    net_type: string;
    downlink: string;
    downlink_max: string;
    rtt: string;
    save_data: string;
    webrtc_ip: string;
    
    timezone: string;
    locale: string;
    calendar: string;
    local_time: string;
    storage_quota: string;
    storage_usage: string;
    storage_persisted: string;
    
    video_codecs: string;
    audio_codecs: string;
    image_formats: string;
    speech_voices: string;
    audio_channels: string;
    drm_support: string;

    is_bot: string;
    ad_block: string;
    secure_context: string;
    gpc_enabled: string;
    pdf_viewer: string;

    ai_readiness: string;
    window_ai: string;
    webnn: string;

    camera_permission: string;

    fp_score: string;
    canvas_hash: string;
    webgl_hash: string;

    perm_notif: string;
    perm_midi: string;
    perm_geo: string;
    geo_lat: string;
    geo_long: string;
    geo_acc: string;
    media_devices: string;
    perm_camera: string;
    perm_mic: string;

    pwa_install_status: string;
    gamepads: string;
  };

  values: {
    connected: string;
    offline: string;
    supported: string;
    not_supported: string;
    yes: string;
    no: string;
    unknown: string;
    installed: string;
    not_installed: string;
    detected: string;
    none: string;
    hidden: string;
  };

  actions: {
    check: string;
    theme_light: string;
    theme_dark: string;
    about: string;
    export_json: string;
    open_sensors: string;
    open_tools: string;
    run_benchmark: string;
    view_details: string;
    view_base64: string;
    view_extensions: string;
    copy: string;
    copied: string;
    open_map: string;
  };

  status: {
    idle: string;
    granted: string;
    denied: string;
    prompt: string;
    error: string;
  };

  features: {
    serviceWorker: string;
    bgSync: string;
    pushApi: string;
    notification: string;
    appBadges: string;
    webgpu: string;
    webxr: string;
    webauthn: string;
    bluetooth: string;
    usb: string;
    payment: string;
    nfc: string;
    wakeLock: string;
    fsAccess: string;
    broadcast: string;
    webShare: string;
    clipboard: string;
    pip: string;
    geo: string;
    wasm: string;
    webCodecs: string;
    compression: string;
    webTransport: string;
    eyeDropper: string;
    accelerometer: string;
    gyroscope: string;
    ambientLight: string;
  };

  featureDescs: {
    [key: string]: string;
  };

  settingsModal: {
    title: string;
    tab_general: string;
    tab_network: string;
    tab_display: string;
    tab_storage: string;
    tab_resources: string;
    tab_developer: string;
    
    simple_mode_title: string;
    simple_mode_desc: string;
    scrollbar_title: string;
    scrollbar_desc: string;
    time_format_title: string;
    time_format_desc: string;
    
    public_ip: string;
    fetch_ip: string;
    ipv6_title: string;
    check_ipv6: string;
    ipv6_success: string;
    ipv6_fail: string;
    ip_info: string;
    provider: string;
    location: string;
    cdn_status: string;
    latency: string;
    check_all: string;
    url_placeholder: string;
    test_conn: string;
    test_result: string;

    display_test: string;
    dead_pixel_title: string;
    dead_pixel_desc: string;
    color_red: string;
    color_green: string;
    color_blue: string;
    color_white: string;
    color_black: string;
    
    gamut_test_title: string;
    gamut_test_desc: string;
    hdr_test_title: string;
    hdr_test_desc: string;
    unsupported_p3: string;
    hdr_status_title: string;
    hdr_support: string;
    hdr_dynamic_range: string;
    hdr_video_dynamic_range: string;
    hdr_brightness_test: string;
    hdr_brightness_desc: string;
    hdr_sdr_white: string;
    hdr_edr_white: string;

    storage_title: string;
    clear_data: string;
    clear_btn: string;
    sw_title: string;
    sw_desc: string;
    sw_btn: string;

    resource_list: string;
    res_name: string;
    res_type: string;
    res_duration: string;

    dev_events: string;
    dev_inspector: string;
    dev_console: string;
    dev_console_placeholder: string;
    dev_run: string;
    dev_clear: string;
    dev_copy_log: string;
    dev_float: string;
    dev_warning_title: string;
    dev_warning_desc: string;
    dev_warning_agree: string;
    
    dev_quick_commands: string;
    dev_result_placeholder: string;
    dev_events_placeholder: string;
    dev_input_clear: string;
    dev_output_copy: string;
    dev_output_download: string;
    dev_output_clear: string;
    dev_dock_back: string;
    dev_run_now: string;

    network_adv_title: string;
    network_webrtc_title: string;
    network_webrtc_desc: string;
    network_webrtc_btn: string;
    network_dns_title: string;
    network_dns_desc: string;
    network_dns_btn: string;
    
    col_type: string;
    col_ip: string;
    col_protocol: string;
    col_port: string;
    
    lbl_resolution: string;
    lbl_dns_ip: string;
    lbl_dns_geo: string;
    
    proto_title: string;
    proto_desc: string;
    proto_check_btn: string;
    proto_http2: string;
    proto_http3: string;

    close: string;
  };

  cameraTool: {
    title: string;
    btn_open: string;
    no_devices: string;
    permission_denied: string;
    error_hardware: string;
    error_generic: string;
    error_mic: string;
    select_device: string;
    current_res: string;
    max_res: string;
    mirror: string;
    take_photo: string;
    start_record: string;
    stop_record: string;
    retake: string;
    download_photo: string;
    download_video: string;
  };

  audioTool: {
    title: string;
    btn_open: string;
    listening: string;
    start_record: string;
    stop_record: string;
    download: string;
    details_size: string;
    details_rate: string;
    details_type: string;
    close: string;
    error_mic: string;
  };

  webglTool: {
    title: string;
    count: string;
    search_placeholder: string;
    close: string;
    vendor: string;
    spec_link: string;
  };

  base64Tool: {
    title: string;
    desc: string;
    copy: string;
    close: string;
  };

  fingerprintModal: {
    title: string;
    desc: string;
    tab_v4: string;
    tab_v2: string;
    tab_fonts: string;
    btn_run: string;
    generating: string;
    visitor_id: string;
    time_taken: string;
    params_title: string;
    salt_label: string;
    components_label: string;
    select_all: string;
    deselect_all: string;
    close: string;
    copy: string;
    copied: string;
    font_detect_desc: string;
    font_list_title: string;
  };

  imageDetails: {
    dimensions: string;
    size: string;
  };

  aboutModal: {
    title: string;
    desc: string;
    version: string;
    changelog: string;
    latest_update: string;
    close: string;
    history: string;
    updates: { version: string; date: string; changes: string[] }[];
  };

  sensorModal: {
    sensor_title: string;
    sensor_permission_desc: string;
    sensor_allow: string;
    accelerometer: string;
    gyroscope: string;
    magnetometer: string;
    close: string;
  };

  scoreModal: {
    score_details_title: string;
    tracking_potential: string;
    score_explanation: string;
    contributing_factors: string;
    close: string;
    factors: Record<string, string>;
    values: Record<string, string>;
    descriptions: Record<string, string>;
  };

  benchmarkModal: {
    title: string;
    start_btn: string;
    running: string;
    score: string;
    cpu_test: string;
    math_test: string;
    memory_test: string;
    dom_test: string;
    gpu_test: string;
    storage_test: string;
  };

  hardwareToolsModal: {
    title: string;
    tab_vibrate: string;
    tab_touch: string;
    vibrate_not_supported: string;
    vibrate_short: string;
    vibrate_medium: string;
    vibrate_pattern: string;
    touch_instruction: string;
    touch_count: string;
  };

  aiPlayground: {
    title: string;
    desc: string;
    model_name: string;
    loading_model: string;
    input_placeholder: string;
    result_label: string;
    confidence: string;
  };

  gamepadTool: {
    title: string;
    tab_gamepad: string;
    tab_bluetooth: string;
    no_gamepad: string;
    connect_instruction: string;
    bt_devices: string;
    bt_scanning: string;
    btn_scan_bt: string;
    bt_not_supported: string;
    bt_no_devices: string;
  };
}
