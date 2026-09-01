import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {},
  ssr: {
    noExternal: ['@gamepark/rules-api', 'es-toolkit']
  }
})
