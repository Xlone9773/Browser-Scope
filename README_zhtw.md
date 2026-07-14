<div align="center">

# 🌐 BrowserScope - 瀏覽器高級特性檢測與全能工具箱

[![GitHub Stars](https://img.shields.io/github/stars/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=indigo)](https://github.com/Xlone9773/Browser-Scope)
[![GitHub Forks](https://img.shields.io/github/forks/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=blue)](https://github.com/Xlone9773/Browser-Scope)
[![Repository Size](https://img.shields.io/github/repo-size/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=emerald)](https://github.com/Xlone9773/Browser-Scope)
[![License](https://img.shields.io/github/license/Xlone9773/Browser-Scope?style=flat-square&logo=github&color=slate)](https://github.com/Xlone9773/Browser-Scope/blob/main/LICENSE)
[![React Version](https://img.shields.io/badge/react-v19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/express-v5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

[简体中文](README_zh.md) | **繁體中文(台灣)** | [繁體中文(香港)](README_zhhk.md) | [日本語](README_ja.md) | [Русский](README_ru.md) | [English Version](README.md)

</div>

---

一個重返「打磨細節」初心的瀏覽器能力檢測與實用工具平台。為您提供深度的瀏覽器運行環境分析、全面的硬體特性評估以及豐富的網路診斷探針。

## ✨ 主要亮點

- 🔍 **全方位深度檢測** - 深入剖析系統、硬體、網路、前端存儲、安全策略、流媒體等 13+ 核心維度。
- 🧰 **全能測試工具箱** - 集成網路測速、精準 IP 尋址、UDP Ping 連通性測試等高級調試工具。
- 🎨 **極致打磨的 UI 細節** - 支持自選主題色的深淺模式切換，全局動畫控制，注重留白與排版的高級卡片設計。
- 🌍 **零死角多語言** - 內置動態支持中文（簡/繁兩版）、英文、日文、俄文等 6 種主流語言。
- 🗄️ **後端代理與增強** - 內部集成 Express 服務，實現高級接口中轉、跨域請求(CORS)無縫繞過及深層 UDP 探查。
- 📜 **軟件與資產歸屬聲明** - 獨立透明的合規性聲明面板，詳細列出集成的開源許可協議、職責分配和設計字體聲明。

---

## 🚀 部署參考與注意事項

> [!WARNING]
> **全棧環境要求：** 該項目架構現已升級為完整的 Node.js + Express 全棧應用。包含了必不可少的跨域(CORS)請求繞過、安全接口代理等核心業務代碼。部署時請確保使用 Node.js 全棧環境承載，**切勿僅部署靜態網頁**。

> [!CAUTION]
> **關於網絡功能受限 (UDP 探針)：** 在眾多輕量級 Serverless 平台（例如 Vercel、AWS Lambda 函數或某些託管服務）上，底層的 UDP Socket 和原生請求端口經常會被完全阻斷。
> 我們已經給應用添加了**環境感知降級功能**——如果底層不支持 UDP 操作，設置中的代理高權限開關及相關組件將自動變灰，並給與「不支持」提示。若想解鎖所有極限網絡監控與代理能力，強烈建議使用 **Docker 容器、VPS 或 Cloud Run 等能放開完整協議鏈的環境**進行部署。

## 📦 功能模塊概覽

### 核心環境檢測

| 模塊 | 功能描述 |
|------|----------|
| 🖥️ **基礎系統** | 呈現底層操作系統、瀏覽器核心版本、UserAgent 解析。 |
| 💻 **硬體特徵** | 抓取系統支持的 CPU 邏輯核心數、記憶體限額、GPU 詳細資訊。 |
| 🌐 **網路與連通性**| 解析有效連接屬性、頻寬基準，及外網 IP 的精準定位。 |
| 🔒 **瀏覽器安全** | HTTPS狀態、同源與安全沙箱(CSP)情況、以及詳細首部驗證。 |
| 📺 **圖形與顯示** | 螢幕極限解析度、顯示器色彩深度及高 PPI 像素比檢測。 |
| 🆔 **防追蹤指紋** | 使用底層綜合維度哈希生成您當前機器的「唯一設備指紋」。|
| 💾 **存儲與配額** | LocalStorage、IndexedDB 以及其他持久化緩存能力的精準配額報告。|
| 📍 **定位與地理** | 提取高精度 GPS 數據以及用戶時區、時差、語言等本地化環境設定。 |
| 📹 **外接媒體硬體**| 列舉可用的本地揚聲器、麥克風和攝像頭權限及設備名稱。|
| 🎬 **視影音解碼** | 檢測本地硬體或軟體底層對各類現代影音格式（含 HDR 等）的解壓能力。|

### 實用的開發者工具
- **高級網路診斷** - 突破同源策略進行測速，並引入 UDP DNS 解析來驗證被降級網路的存活性。
- **自定義數據導出** - 一鍵將當前的數百項檢測數據轉存為規範的 JSON 格式圖表。
- **本地端側 AI 推理 (Transformers.js)** - 基於 WebAssembly 運行神經網路計算模型，進行本地端側算力與深度測試。
- **高保真 PDF 診斷報告** - 基於 `html2canvas` 與 `jsPDF` 逐層渲染高對比度的 DOM 樹並生成導出可離線共享的系統診斷報告。
- **軟件與資產歸屬聲明** - 針對項目中使用的所有開源包（React、FingerprintJS、Motion 等）及高級中英文字體進行詳細的歸屬致謝。
- **懸浮數據窗** - 實現跨窗口的極簡 PWA 監控，完美適配桌面與手機應用生態。
- **全局定制化** - 可以強制指定主題色，開關動效減少性能負載以滿足低端設備的體驗。

---

## 🛠️ 技術棧總覽

| 類別 | 框架 / 技術 |
|------|-------------|
| **核心視圖與腳本**| React 19 + TypeScript 5.8 嚴格模式 |
| **全棧引擎** | Express + Node.js (處理接口代理 & 系統聯通) |
| **樣式與視覺** | Tailwind CSS V4 + Lucide 可縮放矢量圖標 |
| **工程構建打包** | Vite 6.2 + ESBuild |
| **安全與指紋** | FingerprintJS + Workbox PWA 全套服務 |

---

## 📝 入門與構建指南

### 本地開發

```bash
# 1. 克隆代碼倉庫
git clone https://github.com/Xlone9773/Browser-Scope
cd Browser-Scope

# 2. 安裝全部依賴項 (涵蓋前端與 Express)
npm install

# 3. 啟動全功能包含接口的開發伺服器
npm run dev
```
伺服器正常啟動後，在瀏覽器中打開控制台輸出的本地地址即可進行實時預覽。

### 生產環境發布

```bash
# 執行生產代碼構建及 Node 後端打包編譯
npm run build

# 啟動構建後的全棧服務
npm run start
```

---

## 📂 代碼結構說明

```text
/
├── appearance/          # 主題與外觀配置
├── components/          # React 視圖與組件庫
│   ├── cards/           # 獨立能力卡片組合 (系統、CPU、網絡等)
│   ├── compute/         # 計算壓力測試工具
│   ├── hardware/        # 硬體特徵讀取及 WebGL 測試診斷
│   ├── heatmap/         # 傳感器及網路熱力圖視覺化組件
│   ├── layout/          # 全局排版模塊 (頭欄、頁腳)
│   ├── sections/        # Section區塊劃分組
│   ├── settings/        # 設置配置頁與開發者調試面板入口
│   ├── speedtest/       # 網速深度測試套件
│   └── ui/              # 原子級無狀態 UI 搭建組件庫
├── hooks/               # 全局共享 Hooks
├── services/            # 系統後台資源邏輯分配端
│   ├── detectors/       # 層級探針邏輯庫
│   ├── app.worker.ts    # 掛載計算進程 Web Worker
│   ├── detectionService.ts # 集成後的探針對外分工統一入口
│   └── score.ts         # 本地設備性能打分判定工具鏈
├── utils/               # 無狀態純函數工具集
│   ├── i18n/            # 完整的應用級國際化多維詞典庫 (i18n)
│   └── logger/          # VConsole/Eruda 終端攔截掛載服務
├── src/main.tsx         # 整個 React 前端的單頁核心總掛載入口
└── server.ts            # 全棧底層 Express 核心端處理網絡端口轉發映射
```

---

## 🙌 鳴謝與歸屬

感謝以下優秀的開源項目及設計團隊，讓本項目變得更好：

- **[React](https://react.dev/)** - 聲明式 UI 渲染引擎與組件狀態框架
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化語義類樣式框架
- **[Express](https://expressjs.com/)** - 輕量全棧 Node 服務中間件與路由分發
- **[Lucide Icons](https://lucide.dev/)** - 高清晰度、無級縮放的 SVG 系統圖標庫
- **[FingerprintJS](https://fingerprint.com/)** - 安全穩定的高級設備指紋解析器
- **[Transformers.js](https://github.com/xenova/transformers.js)** - 瀏覽器端直接運行的輕量深度學習推理框架
- **[html2canvas](https://github.com/niklasvh/html2canvas)** & **[jsPDF](https://github.com/parallax/jsPDF)** - 高保真客戶端 PDF 診斷報告文檔多線程編譯
- **[Eruda](https://github.com/liriliri/eruda)** & **[vConsole](https://github.com/Tencent/vConsole)** - 移動端優化的虛擬日誌輸出、網頁檢查器控制台
- **[Vite](https://vitejs.dev/)** & **[ESBuild](https://esbuild.github.io/)** - 效能卓越、熱模組重載極速的前端構建工具鏈

---

## 📝 協議聲明
本項目以 **MIT** 許可證開源發行。您可以自由使用，探索其打磨極限的前端與中轉實現邏輯。

<div align="center">

**🌟 如果 BrowserScope 的細節設計曾讓您眼前一亮，請考慮點亮一顆 Star！**

[在 AI Studio 中查看最新版本](https://ai.studio/apps/6b6b64a8-d32c-490e-a9ab-35a241066ab2)

</div>
