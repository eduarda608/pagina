const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Tamanho do grid
const tileSize = canvas.width / gridSize;

let snake, direction, food, obstacles, score, highscore, speed, running, wrapMode;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = spawnFood();
  obstacles = [];
  score = 0;
  speed = 6;
  running = false;
  wrapMode = true;
  updateUI();
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
  } while (snake.some(s => s.x === pos.x && s.y === pos.y) || (food.x === pos.x && food.y === pos.y));
  obstacles.push(pos);
}

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("highscore").textContent = highscore;
  document.getElementById("speed").textContent = speed;
}

function gameLoop() {
  if (!running) return;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (wrapMode) {
    head.x = (head.x + gridSize) % gridSize;
    head.y = (head.y + gridSize) % gridSize;
  } else {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return gameOver();
    }
  }

  if (snake.some(seg => seg.x === head.x && seg.y === head.y) ||
      obstacles.some(o => o.x === head.x && o.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("snakeHighscore", highscore);
    }
    if (score % 5 === 0) {
      speed++;
      spawnObstacle();
    }
    food = spawnFood();
  } else {
    snake.pop();
  }

  updateUI();
  draw();
  setTimeout(gameLoop, 1000 / speed);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f43f5e"; // Cor da comida
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  ctx.fillStyle = "#f59e0b"; // Cor dos obstáculos
  obstacles.forEach(o => ctx.fillRect(o.x * tileSize, o.y * tileSize, tileSize, tileSize));

  ctx.fillStyle = "#22d3ee"; // Cor do corpo da cobra
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#38bdf8" : "#22d3ee"; // Cabeça da cobra com cor diferente
    ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
  });
}

function gameOver() {
  running = false;
  document.getElementById("overlay").classList.remove("hidden");
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
    case "w": if (direction.y === 0) direction = { x: 0, y: -1 }; break;
    case "ArrowDown":
    case "s": if (direction.y === 0) direction = { x: 0, y: 1 }; break;
    case "ArrowLeft":
    case "a": if (direction.x === 0) direction = { x: -1, y: 0 }; break;
    case "ArrowRight":
    case "d": if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    case " ": startGame(); break;
    case "p": running = !running; if (running) gameLoop(); break;
    case "r": resetGame(); draw(); break;
    case "m": wrapMode = !wrapMode; break;
  }
});

document.querySelectorAll(".ctrl").forEach(btn =>
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (dir === "up" && direction.y === 0) direction = { x: 0, y: -1 };
    if (dir === "down" && direction.y === 0) direction = { x: 0, y: 1 };
    if (dir === "left" && direction.x === 0) direction = { x: -1, y: 0 };
    if (dir === "right" && direction.x === 0) direction = { x: 1, y: 0 };
  })
);

function startGame() {
  if (!running) {
    running = true;
    document.getElementById("overlay").classList.add("hidden");
    gameLoop();
  }
}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("pauseBtn").onclick = () => { running = !running; if (running) gameLoop(); };
document.getElementById("resetBtn").onclick = () => { resetGame(); draw(); };
document.getElementById("overlayBtn").onclick = startGame;

highscore = parseInt(localStorage.getItem("snakeHighscore")) || 0;
resetGame();
draw();
