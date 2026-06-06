import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import StudioRoutes from "@/studio/routes/StudioRoutes"

// Lazy-load page components (each becomes a separate chunk)
const Home = lazy(() => import("@/pages/home/Home"))
const About = lazy(() => import("@/pages/about/About"))
const Menu = lazy(() => import("@/pages/menu/menu"))
const Gallery = lazy(() => import("@/pages/gallery/gallery"))
const FranchisePage = lazy(() => import("@/pages/franchise/franchiseall"))

// Optional: add a loading spinner/placeholder
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#de1d3d] border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/studio/*" element={<StudioRoutes />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about-us" element={<Layout><About /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/franchise" element={<Layout><FranchisePage /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
