function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? '#00FF00' : '#006400';  // Cabeça mais clara
    ctx.strokeStyle = '#003300';                      // Bordas escuras
    ctx.lineWidth = 2;
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(food.x, food.y, box, box);

  // Movimento da cabeça
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Verifica colisão
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Se comer comida, aumenta e gera nova comida
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
    snake.pop();  // Remove último segmento (movimento)
  }
}
