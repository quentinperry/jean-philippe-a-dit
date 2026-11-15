(function () {
  var quizData = window.QUIZ_DATA || [];
  var quizGame = document.getElementById("quizGame");
  var quizNext = document.getElementById("quizNext");
  var quizFeedback = document.getElementById("quizFeedback");
  var quizScoreValue = document.getElementById("quizScoreValue");
  var quizPlayedValue = document.getElementById("quizPlayedValue");
  var score = 0;
  var played = 0;
  var streak = 0;
  var deck = [];
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  var CHEERS = ["Bravo, vous avez l'oreille absolue.", "Exact ! Pas de poulet chez vous.", "Juste, et dans le temps.", "Bien vu, on garde la couleur verte."];
  var JEERS = ["Raté… vous chantez comme Donald Trump.", "Imposture ! On travaille comme des écrevisses.", "Faux. Vous me faites radoter.", "Perdu — l'enthousiasme d'une vache qui regarde passer le train."];

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function nextQuizItem() {
    if (!quizData.length) return null;
    if (!deck.length) deck = shuffle(quizData);
    return deck.pop();
  }

  function renderQuiz() {
    var item = nextQuizItem();
    if (!item) return;
    var options = shuffle([{ text: item.real, real: true }].concat(
      item.fakes.map(function (f) { return { text: f, real: false }; })
    ));
    var answered = false;

    quizFeedback.className = "quiz-feedback hidden";
    quizNext.disabled = true;

    var list = document.createElement("div");
    list.className = "quiz-options";
    options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.dataset.real = opt.real ? "1" : "0";

      var letter = document.createElement("span");
      letter.className = "quiz-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = LETTERS[i];
      var txt = document.createElement("span");
      txt.className = "quiz-option-text";
      txt.textContent = "«\u00a0" + opt.text + "\u00a0»";
      var verdict = document.createElement("span");
      verdict.className = "quiz-verdict";
      btn.append(letter, txt, verdict);

      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        played++;
        list.classList.add("answered");
        btn.classList.add("picked");
        list.querySelectorAll(".quiz-option").forEach(function (b) {
          var real = b.dataset.real === "1";
          b.classList.add(real ? "correct" : "fake");
          b.querySelector(".quiz-verdict").textContent = real ? "Authentique" : "Imposture";
          b.setAttribute("aria-disabled", "true");
        });
        if (opt.real) {
          score++; streak++;
          quizFeedback.textContent = pick(CHEERS) + (streak > 1 ? " Série de " + streak + " !" : "");
          quizFeedback.className = "quiz-feedback is-ok";
        } else {
          streak = 0;
          btn.classList.add("wrong");
          quizFeedback.textContent = pick(JEERS);
          quizFeedback.className = "quiz-feedback is-bad";
        }
        quizScoreValue.textContent = score;
        quizPlayedValue.textContent = played;
        quizNext.disabled = false;
        quizNext.focus({ preventScroll: true });
      });
      list.appendChild(btn);
    });

    quizGame.replaceChildren(list);
  }

  quizNext.addEventListener("click", function () {
    renderQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".js-theme").forEach(function (b) {
    b.addEventListener("click", function () {
      var root = document.documentElement;
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("jp-theme", root.dataset.theme); } catch (e) {}
    });
  });

  renderQuiz();
})();
