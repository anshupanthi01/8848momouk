import { createContext, useContext, useState } from "react"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import { z } from "zod"
import { motion } from "framer-motion"
import {
  Mountain,
  Utensils,
  Users,
  TrendingUp,
  HeartHandshake,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Store,
  Globe2,
  Award,
} from "lucide-react"

import momosHero from "@/assets/franchise-hero-momos.jpeg"
import restaurant from "@/assets/restaurant-jak.jpg"
import stampJak from "@/assets/stamp-jak.png"
import storefront from "@/assets/storefront.jpg"
import {
  getSectionTranslator,
  postFranchiseInquiry,
  useFranchiseFaqs,
  useFranchisePage,
  useSiteSettings,
} from "@/lib/cms"

const EVEREST_BADGE = "/8848-assets/mount-everest-nepal-8848.png"

/* -------------------- schema (unchanged) -------------------- */
const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(6, "Please enter a valid phone").max(30),
  region: z.string().min(1, "Select a region"),
  city: z.string().trim().min(2, "Enter your town / city").max(100),
  postcode: z.string().trim().min(3, "Enter your postcode").max(12),
  capital: z.string().min(1, "Select your investment range"),
  experience: z.string().min(1, "Select your experience"),
  message: z.string().trim().max(1000).optional(),
})

/* ─── Design tokens (mirrors homepage) ─── */
const C = {
  navy: "#21408e",
  red: "#de1d3d",
  blue: "#21408e",
  deepBlue: "#21408e",
  bg: "#edf2ff",
  bgWhite: "#ffffff",
  muted: "#b6cbff",
  border: "rgba(39,72,150,0.15)",
  cardBg: "rgba(234,241,255,0.7)",
}

/* ─── Shared motion preset ─── */
const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
}

/* ─── Pill badge ─── */
function Kicker({ children }) {
  return (
    <div
      className="au-kicker"
      style={{ color: C.red }}
    >
      {children}
    </div>
  )
}

/* ─── Section label ─── */
function SectionLabel({ children }) {
  return (
    <div className="au-kicker" style={{ color: C.red }}>
      {children}
    </div>
  )
}

/* ─── Red pill CTA button ─── */
function BtnRed({ href, children, onClick, className = "" }) {
  const cls =
    `inline-flex items-center justify-center gap-2 h-[clamp(48px,6vw,53px)] px-8 rounded-[24px] text-sm font-bold uppercase tracking-wide text-white transition duration-300 ease-out hover:-translate-y-1 ${className}`
  if (href) return <a href={href} className={cls} style={{ background: C.red }}>{children}</a>
  return <button type="button" onClick={onClick} className={cls} style={{ background: C.red }}>{children}</button>
}

/* ─── Navy/blue outline button ─── */
function BtnOutline({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 h-[clamp(48px,6vw,53px)] px-8 rounded-[24px] text-sm font-bold uppercase tracking-wide text-white transition duration-300 ease-out hover:-translate-y-1 hover:opacity-90 ${className}`}
      style={{ background: C.blue }}
    >
      {children}
    </a>
  )
}

/* -------------------- PAGE ROOT -------------------- */
export default function FranchisePage() {
  const franchisePage = useFranchisePage()

  return (
    <FranchiseCmsContext.Provider value={franchisePage}>
      <div className="min-h-screen au-body-font" style={{ background: C.bg, color: C.deepBlue }}>
        <Toaster richColors position="top-center" />
        <svg width="0" height="0" className="absolute">
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </svg>

        <Hero />
        <Stats />
        <UkLaunchBanner />
        <BrandStory />
        <WhyFranchise />
        <FormatsBanner />
        <Support />
        <Investment />
        <Process />
        <Testimonial />
        <FAQ />
        <InquiryForm />
      </div>
    </FranchiseCmsContext.Provider>
  )
}

/* -------------------- HERO -------------------- */
function Hero() {
  const t = useFranchiseT("hero")

  return (
    <section id="top" className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-60 au-hero-grid" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-[clamp(300px,50vw,560px)] w-[clamp(600px,90vw,1030px)] opacity-70 au-mountain-lines" />

      <div className="relative z-10 mx-auto grid max-w-[1490px] grid-cols-1 gap-10 px-5 pt-[clamp(32px,6vw,96px)] pb-[clamp(48px,8vw,120px)] lg:grid-cols-[minmax(320px,560px)_1fr]">
        <motion.div className="relative z-10 w-full text-center lg:text-left" {...fadeUp}>
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px" style={{ background: C.red }} />
            <Kicker>{t("hero.kicker")}</Kicker>
            <Globe2 className="h-3.5 w-3.5" style={{ color: C.red }} />
          </div>

          <h1
            className="au-display-font mx-auto max-w-[300px] text-[clamp(1.6rem,5.5vw,3.2rem)] uppercase leading-[1.02] sm:max-w-none lg:mx-0"
            style={{ color: C.navy }}
          >
            <span className="block">{t("hero.titleLine1")}</span>
            <span className="au-stamp-font block mt-1" style={{ color: C.red }}>{t("hero.titleLine2")}</span>
            <span className="block">{t("hero.titleLine3")}</span>
          </h1>

          <p
            className="au-copy mx-auto mt-6 w-full max-w-[540px] lg:mx-0"
            style={{ color: C.deepBlue }}
          >
            {t("hero.body")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 lg:justify-start">
            <BtnRed href="#inquire">
              {t("hero.ctaPrimary")} <ArrowRight className="w-4 h-4" />
            </BtnRed>
            <BtnOutline href="#why">{t("hero.ctaSecondary")}</BtnOutline>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm font-medium lg:justify-start"
            style={{ color: C.deepBlue }}
          >
            {(t("hero.chips", { returnObjects: true }) || []).map((chip) => (
              <div key={chip} className="flex items-center gap-2">
                <CheckCircle2 className="flex-none w-4 h-4" style={{ color: C.red }} />
                {chip}
              </div>
            ))}
          </div>

          <div className="mt-10 hidden w-[150px] lg:block">
            <img
              src={EVEREST_BADGE}
              alt="Mount Everest Nepal 8848m"
              className="h-auto w-[150px] opacity-45"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div
          className="relative flex min-h-[clamp(220px,40vw,505px)] items-end justify-center lg:justify-end"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[2rem] shadow-2xl lg:absolute lg:bottom-8 lg:right-0 lg:top-12 lg:max-w-[600px]">
            <img src={momosHero} alt={t("hero.imageAlt")} className="object-cover w-full h-full" />
            <div className="absolute px-3 py-1 text-xs tracking-widest text-white rounded-md shadow left-5 top-5 au-nav-font" style={{ background: C.red }}>
              {t("hero.imageBadge")}
            </div>
            <div className="absolute flex items-end justify-between gap-3 bottom-5 left-5 right-5">
              <div className="text-2xl leading-tight text-white au-display-font drop-shadow-md sm:text-3xl">
                {t("hero.imageCaptionLine1")}
                <br />
                {t("hero.imageCaptionLine2")}
              </div>
              <span className="text-3xl italic text-white font-script drop-shadow-md sm:text-4xl">
                {t("hero.imageCaptionScript")}
              </span>
            </div>
          </div>

          <img
            src={stampJak}
            alt={t("hero.stampAlt")}
            className="absolute -bottom-8 -left-4 z-10 h-32 w-32 rotate-[-10deg] drop-shadow-xl sm:h-44 sm:w-44 lg:-left-8"
          />
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- STATS -------------------- */
function Stats() {
  const t = useFranchiseT("stats")
  const stats = t("stats.items", { returnObjects: true }) || []

  return (
    <section className="border-y" style={{ background: C.navy, borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="mx-auto grid max-w-[1490px] grid-cols-2 gap-8 px-5 py-14 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.k}
            className="text-center"
            {...fadeUp}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <div className="au-display-font text-[clamp(2.4rem,6vw,3.5rem)]" style={{ color: C.red }}>
              {s.k}
            </div>
            <div className="au-copy-sm mt-2" style={{ color: "rgba(255,255,255,0.75)" }}>{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* -------------------- BANNER -------------------- */
function UkLaunchBanner() {
  const t = useFranchiseT("banner")

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: C.bgWhite }}>
      <div className="pointer-events-none absolute bottom-[-60px] right-[-30px] h-[clamp(200px,30vw,400px)] w-[clamp(400px,60vw,700px)] opacity-[0.05] au-mountain-lines" />
      <div className="relative mx-auto max-w-[1490px] px-5 text-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px" style={{ background: C.red }} />
            <Kicker>{t("banner.kicker")}</Kicker>
            <div className="w-8 h-px" style={{ background: C.red }} />
          </div>

          <h2 className="au-display-font text-[clamp(1.5rem,4.5vw,3rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("banner.title")}
          </h2>

          <p className="au-copy mx-auto mt-5 max-w-2xl" style={{ color: C.deepBlue }}>
            {t("banner.body")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <BtnRed href="#inquire">
              {t("banner.ctaPrimary")} <ArrowRight className="w-4 h-4" />
            </BtnRed>
            <BtnOutline href="#investment">{t("banner.ctaSecondary")}</BtnOutline>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- BRAND STORY (only text -> t) -------------------- */
function BrandStory() {
  const t = useFranchiseT("story")

  return (
    <section id="story" className="relative py-24 overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-40 au-hero-grid" />
      <div className="relative mx-auto grid max-w-[1490px] items-center gap-12 px-5 lg:grid-cols-2">
        <motion.div className="relative" {...fadeUp}>
          <div className="absolute -inset-3 rounded-[2rem]" style={{ border: `3px solid ${C.red}` }} />
          <div className="absolute -inset-6 hidden rounded-[2.25rem] sm:block" style={{ border: `1px solid ${C.blue}33` }} />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-2xl">
            <img src={storefront} alt={t("story.imageAlt")} className="object-cover w-full h-full" loading="lazy" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(30,46,92,0.45), transparent)" }} />
            <div className="absolute px-3 py-1 text-xs tracking-widest text-white rounded-md left-5 top-5 au-nav-font" style={{ background: C.red }}>
              {t("hero.imageBadge")}
            </div>
            <div className="absolute flex items-end justify-between gap-3 bottom-5 left-5 right-5">
              <div className="text-2xl leading-tight text-white au-display-font drop-shadow-md sm:text-3xl">
                {t("hero.imageCaptionLine1")}
                <br />
                {t("hero.imageCaptionLine2")}
              </div>
              <span className="text-3xl italic text-white font-script drop-shadow-md sm:text-4xl">
                {t("hero.imageCaptionScript")}
              </span>
            </div>
          </div>
          <img src={stampJak} alt="" aria-hidden className="absolute -right-6 -top-8 h-24 w-24 rotate-[12deg] drop-shadow-lg sm:h-28 sm:w-28" />
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }}>
          <SectionLabel>{t("story.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("story.titleLine1")}
            <br />
            <span className="au-stamp-font" style={{ color: C.red }}>{t("story.titleLine2")}</span>
          </h2>

          <p className="au-copy mt-6" style={{ color: C.deepBlue }}>
            {t("story.p1")}
          </p>
          <p className="au-copy mt-4" style={{ color: C.deepBlue }}>
            {t("story.p2")}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {(t("story.cards", { returnObjects: true }) || []).map(({ icon, text }) => {
              const Icon =
                icon === "Mountain" ? Mountain :
                icon === "Utensils" ? Utensils :
                icon === "HeartHandshake" ? HeartHandshake :
                Sparkles

              return (
                <div
                  key={text}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                >
                  <Icon className="flex-none w-5 h-5" style={{ color: C.red }} />
                  <span className="text-sm font-semibold" style={{ color: C.navy }}>
                    {text}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- WHY FRANCHISE -------------------- */
function WhyFranchise() {
  const t = useFranchiseT("why")
  const items = t("why.items", { returnObjects: true }) || []

  const iconMap = { Award, Utensils, Users, HeartHandshake }

  return (
    <section id="why" className="py-24" style={{ background: C.bgWhite }}>
      <div className="mx-auto max-w-[1490px] px-5">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <SectionLabel>{t("why.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("why.titleLine1")}
            <br />
            <span className="au-stamp-font" style={{ color: C.red }}>{t("why.titleLine2")}</span>
          </h2>
          <p className="au-copy mt-4" style={{ color: C.deepBlue }}>
            {t("why.body")}
          </p>
        </motion.div>

        <div className="grid gap-6 mt-14 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = iconMap[it.icon] || Sparkles
            return (
              <motion.div
                key={it.title}
                className="relative overflow-hidden transition-all duration-300 group rounded-3xl p-7 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="grid w-12 h-12 place-items-center rounded-2xl" style={{ background: `${C.red}15` }}>
                  <Icon className="w-6 h-6" style={{ color: C.red }} />
                </div>
                <h3 className="au-nav-font mt-5 text-base uppercase tracking-[0.1em]" style={{ color: C.navy }}>
                  {it.title}
                </h3>
                <p className="au-copy-sm mt-2" style={{ color: C.deepBlue }}>
                  {it.body}
                </p>
                <div className="absolute w-24 h-24 rotate-45 rounded-sm -bottom-10 -right-10" style={{ background: `${C.red}08` }} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------- FORMATS -------------------- */
function FormatsBanner() {
  const t = useFranchiseT("formats")
  const formats = t("formats.items", { returnObjects: true }) || []
  const iconMap = { Store, Utensils, TrendingUp, Sparkles }

  return (
    <section className="py-20" style={{ background: C.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-30 au-hero-grid" />
      <div className="mx-auto max-w-[1490px] px-5">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <SectionLabel>{t("formats.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.4rem,3.5vw,2.5rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("formats.titleLine1")} <span className="au-stamp-font" style={{ color: C.red }}>{t("formats.titleLine2")}</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-4">
          {formats.map((f, i) => {
            const Icon = iconMap[f.icon] || Sparkles
            return (
              <motion.div
                key={f.title}
                className="p-6 transition-all duration-300 rounded-3xl hover:-translate-y-1 hover:shadow-lg"
                style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="grid w-12 h-12 place-items-center rounded-2xl" style={{ background: `${C.red}15` }}>
                  <Icon className="w-6 h-6" style={{ color: C.red }} />
                </div>
                <h3 className="au-nav-font mt-4 text-base uppercase tracking-[0.1em]" style={{ color: C.navy }}>
                  {f.title}
                </h3>
                <p className="au-copy-sm mt-2" style={{ color: C.deepBlue }}>
                  {f.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------- SUPPORT -------------------- */
function Support() {
  const t = useFranchiseT("support")
  const pillars = t("support.pillars", { returnObjects: true }) || []

  return (
    <section className="py-24" style={{ background: C.bgWhite }}>
      <div className="mx-auto grid max-w-[1490px] items-center gap-12 px-5 lg:grid-cols-2">
        <motion.div {...fadeUp}>
          <SectionLabel>{t("support.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("support.titleLine1")}
            <br />
            <span className="au-stamp-font" style={{ color: C.red }}>{t("support.titleLine2")}</span>
          </h2>
          <p className="au-copy mt-6" style={{ color: C.deepBlue }}>
            {t("support.body")}
          </p>

          <ul className="grid gap-3 mt-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" style={{ color: C.red }} />
                <span className="text-sm font-semibold" style={{ color: C.navy }}>{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="relative" {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }}>
          <div className="overflow-hidden shadow-2xl rounded-2xl">
            <img src={restaurant} alt={t("support.imageAlt")} loading="lazy" className="object-cover w-full" />
          </div>
          <img src={stampJak} alt="" aria-hidden className="absolute -right-6 -bottom-8 h-32 w-32 rotate-[8deg] drop-shadow-xl sm:h-40 sm:w-40" />
          <div className="absolute -left-4 top-6 rotate-[-6deg] rounded-md px-4 py-2 au-nav-font text-sm tracking-widest text-white shadow-lg" style={{ background: C.red }}>
            {t("support.badge")}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- INVESTMENT -------------------- */
function Investment() {
  const t = useFranchiseT("investment")
  const tiers = t("investment.tiers", { returnObjects: true }) || []

  return (
    <section id="investment" className="py-24" style={{ background: C.navy }}>
      <div className="mx-auto max-w-[1490px] px-5">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <div className="au-kicker" style={{ color: C.muted }}>
            {t("investment.label")}
          </div>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02] text-white">
            {t("investment.titleLine1")} <span className="au-stamp-font" style={{ color: C.red }}>{t("investment.titleLine2")}</span>
          </h2>
          <p className="au-copy mt-4" style={{ color: "rgba(255,255,255,0.7)" }}>
            {t("investment.body")}
          </p>
        </motion.div>

        <div className="grid gap-6 mt-14 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="relative p-8 transition-all duration-300 rounded-2xl hover:-translate-y-1"
              style={
                tier.featured
                  ? { background: C.bgWhite, border: `2px solid ${C.red}`, boxShadow: `0 20px 60px rgba(225,29,46,0.25)` }
                  : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }
              }
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {tier.featured && (
                <div className="absolute px-4 py-1 text-xs tracking-widest text-white -translate-x-1/2 rounded-full -top-3 left-1/2 au-nav-font" style={{ background: C.red }}>
                  {t("investment.featuredBadge")}
                </div>
              )}

              <h3 className="au-nav-font text-xl tracking-[0.1em]" style={{ color: tier.featured ? C.navy : "white" }}>
                {tier.name}
              </h3>
              <div className="au-display-font mt-3 text-[clamp(1.6rem,3vw,2.4rem)]" style={{ color: C.red }}>
                {tier.range}
              </div>
              <p className="au-copy-sm mt-3" style={{ color: tier.featured ? C.deepBlue : "rgba(255,255,255,0.7)" }}>
                {tier.blurb}
              </p>

              <ul className="mt-6 space-y-2 text-sm">
                {(tier.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" style={{ color: C.red }} />
                    <span style={{ color: tier.featured ? C.deepBlue : "rgba(255,255,255,0.85)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="max-w-2xl mx-auto mt-10 text-xs text-center" style={{ color: "rgba(168,193,248,0.7)" }}>
          {t("investment.disclaimer")}
        </p>
      </div>
    </section>
  )
}

/* -------------------- PROCESS -------------------- */
function Process() {
  const t = useFranchiseT("process")
  const steps = t("process.steps", { returnObjects: true }) || []

  return (
    <section id="process" className="py-24" style={{ background: C.bg }}>
      <div className="absolute inset-0 opacity-50 pointer-events-none au-hero-grid" />
      <div className="mx-auto max-w-[1490px] px-5">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <SectionLabel>{t("process.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("process.titleLine1")}
            <br />
            <span className="au-stamp-font" style={{ color: C.red }}>{t("process.titleLine2")}</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 mt-14 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="relative transition-all duration-300 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="text-5xl au-display-font" style={{ color: `${C.red}30` }}>{s.n}</div>
              <h3 className="au-nav-font mt-2 text-base uppercase tracking-[0.1em]" style={{ color: C.navy }}>{s.t}</h3>
              <p className="au-copy-sm mt-2" style={{ color: C.deepBlue }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------- TESTIMONIAL -------------------- */
function Testimonial() {
  const t = useFranchiseT("testimonial")

  return (
    <section className="py-20" style={{ background: C.navy }}>
      <div className="max-w-4xl px-5 mx-auto text-center">
        <motion.div {...fadeUp}>
          <div className="text-6xl leading-none au-display-font" style={{ color: C.red }}>
            {t("testimonial.quoteMark")}
          </div>
          <p className="mt-2 au-display-font text-[clamp(1.1rem,3vw,1.9rem)] leading-snug text-white">
            {t("testimonial.quote")}
          </p>
          <div className="mt-6 text-sm tracking-widest au-nav-font" style={{ color: C.muted }}>
            {t("testimonial.attribution")}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- FAQ -------------------- */
function FAQ() {
  const t = useFranchiseT("faq")
  const apiFaqs = useFranchiseFaqs()
  const fallbackFaqs = t("faq.items", { returnObjects: true }) || []
  const cmsFaqs = (Array.isArray(apiFaqs) ? apiFaqs : Array.isArray(apiFaqs?.results) ? apiFaqs.results : [])
    .filter((faq) => faq.is_active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((faq) => ({ q: faq.question, a: faq.answer }))
  const faqs = cmsFaqs.length ? cmsFaqs : fallbackFaqs

  return (
    <section id="faq" className="py-24" style={{ background: C.bgWhite }}>
      <div className="max-w-4xl px-5 mx-auto">
        <motion.div className="text-center" {...fadeUp}>
          <SectionLabel>{t("faq.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("faq.titleLine1")} <span className="au-stamp-font" style={{ color: C.red }}>{t("faq.titleLine2")}</span>
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 overflow-hidden rounded-2xl"
          style={{ border: `1px solid ${C.border}` }}
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {faqs.map((f, i) => (
            <details key={f.q} className="group" style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <summary className="flex items-center justify-between gap-4 p-6 list-none cursor-pointer">
                <span className="au-nav-font text-base uppercase tracking-[0.08em]" style={{ color: C.navy }}>
                  {f.q}
                </span>
                <span
                  className="grid flex-none w-8 h-8 text-sm font-bold transition-transform rounded-full place-items-center group-open:rotate-45"
                  style={{ border: `1.5px solid ${C.red}`, color: C.red }}
                >
                  +
                </span>
              </summary>
              <p className="au-copy-sm px-6 pb-6" style={{ color: C.deepBlue }}>
                {f.a}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- INQUIRY FORM -------------------- */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function InquiryForm() {
  const t = useFranchiseT("inquiry")
  const settings = useSiteSettings()
  const [status, setStatus] = useState("idle")
  const [form, setForm] = useState({ from_name: "", from_email: "", message: "" })

  const canSubmit = form.from_name.trim().length >= 2 && emailRe.test(form.from_email.trim())

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit || status === "sending") return

    setStatus("sending")
    try {
      const name = form.from_name.trim()
      const email = form.from_email.trim()
      const message = (form.message || "").trim() || t("form.fallbackMessage")

      await postFranchiseInquiry({
        name,
        email,
        message,
      })

      setStatus("success")
    } catch (err) {
      console.error("Franchise inquiry error:", err)
      setStatus("error")
    }
  }

  const fallbackContacts = t("inquiry.contacts", { returnObjects: true }) || []
  const phoneFallback = fallbackContacts.find((contact) => contact.icon === "Phone") || {}
  const emailFallback = fallbackContacts.find((contact) => contact.icon === "Mail") || {}
  const addressFallback = fallbackContacts.find((contact) => contact.icon === "MapPin") || {}
  const callSuffix = `${phoneFallback.label || ""}`.includes("ruf uns an") ? " — Ruf uns an" : " — Call us"
  const phoneLabel = settings.phone_display || settings.phone || `${phoneFallback.label || ""}`.replace(/\s+[—-].*$/, "")
  const contacts = [
    {
      ...phoneFallback,
      icon: "Phone",
      label: `${phoneLabel}${callSuffix}`,
      href: settings.phone ? `tel:${settings.phone}` : phoneFallback.href,
    },
    {
      ...emailFallback,
      icon: "Mail",
      label: settings.email || emailFallback.label,
      href: settings.email ? `mailto:${settings.email}` : emailFallback.href,
    },
    {
      ...addressFallback,
      icon: "MapPin",
      label: settings.address || addressFallback.label,
      href: addressFallback.href || "",
    },
  ]

  return (
    <section id="inquire" className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-60 au-hero-grid" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-[clamp(300px,50vw,560px)] w-[clamp(600px,90vw,1030px)] opacity-50 au-mountain-lines" />

      <div className="relative z-10 mx-auto grid max-w-[1490px] gap-12 px-5 py-24 lg:grid-cols-5">
        <motion.div className="lg:col-span-2" {...fadeUp}>
          <SectionLabel>{t("inquiry.label")}</SectionLabel>
          <h2 className="au-display-font mt-3 text-[clamp(1.5rem,4vw,2.8rem)] uppercase leading-[1.02]" style={{ color: C.navy }}>
            {t("inquiry.titleLine1")}
            <br />
            <span className="au-stamp-font" style={{ color: C.red }}>{t("inquiry.titleLine2")}</span>
          </h2>

          <p className="au-copy mt-6" style={{ color: C.deepBlue }}>
            {t("inquiry.lead")}
          </p>

          <div className="mt-10 space-y-4 text-sm">
            {contacts.map((c) => {
              const Icon = c.icon === "Phone" ? Phone : c.icon === "Mail" ? Mail : MapPin
              return (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="grid w-10 h-10 rounded-full place-items-center" style={{ background: `${C.red}15` }}>
                    <Icon className="w-4 h-4" style={{ color: C.red }} />
                  </span>
                  {c.href ? (
                    <a href={c.href} className="font-semibold hover:underline" style={{ color: C.navy }}>
                      {c.label}
                    </a>
                  ) : (
                    <span className="font-semibold" style={{ color: C.navy }}>
                      {c.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="p-5 mt-8 rounded-3xl" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
            <Kicker>{t("inquiry.cardKicker")}</Kicker>
            <div className="mt-1 text-2xl uppercase au-display-font" style={{ color: C.navy }}>
              {t("inquiry.cardTitle")}
            </div>
            <p className="au-copy-sm mt-1" style={{ color: C.deepBlue }}>
              {t("inquiry.cardBody")}
            </p>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-3" {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }}>
          <div className="p-8 shadow-2xl rounded-3xl sm:p-10" style={{ background: C.bgWhite, border: `1px solid ${C.border}` }}>
            {status === "success" ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="grid w-16 h-16 rounded-full place-items-center" style={{ background: `${C.red}15` }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: C.red }} />
                </div>
                <h3 className="mt-5 text-3xl uppercase au-display-font" style={{ color: C.navy }}>
                  {t("inquiry.successTitle")}
                </h3>
                <p className="au-copy mt-3 max-w-md" style={{ color: C.deepBlue }}>
                  {t("form.successBody")}
                </p>
                <BtnRed onClick={() => setStatus("idle")} className="mt-6">
                  {t("inquiry.successCta")}
                </BtnRed>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-5">
                  <div>
                    <label className="au-kicker block text-[0.72rem]" style={{ color: `${C.navy}cc` }}>
                      {t("form.nameLabel")}
                    </label>
                    <input
                      className="mt-2 h-12 w-full rounded-md border px-4 text-[0.95rem] outline-none transition"
                      style={{ borderColor: C.border, color: C.navy }}
                      value={form.from_name}
                      onChange={(e) => setForm((s) => ({ ...s, from_name: e.target.value }))}
                      placeholder={t("form.namePlaceholder")}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="au-kicker block text-[0.72rem]" style={{ color: `${C.navy}cc` }}>
                      {t("form.emailLabel")}
                    </label>
                    <input
                      className="mt-2 h-12 w-full rounded-md border px-4 text-[0.95rem] outline-none transition"
                      style={{ borderColor: C.border, color: C.navy }}
                      value={form.from_email}
                      onChange={(e) => setForm((s) => ({ ...s, from_email: e.target.value }))}
                      placeholder={t("form.emailPlaceholder")}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="au-kicker block text-[0.72rem]" style={{ color: `${C.navy}cc` }}>
                      {t("form.messageLabel")}
                    </label>
                    <textarea
                      className="mt-2 min-h-[120px] w-full resize-y rounded-md border px-4 py-3 text-[0.95rem] outline-none transition"
                      style={{ borderColor: C.border, color: C.navy }}
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

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 h-[clamp(48px,6vw,53px)] px-8 rounded-[24px] text-sm font-bold uppercase tracking-wide text-white transition duration-300 ease-out hover:-translate-y-1 w-full"
                    style={{ background: C.red, opacity: !canSubmit || status === "sending" ? 0.6 : 1 }}
                    disabled={!canSubmit || status === "sending"}
                  >
                    {status === "sending" ? t("form.submitting") : <>{t("form.submit")} <ArrowRight className="w-4 h-4" /></>}
                  </button>

                  <p className="au-copy-sm text-center text-xs" style={{ color: `${C.deepBlue}80` }}>
                    {t("inquiry.privacy")}
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* helpers below unchanged (kept) */
function Field({ label, name, type, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-xs tracking-widest uppercase au-nav-font" style={{ color: C.navy }}>
        {label}
      </label>
      <Input id={name} name={name} type={type || "text"} placeholder={placeholder} required={required} className="mt-0" />
    </div>
  )
}
function SelectField({ label, name, options, placeholder }) {
  const [val, setVal] = useState("")
  return (
    <div>
      <div className="block mb-2 text-xs tracking-widest uppercase au-nav-font" style={{ color: C.navy }}>
        {label}
      </div>
      <input type="hidden" name={name} value={val} />
      <Select value={val} onValueChange={setVal}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

const FranchiseCmsContext = createContext(null)

function useFranchiseT(sectionKey) {
  const page = useContext(FranchiseCmsContext)
  const { t, i18n } = useTranslation("franchise")
  return getSectionTranslator(page, sectionKey, t, i18n.language)
}
