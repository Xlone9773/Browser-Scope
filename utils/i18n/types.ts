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
    fingerprints: string;
    features: string;
    pwa: string;
    permissions: string;
  };
  
  labels: {
    os: string;
    platform: string;
    browser: string;
    language: string;
    cookies: string;
    dnt: string;
    
    cpu: string;
    memory: string;
    gpu_vendor: string;
    gpu_renderer: string;
    max_texture: string;
    audio_rate: string;
    battery: string;
    charging: string;
    touch: string;
    canvas_hash: string;
    webgl_hash: string;
    audio_latency: string;
    
    resolution: string;
    avail_size: string;
    window_size: string;
    pixel_ratio: string;
    color_depth: string;
    orientation: string;
    dark_mode: string;
    color_gamut: string;
    hdr: string;
    display_mode: string;
    
    online: string;
    conn_type: string;
    downlink: string;
    rtt: string;
    save_data: string;
    
    timezone: string;
    locale: string;
    calendar: string;
    storage_quota: string;
    storage_usage: string;
    
    video_codecs: string;
    audio_codecs: string;

    media_devices: string; // Combined card title
    perm_camera: string;
    perm_mic: string;
    perm_geo: string;
    perm_notif: string;
    perm_midi: string;

    geo_lat: string;
    geo_long: string;
    geo_acc: string;
  };
  
  values: {
    connected: string;
    offline: string;
    supported: string;
    not_supported: string;
    yes: string;
    no: string;
    unknown: string;
  };

  actions: {
    check: string;
    export_json: string;
    view_extensions: string; // for WebGL
    view_base64: string; // for Canvas
    copy: string;
    copied: string;
    zoom: string;
    theme_dark: string;
    theme_light: string;
    about: string;
  };

  status: {
    idle: string;
    granted: string;
    denied: string;
    prompt: string;
    error: string;
  };

  cameraTool: {
    title: string;
    btn_open: string;
    select_device: string;
    no_devices: string;
    take_photo: string;
    start_record: string;
    stop_record: string;
    mirror: string;
    retake: string;
    download_photo: string;
    download_video: string;
    close: string;
    current_res: string;
    max_res: string;
    permission_denied: string;
    error_hardware: string;
    error_generic: string;
  };

  audioTool: {
    title: string;
    btn_open: string;
    start_record: string;
    stop_record: string;
    download: string;
    close: string;
    listening: string;
    error_mic: string;
    details_size: string;
    details_rate: string;
    details_type: string;
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

  aboutModal: {
    title: string;
    version: string;
    desc: string;
    changelog: string;
    latest_update: string;
    close: string;
  };

  imageDetails: {
    dimensions: string;
    size: string;
  };

  features: Record<string, string>;
  featureDescs: Record<string, string>;
}