import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    target: 'es2020',
    lib: {
      entry: path.resolve(__dirname, 'src/gimmehttp/vue/index.ts'),
      name: 'GimmeHttpVue',
      formats: ['es', 'umd'],
      fileName: (format) => `vue/index.${format === 'es' ? 'js' : 'umd.js'}`
    },
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      external: ['vue', 'shiki', 'shiki/core', 'shiki/engine/oniguruma'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'shiki/core': 'shikiCore',
          'shiki/engine/oniguruma': 'shikiOniguruma'
        }
      }
    }
  },
  plugins: [vue()]
})
