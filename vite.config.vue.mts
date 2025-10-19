import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'
import { copyFileSync, mkdirSync } from 'fs'
import { globSync } from 'glob'

export default defineConfig({
  publicDir: false,
  build: {
    target: 'es2020',
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
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.svg')) {
            return 'logos/[name][extname]'
          }
          return '[name][extname]'
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
      include: ['src/gimmehttp/vue/**/*.ts', 'src/gimmehttp/vue/**/*.vue']
    }),
    {
      name: 'copy-logos',
      closeBundle() {
        const logosDir = path.resolve(__dirname, 'dist/vue/logos')
        mkdirSync(logosDir, { recursive: true })

        const logos = globSync('src/gimmehttp/logos/*.svg')
        logos.forEach((logo) => {
          const filename = path.basename(logo)
          copyFileSync(logo, path.join(logosDir, filename))
        })
      }
    }
  ]
})
