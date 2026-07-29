import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Source aliases so Vue/React wrappers share one registry with core in docs.
      'gimmehttp/ui': path.resolve(__dirname, 'src/gimmehttp/ui/index.ts'),
      'gimmehttp/core': path.resolve(__dirname, 'src/gimmehttp/core/index.ts')
    }
  },
  server: {
    port: 1111
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    // Docs register every client + highlight.js grammars into one chunk on purpose.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: () => 'index'
      }
    }
  },
  plugins: [vue(), react()]
})
