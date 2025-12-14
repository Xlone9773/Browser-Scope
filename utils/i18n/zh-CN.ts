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
    fingerprints: "数字指纹与追踪",
    features: "Web API 能力检测",
    pwa: "PWA 与离线能力",
    permissions: "权限管理"
  },
  
  labels: {
    os: "操作系统",
    platform: "系统平台",
    browser: "浏览器内核",
    language: "系统语言",
    pref_langs: "首选语言列表",
    cookies: "Cookies 启用",
    dnt: "Do Not Track",
    
    cpu: "CPU 逻辑核心",
    memory: "设备内存 (估算)",
    gpu_vendor: "GPU 供应商",
    gpu_renderer: "GPU 渲染器",
    max_texture: "最大纹理尺寸",
    audio_rate: "音频采样率",
    battery: "电池电量",
    charging: "充电状态",
    touch: "最大触控点数",
    canvas_hash: "Canvas 指纹 (Hash)",
    webgl_hash: "WebGL 指纹 (Hash)",
    audio_latency: "音频延迟",
    fp_score: "唯一性评分",
    
    resolution: "屏幕分辨率",
    refresh_rate: "屏幕刷新率 (估算)",
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
    
    timezone: "当前时区",
    locale: "区域设置",
    calendar: "日历格式",
    storage_quota: "可用存储配额",
    storage_usage: "已用存储",
    storage_persisted: "持久化存储",
    
    video_codecs: "视频编码支持",
    audio_codecs: "音频编码支持",

    media_devices: "媒体设备",
    perm_camera: "摄像头",
    perm_mic: "麦克风",
    perm_geo: "地理位置",
    perm_notif: "系统通知",
    perm_midi: "MIDI 设备",

    geo_lat: "纬度",
    geo_long: "经度",
    geo_acc: "精度 (米)"
  },
  
  values: {
    connected: "已连接",
    offline: "离线",
    supported: "支持",
    not_supported: "不支持",
    yes: "是",
    no: "否",
    unknown: "未知"
  },

  actions: {
    check: "点击检查",
    export_json: "导出 JSON",
    view_extensions: "查看扩展列表",
    view_base64: "Base64 源码",
    view_details: "查看详情",
    open_sensors: "打开传感器",
    copy: "复制",
    copied: "已复制",
    zoom: "放大",
    theme_dark: "深色",
    theme_light: "浅色",
    about: "关于 / 更新日志"
  },

  status: {
    idle: "未检查",
    granted: "已授权",
    denied: "已拒绝",
    prompt: "需询问",
    error: "检测错误"
  },

  cameraTool: {
    title: "摄像头工具",
    btn_open: "打开摄像头",
    select_device: "选择设备",
    no_devices: "未发现视频输入设备",
    take_photo: "拍摄照片",
    start_record: "录制视频",
    stop_record: "停止录制",
    mirror: "画面镜像",
    retake: "重新拍摄",
    download_photo: "下载照片",
    download_video: "下载视频",
    close: "关闭",
    current_res: "当前输出分辨率",
    max_res: "硬件最大分辨率 (WebRTC)",
    permission_denied: "摄像头权限已被拒绝",
    error_hardware: "摄像头被占用或硬件错误",
    error_generic: "无法访问摄像头"
  },

  audioTool: {
    title: "录音工具",
    btn_open: "打开录音机",
    start_record: "开始录音",
    stop_record: "停止录音",
    download: "下载音频",
    close: "关闭",
    listening: "正在监听...",
    error_mic: "麦克风访问被拒绝或出错",
    details_size: "文件大小",
    details_rate: "采样率",
    details_type: "音频格式"
  },

  webglTool: {
    title: "WebGL 扩展支持",
    count: "个扩展",
    search_placeholder: "搜索扩展...",
    close: "关闭"
  },

  base64Tool: {
    title: "Canvas Base64 数据",
    desc: "Canvas 指纹渲染结果的原始数据表示。",
    copy: "复制 Base64",
    close: "关闭"
  },

  aboutModal: {
    title: "关于 BrowserScope",
    version: "当前版本",
    desc: "一个轻量级、注重隐私的浏览器能力检测工具，可快速查看硬件信息、网络状态及 Web API 支持情况。",
    changelog: "更新日志",
    latest_update: "新增实时传感器监测 (加速度计/陀螺仪)、指纹唯一性评分系统及界面细节优化。",
    close: "关闭"
  },

  sensorModal: {
    sensor_title: "实时传感器数据",
    accelerometer: "加速度计 (Accelerometer)",
    gyroscope: "陀螺仪 (Gyroscope)",
    sensor_permission_desc: "该功能需要访问设备运动传感器权限。请允许以继续。",
    sensor_allow: "允许访问传感器",
    close: "关闭"
  },

  scoreModal: {
    score_details_title: "指纹评分详情",
    tracking_potential: "追踪风险",
    score_explanation: "分数越高表示暴露给网站的唯一识别数据越多，被追踪的风险越大。",
    contributing_factors: "影响因素",
    close: "关闭"
  },

  imageDetails: {
    dimensions: "图像尺寸",
    size: "文件大小"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "后台同步 (Background Sync)",
    pushApi: "推送通知 (Push API)",
    notification: "系统通知 (Notification)",
    appBadges: "应用角标 (App Badges)",
    webgpu: "WebGPU 图形引擎",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn 认证",
    bluetooth: "Web 蓝牙",
    usb: "Web USB",
    payment: "支付请求 API",
    nfc: "Web NFC",
    wakeLock: "屏幕唤醒锁",
    fsAccess: "文件系统访问",
    broadcast: "广播频道 (Broadcast)",
    webShare: "原生分享 API",
    clipboard: "剪贴板 API",
    pip: "画中画模式",
    geo: "地理位置定位",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs 编码",
    compression: "原生压缩流",
    webTransport: "Web Transport",
    eyeDropper: "吸管工具 (EyeDropper)",
    accelerometer: "加速计 (Accelerometer)",
    gyroscope: "陀螺仪 (Gyroscope)",
    ambientLight: "环境光传感器 (Ambient Light)",
  },
  
  featureDescs: {
    serviceWorker: "离线访问与 PWA 支持",
    bgSync: "网络恢复时自动同步数据",
    pushApi: "接收服务端推送消息",
    notification: "系统级通知消息",
    appBadges: "在应用图标上显示标记",
    webgpu: "新一代高性能图形 API",
    webxr: "虚拟现实与增强现实能力",
    webauthn: "无密码安全认证标准",
    bluetooth: "连接附近的蓝牙设备",
    usb: "连接 USB 硬件设备",
    payment: "浏览器原生支付流程",
    nfc: "近场通信能力",
    wakeLock: "防止屏幕自动息屏",
    fsAccess: "读写本地文件系统",
    broadcast: "跨标签页/窗口通信",
    webShare: "调用系统级分享面板",
    clipboard: "异步读写剪贴板",
    pip: "悬浮视频播放窗",
    geo: "获取用户地理位置",
    wasm: "高性能二进制代码执行",
    webCodecs: "底层音视频编解码处理",
    compression: "原生 GZIP/Deflate 压缩",
    webTransport: "低延迟双向数据传输",
    eyeDropper: "系统级屏幕取色",
    accelerometer: "运动检测传感器 (API 支持)",
    gyroscope: "方向检测传感器 (API 支持)",
    ambientLight: "环境亮度检测 (API 支持)",
  }
};
