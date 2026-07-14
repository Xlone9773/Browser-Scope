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
        assetsInlineLimit: 100000000, // 100MB limit to ensure all assets are inlined
        sourcemap: mode !== 'production',
        cssCodeSplit: false, // Bundle all CSS into a single style sheet
        rollupOptions: {
          output: {
            codeSplitting: false, // Disables code splitting to generate a single-bundle output in Vite 8.1 (Rolldown)
          }
        }
      }
    };
});
