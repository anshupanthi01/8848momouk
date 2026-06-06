import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useMemo, useState } from "react"
import {
  BarChart3,
  BookOpenText,
  CalendarCheck,
  ChevronLeft,
  GalleryHorizontalEnd,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu as MenuIcon,
  PanelLeftClose,
  Settings,
  Utensils,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/studio/store/authStore"

const navItems = [
  { label: "Dashboard", href: "/studio", icon: LayoutDashboard },
  { label: "Menu", href: "/studio/menu", icon: Utensils },
  { label: "Blogs", href: "/studio/blogs", icon: BookOpenText },
  { label: "Gallery", href: "/studio/gallery", icon: GalleryHorizontalEnd },
  { label: "Reservations", href: "/studio/reservations", icon: CalendarCheck },
  { label: "Pages", href: "/studio/pages", icon: BarChart3 },
  { label: "Navigation", href: "/studio/navigation", icon: Link2 },
  { label: "Settings", href: "/studio/settings", icon: Settings },
]

function Sidebar({ mobile = false, onClose }) {
  const { sidebarCollapsed, setSidebarCollapsed, logout, user } = useAuthStore()
  const collapsed = !mobile && sidebarCollapsed

  return (
    <aside className={`${collapsed ? "w-[86px]" : "w-[290px]"} flex h-full flex-col overflow-hidden bg-[#21408e] text-white transition-all duration-300`}>
      <div className="relative border-b border-white/10 p-5">
        <div className="absolute inset-0 opacity-20 au-hero-grid" />
        <div className="relative flex items-center gap-3">
          <img src="/8848-assets/logo-header-crop.png" alt="8848 Momo House" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
          {!collapsed && (
            <div>
              <div className="au-display-font text-xl uppercase leading-none">8848 Studio</div>
              <div className="studio-label mt-1 text-white/50">Control center</div>
            </div>
          )}
          {mobile && (
            <button className="ml-auto rounded-full p-2 hover:bg-white/10" onClick={onClose} type="button">
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/studio"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-bold uppercase tracking-[0.08em] transition ${isActive ? "bg-[#de1d3d] text-white shadow-[0_18px_35px_-18px_rgba(225,29,46,0.9)]" : "text-white/68 hover:bg-white/10 hover:text-white"}`
              }
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        {!mobile && (
          <Button variant="ghost" className="h-10 w-full justify-start rounded-lg text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {collapsed ? <ChevronLeft className="size-4 rotate-180" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && "Collapse"}
          </Button>
        )}
        <Button variant="ghost" className="h-10 w-full justify-start rounded-lg text-white/70 hover:bg-white/10 hover:text-white" onClick={logout}>
          <LogOut className="size-4" />
          {!collapsed && "Logout"}
        </Button>
        {!collapsed && <div className="rounded-lg bg-white/8 p-3 text-xs text-white/55">{user?.username || user?.email || "Restaurant owner"}</div>}
      </div>
    </aside>
  )
}

export default function StudioChrome() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()
  const pageTitle = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean).at(-1) || "dashboard"
    return segment === "studio" ? "Dashboard" : segment.replace(/-/g, " ")
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#edf2ff] au-body-font text-[#21408e]">
      <div className="fixed inset-0 pointer-events-none opacity-65 au-about-lines" />
      <div className="relative flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[#21408e]/10 bg-[#edf2ff]/85 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full lg:hidden">
                      <MenuIcon className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[290px] border-none bg-transparent p-0">
                    <Sidebar mobile onClose={() => setOpen(false)} />
                  </SheetContent>
                </Sheet>
                <div>
                  <div className="au-kicker">Studio / {pageTitle}</div>
                  <h1 className="au-display-font mt-1 text-[clamp(1.5rem,3vw,2.45rem)] uppercase leading-none text-[#21408e]">{pageTitle}</h1>
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="studio-label text-[#21408e]/45">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
                <div className="text-sm font-bold text-[#21408e]">{user?.first_name || user?.username || "Admin"}</div>
              </div>
            </div>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
