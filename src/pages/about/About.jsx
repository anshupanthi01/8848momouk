import InstagramSection from "@/pages/home/sections/InstagramSection";
import YakClubSection from "@/pages/home/sections/YakClubSection";
import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getSectionTranslator, useAboutPage } from "@/lib/cms";

const IMG = {
  intro: "/8848-assets/8848-Momo-House-About-Us.png.webp",
  brass: "/8848-assets/momo-brass-bowl.png",
  nepal: "/8848-assets/Once-Upon-a-Time-in-Nepal-1.jpg.webp",
  hands: "/8848-assets/Nepalese-Woman-Hands-1.jpg.webp",
  // needed because first code uses these:
  goodTimesImg: "/8848-assets/good-times-tasty-food.png",
  yak: "/8848-assets/yak-club.png.webp",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0 },
};

const AboutCmsContext = createContext(null);

function useAboutT(sectionKey) {
  const page = useContext(AboutCmsContext);
  const { t, i18n } = useTranslation("about");
  return getSectionTranslator(page, sectionKey, t, i18n.language);
}

function PageHero() {
  const t = useAboutT("hero");

  return (
    <section className="relative overflow-hidden bg-[#edf2ff] au-body-font">
      <div className="absolute inset-0 pointer-events-none au-about-lines opacity-95" />
      <div className="relative mx-auto flex min-h-[200px] max-w-[1180px] flex-col items-center justify-center px-5 pb-12 pt-10 text-center md:min-h-[285px] md:pb-14 md:pt-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="au-kicker">{t("hero.kicker")}</div>
          <h1 className="au-display-font mx-auto mt-6 max-w-[431px] text-[clamp(2.25rem,7.4vw,4.375rem)] uppercase leading-none text-[#21408e] sm:max-w-none">
            {t("hero.title1")}
            <span className="au-stamp-font block text-[#de1d3d]">
              {t("hero.title2")}
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

function SplitIntro() {
  const t = useAboutT("splitIntro");

  return (
    <section className="relative overflow-hidden bg-white au-body-font">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px] au-hero-grid opacity-80" />
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-12 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:py-20">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex justify-center md:justify-start"
        >
          <motion.img
            src={IMG.intro}
            alt={t("splitIntro.imageAlt")}
            className="w-[min(88vw,390px)] drop-shadow-2xl md:w-[455px]"
            whileHover={{ x: 8, y: -6 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          />
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-center md:text-left"
        >
          <h2 className="au-display-font mx-auto max-w-[310px] text-[2.28rem] uppercase leading-[0.96] text-[#21408e] md:mx-0 md:max-w-none md:text-[4.25rem]">
            {t("splitIntro.title1")}
            <span className="block text-[#de1d3d]">
              {t("splitIntro.title2")}
            </span>
          </h2>
          <p className="au-copy-strong mx-auto mt-7 max-w-[300px] md:mx-0 md:max-w-[570px]">
            {t("splitIntro.p1")}
          </p>
          <p className="au-copy mx-auto mt-5 max-w-[300px] md:mx-0 md:max-w-[590px]">
            {t("splitIntro.p2")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HomSection() {
  const t = useAboutT("hom");

  return (
    <section className="overflow-hidden bg-[#edf2ff] au-body-font">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-12 md:grid-cols-[1fr_0.92fr] md:gap-14 md:py-18">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="order-2 md:order-1"
        >
          {/* leaving this block as-is style-wise; your “first code” doesn’t have this exact element */}
          <img
            src={IMG.goodTimesImg}
            alt={t("hom.script")}
            className="mx-auto mt-8 h-auto w-[min(60vw,190px)] -translate-y-2 md:mx-0 md:w-[clamp(200px,16vw,280px)] md:-translate-y-3"
            loading="lazy"
          />

          <h2 className="au-display-font mx-auto max-w-[340px] text-center text-[2.9rem] uppercase leading-none text-[#21408e] md:mx-0 md:max-w-none md:text-left md:text-[4.65rem]">
            {t("hom.title")}
          </h2>

          <p className="au-copy mx-auto mt-7 max-w-[300px] text-center md:mx-0 md:max-w-[650px] md:text-left">
            {t("hom.p1")}
          </p>
          <p className="au-copy mx-auto mt-5 max-w-[300px] text-center md:mx-0 md:max-w-[650px] md:text-left">
            {t("hom.p2")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex justify-center order-1 md:order-2 md:justify-end"
        >
          <motion.img
            src={IMG.brass}
            alt={t("hom.imageAlt")}
            className="w-[min(82vw,390px)] drop-shadow-xl md:w-[445px]"
            whileHover={{ x: -8, y: -6 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
  const t = useAboutT("story");

  return (
    <section className="bg-white au-body-font">
      <div className="mx-auto max-w-[1180px] px-5 py-14 md:py-20">
        {/* Heading box */}
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          {/* <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <h2 className="au-display-font mx-auto max-w-[340px] text-[2.35rem] uppercase center leading-[0.98] text-white md:mx-0 md:max-w-none md:text-[4.1rem]">
              <span className="inline-block rounded-md border border-[#de1d3d] center border-b-[4px] bg-[#26367c] px-3 py-2">
                {t("story.title1")}
                <span className="block text-[#de1d3d]">{t("story.title2")}</span>
                <span className="mt-4 block text-[1rem] font-extrabold leading-8 text-white/90 normal-case">
                  {t("story.lead")}
                </span>
              </span>
            </h2>
          </motion.div> */}
        </div>

        {/* Story block 1 */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="relative mx-auto w-full max-w-[520px] md:max-w-none"
          >
            <div className="absolute right-[-10px] bottom-[-10px] h-full w-full rounded-md bg-[#21408e]/10" />
            <img
              src={IMG.nepal}
              alt={t("story.imageAlt1")}
              className="relative z-10 object-cover w-full rounded-md shadow-xl"
            />
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="au-copy space-y-5"
          >
            <p className="au-kicker text-[#de1d3d]">{t("story.once")}</p>
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <p>{t("story.p3")}</p>
          </motion.div>
        </div>

        {/* Story block 2 */}
        <div className="mt-12 grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="au-copy order-2 space-y-5 md:order-1"
          >
            {/* if you have more story paragraphs in translations you can add keys here.
                keeping structure the same as your 2nd file for now. */}
            <p>{t("story.p4")}</p>
            <p>{t("story.p5")}</p>
            <p>{t("story.p6")}</p>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="order-1 relative mx-auto w-full max-w-[520px] md:order-2 md:max-w-none"
          >
            <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-md bg-[#21408e]/10 md:translate-x-[10px] md:translate-y-[10px]" />
            <img
              src={IMG.hands}
              alt={t("story.imageAlt2")}
              className="relative z-10 object-cover w-full rounded-md shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const aboutPage = useAboutPage();

  return (
    <AboutCmsContext.Provider value={aboutPage}>
      <div className="bg-white">
        <PageHero />
        <SplitIntro />
        <HomSection />
        <StorySection />
        <InstagramSection />
        <YakClubSection />
      </div>
    </AboutCmsContext.Provider>
  );
}
