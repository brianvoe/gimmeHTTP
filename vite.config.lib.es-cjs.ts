import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    minify: true,
    sourcemap: true,
    emptyOutDir: false, // package.json rimraf ./dist/*
    lib: {
      entry: {
        gimmehttp: path.resolve(__dirname, 'src/gimmehttp/index.ts'),
        'core/index': path.resolve(__dirname, 'src/gimmehttp/core/index.ts'),
        'clients/index': path.resolve(__dirname, 'src/gimmehttp/clients/index.ts'),
        'ui/index': path.resolve(__dirname, 'src/gimmehttp/ui/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'es' : 'cjs'}.js`
    },
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          return assetInfo.name || 'asset'
        }
      }
    }
  },
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
      outDirs: path.resolve(__dirname, 'dist'),
      entryRoot: path.resolve(__dirname, 'src/gimmehttp'),
      include: ['src/gimmehttp/**/*.ts'],
      exclude: ['src/gimmehttp/vue/**', 'src/gimmehttp/react/**', 'src/gimmehttp/**/*.test.ts', 'src/gimmehttp/index.umd.ts']
    })
  ]
})
