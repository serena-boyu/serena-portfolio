// Project case study page — compact grouped sidebar + wide single-column content.

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// Which sidebar group each section belongs to (echoes the reference layout).
const SIDEBAR_GROUPS = [
{ label: "Summary", ids: ["summary", "background", "overview", "context", "problem", "solution"] },
{ label: "Process", ids: ["research", "scope", "improvements", "wireframes", "exploration", "feedback", "final", "process", "retrospective", "reflection"] }];


// Lets any nested CaseFigure open the page-level lightbox without threading
// a handler through every render path.
const ZoomCtx = React.createContext(null);

// Safari-style window chrome for screen recordings. Rendering the frame in CSS
// (rather than baking it into the video) keeps the chrome crisp at any DPR and
// lets the URL change per project.
// NOTE: the `browser_window.jsx` starter was evaluated and rejected here — it's
// a dark-theme Chrome window with a tab bar at a fixed pixel width/height,
// whereas these figures need light Safari chrome, no tab bar, and fluid width
// to fill the case-study content column.
function BrowserFrame({ url, children }) {
  const dot = (bg) => ({ width: 10, height: 10, borderRadius: "50%", background: bg, flexShrink: 0 });
  return (
    <div style={{
      borderRadius: 11,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.13)",
      boxShadow: "0 10px 34px rgba(0,0,0,0.13)"
    }}>
      {/* Toolbar — deliberately minimal so the recording stays the focus. */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 12px",
        height: 34,
        background: "linear-gradient(#fbfbfb, #f3f3f3)",
        borderBottom: "1px solid rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={dot("#ff5f57")} />
          <span style={dot("#febc2e")} />
          <span style={dot("#28c840")} />
        </div>
        {/* Address bar — narrow and centered; it labels the screen, nothing more. */}
        <div style={{
          margin: "0 auto",
          maxWidth: 290,
          height: 21,
          borderRadius: 5,
          background: "rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px"
        }}>
          <span style={{
            fontSize: 11,
            letterSpacing: "-0.01em",
            color: "rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>{url}</span>
        </div>
        {/* Balances the traffic lights so the URL sits optically centered. */}
        <div style={{ width: 42, flexShrink: 0 }} aria-hidden="true" />
      </div>
      {children}
    </div>);

}

// Minimalist phone shell for mobile screen recordings: rounded corners, no
// bezel or notch, soft shadow behind, and a plain mobile-browser address bar
// so the recording reads as a phone in a browser. Narrow and centered so a
// portrait recording doesn't dominate the column.
function PhoneFrame({ url, children }) {
  return (
    <div style={{
      width: "100%",
      maxWidth: 290,
      margin: "0 auto",
      // Hold real phone proportions; the address bar eats into this box and the
      // recording is cropped at the bottom to fit, as in a real screenshot.
      aspectRatio: "9 / 19.5",
      display: "flex",
      flexDirection: "column",
      borderRadius: 30,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 14px 40px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.06)"
    }}>
      {/* Address bar — deliberately plain; it labels the screen, nothing more. */}
      <div style={{
        flexShrink: 0,
        height: 32,
        background: "#f4f4f5",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 54px"
      }}>
        <div style={{
          width: "100%",
          height: 20,
          borderRadius: 999,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px"
        }}>
          <span style={{
            fontSize: 10,
            letterSpacing: "-0.01em",
            color: "rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>{url}</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>);

}

// Large case-study figure: image (or placeholder) on a soft panel, caption below.
// Skips a lead-in on a looping figure video (native loop always restarts at 0).
function useVideoStart(videoStart) {
  const ref = useRefP(null);
  const onLoaded = () => {
    const v = ref.current;
    if (v && videoStart) {try {v.currentTime = videoStart;} catch (e) {}}
  };
  const onTimeUpdate = () => {
    const v = ref.current;
    if (!v || !videoStart) return;
    if (v.currentTime < videoStart - 0.15) {try {v.currentTime = videoStart;} catch (e) {}}
  };
  return videoStart ? { ref, onLoadedMetadata: onLoaded, onTimeUpdate } : {};
}

function CaseFigure({ src, videoSrc, caption, label, aspect = "16 / 10", priority = false, w = 1600, h = 1200, crop, bleed, frame, phoneFrame, flat, spaceAbove, shadow, maxWidth, videoStart }) {
  const onZoom = React.useContext(ZoomCtx);
  const canZoom = !!(onZoom && (src || videoSrc));
  const open = () => canZoom && onZoom({ caption, src, videoSrc });
  const vidStart = useVideoStart(videoStart);
  return (
    <figure className={frame ? "browser-figure" : undefined} style={{
      margin: phoneFrame ? "52px auto 34px" : frame ? "22px auto 34px" : `${spaceAbove != null ? spaceAbove : 22}px 0 0`,
      maxWidth: maxWidth || undefined
    }}>
      <div
        role={canZoom ? "button" : undefined}
        tabIndex={canZoom ? 0 : undefined}
        aria-label={canZoom ? "View larger" : undefined}
        onClick={canZoom ? open : undefined}
        onKeyDown={canZoom ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();open();}} : undefined}
        style={{
        position: "relative",
        width: "100%",
        aspectRatio: src || videoSrc ? undefined : aspect,
        borderRadius: frame || phoneFrame || flat ? 0 : 12,
        background: frame || phoneFrame || flat ? "transparent" : "var(--gray-50)",
        border: frame || phoneFrame || flat ? "none" : "1px solid var(--hair)",
        overflow: frame || phoneFrame ? "visible" : "hidden",
        cursor: canZoom ? "zoom-in" : undefined,
        display: src || videoSrc ? "block" : "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: shadow ? "0 3px 12px rgba(0,0,0,0.07)" : undefined
      }}>
        {phoneFrame ?
        <PhoneFrame url={typeof phoneFrame === "string" ? phoneFrame : frame}>
          <video
            {...vidStart}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={src || undefined}
            aria-label={caption || "Demo video"}
            style={{
              width: "100%",
              height: "calc(100% + 2px)",
              objectFit: "cover",
              objectPosition: "top center",
              clipPath: "inset(0 0 2px 0)",
              display: "block",
              pointerEvents: canZoom ? "none" : undefined
            }} />
        </PhoneFrame> :
        frame ?
        <BrowserFrame url={frame}>
          <video
            {...vidStart}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={src || undefined}
            aria-label={caption || "Demo video"}
            style={{ width: "100%", height: "auto", display: "block", pointerEvents: canZoom ? "none" : undefined }} />
        </BrowserFrame> :
        /* Video takes precedence, then image — set `videoSrc`/`src` in the data. */
        videoSrc ?
        <video
          {...vidStart}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={src || undefined}
          aria-label={caption || "Demo video"}
          style={{ width: bleed ? `calc(100% + ${bleed * 2}px)` : "100%", height: "auto", display: "block", pointerEvents: canZoom ? "none" : undefined,
            // `bleed` overfills the box so the container's overflow trims stray
            // edge rows — no panel background peeks through, unlike a clip.
            marginLeft: bleed ? -bleed : undefined,
            marginTop: bleed ? -bleed : undefined,
            marginBottom: bleed ? -bleed : undefined,
            // Trim stray edge rows from the source. clip-path doesn't affect layout.
            clipPath: crop ? `inset(${crop})` : undefined }} /> :
        src ?
        <img
          src={src}
          alt={caption || ""}
          width={w}
          height={h}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : undefined}
          style={{
            width: "100%",
            height: "auto",
            display: "block"
          }} /> :
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11, letterSpacing: "0.04em", color: "rgba(0,0,0,0.4)",
          textTransform: "uppercase"
        }}>
            {label || "image"}
          </div>
        }
      </div>
      {caption &&
      <figcaption style={{
        marginTop: frame || phoneFrame ? 20 : 10,
        textAlign: phoneFrame ? "center" : undefined,
        fontSize: 13,
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "rgba(0,0,0,0.5)"
      }}>
          {caption}
        </figcaption>
      }
    </figure>);

}

function CompactSidebar({ sections, activeId, onJump, onTop, onHome }) {
  // Flat list of sections, each optionally followed by its subsection links.
  return (
    // Sticky column that does NOT scroll. Holds the Back to Home button plus
    // the section nav, so the button stays pinned while a long section list
    // scrolls internally beneath it.
    <div
      style={{
        position: "sticky",
        // The nav is 58px tall, so this clears it by 8px. NOTE: this sticky
        // offset — not marginTop — controls the button's position while the
        // page is scrolled, which is when the sidebar is actually being used.
        top: 66,
        alignSelf: "flex-start",
        width: 168,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        // Raises the unscrolled (top of page) position to roughly match.
        marginTop: -52
      }}>
      {/* The top nav auto-hides while reading, so this is the persistent
          way back to the work index. */}
      <button
        className="pill-btn ghost"
        onClick={onHome}
        style={{ alignSelf: "flex-start", marginBottom: 20, flexShrink: 0 }}>
        <span style={{ display: "inline-block" }}>←</span> Back to Home
      </button>
      <nav
      aria-label="Case study sections"
      className="no-scrollbar"
      style={{
        // Cap to the pinned viewport MINUS the button above, so long section
        // lists stay reachable without pushing the button off-screen.
        maxHeight: "calc(100vh - 90px - 52px)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}>
      {sections.map((s) => {
        const isActive = s.id === activeId;
        const subs = s.subsections || [];
        // Divider marks the shift from outcome sections to process sections.
        const divider = s.id === "process";
        return (
          <div key={s.id}>
            {divider &&
            <div style={{
              height: 1,
              background: "var(--hair)",
              margin: "10px 0 10px 12px"
            }} />
            }
            <button
              onClick={() => onJump(s.id)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                padding: "5px 0 5px 12px",
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                lineHeight: "18px",
                letterSpacing: "-0.01em",
                color: isActive ? "var(--accent)" : "rgba(0,0,0,0.55)",
                fontWeight: isActive ? 600 : 400,
                transition: "color .2s ease"
              }}>
              <span style={{
                position: "absolute",
                left: 0,
                top: 6,
                bottom: 6,
                width: 2,
                borderRadius: 2,
                background: isActive ? "var(--accent)" : "transparent",
                transition: "background .2s ease"
              }} />
              {s.sidebarLabel || s.navLabel || s.title}
            </button>
            {subs.length > 0 &&
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 4 }}>
                {subs.map((sub, i) => {
                // Unnumbered subsections (e.g. a restated problem) aren't
                // separate destinations — keep them out of the nav.
                if (sub.unnumbered) return null;
                const subId = `${s.id}-${i}`;
                const subActive = subId === activeId;
                return (
                  <button
                    key={subId}
                    onClick={() => onJump(subId)}
                    style={{
                      position: "relative",
                      background: "none",
                      border: "none",
                      padding: "3px 0 3px 24px",
                      textAlign: "left",
                      width: "100%",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 11.5,
                      lineHeight: "16px",
                      letterSpacing: "-0.01em",
                      color: subActive ? "var(--accent)" : "rgba(0,0,0,0.42)",
                      fontWeight: subActive ? 600 : 400,
                      transition: "color .2s ease"
                    }}>
                      <span style={{
                      position: "absolute",
                      left: 12,
                      top: 4,
                      bottom: 4,
                      width: 2,
                      borderRadius: 2,
                      background: subActive ? "var(--accent)" : "transparent",
                      transition: "background .2s ease"
                    }} />
                      {sub.navLabel || sub.kicker}
                    </button>);

              })}
              </div>
            }
          </div>);

      })}
      <button
        onClick={onTop}
        style={{
          background: "none", border: "none", padding: "2px 0 0 12px", textAlign: "left",
          cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.4)", marginTop: 22
        }}>
        ↑ Back to top
      </button>
      </nav>
    </div>);

}

function MobileTimeline({ sections, activeId, onJump }) {
  // The pill row scrolls horizontally and can be many pills wide, so the
  // active one drifts out of view as the reader moves down the page. Nudge the
  // row so the current section is always visible.
  const barRef = useRefP(null);
  useEffectP(() => {
    const bar = barRef.current;
    if (!bar) return;
    const pill = bar.querySelector("[data-active-pill='1']");
    if (!pill) return;
    const barBox = bar.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();
    const pad = 16;
    let delta = 0;
    if (pillBox.left < barBox.left + pad) delta = pillBox.left - barBox.left - pad;else
    if (pillBox.right > barBox.right - pad) delta = pillBox.right - barBox.right + pad;
    if (!delta) return;
    // scrollBy avoids scrollIntoView, which would also scroll the page.
    bar.scrollBy({ left: delta, behavior: "smooth" });
  }, [activeId]);
  // The main site-nav compacts on scroll (its height changes) and, on case
  // study pages, slides out of view entirely. Track its VISUAL bottom edge —
  // getBoundingClientRect() accounts for the transform, so the sub-nav follows
  // the nav up and sits flush at the top once it's hidden (no see-through gap).
  const [navH, setNavH] = useStateP(48);
  useEffectP(() => {
    let raf = 0;
    const measure = () => {
      const nav = document.querySelector(".site-nav");
      if (nav) setNavH(Math.max(0, Math.round(nav.getBoundingClientRect().bottom)));
    };
    // Follow the nav's 0.3s transform for the whole transition, not just its
    // end state, so the sub-nav never lags behind and expose a gap.
    const track = () => {
      measure();
      raf = requestAnimationFrame(track);
    };
    let stopAt = 0;
    const kick = () => {
      stopAt = Date.now() + 450;
      if (!raf) track();
      // Stop the rAF loop once the transition has settled.
      clearTimeout(kick._t);
      kick._t = setTimeout(function stop() {
        if (Date.now() >= stopAt) {cancelAnimationFrame(raf);raf = 0;measure();} else
        kick._t = setTimeout(stop, 60);
      }, 450);
    };
    measure();
    window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("scroll", kick, { passive: true, capture: true });
    window.addEventListener("mousemove", kick, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", kick);
      document.removeEventListener("scroll", kick, { capture: true });
      window.removeEventListener("mousemove", kick);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
      clearTimeout(kick._t);
    };
  }, []);
  return (
    <div style={{
      position: "sticky",
      top: Math.max(0, navH - 1),
      zIndex: 20,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--hair)",
      padding: "10px 16px",
      display: "flex",
      gap: 8,
      overflowX: "auto"
    }} className="no-scrollbar" ref={barRef}>
      {sections.map((s) => {
        // The scroll spy reports subsection ids too (e.g. "improvements-2"),
        // which match no pill here — so nothing highlighted once you scrolled
        // into one. Resolve those back to their parent section.
        const isActive = s.id === activeId || String(activeId || "").startsWith(s.id + "-");
        return (
          <button
            key={s.id}
            data-active-pill={isActive ? "1" : undefined}
            onClick={() => onJump(s.id)}
            style={{
              border: "1px solid var(--hair)",
              background: isActive ? "var(--accent)" : "var(--paper)",
              color: isActive ? "white" : "rgba(0,0,0,0.7)",
              borderRadius: 999,
              padding: "5px 11px",
              fontSize: 12,
              letterSpacing: "-0.01em",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background .2s ease, color .2s ease"
            }}>
            {s.sidebarLabel || s.navLabel || s.title}
          </button>);

      })}
    </div>);

}

// Per-section figures. Real assets get reused here as they're added.
// Per-section figure LAYOUT (count, aspect, placeholder label). The actual
// image `src` comes from each project's data (section.figures[i].src) — swap
// those paths in data.jsx. Leave src blank to show the labeled placeholder.
const SECTION_FIGURES = {
  summary: [{ label: "summary image", aspect: "16 / 10" }],
  research: [{ label: "research synthesis board", aspect: "16 / 9" }],
  wireframes: [
  { label: "low-fi wireframes — round 1", aspect: "16 / 9" },
  { label: "refined flow — round 4", aspect: "16 / 9" }],

  feedback: [{ label: "usability test highlights", aspect: "16 / 9" }],
  final: [{ label: "final shipped flow", aspect: "16 / 10" }]
};

// Big-number stats band — call out headline impact numbers.
function StatsBand({ stats }) {
  return (
    <div style={{
      marginTop: 22,
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
      gap: 14
    }}>
      {stats.map((s, i) =>
      <div key={i} style={{
        padding: "20px 22px",
        border: "1px solid color-mix(in oklch, var(--accent) 26%, transparent)",
        borderRadius: 14,
        background: "color-mix(in oklch, var(--accent) 6%, transparent)"
      }}>
          <div style={{
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-0.04em",
          color: "var(--accent)",
          lineHeight: 1.05
        }}>{s.value}</div>
          <div style={{
          marginTop: 7,
          fontWeight: 300,
          fontSize: 13.5,
          lineHeight: "19px",
          letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.7)"
        }}>{s.label}</div>
        </div>
      )}
    </div>);

}

// Quote wall — user research quotes as speech bubbles.
function QuoteWall({ quotes, maxWidth }) {
  return (
    <div style={{
      marginTop: 22,
      maxWidth: maxWidth || undefined,
      // A lone quote reads better full width than stranded in one column.
      columnCount: quotes.length > 1 ? 2 : 1,
      columnGap: 14
    }} className="quote-wall">
      {quotes.map((q, i) =>
      <div key={i} style={{
        breakInside: "avoid",
        marginBottom: 14,
        padding: "15px 17px",
        border: "1px solid var(--hair)",
        borderRadius: "14px 14px 14px 4px",
        background: "color-mix(in oklch, var(--accent) 5%, var(--paper))",
        borderColor: "color-mix(in oklch, var(--accent) 18%, var(--hair))",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
      }}>
          <div style={{
          fontWeight: 300,
          fontSize: 14,
          lineHeight: "21px",
          letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.82)",
          textWrap: "pretty"
        }}>
            “{q.text}”
          </div>
          <div style={{
          marginTop: 9,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--accent)"
        }}>
            {q.author}
          </div>
        </div>
      )}
    </div>);

}

// Bulleted list of key improvements.
function KeyList({ title, items }) {
  return (
    <div style={{ marginTop: 20 }}>
      {title &&
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.5)",
        marginBottom: 10
      }}>{title}</div>
      }
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) =>
        <li key={i} style={{
          position: "relative",
          paddingLeft: 18,
          fontWeight: 300,
          fontSize: 14.5,
          lineHeight: "22px",
          letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.78)"
        }}>
            <span style={{
            position: "absolute", left: 2, top: 8,
            width: 5, height: 5, borderRadius: "50%",
            background: "var(--accent)"
          }} />
            <RichText text={it} />
          </li>
        )}
      </ul>
    </div>);

}

// Inline **bold** and [text](url) support inside body copy — lets the data
// emphasize the most scannable phrase, or link out, without hand-writing JSX.
function RichText({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return <strong key={i} style={{ fontWeight: 600, color: "rgba(0,0,0,0.92)" }}>{p.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
    if (link) {
      return (
        <a
          key={i}
          className="footer-link"
          href={link[2]}
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "var(--accent)" }}>
          {link[1]}
        </a>);

    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

// Paragraph run used by both sections and their subsections.
function Paras({ body }) {
  return (body || []).map((p, i) =>
  <p key={i} style={{
    margin: i === 0 ? 0 : "13px 0 0",
    fontWeight: 300,
    fontSize: 15,
    lineHeight: "24px",
    letterSpacing: "-0.01em",
    color: "rgba(0,0,0,0.78)",
    textWrap: "pretty"
  }}>
      <RichText text={p} />
    </p>
  );
}

// Headed note blocks. `boxed` wraps them in an accent-tinted panel (used for
// "Key issues"-style summaries that should read as a callout).
function NotesBlock({ title, notes, boxed, columns, spaceAbove }) {
  return (
    <div style={Object.assign(
      { maxWidth: 680, marginTop: spaceAbove != null ? spaceAbove : 30 },
      boxed ? {
        background: "color-mix(in oklch, var(--accent) 6%, transparent)",
        border: "1px solid color-mix(in oklch, var(--accent) 24%, transparent)",
        borderRadius: 14,
        padding: "18px 22px 20px"
      } : null
    )}>
      {title &&
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: boxed ? "var(--accent)" : "rgba(0,0,0,0.5)",
        marginBottom: 16
      }}>{title}</div>
      }
      <div
        className={columns ? "notes-grid" : undefined}
        style={columns ?
        { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 26, rowGap: 18 } :
        { display: "flex", flexDirection: "column", gap: 20 }}>
        {notes.map((nt, i) =>
        <div key={i}>
            <div style={{
            fontWeight: 700,
            fontSize: 15.5,
            letterSpacing: "-0.02em",
            marginBottom: 6
          }}>{nt.title}</div>
            <Paras body={nt.body} />
          </div>
        )}
      </div>
    </div>);

}

function Section({ section, registerRef, projectId }) {
  // Merge layout placeholders with any per-project figure data (by index):
  // the data supplies src/caption, the layout supplies aspect/label/count.
  const layout = SECTION_FIGURES[section.id] || [];
  const provided = section.figures || [];
  // A project that declares `figures` owns its figure count outright — including
  // an empty array, which means "no figures here" rather than "fall back to the
  // layout default" (that fallback used to render a bare labeled placeholder).
  // Only sections with no `figures` key at all inherit the layout scaffolding.
  const n = section.figures ? provided.length : layout.length;
  const figures = Array.from({ length: n }, (_, i) =>
  Object.assign({}, layout[i] || layout[0] || {}, provided[i] || {}));
  void projectId;
  return (
    <section
      id={section.id}
      ref={(el) => registerRef(section.id, el)}
      style={{
        scrollMarginTop: 70,
        padding: "44px 0",
        borderBottom: "1px solid var(--hair-soft)"
      }}>
      <div style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--accent)",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <span>{section.eyebrow}</span>
        {(section.navLabel || section.title) &&
        <>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>{section.navLabel || section.title}</span>
          </>
        }
      </div>
      {section.highlight ?
      <h2 style={{
        margin: 0,
        maxWidth: 760,
        fontWeight: 700,
        fontSize: 23,
        lineHeight: "32px",
        letterSpacing: "-0.03em",
        color: "var(--accent)",
        background: "color-mix(in oklch, var(--accent) 8%, transparent)",
        border: "1px solid color-mix(in oklch, var(--accent) 26%, transparent)",
        borderRadius: 14,
        padding: "15px 22px 18px"
      }}>
          <span style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity: 0.75,
        marginBottom: 3
      }}>{section.highlightLabel || "Main Problem"}</span>
          {section.title}
        </h2> :
      <h2 style={{
        margin: 0,
        fontWeight: 700,
        fontSize: 23,
        lineHeight: "29px",
        letterSpacing: "-0.03em"
      }}>
          {section.title}
        </h2>
      }

      <div style={{ maxWidth: 680, marginTop: 14 }}>
        <Paras body={section.body} />

        {section.callout &&
        <div style={{
          marginTop: 22,
          padding: "18px 20px",
          border: "1px solid var(--hair)",
          borderRadius: 14,
          background: "var(--gray-50)",
          display: "flex",
          gap: 18,
          alignItems: "center"
        }}>
            <div style={{
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "-0.04em",
            color: "var(--accent)",
            lineHeight: 1,
            flexShrink: 0
          }}>
              {section.callout.stat}
            </div>
            <div style={{
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.01em",
            color: "rgba(0,0,0,0.7)"
          }}>
              {section.callout.label}
            </div>
          </div>
        }
      </div>

      {section.link &&
      <div style={{ maxWidth: 680, marginTop: 18, marginBottom: 14 }}>
          <a
          className="pill-btn"
          href={section.link.href}
          target="_blank"
          rel="noreferrer noopener"
          style={{ textDecoration: "none", display: "inline-flex" }}>
            {section.link.label} <span className="arr">→</span>
          </a>
        </div>
      }

      {section.stats && <StatsBand stats={section.stats} />}
      {section.quotes && <QuoteWall quotes={section.quotes} />}
      {section.notes && !section.notesAfterFigures &&
      <NotesBlock title={section.notesTitle} notes={section.notes} boxed={section.notesBoxed} columns={section.notesColumns} spaceAbove={section.notesSpaceAbove} />
      }
      {section.bullets &&
      <div style={{ maxWidth: 680 }}>
          <KeyList title={section.bulletsTitle} items={section.bullets} />
        </div>
      }

      {/* Figures span the full content width (most of the page). */}
      {figures.map((f, i) =>
      <CaseFigure key={i} src={f.src} videoSrc={f.videoSrc} caption={f.caption} label={f.label} aspect={f.aspect} crop={f.crop} bleed={f.bleed} frame={f.frame} phoneFrame={f.phoneFrame} flat={f.flat} spaceAbove={f.spaceAbove} shadow={f.shadow} maxWidth={f.maxWidth} videoStart={f.videoStart} />
      )}

      {/* Notes deferred to sit below the figures. */}
      {section.notes && section.notesAfterFigures &&
      <NotesBlock title={section.notesTitle} notes={section.notes} boxed={section.notesBoxed} columns={section.notesColumns} spaceAbove={section.notesSpaceAbove} />
      }

      {section.closingHeadline &&
      <h3 style={{
        margin: "52px 0 0",
        fontWeight: 700,
        fontSize: 24,
        lineHeight: "33px",
        letterSpacing: "-0.03em",
        maxWidth: 760,
        whiteSpace: "pre-line"
      }}>{section.closingHeadline}</h3>
      }
      {section.closingBody &&
      <div style={{ maxWidth: 680, marginTop: 12 }}>
          <Paras body={section.closingBody} />
        </div>
      }

      {/* Numbered subsections (e.g. the improvement areas). An `unnumbered`
          subsection shows no badge and doesn't consume a number. */}
      {(section.subsections || []).map((sub, si) => {
        const num = (section.subsections || []).
        slice(0, si + 1).filter((x) => !x.unnumbered).length;
        return (
        <div
          key={si}
          id={`${section.id}-${si}`}
          ref={(el) => registerRef(`${section.id}-${si}`, el)}
          style={{ marginTop: sub.spaceAbove != null ? sub.spaceAbove : sub.unnumbered ? 14 : 72, scrollMarginTop: 70 }}>
          {!sub.unnumbered &&
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 9 }}>
            <span style={{
            flexShrink: 0,
            width: 24, height: 24,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            display: "grid",
            placeItems: "center"
          }}>{num}</span>
            <span style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent)"
          }}>{sub.kicker}</span>
          </div>
          }
          {sub.highlight ?
        <h3 style={{
          margin: 0,
          maxWidth: 760,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "33px",
          letterSpacing: "-0.03em",
          color: "var(--accent)",
          background: "color-mix(in oklch, var(--accent) 8%, transparent)",
          border: "1px solid color-mix(in oklch, var(--accent) 26%, transparent)",
          borderRadius: 14,
          padding: "15px 22px 18px"
        }}>
              <span style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.75,
            marginBottom: 3
          }}>{sub.highlightLabel || "Main Problem"}</span>
              {sub.title}
            </h3> :
        <h3 style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "33px",
          letterSpacing: "-0.03em",
          maxWidth: 760,
          whiteSpace: "pre-line"
        }}>{sub.title}</h3>
        }
          <div style={{ maxWidth: 680, marginTop: 12 }}>
            <Paras body={sub.body} />
            {sub.bullets && <KeyList title={sub.bulletsTitle} items={sub.bullets} />}
          </div>
          {sub.quotes && <QuoteWall quotes={sub.quotes} maxWidth={680} />}
          {(sub.figures || []).map((f, i) =>
        <CaseFigure key={i} src={f.src} videoSrc={f.videoSrc} caption={f.caption} label={f.label} aspect={f.aspect} crop={f.crop} bleed={f.bleed} frame={f.frame} phoneFrame={f.phoneFrame} flat={f.flat} spaceAbove={f.spaceAbove} shadow={f.shadow} maxWidth={f.maxWidth} videoStart={f.videoStart} />
        )}
          {/* Plain-headed beats grouped under one numbered subsection. */}
          {(sub.beats || []).map((b, bi) =>
        <div key={bi} style={{ marginTop: b.spaceAbove != null ? b.spaceAbove : bi === 0 ? 34 : 56 }}>
              <h4 style={{
            margin: 0,
            maxWidth: 760,
            fontWeight: 700,
            fontSize: 19,
            lineHeight: "27px",
            letterSpacing: "-0.028em"
          }}>
                {b.kicker &&
            <span style={{ display: "block", color: "var(--accent)" }}>{b.kicker}</span>
            }
                {b.title}
              </h4>
              <div style={{ maxWidth: 680, marginTop: 10 }}>
                <Paras body={b.body} />
                {b.bullets && <KeyList title={b.bulletsTitle} items={b.bullets} />}
              </div>
              {(b.figures || []).map((f, i) =>
          <CaseFigure key={i} src={f.src} videoSrc={f.videoSrc} caption={f.caption} label={f.label} aspect={f.aspect} crop={f.crop} bleed={f.bleed} frame={f.frame} phoneFrame={f.phoneFrame} flat={f.flat} spaceAbove={f.spaceAbove} shadow={f.shadow} maxWidth={f.maxWidth} videoStart={f.videoStart} />
          )}
            </div>
        )}
          {/* Optional second beat inside the same subsection (e.g. research
              survey first, then the interview write-up under the same header). */}
          {(sub.afterTitle || sub.afterBody || sub.lists) &&
        <div style={{ maxWidth: 680, marginTop: 30 }}>
              {sub.afterTitle &&
          <h4 style={{
            margin: "0 0 9px",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "25px",
            letterSpacing: "-0.025em"
          }}>{sub.afterTitle}</h4>
          }
              <Paras body={sub.afterBody} />
              {(sub.lists || []).length > 0 &&
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {sub.lists.map((l, li) =>
            <KeyList key={li} title={l.title} items={l.items} />
            )}
                </div>
          }
            </div>
        }
        </div>);

      })}
    </section>);

}

// Projects requiring a password before their case study is shown.
const PROTECTED_PROJECTS = { epic: "pixels" };

// Intermediary password screen shown before a protected case study.
function PasswordGate({ project, onUnlock, onNavigate }) {
  const [value, setValue] = useStateP("");
  const [error, setError] = useStateP(false);
  const [reveal, setReveal] = useStateP(false);
  const expected = PROTECTED_PROJECTS[project.id];

  const submit = (e) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === expected) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <window.SiteNav onNavigate={onNavigate} current="work" activeProjectId={project.id} contentMaxWidth={1180} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          {/* Lock mark */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px",
            display: "grid", placeItems: "center",
            background: "color-mix(in oklch, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="var(--accent)" strokeWidth="1.7" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Protected project
          </div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 30, letterSpacing: "-0.03em" }}>
            {project.title}
          </h1>
          <p style={{ margin: "14px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
            This case study is password protected.
          </p>

          <form onSubmit={submit} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <input
                className="field-input"
                type={reveal ? "text" : "password"}
                autoFocus
                placeholder="Password"
                value={value}
                onChange={(e) => {setValue(e.target.value);setError(false);}}
                style={{ textAlign: "center", paddingLeft: 44, paddingRight: 44 }} />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? "Hide password" : "Show password"}
                title={reveal ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  width: 32, height: 32, display: "grid", placeItems: "center",
                  border: "none", background: "transparent", cursor: "pointer",
                  color: reveal ? "var(--accent)" : "rgba(0,0,0,0.42)",
                  transition: "color .2s ease", padding: 0
                }}>
                {reveal ?
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M3.5 16.5 16.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg> :

                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                }
              </button>
            </div>
            {error &&
            <div style={{ fontSize: 13, letterSpacing: "-0.01em", color: "#C0392B" }}>
                That password isn't right — try again.
              </div>
            }
            <button className="pill-btn" type="submit" style={{ justifyContent: "center", marginTop: 4 }}>
              Unlock <span className="arr">→</span>
            </button>
          </form>

          <p style={{ margin: "28px 0 0", fontSize: 13, lineHeight: "20px", letterSpacing: "-0.01em", color: "rgba(0,0,0,0.55)" }}>
            Need the password? Email me at{" "}
            <a className="footer-link" href={"mailto:serena.ng.contact@gmail.com?subject=" + encodeURIComponent("Password for " + project.title + " case study")}>
              serena.ng.contact@gmail.com
            </a>
          </p>

          <div style={{ marginTop: 44 }}>
            <button className="pill-btn ghost" onClick={() => onNavigate("home")}>
              <span style={{ display: "inline-block" }}>←</span> Back to Home
            </button>
          </div>
        </div>
      </div>
      <window.SiteFooter contentMaxWidth={1180} />
    </div>);

}

// Placeholder page for a case study that isn't written yet. Points visitors to
// the shorter overview in the Design Archive.
function UnderConstruction({ data, projectId, onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <window.SiteNav onNavigate={onNavigate} current="work" activeProjectId={projectId} contentMaxWidth={1180} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px",
            display: "grid", placeItems: "center",
            background: "color-mix(in oklch, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
            fontSize: 24
          }}>
            🚧
          </div>

          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Under construction
          </div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 30, letterSpacing: "-0.03em" }}>
            {data.title}
          </h1>
          <p style={{ margin: "16px auto 0", maxWidth: 420, fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.01em", color: "rgba(0,0,0,0.7)", textWrap: "pretty" }}>
            This case study is currently under construction. A less detailed project overview is available in my design archive.
          </p>

          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
            <button className="pill-btn" onClick={() => onNavigate("design/" + data.archiveSlug)}>
              View in Design Archive <span className="arr">→</span>
            </button>
            <button className="pill-btn ghost" onClick={() => onNavigate("home")}>
              <span style={{ display: "inline-block" }}>←</span> Back to Home
            </button>
          </div>
        </div>
      </div>
      <window.SiteFooter contentMaxWidth={1180} />
    </div>);

}

function ProjectPage({ projectId, onBack, onOpen, onNavigate, isMobile }) {
  // Password gate for protected projects — unlock persists for the session.
  const isProtected = projectId in PROTECTED_PROJECTS;
  const [unlocked, setUnlocked] = useStateP(() =>
  typeof sessionStorage !== "undefined" && sessionStorage.getItem("unlocked:" + projectId) === "1");
  // Re-check unlock state whenever the project changes.
  useEffectP(() => {
    setUnlocked(typeof sessionStorage !== "undefined" && sessionStorage.getItem("unlocked:" + projectId) === "1");
  }, [projectId]);

  const gateProject = window.PROJECTS.find((p) => p.id === projectId) || window.PROJECTS[0];
  if (isProtected && !unlocked) {
    return (
      <PasswordGate
        project={gateProject}
        onNavigate={onNavigate}
        onUnlock={() => {
          try {sessionStorage.setItem("unlocked:" + projectId, "1");} catch (e) {}
          setUnlocked(true);
        }} />);

  }
  const pageData = window.PROJECT_PAGE[projectId];
  if (pageData && pageData.underConstruction) {
    return <UnderConstruction data={pageData} projectId={projectId} onNavigate={onNavigate} />;
  }
  return <ProjectCaseStudy projectId={projectId} onBack={onBack} onOpen={onOpen} onNavigate={onNavigate} isMobile={isMobile} />;
}

function ProjectCaseStudy({ projectId, onBack, onOpen, onNavigate, isMobile }) {
  const data = window.PROJECT_PAGE[projectId] || window.PROJECT_PAGE.searchneu;
  const project = window.PROJECTS.find((p) => p.id === projectId) || window.PROJECTS[0];
  const [activeId, setActiveId] = useStateP(data.sections[0].id);
  const [zoomed, setZoomed] = useStateP(null);
  const refs = useRefP({});
  const registerRef = (id, el) => {if (el) refs.current[id] = el;};

  // Scroll spy
  useEffectP(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = data.sections[0].id;
      for (const s of data.sections) {
        const el = refs.current[s.id];
        if (el && el.offsetTop <= y) current = s.id;
        (s.subsections || []).forEach((_, i) => {
          const sub = refs.current[`${s.id}-${i}`];
          if (sub && sub.offsetTop <= y) current = `${s.id}-${i}`;
        });
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [projectId]);

  // Smooth scroll that works in this embedding (behavior:"smooth" is a no-op here).
  // Eases scrollTop via a short interval loop, writing to whichever scroller is live.
  const smoothScrollTo = (targetY) => {
    const scroller = document.scrollingElement || document.documentElement;
    const getY = () => window.scrollY || scroller && scroller.scrollTop || 0;
    const setY = (v) => {window.scrollTo(0, v);if (scroller) scroller.scrollTop = v;};
    const start = getY();
    const dist = targetY - start;
    if (Math.abs(dist) < 2) {setY(targetY);return;}
    const dur = Math.min(1500, Math.max(700, Math.abs(dist) * 0.55));
    const clock = () => window.performance && performance.now ? performance.now() : Date.now();
    const t0 = clock();
    // Ease in-out — gentle acceleration and a soft landing.
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const iv = setInterval(() => {
      const t = Math.min(1, (clock() - t0) / dur);
      setY(start + dist * ease(t));
      if (t >= 1) clearInterval(iv);
    }, 16);
  };

  const jump = (id) => {
    const el = refs.current[id];
    if (!el) return;
    setActiveId(id); // reflect selection immediately (programmatic scroll fires no scroll event)
    const scroller = document.scrollingElement || document.documentElement;
    const curY = window.scrollY || scroller && scroller.scrollTop || 0;
    smoothScrollTo(el.getBoundingClientRect().top + curY - 64);
  };
  const toTop = () => smoothScrollTo(0);

  // Next project
  const idx = window.PROJECTS.findIndex((p) => p.id === projectId);
  const next = window.PROJECTS[(idx + 1) % window.PROJECTS.length];

  return (
    <ZoomCtx.Provider value={setZoomed}>
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Consistent shared site nav (with hover dropdowns) */}
      <window.SiteNav onNavigate={onNavigate} current="work" activeProjectId={projectId} contentMaxWidth={1180} autoHide={!isMobile} />

      {isMobile && <MobileTimeline sections={data.sections} activeId={activeId} onJump={jump} />}

      <div style={{
        display: "flex",
        gap: isMobile ? 0 : 68,
        maxWidth: 1180,
        margin: "0 auto",
        padding: isMobile ? "16px 20px 60px" : "84px 40px 80px"
      }}>
        {!isMobile && <CompactSidebar sections={data.sections} activeId={activeId} onJump={jump} onTop={toTop} onHome={() => onNavigate("home")} />}

        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile has no sidebar, so the way back lives above the hero. */}
          {isMobile &&
          <button
            className="pill-btn ghost"
            onClick={() => onNavigate("home")}
            style={{ alignSelf: "flex-start", marginTop: 10, marginBottom: 32 }}>
              <span style={{ display: "inline-block" }}>←</span> Back to Home
            </button>
          }
          {/* Hero */}
          <div style={{ paddingBottom: 32, borderBottom: "1px solid var(--hair-soft)" }}>
            <div style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              marginBottom: 12
            }}>
              CASE STUDY · {data.eyebrowDate || data.meta[2]?.value || ""}
            </div>
            <h1 style={{
              margin: 0,
              fontWeight: 700,
              fontSize: isMobile ? 28 : 38,
              lineHeight: 1.06,
              letterSpacing: "-0.04em"
            }}>
              {data.title}
            </h1>
            <p style={{
              margin: "14px 0 0",
              fontWeight: 300,
              fontSize: isMobile ? 16 : 17,
              lineHeight: "26px",
              letterSpacing: "-0.01em",
              color: "rgba(0,0,0,0.7)",
              maxWidth: 640,
              textWrap: "pretty"
            }}>
              {data.subtitle}
            </p>

            {/* Tags */}
            {data.tags &&
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.tags.map((t) =>
              <span key={t} style={{
                fontSize: 12,
                letterSpacing: "-0.01em",
                color: "var(--accent)",
                background: "color-mix(in oklch, var(--accent) 8%, transparent)",
                border: "1px solid color-mix(in oklch, var(--accent) 26%, transparent)",
                borderRadius: 999,
                padding: "4px 11px"
              }}>{t}</span>
              )}
            </div>
            }

            {/* Meta row */}
            <div style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, auto)",
              gap: isMobile ? 18 : 40,
              justifyContent: "start"
            }}>
              {data.meta.map((m) =>
              <div key={m.label}>
                  <div style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.42)",
                  marginBottom: 5
                }}>{m.label}</div>
                  <div style={{
                  fontSize: 13,
                  letterSpacing: "0.005em",
                  fontWeight: 400,
                  lineHeight: "21px",
                  whiteSpace: "pre-line"
                }}>{typeof m.value === "string" && m.value.includes("(") ?
                  // Parenthesised qualifiers read as secondary — gray them out.
                  m.value.split(/(\([^)]*\))/g).map((part, pi) =>
                  part.startsWith("(") && part.endsWith(")") ?
                  <span key={pi} style={{ color: "rgba(0,0,0,0.5)", fontWeight: 300 }}>{part}</span> :
                  <React.Fragment key={pi}>{part}</React.Fragment>
                  ) :
                  m.value}</div>
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

            {/* Cover — swap cover src per project in PROJECT_PAGE data (coverSrc). */}
            <CaseFigure src={data.coverSrc} videoSrc={data.coverVideoSrc} caption="" priority={true} />
          </div>

          {/* Sections */}
          {data.sections.map((s) =>
          <Section key={s.id} section={s} registerRef={registerRef} projectId={projectId} />
          )}

          {/* Next project */}
          <div style={{
            marginTop: 44,
            paddingTop: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap"
          }}>
            <div className="upnext-row" style={{ display: "flex", alignItems: "center", gap: 18, flex: "1 1 0", minWidth: 0 }}>
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
                  background: next.img || next.video ?
                  "var(--gray-50)" :
                  `linear-gradient(140deg, ${next.color}, color-mix(in oklab, ${next.color} 60%, white))`,
                  display: "block"
                }}>
                {next.video ?
                <video src={next.video} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> :
                next.img ?
                <img src={next.img} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> :
                null
                }
              </div>
              <div className="upnext-copy" style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)", marginBottom: 6 }}>
                  Up next
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
                  {next.title}
                </div>
                <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.62)", marginTop: 3 }}>
                  {next.blurb}
                </div>
                {/* Shown only on mobile — stacks under the copy. */}
                <button className="pill-btn upnext-btn-inline" onClick={() => onOpen(next.id)}>
                  View case <span className="arr">→</span>
                </button>
              </div>
            </div>
            <button className="pill-btn upnext-btn-side" onClick={() => onOpen(next.id)}>
              View case <span className="arr">→</span>
            </button>
          </div>
        </main>
      </div>
      <window.SiteFooter contentMaxWidth={1180} />
      {zoomed && window.Lightbox && <window.Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>
    </ZoomCtx.Provider>);

}

window.ProjectPage = ProjectPage;
// Shared so the Home page can frame its video thumbnails the same way.
window.BrowserFrame = BrowserFrame;
