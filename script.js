const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const gameOverDiv = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const rankingList = document.getElementById("ranking-list");

let score = 0;
let timeLeft = 30;
let timerInterval;
let gameRunning = false;

function getRandomPosition() {
  const x = Math.random() * (gameArea.clientWidth - 50);
  const y = Math.random() * (gameArea.clientHeight - 50);
  return { x, y };
}

function spawnCircle() {
  if (!gameRunning) return;

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const { x, y } = getRandomPosition();
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  circle.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = `Pontos: ${score}`;
    gameArea.removeChild(circle);
    spawnCircle(); // próximo
  });

  gameArea.appendChild(circle);

  setTimeout(() => {
    if (gameArea.contains(circle)) {
      gameArea.removeChild(circle);
      spawnCircle();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameRunning = true;
  scoreDisplay.textContent = "Pontos: 0";
  timerDisplay.textContent = "Tempo: 30s";
  gameArea.innerHTML = "";
  gameOverDiv.classList.add("hidden");
  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  spawnCircle();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  gameArea.innerHTML = "";
  gameOverDiv.classList.remove("hidden");
  finalScore.textContent = `Você fez ${score} pontos!`;
  updateRanking(score);
}

function restartGame() {
  startGame();
}

function updateRanking(newScore) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push(newScore);
  ranking.sort((a, b) => b - a);
  ranking = ranking.slice(0, 5); // top 5
  localStorage.setItem("ranking", JSON.stringify(ranking));
  showRanking();
}

function showRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  rankingList.innerHTML = "";
  ranking.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `${score} pontos`;
    rankingList.appendChild(li);
  });
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
window.addEventListener("load", showRanking);
