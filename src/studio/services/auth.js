import { api } from "@/studio/services/api"

export async function loginStudio({ email, password }) {
  const response = await api.post("/v1/auth/token/", { username: email, email, password })
  if (!response.data?.access || !response.data?.refresh) {
    throw new Error("Login response did not include authentication tokens")
  }
  return response.data
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/v1/auth/me/")
    return response.data
  } catch {
    return null
  }
}
