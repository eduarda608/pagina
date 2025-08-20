const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

// Estado do jogo
let player = { x: 50, y: 300, w: 40, h: 40, vy: 0, jumping: false, score: 0 };
let coins = [];
let enemies = [];
let gravity = 1.2;
let gameOver = false;
let startTime, elapsedTime;
let playerName = "";

// Gerar moedas
function createCoins() {
  coins = [];
  for (let i = 0; i < 10; i++) {
    coins.push({ x: 150 + i * 60, y: 300, w: 20, h: 20, collected: false });
  }
}

// Gerar inimigos
function createEnemies() {
  enemies = [{ x: 400, y: 300, w: 40, h: 40, dir: -2 }];
}

// Controles
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" && !player.jumping) {
    player.vy = -15;
    player.jumping = true;
  }
  if (e.code === "ArrowRight") {
    player.x += 5;
  }
  if (e.code === "ArrowLeft") {
    player.x -= 5;
  }
});

function startGame() {
  playerName = playerNameInput.value || "Jogador";
  player.x = 50;
  player.y = 300;
  player.vy = 0;
  player.jumping = false;
  player.score = 0;
  gameOver = false;
  createCoins();
  createEnemies();
  startTime = Date.now();
  menu.style.display = "none";
  canvas.style.display = "block";
  gameLoop();
}

function endGame() {
  gameOver = true;
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  saveRanking(playerName, player.score, elapsedTime);
  showRanking();
  menu.style.display = "block";
  canvas.style.display = "none";
}

function saveRanking(name, score, time) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ name, score, time });
  ranking.sort((a, b) => b.score - a.score || a.time - b.time);
  ranking = ranking.slice(0, 5); // top 5
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function showRanking() {
  rankingList.innerHTML = "";
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} - Pontos: ${r.score}, Tempo: ${r.time}s`;
    rankingList.appendChild(li);
  });
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  player.vy += gravity;
  player.y += player.vy;
  if (player.y + player.h >= 340) {
    player.y = 340 - player.h;
    player.vy = 0;
    player.jumping = false;
  }

  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Coins
  ctx.fillStyle = "gold";
  coins.forEach(c => {
    if (!c.collected) {
      ctx.fillRect(c.x, c.y, c.w, c.h);
      if (player.x < c.x + c.w &&
          player.x + player.w > c.x &&
          player.y < c.y + c.h &&
          player.y + player.h > c.y) {
        c.collected = true;
        player.score += 10;
      }
    }
  });

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    e.x += e.dir;
    if (e.x <= 0 || e.x + e.w >= canvas.width) e.dir *= -1;
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // colisão
    if (player.x < e.x + e.w &&
        player.x + player.w > e.x &&
        player.y < e.y + e.h &&
        player.y + player.h > e.y) {
      endGame();
    }
  });

  // HUD
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + player.score, 20, 30);
  let currentTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.fillText("Tempo: " + currentTime + "s", 20, 60);

  // Vitória
  if (coins.every(c => c.collected)) {
    endGame();
  }

  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);
showRanking();
