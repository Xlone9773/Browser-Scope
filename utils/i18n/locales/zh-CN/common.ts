
export const common = {
  meta: {
    title: "BrowserScope",
    subtitle: "现代浏览器的深度指纹与能力检测工具",
    footer: "BrowserScope - 浏览器能力检测工具",
  },
  common: {
    loading: "正在扫描系统能力...",
    error_boundary: {
        title: "组件崩溃",
        message: "渲染该模块时发生了未预期的错误。",
        retry: "重试",
        unknown_component: "未知组件",
        component_in: "in",
        preliminary_analysis: "初步分析：",
        show_stack_trace: "查看错误堆栈",
        hide_stack_trace: "隐藏错误堆栈",
        copy_error_details: "复制错误详情",
        copied: "已复制！",
        error_stack: "错误堆栈",
        component_stack: "React 组件堆栈",
        no_stack_trace: "无错误堆栈信息。",
        no_component_stack: "无组件堆栈信息。",
        analysis_no_error: "无可用错误对象。",
        analysis_null_reference: "可能是空引用错误。请检查渲染前数据是否已加载完成。",
        analysis_function_call: "方法调用失败。请检查回调函数或方法是否存在且已正确绑定。",
        analysis_invalid_hook: "React Hook 问题。Hooks 必须在函数组件主体内部调用。",
        analysis_network: "网络错误。请检查您的网络连接或 API 接口状态。",
        analysis_json: "JSON 解析错误。服务器返回了不符合预期的数据格式。",
        analysis_unexpected: "未知的运行时错误。请查看下方的堆栈信息。"
    },
    modal_loading: {
        initializing: "正在初始化",
        loading_module: "正在加载模块资源"
    },
    loading_steps: [
        "正在初始化环境...",
        "检测硬件与 GPU...",
        "分析网络状态...",
        "检查安全与隐私...",
        "评估 AI 性能...",
        "即将完成报告..."
    ],
    refresh: "重新检测",
    actions: {
        start: "开始",
        stop: "停止",
        close: "关闭",
        copy: "复制",
        copied: "已复制",
        download: "下载",
        view_details: "查看详情",
        check: "检查",
        open: "打开",
        reset: "重置",
        export: "导出 JSON"
    }
  },
  status: {
    granted: "已授权",
    denied: "已拒绝",
    prompt: "询问中",
    error: "错误",
    idle: "未请求",
    supported: "支持",
    not_supported: "不支持",
    detected: "已检测",
    none: "无",
    hidden: "隐藏",
    yes: "是",
    no: "否",
    unknown: "未知",
    running: "运行中"
  },
  values: {
    supported: "支持",
    not_supported: "不支持",
    detected: "已检测",
    none: "无",
    hidden: "隐藏/屏蔽",
    yes: "是",
    no: "否",
    connected: "已连接",
    offline: "离线",
    installed: "已安装",
    not_installed: "未安装"
  }
};
