
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
    security: string; // New
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
    tab_cdn: string;
    tab_conn: string;
    tab_resources: string;
    cdn_status: string;
    latency: string;
    check_all: string;
    url_placeholder: string;
    test_conn: string;
    test_result: string;
    resource_list: string;
    res_name: string;
    res_type: string;
    res_duration: string;
    close: string;
  };
}
