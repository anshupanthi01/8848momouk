import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { getPageSectionContent, useHomePage } from "@/lib/cms"

const rootsImg = "/8848-assets/jhol_Momo.png"

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function RootsSection() {
  const { t, i18n } = useTranslation("home")
  const homePage = useHomePage()
  const roots = getPageSectionContent(
    homePage,
    "roots",
    {
      imageAlt: t("roots.imageAlt"),
      title1: t("roots.title1"),
      title2: t("roots.title2"),
      lead: t("roots.lead"),
      body: t("roots.body"),
      ctaMenu: t("roots.ctaMenu"),
      href: "/menu",
      image: rootsImg,
      badgeImage: "/8848-assets/Eighty-eight-Forty-Eight-Hom-Pyashi-Badge-Colour-Watermark.png",
      concreteBackground: "/8848-assets/Concrete-Background.jpg",
      columnBackground: "/8848-assets/Column-white-background-grunge.png",
    },
    i18n.language,
  )
  const sectionRef = useRef(null)
  const [offsetX, setOffsetX] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1)
        const wiggle = Math.sin(progress * Math.PI * 2) * 10
        setOffsetX(wiggle)
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden au-body-font"
      style={{
        backgroundImage: `url('${roots.concreteBackground}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={roots.badgeImage}
          alt=""
          className="absolute left-1 top-1 z-10 w-44 sm:w-32 md:w-40 lg:w-52 opacity-95"
          loading="lazy"
        />

        <div
          className="absolute inset-x-0 top-0 h-1/2 bg-cover bg-center lg:inset-y-0 lg:left-0 lg:top-0 lg:h-full lg:w-1/2"
          style={{ backgroundImage: `url('${roots.concreteBackground}')` }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-no-repeat bg-right bg-cover lg:inset-y-0 lg:left-130 lg:h-full lg:w-1/2 lg:bg-contain"
          style={{ backgroundImage: `url('${roots.columnBackground}')` }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-10">
          <div className="order-1 mx-auto w-full max-w-[600px] text-center lg:order-none lg:max-w-none lg:text-left">
            <h2 className="mx-auto max-w-[14ch] text-[clamp(2rem,6vw,3.4rem)] font-bold uppercase leading-[0.98] text-[#21408e] lg:mx-0">
              {roots.title1}
            </h2>
            <span className="block au-stamp-font text-[clamp(2rem,6vw,3.4rem)] text-[#de1d3d]">
              {roots.title2}
            </span>

            <p className="mx-auto mt-5 max-w-xl text-[clamp(1rem,2.2vw,1.08rem)] font-bold leading-8 text-[#21408e] lg:mx-0">
              {roots.lead}
            </p>

            <p className="mx-auto mt-4 max-w-xl text-[clamp(0.95rem,2vw,1rem)] font-medium leading-7 text-[#21408e]/80 lg:mx-0">
              {roots.body}
            </p>

            <div className="mt-7">
              <Button
                className="h-11 bg-[#de1d3d] px-10 font-extrabold tracking-wide hover:bg-[#c51625]"
                onClick={() => (window.location.href = roots.href || "/menu")}
              >
                {roots.ctaMenu}
              </Button>
            </div>
          </div>

          <div className="order-2 flex justify-center lg:order-none lg:justify-end">
            <img
              src={roots.image}
              alt={roots.imageAlt}
              className="w-[min(112%,520px)] max-w-none origin-center [--roots-image-scale:1] [--roots-image-y:0px] lg:[--roots-image-scale:1.3] lg:[--roots-image-y:36px]"
              style={{
                transform: `translateX(${offsetX}px) translateY(var(--roots-image-y)) scale(var(--roots-image-scale))`,
                transition: "transform 60ms linear",
                willChange: "transform",
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
