
export const modules = {
  settings: {
    title: "设置",
    nav: {
        general: "通用设置",
        network: "网络工具",
        display: "屏幕检测",
        storage: "存储管理",
        resources: "资源监控",
        developer: "开发者",
        modules: "模块管理"
    },
    general: {
        simpleMode: {
            title: "极简模式",
            desc: "隐藏部分复杂的技术细节，仅显示核心信息。"
        },
        scrollbar: {
            title: "隐藏滚动条",
            desc: "强制隐藏系统默认的滚动条样式。"
        },
        timeFormat: {
            title: "时间格式",
            desc: "在 12 小时制和 24 小时制之间切换。"
        },
        performance: {
            title: "高性能模式",
            desc: "禁用模糊特效与透明度以降低 GPU 负载。"
        }
    },
    network: {
        ip: {
            title: "IP 配置信息",
            ipv4: "IPv4",
            ipv4_desc: "标准互联网协议",
            ipv6: "IPv6",
            ipv6_desc: "下一代互联网协议",
            fetch: "查询 IP",
            check_v6: "检测 IPv6",
            success_v6: "支持 IPv6",
            fail_v6: "不支持 IPv6"
        },
        diagnostics: {
            title: "高级网络诊断",
            webrtc: {
                title: "WebRTC 泄漏检测",
                desc: "通过 STUN 服务器尝试获取真实的局域网或公网 IP。",
                btn: "开始检测",
                columns: { type: "类型", ip: "IP 地址", proto: "协议", port: "端口" }
            },
            dns: {
                title: "DNS 泄露检测",
                desc: "尝试检测您当前使用的 DNS 解析服务器。",
                btn: "检测 DNS",
                label_ip: "DNS 服务器 IP",
                label_geo: "DNS 地理位置"
            },
            proto: {
                title: "协议支持",
                desc: "检测浏览器对 HTTP/2 和 HTTP/3 (QUIC) 的支持情况。",
                btn: "检查协议",
                h2: "HTTP/2 支持",
                h3: "HTTP/3 支持"
            }
        },
        connectivity: {
            title: "连通性测试",
            placeholder: "输入网址 (例如 google.com)",
            btn: "测试"
        },
        cdn: {
            title: "CDN 状态",
            check_all: "检查全部"
        }
    },
    display: {
        deadPixel: {
            title: "坏点检测",
            desc: "全屏显示纯色背景，帮助您寻找屏幕上的坏点或亮点。点击任意处退出。",
            colors: { red: "红", green: "绿", blue: "蓝", white: "白", black: "黑" }
        },
        hdr: {
            title: "HDR 状态",
            desc: "检测当前显示器和浏览器对高动态范围内容的支持。",
            rangeScreen: "屏幕动态范围",
            rangeVideo: "视频动态范围",
            brightnessTest: "EDR 亮度测试",
            brightnessDesc: "如果支持 HDR/EDR，中间的方块应比白色背景更亮。",
            labelSdr: "SDR 白色",
            labelEdr: "EDR 高亮白"
        },
        gamut: {
            title: "广色域测试 (P3)",
            desc: "如果在红色方块中能看到 Logo，说明您的设备支持 P3 广色域。",
            unsupported: "您的浏览器不支持 Display-P3 色域检测。"
        },
        gradient: {
            title: "色深与灰阶",
            desc: "检查色彩过渡是否平滑（无断层）以及暗部细节。"
        }
    },
    storage: {
        local: {
            title: "本地数据",
            clearDesc: "清除所有站点数据",
            clearBtn: "清除"
        },
        sw: {
            title: "Service Workers",
            desc: "管理后台运行的 Service Worker 脚本。",
            unregisterBtn: "注销所有"
        },
        usageLabel: "存储空间使用率"
    },
    resources: {
        title: "外部资源加载列表",
        columns: { name: "资源名称", type: "类型", duration: "耗时" }
    },
    developer: {
        warning: {
            title: "操作极其危险！",
            desc: "这里是为开发者准备的调试区域。如果不清楚自己在做什么，请立即关闭窗口！\n\n任何诱导你在此处粘贴代码的人都是骗子。执行未知代码可能导致你的隐私泄露、账号被盗或设备被恶意控制。",
            agree: "我已知晓风险，继续"
        },
        nav: {
            events: "事件流",
            inspector: "对象检查",
            console: "控制台"
        },
        actions: {
            float: "浮动窗口",
            dock: "恢复到底部"
        },
        events: {
            placeholder: "等待系统事件...",
            copy: "复制日志",
            clear: "清空"
        },
        console: {
            placeholder: "输入 JS 代码 (输入 '\\' 查看预设)...",
            clearInput: "清除输入",
            resultPlaceholder: "运行结果将显示在这里...",
            copy: "复制结果",
            download: "下载结果",
            clear: "清空结果",
            quickCommands: "快捷指令",
            run: "立即运行"
        }
    },
    modules: {
        title: "模块管理",
        desc: "监控和管理已加载的模态框组件。卸载未使用的模块可以释放内存和 GPU 资源。",
        headers: {
            name: "模块名称",
            status: "状态",
            impact: "资源占用",
            action: "操作"
        },
        status: {
            active: "运行中",
            inactive: "空闲",
            cached: "已缓存",
            system: "系统核心"
        },
        impact: {
            low: "低",
            med: "中",
            high: "高"
        },
        actions: {
            unload: "强制关闭",
            unloadAll: "卸载所有活动模块"
        }
    }
  },

  speedTest: {
    title: "网络速度测试",
    action: {
        start: "开始测速",
        stop: "停止"
    },
    metrics: {
        ping: "延迟 (Ping)",
        jitter: "抖动",
        download: "下载速度",
        upload: "上传速度",
        latency: "网络延迟",
        mbps: "Mbps"
    },
    status: {
        idle: "准备就绪",
        ping: "正在测试延迟...",
        download: "正在测试下载...",
        upload: "正在测试上传...",
        done: "测试完成",
        error: "连接失败"
    },
    settings: {
        server: "Cloudflare",
        test_size: "测试大小",
        backend: "测速节点",
        custom_url: "自定义下载链接",
        custom_placeholder: "https://example.com/large-file.zip",
        cors_note: "注意：URL 必须支持 CORS。上传测试将被跳过。"
    },
    preset_names: {
        cloudflare: "Cloudflare (全球)",
        cachefly: "CacheFly (全球 CDN)",
        ustc_cn: "中科大镜像源 (中国/合肥)",
        nju_cn: "南京大學镜像源 (中国/南京)",
        selectel_ru: "Selectel (俄罗斯/圣彼得堡)",
        tele2_kz: "Tele2 (哈萨克斯坦/阿拉木图)",
        hetzner_de: "Hetzner (德国/法尔肯施泰因)",
        hetzner_fi: "Hetzner (芬蘭/赫爾辛基)",
        scaleway_fr: "Scaleway (法国/巴黎)",
        vultr_nj: "Vultr (美东/新泽西)",
        vultr_la: "Vultr (美西/洛杉矶)",
        vultr_sg: "Vultr (新加坡)",
        vultr_tokyo: "Vultr (日本/东京)",
        vultr_sydney: "Vultr (澳大利亚/悉尼)",
        custom: "自定义 URL"
    }
  },

  cameraTool: {
    title: "摄像头测试",
    btn_open: "打开摄像头",
    select_device: "选择设备",
    take_photo: "拍照",
    start_record: "开始录像",
    stop_record: "停止录像",
    retake: "重试",
    download_photo: "下载照片",
    download_video: "下载视频",
    current_res: "当前分辨率",
    max_res: "最大分辨率",
    mirror: "镜像画面",
    no_devices: "未找到视频输入设备",
    permission_denied: "摄像头权限被拒绝",
    error_hardware: "硬件被占用或无法读取",
    error_generic: "发生未知错误"
  },

  audioTool: {
    title: "麦克风测试",
    btn_open: "打开麦克风",
    listening: "正在监听...",
    start_record: "录音",
    stop_record: "停止",
    download: "下载",
    details_size: "文件大小",
    details_rate: "采样率",
    details_type: "格式",
    error_mic: "无法访问麦克风",
    close: "关闭"
  },

  webglTool: {
    title: "WebGL 扩展",
    count: "个扩展",
    search_placeholder: "搜索扩展名称...",
    spec_link: "查看规范文档",
    close: "关闭"
  },

  imageDetails: {
    dimensions: "尺寸",
    size: "大小"
  },

  base64Tool: {
    title: "Base64 数据",
    desc: "指纹原始数据",
    copy: "复制全部",
    close: "关闭"
  },

  aboutModal: {
    title: "关于 BrowserScope",
    desc: "BrowserScope 是一个运行在浏览器端的综合检测工具。它不收集任何用户隐私数据到服务器，所有计算均在本地完成。旨在帮助开发者和用户了解当前浏览器的真实能力、指纹特征及系统环境。",
    version: "当前版本",
    latest_update: "最近更新",
    history: "更新历史",
    features: {
        privacy: {
            title: "隐私优先",
            desc: "100% 客户端执行。零数据上传。您的指纹特征仅留存在本地设备。"
        },
        tech: {
            title: "前沿技术",
            desc: "基于 WebGPU, WebNN 和 WASM 构建，测试浏览器的极限能力边界。"
        },
        deepScan: {
            title: "深度扫描",
            desc: "分析 100+ 项硬件与软件信号，生成高熵值的设备指纹标识。"
        },
        stack: {
            title: "创新技术栈"
        },
        openSource: {
            title: "开源项目",
            license: "MIT 协议"
        }
    },
    updates: [
        {
            version: "1.6.0",
            date: "2024-04-12",
            changes: ["新增真实网速测试 (Cloudflare)", "新增 I18n 动态国际化支持", "增强 Intl 本地化格式"]
        },
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["新增开发者工具箱 (控制台/检查器)", "增强媒体解码检测 (HDR/杜比/色深)", "支援切换 IP 查询数据源", "支援浮动窗口模式"]
        },
        {
            version: "1.4.0",
            date: "2024-03-25",
            changes: ["新增视觉能力检测 (条形码/二维码)", "更新 CPU/GPU 映射数据库"]
        },
        {
            version: "1.3.0",
            date: "2024-03-20",
            changes: ["新增高级硬件交互工具(压感/视频解码)", "优化移动端布局", "增加俄罗斯语支持"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["新增网络诊断工具 (WebRTC/DNS/协议检测)", "新增屏幕色域与 HDR 测试", "优化指纹评分算法"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["新增 AI 性能评估游乐场", "支持蓝牙与手柄检测", "增加设置面板"]
        }
    ],
    close: "关闭"
  },

  sensorModal: {
    sensor_title: "设备传感器",
    sensor_permission_desc: "需要您的授权才能访问设备传感器数据（如陀螺仪）。",
    sensor_allow: "允许访问",
    accelerometer: "加速度计",
    gyroscope: "陀螺仪",
    magnetometer: "磁力计",
    ambient_light: "环境光",
    close: "关闭"
  },

  scoreModal: {
    score_details_title: "指纹评分详情",
    tracking_potential: "追踪风险",
    score_explanation: "此分数表示您当前的浏览器环境被唯一识别的可能性。分数越高，您的设备指纹越独特，越容易被网站追踪。",
    contributing_factors: "评分影响因子",
    close: "关闭",
    factors: {
        canvas_hash: "Canvas 指纹",
        webgl_hash: "WebGL 指纹",
        hardware_concurrency: "硬件并发信息",
        user_agent: "User Agent 复杂度",
        resolution: "屏幕分辨率",
        audio_context: "音频指纹",
        battery_status: "电池 API",
        locale_time: "时区与语言"
    },
    values: {
        val_unique: "独特/罕见值",
        val_generic: "通用/常见值",
        val_specific: "过于具体",
        val_readable: "可读取",
        val_protected: "受保护/模糊化"
    },
    descriptions: {
        desc_canvas_unique: "Canvas 渲染结果具有高度唯一性。",
        desc_canvas_generic: "Canvas 返回了通用或受保护的结果。",
        desc_webgl_unique: "GPU 渲染特征具有唯一性。",
        desc_webgl_generic: "WebGL 受到保护或被屏蔽。",
        desc_hardware_unique: "CPU/内存组合较为罕见。",
        desc_hardware_generic: "常见的硬件配置。",
        desc_ua_unique: "UA 字符串包含过多特有信息。",
        desc_res_unique: "非标准的屏幕分辨率。",
        desc_audio_unique: "音频硬件特征可被识别。",
        desc_battery_unique: "电池状态 API 暴露了具体电量。",
        desc_battery_generic: "电池 API 不可用或返回通用值。",
        desc_locale_unique: "时区与语言组合可用于辅助识别。"
    }
  },

  fingerprintModal: {
    title: "指纹生成器",
    desc: "生成并分析浏览器指纹",
    tab_v4: "FingerprintJS v4",
    tab_v2: "FingerprintJS v2",
    tab_fonts: "字体检测",
    salt_label: "自定义 Salt (干扰项)",
    font_detect_desc: "检测系统已安装的字体列表",
    visitor_id: "访客 ID (Hash)",
    time_taken: "耗时",
    generating: "生成中...",
    components_label: "指纹组件",
    select_all: "全选",
    deselect_all: "取消全选",
    font_list_title: "已检测到的字体",
    copy: "复制 ID",
    copied: "已复制",
    close: "关闭"
  },

  benchmarkModal: {
    title: "性能基准测试",
    start_btn: "开始全套测试",
    running: "测试进行中...",
    score: "综合跑分",
    cpu_test: "CPU 素数计算",
    math_test: "浮点运算性能",
    memory_test: "内存读写吞吐",
    dom_test: "DOM 操作性能",
    gpu_test: "Canvas 渲染性能",
    storage_test: "数据库 IOPS"
  },

  aiPlayground: {
    title: "AI 游乐场",
    desc: "在浏览器本地运行轻量级 AI 模型 (DistilBERT)。无需上传数据。",
    model_name: "情感分析模型",
    loading_model: "正在加载模型权重...",
    input_placeholder: "输入一段英文文本进行情感分析...",
    result_label: "分析结果",
    confidence: "置信度"
  },

  computeStress: {
    title: "前沿算力压力测试",
    warning: "警告：此测试将最大化 GPU 负载。可能会导致电池耗尽、发热或系统暂时冻结。请谨慎使用。",
    start: "开始神经压测",
    stop: "停止",
    intensity: "张量大小",
    status_active: "运算中",
    status_idle: "空闲",
    metric_gflops: "GFLOPS",
    metric_usage: "运算次数/秒",
    backend_webgpu: "后端: WebGPU (矩阵乘法)",
    backend_fallback: "后端: WebGL (GPGPU 回退)",
    error_webgpu: "当前浏览器不支持 WebGPU，将回退到传统方法。",
    use_fp16: "启用 FP16 (半精度浮点)",
    fp16_desc: "加速 AI Tensor Cores 运算",
    stability: "稳定性",
    peak: "峰值"
  },

  gamepadTool: {
    title: "手柄与蓝牙",
    tab_gamepad: "游戏手柄",
    tab_bluetooth: "蓝牙设备",
    no_gamepad: "未检测到手柄",
    connect_instruction: "请连接手柄并按下任意按键以激活",
    btn_scan_bt: "扫描蓝牙设备",
    bt_scanning: "扫描中...",
    bt_devices: "已发现设备",
    bt_no_devices: "暂无设备",
    bt_not_supported: "当前浏览器不支持 Web Bluetooth API"
  },

  hardwareToolsModal: {
    title: "硬件交互工具",
    tab_vibrate: "振动",
    tab_touch: "触控",
    tab_keyboard: "键盘测试",
    tab_mouse: "鼠标回报率",
    tab_pointer: "压感/手写笔",
    tab_video: "解码能力",
    vibrate_not_supported: "您的设备不支持振动 API",
    vibrate_short: "短振动 (200ms)",
    vibrate_medium: "中振动 (500ms)",
    vibrate_pattern: "脉冲模式",
    touch_instruction: "请在屏幕上触摸或移动",
    touch_count: "触控点数",
    key_instruction: "按下任意键进行测试...",
    key_last: "当前按键",
    key_history: "已检测按键",
    key_input_placeholder: "在此处输入以测试键盘...",
    mouse_instruction: "在此区域内快速移动鼠标以测量事件回报率 (Polling Rate)。",
    mouse_rate: "当前回报率",
    mouse_peak: "峰值回报率",
    pointer_instruction: "在此绘图。支持压感、倾斜度及手写笔输入。",
    pointer_pressure: "压力感应",
    pointer_tilt: "倾斜角度 (X/Y)",
    pointer_type: "输入类型",
    video_instruction: "正在检测硬件视频解码能力矩阵...",
    video_codec: "编码格式",
    video_res: "分辨率",
    video_efficient: "高效能 (硬件加速)",
    video_smooth: "流畅播放",
    filter_supported: "仅显示支持项",
    video_title: "音视频解码能力矩阵",
    status_api_error: "API 错误",
    status_api_na: "API 不可用",
    status_hw: "硬解",
    status_sw: "软解",
    status_software: "软件解码",
    tooltip_hw: "硬件加速 (高效)",
    tooltip_sw: "软件解码 (高功耗)",
    tooltip_drop: "可能掉帧",
    status_done: "完成"
  },

  visionModal: {
    title: "视觉能力 (Vision)",
    unsupported_desc: "您的浏览器不支持原生的 BarcodeDetector API。您可以使用 Polyfill 模式 (软件解码) 来测试视觉识别能力。",
    api_status: "API 支持状态",
    detect_mode: "检测模式",
    camera_source: "摄像头来源",
    latency: "延迟",
    hw_accel: "硬件加速",
    sw_decode: "软件解码",
    sw_warning: "软件解码占用 CPU 较高，速度可能较慢。",
    native_api: "原生 API (硬解)",
    polyfill: "Polyfill (软解)",
    detecting: "检测中...",
    formats: "支持格式",
    perf: "性能指标",
    fps: "帧率",
    last_result: "最新检测",
    start_cam: "启动摄像头",
    stop_cam: "停止",
    switch_cam: "切换摄像头",
    no_cam_error: "未找到摄像头或权限被拒绝",
    auto_scan: "自动连续扫描",
    manual_capture: "手动拍摄识别"
  }
};
