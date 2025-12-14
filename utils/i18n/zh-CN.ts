
import { Translation } from './types';

export const zhCN: Translation = {
  loading: "正在扫描系统能力...",
  title: "BrowserScope",
  subtitle: "全面检测您的浏览器环境、硬件能力、网络状态及前沿 Web API 支持情况。",
  refresh: "刷新检测",
  footer: "所有数据均在本地浏览器中检测，不会上传任何个人隐私信息。",
  
  sections: {
    system: "系统与软件",
    hardware: "硬件与图形",
    display: "显示与屏幕",
    network: "网络与连接",
    storage_loc: "存储与本地化",
    media_sup: "媒体与编码能力",
    user_agent: "用户代理 (User Agent)",
    fingerprints: "指纹与追踪",
    features: "Web API 能力检测",
    permissions: "权限管理",
    pwa: "PWA 能力",
    security: "隐私与安全"
  },
  
  labels: {
    os: "操作系统",
    platform: "系统平台",
    browser: "浏览器内核",
    language: "系统语言",
    pref_langs: "首选语言",
    cookies: "Cookies 启用",
    dnt: "Do Not Track",
    
    cpu: "CPU 逻辑核心",
    memory: "设备内存 (估算)",
    gpu_vendor: "GPU 供应商",
    gpu_renderer: "GPU 渲染器",
    max_texture: "最大纹理尺寸",
    audio_rate: "音频采样率",
    audio_latency: "音频延迟",
    battery: "电池电量",
    charging: "充电状态",
    touch: "最大触控点数",
    screen_extended: "多显示器扩展",
    gamepads: "连接的手柄",
    
    resolution: "屏幕分辨率",
    refresh_rate: "刷新率",
    avail_size: "可用尺寸",
    window_size: "窗口尺寸",
    pixel_ratio: "像素密度 (DPR)",
    color_depth: "色彩深度",
    orientation: "屏幕方向",
    dark_mode: "深色模式",
    color_gamut: "色域范围",
    hdr: "HDR 支持",
    display_mode: "显示模式",
    
    online: "在线状态",
    conn_type: "连接类型",
    downlink: "下行速度",
    rtt: "延迟 (RTT)",
    save_data: "流量节省模式",
    webrtc_ip: "WebRTC 本地 IP",
    
    timezone: "当前时区",
    locale: "区域设置",
    calendar: "日历格式",
    storage_quota: "可用存储配额",
    storage_usage: "已用存储",
    storage_persisted: "持久化存储",
    
    video_codecs: "视频编码支持",
    audio_codecs: "音频编码支持",
    speech_voices: "TTS 语音包",

    camera_permission: "摄像头权限",

    fp_score: "指纹评分",
    canvas_hash: "Canvas 哈希",
    webgl_hash: "WebGL 哈希",

    perm_notif: "通知权限",
    perm_midi: "MIDI 访问",
    perm_geo: "地理位置",
    geo_lat: "纬度",
    geo_long: "经度",
    geo_acc: "精度",
    media_devices: "媒体设备",
    perm_camera: "摄像头",
    perm_mic: "麦克风",

    is_bot: "自动化控制",
    gpc_enabled: "全球隐私控制 (GPC)",
    pdf_viewer: "内置 PDF 查看器",
    secure_context: "安全上下文 (HTTPS)"
  },
  
  values: {
    connected: "已连接",
    offline: "离线",
    supported: "支持",
    not_supported: "不支持",
    yes: "是",
    no: "否",
    unknown: "未知",
    detected: "已检测到",
    none: "无",
    hidden: "隐藏/保护"
  },

  actions: {
    check: "点击检查",
    theme_light: "切换浅色模式",
    theme_dark: "切换深色模式",
    about: "关于",
    export_json: "导出 JSON",
    open_sensors: "传感器",
    view_details: "详情",
    view_base64: "查看 Base64",
    view_extensions: "扩展列表",
    copy: "复制",
    copied: "已复制!"
  },

  status: {
    idle: "未检查",
    granted: "已授权",
    denied: "已拒绝",
    prompt: "需询问",
    error: "检测错误"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "后台同步",
    pushApi: "推送 API",
    notification: "通知 API",
    appBadges: "应用角标",
    webgpu: "WebGPU 图形引擎",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn",
    bluetooth: "Web 蓝牙",
    usb: "Web USB",
    payment: "支付请求",
    nfc: "Web NFC",
    wakeLock: "屏幕唤醒锁",
    fsAccess: "文件系统访问",
    broadcast: "广播频道",
    webShare: "原生分享 API",
    clipboard: "剪贴板 API",
    pip: "画中画模式",
    geo: "地理位置定位",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs 编码",
    compression: "压缩流",
    webTransport: "Web Transport",
    eyeDropper: "吸管工具 (EyeDropper)",
    accelerometer: "加速度计",
    gyroscope: "陀螺仪",
    ambientLight: "环境光传感器"
  },
  
  featureDescs: {
    serviceWorker: "离线访问与 PWA 支持",
    bgSync: "延迟到有网络时执行操作",
    pushApi: "接收服务器推送通知",
    notification: "系统级通知",
    appBadges: "在应用图标上设置徽章",
    webgpu: "新一代高性能图形 API",
    webxr: "虚拟现实与增强现实能力",
    webauthn: "无密码认证",
    bluetooth: "连接附近的蓝牙设备",
    usb: "连接 USB 硬件设备",
    payment: "原生支付处理",
    nfc: "近场通信能力",
    wakeLock: "防止屏幕自动息屏",
    fsAccess: "读写本地文件系统",
    broadcast: "跨标签页通信",
    webShare: "调用系统级分享面板",
    clipboard: "异步读写剪贴板",
    pip: "悬浮视频播放窗",
    geo: "获取用户地理位置",
    wasm: "高性能二进制代码执行",
    webCodecs: "底层音视频编解码处理",
    compression: "原生 GZIP/Deflate 支持",
    webTransport: "低延迟双向数据传输",
    eyeDropper: "系统级屏幕取色",
    accelerometer: "运动传感器",
    gyroscope: "方向传感器",
    ambientLight: "光线强度传感器"
  },

  cameraTool: {
    title: "摄像头工具",
    btn_open: "打开摄像头",
    no_devices: "未找到摄像头设备",
    permission_denied: "摄像头权限被拒绝",
    error_hardware: "访问摄像头硬件错误",
    error_generic: "访问摄像头出错",
    error_mic: "麦克风错误",
    select_device: "选择设备",
    current_res: "当前分辨率",
    max_res: "最大分辨率",
    mirror: "镜像",
    take_photo: "拍照",
    start_record: "开始录像",
    stop_record: "停止录像",
    retake: "重拍",
    download_photo: "下载照片",
    download_video: "下载视频"
  },

  audioTool: {
    title: "录音工具",
    btn_open: "打开录音机",
    listening: "监听中...",
    start_record: "开始",
    stop_record: "停止",
    download: "下载",
    details_size: "大小",
    details_rate: "采样率",
    details_type: "格式",
    close: "关闭",
    error_mic: "无法访问麦克风"
  },

  webglTool: {
    title: "WebGL 扩展",
    count: "个支持的扩展",
    search_placeholder: "搜索扩展...",
    close: "关闭"
  },
  
  base64Tool: {
    title: "Base64 数据",
    desc: "指纹图像的原始数据表示",
    copy: "复制到剪贴板",
    close: "关闭"
  },

  fingerprintModal: {
    title: "浏览器指纹计算",
    desc: "使用各种浏览器属性生成唯一的访客标识符。您可以调整以下参数来观察哈希值的变化。",
    tab_v4: "FingerprintJS v4 (现代)",
    tab_v2: "FingerprintJS v2 (传统)",
    btn_run: "计算指纹",
    generating: "生成中...",
    visitor_id: "访客 ID",
    time_taken: "耗时",
    params_title: "计算参数配置",
    salt_label: "自定义 Salt (种子)",
    components_label: "包含的组件",
    select_all: "全选",
    deselect_all: "全不选",
    close: "关闭",
    copy: "复制 ID",
    copied: "已复制!"
  },

  imageDetails: {
    dimensions: "尺寸",
    size: "大小"
  },

  aboutModal: {
    title: "关于 BrowserScope",
    desc: "BrowserScope 是一款全面的浏览器分析工具，旨在验证您的系统能力和指纹唯一性。",
    version: "版本",
    changelog: "更新日志",
    latest_update: "新增网络诊断 (CDN/连通性测试)、扩展传感器支持 (磁力计) 及外部资源分析。",
    close: "关闭"
  },

  sensorModal: {
    sensor_title: "设备传感器",
    sensor_permission_desc: "访问设备运动传感器需要权限。",
    sensor_allow: "允许访问",
    accelerometer: "加速度计",
    gyroscope: "陀螺仪",
    magnetometer: "磁力计",
    close: "关闭"
  },

  scoreModal: {
    score_details_title: "指纹评分详情",
    tracking_potential: "追踪风险",
    score_explanation: "分数越高表示暴露给网站的唯一识别数据越多，被追踪的风险越大。",
    contributing_factors: "影响因素",
    close: "关闭",

    factors: {
      canvas_hash: "Canvas 指纹",
      webgl_hash: "WebGL 指纹",
      hardware_concurrency: "硬件并发 (CPU/内存)",
      user_agent: "用户代理 (User Agent)",
      resolution: "屏幕分辨率",
      audio_context: "音频上下文",
      battery_status: "电池状态 API",
      locale_time: "区域与时间"
    },
    values: {
      val_unique: "唯一 / 高辨识度",
      val_generic: "通用 / 混淆",
      val_specific: "特定",
      val_readable: "可读取",
      val_protected: "受保护",
      val_unknown: "未知"
    },
    descriptions: {
      desc_canvas_unique: "Canvas 渲染差异暴露了您的 GPU 和驱动程序特征。",
      desc_canvas_generic: "Canvas 指纹提取失败或已被屏蔽。",
      desc_webgl_unique: "WebGL 报告暴露了具体的显卡硬件型号。",
      desc_webgl_generic: "WebGL 指纹提取失败或已被屏蔽。",
      desc_hardware_unique: "CPU 核心数和设备内存大小是重要的识别特征。",
      desc_hardware_generic: "硬件详细信息被部分隐藏。",
      desc_ua_unique: "详细的 User Agent 字符串暴露了浏览器和操作系统版本。",
      desc_res_unique: "屏幕尺寸结合窗口大小会产生独特的指纹。",
      desc_audio_unique: "音频硬件的采样率和延迟参数。",
      desc_battery_unique: "电池 API 允许网站跨浏览会话追踪用户。",
      desc_battery_generic: "电池状态已被隐藏或不支持。",
      desc_locale_unique: "时区和语言设置可缩小用户的位置范围。"
    }
  },

  settingsModal: {
    title: "网络与诊断",
    tab_cdn: "CDN 状态",
    tab_conn: "连通性测试",
    tab_resources: "外部资源",
    cdn_status: "依赖库状态",
    latency: "延迟",
    check_all: "检查所有",
    url_placeholder: "输入 URL (如 https://google.com)",
    test_conn: "测试连通性",
    test_result: "测试结果",
    resource_list: "已加载资源",
    res_name: "资源 URL",
    res_type: "类型",
    res_duration: "加载耗时",
    close: "关闭"
  }
};
