import Navbar from "@/components/layout/navbar/Navbar"
import Footer from "@/components/layout/footer/Footer"

export default function Layout({ children }) {
  return (
    <div className="min-h-dvh bg-[#edf2ff]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}