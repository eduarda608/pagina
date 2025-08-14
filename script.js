const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const flapSound = document.getElementById("flapSound");
const hitSound = document.getElementById("hitSound");

const scoreEl = document.getElementById("score");
const highEl = document.getElementById("high");

let bird, gravity, velocity, jump, pipes, score, highScore, gameOver, frame, wingUp;

highScore = Number(localStorage.getItem("flappyHigh")) || 0;
highEl.textContent = highScore;

function resetGame() {
  bird = { x: 60, y: canvas.height / 2, size: 18 };
  gravity = 0.5;
  velocity = 0;
  jump = -8;
  pipes = [];
  score = 0;
  gameOver = false;
  frame = 0;
  wingUp = true;
}

function drawBackground() {
  const skyColors = ["#70c5ce", "#8ecae6", "#90e0ef", "#48cae4", "#0077b6"];
  const colorIndex = Math.floor((frame / 300) % skyColors.length);
  ctx.fillStyle = skyColors[colorIndex];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBird() {
  ctx.fillStyle = "#ff0";
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, bird.size, bird.size - 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Asas
  ctx.fillStyle = "#ffa500";
  if (wingUp) {
    ctx.beginPath();
    ctx.moveTo(bird.x - 5, bird.y);
    ctx.lineTo(bird.x - 15, bird.y - 10);
    ctx.lineTo(bird.x - 15, bird.y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(bird.x - 5, bird.y);
    ctx.lineTo(bird.x - 15, bird.y + 10);
    ctx.lineTo(bird.x - 15, bird.y);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPipes() {
  ctx.fillStyle = "#0f0";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function update() {
  if (gameOver) return;

  frame++;
  if (frame % 10 === 0) wingUp = !wingUp;

  velocity += gravity;
  bird.y += velocity;

  // Gera canos
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
    let gap = 120;
    let topHeight = Math.floor(Math.random() * (canvas.height - gap - 40)) + 20;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: topHeight,
      bottom: canvas.height - topHeight - gap
    });
  }

  // Move canos
  pipes.forEach(pipe => pipe.x -= 2);

  // Remove canos e pontua
  pipes = pipes.filter(pipe => {
    if (pipe.x + pipe.width < 0) {
      score++;
      scoreEl.textContent = score;
      return false;
    }
    return true;
  });

  // Colisões
  if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
    endGame();
  }
  pipes.forEach(pipe => {
    if (
      bird.x + bird.size > pipe.x &&
      bird.x - bird.size < pipe.x + pipe.width &&
      (bird.y - bird.size < pipe.top ||
       bird.y + bird.size > canvas.height - pipe.bottom)
    ) {
      endGame();
    }
  });
}

function draw() {
  drawBackground();
  drawPipes();
  drawBird();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function flap() {
  if (!gameOver) {
    velocity = jump;
    flapSound.currentTime = 0;
    flapSound.play();
  }
}

function endGame() {
  gameOver = true;
  hitSound.play();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Fim de jogo!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "20px Arial";
  ctx.fillText(`Pontos: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("flappyHigh", highScore);
    highEl.textContent = highScore;
    ctx.fillText("🏆 Novo Recorde!", canvas.width / 2, canvas.height / 2 + 50);
  }
}

window.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);
restartBtn.addEventListener("click", () => resetGame());

resetGame();
gameLoop();
