import { defineConfig } from 'vite'
import path from 'path'

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
      entry: path.resolve(__dirname, 'src/gimmehttp/index.umd.ts'),
      name: 'GimmeHTTP',
      formats: ['umd', 'iife'],
      fileName: (format) => (format === 'iife' ? 'gimmehttp.iife.js' : 'gimmehttp.js')
    },
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        exports: 'default',
        assetFileNames: (assetInfo) => {
          return assetInfo.name || 'asset'
        },
        banner: '/*! GimmeHTTP - HTTP request code generator */',
        footer: '/*! End GimmeHTTP */'
      }
    }
  }
})
