import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import { useTranslation } from "react-i18next"
import { getMenuPageSources, useCurrentMenu } from "@/lib/cms";
const MenuShowcase = () => {
  const menu = useCurrentMenu()
  const menuPages = getMenuPageSources(menu)
  const { t } = useTranslation("menu")
  const slides = useMemo(
    () =>
      menuPages.map((src, i) => ({
        src,
        title: menu?.pages?.[i]?.title || menu?.lightbox_title || "8848 Momo House",
        description: menu?.pages?.[i]?.description || menu?.lightbox_description || "Premium Nepalese fusion menu",
      })),
    [menuPages, menu]
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#edf2ff] ">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#D72638]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[#1D3557]/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* HERO */}
     <section className="relative z-10 px-6 pt-16 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-[Inter] text-sm uppercase tracking-[0.3em] text-red-500">
          {menu?.kicker || t("hero.kicker")}
        </p>

        <h1 className="mt-4 font-['Poppins','sans-serif'] text-5xl font-bold uppercase tracking-wide sm:text-6xl lg:text-7xl">
          {menu?.title || t("hero.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl font-['Cormorant_Garamond'] text-lg text-[#26367c] sm:text-xl">
          {menu?.subtitle || t("hero.subtitle")}
        </p>
      </div>
    </section>

      {/* MENU GALLERY */}
      <section className="relative z-10 px-4 pb-24 mt-10 sm:px-10 lg:px-20">
        <div className="flex flex-col max-w-5xl gap-16 mx-auto sm:gap-20">
          {menuPages.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative mx-auto w-full max-w-[860px]"
            >
              <div className="absolute -inset-4 rounded-[28px] bg-[#D72638]/10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
              <button
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E1E] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.015]"
              >
                <img
                  src={src}
                  alt={`Menu page ${i + 1}`}
                  className="object-cover w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 text-xs uppercase tracking-[0.3em] text-white/70">
                  <span>Menu Page {i + 1}</span>
                  <span className="text-[#C8A96B]">Tap to Zoom</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 py-12 text-center border-t border-white/10 sm:px-12 lg:px-24">
        <h3 className="au-nav-font text-2xl uppercase tracking-wide">
          {menu?.footer_title || "8848 Momo House"}
        </h3>
        <p className="mt-3 text-sm font-medium text-red-500">
          {menu?.footer_subtitle || "Premium Nepalese fusion - Modern editorial dining experience"}
        </p>
      </footer>

      {/* LIGHTBOX */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Captions]}
        zoom={{
          maxZoomPixelRatio: 2.5,
          zoomInMultiplier: 1.2,
        }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        carousel={{ finite: false }}
        on={{ view: ({ index }) => setIndex(index) }}
      />
    </div>
  );
};

export default MenuShowcase;
