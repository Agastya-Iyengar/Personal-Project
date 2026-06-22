// professional.jsx — the professional side, one continuous scroll.
// Sparse by design: scaffolding for Agastya to fill in over time.
// Exports (to window): ProfessionalContent.

function ProOverview() {
  const stats = [
    ["Class of", "2028"],
    ["Based in", "Aurora, Illinois"],
    ["Currently", "Learning to Drive · AMC Prep"],
  ];
  const skills = [
    { area: "Quantitative Reasoning", from: "Math Team", detail: "Competition mathematics, proofs, and structured problem-solving." },
    { area: "Public Speaking & Debate", from: "Model UN · Youth and Government", detail: "Committee debate, extemporaneous argument, and policy writing." },
    { area: "Discipline & Craft", from: "Cello", detail: "Years of deliberate practice, ensemble work, and performance." },
  ];
  return (
    <section className="px-7 py-32 md:px-20 md:py-44" data-screen-label="Overview & Skills">
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow" data-reveal data-reveal-y="22">The professional record</p>
        <BlurText as="h2" text="Overview & Skills" className="display mt-5 max-w-[16ch]" />
        <p className="lede mt-9 max-w-[46ch]" data-reveal data-reveal-y="28">
          A rising junior at Metea Valley with interests across mathematics,
          debate, and policy, now looking to build the Agent in Project&nbsp;1.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] sm:grid-cols-3" data-reveal data-reveal-y="34"
             style={{ background: "var(--line)" }}>
          {stats.map(([label, value]) => (
            <div key={label} className="px-7 py-9" style={{ background: "var(--bg-grad)" }}>
              <p className="eyebrow text-[11px]">{label}</p>
              <p className="font-display text-[clamp(26px,3vw,38px)] font-medium leading-tight text-[color:var(--ink-deep)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <p className="eyebrow" data-reveal data-reveal-y="20">Capabilities</p>
          <div className="mt-8">
            {skills.map((s) => (
              <div key={s.area} data-reveal data-reveal-y="32">
                <div className="lift grid grid-cols-1 gap-3 rounded-[28px] px-3 py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)] md:gap-10 md:px-7">
                  <div>
                    <h3 className="font-display text-[clamp(26px,3vw,38px)] font-medium leading-none text-[color:var(--ink-deep)]">{s.area}</h3>
                    <p className="eyebrow mt-3 text-[11px]">{s.from}</p>
                  </div>
                  <p className="body-lg text-[color:var(--stone)]">{s.detail}</p>
                </div>
                <hr className="rule" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ eyebrow, title, href, cta, children }) {
  return (
    <div data-reveal data-reveal-y="34">
      <div className="lift grid grid-cols-1 gap-6 rounded-[34px] px-9 py-10 md:grid-cols-[minmax(0,1fr)_auto]"
           style={{ boxShadow: "var(--shadow-soft)" }}>
        <div>
          <p className="eyebrow text-[11px]">{eyebrow}</p>
          <h3 className="font-display text-[clamp(26px,3vw,38px)] font-medium leading-tight text-[color:var(--ink-deep)] mt-3">
            {title}
          </h3>
          <p className="body-lg mt-4 max-w-[56ch] text-[color:var(--stone)]">{children}</p>
        </div>
        <div className="flex items-end">
          <a href={href} target="_blank" rel="noopener"
             className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-[#fbf8f1] transition-transform hover:-translate-y-0.5"
             style={{ background: "var(--ink-deep)", whiteSpace: "nowrap" }}>
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

function ProfessionalContent() {
  return (
    <React.Fragment>
      <Hero
        eyebrow="Metea Valley · Class of 2028"
        name="Agastya Iyengar"
        sub="Math, policy, and code: arm in arm, they produce a charm."
      />
      <ProOverview />
      <section className="px-7 pb-32 md:px-20 md:pb-44" data-screen-label="Projects">
        <div className="mx-auto w-full max-w-6xl">
          <p className="eyebrow" data-reveal data-reveal-y="20">Selected work</p>
          <BlurText as="h2" text="Projects" className="display mt-5" />
          <div className="mt-10 flex flex-col gap-6">
            <ProjectCard
              eyebrow="Policy · TurnUP"
              title="California Proposition 1: Reproductive Rights Analysis"
              href="./TurnUP Reproductive rights copy.pdf"
              cta="Read Paper">
              A deep-dive into the 2022 Constitutional Right to Reproductive Freedom amendment:
              its history, legislative path, voting results, and national aftermath.
            </ProjectCard>
            <ProjectCard
              eyebrow="Engineering · Team Solaris"
              title="Improving Solar Panel Efficiency"
              href="./SolarProject.pptx"
              cta="View Slides">
              A team engineering project tackling a core limitation of fixed solar panels:
              they face one direction while the sun travels east to west. Researched with
              input from the Naperville board of electricity.
            </ProjectCard>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { ProfessionalContent });
