import axios from "axios"
import { useAuthStore } from "@/studio/store/authStore"

function normalizeApiUrl(value) {
  return `${value || ""}`.trim().replace(/\/$/, "")
}

function getBuildApiUrl() {
  const buildUrl = normalizeApiUrl(import.meta.env.VITE_API_URL || import.meta.env.VITE_CMS_API_URL)
  if (!buildUrl) return ""

  const isLocalBackend = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(buildUrl)
  return import.meta.env.PROD && isLocalBackend ? "" : buildUrl
}

function getRawApiUrl() {
  const runtimeUrl = normalizeApiUrl(window.__8848_CONFIG__?.API_URL || window.__8848_CONFIG__?.CMS_API_URL)
  if (runtimeUrl) return runtimeUrl

  const buildUrl = getBuildApiUrl()
  if (buildUrl) return buildUrl

  return window.location.origin
}

const rawApiUrl = getRawApiUrl()
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (config.data instanceof FormData) delete config.headers["Content-Type"]
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refreshToken = useAuthStore.getState().refreshToken

    if (error.response?.status === 401 && refreshToken && !original?._retry) {
      original._retry = true
      refreshPromise ||= axios
        .post(`${API_URL}/v1/auth/token/refresh/`, { refresh: refreshToken })
        .then((response) => {
          useAuthStore.getState().setTokens({ access: response.data.access, refresh: refreshToken })
          return response.data.access
        })
        .finally(() => {
          refreshPromise = null
        })

      const access = await refreshPromise
      original.headers.Authorization = `Bearer ${access}`
      return api(original)
    }

    if (error.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(error)
  },
)

export function unwrapList(data, fallback = []) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return fallback
}
