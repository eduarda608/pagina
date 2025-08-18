const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const gameOverDiv = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const rankingList = document.getElementById("ranking-list");

const goodEmojis = ["😎", "🤑", "🎉", "💖", "🍀"];
const badEmojis = ["💣", "👻", "😡"];

let score = 0;
let timeLeft = 30;
let emojiInterval;
let timerInterval;

function getRandomEmoji() {
  const all = [...goodEmojis, ...badEmojis];
  return all[Math.floor(Math.random() * all.length)];
}

function spawnEmoji() {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.textContent = getRandomEmoji();

  const left = Math.random() * (gameArea.clientWidth - 40);
  emoji.style.left = `${left}px`;
  emoji.style.top = `0px`;
  emoji.style.animationDuration = `${2 + Math.random() * 2}s`;

  emoji.addEventListener("click", () => {
    if (goodEmojis.includes(emoji.textContent)) {
      score += 10;
    } else {
      score -= 5;
    }
    scoreDisplay.textContent = `Pontos: ${score}`;
    emoji.remove();
  });

  gameArea.appendChild(emoji);

  setTimeout(() => {
    if (emoji.parentElement) {
      emoji.remove();
    }
  }, 4000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = "Pontos: 0";
  timerDisplay.textContent = "Tempo: 30s";
  gameOverDiv.classList.add("hidden");
  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  gameArea.innerHTML = "";

  emojiInterval = setInterval(spawnEmoji, 1000);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(emojiInterval);
  clearInterval(timerInterval);
  gameOverDiv.classList.remove("hidden");
  finalScore.textContent = `Sua pontuação: ${score}`;
  saveScore(score);
}

function restartGame() {
  startGame();
}

function saveScore(newScore) {
  let scores = JSON.parse(localStorage.getItem("emojiRanking")) || [];
  scores.push(newScore);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("emojiRanking", JSON.stringify(scores));
  updateRanking();
}

function updateRanking() {
  const scores = JSON.parse(localStorage.getItem("emojiRanking")) || [];
  rankingList.innerHTML = "";
  scores.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}º - ${s} pontos`;
    rankingList.appendChild(li);
  });
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
window.addEventListener("load", updateRanking);
