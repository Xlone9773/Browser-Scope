# Release Notes

## [2.3.0] - 2026-09-19

### 🌐 Site & SEO
- Added `robots.txt` allowing all crawlers, with a site description header block and a `Sitemap:` directive
- Added build-time generated `sitemap.xml` (`scripts/generate-sitemap.mjs`, wired into `npm run build` so `lastmod` always matches the deploy date)
- Added canonical link, `meta description`, and Open Graph / Twitter card tags for crawler summaries and link previews
- Renamed the page title from "Device Intelligence" to "Advanced Toolbox"

### 🛠️ CI & Tooling
- Added `gh-pages.yml`: backup mirror deployment, manual `workflow_dispatch` only (quality gates stay in main CI), artifact named `github-pages-<short-sha>` with a Pages-URL job summary
- Pinned all runners to `ubuntu-24.04` ahead of `ubuntu-latest` migrating to Ubuntu 26.04 (actions/runner-images#14748)
- Migrated `.husky/pre-commit` to the husky v9 style (deprecated `husky.sh` sourcing removed, v10-ready)
- Removed the `vercel` CLI from `devDependencies` — it dragged 18 audit findings into the tree and belongs in the global install; `npm audit` is back to 0 vulnerabilities
- Pinned `@testing-library/jest-dom` to `6.9.1` (6.10.0 is a registry-flagged incorrect release)
- Replaced `__dirname` with `import.meta.dirname` in `vite.config.ts` / `vitest.config.ts` (forward-compat with Vite's native config loader)

### 🐛 Bug Fixes
- Fixed an orphaned close-animation timer in `Select`: the 200ms `setTimeout` is now stored in a ref and cleared on unmount, so it can never fire after teardown
- Fixed the same orphan-timer pattern in `BackendDropdown`
- Silenced a spurious `act(...)` warning in `BackToTop` tests: same-value functional guards on all three state setters, plus flushing pending MutationObserver microtasks inside `act` in the tests
- Silenced jsdom "Not implemented" notices at the source: rewired `window.jsdom.virtualConsole` in `test/setup.ts` to drop them and forward real errors to the test-realm console (the old `console.error` filter could never see them — jsdom binds the worker-realm console)

### 🧪 Testing
- Grew the suite from 249 to 303 test cases; all 17 components under `components/ui` are now covered
- Added tests for `Toast` (10: context API, 5-toast cap with oldest eviction, auto-dismiss timing, hover pause/resume), `Tabs` (11: keyboard navigation with wrap and disabled-skipping, variant rendering, autoScroll), `BackendDropdown` (8: portal lifecycle, deferred outside-click guard, unmount-timer regression), `FloatingWindow` (8: pointer drag/resize math, 300px clamp, opposite-edge anchoring), and expanded `ErrorBoundary` from 2 to 21 (analysis classification, global listener noise whitelist, recovery actions, copy/clear-cache flows)
- Raised `testTimeout` from 5s to 10s: with the real canvas prebuilt installed, graphics fingerprint tests do actual rendering and can exceed 5s under full-suite parallelism on a phone SoC
- Test output is now completely clean: zero act warnings, zero stderr leaks, zero jsdom notices

### 🚀 Highlights & Version Update
- Bumped application version to `2.3.0`

---

### 🌐 站点与 SEO
- 新增 `robots.txt`：允许全部爬虫抓取，头部注释块含站点简介，并声明 `Sitemap:` 指令
- 新增构建期生成的 `sitemap.xml`（`scripts/generate-sitemap.mjs` 挂入 `npm run build`，`lastmod` 永远等于部署日期）
- 新增 canonical 链接、`meta description`、Open Graph / Twitter 卡片标签，供爬虫摘要与链接预览使用
- 页面标题由 "Device Intelligence" 改为 "Advanced Toolbox"

### 🛠️ CI 与工具链
- 新增 `gh-pages.yml`：备份镜像部署，仅 `workflow_dispatch` 手动触发（质量门禁归主 CI），制品名 `github-pages-<短哈希>` 并输出含 Pages URL 的任务摘要
- 全部 runner 钉为 `ubuntu-24.04`，抢先于 `ubuntu-latest` 切换 Ubuntu 26.04（actions/runner-images#14748）
- `.husky/pre-commit` 迁移到 husky v9 写法（移除已废弃的 `husky.sh` source，兼容 v10）
- 从 `devDependencies` 移除 `vercel` CLI——它向依赖树拖入 18 个安全告警且应走全局安装；`npm audit` 恢复 0 漏洞
- `@testing-library/jest-dom` 钉到 `6.9.1`（6.10.0 是注册表标记的问题版本）
- `vite.config.ts` / `vitest.config.ts` 中 `__dirname` 替换为 `import.meta.dirname`（为 Vite 原生配置加载器做前向兼容）

### 🐛 缺陷修复
- 修复 `Select` 的孤儿关闭动画定时器：200ms `setTimeout` 现存入 ref 并在卸载时清除，绝不会在拆解后再触发
- 修复 `BackendDropdown` 中同款孤儿定时器
- 消除 `BackToTop` 测试的伪 `act(...)` 警告：三个 setter 全部改用同值守卫，测试末尾在 `act` 内 flush 待处理的 MutationObserver 微任务
- 从源头消除 jsdom "Not implemented" 提示：在 `test/setup.ts` 改接 `window.jsdom.virtualConsole`，丢弃该类消息并把真实错误转回测试域 console（旧的 `console.error` 过滤器根本看不见它——jsdom 绑定的是 worker 域 console）

### 🧪 测试
- 用例从 249 增长到 303，`components/ui` 全部 17 个组件实现覆盖
- 新增 `Toast`（10 例：context API、5 条上限与最旧淘汰、auto-dismiss 计时、悬停暂停/恢复）、`Tabs`（11 例：键盘导航绕行与跳过禁用、变体渲染、autoScroll）、`BackendDropdown`（8 例：portal 生命周期、延迟外部点击保护、卸载定时器回归）、`FloatingWindow`（8 例：指针拖拽/缩放数学、300px 钳制、对边锚定），`ErrorBoundary` 由 2 例扩到 21 例（分析分类、全局监听噪音白名单、恢复动作、复制/清缓存流程）
- `testTimeout` 由 5s 提至 10s：接入真实 canvas 预编译包后，图形指纹用例改为真实渲染，在手机 SoC 全量并行下偶发超过 5s
- 测试输出完全干净：零 act 警告、零 stderr 泄漏、零 jsdom 提示

## [2.2.0] - 2026-08-30

### 🚀 Highlights & Version Update
- Bumped application version to `2.2.0`
- Updated core runtime and development dependencies across React, Vite, Tailwind CSS, and testing libraries
- Fixed Window fetch getter-only property reassignment in network logger interceptor
- Added LICENSE file to public assets distribution

## [2.1.0] - 2026-07-09

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
- Added localized fingerprint modal labels for multilingua support
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

---

## Previous Releases

- [1.0.0](https://github.com/Xlone9773/Browser-Scope/releases/tag/1.0.0) - 2026-05-22