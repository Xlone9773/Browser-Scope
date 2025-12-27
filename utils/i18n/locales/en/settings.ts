
export const settings = {
  settings: {
    title: "Settings",
    nav: {
        general: "General",
        network: "Network Tools",
        display: "Display Tests",
        storage: "Storage",
        resources: "Resources",
        developer: "Developer",
        modules: "Module Manager"
    },
    general: {
        simpleMode: {
            title: "Simple Mode",
            desc: "Hide complex technical details and show only core information."
        },
        scrollbar: {
            title: "Hide Scrollbar",
            desc: "Force hide the system's default scrollbar styles."
        },
        timeFormat: {
            title: "Time Format",
            desc: "Switch between 12-hour and 24-hour clock formats."
        },
        performance: {
            title: "High Performance",
            desc: "Disable blur effects and transparency to reduce GPU load."
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
            fail_v6: "IPv6 Unsupported"
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
        usageLabel: "Storage Usage"
    },
    resources: {
        title: "External Resources",
        columns: { name: "Name", type: "Type", duration: "Duration" }
    },
    developer: {
        warning: {
            title: "EXTREME CAUTION!",
            desc: "This area is for developers only. If you do not know what you are doing, CLOSE THIS WINDOW IMMEDIATELY!\n\nIf someone told you to copy-paste code here to unlock a 'hidden feature' or 'hack', it is a SCAM. Executing unknown code can allow attackers to steal your identity or take control of your device.",
            agree: "I understand the risks, proceed"
        },
        nav: {
            events: "Events",
            inspector: "Inspector",
            console: "Console"
        },
        actions: {
            float: "Float Window",
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
            run: "Run Now"
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
            system: "System"
        },
        impact: {
            low: "Low",
            med: "Medium",
            high: "High"
        },
        actions: {
            unload: "Force Close",
            unloadAll: "Unload All Active Modules"
        }
    }
  }
};
