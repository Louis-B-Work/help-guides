// Generates two pages for comparing the new designs with today's live /guides page:
//   control/index.html  a rebuilt replica of https://www.carfinance247.co.uk/guides (the live page forbids being
//                       embedded, so it cannot be framed directly). Static, same look and layout as the live page.
//   compare/index.html  comparison page: control, new (current styling) and new (redesign) in device frames.
// Header, footer, logo sprite and head are reused from index.html. Run from the project root:  node tools/build-compare.js
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const pick = (re, what) => { const m = index.match(re); if (!m) throw new Error("index.html: could not find " + what); return m[0]; };
const header = pick(/<header[\s\S]*?<\/header>/, "header");
const footer = pick(/<footer[\s\S]*?<\/footer>/, "footer").replace("pb-28", "pb-6");
const sprite = pick(/<svg width="0" height="0"[\s\S]*?<\/svg>/, "svg sprite");
const tailwindCfg = pick(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, "tailwind config");
const BASE = "https://www.carfinance247.co.uk";

// ---- Control: what /guides shows today (captured from the live page) ----
const ICONS = {
  person: '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z"/>',
  car: '<path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11a2 2 0 011.5 2v4h-2v1.5a1 1 0 01-1 1h-1a1 1 0 01-1-1V17H8v1.5a1 1 0 01-1 1H6a1 1 0 01-1-1V17H3.5v-4A2 2 0 015 11zm2.1 0h9.8l-1-3.2a.5.5 0 00-.5-.3H8.6a.5.5 0 00-.5.3L7.1 11zM7 13.2a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zm10 0a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/>',
  doc: '<path d="M6 3h8l5 5v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zm7 1.5V9h4.5L13 4.5zM8 12v1.5h8V12H8zm0 3.5V17h5v-1.5H8z"/>',
  swap: '<path d="M7 7h10l-2.5-2.5L15.9 3 21 8l-5.1 5-1.4-1.5L17 9H7V7zm10 10H7l2.5 2.5L8.1 21 3 16l5.1-5 1.4 1.5L7 15h10v2z"/>',
  chart: '<path d="M4 20V4h2v14h14v2H4zm4-4V9h3v7H8zm5 0V6h3v10h-3zm5 0v-5h3v5h-3z"/>'
};
const CATS = [
  { name: "Am I Eligible", href: "/guide/am-i-eligible", icon: "person", total: 36, guides: [
    ["Car finance with a disability", "car-finance-with-a-disability"],
    ["Car finance on benefits", "car-finance-on-benefits"],
    ["Understanding negative equity car finance", "understanding-negative-equity-car-finance"],
    ["How long does it take for car finance to be approved?", "how-long-does-it-take-for-car-finance-to-be-approved"],
    ["Can You Get Car Finance as an Agency Worker?", "can-you-get-car-finance-as-an-agency-worker"]] },
  { name: "Choosing a vehicle", href: "/guide/choosing-a-vehicle", icon: "car", total: 35, guides: [
    ["Car finance for private sale", "car-finance-for-private-sale"],
    ["Taxi driver car finance", "taxi-driver-car-finance"],
    ["Can you get car finance on an older car?", "can-you-get-car-finance-on-an-older-car"],
    ["Can I get car finance on a Volkswagen?", "can-i-get-car-finance-on-a-volkswagen"],
    ["Should I buy a Cat S car?", "should-i-buy-a-cat-s-car"]] },
  { name: "Finance Options", href: "/guide/finance-options", icon: "doc", total: 47, guides: [
    ["Can you swap a car on finance?", "can-you-swap-a-car-on-finance"],
    ["What is Voluntary Termination (VT) of Car Finance?", "what-is-voluntary-termination-vt-of-car-finance"],
    ["Can I give my car back to the finance company?", "can-i-give-my-car-back-to-the-finance-company"],
    ["Pay as you go car finance", "pay-as-you-go-car-finance"],
    ["Hire Purchase vs leasing", "hire-purchase-vs-leasing"]] },
  { name: "Looking to upgrade", href: "/guide/looking-to-upgrade", icon: "swap", total: 9, guides: [
    ["Can you cancel car finance? A comprehensive guide", "can-you-cancel-car-finance-a-comprehensive-guide"],
    ["What is a settlement figure?", "what-is-a-settlement-figure"],
    ["Can you have two car finance agreements?", "can-you-have-two-car-finance-agreements"],
    ["What happens if your financed car is stolen?", "what-happens-if-your-financed-car-is-stolen"],
    ["Upgrading your car? How to trade in and refinance seamlessly", "upgrading-your-car-how-to-trade-in-and-refinance-seamlessly"]] },
  { name: "My Credit", href: "/guide/my-credit", icon: "chart", total: 19, guides: [
    ["Equifax vs Experian vs TransUnion: What's the difference?", "equifax-vs-experian-vs-transunion-what-s-the-difference"],
    ["What credit score is needed for car finance?", "what-credit-score-is-needed-for-car-finance"],
    ["Can I get PCP car finance with bad credit?", "can-i-get-pcp-car-finance-with-bad-credit"],
    ["Does car finance affect your mortgage?", "does-car-finance-affect-your-mortgage"],
    ["Car finance with a default", "car-finance-with-a-default"]] }
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chev = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`;

const cards = CATS.map((c) => `      <div class="rounded-lg border p-6 bg-white shadow-md">
        <div class="mb-3"><span class="flex items-center justify-center w-12 h-12 rounded-full" style="background:#D6F8F2;color:#00D4B5"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[c.icon]}</svg></span></div>
        <h2 class="text-2xl font-bold mb-5">${esc(c.name)}</h2>
        <h3 class="font-bold mb-4">Featured guides</h3>
        <ul>
${c.guides.map(([t, s]) => `          <li class="border-b border-gray-200 last:border-0"><a href="${BASE}/guide/${s}" class="block py-3 text-primary hover:underline">${esc(t)}</a></li>`).join("\n")}
        </ul>
        <a href="${BASE}${c.href}" class="flex gap-2 items-center mt-4 lg:mt-6 font-bold text-primary hover:underline">View all ${c.total} guides ${chev}</a>
      </div>`).join("\n");

const controlHead = `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Control: today's /guides (replica) | Car Finance 247</title>
<meta name="robots" content="noindex">
${tailwindCfg}
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<link rel="stylesheet" href="../assets/styles.css">
</head>`;
// tailwind.config must run after the CDN script defines `tailwind`, so order the two scripts correctly
const controlHeadFixed = controlHead.replace(tailwindCfg + "\n<script src=\"https://cdn.tailwindcss.com/3.4.16\"></script>", "<script src=\"https://cdn.tailwindcss.com/3.4.16\"></script>\n" + tailwindCfg);

const control = `<!doctype html>
<html lang="en-GB" data-design="current">
${controlHeadFixed}
<body class="bg-white antialiased">
${header.replace(/href="\//g, `href="${BASE}/`)}
<main>
  <section class="hero-bg text-white pt-28 pb-0 px-4 text-center" aria-labelledby="page-title">
    <h1 id="page-title" class="text-5xl font-bold leading-tight mt-12 max-md:leading-[55px]">Help &amp; Guides</h1>
    <p class="mt-2 max-w-md mx-auto">Rates from 8.9% APR. Representative 19.5% APR. Car Finance 247 Limited is a credit broker, not a lender.</p>
    <div class="h-10"></div>
  </section>
  <div class="px-4" style="background:#F5EEFE">
    <div class="relative z-10 max-w-screen-sm mx-auto -mt-7">
      <div class="flex gap-2 justify-between items-center px-4 py-3 bg-white rounded-md shadow-md">
        <input type="search" placeholder="Search for a topic..." aria-label="Search for a topic" class="w-full text-base leading-6 text-left outline-none py-2">
        <svg class="w-6 h-6 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
      </div>
    </div>
    <div class="flex flex-col items-center py-10 px-0">
      <section class="w-full max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-6">
${cards}
      </section>
    </div>
  </div>
  <div class="flex flex-col justify-center py-6 max-md:py-8 text-center px-4 lg:px-0">
    <h2 class="text-2xl font-bold mb-2">Can&rsquo;t find the right answer?</h2>
    <p class="mb-4">Our Manchester based team is ready to help you.</p>
    <a href="${BASE}/contact-us" class="mx-auto inline-flex items-center justify-center p-2 px-4 rounded-md text-lg font-bold text-dark-1" style="background:#00D4B5">Get in touch</a>
  </div>
</main>
${footer.replace(/href="\//g, `href="${BASE}/`)}
${sprite}
</body>
</html>
`;

// ---- Compare page (static template: tools/compare-template.html) ----
const fill = (tpl, v) => Object.entries(v).reduce((t, [k, val]) => t.split("__" + k + "__").join(val), tpl);
const nav = (on) => `<nav class="pages" aria-label="Pages">
  <a${on === "c" ? ' class="on" aria-current="page"' : ""} href="./">Comparison</a>
  <a href="../control/">Control page</a>
  <a href="../wireframe/">Wireframe page</a>
  <a href="../">New page</a>
  <a href="../compare-am-i-eligible/">Am I Eligible? comparison &rarr;</a>
</nav>`;
const compare = fill(fs.readFileSync("tools/compare-template.html", "utf8"), {
  BASE, TITLE: "Guides redesign comparison", NAV: nav("c"), LIVE_URL: BASE + "/guides", LIVE_PATH: "/guides",
  VARIANTS: JSON.stringify([
    { id: "control", title: "Control (live)", note: "Replica of today's /guides", src: "../control/" },
    { id: "current", title: "Redesign (current brand)", note: "New layout in today's look", src: "../?design=current" },
    { id: "redesign", title: "Redesign (new brand)", note: "New layout in the new brand guidelines", src: "../?design=redesign" },
    { id: "wireframe", title: "SEO wireframe (PDF)", note: "Layout from the UX recommendations PDF", src: "../wireframe/" }
  ], null, 2)
});

fs.mkdirSync("control", { recursive: true });
fs.mkdirSync("compare", { recursive: true });
fs.writeFileSync("control/index.html", control);
fs.writeFileSync("compare/index.html", compare);
console.log("control/index.html and compare/index.html written");
