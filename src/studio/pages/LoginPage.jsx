import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowRight, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginStudio } from "@/studio/services/auth"
import { useAuthStore } from "@/studio/store/authStore"

export default function LoginPage() {
  const navigate = useNavigate()
  const { accessToken, setTokens, setUser } = useAuthStore()
  const [form, setForm] = useState({ email: "", password: "" })
  const login = useMutation({
    mutationFn: loginStudio,
    onSuccess: (data) => {
      setTokens({ access: data.access, refresh: data.refresh })
      setUser(data.user || { username: form.email, email: form.email })
      toast.success("Welcome to 8848 Studio")
      navigate("/studio", { replace: true })
    },
    onError: (error) => {
      const message = error?.message?.includes("authentication tokens")
        ? "Login reached the wrong API. Check the production backend URL in config.js."
        : "Login failed. Check your staff credentials."
      toast.error(message)
    },
  })

  if (accessToken) return <Navigate to="/studio" replace />

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#edf2ff] px-4 au-body-font text-[#21408e]">
      <div className="absolute inset-0 opacity-80 au-about-lines" />
      <div className="absolute bottom-[-160px] right-[-80px] h-[560px] w-[900px] opacity-70 au-mountain-lines" />
      <Card className="studio-surface relative z-10 w-full max-w-[480px] overflow-hidden">
        <CardContent className="p-7 sm:p-9">
          <div className="text-center">
            <img src="/8848-assets/logo-header-crop.png" alt="8848 Momo House" className="mx-auto h-20 w-20 rounded-full object-contain" />
            <div className="au-kicker mt-6">Staff portal</div>
            <h1 className="au-display-font mt-3 text-[clamp(2.4rem,8vw,4rem)] uppercase leading-none">8848 Studio</h1>
            <p className="studio-muted mx-auto mt-4 max-w-sm">A private control center for menus, pages, gallery, reservations, and daily restaurant operations.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={(event) => { event.preventDefault(); login.mutate(form) }}>
            <Input className="studio-control h-12 px-4" placeholder="Email or username" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} required />
            <Input className="studio-control h-12 px-4" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))} required />
            <Button type="submit" className="h-12 w-full rounded-lg bg-[#de1d3d] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#c51625]" disabled={login.isPending}>
              <LockKeyhole className="size-4" />
              {login.isPending ? "Opening..." : "Enter Studio"}
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
