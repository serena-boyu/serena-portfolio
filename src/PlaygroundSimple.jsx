// Simple Playground layout — the pre-folder version.
// Loaded ONLY by "Portfolio V1.1 Simple Playground.html", after About.jsx, so
// it overrides window.Playground there while the main page keeps the folder
// hover treatment. Reads the shared category data off window.

const { useState: useStatePS } = React;

// Secondary blurbs live here because the shared data now omits them (the
// folder layout shows a label only).
const PS_BLURBS = {
  branding: "Graphic design, branding systems, and UX/UI explorations.",
  photography: "Pics shot mostly on a Canon EOS R50 when I'm exploring new places.",
  misc: "A collection of other things that interest me."
};

function PlaygroundSectionSimple({ slug, category, onNavigate }) {
  const { emoji, title, items, archiveLabel } = category;
  const [hover, setHover] = useStatePS(false);
  const open = () => onNavigate("archive/" + slug);
  const ImageCaption = window.ImageCaption;

  return (
    <section style={{ marginBottom: 84 }}>
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
        style={{
          cursor: "pointer",
          borderRadius: 18,
          padding: 16,
          margin: -16,
          background: hover ? "color-mix(in oklch, var(--accent) 11%, transparent)" : "transparent",
          outline: hover ?
          "1px solid color-mix(in oklch, var(--accent) 55%, transparent)" :
          "1px solid transparent",
          boxShadow: hover ?
          "0 10px 22px color-mix(in oklch, var(--accent) 20%, transparent), 0 24px 46px color-mix(in oklch, var(--accent) 13%, transparent)" :
          "none",
          transform: hover ? "translateY(-4px) scale(1.012)" : "translateY(0) scale(1)",
          transition: "background .28s ease, outline-color .28s ease, box-shadow .32s ease, transform .32s cubic-bezier(.22,.61,.36,1)"
        }}>
        <div className="pg-section-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 16 }}>
          <div style={{ maxWidth: 540 }}>
            <div style={{
              fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4,
              color: hover ? "var(--accent)" : "var(--ink)",
              transition: "color .25s ease"
            }}>
              {title} <span>{emoji}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 300, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              {PS_BLURBS[slug] || ""}
            </div>
          </div>
          <button
            className={"pill-btn" + (hover ? " is-hot" : "")}
            style={{ flexShrink: 0 }}
            onClick={(e) => {e.stopPropagation();open();}}>
            {archiveLabel} <span className="arr">→</span>
          </button>
        </div>
        <div className="pg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {items.slice(0, 6).map((it, i) =>
          <ImageCaption key={i} src={it.src} videoSrc={it.videoSrc} title={it.imgTitle} caption={it.imgCaption} label={it.label} gradient={it.gradient} aspect="16 / 10" noHoverCaption={true} />
          )}
        </div>
      </div>
    </section>);

}

function PlaygroundSimple({ onNavigate }) {
  const heroEmojis = [
  { char: "🐉", left: "4%", top: "8%", size: 38, rot: -10 },
  { char: "🍵", left: "44%", top: "0%", size: 46, rot: 8 },
  { char: "🎧", left: "78%", top: "12%", size: 34, rot: -6 },
  { char: "🧋", left: "22%", top: "52%", size: 42, rot: 6 },
  { char: "📷", left: "60%", top: "56%", size: 40, rot: -8 },
  { char: "🧩", left: "88%", top: "62%", size: 32, rot: 12 }];

  const order = ["branding", "photography", "misc"];
  const CATS = window.PLAYGROUND_CATEGORIES;
  const SubpageNav = window.SiteNav;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" />
      <div className="pg-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 40px 100px" }}>
        <div className="pg-hero" style={{ marginBottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.04em" }}>
              Welcome to<br />my Archive! <span>📁</span>
            </h1>
            <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              A space to showcase the other things outside my case studies...
            </p>
          </div>
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
        <PlaygroundSectionSimple key={slug} slug={slug} category={CATS[slug]} onNavigate={onNavigate} />
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

// Override the folder-layout Playground for this page only.
window.Playground = PlaygroundSimple;
