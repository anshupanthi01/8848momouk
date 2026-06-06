import { api, unwrapList } from "@/studio/services/api"

function hasFile(value) {
  if (!value || typeof File === "undefined") return false
  if (value instanceof File) return true
  if (Array.isArray(value)) return value.some(hasFile)
  if (typeof value === "object") return Object.values(value).some(hasFile)
  return false
}

function appendFormData(formData, key, value) {
  if (value === undefined || value === null || value === "") return
  if (value instanceof File) {
    formData.append(key, value)
  } else if (typeof value === "object") {
    formData.append(key, JSON.stringify(value))
  } else {
    formData.append(key, value)
  }
}

function preparePayload(payload) {
  if (!hasFile(payload)) return payload
  const formData = new FormData()
  Object.entries(payload || {}).forEach(([key, value]) => appendFormData(formData, key, value))
  return formData
}

export const studioResources = {
  dashboard: async () => {
    try {
      const response = await api.get("/v1/dashboard/")
      return response.data
    } catch {
      return {
        stats: { menuItems: 0, blogs: 0, reservations: 0, galleryImages: 0, lastUpdated: "Today" },
        activity: [],
      }
    }
  },
  menuDocuments: async () => unwrapList((await api.get("/v1/admin/menu/documents/")).data),
  menu: async (params) => unwrapList((await api.get("/v1/admin/menu/pages/", { params })).data),
  blogs: async (params) => unwrapList((await api.get("/v1/admin/blogs/", { params })).data),
  gallery: async () => unwrapList((await api.get("/v1/admin/gallery/")).data),
  reservations: async (params) => unwrapList((await api.get("/v1/admin/reservations/", { params })).data),
  pages: async () => unwrapList((await api.get("/v1/admin/cms/pages/")).data),
  navigation: async () => unwrapList((await api.get("/v1/admin/navigation/")).data),
  settings: async () => (await api.get("/v1/admin/settings/1/")).data,
  franchiseFaqs: async () => unwrapList((await api.get("/v1/admin/franchise/faq/")).data),
  franchiseInquiries: async () => unwrapList((await api.get("/v1/admin/franchise/inquiries/")).data),
  locations: async () => unwrapList((await api.get("/v1/admin/locations/locations/")).data),
  testimonials: async () => unwrapList((await api.get("/v1/admin/testimonials/")).data),
  create: async (path, payload) => (await api.post(path, preparePayload(payload))).data,
  update: async (path, id, payload) => (await api.patch(`${path}${id}/`, preparePayload(payload))).data,
  remove: async (path, id) => (await api.delete(`${path}${id}/`)).data,
}
