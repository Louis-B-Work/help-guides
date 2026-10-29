(() => {
  const SUGGESTIONS = [
    "Can I get car finance with bad credit?",
    "What's the difference between PCP and HP?",
    "How long does car finance approval take?",
    "Can I swap my car while on finance?",
    "What credit score do I need?",
    "Can I get finance on benefits?",
    "What is a settlement figure?",
    "Can I give my car back early?"
  ];
  const ROTATE_MS = 3200;

  /* ---------- Responder (mock). Swap this one function for a real API call. ---------- */
  const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);

  async function answer(query) {
    await new Promise((r) => setTimeout(r, 700));
    const q = query.toLowerCase();
    let best = null, bestScore = 0;
    for (const a of window.GUIDE_ANSWERS) {
      const score = a.k.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
      if (score > bestScore) { best = a; bestScore = score; }
    }
    const qt = tokens(query);
    const guides = window.GUIDES
      .map((g) => {
        const gt = tokens(g.t);
        const overlap = qt.filter((w) => gt.some((x) => x.startsWith(w) || w.startsWith(x))).length;
        return { g, score: overlap * 2 + (best && g.topic === best.topic ? 1 : 0) };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.g);
    return {
      text: best ? best.a : "I couldn't find an exact match. Try rephrasing, or get in touch and our Manchester team will help.",
      guides
    };
  }
  window.CF247_AI = { answer };

  /* ---------- Search bars (hero + dock share one value and one rotation) ---------- */
  const forms = [...document.querySelectorAll("[data-ai-form]")];
  const bars = forms.map((form) => ({
    form,
    input: form.querySelector("[data-ai-input]"),
    ghost: form.querySelector("[data-ai-ghost]"),
    panel: form.querySelector("[data-ai-panel]")
  }));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx = 0, focused = false;

  const showGhost = (text) => {
    bars.forEach((b) => {
      b.ghost.replaceChildren();
      const s = document.createElement("span");
      s.textContent = text;
      b.ghost.appendChild(s);
    });
  };
  const syncGhostVisibility = () =>
    bars.forEach((b) => b.ghost.classList.toggle("hidden-ghost", b.input.value.length > 0));

  function rotate() {
    if (focused || bars.some((b) => b.input.value)) return;
    const next = (idx + 1) % SUGGESTIONS.length;
    const swap = () => { idx = next; showGhost(SUGGESTIONS[idx]); };
    if (reduceMotion) return swap();
    bars.forEach((b) => b.ghost.firstElementChild && b.ghost.firstElementChild.classList.add("out"));
    setTimeout(swap, 340);
  }
  showGhost(SUGGESTIONS[0]);
  setInterval(rotate, ROTATE_MS);

  /* ---------- Panel rendering ---------- */
  function closePanels() { bars.forEach((b) => { b.panel.hidden = true; }); }

  function render(bar, state) {
    const p = bar.panel;
    p.replaceChildren();
    p.hidden = false;
    if (state.loading) {
      const d = document.createElement("div");
      d.className = "ai-dots";
      d.setAttribute("aria-label", "Thinking");
      d.innerHTML = "<span></span><span></span><span></span>";
      p.appendChild(d);
      return;
    }
    const head = document.createElement("div");
    head.className = "flex items-start justify-between gap-3";
    const txt = document.createElement("p");
    txt.className = "text-sm leading-relaxed";
    txt.textContent = state.text;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "shrink-0 text-gray-500 hover:text-dark-1 text-xl leading-none";
    close.setAttribute("aria-label", "Close answer");
    close.textContent = "×";
    close.addEventListener("click", closePanels);
    head.append(txt, close);
    p.appendChild(head);

    if (state.guides.length) {
      const h = document.createElement("p");
      h.className = "mt-4 mb-2 text-xs font-bold uppercase tracking-wide text-primary";
      h.textContent = "Related guides";
      const ul = document.createElement("ul");
      ul.className = "space-y-1";
      state.guides.forEach((g) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = g.u;
        a.textContent = g.t;
        a.className = "block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-tint";
        li.appendChild(a);
        ul.appendChild(li);
      });
      p.append(h, ul);
    }
    const foot = document.createElement("p");
    foot.className = "mt-3 text-xs text-gray-500";
    foot.textContent = "AI-generated guidance, not financial advice. ";
    const a = document.createElement("a");
    a.href = "/guide/am-i-eligible";
    a.className = "text-primary font-semibold hover:underline";
    a.textContent = "Check your eligibility";
    foot.appendChild(a);
    p.appendChild(foot);
  }

  bars.forEach((bar) => {
    bar.input.addEventListener("focus", () => { focused = true; });
    bar.input.addEventListener("blur", () => { focused = false; });
    bar.input.addEventListener("input", () => {
      bars.forEach((b) => { if (b !== bar) b.input.value = bar.input.value; });
      syncGhostVisibility();
    });
    bar.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = bar.input.value.trim() || SUGGESTIONS[idx];
      if (!bar.input.value.trim()) { bars.forEach((b) => { b.input.value = query; }); syncGhostVisibility(); }
      closePanels();
      render(bar, { loading: true });
      try { render(bar, await window.CF247_AI.answer(query)); }
      catch { render(bar, { text: "Sorry, something went wrong. Please try again or get in touch with our team.", guides: [] }); }
    });
    bar.form.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanels(); });
  });

  /* ---------- Sticky dock ---------- */
  const dock = document.getElementById("ai-dock");
  const hero = document.querySelector("#hero-search .ai-field");
  const cta = document.getElementById("help-cta");
  const dockBar = bars.find((b) => dock.contains(b.form));
  let heroGone = false, ctaVisible = false, footerVisible = false;

  function updateDock() {
    const on = heroGone;
    dock.classList.toggle("show", on);
    dock.classList.toggle("over-dark", footerVisible);
    dock.setAttribute("aria-hidden", String(!on));
    dockBar.input.tabIndex = on ? 0 : -1;
    dockBar.form.querySelector("button[type=submit]").tabIndex = on ? 0 : -1;
    if (!on) dockBar.panel.hidden = true;
  }
  new IntersectionObserver(([en]) => {
    heroGone = !en.isIntersecting && en.boundingClientRect.top < 0;
    updateDock();
  }, { threshold: 0 }).observe(hero);
  new IntersectionObserver(([en]) => { ctaVisible = en.isIntersecting; updateDock(); }, { threshold: 0.2 }).observe(cta);
  new IntersectionObserver(([en]) => { footerVisible = en.isIntersecting; updateDock(); }, { threshold: 0, rootMargin: "0px 0px -100px 0px" }).observe(document.querySelector("footer"));

})();
