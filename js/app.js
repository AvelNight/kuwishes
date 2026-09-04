(() => {
  const STATUS_LABEL = {
    dream: "мечта",
    active: "активно",
    done: "сбылось",
  };

  const wishes = Array.isArray(window.WISHES) ? window.WISHES : [];
  const grid = document.getElementById("grid");
  const stats = document.getElementById("stats");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxNote = document.getElementById("lightbox-note");
  const lightboxStatus = document.getElementById("lightbox-status");

  let filter = "all";

  const order = { active: 0, dream: 1, done: 2 };

  function sorted() {
    return [...wishes].sort((a, b) => {
      const oa = order[a.status] ?? 9;
      const ob = order[b.status] ?? 9;
      if (oa !== ob) return oa - ob;
      return String(a.title).localeCompare(String(b.title), "ru");
    });
  }

  function renderStats() {
    const total = wishes.length;
    const active = wishes.filter((w) => w.status === "active").length;
    const done = wishes.filter((w) => w.status === "done").length;
    const dream = wishes.filter((w) => w.status === "dream").length;
    stats.innerHTML = `
      <span class="stat"><strong>${total}</strong> всего</span>
      <span class="stat"><strong>${active}</strong> активных</span>
      <span class="stat"><strong>${dream}</strong> мечтаем</span>
      <span class="stat"><strong>${done}</strong> сбылось</span>
    `;
  }

  function openWish(wish) {
    lightboxImg.src = wish.image;
    lightboxImg.alt = wish.title;
    lightboxTitle.textContent = wish.title;
    lightboxNote.textContent = wish.note || "";
    lightboxStatus.textContent = STATUS_LABEL[wish.status] || wish.status;
    lightboxStatus.dataset.status = wish.status;
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  }

  function renderGrid() {
    const list = sorted();
    grid.replaceChildren();

    list.forEach((wish, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `wish wish--${wish.status}`;
      btn.style.setProperty("--i", String(i));
      btn.dataset.status = wish.status;
      btn.setAttribute("aria-label", `${wish.title}, ${STATUS_LABEL[wish.status] || wish.status}`);

      if (filter !== "all" && wish.status !== filter) {
        btn.classList.add("is-hidden");
      }

      btn.innerHTML = `
        <span class="wish__frame">
          <img class="wish__media" src="${wish.image}" alt="" loading="lazy" />
          <span class="wish__shine" aria-hidden="true"></span>
          ${wish.status === "done" ? '<span class="stamp" aria-hidden="true">✓</span>' : ""}
          <span class="wish__cap">
            <span class="wish__title">${escapeHtml(wish.title)}</span>
            <span class="wish__badge">${STATUS_LABEL[wish.status] || wish.status}</span>
          </span>
        </span>
      `;

      btn.addEventListener("click", () => openWish(wish));
      grid.appendChild(btn);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter || "all";
      document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-on", b === button));
      renderGrid();
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  renderStats();
  renderGrid();
})();
