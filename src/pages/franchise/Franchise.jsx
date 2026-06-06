import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EVEREST_BADGE = "/8848-assets/mount-everest-nepal-8848.png";

function FranchiseForm() {
  const { t } = useTranslation("franchise")
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
      const internalTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const thanksTemplateId = import.meta.env.VITE_EMAILJS_THANKS_TEMPLATE_ID || "template_whw2ivp"

      const name = form.from_name.trim()
      const email = form.from_email.trim()
      const message = (form.message || "").trim() || t("form.fallbackMessage")

      const params = {
        title: t("email.title"),
        time: new Date().toLocaleString(),
        name,
        email,
        message,
        from_name: name,
        from_email: email,
      }

      await emailjs.send(serviceId, internalTemplateId, params, { publicKey })
      await emailjs.send(
        serviceId,
        thanksTemplateId,
        { ...params, to_email: email },
        { publicKey }
      )

      setStatus("success")
    } catch (err) {
      console.error("EmailJS error:", err?.text || err)
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-7 text-center shadow-[0_14px_60px_rgba(30,46,92,0.18)]">
        <div className="au-display-font text-2xl font-black text-[#21408e]">
          {t("form.successTitle")}
        </div>
        <p className="au-copy-sm mt-2">
          {t("form.successBody")}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white p-7 shadow-[0_14px_60px_rgba(30,46,92,0.18)]"
    >
      <div className="grid gap-5">
        <div>
          <label className="au-kicker block text-[0.72rem]">
            {t("form.nameLabel")}
          </label>
          <input
            className="mt-2 h-12 w-full rounded-md border border-[#21408e]/15 bg-white px-4 text-[0.95rem] text-[#21408e] outline-none transition focus:border-[#de1d3d]"
            value={form.from_name}
            onChange={(e) => setForm((s) => ({ ...s, from_name: e.target.value }))}
            placeholder={t("form.namePlaceholder")}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="au-kicker block text-[0.72rem]">
            {t("form.emailLabel")}
          </label>
          <input
            className="mt-2 h-12 w-full rounded-md border border-[#21408e]/15 bg-white px-4 text-[0.95rem] text-[#21408e] outline-none transition focus:border-[#de1d3d]"
            value={form.from_email}
            onChange={(e) => setForm((s) => ({ ...s, from_email: e.target.value }))}
            placeholder={t("form.emailPlaceholder")}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="au-kicker block text-[0.72rem]">
            {t("form.messageLabel")}
          </label>
          <textarea
            className="mt-2 min-h-[120px] w-full resize-y rounded-md border border-[#21408e]/15 bg-white px-4 py-3 text-[0.95rem] text-[#21408e] outline-none transition focus:border-[#de1d3d]"
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            placeholder={t("form.messagePlaceholder")}
          />
        </div>

        {status === "error" && (
          <div className="px-4 py-3 text-sm font-bold text-red-700 border-l-4 border-red-600 rounded-md bg-red-50">
            {t("form.error")}
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="h-12 w-full rounded-xl bg-[#de1d3d] text-[0.78rem] font-extrabold uppercase tracking-[0.14em] hover:bg-[#c51625] disabled:opacity-60"
        >
          {status === "sending" ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </form>
  )
}

export default function Franchise() {
  const { t } = useTranslation("franchise")

  return (
    <main className="bg-white au-body-font">
      <section className="relative overflow-hidden bg-[#edf2ff]">
        <div className="absolute inset-0 pointer-events-none opacity-60 au-hero-grid" />

        <div className="relative mx-auto max-w-[1490px] px-5 py-16 sm:px-8 md:py-24">
          <div className="text-center">
            <div className="au-kicker">
              {t("hero.kicker")}
            </div>

            <h1 className="au-display-font mx-auto mt-5 max-w-[22ch] text-[clamp(2.25rem,7.4vw,4.375rem)] uppercase leading-none text-[#21408e]">
              {t("hero.titleLine1")}
              <span className="au-stamp-font mt-2 block text-[#de1d3d]">{t("hero.titleLine2")}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="absolute inset-0 pointer-events-none opacity-60 au-hero-grid" />

        <div className="relative mx-auto grid max-w-[1490px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_520px] lg:items-start lg:gap-14 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="au-display-font text-[clamp(2.1rem,4vw,3.1rem)] uppercase leading-[1.03] text-[#21408e]">
              {t("body.headingLine1")}
              <span className="mt-2 block text-[#de1d3d]">{t("body.headingLine2")}</span>
            </h2>

            <p className="au-copy-strong mt-6">
              {t("body.lead")}
            </p>

            <p className="au-copy mt-6">
              {t("body.paragraph")}
            </p>
          </div>

          <div className="lg:sticky lg:top-8">
            <FranchiseForm />
          </div>
        </div>
      </section>
    </main>
  )
}
