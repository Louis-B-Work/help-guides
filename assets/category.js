// Paginates the full guide list five at a time. Every guide is already in the HTML; this only hides the ones
// on other pages, so without JavaScript the whole list is still visible and crawlable.
(() => {
  const list = document.getElementById("guide-list");
  const pager = document.getElementById("guide-pager");
  if (!list || !pager) return;

  const items = [...list.querySelectorAll(":scope > li")];
  const size = Number(list.dataset.pageSize) || 5;
  const pages = Math.ceil(items.length / size);
  if (pages < 2) return;
  let page = 0;
  let first = true;

  const btn = (label, text, cls) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = text;
    b.setAttribute("aria-label", label);
    return b;
  };

  function render() {
    items.forEach((li, i) => { li.hidden = Math.floor(i / size) !== page; });
    pager.replaceChildren();

    const prev = btn("Previous 5 guides", "‹ Previous", "pg-btn pg-nav");
    prev.disabled = page === 0;
    prev.addEventListener("click", () => go(page - 1));

    const next = btn("Next 5 guides", "Next ›", "pg-btn pg-nav");
    next.disabled = page === pages - 1;
    next.addEventListener("click", () => go(page + 1));

    const status = document.createElement("span");
    status.className = "pg-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = `Page ${page + 1} of ${pages}`;

    const nums = document.createElement("div");
    nums.className = "pg-nums";
    for (let i = 0; i < pages; i++) {
      const b = btn(`Page ${i + 1}`, String(i + 1), "pg-btn pg-num");
      if (i === page) b.setAttribute("aria-current", "page");
      b.addEventListener("click", () => go(i));
      nums.appendChild(b);
    }
    pager.append(prev, status, nums, next);
  }

  function go(i) {
    page = Math.min(Math.max(i, 0), pages - 1);
    render();
    if (!first) document.getElementById("all-h").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  render();
  first = false;
})();
