import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import StudioChrome from "@/studio/components/StudioChrome"
import DashboardPage from "@/studio/pages/DashboardPage"
import LoginPage from "@/studio/pages/LoginPage"
import {
  BlogsPage,
  GalleryManagerPage,
  MenuManagerPage,
  NavigationPage,
  PagesEditorPage,
  ReservationsPage,
  SettingsPage,
} from "@/studio/pages/ResourcePages"
import { useAuthStore } from "@/studio/store/authStore"

function ProtectedStudio() {
  const token = useAuthStore((state) => state.accessToken)
  const location = useLocation()
  if (!token) return <Navigate to="/studio/login" replace state={{ from: location.pathname }} />
  return <StudioChrome />
}

export default function StudioRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedStudio />}>
        <Route index element={<DashboardPage />} />
        <Route path="menu" element={<MenuManagerPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="gallery" element={<GalleryManagerPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="pages" element={<PagesEditorPage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/studio" replace />} />
    </Routes>
  )
}
