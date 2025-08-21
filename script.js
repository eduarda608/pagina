const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const speedEl = document.getElementById("speed");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const gridSize = 20;
const cellSize = canvas.width / gridSize;

let snake, direction, food, obstacles, score, highscore, speed, running, wrapMode;

function reset() {
  snake = [{ x: 10, y: 10 }];
  for (let i = 1; i < 5; i++) snake.push({ x: 10 - i, y: 10 });
  direction = "right";
  score = 0;
  speed = 6;
  food = spawnFood();
  obstacles = [];
  running = true;
  wrapMode = true;
  scoreEl.textContent = score;
  speedEl.textContent = "1";
  overlay.classList.add("hidden");
}

function spawnFood() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y) || obstacles.some(o => o.x === pos.x && o.y === pos.y));
  return pos;
}

function spawnObstacle() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y) || (food && food.x === pos.x && food.y === pos.y));
  obstacles.push(pos);
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
}

function gameOver() {
  running = false;
  overlay.classList.remove("hidden");
  overlayTitle.textContent = "Game Over";
  overlayText.textContent = "Pressione R para reiniciar";
}

function update() {
  if (!running) return;

  const head = { ...snake[0] };
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  if (wrapMode) {
    if (head.x < 0) head.x = gridSize - 1;
    if (head.x >= gridSize) head.x = 0;
    if (head.y < 0) head.y = gridSize - 1;
    if (head.y >= gridSize) head.y = 0;
  } else {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      gameOver();
      return;
    }
  }

  if (snake.some(s => s.x === head.x && s.y === head.y) ||
      obstacles.some(o => o.x === head.x && o.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
    if (score % 5 === 0) {
      speed += 2;
      speedEl.textContent = (speed / 6).toFixed(1) + "x";
      spawnObstacle();
    }
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("snakeHighscore", highscore);
      highscoreEl.textContent = highscore;
    }
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? "var(--snake-head)" : "var(--snake)"));
  drawCell(food.x, food.y, "var(--food)");
  obstacles.forEach(o => drawCell(o.x, o.y, "var(--obstacle)"));
}

function loop() {
  if (running) {
    update();
    draw();
  }
  setTimeout(() => requestAnimationFrame(loop), 1000 / speed);
}

function start() {
  loop();
}

// 📌 Controles teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") if (direction !== "down") direction = "up";
  if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") if (direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") if (direction !== "right") direction = "left";
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") if (direction !== "left") direction = "right";

  if (e.key === " " || e.code === "Space") {
    if (!running) { reset(); start(); }
    else { running = !running; overlay.classList.toggle("hidden"); }
  }

  if (e.key.toLowerCase() === "r") { reset(); start(); }
  if (e.key.toLowerCase() === "m") { wrapMode = !wrapMode; }
  if (e.key.toLowerCase() === "p") { running = !running; overlay.classList.toggle("hidden"); }
});

// 📌 Controles móveis
document.querySelectorAll(".ctrl").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (dir === "up" && direction !== "down") direction = "up";
    if (dir === "down" && direction !== "up") direction = "down";
    if (dir === "left" && direction !== "right") direction = "left";
    if (dir === "right" && direction !== "left") direction = "right";
  });
});

// 📌 Botões da UI
document.getElementById("startBtn").addEventListener("click", () => {
  if (!running) {
    reset();
    start();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  reset();
  start();
});

// 📌 Inicialização
highscore = parseInt(localStorage.getItem("snakeHighscore")) || 0;
highscoreEl.textContent = highscore;
reset();
draw();
