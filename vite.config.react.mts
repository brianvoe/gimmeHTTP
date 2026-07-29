import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'
import react from '@vitejs/plugin-react'

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
      entry: path.resolve(__dirname, 'src/gimmehttp/react/index.ts'),
      name: 'GimmeHttpReact',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.js'}`
    },
    outDir: path.resolve(__dirname, 'dist/react'),
    rollupOptions: {
      // Do not alias gimmehttp/* to source here — that would bundle a second registry.
      external: ['react', 'react-dom', 'react/jsx-runtime', ...sharedGimmehttp],
      output: {
        exports: 'named',
          globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'gimmehttp/ui': 'GimmeHTTP'
        }
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
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      strictOutput: true,
      // Keep `gimmehttp/ui` as a package import in .d.ts (do not rewrite via tsconfig paths).
      pathsToAliases: false,
      aliasesExclude: [/^gimmehttp(\/|$)/]
    })
  ]
})
