import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/gimmehttp/index.ts'),
      name: 'gimmeHTTP',
      formats: ['es', 'cjs', 'umd'], // Specify desired formats
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    outDir: path.resolve(__dirname, 'dist')
  },
  plugins: [
    dts({
      rollupTypes: true,
      outDir: path.resolve(__dirname, 'dist'),
      entryRoot: path.resolve(__dirname, 'src/gimmehttp'),
      tsconfigPath: path.resolve(__dirname, 'src/gimmehttp/tsconfig.json')
    })
  ]
})
