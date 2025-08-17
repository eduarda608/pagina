const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');

let isJumping = false;
let isGameOver = false;
let score = 0;
let scoreInterval;

function jump() {
  if (isJumping || isGameOver) return;

  isJumping = true;
  player.classList.add('jump');

  setTimeout(() => {
    player.classList.remove('jump');
    isJumping = false;
  }, 500);
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.left < obstacleRect.left + obstacleRect.width &&
    playerRect.left + playerRect.width > obstacleRect.left &&
    playerRect.bottom > obstacleRect.top
  ) {
    endGame();
  }
}

function startScoring() {
  scoreInterval = setInterval(() => {
    if (!isGameOver) {
      score++;
      scoreDisplay.textContent = 'Score: ' + score;
    }
  }, 200);
}

function endGame() {
  isGameOver = true;
  obstacle.style.animationPlayState = 'paused';
  clearInterval(scoreInterval);
  gameOverScreen.classList.remove('hidden');
}

function resetGame() {
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  obstacle.style.animation = 'none';
  obstacle.offsetHeight; // Trigger reflow
  obstacle.style.animation = null;
  gameOverScreen.classList.add('hidden');
  startScoring();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  } else if (e.code === 'Enter' && isGameOver) {
    resetGame();
  }
});

setInterval(() => {
  if (!isGameOver) {
    checkCollision();
  }
}, 50);

startScoring();
