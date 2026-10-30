// Generates wireframe/index.html: the SEO wireframe homepage from "Guides Homepage - UX Recommendations.pdf"
// (topic chips, most popular, recently updated, video guides, finance calculators, final contact line), built as a static page
// with placeholder image boxes, as the wireframe shows. Header, footer and logo sprite are reused from index.html.
// Run from the project root:  node tools/build-wireframe.js
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const pick = (re, what) => { const m = index.match(re); if (!m) throw new Error("index.html: could not find " + what); return m[0]; };
const header = pick(/<header[\s\S]*?<\/header>/, "header");
const footer = pick(/<footer[\s\S]*?<\/footer>/, "footer").replace("pb-28", "pb-6");
const sprite = pick(/<svg width="0" height="0"[\s\S]*?<\/svg>/, "svg sprite");
const tailwindCfg = pick(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, "tailwind config");
const BASE = "https://www.carfinance247.co.uk";

const chev = `<svg class="w-3 h-3 inline-block ml-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2l4 4-4 4"/></svg>`;
const docIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h5M9.5 15.5h5"/></svg>`;
const calcIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-calc"/></svg>`;

const popular = [
  ["Eligibility", "Will I be accepted for car finance?", "Find out what lenders look for and how to improve your chances before you apply."],
  ["Finance types", "PCP vs hire purchase explained", "Not sure which type of finance is right for you? We break down the key differences."],
  ["Credit", "How credit scores affect your finance", "Understand how your credit history influences the deals available to you."]
].map(([tag, title, text]) => `        <article class="wf-card">
          <div class="ph" role="img" aria-label="Image placeholder"></div>
          <div class="wf-card-body"><span class="wf-tag">${tag}</span><h3>${title}</h3><p>${text}</p></div>
        </article>`).join("\n");

const recent = [
  ["Car finance on benefits — what you need to know", true, "Updated 2 days ago · Eligibility"],
  ["Can I swap a car on finance?", false, "Updated 1 week ago · Agreements"],
  ["What is a soft credit search?", false, "Updated 2 weeks ago · Credit"]
].map(([title, isNew, meta]) => `        <li class="wf-row"><span class="wf-doc">${docIcon}</span><div><h3>${title}${isNew ? '<span class="wf-new">New</span>' : ""}</h3><p class="wf-meta">${meta}</p></div><span class="wf-chev" aria-hidden="true">&rsaquo;</span></li>`).join("\n");

const BARS = [[45, 70, 95, 60, 80], [60, 40, 75, 55, 90], [38, 85, 62, 80, 96]];
const videos = [
  ["Eligibility", "background:#D9D6FA;color:#3a2f8f", "2:15", "Will I be accepted for car finance?", "Credit checks &amp; soft search explained"],
  ["Finance types", "background:#CDEFDD;color:#1d6b45", "4:08", "PCP vs hire purchase — what’s the difference?", "Understanding car finance options"],
  ["Credit scores", "background:#F8CFD0;color:#8f2a2f", "3:20", "How does my credit score affect car finance?", "Credit scores &amp; finance"]
].map(([tag, style, dur, title, sub], i) => `        <a href="${BASE}/videos" class="wf-vid" style="text-decoration:none;color:inherit">
          <div class="wf-thumb"><div class="wf-bars" aria-hidden="true">${BARS[i].map((h) => `<i style="height:${h}%"></i>`).join("")}</div><span class="wf-badge" style="${style}">${tag}</span><span class="wf-play" aria-hidden="true">&#9654;</span><span class="wf-dur">${dur}</span></div>
          <div class="wf-vid-body"><h3>${title}</h3><p>${sub}</p></div>
        </a>`).join("\n");

const calcs = [
  ["Car finance calculator", "Work out your monthly repayments", "/car-finance-calculator"],
  ["Car refinance calculator", "See if refinancing could save you money", "/car-refinance-calculator"],
  ["Motorbike finance calculator", "Estimate your motorbike finance costs", "/motorbike-finance-calculator"],
  ["Van finance calculator", "Find out what van finance could cost you", "/van-finance-calculator"]
].map(([t, s, href]) => `        <a href="${BASE}${href}" class="wf-calc"><h3>${calcIcon}${t}</h3><p>${s} &rarr;</p></a>`).join("\n");

const pill = (t, href) => `        <li><a href="${href}" class="wf-pill">${t}</a></li>`;

const html = `<!doctype html>
<html lang="en-GB" data-design="wireframe">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SEO wireframe: Car Finance Guides | Car Finance 247</title>
<meta name="robots" content="noindex">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
${tailwindCfg}
<link rel="stylesheet" href="../assets/styles.css">
<link rel="stylesheet" href="../assets/wireframe.css">
</head>
<body class="wf antialiased">
${header.replace(/href="\//g, `href="${BASE}/`)}
<main>
  <section class="hero-bg wf-hero text-white pt-36 pb-16 px-4 text-center" aria-labelledby="page-title">
    <h1 id="page-title" class="text-6xl max-md:text-4xl font-bold leading-tight">Car Finance Guides</h1>
    <p class="mt-6 text-sm max-w-md mx-auto">Learn more about the different types of car finance, eligibility, credit scores and managing your agreement.</p>
  </section>
  <div class="wf-strip">
    <div class="wf-search" role="search">
      <input type="search" placeholder="Search car finance guides..." aria-label="Search car finance guides">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
    </div>
  </div>

  <section class="wf-wrap wf-topics" aria-labelledby="topics-h">
    <h2 id="topics-h">Pick a topic to get started:</h2>
    <ul class="wf-pills">
${pill("Getting accepted", BASE + "/guide/am-i-eligible")}
${pill("Choosing a car", BASE + "/guide/choosing-a-vehicle")}
${pill("Comparing finance", BASE + "/guide/finance-options")}
${pill("Already have finance", BASE + "/guide/looking-to-upgrade")}
${pill("Understanding credit", BASE + "/guide/my-credit")}
    </ul>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="popular-h">
    <h2 id="popular-h" class="wf-h2" style="margin-bottom:1rem">Most popular</h2>
    <div class="wf-cards">
${popular}
    </div>
    <div class="wf-controls"><div class="wf-dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="wf-arrows" aria-hidden="true"><b>&lsaquo;</b><b>&rsaquo;</b></div></div>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="recent-h">
    <h2 id="recent-h" class="wf-h2" style="margin-bottom:.5rem">Recently updated</h2>
    <ul class="wf-list">
${recent}
    </ul>
    <div class="wf-controls"><div class="wf-dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="wf-arrows" aria-hidden="true"><b>&lsaquo;</b><b>&rsaquo;</b></div></div>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="video-h">
    <div class="wf-head"><h2 id="video-h" class="wf-h2">Video guides</h2><a class="wf-link" href="${BASE}/videos">View all &rarr;</a></div>
    <div class="wf-vids">
${videos}
    </div>
  </section>

  <section class="wf-wrap wf-section" aria-labelledby="calc-h">
    <h2 id="calc-h" class="wf-h2">Finance calculators</h2>
    <p class="wf-intro">Curious about what your repayments might look like? Use our free calculators to get a clearer picture before you apply.</p>
    <div class="wf-calcs">
${calcs}
    </div>
  </section>

  <section class="wf-cta" aria-label="Contact us">
    <h2>Still have questions? Our team is here to help</h2>
    <a class="wf-btn" href="${BASE}/contact-us">Get in touch &rarr;</a>
  </section>
</main>
${footer.replace(/href="\//g, `href="${BASE}/`)}
${sprite}
</body>
</html>
`;

fs.mkdirSync("wireframe", { recursive: true });
fs.writeFileSync("wireframe/index.html", html);
console.log("wireframe/index.html written");
