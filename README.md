<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌐 BrowserScope - 浏览器 & AI 就绪性检测平台

一个功能强大的浏览器环境检测与 AI 计算能力评估工具，帮助您全面了解设备的浏览器特性、硬件配置及 AI 就绪状态。

---

## ✨ 主要亮点

- 🔍 **全方位检测** - 覆盖系统、硬件、网络、存储、媒体设备等 13+ 维度
- 🤖 **AI 就绪评估** - 基于 Transformers.js 的本地 AI 推理能力检测
- 🎭 **隐私指纹** - 使用 FingerprintJS 生成设备唯一标识
- 🌍 **多语言支持** - 支持中文（简/繁）、英文、日文、俄文等多种语言
- 🎨 **主题切换** - 支持亮色/暗色主题，适配不同使用场景
- 📱 **响应式设计** - 完美适配桌面端与移动端
- 🚀 **零后端依赖** - 纯前端实现，数据完全本地处理

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19.2 + TypeScript 5.8 |
| **构建工具** | Vite 6.2 |
| **UI 组件** | Lucide React 图标库 |
| **AI 引擎** | Transformers.js 2.17 |
| **指纹识别** | FingerprintJS 4.5 + FingerprintJS2 |
| **调试工具** | vConsole（移动端调试） |
| **国际化** | 自定义 i18n 方案 |

---

## 📦 功能模块

### 核心检测卡片

| 模块 | 功能描述 |
|------|----------|
| 🖥️ **系统信息** | 操作系统、浏览器版本、UserAgent |
| 💻 **硬件配置** | CPU 核心数、内存大小、GPU 信息 |
| 🧠 **AI 计算** | WebGPU/WebGL 支持、本地模型推理测试 |
| 🔒 **安全特性** | HTTPS、CSP、各种安全头检测 |
| 📺 **显示信息** | 屏幕分辨率、色彩深度、像素比 |
| 🆔 **设备指纹** | 基于多维度生成的唯一设备标识 |
| 🌐 **网络状态** | IP 地址、连接类型、在线状态 |
| 💾 **存储能力** | LocalStorage、IndexedDB、配额信息 |
| 📍 **地理位置** | GPS 定位、时区、语言环境 |
| 🔐 **权限管理** | 摄像头、麦克风、通知等权限状态 |
| 📹 **媒体设备** | 可用的音视频输入输出设备 |
| 🎬 **媒体能力** | 编解码器支持、HDR 能力 |

### 特色功能

- 📊 **综合评分** - 基于检测结果生成 AI 就绪度评分
- 📥 **数据导出** - 支持将检测结果导出为 JSON 格式
- 🔄 **实时刷新** - 一键重新检测所有指标
- 🪟 **悬浮窗口** - 可拖拽的悬浮面板设计
- 📲 **PWA 支持** - 可安装为独立应用使用

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 本地开发

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd browserscope

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选）
# 复制 .env.local.example 到 .env.local 并设置你的 API Key
cp .env.local.example .env.local

# 4. 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 即可预览应用。

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码检查

```bash
# 运行 TypeScript 类型检查
npm run lint
```

---

## ⚙️ 环境配置

如需使用 Gemini AI 相关功能，请在项目根目录创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_api_key_here
```

> 💡 提示：大部分检测功能无需 API Key 即可正常使用。

---

## 🌐 支持的语言

- 🇨🇳 简体中文 (zh-CN)
- 🇭🇰 繁体中文 - 香港 (zh-HK)
- 🇹🇼 繁体中文 - 台湾 (zh-TW)
- 🇺🇸 English (en)
- 🇯🇵 日本語 (ja)
- 🇷🇺 Русский (ru)

可通过界面右上角的语言切换器更改显示语言。

---

## 📁 项目结构

```
browserscope/
├── App.tsx                 # 主应用入口
├── index.tsx               # React 渲染入口
├── components/             # UI 组件
│   ├── cards/              # 各检测模块卡片
│   ├── layout/             # 布局组件
│   ├── sections/           # 功能区块
│   ├── settings/           # 设置面板
│   └── ui/                 # 通用 UI 组件
├── services/               # 业务逻辑层
│   ├── detectors/          # 各项检测器实现
│   ├── detectionService.ts # 检测服务聚合
│   └── exporter.ts         # 数据导出服务
├── hooks/                  # 自定义 Hooks
├── utils/                  # 工具函数
│   ├── i18n/               # 国际化资源
│   ├── formatters.ts       # 格式化函数
│   └── cpuMapping.ts       # CPU 映射表
├── appearance/             # 主题样式
└── types/                  # TypeScript 类型定义
```

---

## 🎯 使用场景

- 🔬 **开发者调试** - 快速查看浏览器环境信息
- 📱 **兼容性测试** - 评估设备对新技术的支持程度
- 🤖 **AI 应用部署** - 判断设备是否适合运行本地 AI 模型
- 🔐 **安全审计** - 检查浏览器安全配置
- 📊 **用户分析** - 了解用户设备特征（需合规使用）

---

## 📝 许可证

本项目采用 MIT 许可证。

---

## 🙏 致谢

- [Google AI Studio](https://ai.studio/) - AI 技术支持
- [FingerprintJS](https://fingerprintjs.com/) - 设备指纹识别
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 本地 AI 推理
- [Lucide Icons](https://lucide.dev/) - 精美图标库

---

<div align="center">

**🌟 如果这个项目对你有帮助，请给个 Star！**

[在 AI Studio 中查看](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
