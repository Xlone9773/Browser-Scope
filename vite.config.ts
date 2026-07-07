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
            globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
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
        minify: 'terser',
        cssMinify: 'lightningcss',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: mode === 'production',
            passes: 1, // Reduced to avoid build timeout
            toplevel: true,
            hoist_funs: true,
            reduce_funcs: true,
            booleans_as_integers: true,
          },
          mangle: {
            toplevel: true,
          },
          format: {
            comments: false, // Ensure all comments are stripped
          }
        },
        sourcemap: mode !== 'production',
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'ai-vendor': ['@xenova/transformers'],
              'device-vendor': ['@fingerprintjs/fingerprintjs', 'fingerprintjs2', 'fpjs-v5'],
              'ui-vendor': ['lucide-react']
            }
          }
        }
      }
    };
});
