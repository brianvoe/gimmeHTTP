import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'docs/', '**/*.d.ts', '**/*.config.*', '**/release.js', 'src/docs/**']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Source aliases so Vue/React wrappers share one registry with core in tests.
      'gimmehttp/ui': resolve(__dirname, './src/gimmehttp/ui/index.ts'),
      'gimmehttp/core': resolve(__dirname, './src/gimmehttp/core/index.ts')
    }
  }
})
