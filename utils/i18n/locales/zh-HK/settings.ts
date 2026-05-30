
export const settings = {
  settings: {
    title: "設定",
    nav: {
        general: "通用",
        network: "網絡工具",
        display: "屏幕檢測",
        storage: "儲存管理",
        resources: "資源監控",
        developer: "開發者",
        modules: "模組管理"
    },
    general: {
        simpleMode: {
            title: "極簡模式",
            desc: "隱藏部分複雜的技術細節，僅顯示核心資訊。"
        },
        scrollbar: {
            title: "隱藏主頁捲動條",
            desc: "僅隱藏主頁面上的預設捲動條樣式。"
        },
        globalScrollbar: {
            title: "全局隱藏捲動條",
            desc: "禁止並隱藏頁面中所有元素的捲動條（包括對話方塊內）。"
        },
        themeColor: {
            title: "主題色彩",
            desc: "選擇應用的主要交互色彩搭配。"
        },
        animationStyle: {
            title: "動畫風格",
            desc: "設定頁面元素載入時的動畫方式。",
            options: {
                slideUp: "向上滑入",
                fade: "淡入",
                flyIn: "向左飛入",
                zoom: "縮放彈出"
            }
        },
        timeFormat: {
            title: "時間格式",
            desc: "在 12 小時制和 24 小時制之間切換。"
        },
        performance: {
            title: "停用模糊",
            desc: "停用模糊特效與透明度以提升介面流暢度（減少 GPU 消耗）。"
        },
        animations: {
            title: "禁用動畫",
            desc: "關閉頁面切換和卡片下載等所有動畫效果。"
        },
        fastAnimations: {
            title: "加快過渡動畫",
            desc: "加快頁面元素的懸停、展開等互動過渡動畫的速度。"
        },
        collapseHeader: {
            title: "收納欄目",
            desc: "在電腦端隱藏頂部導航條上比較生僻的各類功能按鍵。"
        },
        cardVisibility: {
            title: "自訂顯示項目",
            desc: "如果你不希望在主介面看到某些卡片或分組，可以在這裡按需隱藏。"
        },
        udpBypass: {
            title: "啟用 UDP 網絡代理 (完全繞過跨域)",
            desc: "使用UDP映射API提取網絡工具端點，徹底解決由於CORS產生的任何網絡請求攔截。",
            unsupportedEnv: "當前運行環境不支援開啟UDP"
        }
    },
    network: {
        ip: {
            title: "IP 配置資訊",
            ipv4: "IPv4",
            ipv4_desc: "標準互聯網協議",
            ipv6: "IPv6",
            ipv6_desc: "下一代互聯網協議",
            fetch: "查詢 IP",
            check_v6: "檢測 IPv6",
            success_v6: "支援 IPv6",
            fail_v6: "不支援 IPv6",
            detail_location: "地理位置",
            detail_asn: "自治系統",
            detail_timezone: "時區",
            detail_zip: "郵遞區號",
            detail_fraud: "欺詐分數",
            detail_residential: "家居寬頻",
            detail_broadcast: "廣播 IP",
            detail_ua: "用戶代理",
            yes: "是",
            no: "否"
        },
        diagnostics: {
            title: "進階網絡診斷",
            webrtc: {
                title: "WebRTC 洩漏檢測",
                desc: "通過 STUN 伺服器嘗試獲取真實的區域網絡或公網 IP。",
                btn: "開始檢測",
                columns: { type: "類型", ip: "IP 位址", proto: "協定", port: "連接埠" }
            },
            dns: {
                title: "DNS 洩漏檢測",
                desc: "嘗試檢測您目前使用的 DNS 解析伺服器。",
                btn: "檢測 DNS",
                label_ip: "DNS 伺服器 IP",
                label_geo: "DNS 地理位置"
            },
            proto: {
                title: "協定支援",
                desc: "檢測瀏覽器對 HTTP/2 和 HTTP/3 (QUIC) 的支援情況。",
                btn: "檢查協定",
                h2: "HTTP/2 支援",
                h3: "HTTP/3 支援"
            }
        },
        connectivity: {
            title: "連通性測試",
            placeholder: "輸入網址 (例如 google.com)",
            btn: "測試"
        },
        cdn: {
            title: "CDN 狀態",
            check_all: "檢查全部"
        }
    },
    display: {
        deadPixel: {
            title: "壞點檢測",
            desc: "全屏幕顯示純色背景，幫助您尋找屏幕上的壞點或亮點。點擊任意處退出。",
            colors: { red: "紅", green: "綠", blue: "藍", white: "白", black: "黑" }
        },
        hdr: {
            title: "HDR 狀態",
            desc: "檢測目前顯示器和瀏覽器對高動態範圍內容的支援。",
            rangeScreen: "屏幕動態範圍",
            rangeVideo: "視訊動態範圍",
            brightnessTest: "EDR 亮度測試",
            brightnessDesc: "如果支援 HDR/EDR，中間的方塊應比白色背景更亮。",
            labelSdr: "SDR 白色",
            labelEdr: "EDR 高亮白"
        },
        gamut: {
            title: "廣色域測試 (P3)",
            desc: "如果在紅色方塊中能看到 Logo，說明您的裝置支援 P3 廣色域。",
            unsupported: "您的瀏覽器不支援 Display-P3 色域檢測。"
        },
        gradient: {
            title: "色深與灰階",
            desc: "檢查色彩過渡是否平滑（無斷層）以及暗部細節。"
        },
        motion: {
            title: "動態模糊與幀率檢測",
            desc: "請雙眼注視移動的滑塊。如果滑動不平滑或者邊緣有嚴重拖影，可能說明系統正在掉幀或刷新率偏低。"
        }
    },
    storage: {
        local: {
            title: "本地資料",
            clearDesc: "清除所有網站資料",
            clearBtn: "清除"
        },
        sw: {
            title: "Service Workers",
            desc: "管理後台運行的 Service Worker 腳本。",
            unregisterBtn: "登出所有"
        },
        usageLabel: "儲存空間使用率"
    },
    resources: {
        title: "外部資源載入列表",
        columns: { name: "資源名稱", type: "類型", duration: "耗時" }
    },
    developer: {
        config: {
            simulateCrash: "模擬應用崩潰",
            defaultConsoleTitle: "預設控制台",
            consoleNone: "無（系統預設）",
            consoleVConsole: "vConsole",
            consoleEruda: "Eruda",
            recordEvents: "記錄事件",
            recordEventsDesc: "自動記錄視窗與網絡事件",
            vconsole: "vConsole 整合",
            vconsoleDesc: "啓用騰訊 vConsole 面板",
            eruda: "Eruda 整合",
            erudaDesc: "啓用 Eruda 面板",
            erudaDefaultTab: "預設啓用標籤頁",
            erudaDefaultTabDesc: "選擇打開 Eruda 控制台時預設聚焦的標籤頁",
            erudaTabs: {
                console: "控制台 (Console)",
                elements: "元素 (Elements)",
                network: "網絡 (Network)",
                resources: "資源 (Resources)",
                sources: "源碼 (Sources)",
                info: "資訊 (Info)",
                snippets: "片段 (Snippets)",
                timing: "載入時間 (Timing)",
                features: "特性 (Features)",
                monitor: "監控 (Monitor)",
                fps: "幀率 (FPS)"
            },
            loadSnippets: "預先注入代碼片段",
            loadSnippetsDesc: "選擇將哪些常用的快捷代碼片段注入到 Eruda 控制台中",
            snippetClearLocal: "清理本地存儲 (LocalStorage)",
            snippetClearSession: "清理會話存儲 (SessionStorage)",
            snippetShowCookies: "顯示所有 Cookie",
            snippetToggleBlur: "切換背景模糊 (修復白屏遮擋)",
            snippetToggleEditable: "切換頁面文字可編輯狀態",
        },
        warning: {
            title: "操作極度危險！",
            desc: "這裡是為開發者準備的偵錯區域。如果不清楚自己在做什麼，請立即關閉視窗！\n\n任何誘導你在此處貼上代碼的人都是詐騙。執行未知代碼可能導致你的私隱洩露、帳號被盜或裝置被惡意控制。",
            agree: "我已知曉風險，繼續",
            cancel: "算了，不用這功能了",
            disabled_title: "開發者模式已停用",
            disabled_desc: "你剛才選擇了取消。如果遇到問題想排障，隨時都能把它重新打開。",
            reenable: "重新打開並接受風險"
        },
        nav: {
            events: "事件流",
            inspector: "物件檢查",
            console: "控制台"
        },
        actions: {
            float: "浮動視窗",
            loadVConsole: "載入 vConsole",
            dock: "恢復到底部"
        },
        events: {
            placeholder: "等待系統事件...",
            copy: "複製日誌",
            clear: "清空"
        },
        console: {
            placeholder: "輸入 JS 代碼 (輸入 '\\' 查看預設)...",
            clearInput: "清除輸入",
            resultPlaceholder: "運行結果將顯示在這裡...",
            copy: "複製結果",
            download: "下載結果",
            clear: "清空結果",
            quickCommands: "快捷指令",
            run: "立即運行",
            presets: {
                userAgent: { label: "User Agent", desc: "查看瀏覽器 UA 字串" },
                screenInfo: { label: "螢幕資訊", desc: "解像度與像素比例" },
                cookies: { label: "Cookies", desc: "顯示所有 Cookie" },
                clearStorage: { label: "清空本地儲存", desc: "擦除 LocalStorage 資料" },
                editPage: { label: "編輯頁面", desc: "切換頁面內容是否可編輯" },
                disableBlur: { label: "停用模糊", desc: "切換全域模糊效果" },
                blockClicks: { label: "阻斷點擊", desc: "切換全域事件攔截" },
                getKeys: { label: "取得所有鍵", desc: "列出 LocalStorage 中的鍵名" },
                reload: { label: "重新載入", desc: "強制重新整理當前頁面" },
                performance: { label: "效能計時", desc: "當前時間戳（毫秒）" },
                network: { label: "網絡資訊", desc: "連線與頻寬情況" },
                memory: { label: "記憶體狀況", desc: "堆疊記憶體大小 (僅 Chrome)" }
            }
        },
        floating_state: {
            title: "開發者工具處於懸浮窗模式",
            desc: "開發者工具視窗已從當前模態框分離，以提供更好的體驗。",
            return: "返回模態框"
        }
    },
    modules: {
        title: "模組管理",
        desc: "監控和管理已載入的模態框組件。卸載未使用的模組可以釋放記憶體和 GPU 資源。",
        headers: {
            name: "模組名稱",
            status: "狀態",
            impact: "資源佔用",
            action: "操作"
        },
        status: {
            active: "運行中",
            inactive: "閒置",
            cached: "已緩存",
            system: "系統核心"
        },
        impact: {
            low: "低",
            med: "中",
            high: "高"
        },
        actions: {
            unload: "卸載",
            unloadAll: "卸載所有活動模組"
        }
    }
  }
};
