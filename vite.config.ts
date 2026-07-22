import path from 'path';
import zlib from 'zlib';
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
        plugins: () => [],
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
          threshold: 10240,
        }),
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 10240,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 5,
            },
          },
        }),
        VitePWA({
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.js',
          registerType: 'autoUpdate',
          injectManifest: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
            maximumFileSizeToCacheInBytes: 6000000,
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
        target: 'es2022',
        drop: mode === 'production' ? ['console', 'debugger'] : [],
        legalComments: 'none',
        treeShaking: true,
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
      build: {
        target: 'es2022',
        minify: 'esbuild',
        cssMinify: 'esbuild',
        reportCompressedSize: false,
        chunkSizeWarningLimit: 3000,
        assetsInlineLimit: 4096,
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('scheduler') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('eruda') || id.includes('vconsole')) {
                  return 'vendor-debug';
                }
                if (id.includes('@xenova/transformers') || id.includes('transformers') || id.includes('onnxruntime')) {
                  return 'vendor-transformers';
                }
                if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image') || id.includes('fflate')) {
                  return 'vendor-pdf-canvas';
                }
                if (id.includes('fingerprint') || id.includes('fpjs')) {
                  return 'vendor-fingerprint';
                }
                if (id.includes('lucide-react')) {
                  return 'vendor-lucide';
                }
                if (id.includes('motion')) {
                  return 'vendor-motion';
                }
                return 'vendor-common';
              }
            }
          }
        }
      }
    };
});

