import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPageSectionContent, useHomePage } from "@/lib/cms";

const plateImg = "/8848-assets/momo-brass-bowl.png";
const goodTimesImg = "/8848-assets/good-times-tasty-food.png";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function MomosteSection() {
  const { t, i18n } = useTranslation("home");
  const homePage = useHomePage();

  const fallback = {
    plateAlt: t("momoste.plateAlt"),
    image: plateImg,
    title: t("momoste.title"), // <-- MOMOSTE!
    subtitle: t("momoste.subtitle"), // <-- Good times and tasty food!
    body: t("momoste.body"),
    whyTitle: t("momoste.whyTitle"),
    whyBody: t("momoste.whyBody"),
    noteEmph: t("momoste.noteEmph"),
    noteRest: t("momoste.noteRest"),
  };

  const momoste = getPageSectionContent(
    homePage,
    "momoste",
    fallback,
    i18n.language,
  );

  const sectionRef = useRef(null);
  const [deg, setDeg] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);

        // rotate slowly while scrolling through the section
        setDeg(progress * 120); // change 120 to 180/220 for more rotation
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden au-body-font">
      <div
        className="pointer-events-none absolute inset-0 top-1 z-0 bg-left-top bg-contain bg-no-repeat"
        style={{
          backgroundImage:
            "url('/8848-assets/Light-Mountain-Watermark-Top.png')",
        }}
      />

      <div className="relative z-10 max-w-6xl px-4 mx-auto py-14 sm:px-6 md:py-20">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(300px,500px)_1fr] md:gap-8">
          {/* Plate */}
          <div className="relative flex items-center justify-center order-1 md:order-none">
            <img
              src={momoste.image || fallback.image}
              alt={momoste.plateAlt || fallback.plateAlt}
              className="relative w-[clamp(380px,90vw,860px)] drop-shadow-[0_25px_45px_rgba(0,0,0,0.30)] md:w-[clamp(520px,46vw,980px)]"
              loading="lazy"
              style={{
                transform: `rotate(${deg}deg)`,
                transition: "transform 260ms ease-out",
                willChange: "transform",
              }}
            />
          </div>

          {/* Copy (UNCHANGED, your text will show) */}
          <div className="order-2 text-center md:order-none md:text-left">
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:gap-4">
              <h2 className="au-display-font text-[clamp(3.4375rem,8vw,4.375rem)] uppercase leading-none text-[#21408e]">
                <span className="au-momoste-title">
                  {momoste.title || fallback.title}
                  <span className="au-momoste-splash" aria-hidden="true" />
                </span>
              </h2>

              <img
                src={goodTimesImg}
                alt={momoste.subtitle || fallback.subtitle}
                className="h-auto w-[min(60vw,190px)] md:w-[clamp(260px,22vw,390px)]"
                loading="lazy"
              />
            </div>

            <p className="mx-auto mt-6 max-w-xl text-[18px] font-normal leading-[1.7] text-[#26367c] md:mx-0">
              {momoste.body || fallback.body}
            </p>

            <div className="mt-8 border border-[#21408e]/10 bg-[#edf2ff] p-5 text-left shadow-sm sm:p-6">
              <div className="border-l-8 border-[#de1d3d] pl-5">
                <div className="text-base font-black text-[#21408e]">
                  {momoste.whyTitle || fallback.whyTitle}
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#21408e]/75">
                  {momoste.whyBody || fallback.whyBody}
                </p>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-7 text-[#21408e]/70 md:mx-0">
              <span className="font-black text-[#21408e]">
                {momoste.noteEmph || fallback.noteEmph}
              </span>{" "}
              {momoste.noteRest || fallback.noteRest}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
