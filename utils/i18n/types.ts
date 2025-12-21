
export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK' | 'ja' | 'ru';

export interface Translation {
  title: string;
  subtitle: string;
  loading: string;
  loading_steps: string[];
  footer: string;
  refresh: string;
  
  sections: {
    system: string;
    hardware: string;
    display: string;
    network: string;
    security: string;
    ai_compute: string;
    fingerprints: string;
    location: string;
    permissions: string;
    media_sup: string;
    user_agent: string;
    pwa: string;
    features: string;
    storage: string;
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
    gpu_renderer: string;
    battery: string;
    gamepads: string;
    resolution: string;
    refresh_rate: string;
    avail_size: string;
    pixel_ratio: string;
    color_depth: string;
    screen_extended: string;
    orientation: string;
    hdr: string;
    display_mode: string;
    dark_mode: string;
    online: string;
    conn_type: string;
    net_type: string;
    downlink: string;
    downlink_max: string;
    rtt: string;
    save_data: string;
    is_bot: string;
    ad_block: string;
    secure_context: string;
    webrtc_ip: string;
    gpc_enabled: string;
    pdf_viewer: string;
    ai_readiness: string;
    window_ai: string;
    webnn: string;
    fp_score: string;
    canvas_hash: string;
    webgl_hash: string;
    audio_rate: string;
    audio_latency: string;
    storage_quota: string;
    storage_usage: string;
    storage_persisted: string;
    local_time: string;
    timezone: string;
    locale: string;
    calendar: string;
    geo_lat: string;
    geo_long: string;
    geo_acc: string;
    perm_notif: string;
    perm_midi: string;
    perm_geo: string;
    perm_camera: string;
    perm_mic: string;
    media_devices: string;
    video_codecs: string;
    audio_codecs: string;
    image_formats: string;
    drm_support: string;
    speech_voices: string;
    audio_channels: string;
    pwa_install_status: string;
  };

  values: {
    supported: string;
    not_supported: string;
    detected: string;
    none: string;
    hidden: string;
    yes: string;
    no: string;
    connected: string;
    offline: string;
    installed: string;
    not_installed: string;
  };

  status: {
    granted: string;
    denied: string;
    prompt: string;
    error: string;
    idle: string;
  };

  actions: {
    run_benchmark: string;
    about: string;
    export_json: string;
    open_sensors: string;
    open_tools: string;
    open_vision: string;
    view_details: string;
    view_base64: string;
    view_extensions: string;
    copy: string;
    copied: string;
    check: string;
    open_map: string;
  };

  features: Record<string, string>;
  featureDescs: Record<string, string>;

  // Modals
  cameraTool: {
    title: string;
    btn_open: string;
    select_device: string;
    take_photo: string;
    start_record: string;
    stop_record: string;
    retake: string;
    download_photo: string;
    download_video: string;
    current_res: string;
    max_res: string;
    mirror: string;
    no_devices: string;
    permission_denied: string;
    error_hardware: string;
    error_generic: string;
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
    error_mic: string;
    close: string;
  };

  webglTool: {
    title: string;
    count: string;
    search_placeholder: string;
    spec_link: string;
    close: string;
  };

  imageDetails: {
    dimensions: string;
    size: string;
  };

  base64Tool: {
    title: string;
    desc: string;
    copy: string;
    close: string;
  };

  aboutModal: {
    title: string;
    desc: string;
    version: string;
    latest_update: string;
    history: string;
    updates: Array<{version: string, date: string, changes: string[]}>;
    close: string;
  };

  sensorModal: {
    sensor_title: string;
    sensor_permission_desc: string;
    sensor_allow: string;
    accelerometer: string;
    gyroscope: string;
    magnetometer: string;
    ambient_light: string;
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

  fingerprintModal: {
    title: string;
    desc: string;
    tab_v4: string;
    tab_v2: string;
    tab_fonts: string;
    salt_label: string;
    font_detect_desc: string;
    visitor_id: string;
    time_taken: string;
    generating: string;
    components_label: string;
    select_all: string;
    deselect_all: string;
    font_list_title: string;
    copy: string;
    copied: string;
    close: string;
  };

  settingsModal: {
    title: string;
    tab_general: string;
    tab_network: string;
    tab_display: string;
    tab_storage: string;
    tab_resources: string;
    tab_developer: string;
    
    // General
    simple_mode_title: string;
    simple_mode_desc: string;
    scrollbar_title: string;
    scrollbar_desc: string;
    time_format_title: string;
    time_format_desc: string;
    disable_blur_title: string;
    disable_blur_desc: string;
    
    // Network
    fetch_ip: string;
    check_ipv6: string;
    ipv6_success: string;
    ipv6_fail: string;
    network_adv_title: string;
    network_webrtc_title: string;
    network_webrtc_desc: string;
    network_webrtc_btn: string;
    col_type: string;
    col_ip: string;
    col_protocol: string;
    col_port: string;
    network_dns_title: string;
    network_dns_desc: string;
    network_dns_btn: string;
    lbl_dns_ip: string;
    lbl_dns_geo: string;
    proto_title: string;
    proto_desc: string;
    proto_check_btn: string;
    proto_http2: string;
    proto_http3: string;
    test_conn: string;
    url_placeholder: string;
    cdn_status: string;
    check_all: string;

    // Display
    dead_pixel_title: string;
    dead_pixel_desc: string;
    color_red: string;
    color_green: string;
    color_blue: string;
    color_white: string;
    color_black: string;
    hdr_status_title: string;
    hdr_support: string;
    hdr_dynamic_range: string;
    hdr_video_dynamic_range: string;
    hdr_brightness_test: string;
    hdr_brightness_desc: string;
    hdr_sdr_white: string;
    hdr_edr_white: string;
    gamut_test_title: string;
    gamut_test_desc: string;
    unsupported_p3: string;
    hdr_test_title: string;
    hdr_test_desc: string;

    // Storage
    storage_title: string;
    clear_data: string;
    clear_btn: string;
    sw_title: string;
    sw_desc: string;
    sw_btn: string;
    storage_usage: string;

    // Resources
    resource_list: string;
    res_name: string;
    res_type: string;
    res_duration: string;

    // Developer
    dev_warning_title: string;
    dev_warning_desc: string;
    dev_warning_agree: string;
    dev_events: string;
    dev_inspector: string;
    dev_console: string;
    dev_float: string;
    dev_dock_back: string;
    dev_events_placeholder: string;
    dev_copy_log: string;
    dev_clear: string;
    dev_console_placeholder: string;
    dev_input_clear: string;
    dev_result_placeholder: string;
    dev_output_copy: string;
    dev_output_download: string;
    dev_output_clear: string;
    dev_quick_commands: string;
    dev_run_now: string;
    
    close: string;
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
    btn_scan_bt: string;
    bt_scanning: string;
    bt_devices: string;
    bt_no_devices: string;
    bt_not_supported: string;
  };

  hardwareToolsModal: {
    title: string;
    tab_vibrate: string;
    tab_touch: string;
    tab_keyboard: string;
    tab_mouse: string;
    tab_pointer: string;
    tab_video: string;
    vibrate_not_supported: string;
    vibrate_short: string;
    vibrate_medium: string;
    vibrate_pattern: string;
    touch_instruction: string;
    touch_count: string;
    key_instruction: string;
    key_last: string;
    key_history: string;
    key_input_placeholder: string;
    mouse_instruction: string;
    mouse_rate: string;
    mouse_peak: string;
    pointer_instruction: string;
    pointer_pressure: string;
    pointer_tilt: string;
    pointer_type: string;
    video_instruction: string;
    video_codec: string;
    video_res: string;
    video_efficient: string;
    video_smooth: string;
  };

  visionModal: {
    title: string;
    unsupported_desc: string;
    api_status: string;
    detect_mode: string;
    camera_source: string;
    latency: string;
    hw_accel: string;
    sw_decode: string;
    sw_warning: string;
    native_api: string;
    polyfill: string;
    detecting: string;
    formats: string;
    perf: string;
    fps: string;
    last_result: string;
    start_cam: string;
    stop_cam: string;
    switch_cam: string;
    no_cam_error: string;
    auto_scan: string;
    manual_capture: string;
  };
}
