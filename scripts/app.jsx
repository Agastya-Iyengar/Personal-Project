// app.jsx — root: top toggle, content swap, scroll reveals, tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0d5238",
  "mood": "hermes",
  "textHead": "#0d0d0d",
  "textBody": "#1a1a1a",
  "textMuted": "#4a3530"
}/*EDITMODE-END*/;

const MOODS = {
  hermes:  "linear-gradient(180deg, #e87848 0%, #de7040 25%, #d46838 50%, #cc6030 75%, #c45a28 100%)",
  cognac:  "linear-gradient(180deg, #d46c34 0%, #c46028 48%, #b05220 100%)",
  ember:   "linear-gradient(180deg, #c05c28 0%, #a84e22 50%, #92401a 100%)",
};

function TopBar({ mode, setMode }) {
  const options = [
    { id: "professional", label: "Professional" },
    { id: "personal", label: "Personal" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-7 py-5 md:px-10">
        <span className="font-display text-2xl font-semibold tracking-[0.04em] text-[color:var(--ink-deep)]">AI</span>

        <div className="rounded-full p-1.5"
             style={{
               background: "rgba(248, 240, 226, 0.74)",
               backdropFilter: "blur(14px)",
               border: "1px solid var(--line)",
               boxShadow: "0 16px 40px -26px rgba(46,28,14,0.5)"
             }}>
          <div className="flex">
            {options.map((o) => {
              const active = mode === o.id;
              return (
                <button key={o.id} type="button" onClick={() => setMode(o.id)}
                        className="rounded-full px-5 py-2 font-display text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors md:px-7"
                        style={{
                          background: active ? "var(--ink-deep)" : "transparent",
                          color: active ? "#fbf8f1" : "var(--stone)",
                        }}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <span className="hidden w-7 text-right font-display text-base text-[color:var(--stone)] md:block">'26</span>
      </div>
    </header>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const saved = (function () {
    try { return JSON.parse(localStorage.getItem("agastya-mode") || "null"); }
    catch (e) { return null; }
  })();
  const [mode, setMode] = React.useState(saved === "personal" ? "personal" : "professional");

  // Apply tweaks to CSS variables
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent",    t.accent);
    r.style.setProperty("--bg-grad",   MOODS[t.mood] || MOODS.hermes);
    r.style.setProperty("--bg-floor",  "#c45a28");
    r.style.setProperty("--ink-deep",  t.textHead);
    r.style.setProperty("--ink",       t.textBody);
    r.style.setProperty("--stone",     t.textMuted);
  }, [t.accent, t.mood, t.textHead, t.textBody, t.textMuted]);

  // A faint shadow (heavy lag) and a small accent dot (slight lag) trail the
  // cursor. Two lerp factors give the layered, parallax-like feel.
  React.useEffect(() => {
    const g = document.getElementById("cursor-glow");
    const d = document.getElementById("cursor-dot");
    if (!g && !d) return;
    let raf = 0;
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let dx = gx, dy = gy;
    let tx = gx, ty = gy;
    function tick() {
      raf = 0;
      gx += (tx - gx) * 0.16;
      gy += (ty - gy) * 0.16;
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      if (g) g.style.transform = "translate(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px)";
      if (d) d.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      if (Math.abs(tx - gx) > 0.4 || Math.abs(ty - gy) > 0.4 ||
          Math.abs(tx - dx) > 0.4 || Math.abs(ty - dy) > 0.4) raf = requestAnimationFrame(tick);
    }
    function onMove(e) {
      tx = e.clientX; ty = e.clientY;
      if (g) g.style.opacity = "1";
      if (d) d.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onLeave() {
      if (g) g.style.opacity = "0";
      if (d) d.style.opacity = "0";
    }
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Persist + reset scroll on mode change
  function changeMode(m) {
    if (m === mode) return;
    setMode(m);
    localStorage.setItem("agastya-mode", m);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // Scroll-reveal engine, re-collected whenever the mode (content) changes.
  useScrollReveal(mode);

  // Dismiss the reload splash once mounted.
  React.useEffect(() => {
    const s = document.getElementById("app-splash");
    if (!s) return;
    s.classList.add("hide");
    const t = setTimeout(() => { if (s.parentNode) s.parentNode.removeChild(s); }, 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <GlobeIntro />
      <TopBar mode={mode} setMode={changeMode} />

      <main key={mode}>
        {mode === "personal" ? <PersonalContent /> : <ProfessionalContent />}

        <footer className="px-7 pb-40 pt-10 md:px-20">
          <div className="mx-auto w-full max-w-6xl">
            <hr className="rule-accent" />
            <p className="caption mt-6 not-italic text-[15px]">
              Agastya Iyengar &nbsp;·&nbsp; Metea Valley High School &nbsp;·&nbsp; MMXXVI
            </p>
          </div>
        </footer>
      </main>

      <ContactBar />

      <TweaksPanel>
        <TweakSection label="Atmosphere" />
        <TweakRadio
          label="Light"
          value={t.mood}
          options={["hermes", "cognac", "ember"]}
          onChange={(v) => setTweak("mood", v)}
        />
        <TweakSection label="Text colors" />
        <TweakColor
          label="Headings"
          value={t.textHead}
          options={["#0d0d0d", "#fdf7ec", "#0d2b55", "#3a5a44"]}
          onChange={(v) => setTweak("textHead", v)}
        />
        <TweakColor
          label="Body"
          value={t.textBody}
          options={["#1a1a1a", "#f2e8d4", "#1a3a6e", "#4a6b54"]}
          onChange={(v) => setTweak("textBody", v)}
        />
        <TweakColor
          label="Muted"
          value={t.textMuted}
          options={["#4a3530", "#d4b89a", "#4a6a94", "#6a8c74"]}
          onChange={(v) => setTweak("textMuted", v)}
        />
        <TweakSection label="Accent" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={["#0d5238", "#0a4030", "#137a4f", "#0e6b45"]}
          onChange={(v) => setTweak("accent", v)}
        />
      </TweaksPanel>
    </div>
  );
}

// A thin hairline between major sections, aligned to the content column.
function SectionRule() {
  return (
    <div className="px-7 md:px-20" aria-hidden="true">
      <hr className="mx-auto w-full max-w-6xl rule-section" />
    </div>
  );
}
Object.assign(window, { SectionRule });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
