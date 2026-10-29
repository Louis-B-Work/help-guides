// Guide index used by the AI helper and the "Recently updated" list.
// URLs are real (scraped from /guides). `updated` dates are placeholders until fed from the CMS.
window.GUIDES = [
  { t: "Car finance with a disability", u: "/guide/car-finance-with-a-disability", topic: "accepted", updated: "2026-10-22" },
  { t: "Car finance on benefits", u: "/guide/car-finance-on-benefits", topic: "accepted", updated: "2026-10-27" },
  { t: "Understanding negative equity car finance", u: "/guide/understanding-negative-equity-car-finance", topic: "accepted", updated: "2026-10-14" },
  { t: "How long does it take for car finance to be approved?", u: "/guide/how-long-does-it-take-for-car-finance-to-be-approved", topic: "accepted", updated: "2026-10-09" },
  { t: "Can you get car finance as an agency worker?", u: "/guide/can-you-get-car-finance-as-an-agency-worker", topic: "accepted", updated: "2026-09-30" },
  { t: "Do I need a driving licence to get car finance?", u: "/guide/do-i-need-a-driving-licence-to-get-car-finance", img: "https://www.carfinance247.co.uk/dA/467f6e939fa33901c0574b7c74b37222/asset/What%20licence%20needed%20for%20car%20finance.jpg?language_id=1", topic: "accepted", updated: "2026-09-21" },
  { t: "Why have I been declined PCP car finance?", u: "/guide/why-have-i-been-declined-pcp-car-finance", topic: "accepted", updated: "2026-09-18" },
  { t: "Car finance for private sale", u: "/guide/car-finance-for-private-sale", topic: "choosing", updated: "2026-10-18" },
  { t: "Taxi driver car finance", u: "/guide/taxi-driver-car-finance", topic: "choosing", updated: "2026-10-02" },
  { t: "Can you get car finance on an older car?", u: "/guide/can-you-get-car-finance-on-an-older-car", topic: "choosing", updated: "2026-09-25" },
  { t: "Can I get car finance on a Volkswagen?", u: "/guide/can-i-get-car-finance-on-a-volkswagen", topic: "choosing", updated: "2026-09-11" },
  { t: "Should I buy a Cat S car?", u: "/guide/should-i-buy-a-cat-s-car", topic: "choosing", updated: "2026-09-04" },
  { t: "Can you swap a car on finance?", u: "/guide/can-you-swap-a-car-on-finance", img: "https://www.carfinance247.co.uk/dA/4bc1eb4e3400aba2891f658c9184330e/asset/outstanding%20finance%20on%20my%20car.jpg", topic: "comparing", updated: "2026-10-25" },
  { t: "What is Voluntary Termination (VT) of car finance?", u: "/guide/what-is-voluntary-termination-vt-of-car-finance", topic: "existing", updated: "2026-10-11" },
  { t: "Can I give my car back to the finance company?", u: "/guide/can-i-give-my-car-back-to-the-finance-company", topic: "existing", updated: "2026-10-05" },
  { t: "Pay as you go car finance", u: "/guide/pay-as-you-go-car-finance", topic: "comparing", updated: "2026-09-28" },
  { t: "Hire purchase vs leasing", u: "/guide/hire-purchase-vs-leasing", topic: "comparing", updated: "2026-09-15" },
  { t: "Can I refinance my balloon payment on a PCP?", u: "/guide/can-i-refinance-my-balloon-payment-on-a-pcp", img: "https://www.carfinance247.co.uk/dA/47996887843a9acce479aceed9beb591/asset/Can%20I%20refinance%20my%20balloon%20payment%20on%20a%20PCP.jpg?language_id=1", topic: "comparing", updated: "2026-09-08" },
  { t: "Equity release for car finance", u: "/guide/equity-release-for-car-finance", topic: "comparing", updated: "2026-08-29" },
  { t: "Can you cancel car finance? A comprehensive guide", u: "/guide/can-you-cancel-car-finance-a-comprehensive-guide", topic: "existing", updated: "2026-10-16" },
  { t: "What is a settlement figure?", u: "/guide/what-is-a-settlement-figure", topic: "existing", updated: "2026-10-07" },
  { t: "Can you have two car finance agreements?", u: "/guide/can-you-have-two-car-finance-agreements", topic: "existing", updated: "2026-09-22" },
  { t: "What happens if your financed car is stolen?", u: "/guide/what-happens-if-your-financed-car-is-stolen", topic: "existing", updated: "2026-09-02" },
  { t: "Upgrading your car? How to trade in and refinance seamlessly", u: "/guide/upgrading-your-car-how-to-trade-in-and-refinance-seamlessly", topic: "existing", updated: "2026-08-20" },
  { t: "Equifax vs Experian vs TransUnion: what's the difference?", u: "/guide/equifax-vs-experian-vs-transunion-what-s-the-difference", topic: "credit", updated: "2026-10-23" },
  { t: "What credit score is needed for car finance?", u: "/guide/what-credit-score-is-needed-for-car-finance", img: "https://www.carfinance247.co.uk/dA/33b74fe5d937df4ebb9b429a2a393e7f/asset/What%20Credit%20Score%20is%20Needed%20for%20Car%20Finance.jpg?language_id=1", topic: "credit", updated: "2026-10-12" },
  { t: "Can I get PCP car finance with bad credit?", u: "/guide/can-i-get-pcp-car-finance-with-bad-credit", img: "https://www.carfinance247.co.uk/dA/ca0de27e4d56671aa76e24d5522d83d4/asset/PCP%20car%20finance%20with%20bad%20credit.jpg?language_id=1", topic: "credit", updated: "2026-10-01" },
  { t: "Does car finance affect your mortgage?", u: "/guide/does-car-finance-affect-your-mortgage", topic: "credit", updated: "2026-09-19" },
  { t: "Car finance with a default", u: "/guide/car-finance-with-a-default", img: "https://www.carfinance247.co.uk/dA/7331ce660348aa7b6d1fa05acd211af3/asset/get%20car%20finance%20with%20a%20default.jpg", topic: "credit", updated: "2026-09-10" },
  { t: "Can you get car finance with an IVA?", u: "/guide/can-you-get-car-finance-with-an-iva", img: "https://www.carfinance247.co.uk/dA/2c0b998d730ce34dd0237f222b07a664/asset/Car%20Finance%20with%20an%20IVA.jpg", topic: "credit", updated: "2026-08-31" },
  { t: "Car finance with a CCJ", u: "/guide/car-finance-with-a-ccj", img: "https://www.carfinance247.co.uk/dA/b56a2a808ab9adea33d5cb618f8140d6/asset/Car%20Finance%20With%20a%20CCJ.jpg", topic: "credit", updated: "2026-08-24" }
];

// Canned answers per topic for the mocked responder. Keywords are matched against the query.
window.GUIDE_ANSWERS = [
  { k: ["bad credit","poor credit","default","ccj","iva","credit score","declined","rejected"], topic: "credit",
    a: "Lenders look at more than your score, including affordability and recent missed payments. Defaults, CCJs and IVAs make approval harder but not impossible, and a soft-search eligibility check won't affect your score." },
  { k: ["pcp","hp","hire purchase","leasing","balloon","pay as you go","finance type","difference"], topic: "comparing",
    a: "With PCP you pay lower monthly amounts and choose what to do with the balloon payment at the end. With hire purchase you pay off the whole car and own it at the end. The right one depends on your budget and how long you keep the car." },
  { k: ["settle","settlement","cancel","give back","hand back","vt","terminate","swap","two agreements","stolen","upgrade","trade in","refinance"], topic: "existing",
    a: "If you already have finance you usually have options: settle early, voluntarily terminate, swap or refinance. Your settlement figure is the first number to get from your current lender." },
  { k: ["older","taxi","private sale","cat s","volkswagen","vw","used","which car","vehicle"], topic: "choosing",
    a: "Age, mileage, how the car is bought and what it's used for can all affect which lenders will say yes, so it's worth checking before you commit to a vehicle." },
  { k: ["accepted","eligible","eligibility","benefits","disability","agency","licence","how long","approved","approval","negative equity","apply"], topic: "accepted",
    a: "Acceptance depends on your income, affordability, credit history and residency. You can check your eligibility in minutes without affecting your credit score." }
];

// Fallback photos for guides without their own image: the live site's existing guide photos, grouped by topic.
(() => {
  const B = "https://www.carfinance247.co.uk/dA/";
  const img = {
    licence: B + "467f6e939fa33901c0574b7c74b37222/asset/What%20licence%20needed%20for%20car%20finance.jpg?language_id=1",
    balloon: B + "47996887843a9acce479aceed9beb591/asset/Can%20I%20refinance%20my%20balloon%20payment%20on%20a%20PCP.jpg?language_id=1",
    score: B + "33b74fe5d937df4ebb9b429a2a393e7f/asset/What%20Credit%20Score%20is%20Needed%20for%20Car%20Finance.jpg?language_id=1",
    pcp: B + "ca0de27e4d56671aa76e24d5522d83d4/asset/PCP%20car%20finance%20with%20bad%20credit.jpg?language_id=1",
    swap: B + "4bc1eb4e3400aba2891f658c9184330e/asset/outstanding%20finance%20on%20my%20car.jpg",
    def: B + "7331ce660348aa7b6d1fa05acd211af3/asset/get%20car%20finance%20with%20a%20default.jpg",
    ccj: B + "b56a2a808ab9adea33d5cb618f8140d6/asset/Car%20Finance%20With%20a%20CCJ.jpg",
    iva: B + "2c0b998d730ce34dd0237f222b07a664/asset/Car%20Finance%20with%20an%20IVA.jpg"
  };
  window.TOPIC_IMAGES = {
    accepted: [img.licence, img.pcp, img.score],
    choosing: [img.swap, img.balloon, img.licence],
    comparing: [img.balloon, img.pcp, img.swap],
    existing: [img.swap, img.balloon, img.def],
    credit: [img.score, img.ccj, img.iva, img.def]
  };
})();
