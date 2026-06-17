// reveal.jsx — scroll-linked reveal engine.
//
// Robustness note: this does NOT rely on CSS transitions or animations to
// reach a final state (some embeds freeze those at time 0). Instead it reads
// each [data-reveal] element's position every scroll frame and writes inline
// opacity + transform DIRECTLY — the rendered value is always the final
// computed value for the current scroll position. Elements default to
// opacity:1 in CSS, so if this never runs, content is simply fully visible.
//
// Exports (to window): useScrollReveal.

function useScrollReveal(dep) {
  React.useEffect(() => {
    let els = [];
    let raf = 0;

    function collect() {
      els = Array.from(document.querySelectorAll("[data-reveal]"));
    }

    function smoothstep(p) {
      p = Math.max(0, Math.min(1, p));
      return p * p * (3 - 2 * p);
    }

    function paint() {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const r = el.getBoundingClientRect();
        // Begin revealing when the element's top crosses 94% of the viewport
        // height; fully revealed once it reaches 60%.
        const start = vh * 0.94;
        const end = vh * 0.60;
        const e = smoothstep((start - r.top) / (start - end));
        const dist = parseFloat(el.getAttribute("data-reveal-y") || "44");
        el.style.opacity = String(e);
        el.style.transform = "translateY(" + ((1 - e) * dist).toFixed(2) + "px)";
      }
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(paint);
    }

    collect();
    paint(); // synchronous initial pass: in-view elements -> visible immediately

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Re-measure after fonts/images settle. setTimeout fires even when rAF is
    // throttled, so the initial state is always correct.
    const t1 = setTimeout(paint, 60);
    const t2 = setTimeout(paint, 320);
    const t3 = setTimeout(paint, 900);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [dep]);
}

Object.assign(window, { useScrollReveal });
