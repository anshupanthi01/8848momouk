"use client";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { getFeaturedGalleryImage, useGalleryImages } from "@/lib/cms";

// ─── Asset path ────────────────────────────────────────────────────────────────
// Keep your original path untouched
const GALLERY_IMAGE = "/gallery/667210978_1365141555644199_8043924957435588798_n.jpg";

// ─── Motion config ─────────────────────────────────────────────────────────────
const EASE_PREMIUM = [0.16, 1, 0.3, 1];

export default function GallerySection() {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const cmsImages = useGalleryImages();
  const featuredImage = getFeaturedGalleryImage(cmsImages, {
    src: GALLERY_IMAGE,
    alt: "8848 Momo House photo gallery",
  });

  // Section entrance
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Subtle parallax — image drifts slightly slower than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  return (
    <section
      ref={sectionRef}
      // Outer section: full bleed, refined vertical rhythm
      className="relative w-full py-10 bg-white sm:py-14 lg:py-20"
      aria-label="Gallery — 8848 Momo House"
    >
      {/*
        ── Constrained container ──────────────────────────────────────────────
        max-w keeps the image from stretching absurdly on ultrawide monitors.
        px gives breathing room from screen edges on desktop.
        mx-auto centers it.
      */}
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">

        {/*
          ── Entrance wrapper — fades + rises on first scroll into view ────────
        */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}

          /*
            ── Image frame ───────────────────────────────────────────────────
            Aspect ratio controls height without fixed px values:
              mobile  → 4/5  (tall, immersive portrait)
              tablet  → 16/9 (balanced widescreen)
              desktop → 21/9 (short cinematic panorama)

            overflow-hidden clips both the parallax image and rounded corners.
            Rounded corners only on sm+ to avoid harsh edges on mobile edge-to-edge.
          */
          className={[
            "relative w-full overflow-hidden",
            "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]",
            "rounded-none sm:rounded-2xl lg:rounded-3xl",
            "shadow-none sm:shadow-xl sm:shadow-black/20",
          ].join(" ")}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >

          {/* ── Parallax image ─────────────────────────────────────────────── */}
          <motion.div
            // Slightly oversized so parallax has room to drift without gaps
            style={{ y }}
            className="absolute inset-0 h-[110%] w-full -top-[5%]"
          >
            <motion.img
              src={featuredImage.src}
              alt={featuredImage.alt || "8848 Momo House photo gallery"}
              loading="lazy"
              // Zoom gently on hover
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.9, ease: EASE_PREMIUM }}
              className="object-cover object-center w-full h-full"
              // Prevent layout shift — tells browser the intrinsic ratio
              width={1280}
              height={610}
            />
          </motion.div>

          {/*
            ── Gradient overlay layers ────────────────────────────────────────
            Layer 1: Base vignette — always on, keeps edges dark and cinematic.
            Layer 2: Hover deepening — intensifies on hover for premium depth.
            Layer 3: Bottom fade — grounds the image, readies space for CTA text.
          */}
          {/* Base vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.28) 100%)",
              ].join(", "),
            }}
          />

          {/* Hover-responsive depth layer */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "rgba(4, 12, 40, 0.22)" }}
          />

          {/* Bottom gradient — keeps bottom legible and premium */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none h-2/5"
            style={{
              background:
                "linear-gradient(to top, rgba(4,10,34,0.60) 0%, rgba(4,10,34,0.18) 60%, transparent 100%)",
            }}
          />

          {/* Top gradient — subtle, prevents harsh bright top edge */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none h-1/4"
            style={{
              background:
                "linear-gradient(to bottom, rgba(4,10,34,0.30) 0%, transparent 100%)",
            }}
          />
      <a
  href="/gallery/"
  aria-label="View Photo Gallery"
  className="absolute inset-0 z-20 block rounded-none group sm:rounded-2xl lg:rounded-3xl"
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>

  <span
    className={[
      "pointer-events-none absolute left-1/2 -translate-x-1/2",
      "bottom-4 sm:bottom-6 lg:bottom-8",
      "inline-flex items-center gap-2",
      "rounded-full px-5 py-2.5 sm:px-6 sm:py-3",
      "bg-white/10 backdrop-blur-md",
      "border border-white/20",
      "text-white text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase",
      "shadow-lg shadow-black/30",
      "whitespace-nowrap",
      "transition-all duration-300 ease-out",
      hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
    ].join(" ")}
  >
    View Gallery

    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>


  <div className="absolute inset-0 transition duration-300 bg-black/0 group-hover:bg-black/10" />
</a>

          {["tl", "tr", "bl", "br"].map((corner) => {
            const isTop    = corner.startsWith("t");
            const isLeft   = corner.endsWith("l");
            return (
              <motion.div
                key={corner}
                aria-hidden="true"
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
                transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                className={[
                  "pointer-events-none absolute z-30",
                  "hidden sm:block",
                  isTop  ? "top-4 lg:top-6"    : "bottom-4 lg:bottom-6",
                  isLeft ? "left-4 lg:left-6"   : "right-4 lg:right-6",
                ].join(" ")}
                style={{
                  transformOrigin: `${isTop ? "top" : "bottom"} ${isLeft ? "left" : "right"}`,
                }}
              >
     
                <div
                  className="absolute bg-white/50"
                  style={{
                    width: 28,
                    height: 1.5,
                    top: isTop ? 0 : undefined,
                    bottom: isTop ? undefined : 0,
                    left: isLeft ? 0 : undefined,
                    right: isLeft ? undefined : 0,
                  }}
                />
       
                <div
                  className="absolute bg-white/50"
                  style={{
                    width: 1.5,
                    height: 28,
                    top: isTop ? 0 : undefined,
                    bottom: isTop ? undefined : 0,
                    left: isLeft ? 0 : undefined,
                    right: isLeft ? undefined : 0,
                  }}
                />
              </motion.div>
            );
          })}

        </motion.div>
      
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE_PREMIUM }}
          className="flex items-center justify-between px-1 mt-4 sm:px-2"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            8848 Momo House
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Photo Gallery
          </span>
        </motion.div>

      </div>
    </section>
  );
}
