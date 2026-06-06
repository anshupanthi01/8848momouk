import { BookOpenText, CalendarCheck, Clock3, GalleryHorizontalEnd, Utensils } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CardContent, CardHeader, CardTitle, StatCard, StudioCard, StudioHero } from "@/studio/components/StudioPrimitives"
import { useDashboard } from "@/studio/hooks/useStudioQueries"
import { useAuthStore } from "@/studio/store/authStore"

const FRANKFURT_TIME_ZONE = "Europe/Berlin"

function getFrankfurtParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FRANKFURT_TIME_ZONE,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date)
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0)
  return { hour: hour === 24 ? 0 : hour }
}

function formatFrankfurtTime(date = new Date()) {
  return new Intl.DateTimeFormat("en", {
    timeZone: FRANKFURT_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { hour } = getFrankfurtParts(now)
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const stats = data?.stats || {}
  const fallbackActivity = ["Homepage CMS ready", "Gallery content synced", "Menu document connected"]
  const activityItems = data?.activity?.length ? data.activity : fallbackActivity
  const visibleActivity = showAllActivity ? activityItems : activityItems.slice(0, 10)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      <StudioHero
        eyebrow="8848 operating system"
        title={`${greeting}, ${user?.first_name || user?.username || "chef"}`}
        action={<Button className="h-12 rounded-lg bg-[#de1d3d] px-6 font-bold uppercase tracking-[0.1em] text-white hover:bg-[#c51625]" onClick={() => navigate("/studio/pages")}>Edit homepage</Button>}
      >
        Manage the public website with the same care as service: clear sections, beautiful media, fast updates, and no technical clutter.
      </StudioHero>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {isLoading ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-28" />) : (
          <>
            <StatCard icon={Utensils} label="Total menu items" value={stats.menuItems ?? 0} />
            <StatCard icon={BookOpenText} label="Published blogs" value={stats.blogs ?? 0} tone="blue" />
            <StatCard icon={CalendarCheck} label="Reservations" value={stats.reservations ?? 0} />
            <StatCard icon={GalleryHorizontalEnd} label="Gallery images" value={stats.galleryImages ?? 0} tone="blue" />
            <StatCard icon={Clock3} label="Frankfurt time" value={formatFrankfurtTime(now)} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <StudioCard>
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {visibleActivity.map((item, index) => (
              <div key={`${item}-${index}`} className="studio-panel flex items-center justify-between p-4 text-sm font-semibold text-[#21408e]">
                <span>{typeof item === "string" ? item : item.title || `${item.label}: ${item.value}`}</span>
                <span className="studio-label text-[#21408e]/45">{typeof item === "string" ? "Live" : item.area || item.action || "Updated"}</span>
              </div>
            ))}
            {activityItems.length > 10 && (
              <Button
                variant="outline"
                className="studio-control h-11 w-full text-[#21408e]"
                onClick={() => setShowAllActivity((value) => !value)}
              >
                {showAllActivity ? "Show less" : `Read more (${activityItems.length - 10})`}
              </Button>
            )}
          </CardContent>
        </StudioCard>
        <StudioCard>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Add Menu Item", "/studio/menu"],
              ["Upload Image", "/studio/gallery"],
              ["New Blog", "/studio/blogs"],
              ["Edit Homepage", "/studio/pages"],
            ].map(([action, href]) => (
              <Button key={action} variant="outline" className="studio-control h-12 justify-start text-[#21408e]" onClick={() => navigate(href)}>{action}</Button>
            ))}
          </CardContent>
        </StudioCard>
      </div>
    </div>
  )
}
