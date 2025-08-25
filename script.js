(function() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const box = 20;
  const cols = canvas.width / box;
  const rows = canvas.height / box;

  let snake = [];
  let direction = null;
  let food = {};
  let score = 0;
  let gameInterval = null;
  let speed = 200;

  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const gameOverMessage = document.getElementById('gameOverMessage');

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
    gameOverMessage.style.display = 'none';
    placeFood();
  }

  function placeFood() {
    food.x = Math.floor(Math.random() * cols) * box;
    food.y = Math.floor(Math.random() * rows) * box;
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      food.x = Math.floor(Math.random() * cols) * box;
      food.y = Math.floor(Math.random() * rows) * box;
    }
  }

  function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00FF00' : '#006400';
      ctx.strokeStyle = '#003300';
      ctx.lineWidth = 2;
      ctx.fillRect(segment.x, segment.y, box, box);
      ctx.strokeRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, box, box);

    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x -= box;
    else if (direction === 'RIGHT') head.x += box;
    else if (direction === 'UP') head.y -= box;
    else if (direction === 'DOWN') head.y += box;

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= canv
