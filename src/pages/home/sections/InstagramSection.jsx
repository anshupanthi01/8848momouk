import { getPageSectionContent, useHomePage, useSiteSettings } from "@/lib/cms"
import { FaInstagram } from "react-icons/fa"
import { useTranslation } from "react-i18next"

const PROFILE_IMAGE = "/8848-assets/logo-header-crop.png"

export default function InstagramSection() {
  const { i18n } = useTranslation()
  const homePage = useHomePage()
  const settings = useSiteSettings()
  const fallback = {
    handle: "@8848momohouse",
    subtitle: "Nepalese Dumplings & Oriental Fusion",
    button_text: "Follow",
    profile_image: PROFILE_IMAGE,
    profile_alt: "8848 Momo House Instagram",
  }
  const instagram = getPageSectionContent(homePage, "instagram", fallback, i18n.language)
  const href = settings.instagram_url || "https://www.instagram.com/8848momohouse/"

  return (
    <section className="bg-white au-body-font">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-10 md:py-8">
        {/* Left Content */}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center min-w-0 gap-3 group sm:gap-4"
        >
          <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-[#de1d3d] p-2 transition-transform duration-300 group-hover:scale-105 sm:h-[70px] sm:w-[70px]">
            <img
              src={instagram.profile_image || fallback.profile_image}
              alt={instagram.profile_alt || fallback.profile_alt}
              className="object-contain w-full"
              loading="lazy"
            />
          </span>

          <span className="min-w-0">
            <span className="block text-[0.95rem] font-medium text-[#21408e] sm:text-[1.15rem] md:text-[1.25rem]">
              {instagram.handle || fallback.handle}
            </span>

            <span className="mt-1 block text-[0.68rem] leading-snug text-[#21408e]/80 sm:text-[0.78rem] md:text-[0.82rem]">
              {instagram.subtitle || fallback.subtitle}
            </span>
          </span>
        </a>

        {/* Follow Button */}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-md bg-[#b6cbff] px-5 text-[0.76rem] font-medium uppercase tracking-[0.12em] text-[#21408e] transition-colors hover:bg-[#b6cbff] sm:h-[38px] sm:w-auto"
        >
          <FaInstagram size={15} />
          {instagram.button_text || fallback.button_text}
        </a>
      </div>
    </section>
  )
}
