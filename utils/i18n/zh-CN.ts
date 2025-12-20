
import { Translation } from './types';

export const zhCN: Translation = {
  loading: "正在扫描系统能力...",
  title: "BrowserScope",
  subtitle: "全面检测您的浏览器环境、硬件能力、网络状态及前沿 Web API 支持情况。",
  refresh: "重新检测",
  footer: "所有数据均在本地浏览器中检测，不会上传任何个人隐私信息。",

  // ... (rest of file)
  settingsModal: {
    title: "设置与工具",
    tab_general: "常规",
    tab_network: "网络分析",
    tab_display: "显示测试",
    tab_storage: "存储管理",
    tab_resources: "外部资源",
    tab_developer: "开发者",
    
    simple_mode_title: "简洁模式",
    simple_mode_desc: "隐藏不必要的技术细节，仅显示核心系统信息。",
    scrollbar_title: "隐藏滚动条",
    scrollbar_desc: "隐藏浏览器滚动条以最大化屏幕显示空间。",
    time_format_title: "24 小时制",
    time_format_desc: "切换 12 小时 (AM/PM) 与 24 小时时间格式。",
    
    public_ip: "公网 IP 地址",
    fetch_ip: "检测 IP",
    ipv6_title: "IPv6 连接能力",
    check_ipv6: "检测 IPv6",
    ipv6_success: "支持 IPv6",
    ipv6_fail: "未检测到 / 仅 IPv4",
    ip_info: "IP 详细信息",
    provider: "运营商 (ISP)",
    location: "地理位置",
    cdn_status: "CDN 状态",
    latency: "延迟",
    check_all: "检查所有",
    url_placeholder: "输入 URL (如 https://google.com)",
    test_conn: "测试连接",
    test_result: "测试结果",

    display_test: "屏幕坏点/缺陷测试",
    dead_pixel_title: "坏点检测",
    dead_pixel_desc: "点击颜色进入全屏模式。检查屏幕上是否有不发光或颜色异常的像素点。",
    color_red: "红",
    color_green: "绿",
    color_blue: "蓝",
    color_white: "白",
    color_black: "黑",
    
    // New Display & HDR Keys
    gamut_test_title: "广色域可视化 (P3)",
    gamut_test_desc: "如果您的显示器支持广色域 (P3)，您将在色块中心隐约看到形状或文字。",
    hdr_test_title: "色深与断层测试",
    hdr_test_desc: "检查渐变是否平滑。如果出现明显条纹 (Banding)，说明可能是 8-bit 色深或受到压缩。",
    unsupported_p3: "当前浏览器不支持 color(display-p3) 语法",
    hdr_status_title: "HDR 显示能力",
    hdr_support: "HDR 支持状态",
    hdr_dynamic_range: "动态范围 (UI)",
    hdr_video_dynamic_range: "视频动态范围",
    hdr_brightness_test: "峰值亮度 (EDR) 测试",
    hdr_brightness_desc: "如果您的显示器支持扩展动态范围 (HDR)，中间的方块应比周围的“标准白色”明显更亮。",
    hdr_sdr_white: "SDR 标准白",
    hdr_edr_white: "HDR 高亮白",

    storage_title: "本地数据",
    clear_data: "清除网站数据",
    clear_btn: "清除存储",
    sw_title: "Service Workers",
    sw_desc: "注销活动的 Service Workers 以重置 PWA 状态。",
    sw_btn: "注销 SW",

    resource_list: "已加载资源",
    res_name: "资源 URL",
    res_type: "类型",
    res_duration: "加载耗时",

    dev_events: "事件监听器",
    dev_inspector: "对象透视 (Inspector)",
    dev_console: "JS 控制台",
    dev_console_placeholder: "输入 JavaScript 代码... (输入 '\\' 查看预设)",
    dev_run: "执行",
    dev_clear: "清空日志",
    dev_copy_log: "复制日志",
    dev_float: "悬浮窗口",
    dev_warning_title: "开发者模式风险提示",
    dev_warning_desc: "此工具允许执行任意 JavaScript 代码并检查浏览器内部对象。执行恶意代码可能会危及您的安全。请确保您了解相关风险后再继续。",
    dev_warning_agree: "我了解风险并继续",

    dev_quick_commands: "快速指令",
    dev_result_placeholder: "执行结果将显示在这里...",
    dev_events_placeholder: "正在监听窗口事件...",
    dev_input_clear: "清空输入",
    dev_output_copy: "复制结果",
    dev_output_download: "导出结果",
    dev_output_clear: "清空结果",
    dev_dock_back: "停靠回主窗口",
    dev_run_now: "立即执行",

    // Advanced Network Keys
    network_adv_title: "高级网络诊断",
    network_webrtc_title: "WebRTC 泄露检测",
    network_webrtc_desc: "分析浏览器生成的 ICE 候选者，检测本地 IP 泄露和 STUN/TURN 连通性。",
    network_webrtc_btn: "开始 WebRTC 分析",
    network_dns_title: "DNS 泄露测试",
    network_dns_desc: "尝试识别您连接所使用的 DNS 解析服务器，以检查是否存在隐私泄露。",
    network_dns_btn: "检测 DNS 解析器",
    
    col_type: "类型",
    col_ip: "IP 地址",
    col_protocol: "协议",
    col_port: "端口",
    
    lbl_resolution: "解析结果",
    lbl_dns_ip: "解析器 IP",
    lbl_dns_geo: "地理位置",
    
    proto_title: "传输协议支持",
    proto_desc: "检测浏览器对现代传输协议 (HTTP/2, HTTP/3 QUIC) 的支持情况。",
    proto_check_btn: "检测协议",
    proto_http2: "HTTP/2",
    proto_http3: "HTTP/3 (QUIC)",

    close: "关闭"
  },

  sections: {
    system: "系统与软件",
    hardware: "硬件与图形",
    display: "显示与屏幕",
    network: "网络与连接",
    storage: "存储空间",
    location: "位置与时间",
    media_sup: "媒体与编码能力",
    fingerprints: "指纹与追踪",
    features: "Web API 能力检测",
    permissions: "权限管理",
    pwa: "PWA 能力",
    user_agent: "用户代理 (User Agent)",
    security: "隐私与安全",
    ai_compute: "AI 与计算能力"
  },

  labels: {
    os: "操作系统",
    platform: "系统平台",
    browser: "浏览器内核",
    language: "系统语言",
    pref_langs: "偏好语言",
    cookies: "Cookies 启用",
    dnt: "Do Not Track",
    
    cpu: "CPU 逻辑核心",
    cpu_model: "CPU 型号 (估算)",
    memory: "设备内存 (估算)",
    gpu_vendor: "GPU 供应商",
    gpu_renderer: "GPU 渲染器",
    max_texture: "最大纹理尺寸",
    audio_rate: "音频采样率",
    audio_latency: "音频延迟",
    battery: "电池电量",
    charging: "充电状态",
    charging_time: "充电时间", 
    discharging_time: "放电时间", 
    touch: "最大触控点数",
    
    resolution: "屏幕分辨率",
    refresh_rate: "刷新率",
    avail_size: "可用尺寸",
    window_size: "窗口尺寸",
    pixel_ratio: "像素密度 (DPR)",
    color_depth: "色彩深度",
    orientation: "屏幕方向",
    orientation_angle: "旋转角度", 
    screen_extended: "扩展屏幕",
    dark_mode: "深色模式",
    color_gamut: "色域范围",
    hdr: "HDR 支持",
    display_mode: "显示模式",
    
    online: "在线状态",
    conn_type: "连接类型",
    net_type: "网络制式", 
    downlink: "下载速度",
    downlink_max: "最大下载", 
    rtt: "延迟 (RTT)",
    save_data: "流量节省模式",
    webrtc_ip: "WebRTC 暴露 IP",
    
    timezone: "当前时区",
    locale: "区域设置",
    calendar: "日历格式",
    local_time: "本地时间",
    storage_quota: "可用存储配额",
    storage_usage: "已用存储",
    storage_persisted: "持久化存储",
    
    video_codecs: "视频编码支持",
    audio_codecs: "音频编码支持",
    image_formats: "图片格式支持", 
    speech_voices: "TTS 语音包",
    audio_channels: "声道数", 
    drm_support: "DRM 系统支持",

    is_bot: "自动化控制 (Bot)",
    ad_block: "广告拦截器",
    secure_context: "安全上下文 (HTTPS)",
    gpc_enabled: "全球隐私控制 (GPC)",
    pdf_viewer: "内置 PDF 查看器",

    ai_readiness: "AI 就绪指数",
    window_ai: "Chrome 内置 AI (window.ai)",
    webnn: "Web 神经网络 API (WebNN)",

    camera_permission: "相机权限",

    fp_score: "指纹评分",
    canvas_hash: "Canvas 哈希",
    webgl_hash: "WebGL 哈希",

    perm_notif: "通知权限",
    perm_midi: "MIDI 访问",
    perm_geo: "地理位置",
    geo_lat: "纬度",
    geo_long: "经度",
    geo_acc: "精确度",
    media_devices: "媒体设备",
    perm_camera: "相机",
    perm_mic: "麦克风",

    pwa_install_status: "安装状态",
    gamepads: "已连接手柄"
  },

  values: {
    connected: "已连接",
    offline: "离线",
    supported: "支持",
    not_supported: "不支持",
    yes: "是",
    no: "否",
    unknown: "未知",
    installed: "已安装",
    not_installed: "未安装",
    detected: "已检测到",
    none: "无",
    hidden: "隐藏/受保护"
  },

  actions: {
    check: "点击检查",
    theme_light: "切换浅色模式",
    theme_dark: "切换深色模式",
    about: "关于",
    export_json: "导出 JSON",
    open_sensors: "传感器",
    open_tools: "硬件工具",
    run_benchmark: "性能跑分",
    view_details: "详情",
    view_base64: "查看 Base64",
    view_extensions: "扩展列表",
    copy: "复制",
    copied: "已复制!",
    open_map: "打开地图"
  },

  status: {
    idle: "未检查",
    granted: "允许",
    denied: "拒绝",
    prompt: "需确认",
    error: "错误 / 不可用"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "后台同步",
    pushApi: "推送 API",
    notification: "通知 API",
    appBadges: "应用图标标记",
    webgpu: "WebGPU 图形引擎",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn 无密码认证",
    bluetooth: "Web 蓝牙",
    usb: "Web USB",
    payment: "支付请求 API",
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
    compression: "压缩流 API",
    webTransport: "Web Transport",
    eyeDropper: "吸管工具 (EyeDropper)",
    accelerometer: "加速度计",
    gyroscope: "陀螺仪",
    ambientLight: "环境光传感器"
  },

  featureDescs: {
    serviceWorker: "离线访问与 PWA 支持核心",
    bgSync: "延迟到有网络时执行操作",
    pushApi: "接收服务器推送通知",
    notification: "系统级通知消息",
    appBadges: "在应用程序图标上设置徽章",
    webgpu: "新一代高性能图形与计算 API",
    webxr: "虚拟现实与增强现实能力",
    webauthn: "生物识别与无密码登录",
    bluetooth: "连接附近的低功耗蓝牙设备",
    usb: "连接 USB 硬件设备",
    payment: "浏览器原生支付处理",
    nfc: "近场通讯能力 (NFC 标签读写)",
    wakeLock: "防止屏幕自动变暗或关闭",
    fsAccess: "读写本地文件系统",
    broadcast: "跨标签页通信",
    webShare: "调用系统级分享面板",
    clipboard: "异步读写剪贴板内容",
    pip: "悬浮视频播放窗口",
    geo: "获取用户地理经纬度",
    wasm: "高性能二进制代码执行",
    webCodecs: "底层音视频编解码处理",
    compression: "原生 GZIP/Deflate 压缩支持",
    webTransport: "低延迟双向数据传输",
    eyeDropper: "系统级屏幕取色工具",
    accelerometer: "运动检测传感器",
    gyroscope: "方向检测传感器",
    ambientLight: "光线强度检测"
  },

  cameraTool: {
    title: "相机工具",
    btn_open: "开启相机",
    no_devices: "未找到相机设备",
    permission_denied: "相机权限被拒绝",
    error_hardware: "访问相机硬件错误",
    error_generic: "访问相机出错",
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
    btn_open: "开启录音机",
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
    count: "个扩展支持",
    search_placeholder: "搜索扩展...",
    close: "关闭",
    vendor: "供应商",
    spec_link: "规范文档"
  },

  base64Tool: {
    title: "Base64 数据",
    desc: "生成指纹图像的原始数据表示",
    copy: "复制到剪贴板",
    close: "关闭"
  },

  fingerprintModal: {
    title: "浏览器指纹计算",
    desc: "使用各种浏览器属性生成唯一的访客标识符。您可以调整以下参数来观察哈希值的变化。",
    tab_v4: "FingerprintJS v4 (现代)",
    tab_v2: "FingerprintJS v2 (传统)",
    tab_fonts: "字体检测",
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
    copied: "已复制!",
    font_detect_desc: "通过测量特定文本的渲染宽度来检测系统中安装的字体。这是一种常见的指纹追踪技术。",
    font_list_title: "已检测到的字体"
  },

  imageDetails: {
    dimensions: "尺寸",
    size: "大小"
  },

  aboutModal: {
    title: "关于 BrowserScope",
    desc: "BrowserScope 是一款全面的浏览器分析工具，旨在验证您的系统能力和指纹唯一性，所有检测均在本地完成。",
    version: "版本",
    changelog: "更新日志",
    latest_update: "新增硬件交互工具与存储跑分",
    close: "关闭",
    history: "更新历史",
    updates: [
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: [
                "新增硬件交互工具（振动模式与多点触控测试）。",
                "性能跑分中新增存储 I/O 读写测试 (IndexedDB)。",
                "新增字体指纹 (Font Fingerprinting) 检测能力。",
                "优化 WebGL 扩展查看器，支持按供应商分组和搜索。",
                "修复 UI 动画卡顿与模态框交互问题。"
            ]
        },
        {
            version: "1.1.0",
            date: "2024-02-28",
            changes: [
                "引入 AI 与计算能力检测 (WebNN, Gemini Nano)。",
                "新增相机与麦克风诊断工具。",
                "增强设备传感器可视化效果 (加速度计, 陀螺仪)。"
            ]
        },
        {
            version: "1.0.0",
            date: "2024-01-10",
            changes: [
                "初始发布，包含核心系统信息检测。",
                "浏览器指纹分析 (Canvas, WebGL)。",
                "网络速度与延迟估算功能。"
            ]
        }
    ]
  },

  sensorModal: {
    sensor_title: "设备传感器",
    sensor_permission_desc: "访问运动传感器需要授予权限。",
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

  benchmarkModal: {
    title: "性能基准测试",
    start_btn: "开始测试",
    running: "运行中...",
    score: "总分",
    cpu_test: "CPU 质数计算",
    math_test: "浮点运算 (Math)",
    memory_test: "内存读写吞吐",
    dom_test: "DOM 操作性能",
    gpu_test: "Canvas 2D 渲染",
    storage_test: "存储 I/O (IndexedDB)"
  },

  hardwareToolsModal: {
    title: "硬件交互工具",
    tab_vibrate: "振动",
    tab_touch: "触控",
    vibrate_not_supported: "您的设备不支持振动 API",
    vibrate_short: "短振动 (200ms)",
    vibrate_medium: "中振动 (500ms)",
    vibrate_pattern: "脉冲模式",
    touch_instruction: "请在屏幕上触摸或移动",
    touch_count: "触控点数"
  },

  aiPlayground: {
    title: "AI 游乐场",
    desc: "在浏览器本地运行轻量级 AI 模型。无需服务器上传。",
    model_name: "模型",
    loading_model: "加载模型中...",
    input_placeholder: "在此输入英文文本进行情感分析...",
    result_label: "分析结果",
    confidence: "置信度"
  },

  gamepadTool: {
    title: "游戏手柄测试",
    tab_gamepad: "手柄",
    tab_bluetooth: "蓝牙扫描",
    no_gamepad: "未检测到手柄",
    connect_instruction: "请连接手柄并按任意键激活",
    bt_devices: "已发现设备",
    bt_scanning: "扫描中...",
    btn_scan_bt: "扫描蓝牙设备",
    bt_not_supported: "不支持 Web Bluetooth",
    bt_no_devices: "未发现设备"
  }
};
