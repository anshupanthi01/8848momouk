import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/cms";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdRestaurantMenu } from "react-icons/md";
import { useTranslation } from "react-i18next";

function TickDivider() {
  return (
    <div className="relative hidden w-14 shrink-0 md:block">
      <div className="absolute inset-y-0 w-px -translate-x-1/2 left-1/2 bg-white/25" />
      <div className="absolute -translate-x-1/2 inset-y-6 left-1/2">
        <div className="flex flex-col justify-between h-full">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className={
                i % 3 === 0 ? "h-px w-6 bg-white/35" : "h-px w-3 bg-white/25"
              }
            />
          ))}
        </div>
      </div>
      <div className="absolute left-1/2 top-6 -translate-x-1/2 -rotate-90 text-xs font-bold tracking-[0.25em] text-white/45">
        8848m
      </div>
    </div>
  );
}

function SocialButton({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid rounded-full h-9 w-9 place-items-center bg-white/10 hover:bg-white/20"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function hasDetailedOpeningHours(value) {
  const hours = `${value || ""}`.trim();
  return /\b(friday|saturday|sunday|monday|tuesday|wednesday|thursday)\b/i.test(hours);
}

function getOpeningHourRows(value) {
  return `${value || ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, ...timeParts] = line.split(/\s+/);
      return {
        day,
        time: timeParts.join(" ") || line,
      };
    });
}

export default function Footer() {
  const { t } = useTranslation("footer");
  const settings = useSiteSettings();
  const contactHref = settings.email
    ? `mailto:${settings.email}`
    : `tel:${settings.phone || "0000000000"}`;
  const phoneHref = settings.phone
    ? `tel:${settings.phone}`
    : "tel:0000000000";
  const phoneDisplay =
    settings.phone_display ||
    settings.phone ||
    t("footerLocation.phoneDisplay");
  const siteName = settings.site_name || "8848 Momo House";
  const openingHours = hasDetailedOpeningHours(settings.opening_hours)
    ? settings.opening_hours
    : t("footerLocation.hoursValue");
  const openingHourRows = getOpeningHourRows(openingHours);

  return (
    <footer
      className="relative overflow-hidden bg-[#21408e] text-white overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 80% 15%, rgba(225,29,46,0.20), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 48px)",
        backgroundSize: "auto, 64px 64px",
      }}
    >
      <div className="absolute inset-0 bg-[#21408e]/92" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] lg:items-start">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="px-3 py-1 text-3xl font-black leading-none border-4 border-white shrink-0">
                8848
              </div>
              <div className="min-w-0 break-words text-sm font-extrabold uppercase tracking-[0.18em] opacity-95 sm:tracking-[0.25em]">
                {siteName.replace(/^8848\s*/i, "")}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 opacity-90">
              <SocialButton href={settings.facebook_url} label="Facebook">
                <FaFacebookF size={14} />
              </SocialButton>
              <SocialButton href={settings.instagram_url} label="Instagram">
                <FaInstagram size={16} />
              </SocialButton>
              <SocialButton href={settings.youtube_url} label="YouTube">
                <FaYoutube size={16} />
              </SocialButton>
            </div>

            <p className="max-w-md mt-6 text-sm font-medium leading-relaxed break-words text-white/80">
              {settings.footer_text || t("leftText")}
            </p>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a href={contactHref} className="min-w-0">
                <Button className="h-11 w-full bg-[#de1d3d] px-6 font-extrabold tracking-wide hover:bg-[#c51625] sm:w-auto">
                  <MdEmail className="mr-2" size={18} />
                  {t("contactUs")}
                </Button>
              </a>
              {settings.order_url && (
                <a href={settings.order_url} className="min-w-0" target="_blank" rel="noreferrer">
                  <Button className="h-11 w-full bg-white px-6 font-extrabold tracking-wide text-[#21408e] hover:bg-white/90 sm:w-auto">
                    <MdRestaurantMenu className="mr-2" size={18} />
                    {t("orderOnline")}
                  </Button>
                </a>
              )}

              <Button
                variant="ghost"
                className="h-11 w-full px-6 font-extrabold tracking-wide text-white hover:bg-white/10 sm:w-auto"
                onClick={() => (window.location.href = "/about-us")}
              >
                {t("moreAboutUs")}
              </Button>
            </div>
          </div>

          <TickDivider />

          {/* RIGHT */}
          <div className="flex flex-col h-full min-w-0">
            <h3 className="text-[clamp(2rem,10vw,3.2rem)] font-black leading-none tracking-tight text-white break-words">
              {t("findYour")}
              <span className="au-stamp-font block mt-2 break-words text-white/90">
                {t("localMomoHouse")}
              </span>
            </h3>

            {/* Bottom-right block */}
            <div className="mt-10 min-w-0 max-w-[420px] lg:mt-auto lg:self-end lg:text-right">
              <div className="min-w-0 space-y-6 text-sm font-semibold text-white/90">
                {/* Location */}
                <div>
                  <div className="flex min-w-0 items-start gap-3 lg:justify-end">
                    <div className="grid w-8 h-8 mt-1 rounded-full place-items-center bg-white/10 shrink-0">
                      <span className="text-[#de1d3d]">&#128205;</span>
                    </div>
                    <div className="min-w-0 break-words">
                      <div className="font-black text-white break-words">
                        {settings.city || t("footerLocation.city")}
                      </div>
                      <div className="break-words text-white/80">
                        {settings.address || t("footerLocation.address")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="min-w-0">
                  <div className="text-white/70">
                    {t("footerLocation.phoneLabel")}
                  </div>
                  <a
                    href={phoneHref}
                    className="font-black text-white break-words hover:text-white/90"
                  >
                    {phoneDisplay}
                  </a>
                </div>

                {/* Hours */}
                <div className="min-w-0">
                  <div className="text-white/70">
                    {t("footerLocation.hoursLabel")}
                  </div>

                  <div className="mt-2 grid w-full max-w-[320px] gap-1.5 text-left lg:ml-auto">
                    {openingHourRows.map(({ day, time }) => (
                      <div
                        key={`${day}-${time}`}
                        className="grid grid-cols-[minmax(6.5rem,1fr)_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-white shadow-sm backdrop-blur-sm"
                      >
                        <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-white/70">
                          {day}
                        </span>
                        <span className="font-black tabular-nums leading-none text-white">
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex min-w-0 flex-col gap-3 border-t border-white/15 pt-6 text-xs font-medium text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="break-words">
            © {new Date().getFullYear()} {siteName}
          </div>
          <div className="flex min-w-0 flex-wrap gap-4">
            <a className="break-words hover:text-white" href={settings.privacy_url || "#"}>
              {t("privacy")}
            </a>
            <a className="break-words hover:text-white" href={settings.terms_url || "#"}>
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
