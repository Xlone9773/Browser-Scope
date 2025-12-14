export type Language = 'en' | 'zh';

export const translations = {
  en: {
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
      permissions: "Permissions"
    },
    
    labels: {
      os: "Operating System",
      platform: "Platform",
      browser: "Browser",
      language: "Language",
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
      
      resolution: "Screen Resolution",
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
      
      video_codecs: "Video Codecs",
      audio_codecs: "Audio Codecs",

      camera_permission: "Camera Access"
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
      check: "Check Access"
    },

    status: {
      idle: "Not Checked",
      granted: "Access Granted",
      denied: "Access Denied",
      error: "Error / Unavailable"
    },

    features: {
      serviceWorker: "Service Worker",
      webgpu: "WebGPU",
      webxr: "WebXR",
      bluetooth: "Web Bluetooth",
      usb: "Web USB",
      nfc: "Web NFC",
      wakeLock: "Screen Wake Lock",
      fsAccess: "File System Access",
      webShare: "Web Share API",
      clipboard: "Clipboard API",
      pip: "Picture-in-Picture",
      geo: "Geolocation",
      wasm: "Web Assembly",
      webCodecs: "Web Codecs",
      webTransport: "Web Transport",
      eyeDropper: "Eye Dropper",
    },
    
    featureDescs: {
      serviceWorker: "Offline capabilities & PWA support",
      webgpu: "Next-gen graphics API",
      webxr: "VR and AR capabilities",
      bluetooth: "Connect to Bluetooth devices",
      usb: "Connect to USB devices",
      nfc: "Near Field Communication",
      wakeLock: "Prevent screen from dimming",
      fsAccess: "Read/Write local files",
      webShare: "Native sharing dialog",
      clipboard: "Async clipboard access",
      pip: "Floating video player",
      geo: "User location access",
      wasm: "High-performance binary code",
      webCodecs: "Low-level media processing",
      webTransport: "Low-latency bidirectional streaming",
      eyeDropper: "System color picker",
    }
  },
  
  zh: {
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
      features: "Web API 能力检测",
      permissions: "权限管理"
    },
    
    labels: {
      os: "操作系统",
      platform: "系统平台",
      browser: "浏览器内核",
      language: "系统语言",
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
      
      resolution: "屏幕分辨率",
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
      
      video_codecs: "视频编码支持",
      audio_codecs: "音频编码支持",

      camera_permission: "摄像头权限"
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
      check: "点击检查"
    },

    status: {
      idle: "未检查",
      granted: "已授权",
      denied: "已拒绝",
      error: "检测错误"
    },

    features: {
      serviceWorker: "Service Worker",
      webgpu: "WebGPU 图形引擎",
      webxr: "WebXR (VR/AR)",
      bluetooth: "Web 蓝牙",
      usb: "Web USB",
      nfc: "Web NFC",
      wakeLock: "屏幕唤醒锁",
      fsAccess: "文件系统访问",
      webShare: "原生分享 API",
      clipboard: "剪贴板 API",
      pip: "画中画模式",
      geo: "地理位置定位",
      wasm: "Web Assembly",
      webCodecs: "Web Codecs 编码",
      webTransport: "Web Transport",
      eyeDropper: "吸管工具 (EyeDropper)",
    },
    
    featureDescs: {
      serviceWorker: "离线访问与 PWA 支持",
      webgpu: "新一代高性能图形 API",
      webxr: "虚拟现实与增强现实能力",
      bluetooth: "连接附近的蓝牙设备",
      usb: "连接 USB 硬件设备",
      nfc: "近场通信能力",
      wakeLock: "防止屏幕自动息屏",
      fsAccess: "读写本地文件系统",
      webShare: "调用系统级分享面板",
      clipboard: "异步读写剪贴板",
      pip: "悬浮视频播放窗",
      geo: "获取用户地理位置",
      wasm: "高性能二进制代码执行",
      webCodecs: "底层音视频编解码处理",
      webTransport: "低延迟双向数据传输",
      eyeDropper: "系统级屏幕取色",
    }
  }
};