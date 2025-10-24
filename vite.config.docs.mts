import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 1111
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks: (id) => {
          if (id.includes('shiki')) {
            return 'shiki'
          }
        },
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop()
          if (ext === 'css') {
            return `css/[name]-[hash].${ext}`
          }
          if (['woff', 'woff2', 'eot', 'ttf', 'otf'].includes(ext)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    }
  },
  plugins: [vue()]
})
