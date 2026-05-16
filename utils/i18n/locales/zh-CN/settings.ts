
export const settings = {
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
            title: "隐藏主页滚动条",
            desc: "仅隐藏主页面上的默认滚动条样式。"
        },
        globalScrollbar: {
            title: "全局隐藏滚动条",
            desc: "禁止并隐藏页面中所有元素的滚动条（包括弹窗内）。"
        },
        themeColor: {
            title: "主题色彩",
            desc: "选择应用的主要交互色彩配搭。"
        },
        animationStyle: {
            title: "动画风格",
            desc: "设置页面元素载入时的动画方式。",
            options: {
                slideUp: "向上滑入",
                fade: "淡入",
                flyIn: "向左飞入",
                zoom: "缩放弹出"
            }
        },
        timeFormat: {
            title: "时间格式",
            desc: "在 12 小时制和 24 小时制之间切换。"
        },
        performance: {
            title: "禁用模糊",
            desc: "禁用模糊特效与透明度以提升界面流畅度（减少 GPU 消耗）。"
        },
        animations: {
            title: "禁用动画",
            desc: "关闭页面切换和卡片加载等所有动画效果。"
        },
        fastAnimations: {
            title: "加快过渡动画",
            desc: "加快页面元素的悬停、展开等交互过渡动画的速度。"
        },
        collapseHeader: {
            title: "收纳栏目",
            desc: "在电脑端隐藏顶部导航条上比较生僻的各类功能按键。"
        },
        cardVisibility: {
            title: "自定义显示项",
            desc: "如果你不希望在主界面看到某些卡片或者分组，可以在这里按需隐藏。"
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
        },
        motion: {
            title: "动态模糊与帧率检测",
            desc: "请双眼注视移动的滑块。如果滑动不平滑或者边缘有严重拖影，可能说明系统正在掉帧或刷新率偏低。"
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
        config: {
            recordEvents: "记录事件",
            recordEventsDesc: "自动记录窗口与网络事件",
            vconsole: "vConsole 调试",
            vconsoleDesc: "开启腾讯 vConsole 面板"
        },
        warning: {
            title: "操作极其危险！",
            desc: "这里是为开发者准备的调试区域。如果不清楚自己在做什么，请立即关闭窗口！\n\n任何诱导你在此处粘贴代码的人都是骗子。执行未知代码可能导致你的隐私泄露、账号被盗或设备被恶意控制。",
            agree: "我已知晓风险，继续",
            cancel: "算了，不用这功能了",
            disabled_title: "开发者模式已禁用",
            disabled_desc: "你刚才选择了取消。如果遇到问题想排障，随时都能把它重新打开。",
            reenable: "重新打开并接受风险"
        },
        nav: {
            events: "事件流",
            inspector: "对象检查",
            console: "控制台"
        },
        actions: {
            float: "浮动窗口",
            loadVConsole: "加载 vConsole",
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
            run: "立即运行",
            presets: {
                userAgent: { label: "User Agent", desc: "查看浏览器 UA 字符串" },
                screenInfo: { label: "屏幕信息", desc: "分辨率与像素比例" },
                cookies: { label: "Cookies", desc: "显示所有 Cookie" },
                clearStorage: { label: "清空本地存储", desc: "擦除 LocalStorage 数据" },
                editPage: { label: "编辑页面", desc: "切换页面内容是否可编辑" },
                disableBlur: { label: "禁用模糊", desc: "切换全局模糊效果" },
                blockClicks: { label: "阻断点击", desc: "切换全局事件拦截" },
                getKeys: { label: "获取所有键", desc: "列出 LocalStorage 中的键名" },
                reload: { label: "重新加载", desc: "强制刷新当前页面" },
                performance: { label: "性能计时", desc: "当前时间戳（毫秒）" },
                network: { label: "网络信息", desc: "连接与带宽情况" },
                memory: { label: "内存状况", desc: "堆内存大小 (仅 Chrome)" }
            }
        },
        floating_state: {
            title: "开发者工具处于悬浮窗模式",
            desc: "开发者工具窗口已从当前模态框分离，以提供更好的体验。",
            return: "返回模态框"
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
            unload: "卸载",
            unloadAll: "卸载所有活动模块"
        }
    }
  }
};
