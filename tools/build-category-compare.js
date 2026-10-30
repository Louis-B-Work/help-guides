// Generates the pages for comparing the "Am I Eligible?" category page with today's live /guide/am-i-eligible:
//   control-am-i-eligible/index.html    replica of the live page (it cannot be framed), from tools/live-am-i-eligible.json
//   wireframe-am-i-eligible/index.html  the category wireframe image as a static page with placeholder image boxes
//   compare-am-i-eligible/index.html    side-by-side comparison in device frames (same template as compare/)
// Header, footer and sprite come from index.html. Run from the project root (after build-category.js):  node tools/build-category-compare.js
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const pick = (re, what) => { const m = index.match(re); if (!m) throw new Error("index.html: could not find " + what); return m[0]; };
const header = pick(/<header[\s\S]*?<\/header>/, "header");
const footer = pick(/<footer[\s\S]*?<\/footer>/, "footer").replace("pb-28", "pb-6");
const sprite = pick(/<svg width="0" height="0"[\s\S]*?<\/svg>/, "svg sprite");
const tailwindCfg = pick(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, "tailwind config");
const BASE = "https://www.carfinance247.co.uk";
const live = JSON.parse(fs.readFileSync("tools/live-am-i-eligible.json", "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const absolute = (h) => h.replace(/href="\//g, `href="${BASE}/`);
const arrow = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const searchIcon = `<svg class="w-6 h-6 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>`;
const head = (title, css) => `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Car Finance 247</title>
<meta name="robots" content="noindex">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
${tailwindCfg}
<link rel="stylesheet" href="../assets/styles.css">${css}
</head>`;
// The header is transparent over a purple hero on the other pages; here a purple band sits behind it
const band = `<div class="hero-bg h-20" aria-hidden="true"></div>`;

// ---- Control: today's live page ----
const rows = live.map(([t, slug]) => `        <a href="${BASE}/guide/${slug}"><div class="flex gap-6 py-2 text-dark-1"><div class="flex flex-col w-full"><div class="text-xl font-bold">${esc(t)}</div></div><div class="my-auto text-primary">${arrow}</div></div></a>`)
  .join('\n        <hr class="border-gray-200" role="presentation">\n');
const control = `<!doctype html>
<html lang="en-GB" data-design="current">
${head("Control: today's Am I Eligible (replica)", "")}
<body class="bg-white antialiased">
${absolute(header)}
<main>
  ${band}
  <nav aria-label="breadcrumb" class="px-4 py-4 text-sm" style="background:#F5EEFE"><div class="max-w-screen-xl mx-auto"><a href="${BASE}/guides" class="font-bold text-primary">Help &amp; Advice</a> <span class="mx-1">&rsaquo;</span> <span aria-current="page">Am I Eligible</span></div></nav>
  <div class="flex flex-col items-center py-8 lg:py-12">
    <div class="flex flex-col items-center w-full max-w-screen-md px-4">
      <h1 class="text-5xl font-bold mb-2 max-md:text-4xl">Am I Eligible</h1>
      <div class="w-full my-8 flex justify-center">
        <form role="search" class="flex gap-2 justify-between items-center px-4 py-3 bg-white rounded-md shadow-md w-full" style="height:56px" onsubmit="return false">
          <input type="text" placeholder="Search for a topic" aria-label="Search" class="w-full text-base outline-none">${searchIcon}
        </form>
      </div>
      <div class="my-4 flex flex-col gap-y-4 max-w-screen-lg w-full">
${rows}
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center py-6 text-center px-4">
    <h2 class="text-2xl font-bold mb-2">Can&rsquo;t find the right answer?</h2>
    <p class="mb-4">Our Manchester based team is ready to help you.</p>
    <a href="${BASE}/contact-us" class="mx-auto inline-flex items-center justify-center p-2 px-4 rounded-md text-lg font-bold text-dark-1" style="background:#00D4B5">Get in touch</a>
  </div>
</main>
${absolute(footer)}
${sprite}
</body>
</html>
`;

// ---- Wireframe: the category wireframe image ----
const card = (tag, title, text) => `        <article class="wf-card"><div class="ph" role="img" aria-label="Image placeholder"></div><div class="wf-card-body"><span class="wf-tag">${tag}</span><h3>${title}</h3><p>${text}</p></div></article>`;
const popular = [
  ["Application", "What do lenders look for when approving car finance?", "Find out what lenders look for and how to improve your chances before you apply."],
  ["Employment", "Car finance for emergency service workers", "Looking for car finance as an emergency services worker? Read everything you need to know here."],
  ["Benefits", "Car Finance on Benefits", "Wondering how car finance works if you receive benefits? Learn more about your options here."]
].map((c) => card(...c)).join("\n");
const listRows = ["Can you get car finance without proof of income?", "Car finance for emergency service workers", "Car finance for charity workers", "Can I get car finance if I’ve recently moved?", "At What Age Can You Get Car Finance?"]
  .map((t) => `        <li class="wf-listrow"><h3>${t}</h3><span aria-hidden="true">&rarr;</span></li>`).join("\n");
const controls = `<div class="wf-controls"><div class="wf-dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="wf-arrows" aria-hidden="true"><b>&lsaquo;</b><b>&rsaquo;</b></div></div>`;
const pill = (t) => `<li><span class="wf-pill">${t}</span></li>`;
const START = [
  ["Car Finance Explained", "Buying a car is one of the few major purchases you’ll make in your life, so it’s important to do it right. Learn more about car finance here."],
  ["How Car Finance Works", "Not sure how car finance works and what will be expected from you? Learn everything about the process and what you’ll be expected to do here."]
].map(([t, p]) => `      <article class="wf-card"><div class="ph" role="img" aria-label="Image placeholder" style="aspect-ratio:2/1"></div><div class="wf-card-body"><h3>${t}</h3><p>${p}</p></div></article>`).join("\n");

const wireframe = `<!doctype html>
<html lang="en-GB" data-design="wireframe">
${head("SEO wireframe: Am I Eligible", '\n<link rel="stylesheet" href="../assets/wireframe.css">')}
<body class="wf antialiased">
${absolute(header)}
<main>
  ${band}
  <nav class="wf-crumbs" aria-label="Breadcrumb"><a href="${BASE}/guides">Help &amp; Advice</a> <span aria-hidden="true">&rsaquo;</span> Am I Eligible</nav>
  <h1 class="wf-title">Am I Eligible?</h1>
  <div class="wf-strip" style="background:#fff;padding-bottom:0">
    <div class="wf-search wf-plain" role="search"><input type="search" placeholder="Search for a topic" aria-label="Search for a topic">${searchIcon}</div>
  </div>
  <p class="wf-intro-p">Wondering whether you qualify for car finance? You’re not alone. Eligibility can feel like a grey area, especially if your circumstances don’t fit the typical mould, whether you’re self-employed, a student, receiving benefits, or have a few credit hiccups in your past. This section covers everything you need to know about who can get car finance and how. Whatever your situation, you’ll find clear, straightforward answers to help you understand where you stand and what your options are.</p>

  <section class="wf-wrap wf-section" aria-labelledby="p-h">
    <h2 id="p-h" class="wf-h2" style="margin-bottom:1rem">Most popular</h2>
    <div class="wf-cards">
${popular}
    </div>
    ${controls}
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="a-h">
    <h2 id="a-h" class="wf-h2">All XX guides</h2>
    <div class="wf-filters"><span class="wf-pill">Application process</span><span class="wf-pill">Your employment</span><span class="wf-pill">Personal circumstances</span><span class="wf-pill">Benefit / Profession status</span></div>
    <ul class="wf-narrow wf-list">
${listRows}
    </ul>
    <div class="wf-narrow">${controls}</div>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="m-h">
    <h2 id="m-h" class="wf-center-h">More guide topics here</h2>
    <ul class="wf-pills">${pill("xxx")}${pill("xxx")}${pill("xxx")}${pill("xxx")}</ul>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="g-h">
    <h2 id="g-h" class="wf-center-h">Get started with car finance</h2>
    <div class="wf-two">
${START}
    </div>
  </section>

  <section class="wf-panel" aria-label="Contact us">
    <h2>Can’t find the right answer?</h2>
    <p>Our Manchester based team is ready to help you.</p>
    <a class="wf-btn" href="${BASE}/contact-us">Get in touch &rarr;</a>
    <small>Representative 19.5% APR.<br>Car Finance 247 Limited is a credit broker, not a lender.</small>
  </section>
</main>
${absolute(footer)}
${sprite}
</body>
</html>
`;

// ---- Compare page ----
const fill = (tpl, v) => Object.entries(v).reduce((t, [k, val]) => t.split("__" + k + "__").join(val), tpl);
const nav = `<nav class="pages" aria-label="Pages">
  <a class="on" aria-current="page" href="./">Comparison</a>
  <a href="../control-am-i-eligible/">Control page</a>
  <a href="../wireframe-am-i-eligible/">Wireframe page</a>
  <a href="../am-i-eligible/">New page</a>
  <a href="../compare/">&larr; Guides homepage comparison</a>
</nav>`;
const compare = fill(fs.readFileSync("tools/compare-template.html", "utf8"), {
  BASE, TITLE: "Am I Eligible? redesign comparison", NAV: nav, LIVE_URL: BASE + "/guide/am-i-eligible", LIVE_PATH: "/guide/am-i-eligible",
  VARIANTS: JSON.stringify([
    { id: "control", title: "Control (live)", note: "Replica of today's Am I Eligible", src: "../control-am-i-eligible/" },
    { id: "current", title: "Redesign (current brand)", note: "New layout in today's look", src: "../am-i-eligible/?design=current" },
    { id: "redesign", title: "Redesign (new brand)", note: "New layout in the new brand guidelines", src: "../am-i-eligible/?design=redesign" },
    { id: "wireframe", title: "SEO wireframe", note: "Layout from the category wireframe", src: "../wireframe-am-i-eligible/" }
  ], null, 2)
});

for (const [dir, html] of [["control-am-i-eligible", control], ["wireframe-am-i-eligible", wireframe], ["compare-am-i-eligible", compare]]) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/index.html`, html);
}
console.log("control-am-i-eligible, wireframe-am-i-eligible and compare-am-i-eligible written");
