import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/studio/lib/queryKeys"
import { studioResources } from "@/studio/services/resources"

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: studioResources.dashboard })
}

export function useMenuItems(params) {
  return useQuery({ queryKey: queryKeys.menu(params), queryFn: () => studioResources.menu(params) })
}

export function useMenuDocuments() {
  return useQuery({ queryKey: queryKeys.menuDocuments, queryFn: studioResources.menuDocuments })
}

export function useBlogs(params) {
  return useQuery({ queryKey: queryKeys.blogs(params), queryFn: () => studioResources.blogs(params) })
}

export function useGallery() {
  return useQuery({ queryKey: queryKeys.gallery, queryFn: studioResources.gallery })
}

export function useReservations(params) {
  return useQuery({ queryKey: queryKeys.reservations(params), queryFn: () => studioResources.reservations(params) })
}

export function usePages() {
  return useQuery({ queryKey: queryKeys.pages, queryFn: studioResources.pages })
}

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: studioResources.settings })
}

export function useNavigationItems() {
  return useQuery({ queryKey: queryKeys.navigation, queryFn: studioResources.navigation })
}

export function useFranchiseFaqs() {
  return useQuery({ queryKey: queryKeys.franchiseFaqs, queryFn: studioResources.franchiseFaqs })
}

export function useFranchiseInquiries() {
  return useQuery({ queryKey: queryKeys.franchiseInquiries, queryFn: studioResources.franchiseInquiries })
}

export function useLocations() {
  return useQuery({ queryKey: queryKeys.locations, queryFn: studioResources.locations })
}

export function useTestimonials() {
  return useQuery({ queryKey: queryKeys.testimonials, queryFn: studioResources.testimonials })
}

export function useStudioMutation({ path, invalidate, action = "save" }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload, method = id ? "update" : "create" }) =>
      method === "delete" ? studioResources.remove(path, id) : id ? studioResources.update(path, id, payload) : studioResources.create(path, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidate })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success(`CMS ${action} completed`)
    },
    onError: (error) => {
      const data = error?.response?.data
      const detail = typeof data === "string"
        ? data
        : data?.detail
          ? data.detail
          : data
            ? Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join(" | ")
            : ""
      toast.error(detail ? `CMS ${action} failed: ${detail}` : `CMS ${action} failed`)
    },
  })
}
