<div align="center">
  <img width="1200" height="475" alt="BrowserScope Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BrowserScope 🌐
### Advanced Browser Fingerprinting & System Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-green)](https://vitejs.dev/)

**BrowserScope** is a comprehensive browser fingerprinting and system intelligence tool that provides deep insights into client-side capabilities, hardware specifications, security features, and AI readiness. It offers real-time analysis of over 100 browser features with an intuitive UI and advanced detection algorithms.

---

## ✨ Key Innovations

### 🔍 **Advanced Fingerprinting Engine**
- **Canvas Fingerprinting**: Generates unique identifiers from canvas rendering variations
- **WebGL Fingerprinting**: Extracts GPU-specific rendering signatures
- **Audio Context Analysis**: Detects audio processing pipeline differences
- **Comprehensive Scoring System**: Calculates uniqueness scores with detailed breakdowns

### 🤖 **AI & Machine Learning Capabilities**
- **AI Compute Readiness**: Benchmarks JavaScript performance for AI/ML workloads
- **WebGPU & WebNN Detection**: Identifies next-generation AI acceleration APIs
- **Local Model Support Assessment**: Evaluates hardware for running local LLMs
- **WebAssembly SIMD Detection**: Checks for optimized mathematical operations

### 🎮 **Hardware & Peripherals Detection**
- **Gamepad API Integration**: Detects connected gaming controllers
- **Battery Status Monitoring**: Real-time power management information
- **Sensor Data Access**: Accelerometer, gyroscope, and ambient light detection
- **Touch Point Counting**: Multi-touch capability assessment

### 🛡️ **Security & Privacy Analysis**
- **Bot Detection**: Identifies automated browsing agents
- **Ad Blocker Detection**: Recognizes privacy protection tools
- **WebRTC IP Leak Protection**: Tests for IP address exposure
- **Global Privacy Control (GPC)**: Detects privacy preference signals

### 📱 **PWA & Modern Web Features**
- **Progressive Web App Assessment**: Evaluates PWA installation and capabilities
- **100+ Modern API Detection**: Web Bluetooth, WebUSB, WebXR, WebAuthn, and more
- **DRM System Support**: Widevine, PlayReady, and FairPlay compatibility
- **Media Codec Analysis**: Video, audio, and image format support matrix

---

## 🚀 Live Demo

Experience BrowserScope in action: [Live Demo](https://browserscope-demo.netlify.app)

---

## 💡 Unique Features

### 🎯 **Real-time Fingerprint Scoring**
Our proprietary algorithm evaluates browser uniqueness across multiple vectors and provides a risk assessment score, helping identify browsers with unusual configurations that might indicate privacy tools or automation.

### ⚡ **Performance Benchmarking**
Advanced JavaScript-based benchmarks to estimate computational power, essential for determining if a device can handle resource-intensive applications like local AI models.

### 🎨 **Dynamic UI & Theming**
- Multiple language support (Chinese, English)
- Dark/light/system adaptive themes
- Responsive design for all device sizes
- Accessibility-focused interface

### 📊 **Export & Analysis Tools**
- Export complete browser profiles as JSON
- Detailed feature breakdowns
- Hardware specification estimation
- Network condition analysis

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2 for lightning-fast development
- **UI Library**: Custom components with Tailwind CSS
- **Fingerprinting**: FingerprintJS integration
- **AI Processing**: @xenova/transformers for local model execution
- **Icons**: Lucide React for consistent iconography

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone https://github.com/browser-scope/browserscope.git
cd browserscope

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Development Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally

---

## 🧪 Features Breakdown

### System Information
- Operating System detection
- Browser identification and version
- Language and locale settings
- User Agent analysis
- Cookie and Do Not Track status

### Hardware Profiling
- CPU core count and estimated model
- Device memory capacity
- GPU vendor and renderer details
- Maximum texture size support
- Touch point capabilities
- Battery status and power metrics

### Display & Graphics
- Screen resolution and available space
- Window dimensions and pixel ratio
- Color depth and gamut support
- HDR capability detection
- Orientation and dark mode preferences

### Network & Connectivity
- Connection type and quality
- Effective bandwidth estimation
- Round-trip time measurements
- Save Data preference
- WebRTC IP address detection

### Media & Codec Support
- Video codec compatibility (H.264, H.265, VP9, AV1)
- Audio format support (AAC, MP3, Opus, FLAC)
- Image format detection (WebP, AVIF)
- DRM system availability
- Speech synthesis voices count

### Security & Privacy
- Bot detection mechanisms
- Global Privacy Control status
- Secure context validation
- Ad blocker identification
- PDF viewer enabled status

### Advanced Web APIs
- WebGPU and WebNN support
- WebAssembly SIMD capabilities
- File System Access API
- Web Bluetooth and WebUSB
- Geolocation and sensors
- Payment Request API

---

## 📈 Use Cases

### 🔍 **Fraud Prevention**
Identify suspicious browser configurations that may indicate automation or privacy tools used for malicious purposes.

### 🎮 **Gaming & Performance**
Evaluate hardware capabilities to optimize game settings and streaming quality dynamically.

### 🏦 **Financial Services**
Enhance security measures by detecting potentially risky browser configurations in sensitive transactions.

### 📱 **PWA Optimization**
Determine optimal Progressive Web App features based on device capabilities and network conditions.

### 🤖 **AI Application Deployment**
Assess whether client devices have sufficient compute power for running local AI models.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Write clean, well-documented TypeScript code
- Follow existing code style and conventions
- Add tests for new functionality when applicable
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Created with ❤️ by the BrowserScope Team

## 🙏 Acknowledgments

- Thanks to the FingerprintJS team for browser fingerprinting insights
- React and TypeScript communities for excellent development tools
- Web standards organizations for advancing browser capabilities

---

<div align="center">

### 🌟 Star this repo if you found it useful!

[![GitHub stars](https://img.shields.io/github/stars/browser-scope/browserscope.svg?style=social&label=Star)](https://github.com/browser-scope/browserscope)

</div>
