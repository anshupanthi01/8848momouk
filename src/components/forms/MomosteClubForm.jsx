import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MomosteClubForm({ onCancel }) {
  const [status, setStatus] = useState("idle")
  const [form, setForm] = useState({ from_name: "", from_email: "", message: "" })

  const canSubmit =
    form.from_name.trim().length >= 2 && emailRe.test(form.from_email.trim())

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit || status === "sending") return

    setStatus("sending")
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      // Your existing INTERNAL template id (already working)
      const internalTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

      // New THANK-YOU template id (customer)
      const thanksTemplateId =
        import.meta.env.VITE_EMAILJS_THANKS_TEMPLATE_ID || "template_whw2ivp"

      // Template variables (match your EmailJS template variables)
      // - Internal template (your screenshot) expects: title, name, email, message
      // - Thank-you template should also use: name, message (and uses to_email for recipient)
      const templateParams = {
        title: "Momoste Club Signup",
        name: form.from_name.trim(),
        email: form.from_email.trim(),
        message: form.message.trim() || "New Momoste Club signup",
      }

      // 1) Send INTERNAL email to you (existing behavior)
      await emailjs.send(serviceId, internalTemplateId, templateParams, { publicKey })

      // 2) Send THANK-YOU email to the customer
      await emailjs.send(
        serviceId,
        thanksTemplateId,
        {
          ...templateParams,
          to_email: templateParams.email, // IMPORTANT: matches {{to_email}} in EmailJS "To Email"
        },
        { publicKey }
      )

      setStatus("success")
    } catch (err) {
  console.error("EmailJS error:", err)
  console.error("EmailJS error text:", err?.text)
  console.error("EmailJS error status:", err?.status)
  setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 text-left bg-white rounded-xl">
        <div className="text-xl font-black text-[#21408e]">Thank you!</div>
        <p className="mt-2 text-sm font-medium text-[#21408e]/75">
          We received your details.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="p-6 text-left bg-white rounded-xl">
      <label className="block text-xs font-extrabold tracking-wide text-[#21408e]">
        Name
      </label>
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#de1d3d]"
        value={form.from_name}
        onChange={(e) => setForm((s) => ({ ...s, from_name: e.target.value }))}
        placeholder="Your name"
        autoComplete="name"
      />

      <label className="mt-5 block text-xs font-extrabold tracking-wide text-[#21408e]">
        Email
      </label>
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#de1d3d]"
        value={form.from_email}
        onChange={(e) => setForm((s) => ({ ...s, from_email: e.target.value }))}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <label className="mt-5 block text-xs font-extrabold tracking-wide text-[#21408e]">
        Message
      </label>
      <textarea
        className="mt-2 w-full resize-none rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#de1d3d]"
        rows={4}
        value={form.message}
        onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
        placeholder="Say something..."
      />

      {status === "error" && (
        <div className="mt-4 text-sm font-bold text-red-600">
          Something went wrong. Please try again.
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6 sm:flex-row">
        <Button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="h-11 flex-1 bg-[#21408e] font-extrabold tracking-wide hover:bg-[#162347] disabled:opacity-60"
        >
          {status === "sending" ? "Submitting..." : "Submit"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="text-white bg-red-600 border-red-600 h-11 hover:bg-red-700 hover:border-red-700 hover:text-white"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}