(function () {
  var state = { query: "", chapter: "all" };
  var CUSTOM_KEY = "jp-adit-custom-quotes";
  var remoteQuotes = [];
  var apiAvailable = false;

  function loadCustom() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCustom(list) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  }

  function escapeHTML(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function localList() {
    return loadCustom().map(function (c) {
      return { chapter: c.chapter, text: c.text, source: c.source, custom: true, id: c.id, local: true };
    });
  }

  function remoteList() {
    return remoteQuotes.map(function (c) {
      return { chapter: c.chapter, text: c.text, source: c.source, custom: true, id: c.id };
    });
  }

  function allQuotes() {
    return QUOTES.concat(remoteList(), localList());
  }

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
    var src = q.source ? escapeHTML(q.source) : "Source inconnue";
    var del = q.custom ? '<button class="quote-delete" data-id="' + q.id + '" data-local="' + (q.local ? "1" : "0") + '" title="Supprimer cette citation">✕</button>' : "";
    return '<figure class="quote-card"><span class="quote-mark">«</span>' + del +
      '<blockquote class="quote-text">' + highlight(escapeHTML(q.text), state.query.trim()) + "</blockquote>" +
      '<figcaption class="quote-source"><span>' + src + "</span>" +
      '<span class="quote-chapter">' + ch.emoji + " " + escapeHTML(ch.label) + "</span></figcaption></figure>";
  }

  function render() {
    var q = normalize(state.query.trim());
    var quotes = allQuotes();
    var filtered = quotes.filter(function (qt) {
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
    var quotes = allQuotes();
    var counts = {};
    quotes.forEach(function (q) { counts[q.chapter] = (counts[q.chapter] || 0) + 1; });
    var nav = document.getElementById("chapters");
    var html = '<button class="chip' + (state.chapter === "all" ? " active" : "") + '" data-ch="all">Toutes <span class="count">' + quotes.length + "</span></button>";
    CHAPTERS.forEach(function (c) {
      html += '<button class="chip' + (state.chapter === c.id ? " active" : "") + '" data-ch="' + c.id + '">' + c.emoji + " " + c.label +
        ' <span class="count">' + (counts[c.id] || 0) + "</span></button>";
    });
    nav.innerHTML = html;
  }

  function bindChips() {
    var nav = document.getElementById("chapters");
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
    var quotes = allQuotes();
    var pool = state.chapter === "all" ? quotes : quotes.filter(function (q) { return q.chapter === state.chapter; });
    var q = pool[Math.floor(Math.random() * pool.length)];
    if (!q) return;
    var spot = document.getElementById("spotlight");
    spot.classList.remove("hidden");
    spot.innerHTML = cardHTML(q);
  });

  function fillChapterSelect() {
    var sel = document.getElementById("newChapter");
    sel.innerHTML = CHAPTERS.map(function (c) {
      return '<option value="' + c.id + '">' + c.emoji + " " + c.label + "</option>";
    }).join("");
  }

  function buildSource(work, year) {
    var parts = [];
    if (work) parts.push(work.trim());
    if (year) parts.push(year.trim());
    return parts.join(", ");
  }

  function fetchRemote() {
    return fetch("/api/quotes").then(function (r) {
      if (!r.ok) throw new Error("api");
      return r.json();
    }).then(function (list) {
      remoteQuotes = Array.isArray(list) ? list : [];
      apiAvailable = true;
    }).catch(function () {
      apiAvailable = false;
    });
  }

  document.getElementById("addBtn").addEventListener("click", function () {
    var form = document.getElementById("addForm");
    form.classList.remove("hidden");
    document.getElementById("addError").classList.add("hidden");
    document.getElementById("newText").focus();
  });

  document.getElementById("addCancel").addEventListener("click", function () {
    document.getElementById("addForm").classList.add("hidden");
  });

  document.getElementById("addSubmit").addEventListener("click", function () {
    var chapter = document.getElementById("newChapter").value;
    var text = document.getElementById("newText").value.trim();
    var work = document.getElementById("newWork").value.trim();
    var year = document.getElementById("newYear").value.trim();
    var err = document.getElementById("addError");
    if (!text) {
      err.textContent = "La citation ne peut pas être vide.";
      err.classList.remove("hidden");
      return;
    }
    var done = function () {
      document.getElementById("newText").value = "";
      document.getElementById("newWork").value = "";
      document.getElementById("newYear").value = "";
      document.getElementById("addForm").classList.add("hidden");
      renderChips();
      render();
    };
    if (apiAvailable) {
      fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: chapter, text: text, work: work, year: year })
      }).then(function (r) {
        if (!r.ok) return r.json().then(function (b) { throw new Error(b.error || "Erreur serveur"); });
        return fetchRemote();
      }).then(done).catch(function (e) {
        err.textContent = e.message;
        err.classList.remove("hidden");
      });
    } else {
      var list = loadCustom();
      list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), chapter: chapter, text: text, source: buildSource(work, year) });
      saveCustom(list);
      done();
    }
  });

  document.getElementById("grid").addEventListener("click", function (e) {
    var btn = e.target.closest(".quote-delete");
    if (!btn) return;
    var finish = function () { renderChips(); render(); };
    if (btn.dataset.local === "1" || !apiAvailable) {
      saveCustom(loadCustom().filter(function (c) { return c.id !== btn.dataset.id; }));
      finish();
    } else {
      fetch("/api/quotes/" + encodeURIComponent(btn.dataset.id), { method: "DELETE" })
        .then(fetchRemote)
        .then(finish)
        .catch(function () {});
    }
  });

  fillChapterSelect();
  bindChips();
  render();
  fetchRemote().then(function () { renderChips(); render(); });

  // Quiz « Jean-Philippe a-t-il dit ça ? »
  var quizData = window.QUIZ_DATA || [];
  var quizGame = document.getElementById("quizGame");
  var quizNext = document.getElementById("quizNext");
  var quizScoreBox = document.getElementById("quizScore");
  var quizScoreValue = document.getElementById("quizScoreValue");
  var quizPlayedValue = document.getElementById("quizPlayedValue");
  var score = 0;
  var played = 0;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderQuiz() {
    if (!quizData.length) return;
    var item = quizData[Math.floor(Math.random() * quizData.length)];
    var options = shuffle([{ text: item.real, real: true }].concat(
      item.fakes.map(function (f) { return { text: f, real: false }; })
    ));
    var answered = false;

    var list = document.createElement("div");
    list.className = "quiz-options";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        played++;
        if (opt.real) {
          score++;
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
          list.querySelectorAll(".quiz-option").forEach(function (b) {
            if (b.textContent === item.real) b.classList.add("correct");
          });
        }
        quizScoreBox.classList.remove("hidden");
        quizScoreValue.textContent = score;
        quizPlayedValue.textContent = played;
        quizNext.classList.remove("hidden");
      });
      list.appendChild(btn);
    });

    quizGame.replaceChildren(list);
  }

  quizNext.addEventListener("click", function () {
    quizNext.classList.add("hidden");
    renderQuiz();
  });

  renderQuiz();
})();
