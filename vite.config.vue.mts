import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

/** Shared engine/UI must stay external so Register() from gimmehttp/core applies. */
const sharedGimmehttp = [/^gimmehttp(\/|$)/]

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
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
      // Do not alias gimmehttp/* to source here — that would bundle a second registry.
      external: ['vue', ...sharedGimmehttp],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'gimmehttp/ui': 'GimmeHTTP'
        }
      }
    }
  },
  plugins: [
    vue(),
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.vue.json'),
      processor: 'vue',
      cleanVueFileName: true,
      entryRoot: path.resolve(__dirname, 'src/gimmehttp/vue'),
      outDirs: path.resolve(__dirname, 'dist/vue'),
      insertTypesEntry: true,
      include: ['src/gimmehttp/vue/**/*'],
      exclude: ['**/*.test.ts'],
      strictOutput: true,
      // Keep `gimmehttp/ui` as a package import in .d.ts (do not rewrite via tsconfig paths).
      pathsToAliases: false,
      aliasesExclude: [/^gimmehttp(\/|$)/]
    })
  ]
})
