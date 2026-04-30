interface APIConfig {
  baseUrl: string
}

const config: APIConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
