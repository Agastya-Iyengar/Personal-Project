// personal.jsx — the personal side, one continuous scroll.
// Exports (to window): PersonalContent.

function Hero({ eyebrow, name, sub }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-7 pb-40 pt-32 md:px-20" data-screen-label="Hero">
      <GlobeIntro />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="eyebrow" data-reveal data-reveal-y="20">{eyebrow}</p>
        <h1 className="display-xl mt-6">
          <BlurText as="span" text={name} trigger="mount" stagger={0.045} duration={0.8} className="block" />
        </h1>
        <div className="mt-10 flex items-center gap-6" data-reveal data-reveal-y="22">
          <span className="block h-px w-16 bg-[var(--accent)] opacity-70"></span>
          <p className="caption text-base not-italic tracking-[0.04em]">{sub}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-28 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="eyebrow text-[11px] opacity-70">Scroll</p>
        <span className="mx-auto mt-3 block h-10 w-px bg-[var(--accent)] opacity-50"></span>
      </div>
    </section>
  );
}

function LakeBand() {
  return (
    <section className="px-7 pt-24 md:px-20 md:pt-36" data-screen-label="Lakefront">
      <div className="mx-auto w-full max-w-6xl" data-reveal data-reveal-y="60">
        <image-slot
          id="lake-personal"
          shape="rounded"
          radius="30"
          fit="cover"
          src="./Florence.jpeg"
          placeholder="Drop a lakefront photo — Lake Como, a view you love"
          class="frame"
          style={{ display: "block", width: "100%", height: "62vh", minHeight: "360px", borderRadius: "30px" }}
        ></image-slot>
        <p className="caption mt-4">A view worth waking up to.</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="px-7 py-32 md:px-20 md:py-44" data-screen-label="About">
      <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-[300px_1fr] md:gap-20">
        <div data-reveal data-reveal-y="48">
          <image-slot
            id="headshot"
            shape="rounded"
            radius="28"
            fit="cover"
            src="./Headshot.jpeg"
            placeholder="Your portrait"
            class="frame"
            style={{ display: "block", width: "100%", maxWidth: "300px", height: "auto", aspectRatio: "2 / 3", borderRadius: "28px" }}
          ></image-slot>
        </div>

        <div>
          <p className="eyebrow" data-reveal data-reveal-y="22">A few words</p>
          <BlurText as="h2" text="About" className="display mt-5" />
          <p className="lede mt-9" data-reveal data-reveal-y="30">
            Hey! My name is Agastya Iyengar, and I'm a rising junior at Metea Valley
            High School. I'm really looking forward to meeting you and working on
            training the predictive algorithm for Project&nbsp;1.
          </p>
          <p className="body-lg mt-7 max-w-[56ch] text-[color:var(--stone)]" data-reveal data-reveal-y="28">
            Away from the desk, I spend quieter evenings refining my technique on
            the cello — slow, deliberate work that balances out the pace of
            everything else.
          </p>
        </div>
      </div>
    </section>
  );
}

function Pursuits() {
  const rows = [
    { name: "Math Team", note: "Competition mathematics, proofs, and the occasional very late practice set." },
    { name: "Model UN", note: "Committee debate, position papers, and thinking on my feet." },
    { name: "Youth and Government", note: "A mock legislature — writing bills and arguing for them." },
    { name: "Cello", note: "Refining technique one étude at a time. Some days it sings; some days it argues back." },
  ];
  return (
    <section className="px-7 pb-40 md:px-20 md:pb-56" data-screen-label="Pursuits">
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow" data-reveal data-reveal-y="22">How the hours are spent</p>
        <BlurText as="h2" text="Pursuits, in and out of school" className="display mt-5 max-w-[14ch]" />

        <div className="mt-16">
          {rows.map((r, i) => (
            <div key={r.name} data-reveal data-reveal-y="34">
              <div className="lift group grid grid-cols-1 items-baseline gap-3 rounded-[28px] px-3 py-8 md:grid-cols-[80px_minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:px-7">
                <span className="font-display text-lg text-[color:var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-none text-[color:var(--ink-deep)]">{r.name}</h3>
                <p className="body-lg text-[color:var(--stone)]">{r.note}</p>
              </div>
              <hr className="rule" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonalContent() {
  return (
    <React.Fragment>
      <Hero
        eyebrow="Metea Valley · Class of 2028"
        name="Agastya Iyengar"
        sub="A personal record — music, study, and the long way round."
      />
      <LakeBand />
      <About />
      <Pursuits />
    </React.Fragment>
  );
}

Object.assign(window, { PersonalContent, Hero });
