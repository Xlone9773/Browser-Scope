
export const settings = {
  settings: {
    title: "Settings",
    nav: {
        general: "General",
        appearance: "Appearance",
        network: "Network Tools",
        display: "Display Tests",
        storage: "Storage",
        resources: "Network Requests",
        developer: "Developer",
        modules: "Module Manager",
        versions: "Versions & Updates"
    },
    general: {
        fontSettings: {
            title: "Font Customization",
            desc: "Customize UI typography for body content and dialog modal titles.",
            bodyFont: "Body Font",
            bodyFontDesc: "Change the font family of body texts, lists, and diagnostic reports.",
            modalTitleFont: "Modal Title Font",
            modalTitleFontDesc: "Change the font family of headers, settings modal, and dialogs.",
            codeFont: "Code/Monospace Font",
            codeFontDesc: "Change the font family of code blocks, terminals, variables, and exports.",
            defaultFont: "System Default (Inter)",
            defaultCodeFont: "System Default (Monospace)",
            mismatchError: "The selected font does not support your current display language ({lang}). Select blocked.",
            mismatchTitle: "Font Language Blocked",
            fontNames: {
                googlesansflex: "Google Sans Flex",
                notosans: "Noto Sans",
                roboto: "Roboto Regular",
                harmonyossanssc: "HarmonyOS Sans SC",
                misans: "MiSans",
                smileysans: "Smiley Sans Oblique (得意黑)",
                zcoolxiaowei: "ZCOOL XiaoWei",
                sawarabigothic: "Sawarabi Gothic",
                notosanssc: "Noto Sans SC",
                notosanstc: "Noto Sans TC",
                notosansjp: "Noto Sans JP",
                jetbrainsmono: "JetBrains Mono",
                firacode: "Fira Code",
                robotomono: "Roboto Mono",
                sourcecodepro: "Source Code Pro",
                geist: "Geist"
            }
        },
        showTabs: {
            title: "Display Navigation Tabs",
            desc: "Show navigation tabs above the content to filter items. Automatically hides if empty."
        },
        showSearch: {
        
        
            title: "Enable Search Bar",
        
        
            desc: "Display a search bar above the tab bar to quickly filter dashboard categories and card content."
        
        
        },
        
        
        
        searchScope: {
            title: "Search Scope",
            desc: "Select what content the search should match against.",
            options: {
                all: "All Text",
                category: "Category",
                title: "Title",
                value: "Value"
            }
        },
        searchMode: {
            title: "Search Mode",
            desc: "Choose between fuzzy matching and exact matching.",
            options: {
                fuzzy: "Fuzzy",
                exact: "Exact"
            }
        },simpleMode: {
            title: "Simple Mode",
            desc: "Hide complex technical details and show only core information."
        },
        scrollbar: {
            title: "Hide Main Page Scrollbar",
            desc: "Only hide the default scrollbar on the main page."
        },
        globalScrollbar: {
            title: "Hide All Scrollbars",
            desc: "Globally hide scrollbars for all elements, including inside modals."
        },
        themeColor: {
            title: "Theme Color",
            desc: "Select the primary color theme for the application."
        },
        animationStyle: {
            title: "Animation Style",
            desc: "Select the entrance animation style for UI elements.",
            options: {
                slideUp: "Slide Up",
                fade: "Fade In",
                flyIn: "Fly In",
                zoom: "Zoom In"
            }
        },
        timeFormat: {
            title: "Time Format",
            desc: "Switch between 12-hour and 24-hour clock formats."
        },
        performance: {
            title: "Disable Blur",
            desc: "Disable blur effects and transparency to improve UI fluidity."
        },
        animations: {
            title: "Disable Animations",
            desc: "Turn off all page transitions and card loading animations."
        },
        fastAnimations: {
            title: "Fast Transitions",
            desc: "Speed up all transition animations (hover, expand, etc)."
        },
        collapseHeader: {
            title: "Collapse Header",
            desc: "Use a collapsed menu for header actions (Desktop)."
        },
        cardVisibility: {
            title: "Custom Display Items",
            desc: "Hide specific cards or groups from the main dashboard if you don't need them."
        },
        
        restoreNotifications: {
            title: "Restore Notifications",
            desc: "Bring back all previously dismissed notification cards at the top of the dashboard.",
            button: "Restore All",
            empty: "No dismissed notifications"
        },
        quickSummaryVisibility: {
            title: "Quick Summary",
            desc: "Bring back the quick summary widget at the top of the main dashboard containing security indices.",
            restoreBtn: "Restore Display",
            activeState: "Showing"
        },udpBypass: {
            title: "Enable UDP Network (Bypass CORS)",
            desc: "Use UDP mapping API to fetch network tools endpoints entirely bypassing all CORS errors.",
            unsupportedEnv: "Not supported in the current environment",
            checkingUdp: "Checking UDP support...",
            recheckUdp: "Recheck",
            limitationsTitle: "Limitations",
            limitationsList: [
                "Proxy Server Latency: Requests are routed through intermediate proxy nodes, which adds propagation latency.",
                "Hides True IP: Endpoints see the cloud proxy server's IP address rather than your actual home/office outbound IP.",
                "Regional Routing: subject to proxy server geographic availability, causing regional mismatches.",
                "Rate Limiting: Heavy concurrent network scans may trigger API rate limits on proxy nodes."
            ],
            pros: "No setup required, works instantly in compatible virtual environments.",
            cons: "Higher latency, masks outbound client IP, server-dependent, restricted endpoints.",
            prosLabel: "Pros",
            consLabel: "Cons"
        },
        userscriptBypass: {
            title: "Tampermonkey CORS Bypass (Local Connect)",
            desc: "Perform network diagnostics and TLS fingerprinting directly from your actual browser, bypassing CORS limits. Requires installing the Tampermonkey userscript. Safe & fast.",
            recommended: "Recommended",
            statusActive: "Active & Connected",
            statusInactive: "Inactive / Script Not Loaded",
            installGuide: "Script Install Guide",
            copyScript: "Copy Userscript",
            quickInstall: "1-Click Quick Install (Recommended)",
            manualInstallBackup: "Manual Copy & Paste (Backup)",
            copied: "Copied!",
            enableBtn: "Use Userscript Bypass",
            disableBtn: "Disable",
            recheck: "Check Status",
            checking: "Checking status...",
            pros: "Direct routing, minimum latency, detects true local outbound IP, fully private, zero rate limits.",
            cons: "Requires a 1-time setup (extension installation and copy-paste script).",
            comparisonTitle: "Bypass Methods Comparison",
            methodHeader: "Feature",
            udpBypassHeader: "UDP Proxy (Server)",
            userscriptBypassHeader: "Tampermonkey (Local)",
            steps: {
                step1: "Install the **Tampermonkey** browser extension.",
                step2: "Click **'Create a new script'** inside the extension dashboard.",
                step3: "Copy and paste the entire userscript below, then save (Ctrl+S).",
                step4: "Once saved, refresh this page. The system will auto-connect."
            }
        },
        exportSettings: {
            title: "Export & Import Settings",
            desc: "Export your current settings and preferences, or import them to quickly configure the application after migrating platforms.",
            exportBtn: "Export",
            importBtn: "Import",
            importSuccess: "Settings imported successfully! The page will now reload.",
            importError: "Invalid settings file."
        },
        appExportSettings: {
            title: "Export Options",
            desc: "Control the format and quality of dashboard exports.",
            imageScale: "Image Scale",
            pdfFormat: "PDF Format",
            pdfFont: "PDF Export Font",
            scales: {
                scale1: "1x - Original",
                scale2: "2x - Retina",
                scale3: "3x - Ultra HD",
                scale4: "4x - Extreme HD"
            },
            formats: {
                a4: "A4 (210 × 297 mm)",
                letter: "Letter (8.5 × 11 in)",
                legal: "Legal (8.5 × 14 in)"
            },
            fonts: {
                auto: "Auto / Language Default",
                helvetica: "Helvetica (Sans-Serif)",
                times: "Times New Roman (Serif)",
                courier: "Courier (Monospace)"
            }
        }
    },
    network: {
        ip: {
            title: "IP Configuration",
            ipv4: "IPv4",
            ipv4_desc: "Standard Internet Protocol",
            ipv6: "IPv6",
            ipv6_desc: "Next Generation Protocol",
            fetch: "Fetch Info",
            check_v6: "Check IPv6",
            success_v6: "IPv6 Supported",
            fail_v6: "IPv6 Unsupported",
            detail_location: "Location",
            detail_asn: "ASN",
            detail_timezone: "Timezone",
            detail_zip: "Postal Code",
            detail_fraud: "Fraud Score",
            detail_residential: "Residential",
            detail_broadcast: "Broadcast",
            detail_ua: "User Agent",
            yes: "Yes",
            no: "No"
        },
        diagnostics: {
            title: "Advanced Diagnostics",
            webrtc: {
                title: "WebRTC Leak Detect",
                desc: "Attempt to gather real LAN/WAN IPs via STUN servers.",
                btn: "Start Scan",
                columns: { type: "Type", ip: "IP Address", proto: "Proto", port: "Port" }
            },
            dns: {
                title: "DNS Leak Detect",
                desc: "Attempt to identify your current DNS resolver.",
                btn: "Check DNS",
                label_ip: "DNS Server IP",
                label_geo: "DNS Location"
            },
            proto: {
                title: "Protocol Support",
                desc: "Check browser support for HTTP/2 and HTTP/3 (QUIC).",
                btn: "Check Protocols",
                h2: "HTTP/2 Support",
                h3: "HTTP/3 Support"
            }
        },
        connectivity: {
            title: "Connectivity Test",
            placeholder: "Enter URL (e.g., google.com)",
            btn: "Test"
        },
        cdn: {
            title: "CDN Status",
            check_all: "Check All"
        }
    },
    display: {
        deadPixel: {
            title: "Dead Pixel Check",
            desc: "Displays solid colors fullscreen to help find dead or stuck pixels. Click anywhere to exit.",
            click_to_exit: "Click anywhere to exit",
            colors: { red: "Red", green: "Green", blue: "Blue", white: "White", black: "Black" }
        },
        hdr: {
            title: "HDR Status",
            desc: "Detects High Dynamic Range support on current display.",
            rangeScreen: "Screen Dynamic Range",
            rangeVideo: "Video Dynamic Range",
            brightnessTest: "EDR Brightness Test",
            brightnessDesc: "The center box should be brighter than the white background if EDR is active.",
            labelSdr: "SDR White",
            labelEdr: "EDR Highlight"
        },
        gamut: {
            title: "Wide Gamut Test (P3)",
            desc: "If you can see the logo inside the red box, your display supports P3 wide color gamut.",
            unsupported: "Your browser does not support Display-P3 detection."
        },
        gradient: {
            title: "Bit Depth & Banding",
            desc: "Check for smooth color gradients (no banding) and dark details."
        },
        motion: {
            title: "Motion Blur & Stutter Test",
            desc: "Follow the moving block with your eyes. If motion is not smooth, your OS might be dropping frames, or your refresh rate is low."
        }
    },
    storage: {
        local: {
            title: "Local Data",
            clearDesc: "Clear all site data",
            clearBtn: "Clear"
        },
        sw: {
            title: "Service Workers",
            desc: "Manage background Service Worker scripts.",
            unregisterBtn: "Unregister All"
        },
        usageLabel: "Storage Usage",
        fonts: {
            title: "Font Cache Management",
            desc: "To reduce application build size, diagnostic PDF report fonts are fetched from global CDNs. You can pre-download them for offline generation or delete them to free up cache space.",
            name: "Font Name",
            languages: "Target Languages",
            status: "Status",
            cached: "Cached ({size})",
            notCached: "Not Cached",
            downloading: "Downloading...",
            downloadBtn: "Download",
            deleteBtn: "Delete",
            sizeUnknown: "Unknown size",
            downloadSuccess: "Font downloaded successfully!",
            deleteSuccess: "Font deleted successfully!",
            downloadFailed: "Failed to download font.",
            deleteFailed: "Failed to delete font.",
            labels: {
                googlesansflex: "English / Latin",
                notosans: "Multilingual / Cyrillic",
                roboto: "Russian / Cyrillic",
                harmonyossanssc: "Simplified Chinese / Latin",
                misans: "Simplified Chinese / Latin",
                zcoolxiaowei: "Chinese (Simplified & Traditional)",
                sawarabigothic: "Japanese",
                notosanssc: "Simplified Chinese",
                notosanstc: "Traditional Chinese",
                notosansjp: "Japanese"
            }
        },
        locales: {
            title: "Language Pack Management",
            desc: "To reduce initial load times, language translation packs can be dynamically downloaded and cached on-demand. Download packs for offline access or delete them to reclaim storage.",
            name: "Language Pack",
            code: "Code",
            status: "Status",
            cached: "Cached ({size})",
            notCached: "Not Cached",
            downloading: "Downloading...",
            downloadBtn: "Download",
            deleteBtn: "Delete",
            sizeUnknown: "Unknown size",
            downloadSuccess: "Language pack downloaded successfully!",
            deleteSuccess: "Language pack deleted successfully!",
            downloadFailed: "Failed to download language pack.",
            deleteFailed: "Failed to delete language pack.",
            coreLanguage: "Core Language (Built-in)",
            notDownloadedTooltip: "Language pack is not downloaded. Click to download and switch.",
            cannotDeleteActive: "Cannot delete the language pack currently in use to avoid rendering issues."
        }
    },
    resources: {
        title: "Network Requests Monitor",
        subtitle: "Monitor and analyze network requests made by the application (distinguishing Native Fetch, UDP Proxy, and User Scripts).",
        clear: "Clear Logs",
        empty: "No network request logs available yet.",
        searchPlaceholder: "Search URL...",
        all: "All",
        columns: {
            url: "Request URL",
            method: "Method",
            type: "Initiator Type",
            status: "Status",
            duration: "Duration",
            time: "Timestamp"
        },
        types: {
            udp: "UDP Forwarding",
            native: "Native Request",
            script: "User Script",
            unknown: "Other"
        },
        details: {
            title: "Request Details",
            id: "Request ID",
            url: "Request URL",
            method: "Method",
            type: "Request Type",
            status: "Response Status",
            duration: "Duration",
            initiator: "Initiator",
            timestamp: "Timestamp",
            pending: "Pending...",
            openUrl: "Open Target URL"
        }
    },
    developer: {
        config: {
            simulateCrash: "Simulate Dev Crash",
            clearConsoleCache: "Clear Console & PWA Cache",
            clearConsoleCacheDesc: "Force reload and clear Service Worker / Cache Storage",
            defaultConsoleTitle: "Default Console",
            consoleNone: "None (System Default)",
            consoleVConsole: "vConsole",
            consoleEruda: "Eruda",
            recordEvents: "Record Events",
            recordEventsDesc: "Auto-record window & network events",
            vconsole: "vConsole Integration",
            vconsoleDesc: "Enable Tencent vConsole panel",
            eruda: "Eruda Integration",
            erudaDesc: "Enable Eruda panel",
            erudaDefaultTab: "Default Eruda Tab",
            erudaDefaultTabDesc: "Select the tab to focus when Eruda is opened",
            vconsoleDefaultTab: "Default vConsole Tab",
            vconsoleDefaultTabDesc: "Select the tab to focus when vConsole is opened",
            vconsoleTabs: {
                default: "Default",
                system: "System",
                network: "Network",
                element: "Element",
                storage: "Storage"
            },
            erudaTabs: {
                console: "Console",
                elements: "Elements (DOM)",
                network: "Network",
                resources: "Resources",
                sources: "Sources (Code)",
                info: "Info",
                snippets: "Snippets",
                timing: "Timing",
                features: "Features",
                monitor: "Monitor",
                fps: "FPS"
            },
            loadSnippets: "Code Snippets",
            loadSnippetsDesc: "Select which code snippets to automatically inject into Eruda",
            snippetClearLocal: "Clear LocalStorage",
            snippetClearSession: "Clear SessionStorage",
            snippetShowCookies: "Show Cookies",
            snippetToggleBlur: "Toggle Body Blur",
            snippetToggleEditable: "Toggle Editable Page",
        },
        warning: {
            title: "EXTREME CAUTION!",
            desc: "This area is for developers only. If you do not know what you are doing, CLOSE THIS WINDOW IMMEDIATELY!\n\nIf someone told you to copy-paste code here to unlock a 'hidden feature' or 'hack', it is a SCAM. Executing unknown code can allow attackers to steal your identity or take control of your device.",
            agree: "I understand the risks, proceed",
            cancel: "Nevermind, I don't need this",
            disabled_title: "Developer Mode Disabled",
            disabled_desc: "You have chosen not to use this feature. If you really need to debug the app, you can re-enable it at any time.",
            reenable: "Re-enable & Accept Risk"
        },
        nav: {
            events: "Events",
            inspector: "Inspector",
            console: "Console"
        },
        actions: {
            float: "Float Window",
            loadVConsole: "Load vConsole",
            dock: "Dock to Bottom"
        },
        events: {
            placeholder: "Waiting for system events...",
            copy: "Copy Log",
            clear: "Clear"
        },
        console: {
            placeholder: "Enter JS code (Type '\\' for presets)...",
            clearInput: "Clear Input",
            resultPlaceholder: "Results will appear here...",
            copy: "Copy Result",
            download: "Download Result",
            clear: "Clear Result",
            quickCommands: "Quick Commands",
            run: "Run Now",
            presets: {
                userAgent: { label: "User Agent", desc: "View browser UA string" },
                screenInfo: { label: "Screen Info", desc: "Resolution & Pixel Ratio" },
                cookies: { label: "Cookies", desc: "Show all cookies" },
                clearStorage: { label: "Clear LocalStorage", desc: "Wipe local storage" },
                editPage: { label: "Edit Page", desc: "Toggle contentEditable" },
                disableBlur: { label: "Disable Blur", desc: "Toggle global blur" },
                blockClicks: { label: "Block Clicks", desc: "Toggle pointer-events" },
                getKeys: { label: "Get All Keys", desc: "List localStorage keys" },
                reload: { label: "Reload Page", desc: "Force refresh" },
                performance: { label: "Performance", desc: "Current timestamp (ms)" },
                network: { label: "Network Info", desc: "Connection details" },
                memory: { label: "Memory", desc: "Heap size (Chrome)" }
            }
        },
        floating_state: {
            title: "Developer Tools is Floating",
            desc: "The developer tools window has been detached from this modal for a better experience.",
            return: "Return to Modal"
        }
    },
    modules: {
        title: "Module Manager",
        desc: "Monitor and manage loaded modal components. Unloading unused modules can free up memory and GPU resources.",
        headers: {
            name: "Module Name",
            status: "Status",
            impact: "Resource Impact",
            action: "Action"
        },
        status: {
            active: "Active",
            inactive: "Idle",
            cached: "Cached",
            system: "System",
            locked: "Locked"
        },
        impact: {
            low: "Low",
            med: "Medium",
            high: "High"
        },
        actions: {
            unload: "Unload",
            unloadAll: "Unload All Active Modules"
        }
    },
    versions: {
        title: "Software Versions",
        desc: "View current core software version and loaded modules. Pull updates if needed.",
        forcePull: "Check Updates",
        applyUpdate: "Apply Update & Restart",
        upToDate: "App is already up to date.",
        lastChecked: "Last checked: ",
        coreApp: "Core Application",
        installedModules: "Installed Modules",
        libraries: "Core Libraries"
    }
  }
,
  "modules": {
    "impact": {
      "high": "High",
      "med": "Medium",
      "low": "Low"
    },
    "title": "Modules",
    "desc": "Manage dynamically loaded tools.",
    "status": {
      "active": "Active",
      "cached": "Cached",
      "inactive": "Inactive",
      "system": "System",
      "locked": "Locked"
    },
    "actions": {
      "unloadAll": "Unload All",
      "unload": "Unload"
    },
    "headers": {
      "name": "Name",
      "status": "Status",
      "impact": "Impact",
      "action": "Action"
    }
  },
  "versions": {
    "upToDate": "App is already up to date.",
    "title": "Software Versions",
    "desc": "View current core software version and loaded modules. Pull updates if needed.",
    "applyUpdate": "Apply Update",
    "forcePull": "Check Updates",
    "lastChecked": "Last checked:",
    "coreApp": "Core Application",
    "libraries": "Core Libraries",
    "installedModules": "Installed Modules"
  },
  "developer": {
    "config": {
      "recordEvents": "Record Events",
      "recordEventsDesc": "Auto-record window & network events",
      "defaultConsoleTitle": "DEFAULT CONSOLE",
      "consoleVConsole": "vConsole",
      "consoleEruda": "Eruda",
      "vconsoleDefaultTab": "Default vConsole Tab",
      "vconsoleDefaultTabDesc": "Select the tab to focus when vConsole is opened.",
      "vconsoleTabs": {
        "default": "Default",
        "system": "System",
        "network": "Network",
        "element": "Element",
        "storage": "Storage"
      },
      "erudaDefaultTab": "Default Eruda Tab",
      "erudaDefaultTabDesc": "Select the tab to focus when Eruda is opened.",
      "erudaTabs": {
        "console": "Console",
        "elements": "Elements (DOM)",
        "network": "Network",
        "resources": "Resources",
        "sources": "Sources (Code)",
        "info": "Info",
        "snippets": "Snippets",
        "timing": "Timing",
        "features": "Features",
        "monitor": "Monitor",
        "fps": "FPS"
      },
      "loadSnippets": "Code Snippets",
      "snippetClearLocal": "Clear LocalStorage",
      "snippetClearSession": "Clear SessionStorage",
      "snippetShowCookies": "Show Cookies",
      "snippetToggleBlur": "Toggle Body Blur",
      "snippetToggleEditable": "Toggle Editable Page",
       "simulateCrash": "Simulate Dev Crash",
       "clearConsoleCache": "Clear Console & PWA Cache",
       "clearConsoleCacheDesc": "Force reload and clear Service Worker / Cache Storage"
    }
  }

};
