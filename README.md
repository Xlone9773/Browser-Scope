<div align="center">

# 🌐 BrowserScope - Browser Capability Detector & Omni Toolbox

[![GitHub Stars](https://img.shields.io/github/stars/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=indigo)](https://github.com/Xlone9773/Browser-Scope)
[![GitHub Forks](https://img.shields.io/github/forks/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=blue)](https://github.com/Xlone9773/Browser-Scope)
[![Repository Size](https://img.shields.io/github/repo-size/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=emerald)](https://github.com/Xlone9773/Browser-Scope)
[![License](https://img.shields.io/github/license/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=slate)](https://github.com/Xlone9773/Browser-Scope/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/express-v5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

[简体中文](README_zh.md) | [繁體中文(台灣)](README_zhtw.md) | [繁體中文(香港)](README_zhhk.md) | [日本語](README_ja.md) | [Русский](README_ru.md) | **English Version**

</div>

---

A highly polished, detail-oriented browser utility platform and robust testing toolbox. It provides deep environment detection, network diagnostics, and device capability evaluation.

## ✨ Core Highlights

- 🔍 **Deep Capability Detection** - Covers 13+ dimensions including system, hardware, network, storage, security, media devices, and detailed Web APIs.
- 🧰 **Omni Toolbox** - Features practical networking tools such as Speed Test, precise IP lookups, and UDP Ping tests.
- 🎨 **Extreme Polish & Craftsmanship** - Multiple dynamic themes, fine-grained color palettes, motion/animation controls, and meticulous UI layouts.
- 🌍 **Comprehensive Localization** - Native support for 6 languages (English, Simplified/Traditional Chinese, Japanese, Russian), with fully dynamic switching.
- 🗄️ **Full-Stack Proxy Engine** - Powered by a custom Express backend handling CORS bypass, safe request proxying, and restricted UDP network probing.
- 📜 **Software & Asset Attributions** - Dedicated transparent compliance panel detailing open-source licenses, role allocations, and custom typography attributions.

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
- **Local AI Inference (Transformers.js)** - Executing on-device neural model benchmarks locally using WebAssembly on client CPU/GPU.
- **High-Fidelity PDF Diagnostic Reports** - Staggered rendering of active DOM structures to export complete diagnostic reports via `html2canvas` and `jsPDF`.
- **Software & Asset Attributions** - Comprehensive compliance logs for all integrated dependencies (React, FingerprintJS, Motion, Workbox, etc.) and premium typefaces.
- **Data Exporter** - Extract entire detection states to localized JSON files.
- **Floating Monitor Tool** - Minimalist, draggable floating stat overlay. 
- **PWA Ready** - Fully installable as an offline-first desktop/mobile application.

---

## 🛠️ Tech Stack

| Category | Framework / Tech |
|------|-------------|
| **Core View**| React 19 + TypeScript 5.8 |
| **Backend Service** | Express + Node.js (Proxy & Network diagnostics) |
| **Styling & Icons** | Tailwind CSS V4 + Lucide React |
| **Build & Tooling** | Vite 6.2 + ESBuild |
| **Security & Metrics** | FingerprintJS + Workbox PWA Suite |

---

## 📝 Getting Started

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Xlone9773/Browser-Scope
cd Browser-Scope

# 2. Install all dependencies (Frontend and Backend Express package)
npm install

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build & Production Release

```bash
# Build the production optimized bundle and server
npm run build

# Start the compiled full-stack environment
npm run start
```

---

## 📂 Project Structure

```text
/
├── appearance/          # Themes and appearance configurations
├── components/          # React components hierarchy
│   ├── cards/           # Diagnostic capability cards (System, CPU, Network, etc.)
│   ├── compute/         # Computation stress-testing widgets
│   ├── hardware/        # Hardware WebGL diagnostics and profiling
│   ├── heatmap/         # Motion heatmaps and sensory canvas overlays
│   ├── layout/          # Core page layout components (Header, Footer)
│   ├── sections/        # Section grouping boxes
│   ├── settings/        # Config menu and developer debugging interface
│   ├── speedtest/       # Custom bandwidth benchmark suite
│   └── ui/              # Atomized stateless UI components library
├── hooks/               # Custom React state and event hooks
├── services/            # Background analytical engines
│   ├── detectors/       # Module detectors/probing scripts
│   ├── app.worker.ts    # Computation heavy background Web Worker
│   ├── detectionService.ts # Main aggregated testing service dispatcher
│   └── score.ts         # Hardware score calculations engine
├── utils/               # Common helper utilities
│   ├── i18n/            # Application i18n translations dictionaries
│   └── logger/          # Console overrides and terminal overlays
├── src/main.tsx         # React root mounting entrypoint
└── server.ts            # Node Express full-stack proxy routing handler
```

---

## 🙌 Attributions & Acknowledgments

We thank the amazing open-source community and the following libraries for powering BrowserScope:

- **[React](https://react.dev/)** - Declarative UI development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling framework
- **[Express](https://expressjs.com/)** - Lightweight full-stack server routing
- **[Lucide Icons](https://lucide.dev/)** - Scalable interface vector symbols
- **[FingerprintJS](https://fingerprint.com/)** - Unique client-side fingerprinting
- **[Transformers.js](https://github.com/xenova/transformers.js)** - In-browser local machine learning inference
- **[html2canvas](https://github.com/niklasvh/html2canvas)** & **[jsPDF](https://github.com/parallax/jsPDF)** - Document reports compiler
- **[Eruda](https://github.com/liriliri/eruda)** & **[vConsole](https://github.com/Tencent/vConsole)** - Mobile web console and inspector tools
- **[Vite](https://vitejs.dev/)** & **[ESBuild](https://esbuild.github.io/)** - Fast compilation, hot reloading, and bundle system

---

## 📝 License
This project is licensed under the **MIT License**. Check out [LICENSE](LICENSE) for details.

<div align="center">

**🌟 If BrowserScope has been useful to you, please consider giving it a Star!**

[View latest deployment on AI Studio](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
