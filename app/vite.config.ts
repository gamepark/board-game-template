import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv, PluginOption } from 'vite'
import { imagetools } from 'vite-imagetools'
import { version } from './package.json'

function translationHmrPlugin(): PluginOption {
  return {
    name: 'translation-hmr',
    configureServer(server) {
      const translationDir = path.resolve(__dirname, 'public/translation')
      let timeout: ReturnType<typeof setTimeout>
      server.watcher.on('change', (file) => {
        if (file.startsWith(translationDir) && file.endsWith('.json')) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            server.ws.send({ type: 'custom', event: 'translation-update' })
          }, 100)
        }
      })
    }
  }
}

function localeUrlPlugin(): PluginOption {
  return {
    name: 'locale-url',
    configureServer(server) {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]
      server.printUrls = () => {
        const address = server.resolvedUrls
        if (address) {
          const url = address.local[0] ?? `http://localhost:3000/`
          console.log(`  ➜  Game: \x1b[36m${url}?locale=${locale}\x1b[0m`)
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      sourcemap: 'hidden'
    },
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
      'process.env.PUSHER_KEY': JSON.stringify(env.VITE_PUSHER_KEY),
      'process.env.VERSION': JSON.stringify(version)
    },
    plugins: [react({ jsxImportSource: '@emotion/react' }), imagetools({ defaultDirectives: () => new URLSearchParams({ format: 'webp' }) }), translationHmrPlugin(), localeUrlPlugin()]
  }
})
