/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базовый URL API (по умолчанию — относительный путь, прокси Vite на бэкенд) */
  readonly VITE_API_BASE_URL?: string
  readonly VITE_PROXY_TARGET?: string
  /** false — реальный POST /api/auth/login; по умолчанию мок admin/admin */
  readonly VITE_MOCK_AUTH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
