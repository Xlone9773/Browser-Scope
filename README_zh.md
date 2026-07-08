<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<div align="center">

# 🌐 BrowserScope - 浏览器高级特性检测与全能工具箱

[![GitHub Stars](https://img.shields.io/github/stars/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=indigo)](https://github.com/Xlone9773/Browser-Scope)
[![GitHub Forks](https://img.shields.io/github/forks/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=blue)](https://github.com/Xlone9773/Browser-Scope)
[![Repository Size](https://img.shields.io/github/repo-size/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=emerald)](https://github.com/Xlone9773/Browser-Scope)
[![License](https://img.shields.io/github/license/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=slate)](https://github.com/Xlone9773/Browser-Scope/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/express-v5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

**简体中文** | [繁體中文(台灣)](README_zhtw.md) | [繁體中文(香港)](README_zhhk.md) | [日本語](README_ja.md) | [Русский](README_ru.md) | [English Version](README.md)

</div>

---

一个重返“打磨细节”初心的浏览器能力检测与实用工具平台。为您提供深度的浏览器运行环境分析、全面的硬件特性评估以及丰富的网络诊断探针。

## ✨ 主要亮点

- 🔍 **全方位深度检测** - 深入剖析系统、硬件、网络、前端存储、安全策略、流媒体等 13+ 核心维度。
- 🧰 **全能测试工具箱** - 集成网络测速、精准 IP 寻址、UDP Ping 连通性测试等高级调试工具。
- 🎨 **极致打磨的 UI 细节** - 支持自选主题色的深浅模式切换，全局动画控制，注重留白与排版的高级卡片设计。
- 🌍 **零死角多语言** - 内置动态支持中文（简/繁两版）、英文、日文、俄文等 6 种主流语言。
- 🗄️ **后端代理与增强** - 内部集成 Express 服务，实现高级接口中转、跨域请求(CORS)无缝绕过及深层 UDP 探查。
- 📜 **软件与资产归属声明** - 独立透明的合规性声明面板，详细列出集成的开源许可协议、职责分配和设计字体声明。

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
- **本地端侧 AI 推理 (Transformers.js)** - 基于 WebAssembly 运行神经网络计算模型，进行本地端侧算力与深度测试。
- **高保真 PDF 诊断报告** - 基于 `html2canvas` 与 `jsPDF` 逐层渲染高对比度的 DOM 树并生成导出可离线共享的系统诊断报告。
- **软件与资产归属声明** - 针对项目中使用的所有开源包（React、FingerprintJS、Motion 等）及高级中英文字体进行详细的归属致谢。
- **悬浮数据窗** - 实现跨窗口的极简 PWA 监控，完美适配桌面与手机应用生态。
- **全局定制化** - 可以强制指定主题色，开关动效减少性能负载以满足低端设备的体验。

---

## 🛠️ 技术栈总览

| 类别 | 框架 / 技术 |
|------|-------------|
| **核心视图与脚本**| React 19 + TypeScript 5.8 严格模式 |
| **全栈引擎** | Express + Node.js (处理接口代理 & 系统联通) |
| **样式与视觉** | Tailwind CSS V4 + Lucide 可缩放矢量图标 |
| **工程构建打包** | Vite 6.2 + ESBuild |
| **安全与指纹** | FingerprintJS + Workbox PWA 全套服务 |

---

## 📝 入门与构建指南

### 本地开发

```bash
# 1. 克隆代码仓库
git clone https://github.com/Xlone9773/Browser-Scope
cd Browser-Scope

# 2. 安装全部依赖项 (涵盖前端与 Express)
npm install

# 3. 启动全功能包含接口的开发服务器
npm run dev
```
服务器正常启动后，在浏览器中打开控制台输出的本地地址即可进行实时预览。

### 生产环境发布

```bash
# 执行生产代码构建及 Node 后端打包编译
npm run build

# 启动构建后的全栈服务
npm run start
```

---

## 📂 代码结构说明

```text
/
├── appearance/          # 主题与外观配置
├── components/          # React 视图与组件库
│   ├── cards/           # 独立能力卡片组合 (系统、CPU、网络等)
│   ├── compute/         # 计算压力测试工具
│   ├── hardware/        # 硬件特征读取及 WebGL 测试诊断
│   ├── heatmap/         # 传感器及网络热力图可视化组件
│   ├── layout/          # 全局排版模块 (头栏、页脚)
│   ├── sections/        # Section区块划分组
│   ├── settings/        # 设置配置页与开发者调试面板入口
│   ├── speedtest/       # 网速深度测试套件
│   └── ui/              # 原子级无状态 UI 搭建组件库
├── hooks/               # 全局共享 Hooks
├── services/            # 系统后台资源逻辑分配端
│   ├── detectors/       # 层级探针逻辑库
│   ├── app.worker.ts    # 挂载计算进程 Web Worker
│   ├── detectionService.ts # 集成后的探针对外分工统一入口
│   └── score.ts         # 本地设备性能打分判定工具链
├── utils/               # 无状态纯函数工具集
│   ├── i18n/            # 完整的应用级国际化多维词典库 (i18n)
│   └── logger/          # VConsole/Eruda 终端拦截挂载服务
├── src/main.tsx         # 整个 React 前端的单页核心总挂载入口
└── server.ts            # 全栈底层 Express 核心端处理网络端口转发映射
```

---

## 🙌 鸣谢与归属

感谢以下优秀的开源项目及设计团队，让本项目变得更好：

- **[React](https://react.dev/)** - 声明式 UI 渲染引擎与组件状态框架
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化语义类样式框架
- **[Express](https://expressjs.com/)** - 轻量全栈 Node 服务中间件与路由分发
- **[Lucide Icons](https://lucide.dev/)** - 高清晰度、无级缩放的 SVG 系统图标库
- **[FingerprintJS](https://fingerprint.com/)** - 安全稳定的高级设备指纹解析器
- **[Transformers.js](https://github.com/xenova/transformers.js)** - 浏览器端直接运行的轻量深度学习推理框架
- **[html2canvas](https://github.com/niklasvh/html2canvas)** & **[jsPDF](https://github.com/parallax/jsPDF)** - 高保真客户端 PDF 诊断报告文档多线程编译
- **[Eruda](https://github.com/liriliri/eruda)** & **[vConsole](https://github.com/Tencent/vConsole)** - 移动端优化的虚拟日志输出、网页检查器控制台
- **[Vite](https://vitejs.dev/)** & **[ESBuild](https://esbuild.github.io/)** - 换能卓越、热模块重载极速的前端构建工具链

---

## 📝 协议声明
本项目以 **MIT** 许可证开源发行。您可以自由使用，探索其打磨极限的前端与中转实现逻辑。

<div align="center">

**🌟 如果 BrowserScope 的细节设计曾让您眼前一亮，请考虑点亮一颗 Star！**

[在 AI Studio 中查看最新版本](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
