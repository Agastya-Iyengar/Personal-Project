// globe.jsx — interactive cobe globe that starts on the world and "flies
// into" Chicago/Aurora as you scroll through the hero. Purely decorative:
// the canvas sits fixed behind the hero text, fades out by the time the
// first viewport is scrolled, and fails silently if cobe can't load.
//
// Exports (to window): GlobeIntro.

function GlobeIntro() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const progRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas) return;

    let globe = null;
    let destroyed = false;
    let rotation = 0;
    let resizeTimer = 0;
    let readyInterval = 0;

    // Aurora / Chicago area.
    const CHI = [41.85, -87.75];
    function locationToAngles(lat, long) {
      return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
    }
    const focus = locationToAngles(CHI[0], CHI[1]);
    const startPhi = focus[0] + 2 * Math.PI;
    const startTheta = 0.18;

    function sizePx() {
      // Smaller footprint with generous margin so the sphere never clips at
      // the viewport edge in fullscreen, even at the largest push-in.
      return Math.min(window.innerWidth, window.innerHeight) * 0.72;
    }

    function build() {
      if (typeof window.__createGlobe !== "function") return;
      const s = sizePx();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = s + "px";
      canvas.style.height = s + "px";
      globe = window.__createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: s * dpr,
        height: s * dpr,
        phi: startPhi,
        theta: startTheta,
        dark: 0,
        diffuse: 1.15,
        mapSamples: 16000,
        mapBrightness: 1.3,
        baseColor: [0.86, 0.78, 0.62],
        markerColor: [0.74, 0.3, 0.12],
        glowColor: [0.92, 0.85, 0.71],
        markers: [{ location: CHI, size: 0.1 }],
        onRender: (state) => {
          const p = progRef.current;
          // Journey completes (locks onto Chicago) at 70% of the hero scroll,
          // then holds — it never zooms all the way in.
          const jp = Math.min(1, p / 0.7);
          // Gentle idle spin only while at the very top.
          if (p < 0.04) rotation += 0.0035;
          const base = startPhi + rotation;
          state.phi = base + (focus[0] - base) * jp;
          state.theta = startTheta + (focus[1] - startTheta) * jp;
          state.width = s * dpr;
          state.height = s * dpr;
        },
      });
    }

    (function whenReady() {
      if (typeof window.__createGlobe === "function") {
        if (!destroyed) build();
        return;
      }
      let tries = 0;
      const iv = setInterval(() => {
        if (typeof window.__createGlobe === "function") {
          clearInterval(iv);
          if (!destroyed) build();
        } else if (++tries > 120) {
          clearInterval(iv); // ~12s — give up silently
        }
      }, 100);
      window.addEventListener(
        "cobe-ready",
        () => { clearInterval(iv); if (!destroyed) build(); },
        { once: true }
      );
      readyInterval = iv;
    })();

    function onScroll() {
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, window.scrollY / (vh * 0.9)));
      progRef.current = p;
      if (!wrap) return;
      // Modest push-in only (caps ~1.5x): settles on Chicago, no full zoom.
      const scale = 1 + Math.min(p / 0.7, 1) * 0.5;
      // Fade out earlier so there's a clear buffer before the lake photo.
      const fade = p < 0.45 ? 1 : Math.max(0, 1 - (p - 0.45) / 0.28);
      wrap.style.transform = "scale(" + scale.toFixed(3) + ")";
      wrap.style.opacity = String(fade);
      wrap.style.visibility = fade <= 0.01 ? "hidden" : "visible";
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (globe) { try { globe.destroy(); } catch (e) {} globe = null; }
        build();
        onScroll();
      }, 200);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearInterval(readyInterval);
      if (globe) { try { globe.destroy(); } catch (e) {} }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "58vmin", height: "58vmin", maxWidth: "720px", maxHeight: "720px", aspectRatio: "1" }}
      ></canvas>
    </div>
  );
}

Object.assign(window, { GlobeIntro });
