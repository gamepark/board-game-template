import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@gamepark/game-template': path.resolve(__dirname, '../rules/src')
      },
      dedupe: ['react', 'react-dom', 'react-redux', '@dnd-kit/core', '@emotion/react', 'react-i18next']
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PLATFORM_URI': JSON.stringify(env.VITE_PLATFORM_URI),
      'process.env.PUSHER_KEY': JSON.stringify(env.VITE_PUSHER_KEY)
    },
    plugins: [react({ jsxImportSource: '@emotion/react' }), imagetools({ defaultDirectives: () => new URLSearchParams({ format: 'webp' }) })]
  }
})
