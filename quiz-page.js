(function () {
  var quizData = window.QUIZ_DATA || [];
  var quizGame = document.getElementById("quizGame");
  var quizNext = document.getElementById("quizNext");
  var quizScoreBox = document.getElementById("quizScore");
  var quizScoreValue = document.getElementById("quizScoreValue");
  var quizPlayedValue = document.getElementById("quizPlayedValue");
  var score = 0;
  var played = 0;
  var deck = [];

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
