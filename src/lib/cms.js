import { useEffect, useState } from "react"

function normalizeApiUrl(value) {
  return `${value || ""}`.trim().replace(/\/$/, "")
}

function getBuildCmsApiUrl() {
  const buildUrl = normalizeApiUrl(import.meta.env.VITE_CMS_API_URL || import.meta.env.VITE_API_URL)
  if (!buildUrl) return ""

  const isLocalBackend = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(buildUrl)
  return import.meta.env.PROD && isLocalBackend ? "" : buildUrl
}

function getCmsApiUrl() {
  const runtimeUrl = normalizeApiUrl(window.__8848_CONFIG__?.CMS_API_URL || window.__8848_CONFIG__?.API_URL)
  if (runtimeUrl) return runtimeUrl

  const buildUrl = getBuildCmsApiUrl()
  if (buildUrl) return buildUrl

  return window.location.origin
}

const CMS_API_URL = getCmsApiUrl()

export const DEFAULT_MENU_PAGES = [
  "/8848-assets/8848 uk qsr menu_page-0001.jpg",
  "/8848-assets/8848 uk qsr menu_page-0002.jpg",
  "/8848-assets/8848 uk qsr menu_page-0003.jpg",
  "/8848-assets/8848 uk qsr menu_page-0004.jpg",
]

export const DEFAULT_NAV_ITEMS = [
  { key: "home", label: "Home", url: "/", order: 10, is_active: true, open_in_new_tab: false },
  { key: "menu", label: "Menu", url: "/menu/", order: 20, is_active: true, open_in_new_tab: false },
  { key: "gallery", label: "Gallery", url: "/gallery/", order: 30, is_active: true, open_in_new_tab: false },
  { key: "events", label: "Events", url: "#", order: 40, is_active: true, open_in_new_tab: false },
  { key: "rewards", label: "Rewards", url: "#", order: 50, is_active: true, open_in_new_tab: false },
  { key: "stuff", label: "Stuff", url: "#", order: 60, is_active: true, open_in_new_tab: false },
  { key: "franchise", label: "Franchise", url: "/franchise/", order: 70, is_active: true, open_in_new_tab: false },
  { key: "careers", label: "Careers", url: "#", order: 80, is_active: true, open_in_new_tab: false },
  { key: "about", label: "About Us", url: "/about-us/", order: 90, is_active: true, open_in_new_tab: false },
]

export const DEFAULT_SITE_SETTINGS = {
  site_name: "8848 Momo House",
  logo_url: "",
  phone: "0000000000",
  phone_display: "0000 000 000",
  email: "info@example.com",
  city: "Your City",
  address: "123 Example Street, Your City",
  opening_hours:
    "Friday 11:30 AM-10 PM\nSaturday 12:30-10 PM\nSunday 12:30-10 PM\nMonday 11:30 AM-10 PM\nTuesday 11:30 AM-10 PM\nWednesday 11:30 AM-10 PM\nThursday 11:30 AM-10 PM",
  facebook_url: "https://www.facebook.com/8848MomoHouseFrankfurt",
  instagram_url: "https://www.instagram.com/8848momohouse/",
  youtube_url: "https://www.youtube.com/@momohouse-js7gp",
  order_url: "https://app.ordering.sumup.com/8848-momo-house/fra/menu",
  privacy_url: "#",
  terms_url: "#",
  footer_text:
    "When you come to 8848 Momo House, expect to feel uplifted and warmly welcomed. Bring your friends, eat and drink and have some laughs. Above all, expect 100% satisfaction.",
}

function navKeyFromItem(item) {
  const text = `${item.key || item.label || item.url || ""}`.toLowerCase()
  if (text.includes("about")) return "about"
  if (text.includes("franchise")) return "franchise"
  if (text.includes("gallery")) return "gallery"
  if (text.includes("reward")) return "rewards"
  return text.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `nav-${item.id || item.order || "item"}`
}

export function getNavigationItems(navigationItems) {
  const source = Array.isArray(navigationItems)
    ? navigationItems
    : Array.isArray(navigationItems?.results)
      ? navigationItems.results
      : []

  const items = source
    .filter((item) => item.is_active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      id: item.id,
      key: navKeyFromItem(item),
      label: item.label,
      url: item.url || item.href || "#",
      order: item.order || 0,
      open_in_new_tab: item.open_in_new_tab || false,
      children: getNavigationItems(item.children || []),
    }))
    .filter((item) => item.label && item.url)

  return items.length ? items : DEFAULT_NAV_ITEMS
}

export function getMenuPageSources(menu) {
  const pages = menu?.pages || []
  const sources = pages
    .filter((page) => page.is_active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((page) => page.image_url || page.external_image_url || page.image)
    .filter(Boolean)

  return sources.length ? sources : DEFAULT_MENU_PAGES
}

export function getGalleryImages(galleryImages, fallback = []) {
  const source = Array.isArray(galleryImages)
    ? galleryImages
    : Array.isArray(galleryImages?.results)
      ? galleryImages.results
      : []

  const images = source
    .filter((image) => image.is_active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((image, index) => ({
      id: image.id || index + 1,
      src: image.image_url || image.external_image_url || image.image,
      alt: image.alt_text || `8848 Momo House gallery image ${index + 1}`,
      caption: image.caption || "",
      depth: image.depth ?? 1,
      isFeatured: image.is_featured || false,
    }))
    .filter((image) => image.src)

  return images.length ? images : fallback
}

export function getFeaturedGalleryImage(galleryImages, fallback) {
  const images = getGalleryImages(galleryImages, [])
  return images.find((image) => image.isFeatured) || images[0] || fallback
}

export function getSiteSettings(settings) {
  return { ...DEFAULT_SITE_SETTINGS, ...(settings || {}) }
}

function normalizeCmsLanguage(language) {
  return "en"
}

export function getPageSectionContent(page, sectionKey, fallback = {}, language = "en") {
  const section = (page?.sections || []).find(
    (item) => item.section_key === sectionKey && item.is_active !== false,
  )
  normalizeCmsLanguage(language)
  return {
    ...fallback,
    ...(section?.content || {}),
    ...(section?.content_en || {}),
  }
}

function getNestedValue(source, path) {
  return `${path || ""}`
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => (value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined), source)
}

export function getSectionTranslator(page, sectionKey, fallbackTranslator, language = "en") {
  const sectionContent = getPageSectionContent(page, sectionKey, {}, language)

  return (key, options) => {
    const fallback = fallbackTranslator(key, options)
    const sectionPath = `${key || ""}`.startsWith(`${sectionKey}.`)
      ? `${key}`.slice(sectionKey.length + 1)
      : key
    const cmsValue = getNestedValue(sectionContent, sectionPath)
    return cmsValue === undefined || cmsValue === null || cmsValue === "" ? fallback : cmsValue
  }
}

export async function postFranchiseInquiry(payload) {
  if (!CMS_API_URL) throw new Error("CMS API URL is not configured")
  const response = await fetch(`${CMS_API_URL}/api/v1/franchise/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error("Franchise inquiry request failed")
  return response.json()
}

async function fetchJson(path) {
  if (!CMS_API_URL) return null
  const response = await fetch(`${CMS_API_URL}${path}`)
  if (!response.ok) throw new Error(`CMS request failed: ${path}`)
  return response.json()
}

function useCmsResource(path) {
  const [resource, setResource] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchJson(path)
      .then((data) => {
        if (!cancelled) setResource(data)
      })
      .catch(() => {
        if (!cancelled) setResource(null)
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return resource
}

export function useGalleryImages() {
  return useCmsResource("/api/v1/gallery/")
}

export function usePage(slug) {
  return useCmsResource(`/api/v1/cms/pages/${slug}/`)
}

export function useHomePage() {
  return usePage("home")
}

export function useFranchisePage() {
  return usePage("franchise")
}

export function useAboutPage() {
  return usePage("about")
}

export function useFranchiseFaqs() {
  return useCmsResource("/api/v1/franchise/faq/")
}

export function useNavigationItems() {
  return getNavigationItems(useCmsResource("/api/v1/navigation/"))
}

export function useSiteSettings() {
  return getSiteSettings(useCmsResource("/api/v1/settings/"))
}

export function useCurrentMenu() {
  return useCmsResource("/api/v1/menu/current/")
}
