// backup.js — vanilla JavaScript backup renderer (no React, no Tailwind, no
// external dependencies). Mirrors the live site's content in a simple,
// always-readable single-scroll document.

(function () {
  var SITE = {
    name: "Agastya Iyengar",
    eyebrow: "Metea Valley \u00b7 Class of 2028",
    sub: "A record \u2014 personal and professional.",
    blocks: [
      { type: "kicker", text: "A few words" },
      { type: "h2", text: "About" },
      { type: "lede", text: "Hey! My name is Agastya Iyengar, and I'm a rising junior at Metea Valley High School. I'm really looking forward to meeting you and working on training the predictive algorithm for Project\u00a01." },
      { type: "p", muted: true, text: "Away from the desk, I spend quieter evenings refining my technique on the cello \u2014 slow, deliberate work that balances out the pace of everything else." },

      { type: "section" },
      { type: "kicker", text: "How the hours are spent" },
      { type: "h2", text: "Pursuits" },
      { type: "h3", text: "Math Team" },
      { type: "p", muted: true, text: "Competition mathematics, proofs, and the occasional very late practice set." },
      { type: "h3", text: "Model UN" },
      { type: "p", muted: true, text: "Committee debate, position papers, and thinking on my feet." },
      { type: "h3", text: "Youth and Government" },
      { type: "p", muted: true, text: "A mock legislature \u2014 writing bills and arguing for them." },
      { type: "h3", text: "Cello" },
      { type: "p", muted: true, text: "Refining technique one \u00e9tude at a time. Some days it sings; some days it argues back." },

      { type: "section" },
      { type: "kicker", text: "The professional record" },
      { type: "h2", text: "Overview & Skills" },
      { type: "lede", text: "A rising junior at Metea Valley with interests across mathematics, debate, and policy \u2014 currently training the predictive algorithm for Project\u00a01." },
      { type: "h3", text: "Quantitative Reasoning" },
      { type: "p", muted: true, text: "Competition mathematics, proofs, and structured problem-solving. (Math Team)" },
      { type: "h3", text: "Public Speaking & Debate" },
      { type: "p", muted: true, text: "Committee debate, extemporaneous argument, and policy writing. (Model UN, Youth and Government)" },
      { type: "h3", text: "Discipline & Craft" },
      { type: "p", muted: true, text: "Years of deliberate practice, ensemble work, and performance. (Cello)" },

      { type: "section" },
      { type: "kicker", text: "History" },
      { type: "h2", text: "Work Experience" },
      { type: "placeholder", text: "Reserved for what comes next \u2014 internships, research, and roles will be recorded here as they happen." },

      { type: "section" },
      { type: "kicker", text: "Selected work" },
      { type: "h2", text: "Projects" },
      { type: "placeholder", text: "Projects will be collected here, beginning with the Project\u00a01 predictive algorithm once there's something to show." },

      { type: "section" },
      { type: "kicker", text: "Say hello" },
      { type: "h2", text: "Contact" },
      { type: "contact", links: [
        { label: "Instagram", href: "https://www.instagram.com/" },
        { label: "TikTok", href: "https://www.tiktok.com/" }
      ] }
    ]
  };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function render() {
    var root = document.getElementById("backup-root");
    if (!root) return;

    root.appendChild(el("p", { "class": "eyebrow", text: SITE.eyebrow }));
    root.appendChild(el("h1", { text: SITE.name }));
    root.appendChild(el("p", { "class": "sub", text: SITE.sub }));

    SITE.blocks.forEach(function (b) {
      if (b.type === "section") {
        var wrap = el("div", { "class": "section" });
        root.appendChild(wrap);
      } else if (b.type === "kicker") {
        root.appendChild(el("p", { "class": "eyebrow", text: b.text }));
      } else if (b.type === "h2") {
        root.appendChild(el("h2", { text: b.text }));
      } else if (b.type === "h3") {
        root.appendChild(el("h3", { text: b.text }));
      } else if (b.type === "lede") {
        root.appendChild(el("p", { "class": "lede", text: b.text }));
      } else if (b.type === "placeholder") {
        root.appendChild(el("div", { "class": "placeholder", text: b.text }));
      } else if (b.type === "contact") {
        var p = el("p", { "class": "contact" });
        b.links.forEach(function (l, i) {
          if (i > 0) p.appendChild(document.createTextNode("  \u00b7  "));
          p.appendChild(el("a", { href: l.href, target: "_blank", rel: "noopener", text: l.label }));
        });
        root.appendChild(p);
      } else {
        root.appendChild(el("p", { "class": b.muted ? "muted" : "", text: b.text }));
      }
    });

    var footer = el("footer");
    var fp = el("p", { text: "Agastya Iyengar \u00b7 Metea Valley High School \u00b7 MMXXVI \u2014 " });
    fp.appendChild(el("a", { "class": "backlink", href: "index.html", text: "Open the interactive site" }));
    footer.appendChild(fp);
    root.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
