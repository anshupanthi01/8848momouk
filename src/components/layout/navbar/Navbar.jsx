import { EXTERNAL_LINKS } from "@/lib/links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "@/assets/8848logo.jpeg";

const NAVY = "text-[#21408e]";
const RED = "text-[#de1d3d]";
const DUMMY_PHONE = "0000 000 000";
const DUMMY_PHONE_HREF = "tel:0000000000";

const navItems = [
  { key: "home", href: "/" },
  // { key: "menu", href: "/menu/" },
  // { key: "gallery", href: "/gallery/" },
  // { key: "events", href: "#" },
  // { key: "rewards", href: "#" },
  // { key: "stuff", href: "#" },
  { key: "franchise", href: "/franchise/" },
  // { key: "careers", href: "#" },
  { key: "about", href: "/about-us/" },
];

const leftNavItems = navItems.slice(0, 5);
const rightNavItems = navItems.slice(5);

export default function Navbar() {
  const { t } = useTranslation("navbar");
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  const isActive = (item) =>
    item.key === "home"
      ? pathname === "/"
      : pathname === item.href.replace(/\/$/, "");

  const isExternal = (href) => /^https?:\/\//.test(href);

  return (
    <header className="relative z-50 w-full bg-[#edf2ff] au-body-font">
      <div className="mx-auto max-w-[1490px] px-5 sm:px-8">
        {/* Top row */}
        <div className="grid h-[64px] grid-cols-[auto_1fr_auto] items-center gap-3 lg:flex lg:h-[88px] lg:justify-between">
          {/* Left: phone + socials (desktop odey) */}
          <div className="hidden items-center gap-5 lg:flex">
            <div className="flex items-center gap-2">
              <a
                href={DUMMY_PHONE_HREF}
                className={`${NAVY} au-nav-font text-[1.14rem] uppercase hover:text-[#de1d3d] transition-colors`}
              >
                {DUMMY_PHONE}
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/8848MomoHouseFrankfurt"
                target="_blank"
                rel="noreferrer"
                className="grid h-5 w-5 place-items-center text-[#de1d3d]"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://www.instagram.com/8848momohouse/"
                target="_blank"
                rel="noreferrer"
                className="grid h-5 w-5 place-items-center text-[#de1d3d]"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://www.youtube.com/@momohouse-js7gp"
                target="_blank"
                rel="noreferrer"
                className="grid h-5 w-5 place-items-center text-[#de1d3d]"
                aria-label="YouTube"
                title="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Logo (mobile left; desktop centered by flex layout) */}
          <a
            href="/"
            className="col-start-1 flex items-center justify-start mt-0 lg:mt-6 lg:-translate-y-1 lg:justify-center"
          >
            <img
              src={logo}
              alt="8848 Momo House"
              className="h-[clamp(3rem,10vw,5.35rem)] w-auto object-contain"
            />
          </a>

          {/* Mobile: phone number centered in top row */}
          <a
            href={DUMMY_PHONE_HREF}
            className="col-start-2 flex items-center justify-center lg:hidden"
            aria-label="Call 8848 Momo House"
          >
            <span className={`${NAVY} au-nav-font text-[1.05rem] uppercase`}>
              {DUMMY_PHONE}
            </span>
          </a>

          {/* Right: order button */}
          <div className="hidden items-center gap-3 lg:flex">
            <a href={EXTERNAL_LINKS.order} target="_blank" rel="noreferrer">
              <Button className="h-9 rounded-2xl bg-[#de1d3d] px-6 text-sm font-bold tracking-wide hover:bg-[#c51625]">
                {t("orderOnline")}
              </Button>
            </a>
          </div>

          {/* Mobile: hamburger menu (right) */}
          <div className="col-start-3 flex justify-end lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="border-[#de1d3d]/30 bg-white text-[#de1d3d] shadow-sm hover:bg-[#de1d3d] hover:text-white"
                  aria-label={t("mobile.menu")}
                >
                  <span className="grid gap-1" aria-hidden="true">
                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                    <span className="block h-0.5 w-5 rounded-full bg-current" />
                  </span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[min(86vw,340px)] border-l border-[#de1d3d]/15 bg-white px-5 py-6 shadow-2xl overflow-y-auto max-h-screen"
              >
                <div className="flex flex-col items-start border-b border-[#21408e]/10 pb-5">
                  <div className="border-[3px] border-[#de1d3d] px-2.5 py-1 text-2xl font-black leading-none text-[#de1d3d]">
                    8848
                  </div>
                  <div className="mt-1 text-xs font-extrabold tracking-[0.28em] text-[#de1d3d]">
                    MOMO HOUSE
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a href={EXTERNAL_LINKS.order} target="_blank" rel="noreferrer">
                    <Button className="w-full bg-[#de1d3d] font-extrabold tracking-wide hover:bg-[#c51625]">
                      {t("orderOnline")}
                    </Button>
                  </a>

                  <div className="mt-4 h-px bg-[#21408e]/10" />

                  {navItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      target={isExternal(item.href) ? "_blank" : undefined}
                      rel={isExternal(item.href) ? "noreferrer" : undefined}
                      className={[
                        "au-nav-font w-full border-b border-[#21408e]/10 py-3 text-[1.36rem] uppercase transition-colors hover:text-[#de1d3d]",
                        isActive(item) ? "text-[#de1d3d]" : "text-[#21408e]",
                      ].join(" ")}
                    >
                      {t(`links.${item.key}`)}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Second row: nav links (desktop odey) */}
        <nav className="hidden h-[60px] items-center justify-between lg:flex">
          <div className="flex gap-7 lg:gap-8">
            {leftNavItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={isExternal(item.href) ? "_blank" : undefined}
                rel={isExternal(item.href) ? "noreferrer" : undefined}
                className={[
                  "relative au-nav-font text-[1.62rem] uppercase leading-none pb-2",
                  "after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:bg-[#de1d3d]",
                  "after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  isActive(item) ? RED : NAVY,
                ].join(" ")}
              >
                {t(`links.${item.key}`)}
              </a>
            ))}
          </div>

          <div className="flex gap-7 lg:gap-8">
            {rightNavItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={isExternal(item.href) ? "_blank" : undefined}
                rel={isExternal(item.href) ? "noreferrer" : undefined}
                className={[
                  "relative au-nav-font text-[1.52rem] uppercase leading-none pb-2",
                  "after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:bg-[#de1d3d]",
                  "after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  isActive(item) ? RED : NAVY,
                ].join(" ")}
              >
                {t(`links.${item.key}`)}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
