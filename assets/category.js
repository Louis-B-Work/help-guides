// Filters the full guide list by topic pill and shows it five at a time. Every guide is already in the HTML; this only
// hides the ones that are filtered out or on another page, so without JavaScript the whole list is still visible and crawlable.
(() => {
  const list = document.getElementById("guide-list");
  const pager = document.getElementById("guide-pager");
  if (!list || !pager) return;

  const all = [...list.querySelectorAll(":scope > li")];
  const pills = [...document.querySelectorAll("#all-guides [data-group]:not(li)")];
  const size = Number(list.dataset.pageSize) || 5;
  const title = document.getElementById("all-h");
  const baseTitle = title.textContent;
  let group = null;
  let page = 0;
  let first = true;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const arrow = (label, text, onClick) => {
    const b = el("button", null, text);
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.addEventListener("click", onClick);
    return b;
  };

  function render() {
    const shown = all.filter((li) => !group || li.dataset.group === group);
    const pages = Math.max(1, Math.ceil(shown.length / size));
    page = Math.min(page, pages - 1);
    all.forEach((li) => { li.hidden = true; });
    shown.forEach((li, i) => { li.hidden = Math.floor(i / size) !== page; });
    title.textContent = group ? `${group} (${shown.length})` : baseTitle;
    pills.forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.group === group)));

    pager.replaceChildren();
    if (pages < 2) return;
    const dots = el("div", "pg-dots");
    for (let i = 0; i < pages; i++) {
      const d = el("button");
      d.type = "button";
      d.setAttribute("aria-label", `Go to page ${i + 1}`);
      if (i === page) d.setAttribute("aria-current", "true");
      d.addEventListener("click", () => go(i));
      dots.appendChild(d);
    }
    const prev = arrow("Previous 5 guides", "‹", () => go(page - 1));
    const next = arrow("Next 5 guides", "›", () => go(page + 1));
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
    const arrows = el("div", "pg-arrows");
    arrows.append(prev, next);
    pager.append(dots, arrows);
  }

  function go(i) {
    page = Math.max(i, 0);
    render();
    if (!first) title.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  // Selecting a pill filters the list; selecting it again clears the filter.
  pills.forEach((p) => p.addEventListener("click", () => { group = group === p.dataset.group ? null : p.dataset.group; page = 0; render(); }));

  render();
  first = false;
})();
