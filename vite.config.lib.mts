import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/gimmehttp/index.ts'),
      name: 'GimmeHttp',
      fileName: (format) => `gimmehttp.${format}.js`
    },
    outDir: path.resolve(__dirname, 'dist')
    // rollupOptions: {
    //   external: [], // Specify external dependencies here
    //   output: {
    //     globals: {} // Provide global variables for external dependencies here
    //   }
    // }
  },
  plugins: [
    dts({
      insertTypesEntry: true, // Generates a `package.json` entry for types
      outDir: path.resolve(__dirname, 'dist'),
      entryRoot: path.resolve(__dirname, 'src/gimmehttp')
    })
  ]
})
