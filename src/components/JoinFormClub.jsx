import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"

export default function JoinClubForm() {
  const [status, setStatus] = useState("idle") // idle | sending | success | error
  const [form, setForm] = useState({ from_name: "", from_email: "" })

  const canSubmit =
    form.from_name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email.trim())

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit || status === "sending") return

    setStatus("sending")
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          ...(import.meta.env.VITE_SIGNUP_TO_EMAIL
            ? { to_email: import.meta.env.VITE_SIGNUP_TO_EMAIL }
            : {}),
          from_name: form.from_name.trim(),
          from_email: form.from_email.trim(),
          message: "New Momoste Club signup",
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )

      setStatus("success")
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 bg-white rounded-lg">
        <h3 className="text-xl font-black text-[#21408e]">Thank you!</h3>
        <p className="mt-2 text-sm font-medium text-[#21408e]/75">
          We got your details. Check your email soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="p-6 bg-white rounded-lg">
      <label className="block text-xs font-extrabold tracking-wide text-[#21408e]">
        Name
      </label>
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-[#de1d3d]"
        value={form.from_name}
        onChange={(e) => setForm((s) => ({ ...s, from_name: e.target.value }))}
        placeholder="Your name"
        autoComplete="name"
      />

      <label className="mt-5 block text-xs font-extrabold tracking-wide text-[#21408e]">
        Email
      </label>
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-[#de1d3d]"
        value={form.from_email}
        onChange={(e) => setForm((s) => ({ ...s, from_email: e.target.value }))}
        placeholder="you@example.com"
        autoComplete="email"
      />

      {status === "error" && (
        <div className="mt-4 text-sm font-bold text-red-600">
          Failed to submit. Try again.
        </div>
      )}

      <Button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="mt-6 h-11 w-full bg-[#21408e] font-extrabold hover:bg-[#162347] disabled:opacity-60"
      >
        {status === "sending" ? "Submitting..." : "Join for free"}
      </Button>
    </form>
  )
}