
export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK' | 'ja' | 'ru';

export interface Translation {
  loading: string;
  title: string;
  subtitle: string;
  refresh: string;
  footer: string;
  
  sections: {
    system: string;
    hardware: string;
    display: string;
    network: string;
    storage_loc: string;
    media_sup: string;
    user_agent: string;
    features: string;
    permissions: string;
    pwa: string;
    fingerprints: string;
    security: string;
    ai_compute: string; 
  };
  
  labels: Record<string, string>;
  values: Record<string, string>;
  actions: Record<string, string>;
  status: Record<string, string>;
  
  features: Record<string, string>;
  featureDescs: Record<string, string>;

  // Tools & Modals
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
    updates: Array<{
        version: string;
        date: string;
        changes: string[];
    }>;
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

  settingsModal: {
    title: string;
    tab_general: string;
    tab_network: string;
    tab_display: string;
    tab_storage: string;
    tab_resources: string;
    tab_developer: string; // New
    simple_mode_title: string;
    simple_mode_desc: string;
    
    // Network
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

    // Display
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

    // Storage
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
    
    // Developer
    dev_events: string;
    dev_inspector: string;
    dev_console: string;
    dev_console_placeholder: string;
    dev_run: string;
    dev_clear: string;
    dev_copy_log: string;

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
    status_pending: string;
    status_running: string;
    status_done: string;
    results_title: string;
    close: string;
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
    close: string;
  };
}
