(() => {
  const KEY = "cf247-guides-design";
  const root = document.documentElement;
  const OPTIONS = [
    { id: "current", label: "Current site" },
    { id: "redesign", label: "Redesign" }
  ];

  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked: the choice just won't persist */ } };

  // ?design=redesign|current overrides (and saves) the stored choice so links can be shared.
  const param = new URLSearchParams(location.search).get("design");
  if (param === "redesign" || param === "current") write(param);
  const initial = param === "redesign" || param === "current" ? param : read();
  root.dataset.design = initial === "redesign" ? "redesign" : "current";

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const wrap = el("div", "cog");
  const btn = el("button", "cog-btn");
  btn.type = "button";
  btn.setAttribute("aria-label", "Page style options");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "cog-panel");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>';

  const panel = el("div", "cog-panel");
  panel.id = "cog-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Page style");
  panel.hidden = true;
  panel.append(el("p", "cog-title", "Page style"));

  const seg = el("div", "cog-seg");
  seg.setAttribute("role", "group");
  seg.setAttribute("aria-label", "Page style");
  const buttons = OPTIONS.map((o) => {
    const b = el("button", "cog-opt", o.label);
    b.type = "button";
    b.dataset.design = o.id;
    b.addEventListener("click", () => apply(o.id));
    seg.appendChild(b);
    return b;
  });
  panel.append(seg, el("p", "cog-note", "Compare today’s styling with the redesign. Your choice is saved in this browser."));
  wrap.append(btn, panel);
  document.body.appendChild(wrap);

  // Redesign copy follows the design system (sentence case, no em dashes); the current site keeps its original wording.
  function swapCopy(mode) {
    document.querySelectorAll("[data-rd-text]").forEach((n) => {
      if (n.dataset.rdOrig === undefined) n.dataset.rdOrig = n.textContent;
      n.textContent = mode === "redesign" ? n.dataset.rdText : n.dataset.rdOrig;
    });
  }

  function apply(id) {
    root.dataset.design = id;
    write(id);
    swapCopy(id);
    // Keep a shared ?design= link in step with the choice, so a reload doesn't flip it back.
    const url = new URL(location.href);
    if (url.searchParams.has("design")) { url.searchParams.set("design", id); history.replaceState(null, "", url); }
    sync();
  }
  function sync() {
    const cur = root.dataset.design;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.design === cur)));
  }
  function setOpen(open) {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  }

  btn.addEventListener("click", () => setOpen(panel.hidden));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); } });
  document.addEventListener("click", (e) => { if (!panel.hidden && !wrap.contains(e.target)) setOpen(false); });
  sync();
  swapCopy(root.dataset.design);

  // Lift the cog above the sticky search dock while it is showing.
  const dock = document.getElementById("ai-dock");
  if (dock) {
    const lift = () => wrap.classList.toggle("cog-lifted", dock.classList.contains("show"));
    new MutationObserver(lift).observe(dock, { attributes: true, attributeFilter: ["class"] });
    lift();
  }
})();
