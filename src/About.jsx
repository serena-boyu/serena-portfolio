// About + Playground
// NOTE: each <script type="text/babel"> shares global scope, so React hooks
// are aliased here to avoid colliding with Home.jsx / ProjectPage.jsx.
const { useState: useStateAb, useEffect: useEffectAb, useRef: useRefAb } = React;

// ───────────────────────────────────────────────────────────────────
// Reusable Image + Caption card (matches Figma "Image + Caption").
// Rectangular landscape image; a white caption box fades/slides up on hover.
// Used for every image across the About and Playground pages.
// ───────────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────────
// Image + Caption card. A landscape image with a caption box that fades
// up on hover. When `onZoom` is provided it becomes click-to-enlarge:
// the media gently scales, a darkening scrim + "expand" badge appear, and
// the cursor switches to zoom-in to signal the click opens a larger popup.
// ───────────────────────────────────────────────────────────────────
function ImageCaption({ title, caption, src, videoSrc, gradient, aspect = "16 / 10", label, onZoom, mobileTitleOnly, noHoverCaption, hoverZoom }) {
  const [hover, setHover] = useStateAb(false);
  const cardRef = useRefAb(null);
  // On short cards (e.g. mobile multi-column grids) there isn't room for the
  // title AND caption without clipping — fall back to title-only in that case.
  const [titleOnly, setTitleOnly] = useStateAb(false);
  // If an image path 404s, drop it so the labeled placeholder shows instead of
  // a blank gray box.
  const [imgFailed, setImgFailed] = useStateAb(false);
  // Fade the photo in once it has actually decoded, so cards don't pop in.
  const [loaded, setLoaded] = useStateAb(false);
  useEffectAb(() => {
    setImgFailed(false);
    if (!src) {setLoaded(true);return;}
    setLoaded(false);
    const probe = new Image();
    let alive = true;
    probe.onload = () => {if (alive) setLoaded(true);};
    probe.onerror = () => {if (alive) {setImgFailed(true);setLoaded(true);}};
    probe.src = src;
    if (probe.complete) setLoaded(true);
    return () => {alive = false;};
  }, [src]);
  useEffectAb(() => {
    const card = cardRef.current;
    if (!card) return;
    const measure = () => {
      // Force title-only on mobile when requested (e.g. the dense gallery grid).
      if (mobileTitleOnly && typeof window !== "undefined" &&
      window.matchMedia("(max-width: 720px)").matches) {
        setTitleOnly(!!caption);
        return;
      }
      // Caption box sits inset 12px top/bottom; full title+caption needs ~78px.
      const avail = card.clientHeight - 24;
      setTitleOnly(caption ? avail < 78 : false);
    };
    measure();
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(card);
    }
    window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [caption, mobileTitleOnly]);
  // Click-to-enlarge is active whenever an onZoom handler is provided.
  const zoomable = typeof onZoom === "function";
  // Lift + zoom on hover: automatic for click-to-enlarge cards, opt-in elsewhere.
  const lift = zoomable || !!hoverZoom;
  // Image is driven by `src` in the data; falls back to a gradient/placeholder.
  const shownSrc = imgFailed ? null : src;
  const media = shownSrc ? `url(${shownSrc}) center / cover no-repeat` : gradient || "linear-gradient(135deg, #e8e2d9, #c8baa6)";
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={zoomable ? () => onZoom({ title, caption, src, videoSrc, gradient, label }) : undefined}
      role={zoomable ? "button" : undefined}
      tabIndex={zoomable ? 0 : undefined}
      onKeyDown={zoomable ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onZoom({ title, caption, src, videoSrc, gradient, label });}} : undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        borderRadius: 12,
        border: "1px solid var(--hair)",
        overflow: "hidden",
        cursor: zoomable ? "zoom-in" : "pointer",
        background: "var(--gray-50)",
        boxShadow: hover ? "0 16px 38px rgba(0,0,0,0.16)" : "2px 2px 6px -1px var(--shadow-soft)",
        transform: hover && lift ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow .35s ease, transform .35s cubic-bezier(.22,.61,.36,1)"
      }}>
      {/* Media layer — driven by `src`/`videoSrc` (swap the path in the data). */}
      {videoSrc ?
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        aria-label={title || "Video"}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          transform: hover && lift ? "scale(1.05)" : "scale(1)",
          transition: "transform .5s cubic-bezier(.22,.61,.36,1)"
        }} /> :
      <div style={{
        position: "absolute", inset: 0,
        background: media,
        opacity: loaded ? 1 : 0,
        transform: hover && lift ? "scale(1.05)" : "scale(1)",
        transition: "opacity .5s ease, transform .5s cubic-bezier(.22,.61,.36,1)"
      }} />
      }
      {/* Placeholder marker when there's no real image yet */}
      {!shownSrc && !videoSrc &&
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11, letterSpacing: "0.04em", color: "rgba(0,0,0,0.4)",
        textTransform: "uppercase", pointerEvents: "none"
      }}>
          {label || "photo"}
        </div>
      }
      {/* Subtle gradient scrim so the caption box reads on bright photos */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent 45%)",
        opacity: hover && !noHoverCaption ? 1 : 0, transition: "opacity .3s ease", pointerEvents: "none"
      }} />
      {/* Expand badge (only on zoomable cards) — clear "click to enlarge" cue */}
      {zoomable &&
      <div style={{
        position: "absolute", top: 12, right: 12,
        width: 34, height: 34, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        border: "1px solid var(--hair)",
        display: "grid", placeItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        opacity: hover ? 1 : 0,
        transform: hover ? "scale(1)" : "scale(0.8)",
        transition: "opacity .25s ease, transform .25s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none"
      }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      }
      {/* Caption box */}
      <div style={{
        position: "absolute", left: 12, right: 12, bottom: 12,
        background: "var(--paper)",
        border: "1px solid var(--hair)",
        borderRadius: 8,
        padding: "11px 14px",
        opacity: hover && !noHoverCaption ? 1 : 0,
        transform: hover && !noHoverCaption ? "translateY(0)" : "translateY(10px)",
        transition: "opacity .3s ease, transform .35s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: "-0.02em", color: "var(--ink)" }}>
          {title}
        </div>
        {caption && !titleOnly &&
        <div style={{ marginTop: 2, fontWeight: 300, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.62)" }}>
            {caption}
          </div>
        }
      </div>
    </div>);

}

// Client logos for the marquee in the About page's Client Work section.
// Order intentionally matches the sentence above it. Each asset is grayscale,
// whitespace-trimmed, and rendered at exactly 2x its display height (so the
// CSS never upscales it). Heights are balanced by optical AREA rather than
// being equal, so very wide wordmarks don't dominate the row.
const CLIENT_LOGOS = [
{ src: "assets/logos/reuters.png", h: 32, name: "Reuters Plus", href: "https://plus.reuters.com/p/1" },
{ src: "assets/logos/jfk-t4.png", h: 31, name: "JFK Airport", href: "https://www.jfkairport.com/explore-jfk/terminals/terminal-4" },
{ src: "assets/logos/nbcuniversal.png", h: 21, name: "NBCUniversal", href: "https://together.nbcuni.com/home/" },
{ src: "assets/logos/ogilvy.png", h: 32, name: "Ogilvy", href: "https://www.ogilvy.com/" },
{ src: "assets/logos/ecolab.png", h: 29, name: "Ecolab", href: "https://www.ecolab.com/en-us" },
{ src: "assets/logos/pgim.png", h: 32, name: "PGIM", href: "https://www.pgim.com/us/en/institutional" },
{ src: "assets/logos/leading-edge.png", h: 32, name: "Leading Edge", href: "https://www.leadingedge.org/" },
{ src: "assets/logos/flo-marketing.png", h: 32, name: "Flo. Marketing", href: "https://www.flomktg.com/" }];

// Fun facts shown in the bubble when the portrait is clicked — edit freely.
const FUN_FACTS = [
"I have a 1200+ day streak on Duolingo!",
"I dual wield a mouse (right hand) and trackpad (left hand)",
"Scallions are my favorite garnish",
"I love playing Word Bites on GamePigeon",
"My last name \u4f0d means five in Chinese",
"I love snacking on dried mangos from Trader Joe's",
"Enough about me, go check out my work! 😗"];

// Entries at/after this index render without the purple "Fun fact:" label.
const FUN_FACTS_UNLABELED_FROM = 6;

// Portrait with a soft custom waving-hand cursor that fades in and waves.
function WavingPortrait() {
  const [pos, setPos] = useStateAb({ x: 0, y: 0 });
  const [hover, setHover] = useStateAb(false);
  const [loaded, setLoaded] = useStateAb(false);
  // Hover shows the bubble; clicking while hovered cycles to the next fact.
  const [factIdx, setFactIdx] = useStateAb(0);
  const ref = useRefAb(null);
  // Touch devices have no hover, so tapping toggles the bubble instead of
  // showing the waving-hand cursor (which can't follow a finger anyway).
  const [isTouch, setIsTouch] = useStateAb(false);
  useEffectAb(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setIsTouch(mq.matches);
    sync();
    if (mq.addEventListener) {mq.addEventListener("change", sync);return () => mq.removeEventListener("change", sync);}
    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  // Touch: a tap outside the portrait or bubble dismisses the bubble.
  const wrapRef = useRefAb(null);
  useEffectAb(() => {
    if (!isTouch || !hover) return;
    const onDocDown = (ev) => {
      const wrap = wrapRef.current;
      if (wrap && !wrap.contains(ev.target)) setHover(false);
    };
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [isTouch, hover]);

  const onMove = (e) => {
    const r = ref.current && ref.current.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      className="about-portrait"
      ref={wrapRef}
      style={{
        width: "100%", maxWidth: 280, aspectRatio: "1 / 1",
        justifySelf: "end",
        position: "relative"
      }}>
      {/* Fun-fact bubble, styled after Instagram notes: borderless white blob
          with a soft shadow and one small circle trailing toward the portrait.
          Sits outside the clipped circle so it can overhang. */}
      <div
        aria-live="polite"
        className="about-fact-bubble"
        onClick={(e) => {if (isTouch && hover) {e.stopPropagation();setFactIdx((i) => i + 1);}}}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "86%",
          marginLeft: -110,
          width: 224,
          zIndex: 3,
          pointerEvents: isTouch && hover ? "auto" : "none",
          cursor: isTouch && hover ? "pointer" : "default",
          transformOrigin: "bottom left",
          opacity: hover ? 1 : 0,
          transform: hover ? "scale(1) translate(0, 0)" : "scale(0.9) translate(6px, 6px)",
          transition: "opacity .22s ease, transform .34s cubic-bezier(.34,1.56,.64,1)",
          // ONE shadow for the whole silhouette. Per-shape box-shadows made the
          // big circle's arc visible through the bubble above it; a filter on
          // the group traces the merged outline instead, so they read as one.
          filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.13)) drop-shadow(0 1px 3px rgba(0,0,0,0.09))"
        }}>
        {/* Trail circles sit BEHIND the body so they merge into its edge. */}
        <span className="about-fact-tail" style={{
          position: "absolute",
          left: 16,
          bottom: -10,
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "var(--paper)"
        }} />
        <span className="about-fact-tail2" style={{
          position: "absolute",
          left: 39,
          bottom: -19,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--paper)"
        }} />
        <div style={{
          position: "relative",
          background: "var(--paper)",
          borderRadius: 22,
          padding: "13px 17px",
          fontSize: 13.5,
          lineHeight: "19px",
          letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.72)"
        }}>
          {factIdx % FUN_FACTS.length < FUN_FACTS_UNLABELED_FROM &&
          <><span style={{ fontWeight: 600, color: "var(--accent)" }}>Fun fact:</span>{" "}</>
          }
          {FUN_FACTS[factIdx % FUN_FACTS.length]}
        </div>
      </div>

      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="Show a fun fact"
        onClick={() => {
          if (isTouch) {
            // First tap opens it; each tap after advances to the next fact.
            if (hover) setFactIdx((i) => i + 1);else
            setHover(true);
            return;
          }
          setFactIdx((i) => i + 1);
        }}
        onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();if (isTouch && !hover) setHover(true);else setFactIdx((i) => i + 1);}}}
        onMouseEnter={() => {if (!isTouch) setHover(true);}}
        onMouseLeave={() => {if (!isTouch) setHover(false);}}
        onMouseMove={onMove}
        style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: "var(--gray-50)",
          color: "rgba(0,0,0,0.4)", fontSize: 12,
          fontFamily: "ui-monospace, monospace", letterSpacing: "0.04em",
          border: "1px solid var(--hair)",
          position: "relative",
          overflow: "hidden",
          cursor: hover && !isTouch ? "none" : "pointer"
        }}>
      {/* Swap the path below to set your portrait (or leave blank for placeholder). */}
      {window.PORTRAIT_SRC ?
      <img
        src={window.PORTRAIT_SRC}
        alt="Serena Ng"
        width={760}
        height={622}
        loading="eager"
        decoding="async"
        fetchpriority="high"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "58% 50%",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity .45s ease"
        }} /> :
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>[ portrait ]</span>
        </div>
      }
      {/* Custom waving-hand cursor — soft fade + scale in, then waves. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          fontSize: 30,
          lineHeight: 1,
          color: "#000",
          pointerEvents: isTouch && hover ? "auto" : "none",
          cursor: isTouch && hover ? "pointer" : "default",
          visibility: hover && !isTouch ? "visible" : "hidden",
          opacity: 1,
          scale: hover ? "1" : "0.4",
          translate: "-30% -20%",
          transition: "scale .35s cubic-bezier(.34,1.56,.64,1)",
          willChange: "left, top, scale"
        }}>
        <span style={{
          display: "inline-block",
          transformOrigin: "70% 90%",
          animation: hover ? "handWave 1.1s ease-in-out infinite" : "none"
        }}>👋</span>
      </span>
      </div>
    </div>);

}

// Fullscreen popup showing a larger version of a clicked archive image.
function Lightbox({ item, onClose }) {
  // Tall (portrait) images are shown at full width and scrolled, so
  // "enlarge" always means bigger — a viewport-height cap would shrink them
  // below their inline size. Landscape spreads keep the fit-to-screen cap.
  const [portrait, setPortrait] = useStateAb(false);
  const [natW, setNatW] = useStateAb(0);
  // Swipe to dismiss (touch only). Tall images scroll vertically, so for those
  // only a horizontal swipe counts — otherwise scrolling would close it.
  const swipe = useRefAb(null);
  const onSwipeStart = (ev) => {
    if (ev.pointerType === "mouse") return;
    swipe.current = { x: ev.clientX, y: ev.clientY };
  };
  const onSwipeEnd = (ev) => {
    const sw = swipe.current;
    swipe.current = null;
    if (!sw) return;
    const dx = ev.clientX - sw.x;
    const dy = ev.clientY - sw.y;
    const THRESHOLD = 70;
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {onClose();return;}
    // Vertical swipe closes only when the overlay isn't actually scrolling.
    const scrolled = ev.currentTarget.scrollHeight > ev.currentTarget.clientHeight + 4;
    if (!scrolled && Math.abs(dy) > THRESHOLD) onClose();
  };
  useEffectAb(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("keydown", onKey);
    // Lock BOTH html and body. Locking body alone leaves the root's scrollbar
    // track rendered beside the overlay (which spans clientWidth only), showing
    // as a pale bar down the right edge. Pad by the track's width so the page
    // underneath doesn't shift as it disappears.
    const de = document.documentElement;
    const gutter = window.innerWidth - de.clientWidth;
    const prevBodyOverflow = document.body.style.overflow;
    const prevRootOverflow = de.style.overflow;
    const prevBodyPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    de.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = gutter + "px";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
      de.style.overflow = prevRootOverflow;
      document.body.style.paddingRight = prevBodyPad;
    };
  }, []);
  if (!item) return null;
  const media = item.src ? `url(${item.src}) center / cover no-repeat` : item.gradient || "linear-gradient(135deg, #e8e2d9, #c8baa6)";
  return (
    <div
      onClick={onClose}
      onPointerDown={onSwipeStart}
      onPointerUp={onSwipeEnd}
      onPointerCancel={() => {swipe.current = null;}}
      className="no-scrollbar"
      style={{
        position: "fixed", inset: 0, width: "100vw", zIndex: 1000,
        background: "rgba(20,20,22,0.82)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: portrait ? "flex-start" : "center", justifyContent: "center",
        padding: portrait ? "3vh 3vw" : "5vh 5vw",
        // Scrollable for tall portrait images, but the gutter is hidden — on
        // mobile an always-visible scrollbar reads as a pale bar down the
        // right edge of the dark overlay.
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overscrollBehavior: "contain",
        // Keeps native vertical scrolling for tall images while ensuring
        // horizontal swipes arrive as pointer events (iOS may otherwise claim
        // them and fire pointercancel). Mirrors [data-book-stage] in index.html.
        touchAction: "pan-y",
        cursor: "zoom-out",
        animation: "pageFade .25s ease-out both"
      }}>
      {/* No close button — clicking anywhere (or Escape) closes the lightbox. */}
      <figure
        style={{ margin: portrait ? "auto" : "0 auto", maxWidth: portrait ? "none" : 1100, width: portrait ? "auto" : "100%", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", cursor: "zoom-out" }}>
        {/* Media sizes to the image's true aspect — never cropped. */}
        {item.videoSrc ?
        <video
          src={item.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{
            maxWidth: "100%",
            maxHeight: "78vh",
            width: "auto",
            height: "auto",
            display: "block",
            borderRadius: 14,
            background: "#000",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)"
          }} /> :
        item.src ?
        <img
          src={item.src}
          alt={item.title || ""}
          onLoad={(e) => {setNatW(e.target.naturalWidth);setPortrait(e.target.naturalHeight > e.target.naturalWidth);}}
          style={{
            width: "auto",
            maxWidth: "100%",
            maxHeight: portrait ? "calc(100vh - 130px)" : "78vh",
            height: "auto",
            display: "block",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)"
          }} /> :
        <div style={{
          width: "100%",
          aspectRatio: "3 / 2",
          maxHeight: "78vh",
          borderRadius: 14,
          background: media,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)"
        }} />
        }
        {(item.title || item.caption) &&
        <figcaption style={{ marginTop: 16, textAlign: "center", maxWidth: 640 }}>
            {item.title &&
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 16, letterSpacing: "-0.02em" }}>{item.title}</div>
          }
            {item.caption &&
          <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 300, fontSize: 14, letterSpacing: "-0.01em", marginTop: 4 }}>{item.caption}</div>
          }
          </figcaption>
        }
      </figure>
    </div>);

}
window.Lightbox = Lightbox;

// Shared top nav used on EVERY page — "Serena Ng" left, links right.
// Sticky; collapses to a compact translucent bar once the page is scrolled.
// `overlay` makes it float over the fixed Home split-screen (which doesn't scroll).
function SiteNav({ onNavigate, current, overlay, activeProjectId, activeArchiveSlug, contentMaxWidth = 1080, autoHide }) {
  const [compact, setCompact] = useStateAb(false);
  // `autoHide` (case study pages): the nav slides away on scroll-down and
  // returns on scroll-up or when the pointer nears the top of the window.
  const [hidden, setHidden] = useStateAb(false);
  const lastY = useRefAb(0);
  useEffectAb(() => {
    if (!autoHide || overlay) return;
    const read = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    (document.scrollingElement && document.scrollingElement.scrollTop) || 0;
    lastY.current = read();
    const onScroll = () => {
      const y = read();
      const dy = y - lastY.current;
      // Ignore sub-pixel jitter and the nav's own height transition.
      if (Math.abs(dy) < 6) return;
      lastY.current = y;
      // Always visible near the top of the document.
      if (y < 90) {setHidden(false);return;}
      setHidden(dy > 0);
    };
    const onMove = (e) => {if (e.clientY < 90) setHidden(false);};
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("mousemove", onMove);
    };
  }, [autoHide, overlay]);
  useEffectAb(() => {
    if (overlay) return; // Home doesn't scroll → always full-size
    const read = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    (document.scrollingElement && document.scrollingElement.scrollTop) || 0;
    // Hysteresis: turn compact ON above 56px, OFF below 8px. The dead-band
    // between the two stops the state flip-flopping (and jittering) when the
    // nav's height change nudges the scroll position back across a single
    // threshold.
    const onScroll = () => {
      const y = read();
      setCompact((prev) => prev ? y > 8 : y > 56);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [overlay]);

  return (
    <header
      className={"site-nav" + (overlay ? " overlay" : "") + (compact ? " is-compact" : "") + (hidden ? " is-hidden" : "")}
      onMouseEnter={autoHide ? () => setHidden(false) : undefined}>
      <div className="site-nav-inner" style={{ maxWidth: overlay ? "none" : contentMaxWidth }}>
        {overlay ?
        <span aria-hidden="true" /> :
        <button className="nav-wordmark" onClick={(e) => {e.currentTarget.blur();onNavigate("home");}}>Serena Ng</button>
        }
        <nav className="site-nav-links">
        <div className="nav-item">
          <button className={"nav-link" + (current === "work" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("home");}}>
            Featured Work
            <svg className="nav-caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="nav-menu" role="menu">
            {(window.PROJECTS || []).map((p) =>
            <button key={p.id} className={"nav-menu-item" + (p.id === activeProjectId ? " is-active" : "")} role="menuitem" onClick={(e) => {e.currentTarget.blur();onNavigate("project/" + p.id);}}>
                {p.title}
              </button>
            )}
          </div>
        </div>
        <div className="nav-item">
          <button className={"nav-link" + (current === "playground" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("archive");}}>
            Archive
            <svg className="nav-caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="nav-menu" role="menu">
            {(window.ARCHIVE_ORDER || []).map((a) =>
            <button key={a.slug} className={"nav-menu-item" + (a.slug === activeArchiveSlug ? " is-active" : "")} role="menuitem" onClick={(e) => {e.currentTarget.blur();onNavigate("archive/" + a.slug);}}>
                {a.title}
              </button>
            )}
          </div>
        </div>
        <button className={"nav-link" + (current === "about" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("about");}}>About</button>
      </nav>
      </div>
    </header>);

}
window.SiteNav = SiteNav;

// ─────────────────────────────────────────────────────────────────
// Easter egg (desktop only): footer "Secret" link → confirm → a draggable,
// looping, muted picture-in-picture video floating above the page.
// ─────────────────────────────────────────────────────────────────
function SecretPrompt({ onYes, onNo }) {
  useEffectAb(() => {
    const onKey = (e) => {if (e.key === "Escape") onNo();};
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onNo]);
  return (
    <div
      onClick={onNo}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(20,20,22,0.5)",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 24,
        animation: "pageFade .2s ease-out both"
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          borderRadius: 20,
          padding: "28px 30px",
          width: "100%", maxWidth: 420,
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
          textAlign: "center"
        }}>
        <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.03em", color: "var(--ink)" }}>
          Activate attention enhancer tool?
        </div>
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 300, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.5)" }}>
          (Btw this was my brother's idea)
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="pill-btn ghost" onClick={onNo} style={{ justifyContent: "center" }}>
            Oh god no...
          </button>
          <button className="pill-btn" onClick={onYes} style={{ justifyContent: "center" }}>
            YESSSSS!!!
          </button>
        </div>
      </div>
    </div>);

}

function BrainrotPlayer({ onClose }) {
  const RATIO = 398 / 224; // 9:16-ish; height is derived so it never distorts
  const MIN_W = 120,MAX_W = 520;
  const boxRef = useRefAb(null);
  const drag = useRefAb(null);
  const resize = useRefAb(null);
  const [w, setW] = useStateAb(224);
  const h = Math.round(w * RATIO);
  // Bottom-right by default, inset from the edges.
  const [pos, setPos] = useStateAb(() => ({
    x: Math.max(12, window.innerWidth - 224 - 22),
    y: Math.max(12, window.innerHeight - 398 - 22)
  }));

  const clamp = (x, y, bw, bh) => ({
    x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - bw - 8)),
    y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - bh - 8))
  });

  useEffectAb(() => {
    const onMove = (e) => {
      if (resize.current) {
        e.preventDefault();
        const r = resize.current;
        // Size FIRST, bounded only by the viewport itself — not by the box's
        // current top-left. Capping against a pinned corner meant the default
        // bottom-right placement could only grow a few pixels.
        // Corners anchored on the right pull inward, so invert the delta.
        const dx = (e.clientX - r.x) * (r.left ? -1 : 1);
        const next = Math.round(Math.min(
          Math.max(MIN_W, r.w + dx),
          MAX_W,
          window.innerWidth - 16,
          (window.innerHeight - 16) / RATIO
        ));
        const nextH = Math.round(next * RATIO);
        setW(next);
        // Keep the corner OPPOSITE the handle pinned, so the box grows toward
        // the direction being dragged rather than always down-right.
        const nx = r.left ? r.x0 + (r.w - next) : r.x0;
        const ny = r.top ? r.y0 + (r.h - nextH) : r.y0;
        setPos(clamp(nx, ny, next, nextH));
        return;
      }
      if (!drag.current) return;
      e.preventDefault();
      const d0 = drag.current;
      setPos(clamp(e.clientX - d0.dx, e.clientY - d0.dy, d0.w, d0.h));
    };
    const onUp = () => {drag.current = null;resize.current = null;};
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Keep it on screen when the viewport or the box size changes.
  useEffectAb(() => {
    const fit = () => setPos((p) => clamp(p.x, p.y, w, h));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [w, h]);

  const startDrag = (e) => {
    const r = boxRef.current.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height };
  };
  // corner: "nw" | "ne" | "sw" | "se" — `left`/`top` flag which edges move.
  const startResize = (e, corner) => {
    e.stopPropagation();
    const r = boxRef.current.getBoundingClientRect();
    resize.current = {
      x: e.clientX,
      w: r.width, h: r.height,
      x0: r.left, y0: r.top,
      left: corner === "nw" || corner === "sw",
      top: corner === "nw" || corner === "ne"
    };
  };

  return (
    <div
      ref={boxRef}
      onPointerDown={startDrag}
      style={{
        position: "fixed",
        left: pos.x, top: pos.y,
        width: w, height: h,
        zIndex: 1500,
        borderRadius: 16,
        overflow: "hidden",
        background: "#000",
        boxShadow: "0 18px 50px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
        cursor: "grab",
        touchAction: "none"
      }}>
      <video
        src="assets/secret/brainrot.mp4"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
      <button
        onClick={(e) => {e.stopPropagation();onClose();}}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Close"
        style={{
          position: "absolute", top: 8, right: 8,
          width: 26, height: 26, borderRadius: "50%",
          border: "none", background: "rgba(0,0,0,0.4)", color: "#fff",
          // Blur the video behind the button so the ✕ stays legible over
          // whatever frame happens to be playing.
          backdropFilter: "blur(6px) saturate(140%)",
          WebkitBackdropFilter: "blur(6px) saturate(140%)",
          cursor: "pointer", display: "grid", placeItems: "center",
          fontFamily: "inherit", fontSize: 13, lineHeight: 1
        }}>
        ✕
      </button>
      {/* Aspect-locked resize handles. Top-right is omitted — the close
          button occupies that corner. */}
      {[
      { c: "nw", css: { left: 0, top: 0, cursor: "nwse-resize" }, rot: 180 },
      { c: "sw", css: { left: 0, bottom: 0, cursor: "nesw-resize" }, rot: 90 },
      { c: "se", css: { right: 0, bottom: 0, cursor: "nwse-resize" }, rot: 0 }].
      map((hd) =>
      <div
        key={hd.c}
        onPointerDown={(ev) => startResize(ev, hd.c)}
        title="Drag to resize"
        style={Object.assign({
          position: "absolute",
          width: 26, height: 26,
          display: "grid", placeItems: "center",
          touchAction: "none"
        }, hd.css)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          style={{ transform: `rotate(${hd.rot}deg)` }}>
            <path d="M11 4v7H4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M11 8.5H8.5V11" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>);

}

// Shared site footer used on EVERY page. Small text pinned to the bottom.
// `marginTop: auto` lets it sink to the bottom when its parent is a flex column.
function SiteFooter({ bare, big, noResume, contentMaxWidth = 1080 }) {
  // Easter egg: the footer's "Secret" link asks first; App owns the player
  // itself so it survives navigation (this component remounts per route).
  const [secretAsk, setSecretAsk] = useStateAb(false);
  // Hide the trigger while the player is already up (App owns that state).
  const [brainrotOn, setBrainrotOn] = useStateAb(() => !!window.__brainrotOn);
  useEffectAb(() => {
    const sync = () => setBrainrotOn(!!window.__brainrotOn);
    sync();
    window.addEventListener("brainrotchange", sync);
    return () => window.removeEventListener("brainrotchange", sync);
  }, []);
  const style = bare ? { marginTop: "clamp(20px, 4vh, 48px)" } : { marginTop: "auto" };
  if (big) style.fontSize = 13.5;

  // Matches the easing used by the case-study "Back to top" link.
  const toTop = () => {
    const read = () =>
    window.scrollY || document.documentElement.scrollTop ||
    document.scrollingElement && document.scrollingElement.scrollTop || 0;
    const start = read();
    if (start < 4) return;
    if (typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
      return;
    }
    const dur = Math.min(1500, Math.max(700, start * 0.55));
    const clock = () => window.performance && performance.now ? performance.now() : Date.now();
    const t0 = clock();
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = () => {
      const p = Math.min(1, (clock() - t0) / dur);
      window.scrollTo(0, Math.round(start * (1 - ease(p))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Plain hash links rather than an onNavigate prop, so the footer works on
  // every page without each call site having to thread the router through.
  return (
    <footer
      className={"site-footer" + (bare ? " bare" : "")}
      style={style}>
      {/* Matches the page's own content cap so the footer lines up with
          everything above it on wide screens. */}
      <div className="footer-inner" style={{ maxWidth: contentMaxWidth }}>
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-meta">
            <div className="footer-signoff-title">Thanks for stopping by! ❤︎</div>
            <span style={{ color: "rgba(0,0,0,0.62)", fontSize: 13 }}>
              Designed by Serena + crafted with{" "}
              <a className="footer-link" href="https://www.anthropic.com/claude" target="_blank" rel="noreferrer noopener">Claude</a>
            </span>
            {/* Pushed to the bottom of the column so it baselines with the
                last nav link on the right. */}
            <a className="footer-link footer-email" href="mailto:serena.ng.contact@gmail.com">serena.ng.contact@gmail.com</a>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">Pages</div>
            <a className="footer-link" href="#/">Featured Work</a>
            <a className="footer-link" href="#/archive">Archive</a>
            <a className="footer-link" href="#/about">About</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Featured Work</div>
            <a className="footer-link" href="#/project/searchneu">SearchNEU</a>
            <a className="footer-link" href="#/project/jfk">JFK Airport</a>
            <a className="footer-link" href="#/project/ecolab">Reuters x Ecolab</a>
            <a className="footer-link" href="#/project/pomodoro">The Pomodoro Timer</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Archive</div>
            <a className="footer-link" href="#/archive/branding">Design</a>
            <a className="footer-link" href="#/archive/photography">Photography</a>
            <a className="footer-link" href="#/archive/misc">Miscellaneous</a>
            {/* Easter egg — desktop only. Fades out while it's running. */}
            <button
              className={"footer-link footer-secret" + (brainrotOn ? " is-hidden" : "")}
              aria-hidden={brainrotOn ? "true" : undefined}
              tabIndex={brainrotOn ? -1 : undefined}
              onClick={() => setSecretAsk(true)}>
              Secret~
            </button>
          </div>
          <div className="footer-col">
            <button className="footer-top-btn" onClick={toTop}>
              <span aria-hidden="true">↑</span> Back to top
            </button>
          </div>
        </div>
      </div>
      {secretAsk &&
      <SecretPrompt
        onNo={() => setSecretAsk(false)}
        onYes={() => {
          setSecretAsk(false);
          if (window.__activateBrainrot) window.__activateBrainrot();
        }} />
      }
      </div>
    </footer>);

}
window.SiteFooter = SiteFooter;

// Back-compat alias — older call sites used <SubpageNav/>.
function SubpageNav(props) {return <SiteNav {...props} />;}

function MetaItem({ label, value, link, role, org, href, roleShort, orgShort }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
      {label &&
      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.85)" }}>{label}</div>
      }
      <div style={{ fontSize: 15, fontWeight: 300, lineHeight: "22px", letterSpacing: "-0.02em", color: link ? "var(--accent)" : "rgba(0,0,0,0.7)" }}>
        {org ?
        <>
            {/* Long / short variants swap by CSS so the row fits on a phone. */}
            {roleShort ?
          <>
                <span className="meta-long">{role}</span>
                <span className="meta-short">{roleShort}</span>
              </> :
          role
          } <span style={{ color: "rgba(0,0,0,0.4)" }}>@</span>{" "}
            <a className="org-link" href={href} target="_blank" rel="noreferrer noopener">
              {orgShort ?
            <>
                  <span className="meta-long">{org}</span>
                  <span className="meta-short">{orgShort}</span>
                </> :
            org
            }
            </a>
          </> :
        value
        }
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Animated "My Journey" timeline.
// A gray track runs down the left; a purple fill flows down it as you
// scroll, and each card's dot lights up purple once the fill reaches it.
// ───────────────────────────────────────────────────────────────────
function Journey({ items }) {
  const containerRef = useRefAb(null);
  const [zoomed, setZoomed] = useStateAb(null);
  const itemRefs = useRefAb([]);
  const fillRef = useRefAb(null);
  const headRef = useRefAb(null);
  const trackRef = useRefAb(0);
  const activeRef = useRefAb(-1);
  const targetRef = useRefAb(0);   // scroll-driven target fill (0..1), no re-render
  const idxRef = useRefAb(-1);     // scroll-driven target active index
  const [progress, setProgress] = useStateAb(0); // smoothed 0..1 fill actually rendered
  const [trackPx, setTrackPx] = useStateAb(0); // pixel height of the track (container - insets)
  const [activeIdx, setActiveIdx] = useStateAb(-1);

  useEffectAb(() => {
    const TOP_INSET = 18,BOTTOM_INSET = 18;
    // sample() reads layout and stashes the TARGET fill/index in refs (no
    // setState) so scrolling never thrashes React. A steady ticker eases the
    // rendered value toward the target. We also call sample() inside the ticker
    // so the line keeps tracking during momentum scrolling on touch devices,
    // where scroll events fire sparsely — this is what makes it smooth on mobile.
    const sample = () => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.55; // line head sits ~55% down the viewport
      const track = Math.max(1, rect.height - TOP_INSET - BOTTOM_INSET);
      trackRef.current = track;
      setTrackPx((prev) => Math.abs(prev - track) > 1 ? track : prev);
      const travelled = triggerY - (rect.top + TOP_INSET);
      targetRef.current = Math.max(0, Math.min(1, travelled / track));
      // Active card = last dot the head has passed (viewport-relative).
      let idx = -1;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + 14 <= triggerY) idx = i; // dot center ≈ top + node radius
      });
      idxRef.current = idx;
    };
    window.addEventListener("scroll", sample, { passive: true });
    document.addEventListener("scroll", sample, { passive: true, capture: true });
    window.addEventListener("resize", sample);
    sample();

    // Smoothing loop. Uses requestAnimationFrame (NOT setInterval) so it runs
    // in step with the compositor — a 16ms timer drifts against the refresh
    // rate and gets throttled during touch-scroll, which is what made this
    // judder on mobile. The fill/head styles are written straight to the DOM
    // so a React re-render isn't needed every frame; only activeIdx (which
    // changes rarely) goes through state.
    let displayed = 0;
    let raf = 0;
    const EASE = 0.13; // lower = floatier/smoother
    const paint = (v) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${v})`;
      if (headRef.current) {
        headRef.current.style.top = (14 + v * trackRef.current) + "px";
        headRef.current.style.opacity =
        v > 0.01 && idxRef.current < items.length - 1 ? "1" : "0";
      }
    };
    const tick = () => {
      sample(); // continuously re-track (covers sparse touch-scroll events)
      const t = targetRef.current;
      const diff = t - displayed;
      if (Math.abs(diff) > 0.0006) {
        displayed += diff * EASE;
        paint(displayed);
      } else if (displayed !== t) {
        displayed = t;
        paint(t);
      }
      if (idxRef.current !== activeRef.current) {
        activeRef.current = idxRef.current;
        setActiveIdx(idxRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Re-measure shortly after mount in case fonts/images shift the layout.
    const t1 = setTimeout(sample, 100);
    const t2 = setTimeout(sample, 450);
    return () => {
      window.removeEventListener("scroll", sample);
      document.removeEventListener("scroll", sample, { capture: true });
      window.removeEventListener("resize", sample);
      cancelAnimationFrame(raf);
      clearTimeout(t1);clearTimeout(t2);
    };
  }, [items.length]);

  return (
    <div ref={containerRef} className="journey" style={{ position: "relative" }}>
      {/* Gray track */}
      <div className="journey-track" />
      {/* Purple fill — scaleY avoids the height-transition rendering quirk.
          transform/top/opacity are written by the rAF loop, not React. */}
      <div ref={fillRef} className="journey-fill" style={{ transform: `scaleY(${progress})` }} />
      {/* Glowing head of the line */}
      <div ref={headRef} className="journey-head" style={{
        top: 14 + progress * trackPx,
        opacity: progress > 0.01 && activeIdx < items.length - 1 ? 1 : 0
      }} />

      {items.map((j, i) => {
        const active = i <= activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <div
            key={i}
            ref={(el) => itemRefs.current[i] = el}
            className="journey-item"
            style={{ paddingBottom: i === items.length - 1 ? 0 : 28 }}>
            {/* Dot */}
            <div className={"journey-dot" + (active ? " is-active" : "")} style={{
              background: active ? "var(--accent)" : "var(--gray-50)",
              border: `1.5px solid ${active ? "var(--accent)" : "var(--muted)"}`,
              boxShadow: isCurrent ? "0 0 0 5px var(--accent-shadow)" : "0 0 0 0px var(--accent-shadow)",
              transition: "background .45s ease, border-color .45s ease, box-shadow .5s ease",
              zIndex: 2
            }} />
            {/* Card */}
            <div className="journey-card" style={{
              background: isCurrent ? "color-mix(in oklch, var(--accent) 4%, var(--paper))" : "var(--paper)",
              border: `1px solid ${isCurrent ? "color-mix(in oklch, var(--accent) 45%, var(--hair))" : "var(--hair)"}`,
              borderRadius: 16,
              padding: 18,
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: 22,
              alignItems: "start",
              boxShadow: isCurrent ?
              "2px 2px 6px -1px var(--shadow-soft), 0 10px 28px var(--accent-shadow)" :
              "2px 2px 6px -1px var(--shadow-soft)",
              transform: isCurrent ? "translateX(4px)" : "translateX(0)",
              // Soft easing when a card becomes the active/highlighted one.
              transition: "background .5s ease, border-color .5s ease, box-shadow .5s ease, transform .5s cubic-bezier(.22,.61,.36,1)"
            }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "var(--accent)" : "rgba(0,0,0,0.45)", marginBottom: 6, transition: "color .5s ease" }}>{j.year}</div>
                <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", marginBottom: 6 }}>{j.title}</div>
                <div style={{ fontWeight: 300, fontSize: 15, lineHeight: "21px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", whiteSpace: "pre-line" }}>
                  {String(j.body).split(/(Claude)/g).map((part, k) =>
                  part === "Claude" ?
                  <a key={k} className="footer-link" href="https://www.anthropic.com/claude" target="_blank" rel="noreferrer noopener">Claude</a> :
                  <React.Fragment key={k}>{part}</React.Fragment>
                  )}
                </div>
              </div>
              <ImageCaption src={j.src} title={j.imgTitle} caption={j.imgCaption} label={j.image} aspect="3 / 2" onZoom={setZoomed} />
            </div>
          </div>);

      })}
      {zoomed && <Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>);

}

// Contact form with true silent background submission via Formspree.
// ┌─────────────────────────────────────────────────────────────────┐
// │ SETUP: create a free form at https://formspree.io (use the inbox │
// │ serena.ng.contact@gmail.com), then paste its form ID below.       │
// │ e.g. an endpoint of https://formspree.io/f/xdoqlabc → "xdoqlabc". │
// │ Until that's done the form runs in DEMO mode (shows success       │
// │ without actually delivering).                                     │
// └─────────────────────────────────────────────────────────────────┘
const FORMSPREE_ID = "xgoqgklj";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/" + FORMSPREE_ID;
const FORMSPREE_CONFIGURED = FORMSPREE_ID !== "your_form_id";

function ContactForm() {
  const [email, setEmail] = useStateAb("");
  const [subject, setSubject] = useStateAb("");
  const [message, setMessage] = useStateAb("");
  const [status, setStatus] = useStateAb("idle"); // idle | sending | sent | error
  const EMAIL = "serena.ng.contact@gmail.com";

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    // Demo mode: no endpoint configured yet → simulate a successful send.
    if (!FORMSPREE_CONFIGURED) {
      setTimeout(() => {setStatus("sent");setEmail("");setSubject("");setMessage("");}, 700);
      return;
    }
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, _replyto: email, subject, message })
      });
      if (res.ok) {
        setStatus("sent");setEmail("");setSubject("");setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const onEdit = (setter) => (e) => {setter(e.target.value);if (status === "sent" || status === "error") setStatus("idle");};
  const sending = status === "sending";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: 48, alignItems: "start" }} className="contact-grid">
      <div>
        <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
          Get in touch
        </div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, letterSpacing: "-0.03em" }}>
          Contact Me
        </h2>
        <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", maxWidth: 360 }}>
          Feel free to reach out to me, even if it's just a small question or for a coffee chat! Any portfolio feedback is also greatly appreciated :)
        </p>
        <a className="org-link" href={"mailto:" + EMAIL} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 14 }}>
          {EMAIL}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 9l6-6M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="cf-email">Your email</label>
          <input
            id="cf-email"
            className="field-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={onEdit(setEmail)}
            required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="cf-subject">Subject</label>
          <input
            id="cf-subject"
            className="field-input"
            type="text"
            placeholder="What's this about?"
            value={subject}
            onChange={onEdit(setSubject)}
            required />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label" htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            className="field-input"
            placeholder="Tell me a little about what you have in mind…"
            value={message}
            onChange={onEdit(setMessage)}
            required />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <button className="pill-btn about-cta" type="submit" disabled={sending} style={{ fontSize: 14, padding: "11px 20px", opacity: sending ? 0.7 : 1, cursor: sending ? "default" : "pointer" }}>
            {sending ? "Sending…" : <>Send Message <span className="arr">→</span></>}
          </button>
          {status === "sent" &&
          <div
            role="status"
            aria-live="polite"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, letterSpacing: "-0.01em", color: "#1F8A4D",
              pointerEvents: "none"
            }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%", background: "#1F8A4D",
              display: "grid", placeItems: "center", flexShrink: 0
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Message sent — thank you!
          </div>
          }
          {status === "error" &&
          <div role="status" aria-live="polite" style={{ fontSize: 14, letterSpacing: "-0.01em", color: "#C0392B" }}>
            Couldn't send — please email me directly at {EMAIL}.
          </div>
          }
        </div>
      </form>
    </div>);

}

function About({ onNavigate }) {
  const journey = [
  { year: "Childhood", title: "Raised by a problem solver",
   body: "My dad taught me to work smarter, not harder, and to design for real people in real contexts. When we kept losing our green garden tools in the grass, his fix was simple: tie on bright ribbons. I've been chasing better solutions ever since.",
  src: "assets/funPics/journey/dad.jpg", image: "childhood", imgTitle: "Me and my dad", imgCaption: "Where the habit of looking for a better way started." },
  { year: "High school", title: "Discovering design",
   body: "I got into design in high school through a graphic design class. My teacher helped me get Adobe Creative Cloud over the summer, and I spent it working through every YouTube tutorial I could find.",
  src: "assets/funPics/journey/highschool.png", image: "high school", imgTitle: "First designs", imgCaption: "A summer spent inside Photoshop and Illustrator." },
  { year: "High School / College", title: "Exploring UX design",
   body: "I picked up Adobe XD next, just to try it. Watching my static designs become interactive sparked my interest, and I fell in love with the whole UX process, from research to iteration.",
  src: "assets/funPics/journey/firstux.png", image: "UX", imgTitle: "My first ever UX project", imgCaption: "The first time I made a static design interactive." },
  { year: "Ronik Design", title: "Working at an agency",
   body: "My time at Ronik Design taught me to wear a lot of hats: graphic design, UX/UI, animation, often across several client projects at once. Constant feedback, revisions, and pitches made the work exciting and incredibly rewarding.",
  src: "assets/funPics/journey/ronik.webp", image: "Ronik", imgTitle: "NYC, Ronik studio", imgCaption: "Juggling client projects across a lot of disciplines." },
  { year: "Now", title: "Always learning and growing",
   body: "Design is moving faster than ever. New tools are putting more power directly into designers' hands, and AI is already reshaping what UX even looks like.\n\nI built this portfolio with Claude in a fraction of the usual time, so I've felt that shift first-hand. I'm excited for what's next and will keep exploring.",
  src: "assets/funPics/journey/claude.png", image: "now", imgTitle: "Building with AI", imgCaption: "This portfolio, and other projects I'm experimenting with." }];


  // Images for the "What I've been up to..." section
  const recent = [
  { label: "photography", imgTitle: "Photography", imgCaption: "Mostly shot on my Canon EOS R50 when I'm exploring new places.", src: "assets/funPics/photography-camera.png" },
  { label: "drinks", imgTitle: "Drink making", imgCaption: "Homemade syrups, matcha lattes, and espresso drinks.", src: "assets/funPics/matcha-homemade.png" },
  { label: "tinkering", imgTitle: "Tinkering", imgCaption: "I love exploring new tools and making things with my hands.", src: "assets/funPics/tinkering-arduino.png" },
  { label: "games", imgTitle: "Card & board games", imgCaption: "Some of my favs are Open-Face Chinese Poker and the Nature board game.", src: "assets/funPics/cards-chinese-poker.png" },
  { label: "concerts", imgTitle: "Concert going", imgCaption: "Most recently, I saw BTS during their Arirang world tour!", src: "assets/funPics/concert-bts.jpeg" },
  { label: "sleight", imgTitle: "Sleight of hand", imgCaption: "Cards are a great fidget toy and party trick.", videoSrc: "assets/funPics/sleight-of-hand.mp4" }];


  const contactRef = useRefAb(null);
  const [zoomedRecent, setZoomedRecent] = useStateAb(null);
  const scrollToContact = () => {
    const el = contactRef.current;
    if (!el) return;
    const scroller = document.scrollingElement || document.documentElement;
    const startY = window.scrollY || scroller && scroller.scrollTop || 0;
    const targetY = el.getBoundingClientRect().top + startY - 72;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    // Duration scales with distance so short and long jumps both feel smooth.
    const dur = Math.min(1500, Math.max(700, Math.abs(dist) * 0.55));
    const clock = () => window.performance && performance.now ? performance.now() : Date.now();
    const t0 = clock();
    // Ease in-out — gentle acceleration and a soft landing.
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const setY = (v) => {window.scrollTo(0, v);if (scroller) scroller.scrollTop = v;};
    const iv = setInterval(() => {
      const t = Math.min(1, (clock() - t0) / dur);
      setY(startY + dist * ease(t));
      if (t >= 1) clearInterval(iv);
    }, 16);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <SubpageNav onNavigate={onNavigate} current="about" />

      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", padding: "60px 40px 100px" }}>
        {/* Hero — text + photo */}
        <div className="about-hero" style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 32, letterSpacing: "-0.035em" }}>
              <span className="howdy-word">Howdy</span>,<span className="howdy-break" />{" "}I'm Serena! <span className="howdy-wave" style={{ display: "inline-block" }}>👋</span>
            </h1>
            <p style={{ margin: "14px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.78)", textWrap: "pretty" }} className="about-intro-p">
              I'm a designer who's worn a lot of hats, including product research, UX/UI, visual design, development, and marketing. <strong style={{ fontWeight: 600, color: "rgba(0,0,0,0.92)" }}>I've learned that the best solutions rarely stay inside one discipline.</strong>
            </p>
            <p style={{ margin: "13px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.78)", textWrap: "pretty" }} className="about-intro-p">
              I've worked shoulder-to-shoulder with engineers, marketers, and clients across startups and agencies. I care less about which hat I'm wearing and more about <strong style={{ fontWeight: 600, color: "rgba(0,0,0,0.92)" }}>solving the right problem: the one with the most impact, and the one that holds up as the product grows.</strong>
            </p>
            <div style={{ marginTop: 20 }}>
              {/* Matches the contact form's Send message button. */}
              <button className="pill-btn about-cta" onClick={scrollToContact} style={{ fontSize: 14, padding: "11px 20px" }}>
                Contact Me
              </button>
            </div>
          </div>
          <WavingPortrait />
        </div>

        {/* Two columns: Experience + Client work. minmax(0,1fr) stops the
            logo marquee's max-content track from inflating its column and
            squeezing Experience. */}
        <div className="about-two-col" style={{ marginTop: 56, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Experience</div>
            <MetaItem role="UX Quality Manager (Software R&D)" org="Epic Systems" orgShort="Epic" href="https://www.epic.com/" />
            <MetaItem role="UX & Visual Designer" org="Ronik Design Agency" href="https://www.ronikdesign.com/" />
            <MetaItem role="Product Designer & Researcher" org="Snyk Cybersecurity" orgShort="Snyk" href="https://snyk.io/" />
            <MetaItem role="UX Designer" org="SearchNEU" href="https://searchneu.com/" />
            <MetaItem role="UX Designer" org="Sandbox Software Consultancy" href="https://www.sandboxnu.com/" />
            <MetaItem role="Game UX/UI Design Intern" org="Tanbii" href="https://www.tanbii.com/" />
            <MetaItem role="Graphic & UI Design Intern" roleShort="Design Intern" org="Waquoit Bay National Research" href="https://waquoitbayreserve.org/" />
            <MetaItem role="BFA in UX Design" org="Northeastern University" href="https://www.northeastern.edu/" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Client Work</div>
            <p style={{ margin: 0, fontWeight: 300, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              My client work has spanned UX/UI, research, and visual design for organizations like{" "}
              <a href="https://plus.reuters.com/p/1" className="org-link" target="_blank" rel="noreferrer noopener">Reuters Plus</a>,{" "}
              <a href="https://www.jfkairport.com/explore-jfk/terminals/terminal-4" className="org-link" target="_blank" rel="noreferrer noopener">JFK Airport</a>,{" "}
              <a href="https://together.nbcuni.com/home/" className="org-link" target="_blank" rel="noreferrer noopener">NBCUniversal</a>,{" "}
              <a href="https://www.ogilvy.com/" className="org-link" target="_blank" rel="noreferrer noopener">Ogilvy</a>,{" "}
              <a href="https://www.ecolab.com/en-us" className="org-link" target="_blank" rel="noreferrer noopener">Ecolab</a>,{" "}
              <a href="https://www.pgim.com/us/en/institutional" className="org-link" target="_blank" rel="noreferrer noopener">PGIM</a>,{" "}
              <a href="https://www.leadingedge.org/" className="org-link" target="_blank" rel="noreferrer noopener">Leading Edge</a>,{" "}
              <a href="https://www.flomktg.com/" className="org-link" target="_blank" rel="noreferrer noopener">Flo. Marketing</a>,
              and more.
            </p>
            <p style={{ margin: "13px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              These projects range from large-scale B2B SaaS enterprise platforms to fast-moving agency campaigns.
            </p>
            <p style={{ margin: "13px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", fontStyle: "italic" }}>
              Got an opportunity for me?{" "}
              {/* Only this phrase is the link — purple, scrolls to Contact. */}
              <span
                role="link"
                tabIndex={0}
                onClick={scrollToContact}
                onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();scrollToContact();}}}
                onMouseEnter={(e) => {e.currentTarget.style.textDecorationColor = "currentColor";}}
                onMouseLeave={(e) => {e.currentTarget.style.textDecorationColor = "transparent";}}
                onFocus={(e) => {e.currentTarget.style.textDecorationColor = "currentColor";}}
                onBlur={(e) => {e.currentTarget.style.textDecorationColor = "transparent";}}
                style={{
                  cursor: "pointer",
                  color: "var(--accent)",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  textUnderlineOffset: 3,
                  transition: "text-decoration-color .2s ease"
                }}>
                Let's chat!
              </span>
            </p>
            {/* Auto-scrolling logo marquee. Order matches the sentence in this section.
                Two copies of the list make the loop seamless. */}
            <div className="logo-marquee">
              <div className="logo-track">
                {/* Not lazy-loaded: the duplicate copy sits off-screen to the
                    right, and deferring it would leave gaps mid-loop. The
                    second copy is hidden from assistive tech and taken out of
                    the tab order so each client is announced only once. */}
                {[].concat(CLIENT_LOGOS, CLIENT_LOGOS).map((l, i) => {
                  const dup = i >= CLIENT_LOGOS.length;
                  return (
                    <a
                      key={i}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-hidden={dup ? "true" : undefined}
                      tabIndex={dup ? -1 : undefined}
                      aria-label={dup ? undefined : l.name}>
                      <img src={l.src} alt={dup ? "" : l.name} decoding="async" style={{ height: l.h }} />
                    </a>);

                })}
              </div>
            </div>
          </div>
        </div>

        {/* My Journey — animated timeline */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 24 }}>My Journey</div>
          <Journey items={journey} />
        </div>

        {/* What I've been up to */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>What I've been up to lately...</div>
          <div style={{ fontSize: 14, fontWeight: 300, color: "rgba(0,0,0,0.6)", letterSpacing: "-0.02em", marginBottom: 24 }}>
            A few things I spend my time on outside of work.
          </div>
          <div className="recent-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {recent.map((r, i) =>
            <ImageCaption key={i} src={r.src} videoSrc={r.videoSrc} title={r.imgTitle} caption={r.imgCaption} label={r.label} aspect="4 / 3" mobileTitleOnly={true} onZoom={setZoomedRecent} />
            )}
          </div>
          {zoomedRecent && <Lightbox item={zoomedRecent} onClose={() => setZoomedRecent(null)} />}
        </div>

        {/* Contact — separated section with its own form */}
        <div ref={contactRef} style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid var(--hair)" }}>
          <ContactForm />
        </div>
      </div>
      <window.SiteFooter />
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Playground
// ───────────────────────────────────────────────────────────────────
// Category data lives at module scope so the Archive pages can reuse it.
// Shorter card blurbs for mobile, where the desktop wording wraps awkwardly.
// Falls back to the project's own blurb when there's no override.
const DESIGN_BLURBS_MOBILE = {
  "flo-marketing": "Brand identity redesign for a B2B marketing agency",
  "lovers-club": "Exploring different fandoms with typography",
  "boba-book": "A 50+ page book with typographic and layout systems",
  "pomodoro-timer": "A non-distracting yet satisfying productivity tool",
  "nasa-worldview": "Redesigned UI to visualize satellite imagery and data"
};

const PLAYGROUND_CATEGORIES = {
  photography: {
    emoji: "📷",
    title: "Photography",
    tabLabel: "Photo Archive",
    archiveTitle: "Photography Archive",
    archiveIntro: "Mostly shot on a Canon EOS R50 — catch me exploring new places and occasionally taking graduation pictures",
    body: "",
    archiveLabel: "Photo Archive",
    items: [
    { label: "autumn", imgTitle: "Autumn in Wisconsin", imgCaption: "The view of Wisconsin's colorful trees in autumn.", src: "assets/playground/photography/autumn_wisconsin.jpg" },
    { label: "chinatown", imgTitle: "Boston's Chinatown", imgCaption: "The Chinatown Gate after a fresh snowfall.", src: "assets/playground/photography/chinatown.jpg" },
    { label: "clocktower", imgTitle: "The Custom House Tower", imgCaption: "The clocktower peeping through the streets of Boston.", src: "assets/playground/photography/clocktower.jpeg" },
    { label: "foggyTreeBranch", imgTitle: "A foggy night", imgCaption: "Every foggy night is optimal photography time.", src: "assets/playground/photography/foggy_tree_branch.jpg" },
    { label: "foggyTreeCar", imgTitle: "Autumn at night", imgCaption: "A street light illuminating autumn leaves and a car.", src: "assets/playground/photography/foggy_tree_car.jpg" },
    { label: "westEnd", imgTitle: "Boston's West End", imgCaption: "Looking down Causeway St, where the old brick meets the new glass.", src: "assets/playground/photography/boston_west_end.png" },
    { label: "balconies", imgTitle: "Milwaukee balconies", imgCaption: "Afternoon light on a row of apartment balconies.", src: "assets/playground/photography/milwaukee_balconies.jpg" },
    { label: "riMansion", imgTitle: "A Rhode Island mansion", imgCaption: "Light pouring into one of the Newport mansions.", src: "assets/playground/photography/ri_mansion.png" },
    { label: "foggyNight", imgTitle: "Streetlight in the fog", imgCaption: "An overgrown street light on a foggy night in Wisconsin.", src: "assets/playground/photography/foggy_streetlight.jpg" },
    { label: "longWharf", imgTitle: "Long Wharf in the rain", imgCaption: "Boston Harbor on a rainy night, captured with flash.", src: "assets/playground/photography/long_wharf_rain.webp" }]

  },
  branding: {
    emoji: "🎨",
    title: "Design",
    tabLabel: "Design Archive",
    archiveTitle: "Design Archive",
    archiveIntro: "Graphic design, branding systems, and UX/UI work — spanning client projects, student org merch, and self-initiated experiments",
    body: "",
    archiveLabel: "Design Archive",
    // This archive is filterable and each item has its own detail page.
    filters: ["All", "Graphic", "Branding", "UX/UI"],
    projects: [
    {
      slug: "flo-marketing",
      kinds: ["Branding", "Graphic"],
      title: "Flo. Marketing",
      blurb: "Brand identity redesign for a tech-forward B2B marketing agency",
      src: "assets/playground/design/thumbs/flo.jpg",
      client: { label: "Flo. Marketing", href: "https://www.flomktg.com/" },
      role: "Visual Designer\nBranding, Graphic Design,\nMotion Design, UI Design",
      body: [
        "Flo. Marketing is a B2B strategy and marketing firm partnering with high-growth startups and Fortune 500 companies alike, offering go-to-market programs, fractional CMO services, and brand development. After 7+ years of success, Flo. was ready for an outward presence that matched their strategic focus and ambition.",
        "I helped redesign the brand identity around the new logo's signature \u201cdot\u201d as a graphical motif, plus a library of custom icons representing common ideas in Flo.'s marketing language. I animated those icons, built out brand touchpoints, and assisted on 3D graphics that extend the iconography into visual backdrops.",
        "After pitching several directions and collaborating with the client through review rounds, we delivered the brand identity the agency uses today. Created using Figma, Illustrator, After Effects, and Cinema 4D."
      ],
      images: [
      { src: "assets/playground/design/flo/logo.webp", flat: true, caption: "The Flo. Marketing logo, with its signature dot." },
      { src: "assets/playground/design/flo/spread-of-designs.webp", flat: true, caption: "A spread of brand guideline pages and applications." },
      { src: "assets/playground/design/flo/brand-personality.webp", flat: true, caption: "The brand personality slide, pairing icons with brand traits." },
      { src: "assets/playground/design/flo/icon-gallery.webp", flat: true, caption: "The full custom icon library." },
      { videoSrc: "assets/playground/design/flo/logo-icons-animation.mp4", flat: true,
        half: "left",
        plain: true,
        textTitle: "Iconography built from the logo",
        text: [
          "Every icon is constructed from the same geometry as the logotype \u2014 circles, quarter-rounds, and the signature dot \u2014 so the whole set reads as one family and traces directly back to the mark.",
          "The library covers the ideas Flo. talks about most: strategy, flow, clarity, collaboration, and sales enablement. Each icon had to stay legible at small sizes and hold up in both light and dark contexts."
        ] },
      { videoSrc: "assets/playground/design/flo/iconography-animation.mp4", flat: true,
        half: "right",
        plain: true,
        textTitle: "Motion that shows the system working",
        text: [
          "I animated the icons so their construction becomes visible \u2014 shapes rotate and resolve into the final form, reinforcing that each one is built from the same parts.",
          "These loops give Flo. flexible motion assets for their site, social posts, and presentations, and make the identity feel as adaptable as the services it represents."
        ] },
      { videoSrc: "assets/playground/design/flo/3d-render-background.mp4", flat: true, caption: "3D renders that extend the iconography into visual backdrops." },
      { src: "assets/playground/design/flo/3d-renders-spread.webp", flat: true, caption: "A library of 3D render stills for use across brand materials." },
      { src: "assets/playground/design/flo/business-cards.webp", flat: true, caption: "Business cards in the brand's black, white, and mint palette." },
      { src: "assets/playground/design/flo/assets.webp", flat: true, caption: "Brand assets and templates across formats." },
      { src: "assets/playground/design/flo/social-media.webp", flat: true, caption: "Social media posts applying the system at scale." },
      { src: "assets/playground/design/flo/info-sheet.webp", flat: true, caption: "The one-page info sheet, front and back." },
      { src: "assets/playground/design/flo/3d-logo-render.webp", flat: true, caption: "An artistic 3D render of the logo." }]

    },
    {
      slug: "boba-book",
      kind: "Graphic",
      title: "The Boba Book",
      blurb: "A 50+ page book designed with typographic and layout systems",
      src: "assets/playground/design/thumbs/boba-book.jpg",
      year: "10 x 8 inches\nBook",
      role: "Sole Designer\nBook Design & Layout",
      body: [
        "This book covers everything about boba — the history of tea, how boba is made, its cultural impact, matcha, and a set of recipes.",
        "The book was designed in Adobe InDesign, using master pages, paragraph and character styles, and a baseline grid so the 50+ pages stayed consistent. Illustrator handled the cover artwork and the vector elements throughout."
      ],
      book: {
        cover: "assets/playground/design/boba-book/web/page-cover.jpg",
        spreads: [
        "assets/playground/design/boba-book/web/page-02.jpg",
        "assets/playground/design/boba-book/web/page-03.jpg",
        "assets/playground/design/boba-book/web/page-04.jpg",
        "assets/playground/design/boba-book/web/page-05.jpg",
        "assets/playground/design/boba-book/web/page-06.jpg",
        "assets/playground/design/boba-book/web/page-07.jpg",
        "assets/playground/design/boba-book/web/page-08.jpg",
        "assets/playground/design/boba-book/web/page-09.jpg",
        "assets/playground/design/boba-book/web/page-10.jpg",
        "assets/playground/design/boba-book/web/page-11.jpg",
        "assets/playground/design/boba-book/web/page-12.jpg",
        "assets/playground/design/boba-book/web/page-13.jpg",
        "assets/playground/design/boba-book/web/page-14.jpg",
        "assets/playground/design/boba-book/web/page-15.jpg",
        "assets/playground/design/boba-book/web/page-16.jpg",
        "assets/playground/design/boba-book/web/page-17.jpg",
        "assets/playground/design/boba-book/web/page-18.jpg",
        "assets/playground/design/boba-book/web/page-19.jpg",
        "assets/playground/design/boba-book/web/page-20.jpg",
        "assets/playground/design/boba-book/web/page-21.jpg",
        "assets/playground/design/boba-book/web/page-22.jpg",
        "assets/playground/design/boba-book/web/page-23.jpg",
        "assets/playground/design/boba-book/web/page-24.jpg",
        "assets/playground/design/boba-book/web/page-25.jpg",
        "assets/playground/design/boba-book/web/page-26.jpg",
        "assets/playground/design/boba-book/web/page-27.jpg",
        "assets/playground/design/boba-book/web/page-28.jpg",
        "assets/playground/design/boba-book/web/page-29.jpg",
        "assets/playground/design/boba-book/web/page-30.jpg",
        "assets/playground/design/boba-book/web/page-31.jpg"]

      },
      images: []

    },
    {
      slug: "lovers-club",
      kind: "Graphic",
      title: "Lovers' Club Magazine",
      blurb: "Exploring different fandoms using storytelling and experimental typography",
      src: "assets/playground/design/thumbs/lovers-club.jpg",
      year: "8.5 x 11 inches\nMagazine",
      role: "Sole Designer\nEditorial Design & Typography",
      body: [
        "Volume 1 of Lovers' Club magazine explores the BTS fandom and BTS' rise from their 2013 debut to breaking into the international market.",
        "Every spread conveys a part of their journey, but using design restrictions such as a limited color palette and use of experimental typography rather than images."
      ],
      book: {
        cover: { src: "assets/playground/design/lovers-club/web/page-01.jpg", half: "right" },
        aspect: "1.546 / 1",
        spreads: [
        "assets/playground/design/lovers-club/web/page-02.jpg",
        "assets/playground/design/lovers-club/web/page-03.jpg",
        "assets/playground/design/lovers-club/web/page-04.jpg",
        "assets/playground/design/lovers-club/web/page-05.jpg",
        "assets/playground/design/lovers-club/web/page-06.jpg",
        "assets/playground/design/lovers-club/web/page-07.jpg"]

      },
      images: []
    },
    {
      slug: "typography-poster",
      kind: "Graphic",
      title: "Typography Guide Poster",
      blurb: "50+ typographic terms explained and illustrated",
      src: "assets/playground/design/thumbs/typography-poster.jpg",
      year: "24 x 36 inches\nPoster",
      role: "Sole Designer\nTypographic Design",
      body: [
        "A reference poster defining and illustrating over 50 typographic terms — from anatomy like the bowl, spine, and vertex to measurement systems like picas and points.",
        "The design is themed around Santiago Calatrava, the Spanish architect, structural engineer, sculptor, and painter known for his bridges, railway stations, and other structures heavily inspired by organic sculptural forms. Designed in Adobe InDesign and Illustrator."
      ],
      images: [
      { src: "assets/playground/design/typography-poster/thumbnail.png", caption: "The poster, displayed on a wall." },
      { src: "assets/playground/design/typography-poster/web/poster.jpg", caption: "The full poster — click for fullscreen.", flat: true }]

    },
    {
      slug: "pomodoro-timer",
      kind: "UX/UI",
      title: "The Pomodoro Timer",
      blurb: "A non-distracting yet satisfying productivity tool for the Apple Watch",
      src: "assets/playground/design/thumbs/pomodoro.jpg",
      year: "watchOS\nApple Watch App",
      role: "Sole Designer\nUI Design, Interaction Design,\nVisual Specifications",
      body: [
        "An Apple Watch app that brings the Pomodoro Technique to the wrist \u2014 set a focus length, a break length, and a number of sets, then let the watch handle the rhythm while you keep your phone out of reach.",
        "The design leans on the Watch's constraints rather than fighting them: a single ring carries the timer and productivity stats sit one swipe away. Complications surface remaining focus and break time directly on the watch face, so checking progress never means opening the app.",
        "I documented the full system \u2014 color, type, UI component dimensions, complications, and the end-to-end workflow \u2014 as a set of visual design specs ready for handoff."
      ],
      images: [
      { src: "assets/playground/design/pomodoro/thumbnail.png", caption: "The app's primary screens across a set of Apple Watches.", shadow: true },
      { videoSrc: "assets/playground/design/pomodoro/demo-2-watches.mp4", plain: true, flat: true },
      { src: "assets/playground/design/pomodoro/3d-mockup.png", caption: "3D render of the app and its complications on device." },
      { src: "assets/playground/design/pomodoro/slide-01-title.png", flat: true, caption: "Visual design specs \u2014 title." },
      { src: "assets/playground/design/pomodoro/slide-02-overview.png", flat: true, caption: "Overview." },
      { src: "assets/playground/design/pomodoro/slide-03-screens-1.png", flat: true, caption: "Primary app screens \u2014 home, setup, and productivity stats." },
      { src: "assets/playground/design/pomodoro/slide-04-screens-2.png", flat: true, caption: "Primary app screens \u2014 focus timer, controls, and break." },
      { src: "assets/playground/design/pomodoro/slide-05-colors.png", flat: true, caption: "Specifications \u2014 colors." },
      { src: "assets/playground/design/pomodoro/slide-06-typography.png", flat: true, caption: "Specifications \u2014 typography." },
      { src: "assets/playground/design/pomodoro/slide-07-ui-components.png", flat: true, caption: "Specifications \u2014 UI components." },
      { src: "assets/playground/design/pomodoro/slide-08-complications-1.png", flat: true, caption: "Specifications \u2014 complications." },
      { src: "assets/playground/design/pomodoro/slide-09-complications-2.png", flat: true, caption: "Specifications \u2014 complications on the watch face." },
      { src: "assets/playground/design/pomodoro/slide-10-workflow.png", flat: true, caption: "Implementation \u2014 the end-to-end workflow." },
      { videoSrc: "assets/playground/design/pomodoro/final-demo.mp4", plain: true, flat: true }]

    },
    {
      slug: "media-harmony",
      kind: "UX/UI",
      title: "Media Harmony",
      blurb: "WordPress plugin for managing website files",
      src: "assets/playground/design/thumbs/media-harmony.jpg",
      year: "Web\nWordPress Plugin",
      role: "UX Designer\nProduct Design, UI Design",
      body: [
        "Media Harmony is a WordPress plugin that helps site owners find and remove unused media files, keeping media libraries lean and site performance high.",
        "I designed the plugin's dashboard around a scannable table of unlinked files \u2014 file type, size, ID, and path at a glance \u2014 with per-row Preserve and Delete actions, file-type filters, and a bulk delete for clearing everything at once. A file type breakdown chart gives an at-a-glance sense of what's taking up space.",
        "Because deleting media is irreversible, the design leans on clear safeguards: preserve-first framing, size warnings on unexpectedly large files, and a dedicated FAQ and support page answering the questions users have before they commit."
      ],
      images: [
      { src: "assets/playground/design/media-harmony/home.png", caption: "The dashboard, with file stats, a type breakdown, and the unlinked files table." },
      { src: "assets/playground/design/media-harmony/scrolled.png", caption: "The unlinked files table, with type filters, size warnings, and per-row actions." },
      { src: "assets/playground/design/media-harmony/faq.png", caption: "The FAQ and support page, answering questions before users delete anything." }]

    },
    {
      slug: "nasa-worldview",
      kind: "UX/UI",
      title: "NASA Worldview",
      blurb: "A redesigned tool for visualizing NASA's satellite imagery and data",
      src: "assets/playground/design/thumbs/nasa-worldview.jpg",
      year: "Web\nData Visualization Tool",
      role: "UX Designer\nInteraction Design, UI Design",
      body: [
        "NASA Worldview lets anyone browse full-resolution satellite imagery of the entire Earth, layer by layer and day by day. Its power is enormous, but the interface asks a lot of newcomers: dozens of near-identically named data layers, a dense timeline, and controls competing for the same corners of the screen.",
        "I redesigned the layer and timeline experience \u2014 grouping similar layers so duplicate readings collapse into one entry, clarifying per-layer controls for visibility, settings, and removal, and giving map elements their own section separate from data layers.",
        "A guided walkthrough introduces the dataset behind what you're looking at, so a first-time visitor can understand a wildfire detection map without needing to know which satellite captured it."
      ],
      images: [
      { src: "assets/playground/design/nasa-worldview/full.png", caption: "The redesigned Worldview interface, with grouped layers and a guided dataset walkthrough." },
      { src: "assets/playground/design/nasa-worldview/zoomed.png", caption: "A closer look at the layer panel, per-layer controls, and map elements." }]

    },
    {
      slug: "leading-edge",
      kind: "UX/UI",
      title: "Leading Edge",
      blurb: "Redesigned web page for a non-profit",
      src: "assets/playground/design/thumbs/leading-edge.jpg",
      client: { label: "Leading Edge", href: "https://www.leadingedge.org/" },
      role: "UX Designer\nWeb Design, Interaction Design",
      body: [
        "Leading Edge is a non-profit focused on leadership and culture in Jewish organizations. After a recent acquisition, their Our Team page had to accommodate far more people than it was built for \u2014 executive team, staff, board, and past board members all on one page.",
        "I redesigned the page around a sliding photo gallery cut into the brand's slanted motif, so the header carries the identity rather than sitting apart from it. Person cards use custom hover animations that bring each individual forward on the grid.",
        "A sticky navigation bar pins to the top as you scroll, letting visitors quickly jump between different Our Team sections of the page which now runs long by necessity."
      ],
      images: [
      { src: "assets/playground/design/leading-edge/our-team.png", caption: "The redesigned Our Team & Board page, with the slanted gallery and sticky section nav." }]

    },
    {
      slug: "cant-decide",
      kinds: ["Branding", "Graphic"],
      title: "Can't Decide?",
      blurb: "Brand identity for a mystery flavored drink brand",
      src: "assets/playground/design/thumbs/cant-decide.jpg",
      year: "Packaging, Print, Web\nBrand Identity",
      role: "Visual Designer\nBranding, Packaging,\nAdvertising, Web Design",
      body: [
        "Can't Decide? sells mystery flavored seltzer, tea, and coffee in limited edition flavor drops. Nobody knows what they're getting \u2014 the flavor names are deliberately useless and nonsensical.",
        "A pixelated question mark anchors the system, rendered in shifting holographic gradients. The advertising never promises a specific flavor. Instead, it dares you to take a chance, which is what makes the brand worth posting about.",
        "Online, that curiosity breeds virality and is extended to the website brand touchpoint. A quiz of intentionally absurd questions picks a flavor on your behalf, and visitors can request any flavor idea and follow upcoming drops. The rewards system allows you to unlock a rare special flavor after ten purchases, thus rewarding the risk-taking the brand runs on."
      ],
      images: [
      { src: "assets/playground/design/cant-decide/cover.png", caption: "Brand cover for Can't Decide?" },
      { src: "assets/playground/design/cant-decide/drinks.png", caption: "Packaging across the three product lines: seltzer, tea, and coffee." },
      { src: "assets/playground/design/cant-decide/subway.png", caption: "The campaign in place \u2014 three subway posters announcing flavor drops." },
      { row: [
        { src: "assets/playground/design/cant-decide/poster-1.png", caption: "Flavor #7 \u2014 a grouping of five galaxies." },
        { src: "assets/playground/design/cant-decide/poster-2.png", caption: "\u201cSame boring routine? Spice it up.\u201d" },
        { src: "assets/playground/design/cant-decide/poster-3.png", caption: "Flavor #4.8 \u2014 beloved by dolphins, but not sea turtles." }],
        flat: true, gap: 28, spaceAbove: 8 },
      { src: "assets/playground/design/cant-decide/website-home.png", caption: "The homepage, leading with the next incoming flavor drop." },
      { src: "assets/playground/design/cant-decide/website-quiz.png", caption: "The Discover Your Flavor quiz \u2014 nonsense questions, decisive answers." }]

    },
    {
      slug: "airwalk-magazine",
      kind: "Graphic",
      title: "Airwalk Magazine Cover",
      blurb: "A cover for a magazine all about skateboarding",
      src: "assets/playground/design/thumbs/airwalk.jpg",
      year: "8.5 x 11 inches\nMagazine Cover",
      role: "Sole Designer\nEditorial Design & Typography",
      body: [
        "A cover for Airwalk, a skateboarding magazine, built around a silhouetted skater caught mid-air against a sunset skate park.",
        "The masthead uses a heavy bubble letterform that nods to 90s skate graphics and graffiti, paired with stencil and typewriter faces for the cover lines. Hand-drawn stars, arrows, and a starburst badge keep the layout feeling closer to a sticker-covered board than a newsstand grid. Designed in Adobe Illustrator."
      ],
      images: [
      { src: "assets/playground/design/airwalk/mockup.png", caption: "The printed cover, mocked up." },
      { src: "assets/playground/design/airwalk/web/cover.jpg", caption: "The full cover \u2014 click for fullscreen.", flat: true, spaceAbove: 34, width: "min(100%, 480px)" }]

    },
    {
      slug: "design-culture-now",
      kind: "Graphic",
      title: "Design Culture Now",
      blurb: "Poster for a series of guest speaker events",
      src: "assets/playground/design/thumbs/design-culture-now.jpg",
      year: "18 x 24 inches\nPoster",
      role: "Sole Designer\nTypographic Design",
      body: [
        "A promotional poster for Design Culture Now, a guest speaker series at Northeastern University's Center for Design featuring Jerome Harris, Sulki & Min, Space Type Continuum, and M\u00e9ndez Communications.",
        "Oversized display serifs stack down the sheet in green, yellow, and coral against deep navy, while a white connective line threads between each speaker's details \u2014 tying four separate events into one continuous conversation. Designed in Adobe InDesign and Illustrator."
      ],
      images: [
      { src: "assets/playground/design/design-culture-now/mockup.png", caption: "The poster, framed and displayed." },
      { src: "assets/playground/design/design-culture-now/web/poster.jpg", caption: "The full poster \u2014 click for fullscreen.", flat: true, spaceAbove: 34, width: "min(100%, 420px)" }]

    },
    {
      slug: "neu-dragon",
      kinds: ["Branding", "Graphic", "UX/UI"],
      title: "NEU Dragon and Lion Dance Troupe",
      blurb: "Revamped brand identity and online presence",
      src: "assets/playground/design/neu-dragon/website-home.avif",
      client: { label: "NEU Dragon & Lion Dance", href: "https://neudragonliondance.org/" },
      role: "Designer & Web Developer\nBranding, Graphic Design,\nWeb Design & Development",
      body: [
        "I promoted the troupe by developing and maintaining its visual and digital presence. (I was also a dragon dancer!) I redesigned the logo to incorporate lion dance, which was a new addition to the troupe following us getting the equipment for it.",
        "I designed 30+ social media posts, 5+ poster designs, 15+ merch designs (clothing, keychains, pins), and designed and developed (with HTML, CSS, Javascript) the website from scratch.",
        "By increasing the online presence of the troupe, social media engagement increased by over 350%, performance requests by over 500%, and earnings by over 1350%."
      ],
      images: [
      { src: "assets/playground/design/neu-dragon/new-vs-old-logo.avif", shadow: true, caption: "The redesigned logo beside the original \u2014 the new mark brings lion dance in alongside the dragon." },
      { src: "assets/playground/design/neu-dragon/logo-iterations.avif", shadow: true, caption: "Logo iterations exploring color, containment, and how the two heads share the circle." },
      { src: "assets/playground/design/neu-dragon/business-cards.avif", caption: "Business cards for booking performances." },
      { src: "assets/playground/design/neu-dragon/info-poster.avif", caption: "An informational poster for tabling and campus events." },
      { src: "assets/playground/design/neu-dragon/social-grid.avif", caption: "A selection from 30+ social media posts \u2014 events, interest meetings, and announcements." },
      { src: "assets/playground/design/neu-dragon/instagram-scroll.avif", caption: "A multi-panel Instagram post recapping the year in review." },
      { videoSrc: "assets/playground/design/neu-dragon/website-home.mp4", caption: "The homepage of the website I designed and built from scratch." },
      { videoSrc: "assets/playground/design/neu-dragon/website-our-team.mp4", caption: "The Our Team page, introducing the troupe and recruiting new members." },
      { src: "assets/playground/design/neu-dragon/t-shirt.avif", caption: "Troupe apparel featuring the new logo and a dragon-and-lion back print." },
      { row: [
        { src: "assets/playground/misc/laser_cut_keychains.jpeg", caption: "Laser cut keychains, engraved with the lion and dragon heads." },
        { videoSrc: "assets/playground/design/neu-dragon/keychains-video.mp4", plain: true }],
        gap: 22 }]

    }],

    items: [
    { gradient: "linear-gradient(135deg,#dfe0f5,#b9bcf0)", label: "logo", imgTitle: "Mark for a tea brand", imgCaption: "A leaf that doubles as a steam curl." },
    { gradient: "linear-gradient(135deg,#e6e2f7,#c3bdf2)", label: "type", imgTitle: "Type specimen study", imgCaption: "Exploring a variable serif for a zine." },
    { gradient: "linear-gradient(135deg,#dde0f6,#b4b8ee)", label: "poster", imgTitle: "Lion-dance event poster", imgCaption: "Risograph two-color for the NEU troupe." },
    { gradient: "linear-gradient(135deg,#e7e3f8,#c6c0f3)", label: "identity", imgTitle: "Café identity system", imgCaption: "Full brand for a friend's pop-up." },
    { gradient: "linear-gradient(135deg,#dee1f6,#b7bbef)", label: "pattern", imgTitle: "Generative pattern set", imgCaption: "Made in p5.js, exported for packaging." },
    { gradient: "linear-gradient(135deg,#e5e1f7,#c0baf1)", label: "icons", imgTitle: "Icon system sketches", imgCaption: "A 40-glyph set drawn on the grid." }]

  },
  misc: {
    emoji: "🐉",
    title: "Miscellaneous",
    archiveTitle: "Miscellaneous Archive",
    archiveIntro: "A collection of other things that interest me",
    body: "",
    archiveLabel: "View Archive",
    items: [
    { videoSrc: "assets/playground/misc/neu_dragon_dance.mp4", label: "dragonDance", imgTitle: "Chinese dragon dance", imgCaption: "Performing with the NEU Dragon & Lion Dance Troupe in college." },
    { src: "assets/playground/misc/homemade_matcha.png", label: "matcha", imgTitle: "Homemade matcha latte", imgCaption: "One of my favorite recipes is an iced earl grey matcha latte." },
    { videoSrc: "assets/playground/misc/sleight_of_hand_back_palm.mp4", label: "sleight", imgTitle: "Sleight of hand", imgCaption: "Cards are a great fidget toy and party trick." },
    { src: "assets/playground/misc/laser_cut_keychains.jpeg", label: "keychains", imgTitle: "Laser cut keychains", imgCaption: "Learning new tools to make merch for my dragon dance troupe." },
    { videoSrc: "assets/playground/misc/espresso_shot.mp4", label: "espresso", imgTitle: "Espresso making", imgCaption: "An espresso shot pulled from my Casabrews CM5418." },
    { src: "assets/playground/misc/tinkering_arduino.png", label: "tinkering", imgTitle: "Tinkering", imgCaption: "I love exploring new tools and making things with my hands." },
    { src: "assets/playground/misc/chinese_poker.png", label: "games", imgTitle: "Card & board games", imgCaption: "Some of my favs are Open-Face Chinese Poker and the Nature board game." },
    { src: "assets/playground/misc/bts_concert.png", label: "concerts", imgTitle: "Concert going", imgCaption: "Most recently, I saw BTS during their Arirang world tour!" }]

  }
};

// The Design archive is project-driven: derive its preview cards from the
// project list so the Playground grid always matches the archive.
PLAYGROUND_CATEGORIES.branding.items = PLAYGROUND_CATEGORIES.branding.projects.
map((p) => ({ src: p.src, gradient: p.gradient, label: p.kind, imgTitle: p.title, imgCaption: p.blurb }));

// Folder-shaped hover indicator. Drawn as ONE SVG path so the outline has a
// genuinely uniform stroke width on every edge (including the tab's diagonal
// shoulder) with proper round joins — a clip-path pair can't do either.
// Measured in real pixels so the corner radii stay circular at any size.
const FOLDER_TAB_W = 190;
const FOLDER_TAB_H = 44;
const FOLDER_SLANT = 22;
const FOLDER_R = 18;
const FOLDER_SW = 1;

function FolderOutline({ tabW = FOLDER_TAB_W }) {
  const ref = useRefAb(null);
  const [size, setSize] = useStateAb({ w: 0, h: 0 });
  useEffectAb(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
      Math.abs(prev.w - r.width) > 0.5 || Math.abs(prev.h - r.height) > 0.5 ?
      { w: r.width, h: r.height } : prev);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  // Scale the stroke with the folder's width. A fixed 1px reads heavier on a
  // narrower viewport (where the folder is smaller) than on a wide monitor, so
  // tie it to the size and clamp to a sane hairline range.
  const sw = Math.max(0.7, Math.min(1.15, w / 1020));
  const p = sw / 2; // keep the centred stroke inside the box
  let d = null;
  if (w > tabW + FOLDER_SLANT + FOLDER_R * 3 && h > FOLDER_TAB_H + FOLDER_R * 3) {
    const r = FOLDER_R;
    const sr = 12; // shoulder rounding
    const L = p,R = w - p,T = p,B = h - p;
    const tabR = L + tabW;
    const bodyT = T + FOLDER_TAB_H;
    d = [
    `M ${L + r} ${T}`,
    `L ${tabR - sr} ${T}`,
    `Q ${tabR} ${T} ${tabR + FOLDER_SLANT * 0.34} ${T + sr * 0.9}`,
    `L ${tabR + FOLDER_SLANT * 0.72} ${bodyT - sr * 0.75}`,
    `Q ${tabR + FOLDER_SLANT} ${bodyT} ${tabR + FOLDER_SLANT + sr} ${bodyT}`,
    `L ${R - r} ${bodyT}`,
    `Q ${R} ${bodyT} ${R} ${bodyT + r}`,
    `L ${R} ${B - r}`,
    `Q ${R} ${B} ${R - r} ${B}`,
    `L ${L + r} ${B}`,
    `Q ${L} ${B} ${L} ${B - r}`,
    `L ${L} ${T + r}`,
    `Q ${L} ${T} ${L + r} ${T}`,
    "Z"].
    join(" ");
  }

  return (
    <div ref={ref} className="folder-shape" style={{
      position: "absolute",
      inset: 0,
      filter: "drop-shadow(0 10px 16px color-mix(in oklch, var(--accent) 20%, transparent)) drop-shadow(0 22px 40px color-mix(in oklch, var(--accent) 14%, transparent))"
    }}>
      {d &&
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }} aria-hidden="true">
          <path
          d={d}
          fill="color-mix(in oklch, var(--accent) 11%, var(--paper))"
          stroke="color-mix(in oklch, var(--accent) 55%, transparent)"
          strokeWidth={sw}
          strokeLinejoin="round" />
        </svg>
      }
    </div>);

}

function PlaygroundSection({ slug, category, onNavigate }) {
  const { emoji, title, tabLabel, body, items } = category;
  const label = tabLabel || title;
  const [hover, setHover] = useStateAb(false);
  // The section title doubles as the folder's tab label, so the tab is sized
  // to the measured label width.
  const labelRef = useRefAb(null);
  const [tabW, setTabW] = useStateAb(FOLDER_TAB_W);
  useEffectAb(() => {
    const el = labelRef.current;
    if (!el) return;
    const measure = () => {
      const next = Math.max(120, Math.round(el.getBoundingClientRect().width) + 40);
      setTabW((prev) => Math.abs(prev - next) > 1 ? next : prev);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label]);
  // Opening an archive plays a short “entering the folder” transition first.
  const [entering, setEntering] = useStateAb(false);
  const enterTimer = useRefAb(null);
  useEffectAb(() => () => clearTimeout(enterTimer.current), []);
  const open = () => {
    if (entering) return;
    const reduce = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {onNavigate("archive/" + slug);return;}
    setHover(true);
    setEntering(true);
    enterTimer.current = setTimeout(() => onNavigate("archive/" + slug), 440);
  };
  return (
    <section style={{ marginTop: 76, marginBottom: 84 }}>
      {/* The whole section is one target: hovering tints it purple, clicking
          opens the archive page. Individual images don't show hover captions. */}
      <div
        role="link"
        tabIndex={0}
        aria-label={"Open " + title + " archive"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={open}
        onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();open();}}}
        className={entering ? "folder-entering" : undefined}
        style={{
          position: "relative",
          cursor: "pointer",
          padding: "14px 20px 20px",
          margin: "-14px -20px -20px",
          transform: hover ? "translateY(-3px)" : "translateY(0)",
          transition: entering ? "none" : "transform .28s cubic-bezier(.22,.61,.36,1)"
        }}>
        {entering && <div className="folder-veil" aria-hidden="true" />}
        {/* Folder-shaped hover indicator (single SVG path — uniform stroke). */}
        <div
          aria-hidden="true"
          className={hover ? "folder-open" : ""}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: hover || entering ? 1 : 0,
            transition: "opacity .3s ease"
          }}>
          <FolderOutline tabW={tabW} />
        </div>
        <div style={{ position: "relative" }}>
        {/* Gap below the head is set so the grid clears the folder's top edge
           by the same 20px the folder insets on its other three sides. */}
        <div className="pg-section-head" style={{ marginBottom: body ? 20 : 30 }}>
          {/* Title sits inside the folder's tab, reading as its label. */}
          <div
            ref={labelRef}
            style={{
              display: "inline-block",
              fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em",
              lineHeight: "20px",
              color: hover ? "var(--accent)" : "var(--ink)",
              transition: "color .25s ease"
            }}>
            {label} <span>{emoji}</span>
          </div>
          {body &&
          <div style={{ maxWidth: 540, marginTop: 20, fontSize: 14, fontWeight: 300, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              {body}
            </div>
          }
        </div>
        <div className="pg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {items.slice(0, 6).map((it, i) =>
          <ImageCaption key={i} src={it.src} videoSrc={it.videoSrc} title={it.imgTitle} caption={it.imgCaption} label={it.label} gradient={it.gradient} aspect="16 / 10" noHoverCaption={true} />
          )}
        </div>
      </div>
      {secretAsk &&
      <SecretPrompt
        onNo={() => setSecretAsk(false)}
        onYes={() => {
          setSecretAsk(false);
          if (window.__activateBrainrot) window.__activateBrainrot();
        }} />
      }
      </div>
    </section>);

}

function Playground({ onNavigate }) {
  // Scattered hero emojis (absolute, varied size/rotation) — not a straight row.
  const heroEmojis = [
  { char: "🐉", left: "4%", top: "8%", size: 38, rot: -10 },
  { char: "🍵", left: "44%", top: "0%", size: 46, rot: 8 },
  { char: "🎧", left: "78%", top: "12%", size: 34, rot: -6 },
  { char: "🧋", left: "22%", top: "52%", size: 42, rot: 6 },
  { char: "📷", left: "60%", top: "56%", size: 40, rot: -8 },
  { char: "🧩", left: "88%", top: "62%", size: 32, rot: 12 }];

  const order = ["branding", "photography", "misc"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" />
      <div className="pg-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 40px 100px" }}>
        <div className="pg-hero" style={{ marginBottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.04em" }}>
              Welcome to<br />my Archive! <span>📁</span>
            </h1>
            <p style={{ margin: "13px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              A space to showcase the other things outside my case studies...
            </p>
          </div>
          {/* Scattered emojis */}
          <div className="pg-emoji-cloud" style={{ position: "relative", width: 280, height: 150, flexShrink: 0 }}>
            {heroEmojis.map((e, i) =>
            <span key={i} style={{
              position: "absolute", left: e.left, top: e.top,
              fontSize: e.size, lineHeight: 1, transform: `rotate(${e.rot}deg)`,
              animation: `pgFloat${i % 3} ${5 + i * 0.5}s ease-in-out infinite`
            }}>{e.char}</span>
            )}
          </div>
        </div>

        {order.map((slug) =>
        <PlaygroundSection key={slug} slug={slug} category={PLAYGROUND_CATEGORIES[slug]} onNavigate={onNavigate} />
        )}

      </div>
      <style>{`
        @keyframes pgFloat0 { 0%,100%{translate:0 0} 50%{translate:0 -7px} }
        @keyframes pgFloat1 { 0%,100%{translate:0 0} 50%{translate:0 -11px} }
        @keyframes pgFloat2 { 0%,100%{translate:0 0} 50%{translate:0 -5px} }
      `}</style>
      <window.SiteFooter />
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Archive — a dedicated page for one playground category.
// Large title + intro, then a generous grid of landscape Image+Caption
// cards (the full set, not just the 6-card preview shown on Playground).
// ───────────────────────────────────────────────────────────────────
function Archive({ slug, onNavigate }) {
  const order = ["branding", "photography", "misc"];
  const category = PLAYGROUND_CATEGORIES[slug] || PLAYGROUND_CATEGORIES.photography;
  const idx = order.indexOf(slug in PLAYGROUND_CATEGORIES ? slug : "photography");
  const next = PLAYGROUND_CATEGORIES[order[(idx + 1) % order.length]];
  const nextSlug = order[(idx + 1) % order.length];
  const activeSlug = slug in PLAYGROUND_CATEGORIES ? slug : "photography";
  const [zoomed, setZoomed] = useStateAb(null);
  const [filter, setFilter] = useStateAb("All");
  // The top nav compacts as you scroll, so its height changes. Track its live
  // bottom edge and pin the filter bar flush to it (no gap), and only show the
  // bar's glass background once the page has actually scrolled.
  const [navH, setNavH] = useStateAb(47);
  const [stuck, setStuck] = useStateAb(false);
  useEffectAb(() => {
    const read = () => {
      const nav = document.querySelector(".site-nav");
      if (nav) setNavH(Math.max(0, Math.round(nav.getBoundingClientRect().bottom)));
      setStuck((window.scrollY || document.documentElement.scrollTop || 0) > 4);
    };
    read();
    // Follow the nav's 0.25s compact transition, not just its end state.
    let raf = 0;
    const track = () => {read();raf = requestAnimationFrame(track);};
    let stop = 0;
    const kick = () => {
      if (!raf) track();
      clearTimeout(stop);
      stop = setTimeout(() => {cancelAnimationFrame(raf);raf = 0;read();}, 420);
    };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stop);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", read);
    };
  }, []);

  // Project-driven archives (e.g. Design) filter by category and link to
  // per-project detail pages instead of opening a lightbox.
  const isProjectArchive = Array.isArray(category.projects);
  // A project can carry several tags (`kinds`) or a single `kind`.
  const kindsOf = (p) => p.kinds || [p.kind];
  const shown = isProjectArchive ?
  filter === "All" ? category.projects : category.projects.filter((p) => kindsOf(p).includes(filter)) :
  category.items;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" activeArchiveSlug={activeSlug} />
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", padding: "48px 40px 100px" }}>
        {/* Back to Archive */}
        <button
          className="pill-btn ghost archive-top-back"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 28 }}
          onClick={() => onNavigate("archive")}>
          <span style={{ display: "inline-block" }}>←</span> Back to Archive
        </button>

        {/* Header */}
        <header className="archive-header" style={{ marginBottom: isProjectArchive ? 8 : 44, maxWidth: 720 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
            Archive
          </div>
          <h1 className="archive-title" style={{ margin: 0, fontWeight: 700, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            {category.title} <span style={{ fontWeight: 400 }}>{category.emoji}</span>
          </h1>
          <p style={{ margin: "18px 0 0", maxWidth: 540, fontWeight: 300, fontSize: 17, lineHeight: "27px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", textWrap: "pretty" }}>
            {category.archiveIntro}
          </p>
          <div style={{ marginTop: 18, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)" }}>
            {isProjectArchive ? "Click any project to read more" : `${shown.length} pieces · click any image to enlarge`}
          </div>
        </header>

        {/* Category filters (project-driven archives only) */}
        {isProjectArchive &&
        <div
          className={"archive-filters" + (stuck ? " is-stuck" : "")}
          style={{ "--nav-h": navH + "px" }}>
            <div className="archive-filters-row" style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {category.filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  // The bar is sticky at the top on mobile, so after filtering
                  // you'd otherwise stay mid-page looking at a new, shorter
                  // grid. Return to the top so the results start from the top.
                  if (window.matchMedia("(max-width: 720px)").matches) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                aria-pressed={on}
                style={{
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  letterSpacing: "-0.01em",
                  padding: "7px 15px",
                  borderRadius: 999,
                  border: `1px solid ${on ? "var(--accent)" : "var(--hair)"}`,
                  background: on ? "var(--accent)" : "var(--paper)",
                  color: on ? "#fff" : "rgba(0,0,0,0.72)",
                  transition: "background .2s ease, color .2s ease, border-color .2s ease"
                }}>
                  {f}{on ? <span style={{ opacity: 0.62 }}>{` (${shown.length})`}</span> : ""}
                </button>);

          })}
            </div>
          </div>
        }

        {/* Full grid — large landscape cards */}
        <div className="archive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {isProjectArchive ?
          shown.map((p) =>
          <div
            key={p.slug}
            role="link"
            tabIndex={0}
            onClick={() => onNavigate("design/" + p.slug)}
            onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onNavigate("design/" + p.slug);}}}
            style={{ cursor: "pointer" }}>
                <ImageCaption title={p.title} caption={p.blurb} label={kindsOf(p)[0]} src={p.src} gradient={p.gradient} aspect="3 / 2" noHoverCaption={true} hoverZoom={true} />
                <div style={{ marginTop: 10 }}>
                  {/* Title left, category tags right, sharing one baseline. */}
                  <div className="archive-card-head" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, lineHeight: "21px", letterSpacing: "-0.02em", color: "var(--ink)", minWidth: 0 }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", flexShrink: 0, textAlign: "right" }}>
                      {kindsOf(p).join(" · ")}
                    </div>
                  </div>
                  <div style={{ marginTop: 3, fontWeight: 300, fontSize: 13.5, lineHeight: "19px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.62)" }}>
                    <span className="pg-only-desktop">{p.blurb}</span>
                    <span className="pg-only-mobile">{DESIGN_BLURBS_MOBILE[p.slug] || p.blurb}</span>
                  </div>
                </div>
              </div>
          ) :

          shown.map((it, i) =>
          <div key={i}>
              <ImageCaption title={it.imgTitle} caption={it.imgCaption} label={it.label} src={it.src} videoSrc={it.videoSrc} gradient={it.gradient} aspect="3 / 2" onZoom={setZoomed} />
              {/* Static caption — shown on mobile (no hover) */}
              <div className="archive-static-caption">
                <div style={{ fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  {it.imgTitle}
                </div>
                {it.imgCaption &&
              <div style={{ marginTop: 2, fontWeight: 300, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.62)" }}>
                  {it.imgCaption}
                </div>
              }
              </div>
            </div>
          )}
        </div>

        {/* Next archive */}
        <div style={{
          marginTop: 72, paddingTop: 32, borderTop: "1px solid var(--hair)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap"
        }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>
              Next archive
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em" }}>
              {next.title} <span style={{ fontWeight: 400 }}>{next.emoji}</span>
            </div>
          </div>
          <button className="pill-btn" onClick={() => onNavigate("archive/" + nextSlug)}>
            View {next.title} <span className="arr">→</span>
          </button>
        </div>
      </div>
      {/* Mobile: the filter row pins to the bottom, so float the way back
          above it — same pattern as the case studies. */}
      <button
        className="pill-btn floating-home archive-floating-back is-low"
        onClick={() => onNavigate("archive")}>
        <span style={{ display: "inline-block" }}>←</span> Back to Archive
      </button>
      <window.SiteFooter />
      {/* AFTER the footer: the fixed filter bar reserves no space, so this is
          what lets the footer scroll clear of it. */}
      <div className="archive-bottom-spacer is-short" aria-hidden="true" />
      {zoomed && <Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// BookFlipper — interactive book mockup. Starts closed on the cover,
// then flips one leaf at a time through full-page spreads. The turning
// leaf is HALF a spread wide (hinged at the spine): its front face is
// the right half of the current spread, its back face the left half of
// the next one — exactly how a real leaf turns.
// ───────────────────────────────────────────────────────────────────
function BookFlipper({ cover, spreads, aspect = "2.375 / 1" }) {
  const N = spreads.length; // index 0 = closed cover, 1..N = spreads
  const [idx, setIdx] = useStateAb(0);
  const [flip, setFlip] = useStateAb(null); // { dir } — CSS keyframes drive the turn
  const timer = useRefAb(null);
  const pending = useRefAb(null);

  // A face is half a spread. The cover may be a standalone single page
  // (pass a string) or one half of a cover spread (pass { src, half }).
  const face = (i, side) => {
    if (i < 0 || i > N) return null;
    if (i === 0) {
      if (side !== "right") return null;
      return typeof cover === "string" ?
      { src: cover, single: true } :
      { src: cover.src, half: cover.half || "right" };
    }
    return { src: spreads[i - 1], half: side };
  };
  const bg = (f) => f ? {
    backgroundImage: `url(${f.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: f.single ? "100% 100%" : "200% 100%",
    backgroundPosition: f.single ? "center" : f.half === "left" ? "0% 50%" : "100% 50%"
  } : {};

  // Fully DECODE neighbours in the background, so a click never has to wait
  // on a fetch or a JPEG decode.
  useEffectAb(() => {
    let alive = true;
    const srcs = [];
    [idx - 1, idx, idx + 1, idx + 2].forEach((i) => {
      const f = face(i, "right") || face(i, "left");
      if (f && srcs.indexOf(f.src) === -1) srcs.push(f.src);
    });
    (async () => {
      for (const src of srcs) {
        if (!alive) return;
        const im = new Image();
        im.src = src;
        try {if (im.decode) await im.decode();} catch (e) {}
      }
    })();
    return () => {alive = false;};
  }, [idx]);

  // Commit once — normally from animationend; the timer is a true fallback.
  const settle = () => {
    if (pending.current == null) return;
    const target = pending.current;
    pending.current = null;
    clearTimeout(timer.current);
    setIdx(target);
    setFlip(null);
  };

  // Synchronous: the leaves are already mounted and composited, so the
  // animation is created on the click's own frame.
  const go = (dir) => {
    if (pending.current != null) return;
    const target = dir === "next" ? idx + 1 : idx - 1;
    if (target < 0 || target > N) return;
    pending.current = target;
    setFlip({ dir });
    timer.current = setTimeout(settle, 3000);
  };

  useEffectAb(() => () => clearTimeout(timer.current), []);

  // Swipe to turn pages (touch + pen). A horizontal drag past the threshold
  // flips; anything shorter falls through to the tap handler.
  const swipe = useRefAb(null);
  const swipedRef = useRefAb(false);
  const onSwipeStart = (ev) => {
    swipe.current = { x: ev.clientX, y: ev.clientY };
  };
  const onSwipeEnd = (ev) => {
    const st = swipe.current;
    swipe.current = null;
    if (!st) return;
    const dx = ev.clientX - st.x;
    const dy = ev.clientY - st.y;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy)) return;
    swipedRef.current = true;
    go(dx < 0 ? "next" : "prev");
  };

  // Jump straight to a spread (progress drag / back to start) — no turn.
  const jump = (v) => {
    const t = Math.max(0, Math.min(N, Number(v)));
    clearTimeout(timer.current);
    pending.current = null;
    setPlaying(false);
    setFlip(null);
    setIdx(t);
  };

  // Auto-play — advance one spread per second until the end.
  const [playing, setPlaying] = useStateAb(false);
  const [dragging, setDragging] = useStateAb(false);
  const pct = N ? idx / N * 100 : 0;
  useEffectAb(() => {
    if (!playing) return;
    if (idx >= N) {setPlaying(false);return;}
    if (flip) return;
    const t = setTimeout(() => go("next"), 1000);
    return () => clearTimeout(t);
  }, [playing, idx, flip, N]);

  // Fullscreen — native where permitted, otherwise an in-page expanded mode
  // (embedded/iframe contexts have fullscreenEnabled === false).
  const wrapRef = useRefAb(null);
  const [isFs, setIsFs] = useStateAb(false);
  const [expanded, setExpanded] = useStateAb(false);
  useEffectAb(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);
  // Escape leaves the in-page expanded mode.
  useEffectAb(() => {
    if (!expanded) return;
    const onKey = (e) => {if (e.key === "Escape") setExpanded(false);};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const big = isFs || expanded;
  const toggleFs = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) Promise.resolve(exit.call(document)).catch(() => {});
      return;
    }
    if (expanded) {setExpanded(false);return;}
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || !document.fullscreenEnabled) {setExpanded(true);return;}
    Promise.resolve(req.call(el)).catch(() => setExpanded(true));
  };

  const next = flip && flip.dir === "next";
  const prev = flip && flip.dir === "prev";
  // Bases: halves that stay put / get revealed during the turn. The idle
  // leaf sits directly on top of its base showing the same half, so the
  // swap underneath is invisible.
  const leftBase = face(prev ? idx - 1 : idx, "left");
  const rightBase = face(next ? idx + 1 : idx, "right");

  const half = { position: "absolute", top: 0, width: "50%", height: "100%" };
  // Softer spine falloff, and fades in/out with the turn.
  const spineShade = (side, on = true) => ({
    position: "absolute", inset: 0, pointerEvents: "none",
    background: `linear-gradient(to ${side}, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.06) 7%, rgba(0,0,0,0.02) 14%, rgba(0,0,0,0) 22%)`,
    opacity: on ? 1 : 0,
    transition: "opacity .45s ease"
  });
  const pageShadow = "0 2px 14px rgba(0,0,0,0.12)";
  // Closed on the cover: there is no left page, so the shadow must not bleed
  // past the spine (offset it right/down) and the desk shadow only sits under
  // the right half.
  const closed = idx === 0 && !flip;
  const coverShadow = "7px 5px 18px rgba(0,0,0,0.16)";

  // Both leaves stay mounted for the life of the book so their 3D compositor
  // layers are already rasterized when a turn starts. Idle = no animation.
  const leaf = (dir) => {
    const fwd = dir === "next";
    const front = face(idx, fwd ? "right" : "left");
    const back = fwd ? face(idx + 1, "left") : face(idx - 1, "right");
    const turning = flip && flip.dir === dir;
    const faceStyle = (f, shadeSide) => ({
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      backgroundColor: f ? "#fff" : "transparent",
      ...bg(f),
      boxShadow: f && turning ? "0 8px 30px rgba(0,0,0,0.22)" : "none"
    });
    return (
      <div
        key={dir}
        onAnimationEnd={settle}
        style={{
          ...half,
          left: fwd ? "50%" : 0,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transformOrigin: fwd ? "left center" : "right center",
          animation: turning ? `${fwd ? "leafTurnNext" : "leafTurnPrev"} .7s cubic-bezier(.4,.05,.3,1) forwards` : "none",
          willChange: "transform",
          zIndex: turning ? 3 : 1,
          pointerEvents: "none"
        }}>
        <div style={faceStyle(front)}>
          {front && <div style={spineShade(fwd ? "right" : "left", !!turning)} />}
        </div>
        <div style={{ ...faceStyle(back), transform: "rotateY(180deg)" }}>
          {back && <div style={spineShade(fwd ? "left" : "right", !!turning)} />}
        </div>
      </div>);

  };

  return (
    <div
      className={"book-wrap" + (parseFloat(aspect) < 2 ? " is-tall" : "") + (expanded ? " is-expanded" : "")}
      ref={wrapRef}
      onClick={(e) => {
        // In fullscreen / expanded mode, clicking the empty ground around the
        // book exits — but never when the click lands on the book or a control.
        if (!big) return;
        if (e.target.closest("[data-book-stage], button, input, a")) return;
        if (document.fullscreenElement) {
          const exit = document.exitFullscreen || document.webkitExitFullscreen;
          if (exit) Promise.resolve(exit.call(document)).catch(() => {});
        }
        setExpanded(false);
      }}
      style={{ marginTop: 46 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <button className="book-tool" onClick={toggleFs} aria-label={big ? "Exit fullscreen" : "View fullscreen"}>
          {big ?
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5.5 1.5v4h-4M8.5 12.5v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg> :

          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1.5 5.5v-4h4M12.5 8.5v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          {big ? "Exit fullscreen" : "Fullscreen"}
        </button>
      </div>
      <div className="book-row" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <button onClick={() => go("prev")} disabled={idx === 0 || !!flip} aria-label="Previous page" className="book-arrow book-arrow-side">←</button>
        <div
          data-book-stage
          onPointerDown={onSwipeStart}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => {swipe.current = null;}}
          onClick={(ev) => {
            // A swipe shouldn't also count as a tap-to-fullscreen.
            if (swipedRef.current) {swipedRef.current = false;return;}
            if (!big) toggleFs();
          }}
          style={{ flex: 1, minWidth: 0, aspectRatio: aspect, perspective: 2200, position: "relative", cursor: big ? "default" : "zoom-in" }}>
          <div style={{
            position: "absolute", left: closed ? "53%" : "6%", right: "6%", bottom: -14, height: 22,
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22), rgba(0,0,0,0) 70%)",
            transition: "left .3s ease"
          }} />

          <div style={{ ...half, left: 0, backgroundColor: leftBase ? "#fff" : "transparent", ...bg(leftBase), boxShadow: leftBase ? pageShadow : "none" }}>
            {leftBase && <div style={spineShade("left")} />}
          </div>
          <div style={{ ...half, left: "50%", backgroundColor: rightBase ? "#fff" : "transparent", ...bg(rightBase), boxShadow: rightBase ? closed ? coverShadow : pageShadow : "none" }}>
            {rightBase && <div style={spineShade("right")} />}
          </div>

          {leaf("prev")}
          {leaf("next")}
        </div>

        <button onClick={() => go("next")} disabled={idx === N || !!flip} aria-label="Next page" className="book-arrow book-arrow-side">→</button>
      </div>


      <div style={{
        marginTop: 30, textAlign: "center", fontSize: 12.5,
        letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)"
      }}>
        {idx === 0 ? "Cover" : `Spread ${idx} of ${N}`}
      </div>

      {/* Scrub through the book — custom animated bar with a real range
          input layered invisibly on top for drag + keyboard support. */}
      <div className="book-scrub" style={{ marginTop: 20, padding: "0 52px" }}>
        <div style={{ position: "relative", height: 22 }}>
          <div style={{
            position: "absolute", left: 0, right: 0, top: 9, height: 4,
            borderRadius: 999, background: "var(--hair)"
          }} />
          <div style={{
            position: "absolute", left: 0, top: 9, height: 4, width: `${pct}%`,
            borderRadius: 999, background: "var(--accent)",
            transition: dragging ? "none" : "width .32s cubic-bezier(.4,.05,.3,1)"
          }} />
          <div style={{
            position: "absolute", left: `${pct}%`, top: 11,
            width: 15, height: 15, marginLeft: -7.5, marginTop: -7.5,
            borderRadius: 999, background: "var(--accent)",
            border: "2px solid var(--paper)",
            boxShadow: "0 1px 5px rgba(0,0,0,0.22)",
            transition: dragging ? "none" : "left .32s cubic-bezier(.4,.05,.3,1)"
          }} />
          <input
            className="book-progress"
            type="range"
            min={0}
            max={N}
            step={1}
            value={idx}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onChange={(e) => jump(e.target.value)}
            aria-label="Jump to a page" />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)"
        }}>
          <span>Cover</span>
          <span>End</span>
        </div>
      </div>

      <div className="book-tools" style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
        <button className="book-tool-restart pill-btn ghost" onClick={() => jump(0)} disabled={idx === 0 && !playing}>
          Back to start
        </button>
        <button
          className="pill-btn ghost"
          onClick={() => {
            // Starting auto-play from the end restarts at the cover.
            if (!playing && idx === N) {
              clearTimeout(timer.current);
              pending.current = null;
              setFlip(null);
              setIdx(0);
            }
            setPlaying((p) => !p);
          }}>
          {playing ?
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style={{ marginRight: 7 }}>
              <rect x="2" y="1.5" width="2.8" height="9" rx="0.8" fill="currentColor" />
              <rect x="7.2" y="1.5" width="2.8" height="9" rx="0.8" fill="currentColor" />
            </svg> :

          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style={{ marginRight: 7 }}>
              <path d="M3 1.8l7 4.2-7 4.2V1.8z" fill="currentColor" />
            </svg>
          }
          {playing ? "Pause" : "Auto-play"}
        </button>
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// DesignProject — mini detail page for one item in the Design archive.
// Room for a longer write-up and as many images as the project needs.
// ───────────────────────────────────────────────────────────────────
function DesignProject({ slug, onNavigate }) {
  const all = PLAYGROUND_CATEGORIES.branding.projects;
  const project = all.find((p) => p.slug === slug) || all[0];
  const [zoomed, setZoomed] = useStateAb(null);
  const i = all.indexOf(project);
  const next = all[(i + 1) % all.length];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" activeArchiveSlug="branding" />
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", padding: "48px 40px 100px" }}>
        <button
          className="pill-btn ghost archive-top-back"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 28 }}
          onClick={() => onNavigate("archive/branding")}>
          <span style={{ display: "inline-block" }}>←</span> Back
        </button>

        <header style={{ marginBottom: 36, maxWidth: 720 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            {(project.kinds || [project.kind]).join(" · ")}
          </div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 38, lineHeight: 1.08, letterSpacing: "-0.04em" }}>
            {project.title}
          </h1>
          <p style={{ margin: "16px 0 0", fontWeight: 300, fontSize: 17, lineHeight: "27px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", textWrap: "pretty" }}>
            {project.blurb}
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
            // Role: first line is the primary role, the rest renders gray
            // (matches the case study pages' meta treatment).
            (() => {
              const parts = String(project.role || "").split("\n");
              return { label: "Role", value: parts[0], sub: parts.slice(1).join("\n") };
            })(),
            project.client ? { label: "Client", value: project.client.label, href: project.client.href } : { label: "Medium", value: project.year }].
            filter((m) => m.value).map((m) =>
            <div key={m.label}>
                <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)", marginBottom: 5 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 13, letterSpacing: "0.005em", fontWeight: 400, lineHeight: "21px", whiteSpace: "pre-line" }}>
                  {m.href ?
                <a className="footer-link" href={m.href} target="_blank" rel="noreferrer noopener" style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      {m.value}
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 9l6-6M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a> :
                m.value
                }
                </div>
                {m.sub &&
              <div style={{
                fontSize: 13,
                letterSpacing: "0.005em",
                fontWeight: 300,
                lineHeight: "21px",
                color: "rgba(0,0,0,0.5)",
                whiteSpace: "pre-line"
              }}>{m.sub}</div>
              }
              </div>
            )}
          </div>
        </header>

        {/* Write-up */}
        <div style={{ maxWidth: 680 }}>
          {(project.body || []).map((p, k) =>
          <p key={k} style={{
            margin: k === 0 ? 0 : "13px 0 0",
            fontWeight: 300, fontSize: 15, lineHeight: "24px",
            letterSpacing: "-0.01em", color: "rgba(0,0,0,0.78)", textWrap: "pretty"
          }}>
              {p}
            </p>
          )}
        </div>

        {/* Interactive book mockup (projects that define a `book`) */}
        {project.book &&
        <BookFlipper cover={project.book.cover} spreads={project.book.spreads} aspect={project.book.aspect} />
        }

        {/* Images — full content width, click to enlarge. Memoized so a page
            turn in the book above doesn't re-render 30+ figures. */}
        {React.useMemo(() => (project.images || []).length > 0 &&
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 26 }}>
            {project.images.map((im, k) => {
            // A `row` entry lays its own items side by side in equal columns.
            if (im.row) {
              return (
                <div key={k} className="media-row" style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${im.row.length}, 1fr)`,
                  gap: im.gap != null ? im.gap : 14,
                  marginTop: im.spaceAbove || 0,
                  alignItems: "start"
                }}>
                    {im.row.map((r, ri) => {
                  const rp = !!(im.plain || r.plain);
                  return (
                    <figure key={ri} style={{ margin: 0 }}>
                        <div
                      role={rp ? undefined : "button"}
                      tabIndex={rp ? undefined : 0}
                      onClick={rp ? undefined : () => setZoomed({ title: project.title, caption: r.caption, src: r.src, videoSrc: r.videoSrc })}
                      onKeyDown={rp ? undefined : (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();setZoomed({ title: project.title, caption: r.caption, src: r.src, videoSrc: r.videoSrc });}}}
                      style={{
                        position: "relative", width: "100%",
                        borderRadius: im.flat || r.flat ? 0 : 12,
                        background: rp ? "transparent" : "var(--gray-50)",
                        border: im.flat || r.flat || rp ? "none" : "1px solid var(--hair)",
                        boxShadow: rp ? "none" : "0 6px 20px rgba(0,0,0,0.13)",
                        overflow: "hidden", cursor: rp ? "default" : "zoom-in", display: "block"
                      }}>
                          {r.videoSrc ?
                      <video src={r.videoSrc} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture controlsList="nodownload noplaybackrate noremoteplayback" style={{ width: "100%", height: "auto", display: "block", pointerEvents: rp ? "none" : undefined }} /> :
                      <img src={r.src} alt={r.caption || project.title} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
                      }
                        </div>
                        {r.caption &&
                      <figcaption style={{ marginTop: 10, fontSize: 13, fontWeight: 300, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.55)" }}>
                            {r.caption}
                          </figcaption>
                      }
                      </figure>);

                })}
                  </div>);

            }
            const plain = !!im.plain;
            const media =
            <div
              role={plain ? undefined : "button"}
              tabIndex={plain ? undefined : 0}
              onClick={plain ? undefined : () => setZoomed({ title: project.title, caption: im.caption, src: im.src, videoSrc: im.videoSrc })}
              onKeyDown={plain ? undefined : (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();setZoomed({ title: project.title, caption: im.caption, src: im.src, videoSrc: im.videoSrc });}}}
              style={{
                position: "relative", width: im.width || "100%",
                margin: im.width ? "0 auto" : undefined,
                borderRadius: plain || im.flat ? 0 : 12,
                background: plain ? "transparent" : "var(--gray-50)",
                border: plain ? "none" : "1px solid var(--hair)",
                boxShadow: im.shadow ? "0 6px 20px rgba(0,0,0,0.13)" : undefined,
                overflow: "hidden", cursor: plain ? "default" : "zoom-in", display: "block"
              }}>
                  {im.videoSrc ?
              <video src={im.videoSrc} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture controlsList="nodownload noplaybackrate noremoteplayback" style={{ width: "100%", height: "auto", display: "block", pointerEvents: plain ? "none" : undefined }} /> :
              <img src={im.src} alt={im.caption || project.title} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
              }
                </div>;

            const cap = im.caption &&
            <figcaption style={{ marginTop: 10, fontSize: 13, fontWeight: 300, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.55)", textAlign: im.width ? "center" : undefined }}>
                  {im.caption}
                </figcaption>;

            // Half-width media with copy alongside it. `half: "left"` puts the
            // media on the left (text right); "right" flips it.
            if (im.half) {
              const mediaFirst = im.half === "left";
              return (
                <div key={k} className="half-media" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "center"
                }}>
                    <figure style={{ margin: 0, order: mediaFirst ? 0 : 1 }}>
                      {media}
                      {cap}
                    </figure>
                    <div style={{ order: mediaFirst ? 1 : 0 }}>
                      {im.textTitle &&
                    <h3 style={{ margin: "0 0 9px", fontWeight: 700, fontSize: 19, lineHeight: "26px", letterSpacing: "-0.03em" }}>
                          {im.textTitle}
                        </h3>
                    }
                      {(im.text || []).map((t, j) =>
                    <p key={j} style={{
                      margin: j === 0 ? 0 : "12px 0 0",
                      fontWeight: 300, fontSize: 15, lineHeight: "24px",
                      letterSpacing: "-0.01em", color: "rgba(0,0,0,0.78)", textWrap: "pretty"
                    }}>
                          {t}
                        </p>
                    )}
                    </div>
                  </div>);

            }

            return (
              <figure key={k} style={{ margin: 0, marginTop: im.spaceAbove || 0 }}>
                  {media}
                  {cap}
                </figure>);

          })}
          </div>
        , [project])}

        {/* Next project */}
        <div style={{
          marginTop: 64, paddingTop: 30, borderTop: "1px solid var(--hair)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap"
        }}>
          <div className="upnext-row" style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
            {/* Preview thumbnail for the next project */}
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 92,
                aspectRatio: "3 / 2",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--hair)",
                background: next.src ? "var(--gray-50)" : next.gradient || "var(--gray-50)"
              }}>
              {next.src &&
              <img src={next.src} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              }
            </div>
            <div className="upnext-copy" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>
                Next project
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>{next.title}</div>
              {/* Shown only on mobile — stacks under the copy. */}
              <button className="pill-btn upnext-btn-inline" onClick={() => onNavigate("design/" + next.slug)}>
                View project <span className="arr">→</span>
              </button>
            </div>
          </div>
          <button className="pill-btn upnext-btn-side" onClick={() => onNavigate("design/" + next.slug)}>
            View project <span className="arr">→</span>
          </button>
        </div>
      </div>
      {/* Mobile: the filter row pins to the bottom, so float the way back
          above it — same pattern as the case studies. */}
      <button
        className="pill-btn floating-home archive-floating-back is-low"
        onClick={() => onNavigate("archive/branding")}>
        <span style={{ display: "inline-block" }}>←</span> Back
      </button>
      <window.SiteFooter />
      {/* AFTER the footer: the fixed filter bar reserves no space, so this is
          what lets the footer scroll clear of it. */}
      <div className="archive-bottom-spacer is-short" aria-hidden="true" />
      {zoomed && <Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>);

}

window.BrainrotPlayer = BrainrotPlayer;
window.About = About;
window.Playground = Playground;
window.Archive = Archive;
window.DesignProject = DesignProject;
window.ARCHIVE_ORDER = ["branding", "photography", "misc"].
map((slug) => ({ slug, title: PLAYGROUND_CATEGORIES[slug].title }));
// Exposed so an alternate Playground layout can be swapped in per page.
window.PLAYGROUND_CATEGORIES = PLAYGROUND_CATEGORIES;
window.ImageCaption = ImageCaption;
