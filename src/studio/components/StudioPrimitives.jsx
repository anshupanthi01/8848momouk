import { motion } from "framer-motion"
import { Search, Trash2, UploadCloud } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function StudioCard(props) {
  return <Card {...props} className={`studio-surface ${props.className || ""}`} />
}

export function StudioHero({ eyebrow, title, children, action }) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-lg bg-[#21408e] p-6 text-white shadow-[0_28px_80px_-45px_rgba(30,46,92,0.95)] sm:p-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.215, 0.61, 0.355, 1] }}
    >
      <div className="absolute inset-0 opacity-20 au-hero-grid" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="studio-label text-[#b6cbff]">{eyebrow}</div>
          <h2 className="au-display-font mt-3 max-w-3xl text-[clamp(2rem,5vw,4rem)] uppercase leading-none">{title}</h2>
          {children && <p className="studio-muted mt-4 max-w-2xl" style={{ color: "rgba(255,255,255,0.72)" }}>{children}</p>}
        </div>
        {action}
      </div>
    </motion.section>
  )
}

export function StatCard({ icon: Icon, label, value, tone = "red" }) {
  return (
    <StudioCard>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`grid size-12 place-items-center rounded-lg ${tone === "red" ? "bg-[#de1d3d]/10 text-[#de1d3d]" : "bg-[#21408e]/10 text-[#21408e]"}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="au-display-font break-words text-2xl leading-none text-[#21408e] sm:text-3xl">{value}</div>
          <div className="studio-label mt-1 text-[#21408e]/50">{label}</div>
        </div>
      </CardContent>
    </StudioCard>
  )
}

export function Toolbar({ search, onSearch, children }) {
  return (
    <div className="studio-surface flex flex-col gap-3 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
      <label className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#21408e]/40" />
        <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search" className="studio-control h-11 pl-10" />
      </label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Confirm action"}</DialogTitle>
          <DialogDescription>{description || "This action cannot be undone."}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button className="bg-[#de1d3d] text-white hover:bg-[#c51625]" onClick={onConfirm} disabled={loading}>
            <Trash2 className="size-4" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CloudinaryButton({ onUpload }) {
  function openWidget() {
    if (!window.cloudinary || !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || !import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
      toast.error("Cloudinary upload is not configured. Use the file picker or paste an image URL.")
      return
    }
    window.cloudinary.createUploadWidget(
      { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET },
      (error, result) => {
        if (!error && result?.event === "success") onUpload?.(result.info)
      },
    ).open()
  }

  return (
    <Button type="button" variant="outline" className="studio-control h-11" onClick={openWidget}>
      <UploadCloud className="size-4" />
      Upload image
    </Button>
  )
}

export { CardHeader, CardTitle, CardDescription, CardContent }
