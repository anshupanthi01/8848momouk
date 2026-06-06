import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { getPageSectionContent, useHomePage } from "@/lib/cms"
import { motion } from "framer-motion"
import { FaRegThumbsUp } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import MomosteClubForm from "@/components/forms/MomosteClubForm"

const yakImg = "/8848-assets/yak-footer.png"

export default function YakClubSection() {
  const { t, i18n } = useTranslation("home")
  const homePage = useHomePage()
  const fallback = {
    titlePrefix: t("yak.titlePrefix"),
    titleEmph: t("yak.titleEmph"),
    body: t("yak.body"),
    cta: t("yak.cta"),
    image: yakImg,
    imageAlt: t("yak.imageAlt"),
  }
  const yak = getPageSectionContent(homePage, "yak_club", fallback, i18n.language)
  const [showForm, setShowForm] = useState(false)
  const formAnchorRef = useRef(null)

  function openForm() {
    setShowForm(true)
    setTimeout(() => {
      formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 0)
  }

  return (
    <section
      className="relative overflow-hidden bg-[#de1d3d] au-body-font"
      style={{
        backgroundImage:
          "radial-gradient(circle at 12% 20%, rgba(255,255,255,0.18), transparent 28%), linear-gradient(135deg, rgba(30,46,92,0.20) 0, rgba(30,46,92,0.20) 3px, transparent 3px, transparent 48px)",
        backgroundSize: "auto, 64px 64px",
      }}
    >
      <div className="absolute inset-0 bg-[#de1d3d]/82" />

      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute -right-32 top-0 h-full w-[70%]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(30,46,92,0.55) 0, rgba(30,46,92,0.55) 3px, transparent 3px, transparent 44px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ? make the red block smaller by reducing max-width + padding */}
      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
        {/* LEFT */}
        <div className="mx-auto w-full max-w-[560px] text-center text-white lg:mx-0 lg:text-left">
          {/* ? make heading smaller */}
          <h2 className="au-display-font text-[clamp(1.9rem,6vw,3.2rem)] font-bold uppercase leading-[0.98] lg:max-w-[12ch]">
            {yak.titlePrefix || fallback.titlePrefix} <span className="au-stamp-font opacity-95">{yak.titleEmph || fallback.titleEmph}</span>
          </h2>

          {/* ? make body text smaller + slightly tighter line height */}
          <p className="mx-auto mt-5 max-w-xl text-[clamp(0.95rem,2vw,1rem)] font-medium leading-7 text-white/90 lg:mx-0">
            {yak.body || fallback.body}
          </p>

          <div className="mt-8" ref={formAnchorRef}>
            {!showForm ? (
              <Button
                onClick={openForm}
                className="h-10 bg-[#21408e] px-8 text-sm font-extrabold tracking-wide hover:bg-[#162347]"
              >
                <FaRegThumbsUp className="mr-2" />
                {yak.cta || fallback.cta}
              </Button>
            ) : (
              <MomosteClubForm onCancel={() => setShowForm(false)} />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center lg:justify-end">
          {/* ? make image a bit smaller too (optional, but helps section feel smaller) */}
          <motion.img
            src={yak.image || fallback.image}
            alt={yak.imageAlt || fallback.imageAlt}
            className="w-[min(82vw,380px)] drop-shadow-2xl lg:w-[min(44vw,500px)]"
            loading="lazy"
            initial={{ opacity: 0, x: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            animate={{ y: [0, -10, 0] }}
            whileHover={{ y: -12, scale: 1.03 }}
          />
        </div>
      </div>
    </section>
  )
}
