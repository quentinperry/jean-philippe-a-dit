(function () {
  var state = { query: "", chapter: "all" };
  var store = window.QuoteStore;
  var currentSpotlight = null;

  function $(id) { return document.getElementById(id); }

  function escapeHTML(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function allQuotes() {
    return QUOTES.concat(store.list());
  }

  function normalize(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function chapterById(id) {
    return CHAPTERS.find(function (c) { return c.id === id; }) || { id: id, label: id, short: id, emoji: "" };
  }

  // Highlight works on the raw text, then escapes each part, so accents and
  // HTML entities never shift the match position.
  function highlight(text, q) {
    if (!q) return escapeHTML(text);
    var i = normalize(text).indexOf(normalize(q));
    if (i === -1) return escapeHTML(text);
    return escapeHTML(text.slice(0, i)) + "<mark>" + escapeHTML(text.slice(i, i + q.length)) + "</mark>" +
      escapeHTML(text.slice(i + q.length));
  }

  var ICON_SHARE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
  var ICON_TRASH = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  function cardHTML(q, idx, opts) {
    opts = opts || {};
    var ch = chapterById(q.chapter);
    var src = q.source ? escapeHTML(q.source) : "Source inconnue";
    var query = opts.noHighlight ? "" : state.query.trim();
    var del = q.canDelete && !opts.noActions
      ? '<button class="card-btn card-btn-danger quote-delete" type="button" data-id="' + escapeHTML(q.id) + '" data-local="' + (q.local ? "1" : "0") + '" aria-label="Supprimer cette citation">' + ICON_TRASH + "</button>"
      : "";
    var share = opts.noActions ? "" :
      '<button class="card-btn quote-share" type="button" data-idx="' + idx + '" aria-label="Partager cette citation">' + ICON_SHARE + "</button>";
    return '<figure class="quote-card ch-' + escapeHTML(ch.id) + '">' +
      '<span class="quote-tag"><span aria-hidden="true">' + ch.emoji + "</span> " + escapeHTML(ch.short || ch.label) + "</span>" +
      '<blockquote class="quote-text">' + highlight(q.text, query) + "</blockquote>" +
      '<figcaption class="quote-foot"><span class="quote-source">' + src + "</span>" +
      '<span class="card-actions">' + share + del + "</span></figcaption></figure>";
  }

  var lastFiltered = [];

  function render() {
    var q = normalize(state.query.trim());
    var filtered = allQuotes().filter(function (qt) {
      var okChapter = state.chapter === "all" || qt.chapter === state.chapter;
      var okQuery = !q || normalize(qt.text).includes(q) || normalize(qt.source).includes(q);
      return okChapter && okQuery;
    });
    lastFiltered = filtered;
    $("grid").innerHTML = filtered.map(function (qt, i) { return cardHTML(qt, i); }).join("");
    $("empty").classList.toggle("hidden", filtered.length > 0);
    var label = filtered.length + " citation" + (filtered.length > 1 ? "s" : "");
    if (state.chapter !== "all") label += " · " + chapterById(state.chapter).short;
    if (state.query.trim()) label += " · « " + state.query.trim() + " »";
    $("count").textContent = label;
  }

  function renderChips() {
    var quotes = allQuotes();
    var counts = {};
    quotes.forEach(function (q) { counts[q.chapter] = (counts[q.chapter] || 0) + 1; });
    var html = chipHTML("all", "", "Toutes", quotes.length);
    CHAPTERS.forEach(function (c) { html += chipHTML(c.id, c.emoji, c.short || c.label, counts[c.id] || 0, c.label); });
    $("chapters").innerHTML = html;
    renderHeroStats(quotes);
  }

  function chipHTML(id, emoji, label, count, title) {
    var active = state.chapter === id;
    return '<button type="button" class="chip ch-' + id + (active ? " active" : "") + '" data-ch="' + id + '" aria-pressed="' + active + '"' +
      (title ? ' title="' + escapeHTML(title) + '"' : "") + ">" +
      (emoji ? '<span class="chip-emoji" aria-hidden="true">' + emoji + "</span>" : "") +
      escapeHTML(label) + ' <span class="count">' + count + "</span></button>";
  }

  function renderHeroStats(quotes) {
    var el = $("heroStats");
    if (!el) return;
    var works = {};
    quotes.forEach(function (q) {
      var w = (q.source || "").split(",")[0].trim();
      if (w) works[w] = true;
    });
    el.innerHTML =
      "<span><strong>" + quotes.length + "</strong> citations</span>" +
      "<span><strong>" + CHAPTERS.length + "</strong> chapitres</span>" +
      "<span><strong>" + Object.keys(works).length + "</strong> œuvres</span>";
  }

  $("chapters").addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) return;
    state.chapter = btn.dataset.ch;
    this.querySelectorAll(".chip").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
    btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    render();
    scrollToResults();
  });

  function scrollToResults() {
    var bar = document.querySelector(".filterbar");
    var top = $("count").getBoundingClientRect().top + window.scrollY - bar.offsetHeight - 8;
    if (window.scrollY > top) window.scrollTo({ top: top });
  }

  $("search").addEventListener("input", function (e) {
    state.query = e.target.value;
    render();
  });

  // ── Toast & share ──────────────────────────────────────────────
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function shareQuote(q) {
    if (!q) return;
    var text = "« " + q.text + " » — Jean-Philippe Sarcos" + (q.source ? " (" + q.source + ")" : "");
    if (navigator.share) {
      navigator.share({ text: text, url: location.href.split("#")[0] }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { toast("Citation copiée"); }, function () { toast("Impossible de copier"); });
    }
  }

  // ── Dialogs (bottom sheets on mobile) ──────────────────────────
  function openSheet(d) {
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function closeSheet(d) {
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }

  document.querySelectorAll("dialog.sheet").forEach(function (d) {
    d.addEventListener("click", function (e) {
      if (e.target === d || e.target.closest(".js-close")) closeSheet(d);
    });
  });

  function drawRandom() {
    var quotes = allQuotes();
    var pool = state.chapter === "all" ? quotes : quotes.filter(function (q) { return q.chapter === state.chapter; });
    if (!pool.length) return;
    var q;
    do { q = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && q === currentSpotlight);
    currentSpotlight = q;
    var body = $("spotlightBody");
    body.innerHTML = cardHTML(q, -1, { noActions: true, noHighlight: true });
    body.firstChild.classList.add("is-spotlight");
  }

  document.querySelectorAll(".js-random").forEach(function (b) {
    b.addEventListener("click", function () { drawRandom(); openSheet($("spotlight")); });
  });
  $("spotlightAgain").addEventListener("click", drawRandom);
  $("spotlightShare").addEventListener("click", function () { shareQuote(currentSpotlight); });

  document.querySelectorAll(".js-top").forEach(function (b) {
    b.addEventListener("click", function () {
      var bar = document.querySelector(".filterbar");
      window.scrollTo({ top: bar.offsetTop, behavior: "smooth" });
      $("search").focus({ preventScroll: true });
    });
  });

  // ── Theme toggle ───────────────────────────────────────────────
  document.querySelectorAll(".js-theme").forEach(function (b) {
    b.addEventListener("click", function () {
      var root = document.documentElement;
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("jp-theme", root.dataset.theme); } catch (e) {}
    });
  });

  // ── Add form ───────────────────────────────────────────────────
  function fillChapterSelect() {
    $("newChapter").innerHTML = CHAPTERS.map(function (c) {
      return '<option value="' + c.id + '">' + c.emoji + " " + escapeHTML(c.label) + "</option>";
    }).join("");
  }

  function updateAddNote() {
    var note = $("addNote");
    if (store.shared()) {
      note.textContent = "Elle sera visible par tous les visiteurs du site.";
      note.className = "form-note is-shared";
    } else {
      note.textContent = store.unreachable
        ? "Le recueil partagé est injoignable : la citation sera gardée sur cet appareil et envoyée plus tard."
        : "La citation sera enregistrée uniquement sur cet appareil.";
      note.className = "form-note is-local";
    }
  }

  document.querySelectorAll(".js-add").forEach(function (b) {
    b.addEventListener("click", function () {
      $("addError").classList.add("hidden");
      if (state.chapter !== "all") $("newChapter").value = state.chapter;
      updateAddNote();
      openSheet($("addForm"));
      $("newText").focus();
    });
  });

  $("addFormEl").addEventListener("submit", function (e) {
    e.preventDefault();
    var chapter = $("newChapter").value;
    var text = $("newText").value.trim();
    var work = $("newWork").value.trim();
    var year = $("newYear").value.trim();
    var err = $("addError");
    if (!text) {
      err.textContent = "La citation ne peut pas être vide.";
      err.classList.remove("hidden");
      $("newText").focus();
      return;
    }
    var submit = $("addSubmit");
    submit.disabled = true;
    var shared = store.shared();
    store.add({ chapter: chapter, text: text, work: work, year: year }).then(function () {
      $("newText").value = "";
      $("newWork").value = "";
      $("newYear").value = "";
      closeSheet($("addForm"));
      renderChips();
      render();
      toast(shared ? "Citation ajoutée au recueil partagé" : "Citation enregistrée sur cet appareil");
    }).catch(function (e) {
      err.textContent = e.message || "L'ajout a échoué.";
      err.classList.remove("hidden");
    }).then(function () { submit.disabled = false; });
  });

  // ── Card actions ───────────────────────────────────────────────
  $("grid").addEventListener("click", function (e) {
    var shareBtn = e.target.closest(".quote-share");
    if (shareBtn) { shareQuote(lastFiltered[+shareBtn.dataset.idx]); return; }

    var btn = e.target.closest(".quote-delete");
    if (!btn) return;
    if (!confirm("Supprimer cette citation du recueil ?")) return;
    btn.disabled = true;
    store.remove(btn.dataset.id, btn.dataset.local === "1").then(function () {
      renderChips(); render(); toast("Citation supprimée");
    }).catch(function (e) {
      btn.disabled = false;
      toast(e.message || "Suppression impossible");
    });
  });

  fillChapterSelect();
  renderChips();
  render();
  store.load().then(function () {
    renderChips(); render();
    if (store.migrated) toast(store.migrated + " citation" + (store.migrated > 1 ? "s envoyées" : " envoyée") + " au recueil partagé");
  });
})();
