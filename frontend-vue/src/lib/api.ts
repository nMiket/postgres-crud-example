interface APIConfig {
  baseUrl: string
}

const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Missing VITE_API_URL. Create frontend-vue/.env before running the app.')
}

const config: APIConfig = {
  baseUrl: apiUrl,
}

export function buildApiUrl(path: string) {
  const normalizedBaseUrl = config.baseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}

export const api = {
  config,
  buildApiUrl,
}

export default api
