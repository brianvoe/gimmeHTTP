import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  publicDir: false,
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/gimmehttp/vue/index.ts'),
      name: 'GimmeHttpVue',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.js'}`
    },
    outDir: path.resolve(__dirname, 'dist/vue'),
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
  plugins: [
    vue(),
    dts({
      entryRoot: 'src/gimmehttp/vue',
      outDir: 'dist/vue',
      tsconfigPath: 'tsconfig.vue.json',
      insertTypesEntry: true,
      include: ['src/gimmehttp/vue/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ]
})
