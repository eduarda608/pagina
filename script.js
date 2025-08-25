const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = canvas.width / box;
let snake = [];
let direction = 'RIGHT';
let food;
let gameLoop;
let score = 0;
let speed = 200;

const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

const mobileControls = document.getElementById('mobileControls');
const gameOverModal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Sons
const eatSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const gameOverSound = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');

startBtn.addEventListener('click', () => {
  startBtn.classList.add('hidden');
  mobileControls.classList.remove('hidden');
  startGame();
});

restartBtn.addEventListener('click', () => {
  gameOverModal.classList.add('hidden');
  mobileControls.classList.remove('hidden');
  startGame();
});

mobileControls.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const dir = button.getAttribute('data-dir');
    changeDirection(dir);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') changeDirection('UP');
  if (e.key === 'ArrowDown') changeDirection('DOWN');
  if (e.key === 'ArrowLeft') changeDirection('LEFT');
  if (e.key === 'ArrowRight') changeDirection('RIGHT');
});

function changeDirection(newDir) {
  if (newDir === 'UP' && direction !== 'DOWN') direction = 'UP';
  else if (newDir === 'DOWN' && direction !== 'UP') direction = 'DOWN';
  else if (newDir === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
  else if (newDir === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
}

function startGame() {
  snake = [
    { x: 5 * box, y: 5 * box },
    { x: 4 * box, y: 5 * box },
    { x: 3 * box, y: 5 * box }
  ];
  direction = 'RIGHT';
  score = 0;
  speed = 200;
  scoreDisplay.textContent = score;
  placeFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, speed);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * rows) * box,
    y: Math.floor(Math.random() * rows) * box
  };
  while (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
    food.x = Math.floor(Math.random() * rows) * box;
    food.y = Math.floor(Math.random() * rows) * box;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? '#0f0' : '#080';
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    eatSound.play();

    placeFood();

    if (score % 5 === 0 && speed > 50) {
      speed -= 20;
      clearInterval(gameLoop);
      gameLoop = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }
}

function endGame() {
  clearInterval(gameLoop);
  gameOverSound.play();
  finalScore.textContent = score;
  gameOverModal.classList.remove('hidden');
  mobileControls.classList.add('hidden');
  startBtn.classList.remove('hidden');
}
