const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const speedEl = document.getElementById("velocidade");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const gridSize = 20;
const cellSize = canvas.width / gridSize;

deixe cobra, direção, comida, obstáculos, pontuação, recorde, velocidade, corrida, wrapMode;

função reset() {
cobra = [{ x: 10, y: 10 }];
for (let i = 1; i < 5; i++) snake.push({ x: 10 - i, y: 10 });
direção = "direita";
escore = 0;
velocidade = 6;
comida = spawnFood();
obstáculos = [];
running = verdadeiro;
wrapMode = true;
scoreEl.textContent = pontuação;
speedEl.textContent = "1";
overlay.classList.add("oculto");
}

function spawnFood() {
deixe pos;
do {
pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
} while (snake.some(s => s.x === pos.x && s.y === pos.y) || obstacles.some(o => o.x === pos.x && o.y === pos.y));
retornar pos;
}

function spawnObstacle() {
deixe pos;
do {
pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
} while (snake.some(s) => s.x === pos.x && s.y === pos.y) || (comida && comida.x === pos.x && comida.y === pos.y));
obstáculos.push(pos);
}

function drawCell(x, y, cor) {
ctx.fillStyle = cor;
ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
}

function gameOver() {
running = false;
overlay.classList.remove("oculto");
overlayTitle.textContent = "Fim do jogo";
overlayText.textContent = "Pressione R para reiniciar";
}

função update() {
if (!running) retornar;

const cabeça = { ... cobra[0] };
se (direção === "para cima") cabeça.y--;
if (direção === "para baixo") cabeça.y++;
if (direção === "esquerda") cabeça.x--;
if (direção === "direita") cabeça.x++;

if (wrapMode) {
if (head.x < 0) head.x = gridSize - 1;
if (head.x >= gridSize) head.x = 0;
if (head.y < 0) head.y = gridSize - 1;
if (head.y >= gridSize) head.y = 0;
} else {
if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
gameOver();
retornar;
}
}

if (snake.some(s) => s.x === head.x && s.y === head.y) ||
obstacles.some(o => o.x === head.x && o.y === head.y)) {
gameOver();
retornar;
}

cobra.unshift(cabeça);

if (cabeça.x === comida.x && cabeça.y === comida.y) {
pontuação++;
scoreEl.textContent = pontuação;
comida = spawnFood();
if (pontuação % 5 === 0) {
velocidade += 2;
speedEl.textContent = (speed / 6).toFixed(1) + "x";
spawnObstacle();
}
if (pontuação > recorde) {
pontuação alta = pontuação;
localStorage.setItem("snakeHighscore", highscore);
highscoreEl.textContent = highscore;
}
} else {
cobra.pop();
}
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? "var(--snake-head)" : "var(--snake)"));
drawCell(alimento.x, alimento.y, "var(--alimento)");
obstacles.forEach(o => drawCell(o.x, o.y, "var(--obstacle)"));
}

função loop() {
if (em execução) {
update();
draw();
}
setTimeout(() => requestAnimationFrame(loop), 1000 / velocidade);
}

function start() {
loop();
}

📌 Controles do teclado
document.addEventListener("keydown", e => {
if (e.key === "Seta para cima" || e.key.toLowerCase() === "w") if (direção !== "para baixo") direção = "para cima";
if (e.key === "SetaDown" || e.key.toLowerCase() === "s") if (direção !== "para cima") direção = "para baixo";
if (e.key === "SetaEsquerda" || e.key.toLowerCase() === "a") if (direção !== "direita") direção = "esquerda";
if (e.key === "SetaDireita" || e.key.toLowerCase() === "d") if (direção !== "esquerda") direção = "direita";

if (e.key === " " || e.code === "Espaço") {
if (!running) { reset(); start(); }
else { running = !running; overlay.classList.toggle("hidden"); }
}

if (e.key.toLowerCase() === "r") { reset(); start(); }
if (e.key.toLowerCase() === "m") { wrapMode = !wrapMode; }
if (e.key.toLowerCase() === "p") { running = !running; overlay.classList.toggle("hidden"); }
});

📌 Cheques móveis
document.querySelectorAll(".ctrl").forEach(btn => {
btn.addEventListener("clique", () => {
const dir = btn.dataset.dir;
if (dir === "up" && direction !== "down") direction = "up";
if (dir === "down" && direction !== "up") direction = "down";
if (dir === "left" && direction !== "right") direction = "left";
if (dir === "right" && direction !== "left") direction = "right";
});
});

// 📌 Botões da UI
document.getElementById("startBtn").addEventListener("clique", () => {
if (!running) {
reset();
início();
}
});

document.getElementById("resetBtn").addEventListener("clique", () => {
reset();
início();
});

// 📌 Inicialização
highscore = parseInt(localStorage.getItem("snakeHighscore")) || 0;
highscoreEl.textContent = highscore;
reset();
draw();
