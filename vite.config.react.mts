import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'
import react from '@vitejs/plugin-react'

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
      entry: path.resolve(__dirname, 'src/gimmehttp/react/index.ts'),
      name: 'GimmeHttpReact',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.js'}`
    },
    outDir: path.resolve(__dirname, 'dist/react'),
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        assetFileNames: 'gimmehttp.css'
      }
    }
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.react.json'),
      entryRoot: path.resolve(__dirname, 'src/gimmehttp/react'),
      outDirs: path.resolve(__dirname, 'dist/react'),
      insertTypesEntry: true,
      include: ['src/gimmehttp/react/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/env.d.ts'],
      strictOutput: true,
      // Keep framework types self-contained under dist/react
      pathsToAliases: false
    })
  ]
})
