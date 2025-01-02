import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1111
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit

    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const chunkName = id.toString().split('node_modules/')[1].split('/')[0].toString()
            if (chunkName) {
              return chunkName
            }
          }
        }
      }
    }
  },
  plugins: [vue()]
})
