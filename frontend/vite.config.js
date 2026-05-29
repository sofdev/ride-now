import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':   ['react', 'react-dom', 'react-router-dom'],
          'motion':         ['framer-motion'],
          'maps':           ['@react-google-maps/api', 'use-places-autocomplete'],
          'ui':             ['lucide-react', 'react-hot-toast', 'react-helmet-async'],
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
});
