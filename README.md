<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

[Read in English](#-english-version) | [中文说明](#-中文说明)

---

<a id="-english-version"></a>

# 🌐 BrowserScope - Browser Capability Detector & Omni Toolbox

A highly polished, detail-oriented browser utility platform and robust testing toolbox. It provides deep environment detection, network diagnostics, and device capability evaluation.

## ✨ Core Highlights

- 🔍 **Deep Capability Detection** - Covers 13+ dimensions including system, hardware, network, storage, security, media devices, and detailed Web APIs.
- 🧰 **Omni Toolbox** - Features practical networking tools such as Speed Test, precise IP lookups, and UDP Ping tests.
- 🎨 **Extreme Polish & Craftsmanship** - Multiple dynamic themes, fine-grained color palettes, motion/animation controls, and meticulous UI layouts.
- 🌍 **Comprehensive Localization** - Native support for 6 languages (English, Simplified/Traditional Chinese, Japanese, Russian), with fully dynamic switching.
- 🗄️ **Full-Stack Proxy Engine** - Powered by a custom Express backend handling CORS bypass, safe request proxying, and restricted UDP network probing.

---

## 🚀 Deployment & Environment

> [!WARNING]
> **Full-Stack Architecture:** This project has evolved into a full-stack application leveraging Node.js + Express. It provides critical CORS circumvention, API proxying, and specific system probing. You **must** deploy this as a full-stack Node.js environment (e.g., Cloud Run, Docker, VPS), not as a static site.

> [!CAUTION]
> **Restricted Network Environments:** In many Serverless platforms (like Vercel, AWS Lambda, or edge runtimes), underlying UDP sockets and long-lived connections may be completely blocked.
> The application includes environment state-detection. If UDP proxying is unsupported in your deployment platform, the related toggles in the settings and diagnostics will automatically turn gray and show an "Unsupported" hint. To unlock deep network probing features, please deploy on a VPS or full container environments like Docker/Cloud Run.

## 📦 Features Breakdown

### Environment Detectors

| Module | Description |
|--------|-------------|
| 🖥️ **System** | OS specifics, precise Browser versions, User-Agent analysis. |
| 💻 **Hardware** | Logical processors, memory limits, GPU vendor/renderer details. |
| 🌐 **Network & Speed** | Advanced network connection probing, bandwidth tests, IP details. |
| 🔒 **Security / CSP** | HTTPS state, Content Security Policy, permission API statuses. |
| 📺 **Display & Screen** | Resolution, color depth, pixel density mapping. |
| 🆔 **Device Fingerprinting**| Unique hardware and software fingerprint generation tracking. |
| 💾 **Storage Limits** | Quotas for IndexedDB, LocalStorage, and Cache APIs. |
| 📍 **Geolocation** | Precision GPS polling, timezone overrides, localization properties. |
| 📹 **Media Devices** | Granular enumeration of camera/microphone hardware. |
| 🎬 **Media Codecs** | Hardware decoding support, HDR, video/audio formats. |

### Practical Tools & Configuration
- **Advanced Network Diagnostics** - UDP Ping and DNS tests to bypass strict CORS environments.
- **Speed Test Engine** - Real-time websocket or fetch-based bandwidth testing.
- **Data Exporter** - Extract entire detection states to localized JSON files.
- **Floating Monitor Tool** - Minimalist, draggable floating stat overlay. 
- **PWA Ready** - Fully installable as an offline-first desktop/mobile application.

---

<br/>

<a id="-中文说明"></a>

# 🌐 BrowserScope - 浏览器高级特性检测与全能工具箱

一个重返“打磨细节”初心的浏览器能力检测与实用工具平台。为您提供深度的浏览器运行环境分析、全面的硬件特性评估以及丰富的网络诊断探针。

## ✨ 主要亮点

- 🔍 **全方位深度检测** - 深入剖析系统、硬件、网络、前端存储、安全策略、流媒体等 13+ 核心维度。
- 🧰 **全能测试工具箱** - 集成网络测速、精准 IP 寻址、UDP Ping 连通性测试等高级调试工具。
- 🎨 **极致打磨的 UI 细节** - 支持自选主题色的深浅模式切换，全局动画控制，注重留白与排版的高级卡片设计。
- 🌍 **零死角多语言** - 内置动态支持中文（简/繁两版）、英文、日文、俄文等 6 种主流语言。
- 🗄️ **后端代理与增强** - 内部集成 Express 服务，实现高级接口中转、跨域请求(CORS)无缝绕过及深层 UDP 探查。

---

## 🚀 部署参考与注意事项

> [!WARNING]
> **全栈环境要求：** 该项目架构现已升级为完整的 Node.js + Express 全栈应用。包含了必不可少的跨域(CORS)请求绕过、安全接口代理等核心业务代码。部署时请确保使用 Node.js 全栈环境承载，**切勿仅部署静态网页**。

> [!CAUTION]
> **关于网络功能受限 (UDP 探针)：** 在众多轻量级 Serverless 平台（例如 Vercel、AWS Lambda 函数或某些托管服务）上，底层的 UDP Socket 和原生请求端口经常会被完全阻断。
> 我们已经给应用添加了**环境感知降级功能**——如果底层不支持 UDP 操作，设置中的代理高权限开关及相关组件将自动变灰，并给与“不支持”提示。若想解锁所有极限网络监控与代理能力，强烈建议使用 **Docker 容器、VPS 或 Cloud Run 等能放开完整协议链的环境**进行部署。

## 📦 功能模块概览

### 核心环境检测

| 模块 | 功能描述 |
|------|----------|
| 🖥️ **基础系统** | 呈现底层操作系统、浏览器核心版本、UserAgent 解析。 |
| 💻 **硬件特征** | 抓取系统支持的 CPU 逻辑核心数、内存限额、GPU 详细信息。 |
| 🌐 **网络与连通性**| 解析有效连接属性、带宽基准，及外网 IP 的精准定位。 |
| 🔒 **浏览器安全** | HTTPS状态、同源与安全沙箱(CSP)情况、以及详细首部验证。 |
| 📺 **图形与显示** | 屏幕极限分辨率、显示器色彩深度及高 PPI 像素比检测。 |
| 🆔 **防追踪指纹** | 使用底层综合维度哈希生成您当前机器的“唯一设备指纹”。|
| 💾 **存储与配额** | LocalStorage、IndexedDB 以及其他持久化缓存能力的精准配额报告。|
| 📍 **定位与地理** | 提取高精度 GPS 数据以及用户时区、时差、语言等本地化环境设定。 |
| 📹 **外接媒体硬件**| 列举可用的本地扬声器、麦克风和摄像头权限及设备名称。|
| 🎬 **视音频解码** | 检测本地硬件或软件底层对各类现代影音格式（含 HDR 等）的解压能力。|

### 实用的开发者工具
- **高级网络诊断** - 突破同源策略进行测速，并引入 UDP DNS 解析来验证被降级网络的存活性。
- **自定义数据导出** - 一键将当前的数百项检测数据转存为规范的 JSON 格式图表。
- **全局定制化** - 可以强制指定主题色，开关动效减少性能负载以满足低端设备的体验。
- **悬浮数据窗** - 实现跨窗口的极简 PWA 监控，完美适配桌面与手机应用生态。

---

## 🛠️ 技术栈总览

| 类别 | 框架 / 技术 |
|------|-------------|
| **核心视图与脚本**| React 19 + TypeScript 5.8 严格模式 |
| **全栈引擎** | Express + Node.js (处理接口代理 & 系统联通) |
| **样式与视觉** | Tailwind CSS V4 + Lucide 可缩放矢量图标 |
| **工程构建打包** | Vite 6.2 + ESBuild |
| **安全与指纹** | FingerprintJS 驱动 |

---

## 📝 入门与构建指南

### 本地开发

```bash
# 1. 下载本地仓库
git clone <your-repo-url>
cd browserscope

# 2. 安装全部依赖项 (涵盖前端与 Express)
npm install

# 3. 启动全功能包含接口的开发服务器
npm run dev
```
服务器正常启动后，请在浏览器中打开内置的地址即可进行实时预览。

### 开发测试

```bash
# 执行生产代码瘦身压缩及 Node 后端转义
npm run build

# 测试构建之后的同构节点
npm run start
```

---

## 📂 代码结构说明 (Code Structure)

```text
/
├── appearance/          # Theme configuration 
├── components/          # React views and component library
│   ├── cards/           # Individual capability cards (OS, CPU, Network, etc.)
│   ├── compute/         # Computation stress testing tools
│   ├── hardware/        # Hardware diagnostics and WebGL testing features
│   ├── heatmap/         # Map and visualization tools
│   ├── layout/          # Core layout components (Header, Sidebar)
│   ├── sections/        # Sectional views
│   ├── settings/        # User settings and developer tool modals
│   ├── speedtest/       # Network speed diagnostic tools
│   └── ui/              # Reusable base UI elements
├── hooks/               # Global React hooks
├── services/            # Core logical services and background workers
│   ├── detectors/       # Modular detection logic scripts
│   ├── app.worker.ts    # Web Worker for async computation tasks
│   ├── detectionService.ts # Unified detection service export
│   └── score.ts         # Device scoring heuristics
├── utils/               # Utility functions
│   ├── i18n/            # Localization dictionaries (i18n)
│   └── logger/          # Dev console interceptors (vConsole/Eruda)
├── src/main.tsx         # React entry point
└── server.ts            # Express backend entry for proxying
```

---

## 🙌 鸣谢 (Acknowledgments)

感谢以下开源项目，让本项目变得更好：
Thanks to the following open-source projects for making this project better:

- **[React](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Express](https://expressjs.com/)**
- **[Lucide Icons](https://lucide.dev/)**
- **[FingerprintJS](https://fingerprint.com/)**
- **[Eruda](https://github.com/liriliri/eruda)** & **[vConsole](https://github.com/Tencent/vConsole)**
- **[Vite](https://vitejs.dev/)** & **[ESBuild](https://esbuild.github.io/)**

---

## 📝 协议声明
本项目以 **MIT** 许可证开源发行。您可以自由使用，探索其打磨极限的前端与中转实现逻辑。

<div align="center">

**🌟 如果本项目的细节设计曾让您眼前一亮，请考虑点亮一颗 Star！**

[在 AI Studio 中查看最新版本](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
