// Top-level App + router (hash-based) + tweaks panel

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

// Page wrapper that plays a soft fade-in entrance — but fails VISIBLE.
// The base opacity is always 1; the fade is applied via the `.is-entering`
// class, which a failsafe strips shortly after mount (and on tab focus) so a
// throttled/frozen animation clock can never leave the page blank.
function PageEnter({ routeKey, children }) {
  const ref = useRefA(null);
  useEffectA(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-entering");
    const clear = () => el && el.classList.remove("is-entering");
    const onEnd = () => clear();
    el.addEventListener("animationend", onEnd);
    // Failsafe: remove the entrance class after it should have finished, even
    // if the animation never actually ran (throttled clock). Also re-check
    // when the tab becomes visible again.
    const t = setTimeout(clear, 900);
    const onVis = () => { if (document.visibilityState === "visible") clear(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(t);
      el.removeEventListener("animationend", onEnd);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [routeKey]);
  return <div key={routeKey} ref={ref} className="page-enter">{children}</div>;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#575EDB",
  "idleDelayMs": 3500,
  "showEmojis": true
}/*EDITMODE-END*/;

function useIsMobile() {
  const [m, setM] = useStateA(() => typeof window !== "undefined" && window.innerWidth < 860);
  useEffectA(() => {
    const onR = () => setM(window.innerWidth < 860);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return m;
}

function App() {
  const [route, setRoute] = useStateA(() => {
    const h = window.location.hash.replace(/^#\/?/, "") || "home";
    return h;
  });
  const isMobile = useIsMobile();

  // Tweaks
  const tweaks = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];
  const [tweakValues, setTweak] = tweaks;

  useEffectA(() => {
    document.documentElement.style.setProperty("--accent", tweakValues.accentColor);
    document.documentElement.style.setProperty("--accent-shadow",
      tweakValues.accentColor + "47" /* ~28% alpha */);
  }, [tweakValues.accentColor]);

  useEffectA(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#\/?/, "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffectA(() => { window.scrollTo(0, 0); }, [route]);

  const navigate = (to) => {
    window.location.hash = "#/" + (to === "home" ? "" : to);
  };

  const open = (id) => navigate("project/" + id);

  let view;
  if (route.startsWith("project/")) {
    const id = route.split("/")[1];
    view = <window.ProjectPage projectId={id} onBack={() => navigate("home")} onOpen={open} onNavigate={navigate} isMobile={isMobile} />;
  } else if (route.startsWith("archive/")) {
    const slug = route.split("/")[1];
    view = <window.Archive slug={slug} onNavigate={navigate} />;
  } else if (route.startsWith("design/")) {
    const slug = route.split("/")[1];
    view = <window.DesignProject slug={slug} onNavigate={navigate} />;
  } else if (route === "about") {
    view = <window.About onNavigate={navigate} />;
  } else if (route === "playground") {
    view = <window.Playground onNavigate={navigate} />;
  } else {
    view = <window.Home onOpen={open} onNavigate={navigate} isMobile={isMobile} />;
  }

  // Tweaks panel
  const TweaksPanel = window.TweaksPanel;
  const TweakSection = window.TweakSection;
  const TweakColor = window.TweakColor;
  const TweakSlider = window.TweakSlider;
  const TweakToggle = window.TweakToggle;

  return (
    <>
      <PageEnter routeKey={route}>{view}</PageEnter>
      {TweaksPanel && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Accent">
            <TweakColor label="Accent color" value={tweakValues.accentColor} onChange={v => setTweak("accentColor", v)} />
          </TweakSection>
          <TweakSection title="Idle behavior">
            <TweakSlider label="Idle delay (ms)" min={500} max={8000} step={250}
              value={tweakValues.idleDelayMs} onChange={v => setTweak("idleDelayMs", v)} />
            <TweakToggle label="Show emoji cloud" value={tweakValues.showEmojis} onChange={v => setTweak("showEmojis", v)} />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

// Allow Home to read tweak values for idle delay / show emojis
window.__getTweakValue = (key) => {
  // This is a small bridge so Home doesn't need to be passed values.
  return TWEAK_DEFAULTS[key];
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
