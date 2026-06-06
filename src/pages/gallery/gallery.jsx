import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGalleryImages, useGalleryImages } from "@/lib/cms";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";

const DEFAULT_IMAGES = [
  {
    id: 1,
    src: "/gallery/617644782_1299501648874857_563777570824911312_n.jpg",
    alt: "8848 Momo House gallery image 1",
    caption: "Authentic Himalayan Flavors",
    depth: 0,
  },
  {
    id: 2,
    src: "/gallery/689672756_18075866372378582_4748471350885885049_n.jpg",
    alt: "8848 Momo House gallery image 2",
    caption: "Crafted With Tradition",
    depth: 2,
  },
  {
    id: 3,
    src: "/gallery/682083582_18073447619378582_4201470612714727230_n.jpg",
    alt: "8848 Momo House gallery image 3",
    caption: "Elevated Dining Experience",
    depth: 1,
  },
  {
    id: 4,
    src: "/gallery/683844009_18074008022378582_6744251658218158524_n.jpg",
    alt: "8848 Momo House gallery image 4",
    caption: "Signature Franchise Ambience",
    depth: 0,
  },
  {
    id: 5,
    src: "/gallery/690913600_1391357303022624_306986777952760570_n.jpg",
    alt: "8848 Momo House gallery image 5",
    caption: "Freshly Prepared Daily",
    depth: 2,
  },
  {
    id: 6,
    src: "/gallery/699905803_1395674515924236_8862937895640454602_n.jpg",
    alt: "8848 Momo House gallery image 6",
    caption: "The Taste of the Himalayas",
    depth: 1,
  },
  {
    id: 7,
    src: "/gallery/659653523_1363583049133383_5294780339634034547_n.jpg",
    alt: "8848 Momo House gallery image 7",
    caption: "Premium Restaurant Experience",
    depth: 2,
  },
  {
    id: 8,
    src: "/gallery/663309908_1363583052466716_2927746911495968980_n.jpg",
    alt: "8848 Momo House gallery image 8",
    caption: "Modern Himalayan Interior",
    depth: 0,
  },
  {
    id: 9,
    src: "/gallery/657818651_1361001296058225_7780074548649079592_n.jpg",
    alt: "8848 Momo House gallery image 9",
    caption: "Every Detail Matters",
    depth: 1,
  },
  {
    id: 10,
    src: "/gallery/659052232_1361001319391556_8113592981594270841_n.jpg",
    alt: "8848 Momo House gallery image 10",
    caption: "A Warm Dining Atmosphere",
    depth: 0,
  },
  {
    id: 11,
    src: "/gallery/658042542_1360998722725149_3188214951558336334_n.jpg",
    alt: "8848 Momo House gallery image 11",
    caption: "Luxury Meets Tradition",
    depth: 2,
  },
  {
    id: 12,
    src: "/gallery/514522482_1138513781640312_928824356955485501_n.jpg",
    alt: "8848 Momo House gallery image 12",
    caption: "Curated Culinary Moments",
    depth: 1,
  },
  {
    id: 13,
    src: "/gallery/515503401_1138293954995628_4231813753025719888_n.jpg",
    alt: "8848 Momo House gallery image 13",
    caption: "Authenticity in Every Bite",
    depth: 2,
  },
  {
    id: 14,
    src: "/gallery/493703598_1097963899028634_7754026072028280047_n.jpg",
    alt: "8848 Momo House gallery image 14",
    caption: "Inspired by Himalayan Culture",
    depth: 0,
  },
  {
    id: 15,
    src: "/gallery/630831463_1317107637114258_4769852074049037717_n.jpg",
    alt: "8848 Momo House gallery image 15",
    caption: "Beautifully Crafted Spaces",
    depth: 1,
  },
  {
    id: 16,
    src: "/gallery/649925123_1342420134583008_7241311262784313452_n.jpg",
    alt: "8848 Momo House gallery image 16",
    caption: "Experience the Summit",
    depth: 0,
  },
  {
    id: 17,
    src: "/gallery/667210978_1365141555644199_8043924957435588798_n.jpg",
    alt: "8848 Momo House gallery image 17",
    caption: "Moments Worth Sharing",
    depth: 2,
  },
  {
    id: 18,
    src: "/gallery/660275657_1363841442440877_1508218509033431157_n.jpg",
    alt: "8848 Momo House gallery image 18",
    caption: "Tradition Reimagined",
    depth: 1,
  },
  {
    id: 19,
    src: "/gallery/635010081_932313339310448_4999394022787579775_n.jpg",
    alt: "8848 Momo House gallery image 19",
    caption: "Premium Hospitality",
    depth: 0,
  },
  {
    id: 20,
    src: "/gallery/635235810_934031489138633_4034975548481698592_n.jpg",
    alt: "8848 Momo House gallery image 20",
    caption: "Flavors Above Expectations",
    depth: 2,
  },
  {
    id: 21,
    src: "/gallery/679528802_987160163825765_2976338946044117438_n.jpg",
    alt: "8848 Momo House gallery image 21",
    caption: "Designed for Memorable Gatherings",
    depth: 1,
  },
  {
    id: 22,
    src: "/gallery/679051057_988014597073655_3559615886381215986_n.jpg",
    alt: "8848 Momo House gallery image 22",
    caption: "Refined Himalayan Dining",
    depth: 0,
  },
  {
    id: 23,
    src: "/gallery/679994087_1379560484202306_6412673578865363964_n.jpg",
    alt: "8848 Momo House gallery image 23",
    caption: "Where Culture Meets Cuisine",
    depth: 2,
  },
  {
    id: 24,
    src: "/gallery/657364644_1360998956058459_481425256782942273_n.jpg",
    alt: "8848 Momo House gallery image 24",
    caption: "Authentic Himalayan Dining",
    depth: 0,
  },
  {
    id: 25,
    src: "/gallery/661312277_1360998152725206_2387943504577623895_n.jpg",
    alt: "8848 Momo House gallery image 25",
    caption: "Crafted Culinary Moments",
    depth: 2,
  },
  {
    id: 26,
    src: "/gallery/650619506_1345266560965032_6862016175277555941_n.jpg",
    alt: "8848 Momo House gallery image 26",
    caption: "The Taste of the Himalayas",
    depth: 1,
  },
  {
    id: 27,
    src: "/gallery/658827015_1359086639583024_1585698037278279405_n.jpg",
    alt: "8848 Momo House gallery image 27",
    caption: "Elevated Restaurant Experience",
    depth: 0,
  },
  {
    id: 28,
    src: "/gallery/657763472_1360998326058522_6156070505580579085_n.jpg",
    alt: "8848 Momo House gallery image 28",
    caption: "Luxury Meets Tradition",
    depth: 2,
  },
  {
    id: 29,
    src: "/gallery/660822584_1360998192725202_277411545268006583_n.jpg",
    alt: "8848 Momo House gallery image 29",
    caption: "Inspired by Himalayan Culture",
    depth: 1,
  },
  {
    id: 30,
    src: "/gallery/657346158_1360998829391805_7784036709851637162_n.jpg",
    alt: "8848 Momo House gallery image 30",
    caption: "Premium Dining Atmosphere",
    depth: 2,
  },
  {
    id: 31,
    src: "/gallery/658942206_1360998986058456_4729231746235759090_n.jpg",
    alt: "8848 Momo House gallery image 31",
    caption: "Every Detail Curated",
    depth: 0,
  },
  {
    id: 32,
    src: "/gallery/658012456_1360999059391782_3542414904991694057_n.jpg",
    alt: "8848 Momo House gallery image 32",
    caption: "Modern Himalayan Interior",
    depth: 1,
  },
  {
    id: 33,
    src: "/gallery/660606523_1360999206058434_2067406470089766344_n.jpg",
    alt: "8848 Momo House gallery image 33",
    caption: "Curated Guest Experience",
    depth: 0,
  },
  {
    id: 34,
    src: "/gallery/658297334_1360999252725096_3023324195421215656_n.jpg",
    alt: "8848 Momo House gallery image 34",
    caption: "Warm Himalayan Welcome",
    depth: 2,
  },
  {
    id: 35,
    src: "/gallery/660705672_1360999326058422_7649937306138062630_n.jpg",
    alt: "8848 Momo House gallery image 35",
    caption: "Designed for Gatherings",
    depth: 1,
  },
  {
    id: 36,
    src: "/gallery/571129961_843411921533924_353649833585970143_n.jpg",
    alt: "8848 Momo House gallery image 36",
    caption: "Experience the Summit",
    depth: 2,
  },
  {
    id: 37,
    src: "/gallery/581674475_859617753246674_9211006937216067306_n.jpg",
    alt: "8848 Momo House gallery image 37",
    caption: "Authenticity in Every Bite",
    depth: 0,
  },
  {
    id: 38,
    src: "/gallery/571353822_849523417589441_3169294274818382416_n.jpg",
    alt: "8848 Momo House gallery image 38",
    caption: "The Art of Flavor",
    depth: 1,
  },
  {
    id: 39,
    src: "/gallery/576804468_855343500340766_8602820587857597555_n.jpg",
    alt: "8848 Momo House gallery image 39",
    caption: "Beautifully Crafted Spaces",
    depth: 0,
  },
  {
    id: 40,
    src: "/gallery/573872141_853647590510357_1634949583157372937_n.jpg",
    alt: "8848 Momo House gallery image 40",
    caption: "Tradition Reimagined",
    depth: 2,
  },
  {
    id: 41,
    src: "/gallery/590716561_871212105420572_8498077945170908908_n.jpg",
    alt: "8848 Momo House gallery image 41",
    caption: "Moments Worth Sharing",
    depth: 1,
  },
  {
    id: 42,
    src: "/gallery/584909102_867349889140127_3367125591766371085_n.jpg",
    alt: "8848 Momo House gallery image 42",
    caption: "Premium Hospitality",
    depth: 0,
  },
  {
    id: 43,
    src: "/gallery/585194569_866609359214180_1510164762163656183_n.jpg",
    alt: "8848 Momo House gallery image 43",
    caption: "Where Culture Meets Cuisine",
    depth: 2,
  },
];

const DEPTH_CONFIG = {
  0: { yRange: [-12, 12], scale: 1.0 },
  1: { yRange: [-20, 20], scale: 1.0 },
  2: { yRange: [-30, 30], scale: 1.0 },
};


function GalleryCard({ image, index, containerRef }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const config = DEPTH_CONFIG[image.depth ?? 1];

  const rawY = useTransform(scrollYProgress, [0, 1], config.yRange);
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 });

  const entryDelay = (index % 4) * 0.08 + Math.floor(index / 4) * 0.05;

  return (
    <motion.div
      ref={cardRef}
      style={{ y }}
      className="gallery-card-wrapper"
      sx={{ display: "inline-block", width: "100%", marginBottom: "1.5rem" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 40, scale: 0.96 }
        }
        transition={{
          duration: 0.75,
          delay: entryDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "block",
          width: "100%",
          boxShadow: hovered
            ? "0 24px 64px rgba(99,140,215,0.22), 0 4px 16px rgba(99,140,215,0.12)"
            : "0 8px 32px rgba(99,140,215,0.10), 0 2px 8px rgba(99,140,215,0.06)",
          transition: "box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Shimmer placeholder */}
        {!imgLoaded && (
          <div
            style={{
              width: "100%",
              paddingBottom: "75%",
              background:
                "linear-gradient(135deg, #dce8f8 0%, #edf2ff 50%, #dce8f8 100%)",
              backgroundSize: "200% 200%",
              animation: "shimmer 1.8s ease-in-out infinite",
              borderRadius: "20px",
            }}
          />
        )}

        {/* Image */}
        <motion.img
          src={image.src}
          alt={image.alt}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
            transformOrigin: "center center",
          }}
          animate={{
            scale: hovered ? 1.055 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(14,30,80,0.72) 0%, rgba(14,30,80,0.18) 55%, transparent 100%)",
            display: "flex",
            alignItems: "flex-end",
            padding: "20px",
            pointerEvents: "none",
          }}
        >
          <motion.p
            animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              margin: 0,
              lineHeight: 1.4,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {image.caption}
          </motion.p>
        </motion.div>

        {/* Subtle light reflection */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
            borderRadius: "20px",
          }}
        />
      </motion.div>
    </motion.div>
  );
}


function AmbientOrbs() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {[
        { w: 480, h: 480, top: "8%", left: "-8%", opacity: 0.28, delay: 0 },
        { w: 360, h: 360, top: "45%", right: "-6%", opacity: 0.20, delay: 3 },
        { w: 280, h: 280, top: "75%", left: "12%", opacity: 0.18, delay: 6 },
        { w: 200, h: 200, top: "20%", right: "20%", opacity: 0.14, delay: 1.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -24, 0, 24, 0],
            x: [0, 10, 0, -10, 0],
            scale: [1, 1.06, 1, 0.96, 1],
          }}
          transition={{
            duration: 14 + i * 3,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,140,215,1) 0%, rgba(140,180,255,0.4) 60%, transparent 100%)",
            opacity: orb.opacity,
            filter: "blur(60px)",
          }}
        />
      ))}
    </div>
  );
}


function SectionHeading() {
  const { t } = useTranslation("gallery");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      style={{ textAlign: "center", marginBottom: "72px", position: "relative", zIndex: 1 }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            display: "block",
            width: "32px",
            height: "1.5px",
            background: "linear-gradient(to right, transparent, #638cd7)",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#638cd7",
          }}
        >
          {t("heading.eyebrow")}
        </span>
        <span
          style={{
            display: "block",
            width: "32px",
            height: "1.5px",
            background: "linear-gradient(to left, transparent, #638cd7)",
          }}
        />
      </motion.div>

      {/* Main heading */}
      <div style={{ overflow: "hidden" }}>
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: "#0d1f4a",
            lineHeight: 1.1,
            margin: "0 0 20px",
            fontFamily: "'Playfair Display', 'Georgia', serif",
            letterSpacing: "-0.02em",
          }}
        >
          {t("heading.title")}
        </motion.h2>
      </div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "16px",
          color: "#5a6e96",
          lineHeight: 1.75,
          maxWidth: "540px",
          margin: "0 auto",
          fontWeight: 400,
        }}
      >
         {t("heading.subtitle")}
      </motion.p>
    </div>
  );
}


export default function FloatingGallery({ images = DEFAULT_IMAGES }) {
  const sectionRef = useRef(null);
  const [columns, setColumns] = useState(4);
  const cmsImages = useGalleryImages();
  const displayImages = images === DEFAULT_IMAGES ? getGalleryImages(cmsImages, DEFAULT_IMAGES) : images;

  // Responsive column count
  useEffect(() => {
    function updateColumns() {
      const w = window.innerWidth;
      if (w < 480) setColumns(1);
      else if (w < 768) setColumns(2);
      else if (w < 1100) setColumns(3);
      else if (w < 1400) setColumns(4);
      else setColumns(5);
    }
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute images into columns (top-to-bottom order, balanced)
  const columnArrays = Array.from({ length: columns }, () => []);
  displayImages.forEach((img, i) => {
    columnArrays[i % columns].push({ ...img, globalIndex: i });
  });

  return (
    <>
      {/* Global styles injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .gallery-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-card-wrapper { transform: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position: "relative",
          background:
            "linear-gradient(180deg, #edf2ff 0%, #f2f7ff 40%, #edf2ff 100%)",
          padding: "100px 0 120px",
          overflow: "hidden",
        }}
        aria-label="Gallery — Moments from 8848 Momo House"
      >
        {/* Ambient atmospheric orbs */}
        <AmbientOrbs />

        {/* Content wrapper */}
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionHeading />

          {/* Masonry grid via flex columns */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "flex-start",
            }}
          >
            {columnArrays.map((colImages, colIdx) => (
              <div
                key={colIdx}
                className="gallery-col"
                style={{
                  flex: "1 1 0",
                  marginTop: colIdx % 2 === 1 ? "48px" : "0px",
                }}
              >
                {colImages.map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    index={image.globalIndex}
                    containerRef={sectionRef}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: "center",
              marginTop: "80px",
            }}
          >
            {/* <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 36px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, #4e7bd4 0%, #638cd7 100%)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(78,123,212,0.32), 0 2px 8px rgba(78,123,212,0.18)",
              }}
            >
              Explore All Moments
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button> */}
          </motion.div>
        </div>
      </section>
    </>
  );
}
