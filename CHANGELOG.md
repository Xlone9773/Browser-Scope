## [Unreleased] - 2026-07-09

<details open>
<summary><strong>📝 English Version</strong></summary>

### 🎉 New Features

#### Export & File Support
- Added PDF export functionality using jspdf with Web Worker support for background document generation
- Added image export functionality using html-to-image to export reports as PNG
- Added multilingual PDF/JSON export support with CJK and Cyrillic character rendering

#### New Detection Tools
- Added JA3/JA4 TLS fingerprinting tool for analyzing TLS handshake characteristics
- Added Noise & Poisoning detection tool to identify artificial noise injection in Canvas and WebGL rendering
- Added audio latency and channel probing modal for detailed device audio analysis

#### UI/UX Enhancements
- Added hardware-accelerated animations to AboutModal with decorative floating elements
- Added third-party attributions modal to acknowledge libraries, packages, and fonts
- Added dynamic icon mapping for device capability modules using Lucide icons
- Added small viewport notification for improved UX on smaller screens
- Added regenerate functionality to fingerprint modal for re-running detection tasks
- Added interactive license viewer and download option in About modal

#### Search & Settings
- Added global search functionality for filtering dashboard categories and card content
- Added search configuration settings (scope and mode preferences)
- Added notification management to restore dismissed notifications
- Added PWA and console cache clearing developer tool (Service Worker unregistration, Cache Storage cleanup)
- Added quick summary widget to display browser environment health status
- Added show navigation tabs toggle setting
- Added locked status to module settings
- Added tab persistence and expanded Google Translate language support in settings
- Added vConsole default tab configuration
- Added Eruda plugin support with tab selection

#### Version & Update Management
- Added versions and updates tab in Settings modal to view application version and module states
- Added automatic background update checks for Service Worker with visibility-based polling
- Added PWA update notifications and browser outdated version warnings

#### Internationalization
- Added Chinese README (README_zh.md) for better accessibility
- Added localized fingerprint modal labels for multilingual support
- Added localized sensor UI labels across all supported languages
- Added localized JA3/JA3N labels and updated fetching logic
- Added localized notification strings for PWA updates
- Added Google Translate integration with custom UI styling and localized labels
- Updated README with project status badges and multi-language navigation

#### Infrastructure & Security
- Added GitHub Actions CI workflow for automated linting, type checking, build, and audit
- Added PWA support with service worker for offline functionality
- Added strict Content Security Policy (CSP) directives for production environments
- Added Helmet security middleware and rate limiting to proxy endpoint
- Added compression middleware for performance optimization

### 🐛 Bug Fixes

#### Rendering & Compatibility
- Fixed disabled attribute type to use undefined instead of null for React compatibility
- Fixed short-circuit logical operators converted to ternary expressions in JSX
- Fixed portal component rendering with correct createPortal implementation
- Fixed Canvas context initialization by removing willReadFrequently option
- Fixed button icon rendering by casting icon and loading states to booleans

#### Error Handling & Stability
- Fixed logger initialization robustness with Eruda plugin registration error handlers
- Fixed ResizeObserver loop limit exceeded errors by normalizing error messages
- Fixed dynamic component loading with retry logic implementation
- Fixed Gamepad API compatibility with error handling for restricted environments
- Fixed native function detection with null checks for navigator.permissions
- Fixed global error handling in ErrorBoundary with window event listeners for unhandled errors

#### Network & Data
- Enhanced IP geolocation extraction for server-side proxy requests
- Improved WebSocket property definitions for debugging tool compatibility
- Normalized ipwho.is response formats for network diagnostics

#### Performance
- Optimized log storage updates using append and shift instead of array spreading
- Added timeout protection (500ms) to async checks to prevent UI blocking
- Implemented retry logic for lazy-loaded components

#### Code Quality & Security
- Replaced eval with new Function for safer dynamic code execution
- Updated ESLint configuration to support latest ECMAScript features
- Removed express-async-errors dependency
- Implemented dynamic CORS whitelist for improved security
- Disabled x-powered-by header for security hardening
- Enabled proxy trust for accurate rate limiting

### ♻️ Refactoring

- Simplified conditional rendering by removing unnecessary Boolean() wrappers
- Removed dynamic module unloading (static imports cannot be effectively unloaded)
- Removed redundant fallback translation values in favor of translation source of truth
- Converted const functions to function declarations for improved hoistability
- Replaced @ts-ignore with @ts-expect-error and removed unused variables
- Removed inline styles from ErrorBoundary, using Tailwind CSS utility classes instead
- Modularized developer tab views into smaller feature-specific modules
- Updated Eruda tab selection to use custom Select component
- Removed unnecessary transition states from settings and header
- Removed dynamic imports in modal manager for faster initialization
- Removed redundant service worker registration from PermissionsCard

### 📚 Documentation

- Added detailed project structure description in README
- Added acknowledgments for core open-source dependencies
- Updated README with repository badges and cleaner navigation
- Refined language and structure for consistency across locales

### 🔧 Chores

- Bumped version to 0.0.8
- Removed unused eslint-report files and ESLint results
- Removed eruda-dom dependency
- Added standard .gitignore file for applet directory
- Updated CPU mappings with latest hardware (Snapdragon, Exynos, Dimensity)
- Monkey-patched Node prototype to prevent Google Translate DOM manipulation errors

</details>

<details>
<summary><strong>📝 中文版本</strong></summary>

### 🎉 新增功能

#### 导出与文件支持
- 新增 PDF 导出功能，使用 jspdf 支持 Web Worker 后台生成文档
- 新增图像导出功能，使用 html-to-image 导出报告为 PNG 格式
- 新增多语言 PDF/JSON 导出支持，完整支持 CJK 和西里尔字符渲染

#### 新增检测工具
- 新增 JA3/JA4 TLS 指纹识别工具，用于分析 TLS 握手特征
- 新增噪声与污染检测工具，识别 Canvas 和 WebGL 中的人工噪声注入
- 新增音频延迟与通道探测模态，提供详细的设备音频特性分析

#### 界面与用户体验增强
- 为 AboutModal 新增硬件加速动画效果（浮动装饰元素）
- 新增第三方归属模态框，展示应用所使用的第三方库、包和字体
- 为设备功能模块新增动态图标映射（使用 Lucide 图标）
- 为小屏幕设备新增视口大小警告通知
- 为指纹模态框新增重新生成功能
- 为 About 模态框新增交互式许可证查看和下载选项

#### 搜索与设置
- 新增全局搜索功能，支持按分类和卡片内容筛选仪表板
- 新增搜索配置设置（搜索范围和搜索模式）
- 新增通知管理功能，支持恢复已关闭的通知
- 新增 PWA 和控制台缓存清除开发者工具（Service Worker 注销、Cache Storage 清理）
- 新增快速概览小部件，显示浏览器环境健康状态
- 新增导航标签显示/隐藏开关
- 为模块设置新增"已锁定"状态
- 新增标签持久化存储，扩展 Google Translate 语言支持
- 新增 vConsole 默认标签配置
- 新增 Eruda 插件支持和标签选择功能

#### 版本与更新管理
- 在设置模态框中新增版本标签，显示应用版本和模块状态
- 新增 Service Worker 自动后台更新检查（基于可见性轮询）
- 新增 PWA 更新通知和浏览器版本过期警告

#### 国际化
- 新增中文 README（README_zh.md）以提高可访问性
- 为指纹模态框新增多语言标签本地化
- 在所有支持的语言中添加传感器界面标签本地化
- 新增 JA3/JA3N 标签本地化和更新的数据获取逻辑
- 为 PWA 更新新增本地化通知字符串
- 集成 Google Translate，支持自定义界面样式和本地化标签
- 更新 README，添加项目状态徽章和多语言导航菜单

#### 基础设施与安全
- 新增 GitHub Actions CI 工作流，支持自动化的代码检查、类型检查、构建和审计
- 新增 PWA 支持及 Service Worker 配置实现离线功能
- 为生产环境新增严格的内容安全策略（CSP）指令
- 为代理端点新增 Helmet 安全中间件和速率限制
- 新增压缩中间件以优化性能

### 🐛 问题修复

#### 渲染与兼容性
- 修复 disabled 属性类型，使用 undefined 而非 null 以确保 React 兼容性
- 修复 JSX 中的短路逻辑，转换为三元表达式
- 修复 Portal 组件渲染，正确实现 createPortal
- 修复 Canvas 上下文初始化，移除 willReadFrequently 选项
- 修复按钮图标渲染，将图标和加载状态转换为布尔值

#### 错误处理与稳定性
- 提升 Logger 初始化的健壮性，为 Eruda 插件注册添加错误处理
- 修复 ResizeObserver 循环限制超出错误，通过标准化错误信息
- 修复动态组件加载，实现重试逻辑
- 修复 Gamepad API 兼容性，添加受限环境的错误处理
- 修复原生函数检测，为 navigator.permissions 添加空值检查
- 为 ErrorBoundary 新增全局错误处理，支持未捕获错误和 Promise 拒绝的窗口事件监听

#### 网络与数据
- 增强服务端代理请求的 IP 地理位置提取
- 改进 WebSocket 属性定义以提高调试工具兼容性
- 标准化 ipwho.is 响应格式用于网络诊断

#### 性能优化
- 优化日志存储更新，使用追加和移位而非数组展开
- 为异步检查添加 500ms 超时保护，防止 UI 阻塞
- 为懒加载组件实现重试逻辑

#### 代码质量与安全
- 用 new Function 替代 eval 以实现更安全的动态代码执行
- 更新 ESLint 配置以支持最新的 ECMAScript 功能
- 移除 express-async-errors 依赖
- 实现动态 CORS 白名单以增强安全性
- 禁用 x-powered-by 响应头
- 启用代理信任以实现准确的速率限制

### ♻️ 代码重构

- 简化条件渲染，移除不必要的 Boolean() 包装
- 移除动态模块卸载（静态导入的模块无法有效卸载）
- 移除冗余的翻译回退值，优先使用翻译源
- 将 const 函数转换为函数声明以改进可提升性
- 用 @ts-expect-error 替代 @ts-ignore 并移除未使用的变量
- 从 ErrorBoundary 移除内联样式，改用 Tailwind CSS 工具类
- 将开发者标签视图模块化为较小的功能特定模块
- 更新 Eruda 标签选择，使用自定义 Select 组件
- 从设置和页头移除不必要的过渡状态
- 从模态管理器移除动态导入，加快初始化速度
- 从 PermissionsCard 移除冗余的 Service Worker 注册

### 📚 文档

- 在 README 中添加详细的项目结构描述
- 添加对核心开源依赖的致谢
- 使用项目状态徽章和更简洁的导航更新 README
- 完善多语言版本的语言和结构一致性

### 🔧 杂项

- 版本号升至 0.0.8
- 移除未使用的 eslint-report 文件和 ESLint 结果
- 移除 eruda-dom 依赖
- 为 applet 目录添加标准 .gitignore 文件
- 使用最新硬件更新 CPU 映射（Snapdragon、Exynos、Dimensity）
- 为 Node 原型添加 monkey-patch，防止 Google Translate 的 DOM 操作错误

</details>
