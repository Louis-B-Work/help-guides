// Generates am-i-eligible/index.html (the "Am I Eligible?" guide category page) so every card, list item and link is real HTML
// in the file, not injected by script. Header, footer, logo sprite, search strip and dock are reused from index.html.
// Run from the project root:  node tools/build-category.js
const fs = require("fs");

const BASE = "https://www.carfinance247.co.uk";
const IMG = (id, file, q = "?language_id=1") => `${BASE}/dA/${id}/asset/${file}${q}`;
const PHOTOS = {
  licence: IMG("467f6e939fa33901c0574b7c74b37222", "What%20licence%20needed%20for%20car%20finance.jpg"),
  balloon: IMG("47996887843a9acce479aceed9beb591", "Can%20I%20refinance%20my%20balloon%20payment%20on%20a%20PCP.jpg"),
  score: IMG("33b74fe5d937df4ebb9b429a2a393e7f", "What%20Credit%20Score%20is%20Needed%20for%20Car%20Finance.jpg"),
  pcp: IMG("ca0de27e4d56671aa76e24d5522d83d4", "PCP%20car%20finance%20with%20bad%20credit.jpg"),
  swap: IMG("4bc1eb4e3400aba2891f658c9184330e", "outstanding%20finance%20on%20my%20car.jpg", ""),
  def: IMG("7331ce660348aa7b6d1fa05acd211af3", "get%20car%20finance%20with%20a%20default.jpg", ""),
  ccj: IMG("b56a2a808ab9adea33d5cb618f8140d6", "Car%20Finance%20With%20a%20CCJ.jpg", ""),
  iva: IMG("2c0b998d730ce34dd0237f222b07a664", "Car%20Finance%20with%20an%20IVA.jpg", "")
};
// Placeholder photos per sub-topic until each guide has its own image.
const POOL = {
  "Application": [PHOTOS.licence, PHOTOS.balloon, PHOTOS.score],
  "Employment": [PHOTOS.licence, PHOTOS.swap, PHOTOS.pcp],
  "Benefits": [PHOTOS.score, PHOTOS.swap, PHOTOS.licence],
  "Age": [PHOTOS.pcp, PHOTOS.balloon, PHOTOS.licence],
  "Credit History": [PHOTOS.ccj, PHOTOS.def, PHOTOS.iva],
  "Address": [PHOTOS.swap, PHOTOS.licence, PHOTOS.balloon]
};

// ---- Title Case (headings and card titles are Title Case across the prototype) ----
const SMALL = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "vs", "with"]);
const cap = (w) => w.replace(/[A-Za-z]/, (c) => c.toUpperCase());
const titleCase = (t) => {
  const words = t.split(" ");
  return words.map((w, i) => {
    const afterColon = i > 0 && /[:?]$/.test(words[i - 1]);
    const parts = w.split("-").map((p, j) => {
      const bare = p.toLowerCase().replace(/[^a-z]/g, "");
      const edge = (i === 0 && j === 0) || (i === words.length - 1 && j === w.split("-").length - 1) || afterColon;
      return SMALL.has(bare) && !edge ? p.toLowerCase() : cap(p);
    });
    return parts.join("-");
  }).join(" ");
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const photoFor = (g) => { const p = POOL[g.tag]; return p[hash(g.slug) % p.length]; };

// ---- Data: all 36 live "Am I Eligible?" guides with a sub-topic tag ----
const G = (slug, title, tag) => ({ slug, title, tag });
const GUIDES = [
  G("is-it-hard-to-get-accepted-for-car-finance", "Is it hard to get accepted for car finance?", "Application"),
  G("what-do-lenders-look-for-when-approving-car-finance", "What do lenders look for when approving car finance?", "Application"),
  G("how-long-does-it-take-for-car-finance-to-be-approved", "How long does it take for car finance to be approved?", "Application"),
  G("what-documents-do-i-need-for-car-finance", "What documents do I need for car finance?", "Application"),
  G("how-much-deposit-do-i-need-for-car-finance", "How Much Deposit Do I Need for Car Finance?", "Application"),
  G("a-complete-guide-to-car-finance-checks-in-the-uk", "A complete guide to car finance checks in the UK", "Application"),
  G("do-i-need-a-driving-licence-to-get-car-finance", "Do I need a driving licence to get car finance?", "Application"),
  G("can-you-get-car-finance-without-proof-of-income", "Can you get car finance without proof of income?", "Application"),
  G("car-finance-without-a-bank-account", "Car finance without a bank account", "Application"),
  G("understanding-negative-equity-car-finance", "Understanding negative equity car finance", "Application"),
  G("can-i-get-car-finance-if-i-m-self-employed", "Can I get car finance if i'm self-employed?", "Employment"),
  G("can-i-get-car-finance-with-a-new-job", "Can I get car finance with a new job?", "Employment"),
  G("can-i-get-car-finance-if-i-m-unemployed", "Can I get car finance if I'm unemployed?", "Employment"),
  G("can-you-get-car-finance-if-you-work-part-time", "Can you get car finance if you work part-time?", "Employment"),
  G("can-you-get-car-finance-as-an-agency-worker", "Can You Get Car Finance as an Agency Worker?", "Employment"),
  G("car-finance-for-teachers", "Car Finance For Teachers", "Employment"),
  G("car-finance-for-nhs-workers", "Car Finance for NHS Workers", "Employment"),
  G("car-finance-for-key-workers", "Car finance for key workers", "Employment"),
  G("car-finance-for-emergency-service-workers", "Car finance for emergency service workers", "Employment"),
  G("car-finance-for-public-sector-workers", "Car finance for public sector workers", "Employment"),
  G("car-finance-for-council-workers", "Car finance for council workers", "Employment"),
  G("car-finance-for-charity-workers", "Car finance for charity workers", "Employment"),
  G("car-finance-for-armed-forces", "Car finance for armed forces", "Employment"),
  G("car-finance-on-benefits", "Car finance on benefits", "Benefits"),
  G("car-finance-with-a-disability", "Car finance with a disability", "Benefits"),
  G("can-i-get-car-finance-on-a-carer-s-allowance", "Can I get car finance on a carer's allowance?", "Benefits"),
  G("can-i-get-car-finance-as-a-housewife-or-stay-at-home-parent", "Can I get car finance as a housewife or stay-at-home parent?", "Benefits"),
  G("car-finance-for-students", "Car finance for students", "Age"),
  G("car-finance-for-young-drivers", "Car finance for young drivers", "Age"),
  G("at-what-age-can-you-get-car-finance", "At What Age Can You Get Car Finance?", "Age"),
  G("refused-car-finance", "Refused car finance", "Credit History"),
  G("car-finance-with-a-ccj", "Car Finance With a CCJ", "Credit History"),
  G("bankruptcy-and-car-finance-explained", "Bankruptcy and car finance explained", "Credit History"),
  G("can-you-get-car-finance-without-3-years-address-history", "Can you get car finance without 3 years address history?", "Address"),
  G("can-i-get-car-finance-if-i-ve-recently-moved", "Can I get car finance if I’ve recently moved?", "Address"),
  G("can-i-get-car-finance-in-northern-ireland", "Can I get car finance in Northern Ireland?", "Address")
];
// Filter pills from the wireframe. Guides about a profession sit with benefits under "Benefit / Profession status".
const PROFESSIONS = new Set(["car-finance-for-teachers", "car-finance-for-nhs-workers", "car-finance-for-key-workers", "car-finance-for-emergency-service-workers",
  "car-finance-for-public-sector-workers", "car-finance-for-council-workers", "car-finance-for-charity-workers", "car-finance-for-armed-forces"]);
const GROUPS = ["Application process", "Your employment", "Personal circumstances", "Benefit / Profession status"];
const groupOf = (g) => PROFESSIONS.has(g.slug) || g.tag === "Benefits" ? GROUPS[3] : g.tag === "Application" ? GROUPS[0] : g.tag === "Employment" ? GROUPS[1] : GROUPS[2];
GUIDES.forEach((g) => { g.group = groupOf(g); });
const bySlug = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

// Most popular: ranked placeholders. Replace with the traffic/performance ranking used for the homepage carousel.
const POPULAR = [
  ["is-it-hard-to-get-accepted-for-car-finance", "What really decides a yes or a no, and the quick wins that can improve your chances before you apply."],
  ["what-do-lenders-look-for-when-approving-car-finance", "Income, affordability, credit history and stability: the checks lenders run and how much each one counts."],
  ["how-long-does-it-take-for-car-finance-to-be-approved", "A realistic timeline from application to decision, and what can speed things up or hold them back."],
  ["can-i-get-car-finance-if-i-m-self-employed", "How lenders assess variable income, and the proof of earnings that strengthens a self-employed application."],
  ["car-finance-on-benefits", "Which benefits lenders can count as income, and how affordability is worked out when you are not employed."],
  ["refused-car-finance", "Turned down? The common reasons for a refusal, and what to do next without harming your credit file."]
].map(([slug, summary]) => ({ ...bySlug[slug], summary }));

const CATEGORY = {
  name: "Am I Eligible?",
  intro: "Not sure if you will be accepted? These guides explain what car finance lenders check, from income and employment to age, address history and credit, and what you can do to improve your chances. Find out which documents to have ready, how long approval takes, and whether being self-employed, on benefits or new to a job changes your options.",
  metaTitle: "Am I Eligible for Car Finance? Eligibility Guides | Car Finance 247",
  metaDescription: "Find out if you can get car finance. Guides on what lenders look for, documents, approval times, self-employed, benefits, age and credit history."
};
const OTHERS = [
  ["Choosing a Vehicle", "/guide/choosing-a-vehicle", "35 guides on cars, vans and what lenders will finance"],
  ["Finance Options", "/guide/finance-options", "47 guides comparing PCP, hire purchase, leasing and more"],
  ["Looking to Upgrade", "/guide/looking-to-upgrade", "9 guides on swapping, settling and refinancing"],
  ["My Credit", "/guide/my-credit", "19 guides on credit scores, reports and bad credit"]
];

// ---- Assemble from index.html ----
const index = fs.readFileSync("index.html", "utf8");
const pick = (re, what) => { const m = index.match(re); if (!m) throw new Error("index.html: could not find " + what); return m[0]; };
const header = pick(/<header[\s\S]*?<\/header>/, "header");
const footer = pick(/<footer[\s\S]*?<\/footer>/, "footer");
const sprite = pick(/<svg width="0" height="0"[\s\S]*?<\/svg>/, "svg sprite");
const searchStrip = pick(/<!-- AI helper search[\s\S]*?(?=\n\s*<!-- Topics)/, "search strip");
const dock = pick(/<!-- Sticky AI dock[\s\S]*?(?=\n<script src="assets\/guides\.js">)/, "dock");
let head = pick(/<head>[\s\S]*?<\/head>/, "head");

const chev = `<svg class="inline-block w-3 h-3 ml-1 -mt-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2l4 4-4 4"/></svg>`;
const liveUrl = (g) => `${BASE}/guide/${g.slug}`;

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", name: CATEGORY.name, url: `${BASE}/guide/am-i-eligible`, description: CATEGORY.metaDescription,
      publisher: { "@type": "Organization", name: "Car Finance 247", url: BASE } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
      { "@type": "ListItem", position: 2, name: "Help & Guides", item: BASE + "/guides" },
      { "@type": "ListItem", position: 3, name: CATEGORY.name, item: `${BASE}/guide/am-i-eligible` }] },
    { "@type": "ItemList", name: "Most Popular", itemListElement: POPULAR.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: titleCase(g.title), url: liveUrl(g) })) }
  ]
};
head = head
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(CATEGORY.metaTitle)}</title>`)
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(CATEGORY.metaDescription)}">`)
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE}/guide/am-i-eligible">`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);

const cards = POPULAR.map((g) => `        <article class="relative shrink-0 w-[calc((100%-3rem)/3)] max-md:w-[85%] bg-cardbg" data-rank="${POPULAR.indexOf(g) + 1}">
          <img src="${photoFor(g)}" alt="" loading="lazy" class="w-full aspect-[16/9] object-cover">
          <div class="p-4 pb-6"><span class="inline-block bg-[#E6D5FB] text-dark-1 text-sm px-3 py-1">${esc(g.tag)}</span>
            <h3 class="font-bold mt-3"><a href="${liveUrl(g)}" class="hover:underline after:absolute after:inset-0">${esc(titleCase(g.title))}</a></h3>
            <p class="mt-2 text-sm">${esc(g.summary)}</p></div>
        </article>`).join("\n");

const listItems = GUIDES.map((g) => `        <li class="border-b border-gray-200" data-guide data-group="${esc(g.group)}">
          <a href="${liveUrl(g)}" class="flex items-center gap-4 py-4 hover:bg-tint/60">
            <h3 class="flex-1 min-w-0 font-semibold text-gray-900">${esc(titleCase(g.title))}</h3>
            <span class="text-primary text-xl" aria-hidden="true">&rarr;</span>
          </a>
        </li>`).join("\n");

const topicPills = OTHERS.map(([name, href]) => `        <li><a href="${BASE}${href}" class="topic-pill">${esc(name)}</a></li>`).join("\n");

const START = [
  ["Car Finance Explained", "Buying a car is one of the few major purchases you’ll make in your life, so it’s important to do it right. Learn more about car finance here.", PHOTOS.pcp, "/guide/finance-options"],
  ["How Car Finance Works", "Not sure how car finance works and what will be expected from you? Learn everything about the process and what you’ll be expected to do here.", PHOTOS.licence, "/guide/finance-options"]
].map(([t, text, img, href]) => `        <article class="relative bg-cardbg">
          <img src="${img}" alt="" loading="lazy" class="w-full aspect-[2/1] object-cover">
          <div class="p-4 pb-6"><h3 class="font-bold"><a href="${BASE}${href}" class="hover:underline after:absolute after:inset-0">${esc(t)}</a></h3><p class="mt-2 text-sm">${esc(text)}</p></div>
        </article>`).join("\n");

const pills = GROUPS.map((n) => `<button type="button" class="topic-pill" data-group="${esc(n)}" aria-pressed="false">${esc(n)}</button>`).join("\n        ");

const body = `<body class="bg-white antialiased">

${header}

<main>
  <!-- Breadcrumb strip -->
  <div class="hero-bg h-20" aria-hidden="true"></div>
  <nav aria-label="Breadcrumb" class="bg-tint py-2 px-4 text-xs"><div class="max-w-screen-lg mx-auto"><a href="./" class="text-primary font-semibold hover:underline">Help &amp; Advice</a> <span aria-hidden="true" class="mx-1">&rsaquo;</span> <span>${esc(CATEGORY.name)}</span></div></nav>

  <!-- Title and search: H1 is the category name only -->
  <section class="px-4 pt-10 text-center" aria-labelledby="page-title">
    <h1 id="page-title" class="text-5xl max-md:text-4xl font-bold leading-tight">${esc(CATEGORY.name)}</h1>
  </section>
  ${searchStrip.replace("bg-tint px-4 pb-4", "px-4 pb-2 pt-6").replace("-mt-7", "mt-0")}
  <section class="px-4 pt-6" aria-label="About this section"><p class="max-w-3xl mx-auto text-sm">${esc(CATEGORY.intro)}</p></section>

  <!-- Most popular: every card is in the HTML with a real link; the carousel only scrolls what is already there -->
  <section class="px-4 pt-12 pb-10" aria-labelledby="popular-h">
    <div class="max-w-screen-lg mx-auto" data-carousel>
      <h2 id="popular-h" class="text-3xl font-bold mb-5">Most Popular</h2>
      <div data-track class="hscroll flex gap-6 overflow-x-auto pb-2">
${cards}
      </div>
      <div data-controls class="flex items-center justify-between mt-4"></div>
    </div>
  </section>

  <!-- Full guide list: all ${GUIDES.length} guides are in the HTML; category.js filters by pill and shows 5 at a time -->
  <section id="all-guides" class="px-4 py-10" aria-labelledby="all-h">
    <div class="max-w-screen-lg mx-auto">
      <h2 id="all-h" class="text-3xl font-bold mb-5">All ${GUIDES.length} Guides</h2>
      <div class="flex flex-wrap justify-center gap-3 mb-6" role="group" aria-label="Filter guides by topic">
        ${pills}
      </div>
      <ol id="guide-list" data-page-size="5" class="max-w-3xl mx-auto">
${listItems}
      </ol>
      <nav id="guide-pager" aria-label="Guide list pages" class="max-w-3xl mx-auto flex items-center justify-between gap-4 mt-5"></nav>
    </div>
  </section>

  <!-- Other guide topics -->
  <section class="px-4 py-10" aria-labelledby="cross-h">
    <div class="max-w-screen-lg mx-auto">
      <h2 id="cross-h" class="text-3xl font-bold text-center mb-6">More Guide Topics</h2>
      <ul class="flex flex-wrap justify-center gap-3">
${topicPills}
      </ul>
    </div>
  </section>

  <!-- Get started -->
  <section class="px-4 py-10" aria-labelledby="start-h">
    <div class="max-w-4xl mx-auto">
      <h2 id="start-h" class="text-3xl font-bold text-center mb-6">Get Started with Car Finance</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
${START}
      </div>
    </div>
  </section>

  <!-- Contact CTA: sits directly above the footer navigation -->
  <section id="help-cta" class="px-4 py-12 text-center bg-tint">
    <h2 class="text-2xl font-bold">Can’t Find the Right Answer?</h2>
    <p class="mt-1 text-gray-700">Our Manchester based team is ready to help you.</p>
    <a href="${BASE}/contact" class="inline-block mt-4 bg-teal text-dark-1 font-bold rounded-md px-6 py-3 hover:brightness-95">Get in touch${chev}</a>
    <p class="mt-4 text-xs text-gray-600">Representative 19.5% APR.<br>Car Finance 247 Limited is a credit broker, not a lender.</p>
  </section>
</main>

${footer}

${sprite}

${dock}

<script src="assets/guides.js"></script>
<script src="assets/ai-search.js"></script>
<script src="assets/page.js"></script>
<script src="assets/category.js"></script>
<script src="assets/cog.js"></script>
</body>
</html>
`;

// The page is served at /am-i-eligible/, one level below the site root, so shared assets are referenced with ../
const OUT_DIR = "am-i-eligible";
const html = `<!doctype html>
<html lang="en-GB">
${head}
${body}`
  .replace(/(href|src)="assets\//g, '$1="../assets/')
  .replace(/href="\.\/"/g, 'href="../"');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(`${OUT_DIR}/index.html`, html);
console.log(`${OUT_DIR}/index.html written: ${POPULAR.length} popular cards, ${GUIDES.length} list items`);
