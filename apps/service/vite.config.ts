import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  root: './src/ui',
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: {
            content: [
              path.resolve(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'),
              path.resolve(__dirname, './src/ui/**/*.{js,ts,jsx,tsx}'),
            ],
            theme: {
              extend: {
                colors: {
                  accent: '#3A86FF',
                  'mood-epic': '#FF6B6B',
                  'mood-romantic': '#FFC6E7',
                  'mood-funny': '#FFE08A',
                  'mood-scary': '#B28DFF',
                  'mood-sad': '#7EC8E3',
                },
                fontFamily: {
                  sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                  heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
                },
              },
            },
            plugins: [],
          },
        }),
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: '../../dist/public',
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        // Externalize Node.js built-in modules
        return id === 'fs' || id === 'path' || id.startsWith('node:');
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@openfm/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@openfm/core': path.resolve(__dirname, '../../packages/core/src/browser'),
    },
  },
  optimizeDeps: {
    include: ['@openfm/ui'],
  },
  server: {
    port: 6767,
  },
});

