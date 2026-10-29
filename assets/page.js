(() => {
  const CATEGORY = { accepted: "Eligibility", choosing: "Choosing a car", comparing: "Finance types", existing: "Agreements", credit: "Credit" };
  const PAGE_SIZE = 3;
  const DAY = 86400000;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const arrowBtn = (dir, label) => {
    const b = el("button", "w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-tint disabled:opacity-30", dir < 0 ? "‹" : "›");
    b.type = "button";
    b.setAttribute("aria-label", label);
    return b;
  };
  const setDots = (box, count, active, go) => {
    box.replaceChildren();
    for (let i = 0; i < count; i++) {
      const d = el("button", "h-2 rounded-full " + (i === active ? "w-6 bg-[#4b22a8]" : "w-2 bg-gray-300"));
      d.type = "button";
      d.setAttribute("aria-label", "Go to page " + (i + 1));
      if (i === active) d.setAttribute("aria-current", "true");
      d.addEventListener("click", () => go(i));
      box.appendChild(d);
    }
  };

  /* ---------- Recently updated: one swipeable page per 3 guides ---------- */
  const track = document.getElementById("recent-track");
  if (track && window.GUIDES) {
    const ago = (iso) => {
      const d = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY));
      if (d < 1) return "today";
      if (d < 7) return d === 1 ? "1 day ago" : d + " days ago";
      if (d < 30) { const w = Math.floor(d / 7); return w === 1 ? "1 week ago" : w + " weeks ago"; }
      const m = Math.floor(d / 30);
      return m === 1 ? "1 month ago" : m + " months ago";
    };

    // Display-only Title Case for guide titles (the data keeps the live site's wording). Acronyms and existing capitals are kept.
    const SMALL = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "vs", "with"]);
    const titleCase = (t) => {
      const words = t.split(" ");
      return words.map((w, i) => {
        const bare = w.toLowerCase().replace(/[^a-z]/g, "");
        const afterColon = i > 0 && /[:?]$/.test(words[i - 1]);
        const small = SMALL.has(bare) && i > 0 && i < words.length - 1 && !afterColon;
        if (small) return w.toLowerCase();
        return w.replace(/[A-Za-z]/, (c) => c.toUpperCase());
      }).join(" ");
    };

    // Guides without their own photo borrow one from their topic's pool, varied by title so neighbours differ.
    const pickFallback = (g) => {
      const pool = (window.TOPIC_IMAGES || {})[g.topic];
      if (!pool || !pool.length) return null;
      let h = 0;
      for (const c of g.t) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      return pool[h % pool.length];
    };

    const row = (g, last) => {
      const li = el("li", last ? "" : "border-b border-gray-200");
      const a = el("a", "flex items-center gap-4 py-4 hover:bg-tint/60");
      a.href = g.u;
      let thumb;
      const src = g.img || pickFallback(g);
      if (src) {
        thumb = el("img", "w-20 h-16 rounded object-cover shrink-0");
        thumb.src = src;
        thumb.alt = "";
        thumb.loading = "lazy";
      } else {
        thumb = el("span", "w-20 h-16 rounded bg-[#E8E6F5] flex items-center justify-center shrink-0 text-[#8b86c9]", "▤");
        thumb.setAttribute("aria-hidden", "true");
      }
      const body = el("span", "flex-1 min-w-0");
      const title = el("span", "block font-medium text-gray-800", titleCase(g.t));
      if (Date.now() - new Date(g.updated).getTime() < 7 * DAY) {
        title.append(" ", el("span", "new-badge ml-1 align-middle text-xs bg-[#D8F0E3] text-[#1d6b45] px-2 py-0.5 rounded", "New"));
      }
      const meta = el("span", "block text-sm text-gray-500", "Updated " + ago(g.updated) + " · " + (CATEGORY[g.topic] || ""));
      body.append(title, meta);
      a.append(thumb, body, el("span", "text-gray-500 text-xl", "›"));
      li.appendChild(a);
      return li;
    };

    const items = [...window.GUIDES].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 9);
    for (let i = 0; i < items.length; i += PAGE_SIZE) {
      const ul = el("ul", "w-full shrink-0");
      const slice = items.slice(i, i + PAGE_SIZE);
      slice.forEach((g, n) => ul.appendChild(row(g, n === slice.length - 1)));
      track.appendChild(ul);
    }
  }

  /* ---------- Scroll-snap carousels (swipe on touch, dots + arrows) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const t = root.querySelector("[data-track]");
    const controls = root.querySelector("[data-controls]");
    const dots = el("div", "flex gap-2"), arrows = el("div", "flex gap-2");
    const prev = arrowBtn(-1, "Previous"), next = arrowBtn(1, "Next");
    arrows.append(prev, next);
    controls.append(dots, arrows);

    const pages = () => Math.max(1, Math.round(t.scrollWidth / t.clientWidth));
    const current = () => Math.round(t.scrollLeft / t.clientWidth);
    const go = (i) => t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" });
    const update = () => {
      const n = pages(), c = Math.min(current(), n - 1);
      setDots(dots, n, c, go);
      prev.disabled = c <= 0;
      next.disabled = c >= n - 1;
      controls.hidden = n <= 1;
    };
    prev.addEventListener("click", () => go(current() - 1));
    next.addEventListener("click", () => go(current() + 1));
    t.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    addEventListener("resize", update);
    update();
  });
})();
