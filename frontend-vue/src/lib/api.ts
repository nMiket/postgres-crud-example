// API client for future backend integration (.NET or FastAPI)
// This will be updated when backend is ready

interface APIConfig {
  baseUrl: string
}

const config: APIConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
}

export const api = {
  config,
  // Placeholder for future API methods
}

export default api
