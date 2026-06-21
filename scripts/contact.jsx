// contact.jsx — fixed bottom contact menu (Instagram, TikTok, Message)
// plus a message popup with a validated form.
// Exports (to window): ContactBar.

// --- Minimal line icons (simple geometry, stroked in currentColor) ---
function IgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"></rect>
      <circle cx="12" cy="12" r="4.2"></circle>
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"></circle>
    </svg>
  );
}
function TtIcon() {
  // Simple eighth-note glyph
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M11 5v9.2" strokeLinecap="round"></path>
      <path d="M11 5c0 2.4 1.7 3.9 4.2 4.3" strokeLinecap="round"></path>
      <ellipse cx="8.6" cy="15.4" rx="2.9" ry="2.4" transform="rotate(-18 8.6 15.4)"></ellipse>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5"></rect>
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"></path>
    </svg>
  );
}

function ContactItem({ href, onClick, icon, label }) {
  const cls =
    "group flex items-center gap-2.5 px-4 py-2 text-[color:var(--ink)] transition-colors hover:text-[color:var(--accent)]";
  const inner = (
    <React.Fragment>
      <span className="text-[color:var(--accent)]">{icon}</span>
      <span className="font-display text-lg font-medium tracking-[0.02em]">{label}</span>
    </React.Fragment>
  );
  if (href) {
    return <a href={href} target="_blank" rel="noopener" className={cls}>{inner}</a>;
  }
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

function MessageModal({ onClose }) {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please add your name.";
    if (!form.email.trim()) e.email = "Please add an email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "That email looks off.";
    if (form.message.trim().length < 8) e.message = "A line or two, at least.";
    return e;
  }

  function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    fetch("https://formspree.io/f/mrevlwpr", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
    }).then(function(r) {
      if (r.ok) setSent(true);
      else setErrors({ message: "Something went wrong. Please try again." });
    }).catch(function() {
      setErrors({ message: "Something went wrong. Please try again." });
    });
  }

  const field = "w-full bg-transparent border-0 border-b py-3 font-display text-xl text-[color:var(--ink-deep)] placeholder:text-[color:var(--stone)]/60 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 md:items-center"
         style={{ background: "rgba(27, 32, 28, 0.42)", backdropFilter: "blur(3px)" }}
         onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-[34px] p-8 md:p-12"
           style={{ background: "linear-gradient(180deg,#fbf3e6,#f3e6d2)", boxShadow: "0 60px 120px -40px rgba(40,24,12,0.6)" }}
           onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close"
                className="absolute right-5 top-5 text-[color:var(--stone)] transition-colors hover:text-[color:var(--ink-deep)]">
          <CloseIcon />
        </button>

        {!sent ? (
          <React.Fragment>
            <p className="eyebrow">Say hello</p>
            <h3 className="display mt-3" style={{ fontSize: "clamp(34px,5vw,52px)" }}>Send a message</h3>
            <p className="body-lg mt-3 text-[color:var(--stone)]">
              A note, a question, an introduction — it all reaches me.
            </p>

            <form className="mt-8 flex flex-col gap-7" onSubmit={submit} noValidate>
              <div>
                <input className={field} style={{ borderColor: errors.name ? "#b4543f" : "var(--line)" }}
                       placeholder="Your name" value={form.name}
                       onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="caption mt-2 not-italic" style={{ color: "#b4543f" }}>{errors.name}</p>}
              </div>
              <div>
                <input className={field} style={{ borderColor: errors.email ? "#b4543f" : "var(--line)" }}
                       placeholder="Email" value={form.email} type="email"
                       onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className="caption mt-2 not-italic" style={{ color: "#b4543f" }}>{errors.email}</p>}
              </div>
              <div>
                <textarea className={field + " resize-none"} rows="3"
                          style={{ borderColor: errors.message ? "#b4543f" : "var(--line)" }}
                          placeholder="Your message" value={form.message}
                          onChange={(e) => set("message", e.target.value)}></textarea>
                {errors.message && <p className="caption mt-2 not-italic" style={{ color: "#b4543f" }}>{errors.message}</p>}
              </div>

              <button type="submit"
                      className="mt-1 self-start rounded-full px-9 py-3 font-display text-lg font-semibold uppercase tracking-[0.18em] text-[#fbf8f1] transition-transform hover:-translate-y-0.5"
                      style={{ background: "var(--ink-deep)" }}>
                Send
              </button>
            </form>
          </React.Fragment>
        ) : (
          <div className="py-6 text-center">
            <p className="eyebrow">Received</p>
            <h3 className="display mt-4" style={{ fontSize: "clamp(32px,5vw,48px)" }}>Thank you, {form.name.split(" ")[0]}.</h3>
            <p className="lede mt-5 text-[color:var(--stone)]">
              Your message is noted — I'll be in touch. In the meantime, find me on
              Instagram or TikTok below.
            </p>
            <button type="button" onClick={onClose}
                    className="mt-9 rounded-full px-8 py-3 font-display text-lg font-semibold uppercase tracking-[0.18em] text-[#fbf8f1] transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--ink-deep)" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactBar() {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2" aria-label="Contact">
        <div className="flex items-center divide-x rounded-full px-2 py-1.5"
             style={{
               background: "rgba(248, 240, 226, 0.74)",
               backdropFilter: "blur(14px)",
               boxShadow: "0 20px 50px -24px rgba(46,28,14,0.5)",
               border: "1px solid rgba(60,40,24,0.12)",
               borderColor: "var(--line)"
             }}>
          <span className="hidden pl-5 pr-4 md:block">
            <span className="eyebrow text-[11px]">Contact</span>
          </span>
          <div className="flex items-center" style={{ borderColor: "var(--line)" }}>
            <ContactItem href="https://www.instagram.com/agastya__i/" icon={<IgIcon />} label="Instagram" />
            <ContactItem onClick={() => setOpen(true)} icon={<MailIcon />} label="Message" />
          </div>
        </div>
      </nav>
      {open && <MessageModal onClose={() => setOpen(false)} />}
    </React.Fragment>
  );
}

Object.assign(window, { ContactBar });
