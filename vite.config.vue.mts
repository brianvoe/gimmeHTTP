import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

// Generate external array for shiki modules
const shikiModules = [
  'shiki/core',
  'shiki/engine/javascript',
  'shiki/langs/c.mjs',
  'shiki/langs/csharp.mjs',
  'shiki/langs/dart.mjs',
  'shiki/langs/go.mjs',
  'shiki/langs/java.mjs',
  'shiki/langs/javascript.mjs',
  'shiki/langs/kotlin.mjs',
  'shiki/langs/php.mjs',
  'shiki/langs/python.mjs',
  'shiki/langs/r.mjs',
  'shiki/langs/ruby.mjs',
  'shiki/langs/rust.mjs',
  'shiki/langs/shellscript.mjs',
  'shiki/langs/swift.mjs',
  'shiki/langs/typescript.mjs',
  'shiki/langs/json.mjs',
  'shiki/themes/github-dark.mjs',
  'shiki/themes/github-light.mjs'
]

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
      external: ['vue', 'shiki', ...shikiModules],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'shiki/core': 'shikiCore',
          'shiki/engine/javascript': 'shikiEngineJavascript',
          ...shikiModules.reduce(
            (acc, module) => {
              acc[module] = module
              return acc
            },
            {} as Record<string, string>
          )
        }
      }
    }
  },
  plugins: [
    vue(),
    dts({
      entryRoot: 'src/gimmehttp/vue',
      outDir: 'dist/vue',
      insertTypesEntry: true,
      include: ['src/gimmehttp/vue/**/*.ts'],
      exclude: ['**/*.test.ts']
    })
  ]
})
