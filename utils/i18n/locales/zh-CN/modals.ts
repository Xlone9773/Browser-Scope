
export const modals = {
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
            version: "2.1.0",
            title: "色彩更新",
            date: "2026-05-04",
            changes: [
                "🎨 新增自定义主题色彩选项 (设置 -> 通用)",
                "✨ 新增自定义界面元素入场动画配置",
                "🐛 修复了命令行工具调用的一些相关问题"
            ]
        },
        {
            version: "2.0.0",
            date: "2026-05-03",
            changes: [
                "🚀 全新架构与完整体验升级",
                "修复了 vConsole 加载报错的问题（开发者工具完美运行）", 
                "增强了原生组件弹窗体验（重新设计 UI）",
                "新增自定义通知动作按钮 (Actions) 和自定义图标支持",
                "改善并修复了各环境多项兼容性 Bug"
            ]
        },
        {
            version: "1.7.0",
            date: "2024-05-01",
            changes: ["新增 WebGPU 光线追踪基准测试", "增强 GPU 检测能力"]
        },
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
    value_label: "检测值",
    close: "关闭",
    categories: {
        hardware: "硬件特征",
        browser: "浏览器",
        network: "网络",
        media: "多媒体",
        screen: "屏幕"
    },
    factors: {
        canvas_hash: "Canvas 指纹",
        webgl_hash: "WebGL 指纹",
        hardware_concurrency: "并发核心数",
        user_agent: "User Agent",
        resolution: "分辨率",
        audio_context: "音频指纹",
        battery_status: "电池 API",
        locale_time: "时区与语言",
        gpu_renderer: "GPU 渲染器",
        webrtc_leak: "WebRTC 泄露",
        screen_advanced: "高级屏幕参数",
        drm_support: "DRM 系统支持",
        touch_support: "触控支持"
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
        desc_ua_ch: "Client Hints 暴露了具体的设备型号。",
        desc_res_unique: "非标准的屏幕分辨率。",
        desc_audio_unique: "音频硬件特征可被识别。",
        desc_battery_unique: "电池状态 API 暴露了具体电量。",
        desc_battery_generic: "电池 API 不可用或返回通用值。",
        desc_locale_unique: "时区与语言组合可用于辅助识别。",
        desc_gpu_unique: "完整的显卡型号字符串被暴露。",
        desc_webrtc_leak: "WebRTC 泄露了真实的局域网或公网 IP。",
        desc_webrtc_safe: "WebRTC IP 已被混淆或禁用。",
        desc_screen_advanced: "色深、HDR 和像素比的组合较为独特。",
        desc_drm_unique: "支持的 DRM 系统组合缩小了识别范围。"
    }
  },
  fingerprintModal: {
    title: "指纹生成器",
    desc: "生成并分析浏览器指纹",
    tab_v5: "FingerprintJS v5",
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
  graphicsModal: {
    supported_features: "支持的特性",
    no_params_found: "未找到匹配的参数：",
    title: "显卡深度信息 & 极限参数",
    tab_webgl: "WebGL 极限参数",
    tab_webgpu: "WebGPU 极限参数",
    tab_features: "特性支持",
    loading: "正在查询 GPU 能力...",
    not_supported: "当前浏览器不支持 WebGPU。",
    copy: "复制报告",
    search: "搜索参数..."
  },
  speechModal: {
    title: "语音合成浏览器",
    lang_filter: "按语言筛选",
    play: "试听",
    default: "默认",
    local: "本地",
    remote: "在线",
    no_voices: "未找到语音包。请检查您的系统是否支持文本转语音。",
    loading: "加载语音库..."
  },
  storageBenchmark: {
    title: "存储性能基准测试 Pro",
    start: "开始测试",
    stop: "停止",
    target_label: "存储目标",
    size_label: "测试规模",
    chunk_size: "分块大小",
    opfs: "OPFS (私有文件系统)",
    idb: "IndexedDB (数据库)",
    cache: "Cache API (缓存)",
    write: "写入速度",
    read: "读取速度",
    mbps: "MB/s",
    iops: "次/秒",
    results: "测试日志",
    warning: "此测试将在您的磁盘写入临时数据。数据会自动清除，但请确保有足够的可用空间。",
    latency: "延迟 (平均/峰值)",
    export_csv: "导出 CSV",
    clear_logs: "清空日志",
    chunk_size_64: "64 KB (高 IOPS)",
    chunk_size_256: "256 KB",
    chunk_size_1024: "1 MB (均衡)",
    chunk_size_4096: "4 MB (高吞吐量)",
    table_time: "时间",
    table_target: "目标",
    table_op: "类型",
    table_chunk: "分块",
    table_speed: "吞吐量",
    table_latency: "延迟 (平均/峰值)",
    op_read: "读取",
    op_write: "写入"
  },
  heatmap: {
    title: "全球网络质量监测",
    start: "快速扫描",
    stop: "停止",
    region: "区域节点",
    latency: "延迟 (RTT)",
    status: "状态",
    status_pending: "等待中",
    status_error: "超时/错误",
    desc: "点击节点可进入详细的链路追踪模式 (模拟 MTR) 进行持续检测。",
    back: "返回地图",
    mtr_title: "链路质量追踪",
    packet_loss: "丢包率",
    jitter: "抖动 (Jitter)",
    avg_latency: "平均延迟",
    current: "实时",
    samples: "样本数",
    regions: {
        us_east: "美东 (弗吉尼亚)",
        us_west: "美西 (加利福尼亚)",
        ca_central: "加拿大 (蒙特利尔)",
        sa_brazil: "巴西 (圣保罗)",
        sa_chile: "智利 (圣地亚哥)",
        eu_uk: "英国 (伦敦)",
        eu_ger: "德国 (法兰克福)",
        eu_fr: "法国 (巴黎)",
        eu_se: "瑞典 (斯德哥尔摩)",
        ap_india: "印度 (孟买)",
        ap_sg: "新加坡",
        ap_jp: "日本 (东京)",
        ap_kr: "韩国 (首尔)",
        ap_au: "澳大利亚 (悉尼)",
        cn_sh: "中国 (上海)",
        cn_hk: "中国 (香港)",
        cn_tw: "中国 (台北)",
        af_sa: "南非 (开普敦)"
    }
  },
  aiPlayground: {
    title: "AI 游乐场",
    desc: "在浏览器本地运行轻量级 AI 模型 (DistilBERT)。无需上传数据。",
    select_task: "选择模型任务",
    perf_metrics: "性能指标",
    tasks: {
        sentiment: {
            title: "情感分析",
            desc: "识别文本情绪 (DistilBERT)",
            input: "输入英文文本进行情感分析...",
            btn: "开始分析"
        },
        generation: {
            title: "文本生成",
            desc: "智能文本续写 (DistilGPT2)",
            input: "输入开头句子...",
            btn: "生成续写"
        },
        translation: {
            title: "机器翻译",
            desc: "英译德/法 (T5-Small)",
            input: "输入待翻译的英文文本...",
            btn: "翻译"
        }
    },
    status: {
        loading_model: "正在下载模型权重",
        ready: "模型就绪",
        computing: "计算中...",
        idle: "空闲"
    },
    metrics: {
        time_load: "加载耗时",
        time_inference: "推理耗时",
        device: "计算设备"
    },
    result_label: "分析结果",
    confidence: "置信度",
    btn_load: "加载模型"
  },
  rayTracing: {
    title: "GPU 光线追踪",
    start: "开始跑分",
    stop: "停止",
    fps: "帧率 (FPS)",
    spp: "每像素采样 (SPP)",
    bounces: "反弹次数",
    resolution: "分辨率",
    error_webgpu: "您的浏览器不支持 WebGPU。请使用 Chrome 113+ or Edge。",
    desc: "基于 WebGPU 计算着色器 (Compute Shader) 的实时路径追踪基准测试。",
    controls: "材质控制",
    roughness: "粗糙度",
    metalness: "金属度",
    color: "球体颜色",
    reset: "重置视角"
  },
  "extensionsModal": {
    "title": "浏览器扩展检测",
    "note_strong": "注意：",
    "note_text": "由于隐私和安全原因，浏览器不提供原生 API 来列出已安装的扩展。此检测工具通过启发式方法（如检测注入的变量或 DOM 元素）来识别常见的护展程序。这并非您安装的所有扩展的完整列表。",
    "no_extensions": "未检测到已知的扩展程序。",
    "detected": "已检测到",
    "categories": {
      "Development": "开发工具",
      "Crypto": "加密钱包",
      "Shopping": "购物/优惠券",
      "Productivity": "生产力",
      "Utility": "实用工具"
    },
    "names": {
      "react-devtools": "React 开发者工具",
      "vue-devtools": "Vue.js 开发者工具",
      "redux-devtools": "Redux 开发者工具",
      "apollo-devtools": "Apollo 开发者工具",
      "ember-inspector": "Ember 检查器",
      "metamask": "MetaMask (小狐狸)",
      "phantom": "Phantom (幻影)",
      "binance": "币安钱包",
      "coinbase": "Coinbase 钱包",
      "brave-wallet": "Brave 钱包",
      "sui-wallet": "Sui 钱包",
      "honey": "Honey (自动优惠券)",
      "grammarly": "Grammarly (语法检查)",
      "darkreader": "Dark Reader (深色模式)"
    },
    "descs": {
      "react-devtools": "官方 React 调试扩展",
      "vue-devtools": "官方 Vue.js 调试扩展",
      "redux-devtools": "Redux 状态调试",
      "apollo-devtools": "GraphQL 调试工具",
      "ember-inspector": "Ember 框架调试",
      "metamask": "Web3 以太坊钱包",
      "phantom": "Web3 Solana 钱包",
      "binance": "Web3 币安智能链钱包",
      "coinbase": "Web3 Coinbase 钱包",
      "brave-wallet": "Brave 浏览器内置加密钱包",
      "sui-wallet": "Web3 Sui 钱包",
      "honey": "自动查找并应用优惠券",
      "grammarly": "智能写作助手",
      "darkreader": "为所有网页生成深色主题"
    }
  }
};
