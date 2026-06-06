import HTMLFlipBook from "react-pageflip";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_MENU_PAGES } from "@/lib/cms";

// Design size (single page)
const PAGE_W = 330;
const PAGE_H = 546;

// Book size (two pages)
const BOOK_W = PAGE_W * 2;
const BOOK_H = PAGE_H;

const MenuPage = forwardRef(function MenuPage({ page, src }, ref) {
  return (
    <article className={`momoFlipPage ${page === 0 ? "isCover" : ""}`} ref={ref}>
      <img src={src} alt={`Menu page ${page + 1}`} draggable="false" />
    </article>
  );
});

export default function MomoFlipBook({
  pages = DEFAULT_MENU_PAGES,
  open = true,
  onClose = () => {},
}) {
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);
  const [bookShift, setBookShift] = useState("-25%");
  const [zoom, setZoom] = useState(1);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerSize = useElementSize(viewerRef);

  // Track fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const viewerWidth = viewerSize.width || 0;
  const isMobile = viewerWidth < 480;
  const isTablet = viewerWidth >= 480 && viewerWidth < 760;

  const pageFlip = () => bookRef.current?.pageFlip?.();

  const setResponsiveBookShift = useCallback(
    (nextPage) => {
      // No shift on mobile — single page, always centered
      if (isMobile) {
        setBookShift("0px");
        return;
      }
      if (nextPage === 0) {
        setBookShift("-25%");
      } else if (nextPage === pages.length - 1) {
        setBookShift("25%");
      } else {
        setBookShift("0px");
      }
    },
    [pages.length, isMobile]
  );

  const flipNext = useCallback(() => {
    if (isFlipping || page >= pages.length - 1) return;
    setResponsiveBookShift(page + 1);
    pageFlip()?.flipNext("bottom");
  }, [isFlipping, page, pages.length, setResponsiveBookShift]);

  const flipPrev = useCallback(() => {
    if (isFlipping || page <= 0) return;
    setResponsiveBookShift(page - 1);
    pageFlip()?.flipPrev("bottom");
  }, [isFlipping, page, setResponsiveBookShift]);

  const goToPage = useCallback(
    (nextPage, animated = true) => {
      const safePage = Math.max(0, Math.min(pages.length - 1, nextPage));
      setResponsiveBookShift(safePage);
      if (animated) pageFlip()?.flip(safePage, "bottom");
      else pageFlip()?.turnToPage(safePage);
      setThumbsOpen(false);
      setMoreOpen(false);
    },
    [pages.length, setResponsiveBookShift]
  );

  // Keep flipbook in sync when resized
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setResponsiveBookShift(page);
      pageFlip()?.update();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, setResponsiveBookShift, isMobile]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
      if (event.key === "ArrowRight") flipNext();
      if (event.key === "ArrowLeft") flipPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipNext, flipPrev, onClose, open]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest(".momoMoreWrap")) setMoreOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      viewerRef.current?.requestFullscreen?.();
    }
  }, []);

  // Responsive scale — uses single page width on mobile
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const bookWidth = isMobile ? PAGE_W : BOOK_W;
      const scaleX = rect.width / bookWidth;
      const scaleY = rect.height / PAGE_H;
      const scale = Math.min(scaleX, scaleY) * 0.92;
      stage.style.setProperty("--book-scale", scale.toFixed(3));
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [isFullscreen, isMobile]);

  if (!open) return null;

  return (
    <div className="momoOverlay">
      <section
        className={`momoViewer ${isFullscreen ? "isFullscreen" : ""} ${isMobile ? "isMobile" : ""} ${isTablet ? "isTablet" : ""}`}
        ref={viewerRef}
        aria-label="8848 Momo House menu"
      >
        <button className="momoClose" type="button" onClick={onClose} aria-label="Close menu">
          ✕
        </button>

        <div className="momoSideSlider" aria-hidden="true">
          <span />
        </div>

        <div className="momoStage" ref={stageRef}>
          {thumbsOpen && (
            <aside className="momoThumbRail" aria-label="Page thumbnails">
              {pages.map((src, index) => (
                <button
                  className={`momoThumb ${index === page ? "isActive" : ""}`}
                  type="button"
                  key={src + index}
                  onClick={() => goToPage(index, false)}
                >
                  <img src={src} alt={`Page ${index + 1}`} />
                  <span>
                    {index + 1}/{pages.length}
                  </span>
                </button>
              ))}
            </aside>
          )}

          <div
            className="momoClickZone momoClickLeft"
            role="button"
            tabIndex={-1}
            aria-label="Previous page"
            onClick={flipPrev}
          />
          <div
            className="momoClickZone momoClickRight"
            role="button"
            tabIndex={-1}
            aria-label="Next page"
            onClick={flipNext}
          />

          <button
            className="momoNav momoPrev"
            type="button"
            onClick={flipPrev}
            disabled={page === 0 || isFlipping}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          <div
            className="momoBookWrap"
            style={{
              "--zoom": zoom,
              "--book-shift": bookShift,
            }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={PAGE_W}
              height={PAGE_H}
              size="fixed"
              minWidth={PAGE_W}
              maxWidth={PAGE_W}
              minHeight={PAGE_H}
              maxHeight={PAGE_H}
              autoSize={false}
              maxShadowOpacity={0.42}
              drawShadow
              flippingTime={950}
              usePortrait={isMobile}
              showCover={!isMobile}
              startPage={page}
              mobileScrollSupport
              clickEventForward
              useMouseEvents
              swipeDistance={18}
              onFlip={(event) => {
                setPage(event.data);
                setResponsiveBookShift(event.data);
              }}
              onChangeState={(event) => setIsFlipping(event.data !== "read")}
              className="momoFlipBook"
            >
              {pages.map((src, index) => (
                <MenuPage key={src + index} page={index} src={src} />
              ))}
            </HTMLFlipBook>
          </div>

          <button
            className="momoNav momoNext"
            type="button"
            onClick={flipNext}
            disabled={page >= pages.length - 1 || isFlipping}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="momoToolbar" aria-label="Menu controls">
          <div className="momoPageLabel">
            {page + 1}/{pages.length}
          </div>

          <ToolbarButton
            label="Toggle Thumbnails"
            active={thumbsOpen}
            onClick={() => setThumbsOpen((v) => !v)}
          >
            <GridIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Zoom In"
            onClick={() => setZoom((v) => Math.min(1.45, +(v + 0.12).toFixed(2)))}
          >
            <ZoomInIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Zoom Out"
            disabled={zoom <= 1}
            onClick={() => setZoom((v) => Math.max(1, +(v - 0.12).toFixed(2)))}
          >
            <ZoomOutIcon />
          </ToolbarButton>

          <ToolbarButton label="Toggle Fullscreen" onClick={toggleFullscreen}>
            <FullscreenIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Share"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({ title: "8848 Momo House Menu", url: window.location.href })
                  .catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
          >
            <ShareIcon />
          </ToolbarButton>

          <div className="momoMoreWrap">
            <ToolbarButton
              label="More"
              active={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              <DotsIcon />
            </ToolbarButton>

            {moreOpen && (
              <div className="momoMoreMenu">
                <button type="button" onClick={() => goToPage(0, false)}>
                  First Page
                </button>
                <button type="button" onClick={() => goToPage(pages.length - 1, false)}>
                  Last Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setMoreOpen(false);
                  }}
                >
                  Reset Zoom
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .momoOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: clamp(6px, 2vh, 24px) clamp(4px, 2vw, 20px);
          background: rgba(13, 17, 23, 0.82);
          font-family: Arial, Helvetica, sans-serif;
        }

        /* ── Viewer shell ── */
        .momoViewer {
          position: relative;
          width: min(100%, 965px);
          height: 100%;
          max-height: 100%;
          background: #f2f3f8;
          border-radius: 0 clamp(16px, 5vw, 104px) clamp(16px, 5vw, 104px) clamp(16px, 5vw, 104px);
          box-shadow: 0 26px 90px rgba(0, 0, 0, 0.34);
          user-select: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .momoViewer::before {
          content: "";
          position: absolute;
          inset: 1.5% 11.6% 1.5% 10.2%;
          background: rgba(255, 255, 255, 0.32);
          pointer-events: none;
          z-index: 0;
        }

        .momoViewer.isMobile::before {
          display: none;
        }

        .momoViewer.isFullscreen,
        .momoViewer:fullscreen {
          position: fixed;
          inset: 0;
          width: 100dvw !important;
          height: 100dvh !important;
          max-width: none !important;
          max-height: none !important;
          min-height: 0 !important;
          border-radius: 0 !important;
          z-index: 99999;
        }

        .momoViewer:-webkit-full-screen {
          position: fixed;
          inset: 0;
          width: 100dvw !important;
          height: 100dvh !important;
          max-width: none !important;
          border-radius: 0 !important;
        }

        /* ── Stage ── */
        .momoStage {
          position: relative;
          flex: 1 1 0;
          padding: 44px clamp(16px, 4%, 60px) 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1800px;
          min-height: 0;
          --book-scale: 1;
        }

        .momoViewer.isMobile .momoStage {
          padding: 40px 4px 4px;
        }

        .momoViewer.isTablet .momoStage {
          padding: 44px 10px 8px;
        }

        .momoViewer.isFullscreen .momoStage,
        .momoViewer:fullscreen .momoStage {
          height: 100%;
          min-height: 0;
          padding: 24px clamp(20px, 3%, 48px) 12px;
        }

        /* ── Invisible click zones ── */
        .momoClickZone {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          z-index: 2;
          cursor: pointer;
        }

        .momoClickLeft  { left: 0; }
        .momoClickRight { right: 0; }

        /* ── Book wrap ── */
        .momoBookWrap {
          position: relative;
          z-index: 3;
          display: grid;
          place-items: center;
          transform: translateX(var(--book-shift, 0px)) scale(var(--zoom, 1));
          transform-origin: center;
          transition: transform 520ms cubic-bezier(.2,.72,.22,1);
          width: 100%;
          height: 100%;
        }

        .momoViewer.isMobile .momoBookWrap {
          transform: translateX(0px) scale(var(--zoom, 1));
        }

        .momoBookWrap::after {
          content: "";
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: -14px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,.18), rgba(0,0,0,0) 70%);
          pointer-events: none;
        }

        /* Scale flipbook to fit container */
        .momoFlipBook {
          transform: scale(var(--book-scale));
          transform-origin: center;
          overflow: visible !important;
        }

        .momoFlipBook .stf__wrapper,
        .momoFlipBook .stf__block {
          overflow: visible !important;
        }

        .momoFlipPage {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #fff;
        }

        .momoFlipPage img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
          pointer-events: none;
        }

        /* ── Close ── */
        .momoClose {
          position: absolute;
          top: 10px;
          left: 14px;
          z-index: 20;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          color: #334155;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .momoClose:hover {
          background: rgba(255,255,255,0.95);
        }

        /* ── Side slider decoration ── */
        .momoSideSlider {
          position: absolute;
          top: 0;
          right: -16px;
          bottom: 0;
          z-index: 18;
          width: 14px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.16);
          pointer-events: none;
        }

        .momoViewer.isMobile .momoSideSlider {
          display: none;
        }

        .momoSideSlider::before,
        .momoSideSlider::after {
          content: "";
          position: absolute;
          left: 3px;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }

        .momoSideSlider::before {
          top: 5px;
          border-bottom: 6px solid #8b949e;
        }

        .momoSideSlider::after {
          bottom: 5px;
          border-top: 6px solid #8b949e;
        }

        .momoSideSlider span {
          position: absolute;
          top: 18px;
          left: 4px;
          width: 6px;
          height: 72%;
          border-radius: 999px;
          background: #8b8f96;
        }

        /* ── Nav arrows ── */
        .momoNav {
          position: absolute;
          top: 50%;
          z-index: 9;
          width: clamp(28px, 5vw, 46px);
          height: clamp(44px, 9vw, 74px);
          padding: 0;
          border: 0;
          background: transparent;
          color: #fff;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,.55));
          transform: translateY(-50%);
          cursor: pointer;
          flex-shrink: 0;
        }

        .momoNav:disabled {
          opacity: 0;
          pointer-events: none;
        }

        .momoPrev {
          left: clamp(0px, 1%, 12px);
        }

        .momoNext {
          right: clamp(0px, 1%, 12px);
        }

        /* Mobile nav overrides */
        .momoViewer.isMobile .momoNav {
          width: 26px;
          height: 40px;
        }

        .momoViewer.isMobile .momoPrev {
          left: 2px;
        }

        .momoViewer.isMobile .momoNext {
          right: 2px;
        }

        /* ── Toolbar ── */
        .momoToolbar {
          position: relative;
          z-index: 12;
          flex-shrink: 0;
          align-self: center;
          display: flex;
          align-items: center;
          height: 42px;
          padding: 0 10px;
          gap: clamp(2px, 1vw, 8px);
          margin: 6px auto 10px;
          background: #fff;
          border: 1px solid #d8dde7;
          border-radius: 5px;
          box-shadow: 0 2px 9px rgba(15, 23, 42, .22);
          max-width: calc(100% - 20px);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .momoToolbar::-webkit-scrollbar {
          display: none;
        }

        /* Mobile toolbar */
        .momoViewer.isMobile .momoToolbar {
          height: 38px;
          padding: 0 6px;
          gap: 1px;
          margin: 4px auto 8px;
          max-width: calc(100% - 12px);
        }

        .momoPageLabel {
          min-width: 38px;
          color: #818997;
          font-size: 12px;
          line-height: 1;
          text-align: center;
          flex-shrink: 0;
        }

        .momoViewer.isMobile .momoPageLabel {
          font-size: 10px;
          min-width: 26px;
        }

        .momoToolButton {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: clamp(20px, 3.5vw, 26px);
          height: 28px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #6f7b89;
          cursor: pointer;
        }

        .momoViewer.isMobile .momoToolButton {
          width: 20px;
          height: 24px;
        }

        .momoViewer.isMobile .momoToolButton svg {
          width: 14px;
          height: 14px;
        }

        .momoToolButton:hover,
        .momoToolButton.isActive {
          color: #18243a;
        }

        .momoToolButton:disabled {
          opacity: .35;
          cursor: default;
        }

        /* ── More menu ── */
        .momoMoreWrap {
          position: relative;
          flex-shrink: 0;
        }

        .momoMoreMenu {
          position: absolute;
          right: 0;
          bottom: 38px;
          width: 148px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #d8dde7;
          border-radius: 6px;
          box-shadow: 0 10px 28px rgba(15, 23, 42, .24);
          z-index: 20;
        }

        .momoMoreMenu button {
          display: block;
          width: 100%;
          padding: 10px 12px;
          border: 0;
          background: #fff;
          color: #334155;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }

        .momoMoreMenu button:hover {
          background: #f2f3f8;
        }

        /* ── Thumbnails ── */
        .momoThumbRail {
          position: absolute;
          left: 8px;
          top: 8px;
          bottom: 8px;
          z-index: 14;
          width: clamp(64px, 14%, 112px);
          padding: 8px;
          overflow-y: auto;
          background: rgba(255,255,255,.94);
          border: 1px solid #d8dde7;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, .18);
        }

        /* Mobile thumbs — horizontal strip at top */
        .momoViewer.isMobile .momoThumbRail {
          left: 0;
          right: 0;
          top: 40px;
          bottom: auto;
          width: 100%;
          height: 88px;
          display: flex;
          flex-direction: row;
          gap: 6px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 6px 8px;
          border-radius: 0;
          border-left: 0;
          border-right: 0;
        }

        .momoThumb {
          width: 100%;
          margin: 0 0 8px;
          padding: 4px;
          border: 2px solid transparent;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          font-size: 11px;
          flex-shrink: 0;
        }

        .momoViewer.isMobile .momoThumb {
          width: auto;
          margin: 0;
          padding: 2px;
        }

        .momoViewer.isMobile .momoThumb img {
          height: 60px;
          width: auto;
          aspect-ratio: 330 / 546;
        }

        .momoThumb.isActive {
          border-color: #153d78;
        }

        .momoThumb img {
          display: block;
          width: 100%;
          aspect-ratio: 330 / 546;
          object-fit: fill;
          background: #eef1f6;
        }

        /* Touch-friendly tap targets on mobile */
        @media (max-width: 479px) {
          .momoClickZone {
            /* Shrink so nav arrows are easily tappable */
            width: 40%;
          }
          .momoClickLeft { left: 0; }
          .momoClickRight { right: 0; }
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ active = false, children, disabled = false, label, onClick }) {
  return (
    <button
      className={`momoToolButton ${active ? "isActive" : ""}`}
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function ChevronLeft() {
  return (
    <svg width="34" height="52" viewBox="0 0 34 52" fill="none" aria-hidden="true">
      <path d="M23 8 9 26l14 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="34" height="52" viewBox="0 0 34 52" fill="none" aria-hidden="true">
      <path d="m11 8 14 18-14 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.8 15.4 7M8.6 13.2l6.8 3.8" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
