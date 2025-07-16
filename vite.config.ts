// vite.config.ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'node'
    exclude: [...configDefaults.exclude, 'custom-exclude-dir/**'],
  },
})
