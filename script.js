const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const width = canvas.width;
const height = canvas.height;

let snake = [];
let direction = null;
let food = {};
let score = 0;
let gameInterval = null;
let speed = 200;

const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverMsg = document.getElementById('gameOverMsg');

function resetGame() {
  snake = [
    { x: 5 * box, y: 5 * box },
    { x: 4 * box, y: 5 * box },
    { x: 3 * box, y: 5 * box }
  ];
  direction = 'RIGHT';
  score = 0;
  speed = 200;
  scoreDisplay.textContent = 'Pontuação: ' + score;
  gameOverMsg.style.display = 'none';
  placeFood();
}

function placeFood() {
  food.x = Math.floor(Math.random() * (width / box)) * box;
  food.y = Math.floor(Math.random() * (height / box)) * box;

  while (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
    food.x = Math.floor(Math.random() * (width / box)) * box;
    food.y = Math.floor(Math.random() * (height / box)) * box;
  }
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'lime' : 'green';
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 2;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  else if (direction === 'RIGHT') headX += box;
  else if (direction === 'UP') headY -= box;
  else if (direction === 'DOWN') headY += box;

  if (
    headX < 0 || headX >= width ||
    headY < 0 || headY >= height
  ) {
    endGame();
    return;
  }

  if (snake.some(seg => seg.x === headX && seg.y === headY)) {
    endGame();
    return;
  }

  snake.unshift({ x: headX, y: headY });

  if (headX === food.x && headY === food.y) {
    score++;
    scoreDisplay.textContent = 'Pontuação: ' + score;
    placeFood();

    if (score % 5 === 0 && speed > 50) {
      speed -= 20;
      clearInterval(gameInterval);
      gameInterval = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }
}

function changeDirection(e) {
  const key = e.key;
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  gameOverMsg.style.display = 'block';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';
  document.removeEventListener('keydown', changeDirection);
}

startBtn.addEventListener('click', () => {
  resetGame();
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  document.addEventListener('keydown', changeDirection);
  gameInterval = setInterval(draw, speed);
});

restartBtn.addEventListener('click', () => {
  resetGame();
  restartBtn.style.display = 'none';
  gameOverMsg.style.display = 'none';
  document.addEventListener('keydown', changeDirection);
  gameInterval = setInterval(draw, speed);
});
