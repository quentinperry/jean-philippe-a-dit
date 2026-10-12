(function () {
  var state = { query: "", chapter: "all" };

  function normalize(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function chapterById(id) {
    return CHAPTERS.find(function (c) { return c.id === id; }) || { label: id, emoji: "" };
  }

  function highlight(text, q) {
    if (!q) return text;
    var i = normalize(text).indexOf(normalize(q));
    if (i === -1) return text;
    return text.slice(0, i) + "<mark>" + text.slice(i, i + q.length) + "</mark>" + text.slice(i + q.length);
  }

  function cardHTML(q) {
    var ch = chapterById(q.chapter);
    var src = q.source ? "— " + q.source : "— Source inconnue";
    return '<figure class="quote-card"><span class="quote-mark">«</span>' +
      '<blockquote class="quote-text">' + highlight(q.text, state.query.trim()) + "</blockquote>" +
      '<figcaption class="quote-source"><span>' + src + "</span>" +
      '<span class="quote-chapter">' + ch.emoji + " " + ch.label + "</span></figcaption></figure>";
  }

  function render() {
    var q = normalize(state.query.trim());
    var filtered = QUOTES.filter(function (qt) {
      var okChapter = state.chapter === "all" || qt.chapter === state.chapter;
      var okQuery = !q || normalize(qt.text).includes(q) || normalize(qt.source).includes(q);
      return okChapter && okQuery;
    });
    document.getElementById("grid").innerHTML = filtered.map(cardHTML).join("");
    document.getElementById("empty").classList.toggle("hidden", filtered.length > 0);
    document.getElementById("count").textContent =
      filtered.length + " citation" + (filtered.length > 1 ? "s" : "") +
      (state.query.trim() ? " pour « " + state.query.trim() + " »" : "");
  }

  function renderChips() {
    var counts = {};
    QUOTES.forEach(function (q) { counts[q.chapter] = (counts[q.chapter] || 0) + 1; });
    var nav = document.getElementById("chapters");
    var html = '<button class="chip active" data-ch="all">Toutes <span class="count">' + QUOTES.length + "</span></button>";
    CHAPTERS.forEach(function (c) {
      html += '<button class="chip" data-ch="' + c.id + '">' + c.emoji + " " + c.label +
        ' <span class="count">' + (counts[c.id] || 0) + "</span></button>";
    });
    nav.innerHTML = html;
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      state.chapter = btn.dataset.ch;
      nav.querySelectorAll(".chip").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById("spotlight").classList.add("hidden");
      render();
    });
  }

  document.getElementById("search").addEventListener("input", function (e) {
    state.query = e.target.value;
    document.getElementById("spotlight").classList.add("hidden");
    render();
  });

  document.getElementById("randomBtn").addEventListener("click", function () {
    var pool = state.chapter === "all" ? QUOTES : QUOTES.filter(function (q) { return q.chapter === state.chapter; });
    var q = pool[Math.floor(Math.random() * pool.length)];
    var spot = document.getElementById("spotlight");
    spot.classList.remove("hidden");
    spot.innerHTML = cardHTML(q);
  });

  renderChips();
  render();
})();