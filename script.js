const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let score = 0;

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box
};

let direction = '';

document.addEventListener('keydown', directionHandler);

function directionHandler(event) {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a cobra
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#00796b' : '#26a69a';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Desenha a comida
  ctx.fillStyle = '#e91e63';
  ctx.fillRect(food.x, food.y, box, box);

  // Movimento da cobra
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  // Verifica se comeu a comida
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Verifica colisões
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert('💀 Fim de jogo! Pontuação: ' + score);
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

let game = setInterval(draw, 100);
