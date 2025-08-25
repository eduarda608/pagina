const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = canvas.width / box;
let snake = [];
let direction = 'RIGHT';
let food;
let gameLoop;
let score = 0;

const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

startBtn.addEventListener('click', startGame);

function startGame() {
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = 'RIGHT';
  score = 0;
  scoreDisplay.textContent = score;
  placeFood();
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(draw, 150);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * rows) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a cobrinha
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? '#0f0' : '#080';
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Desenha a comida
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, box, box);

  // Movimento
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Colisão com parede
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(gameLoop);
    alert('💀 Game Over! Pontuação: ' + score);
    return;
  }

  snake.unshift(head);

  // Comer
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}
