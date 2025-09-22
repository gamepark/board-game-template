/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM_URI?: string
  readonly VITE_PUSHER_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}