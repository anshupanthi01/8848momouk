import MomoFlipBook from "@/components/MomoFlipBook";
import { EXTERNAL_LINKS } from "@/lib/links";
import {
  getMenuPageSources,
  getPageSectionContent,
  useCurrentMenu,
  useHomePage,
} from "@/lib/cms";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HAND_MOMO = "/8848-assets/hand-momo.png";
const HOM_BADGE = "/8848-assets/hom-badge.jpeg";
const EVEREST_BADGE = "/8848-assets/mount-everest-nepal-8848.png";

export default function HeroReplica() {
  const { t, i18n } = useTranslation("home");
  const homePage = useHomePage();
  const hero = getPageSectionContent(
    homePage,
    "hero",
    {
      kicker: t("hero.kicker"),
      title1: t("hero.title1"),
      title2: t("hero.title2"),
      desc: t("hero.desc"),
      ctaMenu: t("hero.ctaMenu"),
      ctaOrder: t("hero.ctaOrder"),
      orderUrl: EXTERNAL_LINKS.order,
      handImage: HAND_MOMO,
      handAlt: "Hand holding momo",
      badgeImage: HOM_BADGE,
      everestImage: EVEREST_BADGE,
    },
    i18n.language,
  );
  const menu = useCurrentMenu();
  const menuPages = getMenuPageSources(menu);
  const [menuOpen, setMenuOpen] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 16 });
  const y = useSpring(my, { stiffness: 90, damping: 16 });
  const rotate = useTransform(x, [-40, 40], [-5, 5]);

  const updateFromPoint = (clientX, clientY, el) => {
    const r = el.getBoundingClientRect();
    // Bigger divisor = less movement. Smaller divisor = more movement.
    const divisor = window.innerWidth < 768 ? 6 : 10;

    mx.set(
      Math.max(-40, Math.min(40, (clientX - (r.left + r.width / 2)) / divisor)),
    );
    my.set(
      Math.max(-40, Math.min(40, (clientY - (r.top + r.height / 2)) / divisor)),
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#edf2ff] au-body-font">
      <div className="absolute inset-0 pointer-events-none opacity-60 au-hero-grid" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-[clamp(300px,50vw,560px)] w-[clamp(600px,90vw,1030px)] opacity-70 au-mountain-lines" />

      <div className="relative z-10 mx-auto grid max-w-[1490px] grid-cols-1 gap-10 px-5 pt-[clamp(32px,6vw,96px)] lg:grid-cols-[minmax(320px,560px)_1fr]">
        <motion.div
          className="relative z-10 w-full max-w-full text-center lg:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.215, 0.61, 0.355, 1] }}
        >
           <div className="text-[0.82rem] font-extrabold uppercase tracking-[0.18em] text-[#de1d3d] md:tracking-[0.12em]">
            {hero.kicker}
          </div>

          <h1 className="au-display-font mx-auto mt-5 max-w-[431px] text-[clamp(2.25rem,7.4vw,4.375rem)] uppercase leading-none text-[#21408e] sm:max-w-none lg:mx-0">
            <span className="block sm:whitespace-nowrap">{hero.title1}</span>
            <span className="au-stamp-font mt-1 block text-[#de1d3d] md:whitespace-nowrap">
              {hero.title2}
            </span>
          </h1>

          <p className="mx-auto mt-6 w-full max-w-[540px] text-[18px] font-normal leading-[1.7] text-[#26367c] lg:mx-0">
            {hero.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 lg:justify-start">
            <button
              className="h-[clamp(48px,6vw,53px)] w-[clamp(160px,30vw,190px)] rounded-[24px] bg-[#de1d3d] px-8 text-sm font-bold uppercase tracking-wide text-white transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#c51625]"
              onClick={() => setMenuOpen(true)}
            >
              {hero.ctaMenu}
            </button>
            <a href={EXTERNAL_LINKS.order} target="_blank" rel="noreferrer">
              <span className="inline-flex h-[clamp(48px,6vw,53px)] w-[clamp(160px,30vw,190px)] items-center justify-center rounded-[24px] bg-[#21408e] px-8 text-center text-sm font-bold uppercase leading-[0.95] tracking-wide text-white transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#162347]">
                {hero.ctaOrder}
              </span>
            </a>
          </div>

          <div className="mt-2 hidden w-[150px] lg:block">
            <img
              src={hero.everestImage || EVEREST_BADGE}
              alt="Mount Everest Nepal 8848m"
              className="h-auto w-[150px] opacity-45"
              loading="lazy"
            />
          </div>
        </motion.div>

        <div
          className="relative flex min-h-[clamp(220px,40vw,505px)] items-end justify-center lg:justify-end"
          onPointerMove={(e) =>
            updateFromPoint(e.clientX, e.clientY, e.currentTarget)
          }
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          onPointerUp={() => {
            mx.set(0);
            my.set(0);
          }}
          onTouchMove={(e) => {
            const t = e.touches?.[0];
            if (!t) return;
            updateFromPoint(t.clientX, t.clientY, e.currentTarget);
          }}
          onTouchEnd={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          {/* Badge (hidden on mobile, behind hand on tablet/desktop)
          <motion.img
            src={HOM_BADGE}
            alt=""
            aria-hidden="true"
            className="hidden md:block absolute right-[8%] bottom-[25%] z-[1] h-[clamp(120px,18vw,260px)] w-[clamp(120px,18vw,260px)] rotate-[-12deg] rounded-full object-cover opacity-25 mix-blend-multiply"
            initial={{ opacity: 0, rotate: -18, scale: 0.96 }}
            animate={{ opacity: 0.25, rotate: -12, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.215, 0.61, 0.355, 1] }}
          /> */}

          <motion.img
            src={hero.badgeImage}
            alt=""
            aria-hidden="true"
            className="
    absolute right-[4%] bottom-[26%] z-[1]
    h-[clamp(130px,28vw,220px)] w-[clamp(130px,28vw,220px)]
    md:right-[6%] md:bottom-[54%]
    md:h-[clamp(170px,24vw,340px)] md:w-[clamp(170px,24vw,340px)]
    rotate-[-4deg] rounded-full object-cover opacity-15 mix-blend-multiply
  "
            initial={{ opacity: 0, rotate: -14, scale: 0.96 }}
            animate={{ opacity: 0.15, rotate: -4, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.215, 0.61, 0.355, 1] }}
          />

          {/* Hand image (in front) */}
          <motion.img
            src={hero.handImage}
            alt={hero.handAlt}
            className="relative z-10 w-[clamp(220px,45vw,450px)] translate-x-[-18px] drop-shadow-2xl lg:absolute lg:bottom-0 lg:right-[12px] lg:translate-x-0"
            loading="eager"
            style={{ x, y, rotate, willChange: "transform" }}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: [22, 0, -8, 0], scale: 1 }}
            transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
          />
        </div>
      </div>
      <MomoFlipBook
        pages={menuPages}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </section>
  );
}
