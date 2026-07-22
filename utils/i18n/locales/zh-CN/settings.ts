
export const settings = {
  settings: {
    title: "设置",
    nav: {
        general: "通用设置",
        appearance: "外观设置",
        network: "网络工具",
        display: "屏幕检测",
        storage: "存储管理",
        resources: "网络请求",
        developer: "开发者",
        modules: "模块管理",
        versions: "版本与更新"
    },
    general: {
        fontSettings: {
            title: "界面字体定制",
            desc: "为正文文本和弹窗标题定制个性化的界面排版字体。",
            bodyFont: "正文字体",
            bodyFontDesc: "改变所有数据、表格、说明文本与诊断报告的正文字体。",
            modalTitleFont: "弹窗标题字体",
            modalTitleFontDesc: "改变所有弹出窗口、对话框和设置标题的字体样式。",
            codeFont: "代码/等宽字体",
            codeFontDesc: "改变所有代码块、终端、路径与变量的等宽字体样式。",
            defaultFont: "系统默认 (MiSans)",
            defaultCodeFont: "系统默认等宽字体",
            mismatchError: "所选字体不支持当前界面语言（{lang}），已自动为您拦截。请先在「存储管理」中下载该字体或切换界面语言！",
            mismatchTitle: "字体语言不兼容",
            fontNames: {
                googlesansflex: "Google Sans Flex",
                notosans: "Noto Sans",
                roboto: "Roboto Regular",
                harmonyossanssc: "华为鸿蒙体 (HarmonyOS Sans SC)",
                misans: "小米兰亭体 (MiSans)",
                smileysans: "得意黑 (Smiley Sans Oblique)",
                zcoolxiaowei: "站酷小薇体",
                sawarabigothic: "Sawarabi Gothic",
                notosanssc: "思源黑体 (Noto Sans SC)",
                notosanstc: "思源繁体 (Noto Sans TC)",
                notosansjp: "思源日文 (Noto Sans JP)",
                jetbrainsmono: "JetBrains Mono",
                firacode: "Fira Code",
                robotomono: "Roboto Mono",
                sourcecodepro: "Source Code Pro",
                geist: "Geist"
            }
        },
        showTabs: {
            title: "显示导航栏",
            desc: "在内容上方显示用于筛选分类的选项卡，若所有选项卡都为空将自动隐藏。"
        },
        showSearch: {
        
        
            title: "启用搜索栏",
        
        
            desc: "在标签栏上方显示搜索栏，以便快速筛选主面板的类目与卡片内容。"
        
        
        },
        
        
        
        searchScope: {
            title: "搜索范围",
            desc: "选择搜索关键字的匹配范围。",
            options: {
                all: "全部文字",
                category: "卡片栏目",
                title: "卡片标题",
                value: "检测数值"
            }
        },
        searchMode: {
            title: "搜索模式",
            desc: "选择模糊匹配或精确匹配。",
            options: {
                fuzzy: "模糊匹配",
                exact: "精确匹配"
            }
        },simpleMode: {
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
        },
        
        restoreNotifications: {
            title: "恢复通知卡片",
            desc: "重新显示在仪表盘顶部被您手动关闭的所有通知卡片。",
            button: "恢复所有通知",
            empty: "暂无被关闭的通知"
        },
        quickSummaryVisibility: {
            title: "快速概要",
            desc: "重新显示主界面顶部的快速概要卡片（包含网络状态、安全指标等）。",
            restoreBtn: "恢复显示",
            activeState: "已恢复显示"
        },udpBypass: {
            title: "启用 UDP 网络代理 (完全绕过跨域)",
            desc: "使用UDP映射API提取网络工具端点，彻底解决由于CORS产生的任何网络请求拦截。",
            unsupportedEnv: "当前运行环境不支持开启UDP",
            checkingUdp: "正在检查 UDP 支持...",
            recheckUdp: "重新检查",
            limitationsTitle: "局限性与限制",
            limitationsList: [
                "代理中转延迟：所有请求均需要经过部署的云端代理服务器进行中转，会增加网络传输延迟。",
                "隐藏真实 IP：目标节点只能获取到云端代理服务器的 IP 地址，无法检测您实际电脑的本地出口 IP。",
                "区域定位偏差：受限于代理服务器所在的物理位置，诊断结果可能会出现区域定位偏差。",
                "并发频率限制：高频并发进行网络诊断可能触发中转节点的防刷和流量频率限制。"
            ],
            pros: "无需任何配置，支持的环境下开箱即用，体验简单快捷。",
            cons: "较高的延迟，无法暴露真实客户端 IP，极度依赖中转服务器且有潜在频控。",
            prosLabel: "优势",
            consLabel: "劣势"
        },
        userscriptBypass: {
            title: "篡改猴(Tampermonkey)跨域脚本辅助 (直连绕过)",
            desc: "通过安装在浏览器中的 Tampermonkey 脚本，直接从您的实际电脑发起网络诊断与 TLS 指纹请求，不经过任何服务器代理，完全绕过 CORS 拦截。安全、高速、直连。",
            recommended: "推荐方案",
            statusActive: "脚本已激活并成功连接",
            statusInactive: "未检测到脚本运行或尚未安装",
            installGuide: "脚本安装指南",
            copyScript: "复制脚本代码",
            quickInstall: "一键快捷安装 (推荐)",
            manualInstallBackup: "手动复制安装 (备用)",
            copied: "已复制到剪贴板!",
            enableBtn: "优先启用篡改猴脚本跨域直连",
            disableBtn: "不启用 (Fallback)",
            recheck: "重新检测状态",
            checking: "正在检查脚本状态...",
            pros: "网络直连、超低延迟、准确捕获客户端真实出口 IP、完全隐私安全、无任何频控限制。",
            cons: "需要首次手动安装浏览器扩展并配置一次脚本代码。",
            comparisonTitle: "跨域绕过方式对比",
            methodHeader: "特性对比",
            udpBypassHeader: "UDP 云端代理 (服务器)",
            userscriptBypassHeader: "篡改猴脚本 (本地直连)",
            steps: {
                step1: "在浏览器中安装 **Tampermonkey (篡改猴)** 或类似的用户脚本管理扩展。",
                step2: "点击该扩展的图标，选择 **“添加新脚本” (Create a new script)**。",
                step3: "复制下方完整的脚本代码，在编辑器中全部粘贴覆盖并保存 (Ctrl+S)。",
                step4: "保存成功后，重新刷新本页面。系统将会自动与脚本握手连接！"
            }
        },
        exportSettings: {
            title: "导出和导入设置",
            desc: "导出您当前的各项设置和偏好，或导入设置以在迁移平台后快速配置。",
            exportBtn: "导出",
            importBtn: "导入",
            importSuccess: "设置导入成功！页面即将重新加载。",
            importError: "无效的设置文件。"
        },
        appExportSettings: {
            title: "「导出」功能设置",
            desc: "控制仪表盘「导出」功能的格式与清晰度。",
            imageScale: "图片上采样率",
            pdfFormat: "PDF 页面格式",
            pdfFont: "PDF 导出字体",
            scales: {
                scale1: "1x - 原始分辨率",
                scale2: "2x - 视网膜高清",
                scale3: "3x - 超清",
                scale4: "4x - 极清"
            },
            formats: {
                a4: "A4 (210 × 297 毫米)",
                letter: "Letter (8.5 × 11 英寸)",
                legal: "Legal (8.5 × 14 英寸)"
            },
            fonts: {
                auto: "自动 / 语言默认字体",
                helvetica: "Helvetica (无衬线体)",
                times: "Times New Roman (衬线体)",
                courier: "Courier (等宽字体)"
            }
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
            fail_v6: "不支持 IPv6",
            detail_location: "地理位置",
            detail_asn: "自治系统",
            detail_timezone: "时区",
            detail_zip: "邮政编码",
            detail_fraud: "欺诈分数",
            detail_residential: "家庭宽带",
            detail_broadcast: "广播 IP",
            detail_ua: "用户代理",
            yes: "是",
            no: "否"
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
            click_to_exit: "点击任意处退出",
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
        usageLabel: "存储空间使用率",
        fonts: {
            title: "字体缓存管理",
            desc: "为显著减小应用包体积，诊断报告导出的各种非英文字体已改为从全球 CDN 按需拉取。在此您可以预先下载字体以便离线生成 PDF，或将其删除以释放浏览器缓存空间。",
            name: "字体名称",
            languages: "适用语言",
            status: "状态",
            cached: "已缓存 ({size})",
            notCached: "未缓存 (CDN 载入)",
            downloading: "正在下载...",
            downloadBtn: "下载",
            deleteBtn: "删除",
            sizeUnknown: "未知大小",
            downloadSuccess: "字体下载成功！",
            deleteSuccess: "字体已成功清除！",
            downloadFailed: "下载字体失败，请检查网络。",
            deleteFailed: "删除字体失败。",
            labels: {
                googlesansflex: "英语 / 拉丁文",
                notosans: "多语言 / 西里尔文",
                roboto: "俄语 / 西里尔文",
                harmonyossanssc: "简体中文 / 英文",
                misans: "简体中文 / 英文",
                zcoolxiaowei: "中文 (简体与繁体)",
                sawarabigothic: "日语",
                notosanssc: "简体中文",
                notosanstc: "繁体中文",
                notosansjp: "日文"
            }
        },
        locales: {
            title: "语言包缓存管理",
            desc: "为减少初始加载时间，除核心英文语言包外，其他语言包均可按需动态加载。在此您可以预先下载语言包以便离线使用，或将其清除以释放空间。",
            name: "语言包",
            code: "语言代码",
            status: "状态",
            cached: "已缓存 ({size})",
            notCached: "未缓存 (点击下载)",
            downloading: "正在下载...",
            downloadBtn: "下载",
            deleteBtn: "删除",
            sizeUnknown: "未知大小",
            downloadSuccess: "语言包下载成功！",
            deleteSuccess: "语言包已成功清除！",
            downloadFailed: "下载语言包失败，请检查网络。",
            deleteFailed: "删除语言包失败。",
            coreLanguage: "核心语言 (内置)",
            notDownloadedTooltip: "该语言包尚未下载。点击将自动下载并完成切换。",
            cannotDeleteActive: "无法删除当前正在使用的语言包，以避免出现渲染问题。"
        }
    },
    resources: {
        title: "网络请求监控",
        subtitle: "监控和分析应用产生的网络请求（区分原生 Fetch、UDP 转发与用户脚本）",
        clear: "清空记录",
        empty: "暂无网络请求记录",
        searchPlaceholder: "搜索请求地址...",
        all: "全部",
        columns: {
            url: "请求地址",
            method: "请求方法",
            type: "发起类型",
            status: "状态",
            duration: "耗时",
            time: "时间戳"
        },
        types: {
            udp: "UDP 转发",
            native: "原生请求",
            script: "用户脚本",
            unknown: "其他"
        },
        details: {
            title: "请求详情",
            id: "请求 ID",
            url: "请求地址",
            method: "请求方法",
            type: "请求类型",
            status: "响应状态",
            duration: "耗时",
            initiator: "发起者",
            timestamp: "时间戳",
            pending: "加载中...",
            openUrl: "打开目标地址"
        }
    },
    developer: {
        config: {
            simulateCrash: "模拟应用崩溃",
            clearConsoleCache: "清除控制台与 PWA 缓存",
            clearConsoleCacheDesc: "强制注销 Service Worker 并清除 Cache Storage 缓存",
            defaultConsoleTitle: "默认控制台",
            consoleNone: "无（系统默认）",
            consoleVConsole: "vConsole",
            consoleEruda: "Eruda",
            recordEvents: "记录事件",
            recordEventsDesc: "自动记录窗口与网络事件",
            vconsole: "vConsole 调试",
            vconsoleDesc: "开启腾讯 vConsole 面板",
            eruda: "Eruda 调试",
            erudaDesc: "开启 Eruda 面板",
            erudaDefaultTab: "默认激活标签页",
            erudaDefaultTabDesc: "选择打开 Eruda 控制台时默认聚焦的标签页",
            vconsoleDefaultTab: "默认 vConsole 标签页",
            vconsoleDefaultTabDesc: "选择打开 vConsole 时默认聚焦的标签页",
            vconsoleTabs: {
                default: "默认 (Default)",
                system: "系统 (System)",
                network: "网络 (Network)",
                element: "元素 (Element)",
                storage: "存储 (Storage)"
            },
            erudaTabs: {
                console: "控制台 (Console)",
                elements: "元素 (Elements)",
                network: "网络 (Network)",
                resources: "资源 (Resources)",
                sources: "源码 (Sources)",
                info: "信息 (Info)",
                snippets: "片段 (Snippets)",
                timing: "加载耗时 (Timing)",
                features: "特性 (Features)",
                monitor: "监控 (Monitor)",
                fps: "帧率 (FPS)"
            },
            loadSnippets: "预注入代码片段",
            loadSnippetsDesc: "选择将哪些常用的快捷代码片段注入到 Eruda 控制台中",
            snippetClearLocal: "清理本地存储 (LocalStorage)",
            snippetClearSession: "清理会话存储 (SessionStorage)",
            snippetShowCookies: "显示所有 Cookie",
            snippetToggleBlur: "切换背景模糊 (修复白屏遮挡)",
            snippetToggleEditable: "切换页面文字可编辑状态",
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
            system: "系统核心",
            locked: "已锁定"
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
    },
    versions: {
        title: "软件版本",
        desc: "查看当前核心软件版本和已加载模块，如有需要可强制拉取更新代码。",
        forcePull: "检查更新",
        applyUpdate: "应用更新并重启",
        upToDate: "当前已是最新版本",
        lastChecked: "上次检查时间: ",
        coreApp: "核心应用程序",
        installedModules: "已安装模块",
        libraries: "核心依赖库"
    }
  }
,
  "modules": {
    "impact": {
      "high": "高",
      "med": "中",
      "low": "低"
    },
    "title": "模块",
    "desc": "管理动态加载的工具。",
    "status": {
      "active": "活跃",
      "cached": "已缓存",
      "inactive": "未激活",
      "system": "系统",
      "locked": "已锁定"
    },
    "actions": {
      "unloadAll": "全部卸载",
      "unload": "卸载"
    },
    "headers": {
      "name": "名称",
      "status": "状态",
      "impact": "影响",
      "action": "操作"
    }
  },
  "versions": {
    "upToDate": "应用已是最新版本。",
    "title": "软件版本",
    "desc": "查看当前核心软件版本和已加载模块。如有需要可拉取更新。",
    "applyUpdate": "应用更新",
    "forcePull": "检查更新",
    "lastChecked": "最后检查:",
    "coreApp": "核心应用",
    "libraries": "核心库",
    "installedModules": "已安装模块"
  },
  "developer": {
    "config": {
      "recordEvents": "记录事件",
      "recordEventsDesc": "自动记录窗口和网络事件",
      "defaultConsoleTitle": "默认控制台",
      "consoleVConsole": "vConsole",
      "consoleEruda": "Eruda",
      "vconsoleDefaultTab": "默认 vConsole 选项卡",
      "vconsoleDefaultTabDesc": "选择打开 vConsole 时聚焦的选项卡。",
      "vconsoleTabs": {
        "default": "默认",
        "system": "系统",
        "network": "网络",
        "element": "元素",
        "storage": "存储"
      },
      "erudaDefaultTab": "默认 Eruda 选项卡",
      "erudaDefaultTabDesc": "选择打开 Eruda 时聚焦的选项卡。",
      "erudaTabs": {
        "console": "控制台",
        "elements": "元素 (DOM)",
        "network": "网络",
        "resources": "资源",
        "sources": "源码",
        "info": "信息",
        "snippets": "代码片段",
        "timing": "时间",
        "features": "功能",
        "monitor": "监控",
        "fps": "FPS"
      },
      "loadSnippets": "代码片段",
      "snippetClearLocal": "清除 LocalStorage",
      "snippetClearSession": "清除 SessionStorage",
      "snippetShowCookies": "显示 Cookies",
      "snippetToggleBlur": "切换页面模糊",
      "snippetToggleEditable": "切换页面可编辑",
       "simulateCrash": "模拟开发崩溃",
       "clearConsoleCache": "清除控制台与 PWA 缓存",
       "clearConsoleCacheDesc": "强制注销 Service Worker 并清除 Cache Storage 缓存"
    }
  }

};
