
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
  }
};
