# Release Notes

## [Unreleased] - 2026-07-09

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