import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      worker: {
        format: 'es',
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        tailwindcss(), 
        react(),
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
        }),
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
        }),
        VitePWA({
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.js',
          registerType: 'autoUpdate',
          injectManifest: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
            maximumFileSizeToCacheInBytes: 6000000, // 6MB limit to accommodate full-bundle single JS file caching
          },
          devOptions: {
            enabled: false,
            type: 'module'
          },
          manifest: {
            name: 'BrowserScope',
            short_name: 'Scope',
            description: 'Advanced Browser Fingerprinting and Diagnostics Tool',
            theme_color: '#0f172a',
            background_color: '#0f172a',
            display: 'standalone',
            icons: [
              {
                src: '/vite.svg',
                sizes: 'any',
                type: 'image/svg+xml'
              }
            ]
          }
        })
      ],
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
        legalComments: 'none',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        transformer: 'lightningcss',
      },
      build: {
        target: 'esnext',
        minify: 'esbuild',
        cssMinify: 'lightningcss',
        assetsInlineLimit: 4096, // Only inline assets smaller than 4KB to prevent bloated JS bundles
        sourcemap: mode !== 'production',
        cssCodeSplit: true, // Enable CSS code splitting for modular loading
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                // 1. React 核心框架包
                if (id.includes('react') || id.includes('scheduler') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                // 2. Eruda 调试工具及插件 (极其臃肿，拆成独立分包)
                if (id.includes('eruda')) {
                  return 'vendor-eruda';
                }
                // 3. VConsole 调试工具
                if (id.includes('vconsole')) {
                  return 'vendor-vconsole';
                }
                // 4. Transformers / ONNX Machine Learning runtime (机器学习模型/运行时，体积极大)
                if (id.includes('@xenova/transformers') || id.includes('transformers') || id.includes('onnxruntime')) {
                  return 'vendor-transformers';
                }
                // 5. PDF 和 Image 图像处理与导出工具 (jspdf, html2canvas 等)
                if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image') || id.includes('fflate')) {
                  return 'vendor-pdf-canvas';
                }
                // 6. FingerprintJS 浏览器指纹库
                if (id.includes('fingerprint') || id.includes('fpjs')) {
                  return 'vendor-fingerprint';
                }
                // 7. Lucide React 图标库
                if (id.includes('lucide-react')) {
                  return 'vendor-lucide';
                }
                // 8. Motion 动画库
                if (id.includes('motion')) {
                  return 'vendor-motion';
                }
                // 9. 其他通用第三方模块合集
                return 'vendor-common';
              }
            }
          }
        }
      }
    };
});
