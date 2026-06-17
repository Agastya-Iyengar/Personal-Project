// blur-text.jsx — "blur in up, by character" entrance, à la Magic UI's
// <TextAnimate animation="blurInUp" by="character" />.
//
// Each character animates from { blurred, lowered, transparent } to its
// resting state, staggered left-to-right.
//
// Robustness: characters are VISIBLE by default (base CSS opacity 1). The
// animation only adds the hidden start frame while the "bt-play" class is on,
// and a finalize timer force-clears everything to visible after the run — so a
// throttled/frozen animation engine can never leave text hidden. Honors
// prefers-reduced-motion by skipping the motion entirely.
//
// Exports (to window): BlurText.

function BlurText(props) {
  const text = props.text || "";
  const Tag = props.as || "span";
  const trigger = props.trigger || "inview"; // "mount" | "inview"
  const stagger = props.stagger == null ? 0.04 : props.stagger;
  const duration = props.duration == null ? 0.7 : props.duration;
  const className = props.className || "";

  const ref = React.useRef(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [play, setPlay] = React.useState(trigger === "mount" && !reduce);
  const [done, setDone] = React.useState(reduce);

  // Replay every time the text enters the viewport; reset when it leaves so
  // the cascade plays again on the next scroll-by (not just once).
  React.useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDone(false);
            setPlay(true);
          } else {
            setDone(false);
            setPlay(false);
          }
        });
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Finalize to fully-visible once the cascade should have completed.
  const charCount = React.useMemo(() => text.replace(/\s/g, "").length, [text]);
  React.useEffect(() => {
    if (!play || reduce) return;
    const total = (charCount * stagger + duration) * 1000 + 350;
    const t = setTimeout(() => setDone(true), total);
    return () => clearTimeout(t);
  }, [play, reduce, charCount, stagger, duration]);

  const words = text.split(" ");
  let idx = 0;
  const cls =
    className +
    (play && !done ? " bt-play" : "") +
    (done ? " bt-done" : "");

  return (
    <Tag
      ref={ref}
      className={cls}
      aria-label={text}
      style={{ "--bt-dur": duration + "s" }}
    >
      {words.map((word, wi) => {
        const chars = Array.from(word).map((ch, ci) => {
          const delay = (idx++ * stagger).toFixed(3) + "s";
          return (
            <span key={ci} className="blur-char" aria-hidden="true" style={{ animationDelay: delay }}>
              {ch}
            </span>
          );
        });
        return (
          <React.Fragment key={wi}>
            <span className="blur-word">{chars}</span>
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}

Object.assign(window, { BlurText });
