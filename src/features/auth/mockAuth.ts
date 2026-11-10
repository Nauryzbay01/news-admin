/** Временный вход без бэкенда. Отключить: VITE_MOCK_AUTH=false */
export const MOCK_ACCESS_TOKEN = '__mock_dev__'

export const MOCK_USERNAME = 'admin'
export const MOCK_PASSWORD = 'admin'

export function isMockAuthEnabled(): boolean {
  return import.meta.env.VITE_MOCK_AUTH !== 'false'
}

export function isMockAccessToken(token: string | null | undefined): boolean {
  return token === MOCK_ACCESS_TOKEN
}

export function validateMockCredentials(username: string, password: string): boolean {
  return username === MOCK_USERNAME && password === MOCK_PASSWORD
}
