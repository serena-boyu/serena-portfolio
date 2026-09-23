// Home — split-screen layout: thumbnails/emojis on left, project list on right.
// Hover a project → corresponding image fades in on left.
// Idle → emojis fade in on left. Hover an emoji → small caption card.

const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

function ProjectThumb({ project, active }) {
  // Apple-style: spring-y scale + opacity crossfade
  // A real photo: project.img. If the file is missing, fall back to the gradient
  // placeholder rather than rendering a blank/broken image.
  const [imgFailed, setImgFailed] = useState(false);
  const imgPath = project.img || null;
  useEffect(() => {
    setImgFailed(false);
    if (!imgPath) return;
    const probe = new Image();
    probe.onerror = () => setImgFailed(true);
    probe.src = imgPath;
  }, [imgPath]);
  const imgSrc = imgFailed ? null : imgPath;
  // Video thumbs: restart from frame 0 each time the project is hovered, and
  // crossfade the loop seam (fade out over the last moment, fade back in on
  // restart) so the jump-cut isn't jarring.
  const vidRef = useRef(null);
  const [vidFade, setVidFade] = useState(1);
  const FADE = 0.45; // seconds of fade at the loop seam
  useEffect(() => {
    const v = vidRef.current;
    if (!v || !project.video) return;
    const start = project.videoStart || 0;
    if (active) {
      setVidFade(0);
      try {v.currentTime = start;} catch (e) {}
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      // fade in on the next frame so the 0 → 1 transition animates
      requestAnimationFrame(() => setVidFade(1));
    } else {
      v.pause();
      setVidFade(1);
    }
  }, [active, project.video]);
  const onTimeUpdate = () => {
    const v = vidRef.current;
    if (!v || !v.duration || !isFinite(v.duration)) return;
    const start = project.videoStart || 0;
    // Native loop restarts at 0; re-seek so the trimmed intro stays skipped.
    if (start > 0 && v.currentTime < start - 0.15) {
      try {v.currentTime = start;} catch (e) {}
      return;
    }
    const left = v.duration - v.currentTime;
    setVidFade(left < FADE ? Math.max(0, left / FADE) : 1);
  };
  const onSeekedOrPlay = () => {
    const v = vidRef.current;
    const start = project.videoStart || 0;
    if (v && v.currentTime - start < FADE) setVidFade(1);
  };
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.985)",
        transition: "opacity .55s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: project.video ? project.videoBg || "#f6f8fb" : project.imgBg || "transparent"
      }}>
      
      {project.video ?
      (() => {
        const vid =
        <video
          ref={vidRef}
          src={project.video}
          autoPlay
          muted
          loop
          playsInline
          preload={project.videoPreload ? "auto" : "metadata"}
          onTimeUpdate={onTimeUpdate}
          onSeeked={onSeekedOrPlay}
          aria-label={project.title}
          style={{
            width: project.videoFrame ? "100%" : project.videoWidth || "112%",
            height: "auto",
            maxHeight: project.videoFrame ? undefined : "100%",
            objectFit: "contain",
            display: "block",
            opacity: vidFade,
            transition: "opacity .18s linear",
            // Crop stray edge rows/columns from the source. Use PERCENTAGES so
            // the crop scales with the rendered size — a fixed-px inset covers
            // fewer source rows when the video renders smaller, which let the
            // border show on short viewports. clip-path doesn't affect layout,
            // so the contain/max-height fit is untouched.
            clipPath: project.videoCrop ? `inset(${project.videoCrop})` : undefined
          }} />;

        // Optional browser chrome, matching the case-study figures.
        if (project.videoFrame && window.BrowserFrame) {
          return (
            <div style={{ width: "100%", padding: "0 34px", boxSizing: "border-box" }}>
              <window.BrowserFrame url={project.videoFrame}>{vid}</window.BrowserFrame>
            </div>);

        }
        return vid;
      })() :
      imgSrc ?
      <img
        src={imgSrc}
        alt={project.title}
        onError={() => setImgFailed(true)}
        style={
        // `inset` thumbs sit as a smaller rounded card inside the panel
        // instead of bleeding to the edges.
        project.imgInset ?
        {
          width: "68%",
          maxHeight: "62%",
          objectFit: "cover",
          borderRadius: 16,
          display: "block",
          boxShadow: "0 18px 40px rgba(0,0,0,0.10)"
        } :
        // `fullWidth` fits the whole image to the panel width, no cropping.
        project.imgFullWidth ?
        {
          width: "100%",
          height: "auto",
          maxHeight: "100%",
          objectFit: "contain",
          display: "block"
        } :
        {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        }} /> :


      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(140deg, ${project.color}, color-mix(in oklab, ${project.color} 60%, white))`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: 28,
          color: "white"
        }}>
        
          <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 16px)"
        }} />
          <div style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          letterSpacing: "0.06em",
          opacity: 0.85,
          textTransform: "uppercase",
          position: "relative"
        }}>
            [ {project.title} preview ]
          </div>
        </div>
      }
    </div>);

}

function CompanyLink({ href, children }) {
  // No resting underline — the purple carries the affordance. The underline
  // only appears on hover/focus, and uses text-decoration (not a border) so it
  // follows the text if a name wraps. nowrap keeps two-word names intact.
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={{
        color: "var(--accent)",
        whiteSpace: "nowrap",
        textDecoration: "underline",
        textDecorationColor: "transparent",
        textDecorationThickness: "1px",
        textUnderlineOffset: "3px",
        transition: "text-decoration-color .2s ease, color .2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecorationColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecorationColor = "transparent";
      }}
      onFocus={(e) => {
        e.currentTarget.style.textDecorationColor = "var(--accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.textDecorationColor = "transparent";
      }}>
      {children}
    </a>);
}

function EmojiCloud({ visible, hoveredId, onHover, onNavigate }) {
  // Warm the browser cache for every hover photo once, on mount — so the first
  // hover paints instantly instead of waiting on a network fetch.
  useEffect(() => {
    (window.EMOJIS || []).forEach((e) => {
      if (!e.img) return;
      const pre = new Image();
      pre.src = e.img;
    });
  }, []);
  // Scattered, organic placement — staggered both horizontally and vertically,
  // varied sizes and rotations. Per Figma the emoji frame is a tall narrow
  // column (~228 × 526), so we emulate that with a vertical stack that has
  // intentional left/right offsets to feel hand-placed.
  // Scattered (not a straight line), smaller. Positioned as % within a fixed
  // cluster box that is itself flex-centered in the panel's photo area below
  // the nav — so the whole group reads as vertically centered.
  const positions = [
  { left: "8%", top: "0%", size: 64, rot: -8 }, // upper-left
  { left: "58%", top: "2%", size: 76, rot: 6 }, // upper-right (bigger)
  { left: "30%", top: "27%", size: 70, rot: 4 }, // center
  { left: "80%", top: "33%", size: 58, rot: -5 }, // right (smaller)
  { left: "2%", top: "56%", size: 72, rot: 7 }, // lower-left (bigger)
  { left: "42%", top: "64%", size: 64, rot: -9 }, // lower-center
  { left: "78%", top: "78%", size: 60, rot: 8 }, // lower-right
  // Anchored by `bottom` (not `top`) so its box can never spill past the
  // cluster and collide with the hint text below it.
  // Anchored by `bottom`, so a SMALLER value sits lower. Keep this a plain
  // percentage — EmojiCard parseFloat()s it to place the hover bubble, and a
  // calc() would silently drop the offset and mis-position the card.
  { left: "6%", bottom: "-0.3%", size: 74, rot: -6 }]; // bottom-left

  const hoveredEmoji = hoveredId !== null ? window.EMOJIS[hoveredId] : null;
  const hoveredPos = hoveredId !== null ? positions[hoveredId] : null;

  return (
    <div
      style={{
        position: "absolute",
        // Photo area BELOW the nav bar; emojis are flex-centered within it.
        top: 84,
        left: "6%",
        right: "6%",
        // Reserve the idle hint's strip (it sits at bottom:30 and is ~16px
        // tall) so the cluster's lowest emoji can never collide with it on
        // short viewports.
        bottom: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity .9s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: visible ? "auto" : "none"
      }}>
      {/* Fixed-aspect cluster box: emojis are positioned by % within this,
                       and the box is centered in the area above. */}
      <div style={{ position: "relative", width: "100%", maxWidth: 440, aspectRatio: "1 / 1" }}>
      {window.EMOJIS.map((e, i) => {
          const p = positions[i % positions.length];
          const isHover = hoveredId === i;
          const dim = hoveredId !== null && !isHover;
          return (
            <button
              key={i}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(i)}
              onBlur={() => onHover(null)}
              onClick={() => onNavigate(e.to || "archive/misc")}
              aria-label={e.title + " — open the Archive"}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: p.size * 0.7,
                lineHeight: 1,
                transform: `rotate(${p.rot}deg) scale(${isHover ? 1.12 : 1})`,
                opacity: dim ? 0.35 : 1,
                transition: "transform .35s cubic-bezier(.22,.61,.36,1), opacity .35s ease",
                filter: isHover ? "drop-shadow(0 8px 18px rgba(0,0,0,0.15))" : "none",
                padding: 0,
                animation: visible ? `emojiFloat${i % 3} ${6 + i * 0.4}s ease-in-out infinite` : "none"
              }}>
            
            {e.char}
          </button>);

        })}
      {/* Caption card rendered inside the cluster box so % anchors align */}
      {hoveredEmoji && hoveredPos && <EmojiCard emoji={hoveredEmoji} anchor={hoveredPos} />}
      <style>{`
        @keyframes emojiFloat0 { 0%,100%{translate:0 0} 50%{translate:0 -6px} }
        @keyframes emojiFloat1 { 0%,100%{translate:0 0} 50%{translate:0 -10px} }
        @keyframes emojiFloat2 { 0%,100%{translate:0 0} 50%{translate:0 -4px} }
      `}</style>
      </div>
    </div>);

}

function EmojiCard({ emoji, anchor }) {
  const cardRef = React.useRef(null);
  const [adj, setAdj] = useState({ dx: 0, dy: 0 });
  // If an `img` path fails to load, fall back to the striped placeholder so the
  // card matches the emojis that have no photo yet (instead of a broken image).
  const [imgFailed, setImgFailed] = useState(false);
  const imgPath = emoji && emoji.img;
  useEffect(() => {
    setImgFailed(false);
    if (!imgPath) return;
    const probe = new Image();
    probe.onerror = () => setImgFailed(true);
    probe.src = imgPath;
  }, [imgPath]);
  if (!emoji) return null;
  const shownImg = imgFailed ? null : emoji.img;
  const anchorLeftNum = parseFloat(anchor.left);
  // Bottom-anchored emojis carry `bottom` instead of `top`; convert so the card
  // math below has a single top-based coordinate to work from.
  const anchorTopNum = anchor.top != null ?
  parseFloat(anchor.top) :
  100 - parseFloat(anchor.bottom) - anchor.size / 4.26;
  // Default: bubble appears DIRECTLY BELOW the emoji. Flip ABOVE only when the
  // emoji sits low enough that a below-bubble would be clipped at the bottom.
  const showAbove = anchorTopNum > 60;
  // Center the card horizontally on the emoji; place above or below it.
  const cardLeft = `calc(${anchorLeftNum}% + ${anchor.size / 2}px)`;
  const cardTop = showAbove ?
  `calc(${anchorTopNum}% - 10px)` :
  `calc(${anchorTopNum}% + ${anchor.size}px + 10px)`;
  const baseTransform = showAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";

  // After mount, measure the card against the PANEL it lives in and nudge it
  // back inside if any edge would be clipped — so the bubble is never cut off.
  // The cardIn animation is opacity-only, so the inline centering transform is
  // intact during measurement and getBoundingClientRect reads the final box.
  React.useLayoutEffect(() => {
    const clamp = () => {
      const el = cardRef.current;
      if (!el) return;
      const panel = el.closest("[data-left-panel]");
      const pr = panel ?
      panel.getBoundingClientRect() :
      { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      const r = el.getBoundingClientRect();
      const m = 12;
      // r already includes any current dx/dy, so compute the additional delta.
      let ddx = 0,ddy = 0;
      if (r.left < pr.left + m) ddx += pr.left + m - r.left;
      if (r.right > pr.right - m) ddx -= r.right - (pr.right - m);
      if (r.top < pr.top + m) ddy += pr.top + m - r.top;
      if (r.bottom > pr.bottom - m) ddy -= r.bottom - (pr.bottom - m);
      if (Math.abs(ddx) > 0.5 || Math.abs(ddy) > 0.5) {
        setAdj((prev) => ({ dx: prev.dx + ddx, dy: prev.dy + ddy }));
      }
    };
    clamp();
    // Re-clamp after the opacity animation settles, as a safety net.
    const t = setTimeout(clamp, 300);
    return () => clearTimeout(t);
  }, [emoji, anchor.left, anchor.top, anchor.size]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        left: cardLeft,
        top: cardTop,
        transform: `translate(${adj.dx}px, ${adj.dy}px) ${baseTransform}`,
        width: 200,
        background: "var(--paper)",
        border: "1px solid var(--hair)",
        borderRadius: 16,
        padding: 12,
        boxShadow: "2px 2px 6px -1px var(--shadow-soft), 0 12px 28px rgba(0,0,0,0.08)",
        zIndex: 5,
        pointerEvents: "none",
        animation: "cardIn .25s cubic-bezier(.22,.61,.36,1) both"
      }}>
      
      {emoji.video ?
      <video
        src={emoji.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={emoji.title}
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          objectFit: "cover",
          borderRadius: 11,
          marginBottom: 10,
          display: "block"
        }} /> :
      shownImg ?
      <div style={{
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: 11,
        marginBottom: 10,
        background: `url(${shownImg}) center / cover no-repeat`
      }} /> :
      <div
        className="placeholder-stripe"
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: 11,
          marginBottom: 10
        }}>
        
        photo · {emoji.char}
      </div>
      }
      <div style={{
        fontSize: 13,
        lineHeight: "18px",
        letterSpacing: "-0.02em",
        color: "var(--ink)",
        textAlign: "center",
        fontWeight: 500
      }}>
        {emoji.title}
      </div>
      <div style={{
        marginTop: 4,
        fontSize: 12,
        lineHeight: "16px",
        letterSpacing: "-0.02em",
        color: "rgba(0,0,0,0.6)",
        textAlign: "center",
        fontWeight: 300
      }}>
        {emoji.body}
      </div>
      {/* Signals that the emoji itself is clickable. */}
      <div style={{
        marginTop: 8,
        fontSize: 11,
        letterSpacing: "0.02em",
        color: "var(--accent)",
        textAlign: "center",
        fontWeight: 500
      }}>
        Click to see more →
      </div>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>);

}

// Mobile project-card video that only downloads when the card nears the
// viewport, plays while on screen, and pauses when scrolled away.
function LazyCardVideo({ src, poster, label, style }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {setNear(true);return;}
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          setNear(true);
          const p = el.play && el.play();
          if (p && p.catch) p.catch(() => {});
        } else if (el.pause) {
          el.pause();
        }
      });
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster || undefined}
      muted
      loop
      playsInline
      preload="none"
      autoPlay={near}
      aria-label={label}
      style={style} />);

}

function ProjectRow({ project, hovered, onHover, onOpen, isMobile }) {
  if (isMobile) {
    return (
      <button
        onClick={() => onOpen(project.id)}
        style={{
          textAlign: "left",
          background: "var(--paper)",
          border: "1px solid var(--hair)",
          borderRadius: 16,
          padding: 18,
          width: "100%",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)"
        }}>
        
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.03em" }}>
            {project.title}
          </div>
          <div style={{ fontWeight: 300, fontSize: 16, letterSpacing: "-0.02em", marginTop: 4, color: "rgba(0,0,0,0.7)" }}>
            {project.blurb}
          </div>
        </div>
        {project.video || project.img ?
        // Uniform framed box: every thumbnail is the same size, with the media
        // filling it and cropping from the bottom so sources of differing
        // aspect ratios can't read narrower than each other.
        <div style={{
          width: "100%",
          height: 260,
          borderRadius: 12,
          border: "1px solid var(--hair)",
          overflow: "hidden",
          background: "var(--gray-50)"
        }}>
            {project.video ?
          <LazyCardVideo
            src={project.video}
            poster={project.img}
            label={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} /> :

          <img
            src={project.img}
            alt=""
            onError={(e) => {e.currentTarget.style.display = "none";}}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
          }
          </div> :

        <div className="placeholder-stripe" style={{
          width: "100%",
          height: 260,
          borderRadius: 12,
          border: "1px solid var(--hair)"
        }}>
            [ {project.title} thumbnail ]
          </div>
        }
      </button>);

  }

  const active = hovered === project.id;
  return (
    <button
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      onClick={() => onOpen(project.id)}
      style={{
        position: "relative",
        textAlign: "left",
        background: active ? "color-mix(in oklch, var(--accent) 5%, var(--paper))" : "var(--paper)",
        border: `1px solid ${active ? "color-mix(in oklch, var(--accent) 55%, transparent)" : "transparent"}`,
        borderRadius: 16,

        width: "100%",
        cursor: "pointer",
        fontFamily: "inherit",
        color: active ? "var(--accent)" : "var(--ink)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: active ?
        "0 4px 12px color-mix(in oklch, var(--accent) 11%, transparent)" :
        "none",
        // Padding is CONSTANT in both states, so the text content box keeps the
        // exact same width and never reflows on hover. The indent/shift effect is
        // produced with translateX: shifted left (flush with the hero) when idle,
        // and back to 0 (indented inside the box) when active.
        padding: "clamp(13px,1.8vh,18px) 24px",
        transform: active ? "translateX(0)" : "translateX(-24px)",
        transition: "color .25s ease, background .28s ease, box-shadow .32s ease, border-color .28s ease, transform .32s cubic-bezier(.22,.61,.36,1)"
      }}>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: "23px",
          letterSpacing: "-0.03em"
        }}>
          {project.title}
        </div>
        <div style={{
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "22px",
          letterSpacing: "-0.03em",
          marginTop: 3,
          color: "var(--ink)"
        }}>
          {project.blurb}
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{
          width: 47,
          height: 47,
          borderRadius: 999,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: active ? "var(--accent)" : "transparent",
          border: active ? "none" : "1.5px solid rgba(0,0,0,0.2)",
          color: active ? "white" : "rgba(0,0,0,0.55)",
          transition: "background .3s ease, color .3s ease, border-color .3s ease, transform .35s cubic-bezier(.22,.61,.36,1)",
          // Non-hover: the whole card is shifted left 24px (translateX(-24px)),
          // which also pulls this arrow left. Counter it by +24px so the arrow
          // lines up with the column's right edge / the purple rule above.
          // Hover state stays exactly as before (translateX(2px)).
          transform: active ? "translateX(2px)" : "translateX(24px)"
        }}>
        
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>);

}

function FitColumn({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  // Bounds for the fit. Upscaling is capped well below the point where the
  // layout would start to look inflated on a very tall monitor.
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.16;
  const clampScale = (v) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));
  // Fit the column to the panel: scale DOWN when the content overflows and UP
  // when there's spare height, so the right side reads at a proportional size on
  // both a 14" laptop and a large external monitor. Bounded so it never gets
  // absurd, and gated on fonts.ready — measuring with the fallback font (taller
  // metrics) caused a brief shrink-then-restore flash on load.
  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;
    const measure = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) return;
      const panel = el.closest("[data-fit-panel]");
      if (!panel) return;
      const cs = getComputedStyle(panel);
      let avail = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const wrap = el.parentElement;
      // Clear any reserve left by a previous run BEFORE measuring — a stale
      // inline height on the wrapper skews how `el` lays out and makes the
      // refinement loop converge on a scale that overflows the region.
      if (wrap) wrap.style.height = "";
      // Neutralize any applied transform/width before probing, so candidate
      // measurements below start from a clean, scale-independent layout.
      const prevTransform = el.style.transform;
      const prevWidth = el.style.width;
      // Restore whatever React last rendered. MUST run on every exit path — a
      // bail-out that left `transform:none; width:100%` glued on inline would
      // override React's rendered scale with no re-render to undo it.
      const restore = () => {
        el.style.transform = prevTransform;
        el.style.width = prevWidth;
      };
      el.style.transform = "none";
      el.style.width = "100%";
      // Guard against measuring before layout has settled (panel not yet at
      // full height) — a zero/tiny panel would wrongly compute a small scale.
      // Retry shortly so a bail here can never be the final word.
      if (avail < 80) {restore();retry();return;}

      // Aim well inside the panel so the column keeps real breathing room
      // rather than nearly filling it (which reads as "too big").
      const fitTarget = avail * 0.9;

      // `width: 100/s%` couples the measurement to the scale being solved for:
      // a larger s means a NARROWER box, so text rewraps to more lines and the
      // measured height GROWS. painted(s) is therefore non-monotonic, and a
      // fixed-point iteration lands in whichever basin its first guess falls
      // into — which produced two stable answers (one overflowing, one
      // under-filling) for identical input depending on event timing.
      //
      // Bisection instead: probe candidates directly and keep the LARGEST scale
      // whose ACTUAL painted height fits. Deterministic for a given input, so
      // the result no longer varies machine to machine.
      const paintedAt = (cand) => {
        el.style.width = cand !== 1 ? `${(100 / cand).toFixed(3)}%` : "100%";
        return el.scrollHeight * cand;
      };
      el.style.transform = "none"; // measure layout height only

      let s;
      let painted;
      if (paintedAt(MAX_SCALE) <= fitTarget) {
        s = MAX_SCALE; // even the largest allowed scale fits
      } else if (paintedAt(MIN_SCALE) > fitTarget) {
        s = MIN_SCALE; // nothing in range fits; floor it
      } else {
        let lo = MIN_SCALE; // known to fit
        let hi = MAX_SCALE; // known not to fit
        for (let i = 0; i < 16 && hi - lo > 0.002; i++) {
          const mid = (lo + hi) / 2;
          if (paintedAt(mid) <= fitTarget) lo = mid;else
          hi = mid;
        }
        s = lo;
      }

      // Snap to exactly 1 when the transform wouldn't be perceptible.
      if (Math.abs(s - 1) < 0.004) s = 1;

      // Final measure in the state we'll actually render.
      painted = paintedAt(s) / s;
      // Safety net: never reserve more than the region can show.
      if (painted * s > avail) {
        s = clampScale(avail / painted);
        painted = paintedAt(s) / s;
      }
      // Restore whatever React last rendered; the state update below re-applies.
      restore();

      setScale((prev) => Math.abs(prev - s) > 0.004 ? s : prev);
      // Reserve the height the element actually PAINTS at this scale, and never
      // more than the region can show, so content can't be clipped out of reach.
      if (wrap) wrap.style.height = s !== 1 ? `${Math.min(Math.ceil(painted * s), Math.floor(avail))}px` : "";
    };
    // Measure on the next frame(s) so layout + first paint have happened.
    // Trailing-edge debounce: a new trigger must NOT cancel an already-pending
    // measurement outright, or a burst of ResizeObserver callbacks during
    // font/layout settle can starve it and leave `scale` stuck at 1 forever.
    let pending = false;
    const measureSoon = () => {
      if (pending) return; // one is already queued — it will pick up latest layout
      pending = true;
      raf = requestAnimationFrame(() => requestAnimationFrame(() => {
        pending = false;
        measure();
      }));
    };
    // Re-arm after an unsettled-layout bail so the fit always resolves.
    let retryTimer = 0;
    const retry = () => {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {if (!cancelled) measureSoon();}, 120);
    };
    // Defer the first fit decision until fonts are ready (avoids fallback-metric flicker).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {if (!cancelled) measureSoon();});
    } else {
      setTimeout(measureSoon, 300);
    }
    // Re-measure once everything (images/layout) has fully loaded.
    window.addEventListener("load", measureSoon);
    window.addEventListener("resize", measure);
    // A ResizeObserver catches late layout changes (the same settle a manual
    // zoom toggle forces) so the initial scale is correct without user action.
    let ro = null;
    const el0 = ref.current;
    const panel0 = el0 && el0.closest("[data-fit-panel]");
    if (typeof ResizeObserver !== "undefined" && panel0) {
      // Measure directly (like `resize`) rather than through the debounce, so a
      // late panel-height change always produces a measurement.
      ro = new ResizeObserver(() => {if (!cancelled) measure();});
      ro.observe(panel0);
    }
    // Belt-and-braces: a few spaced measurements across the mount window catch
    // any settle that slips between fonts.ready, load, and the observer.
    const settleTimers = [80, 260, 600, 1200].map((ms) =>
    setTimeout(() => {if (!cancelled) measure();}, ms)
    );
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(retryTimer);
      settleTimers.forEach(clearTimeout);
      window.removeEventListener("load", measureSoon);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, []);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 0, flexShrink: 0 }}>
      <div
        ref={ref}
        style={{
          transformOrigin: "top left",
          transform: scale !== 1 ? `scale(${scale})` : "none",
          width: scale !== 1 ? `${(100 / scale).toFixed(3)}%` : "100%"
        }}>
        {children}
      </div>
    </div>);
}

function HomeDesktop({ onOpen, onNavigate }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(null);

  // Idle detection — emojis fade in after no project hover for N seconds
  const resetIdle = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 1000);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimer.current);
  }, [resetIdle]);

  useEffect(() => {
    if (hoveredProject) {
      setIdle(false);
      clearTimeout(idleTimer.current);
    } else {
      resetIdle();
    }
  }, [hoveredProject, resetIdle]);

  const showEmojis = idle && !hoveredProject;
  const showThumb = !!hoveredProject;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr"
    }}>
      
      <window.SiteNav onNavigate={onNavigate} current="work" overlay={true} />

      {/* LEFT — gradient panel for thumbnails / emojis */}
      <div data-left-panel="true" style={{
        position: "relative",
        background: "linear-gradient(180deg, rgb(255,255,255) 0%, rgb(226,226,226) 100%)",
        overflow: "hidden",
        height: "100vh"
      }}>
        {/* Project thumbnails (cross-fade) */}
        {window.PROJECTS.map((p) =>
        <ProjectThumb key={p.id} project={p} active={hoveredProject === p.id} />
        )}

        {/* Emojis (idle) */}
        <EmojiCloud visible={showEmojis && !showThumb} hoveredId={hoveredEmoji} onHover={setHoveredEmoji} onNavigate={onNavigate} />

        {/* Emoji caption card is rendered inside <EmojiCloud /> above */}

        {/* Idle hint — appears with the emojis */}
        <div style={{
          position: "absolute",
          left: 40,
          bottom: 30,
          fontSize: 13,
          color: "rgba(0,0,0,0.45)",
          letterSpacing: "-0.01em",
          opacity: showEmojis && hoveredEmoji === null ? 1 : 0,
          transition: "opacity .6s ease"
        }}>
          ↑ hover over the emojis — these are a few things I'm into
        </div>
      </div>

      {/* RIGHT — content panel */}
      <div style={{
        position: "relative",
        background: "var(--paper)",
        borderLeft: "1px solid var(--hair)",
        padding: "clamp(64px, 8vh, 96px) clamp(36px, 5vw, 80px) clamp(20px, 3vh, 48px)",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Centered content region — footer is pinned to the panel bottom below it */}
        <div data-fit-panel="true" style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
        <FitColumn>
        <div style={{ maxWidth: 620 }}>
          {/* Hero */}
          <h1 style={{
                margin: 0,
                fontWeight: 300,
                fontSize: 28,

                letterSpacing: "-0.03em",
                color: "var(--ink)", lineHeight: "1.32", padding: "0px 0px 4px"
              }}>
            <span style={{ fontWeight: 700 }}>Serena Ng</span> is a product-obsessed designer who believes good design is never finished.
          </h1>

          <div style={{
                marginTop: "clamp(12px, 2.2vh, 22px)",
                fontWeight: 300,
                fontSize: 16.5,
                lineHeight: "26px",
                letterSpacing: "-0.02em",
                color: "rgba(0,0,0,0.78)"
              }}>
            <div>Patient experience + AI workflows @ <CompanyLink href="https://www.epic.com">Epic Health Systems</CompanyLink></div>
            <div>Previously designed for <CompanyLink href="https://www.ronikdesign.com/">Ronik</CompanyLink>, <CompanyLink href="https://snyk.io">Snyk</CompanyLink>, <CompanyLink href="https://www.jfkairport.com/">JFK Airport</CompanyLink>, <CompanyLink href="https://plus.reuters.com/p/1">Reuters</CompanyLink>, and more.</div>
          </div>

          <div className="accent-rule" style={{ marginTop: "clamp(18px, 3.5vh, 36px)", margin: "34px 0px 0px" }} />

          {/* Project list */}
          <div style={{
                marginTop: "clamp(14px, 2.6vh, 28px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(11px, 2vh, 20px)"
              }}>
            {window.PROJECTS.map((p) =>
                <ProjectRow
                  key={p.id}
                  project={p}
                  hovered={hoveredProject}
                  onHover={setHoveredProject}
                  onOpen={onOpen} />

                )}
          </div>
        </div>

        {/* Footer pinned to the bottom of the panel */}
        </FitColumn>
        </div>
      </div>
    </div>);
}

function HomeMobile({ onOpen, onNavigate }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: 28
    }}>
      <window.SiteNav onNavigate={onNavigate} current="work" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero */}
      <div style={{ marginTop: 4 }}>
        <h1 style={{
            margin: 0,
            fontWeight: 300,
            fontSize: 22,
            lineHeight: "30px",
            letterSpacing: "-0.03em"
          }}>
          <span style={{ fontWeight: 700 }}>Serena Ng</span> is a product-obsessed designer who believes good design is never finished.
        </h1>
        <div style={{
            marginTop: 16,
            fontWeight: 300,
            fontSize: 15,
            lineHeight: "23px",
            letterSpacing: "-0.02em",
            color: "rgba(0,0,0,0.78)"
          }}>
          <div>Patient experience + AI workflows @ <CompanyLink href="https://www.epic.com">Epic</CompanyLink></div>
          <div>Previously designed for <CompanyLink href="https://www.ronikdesign.com/">Ronik</CompanyLink>, <CompanyLink href="https://snyk.io">Snyk</CompanyLink>, <CompanyLink href="https://www.jfkairport.com/">JFK Airport</CompanyLink>, etc.</div>
        </div>
        <div className="accent-rule" style={{ marginTop: 22 }} />
      </div>

      {/* Project cards (header + info + thumbnail below) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {window.PROJECTS.map((p) =>
          <ProjectRow key={p.id} project={p} onOpen={onOpen} isMobile={true} />
          )}
      </div>

      {/* About me — quick bits (replaces emoji hover on mobile) */}
      <div style={{ paddingTop: 16, paddingBottom: 24 }}>
        <div style={{ fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 12 }}>
          Outside of work
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {/* All chips go to the Archive index — unlike the desktop emoji
              cloud, which routes to specific sub-archives. */}
          {window.EMOJIS.map((e, i) =>
            <button
              key={i}
              onClick={() => onNavigate("archive")}
              aria-label={e.title + " — open the Archive"}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--hair)",
                borderRadius: 999,
                padding: "6px 12px 6px 8px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
                color: "var(--ink)",
                cursor: "pointer"
              }}>
              <span style={{ fontSize: 16 }}>{e.char}</span>
              <span>{e.title.split(",")[0]}</span>
            </button>
            )}
        </div>
      </div>
      </div>
      <window.SiteFooter />
    </div>);

}

function Home({ onOpen, onNavigate, isMobile }) {
  return isMobile ? <HomeMobile onOpen={onOpen} onNavigate={onNavigate} /> : <HomeDesktop onOpen={onOpen} onNavigate={onNavigate} />;
}

window.Home = Home;