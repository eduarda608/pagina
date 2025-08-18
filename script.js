const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let score = 0;
let isJumping = false;
let playerBottom = 60;

const gravity = 3;
const jumpHeight = 80;
const jumpDuration = 400; // ms

let clouds = [];
let cloudSpeed = 2;

function createCloud() {
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  cloud.style.left = gameArea.clientWidth + 'px';
  gameArea.appendChild(cloud);

  clouds.push({
    element: cloud,
    x: gameArea.clientWidth,
    width: 80,
  });
}

function moveClouds() {
  for (let i = clouds.length - 1; i >= 0; i--) {
    let cloud = clouds[i];
    cloud.x -= cloudSpeed;
    cloud.element.style.left = cloud.x + 'px';

    // Remove nuvem que saiu da tela
    if (cloud.x + cloud.width < 0) {
      gameArea.removeChild(cloud.element);
      clouds.splice(i, 1);
      updateScore();
    }
  }
}

function updateScore() {
  score++;
  scoreDisplay.textContent = score;
}

function jump() {
  if (isJumping) return;
  isJumping = true;

  let upInterval = setInterval(() => {
    if (playerBottom >= 60 + jumpHeight) {
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (playerBottom <= 60) {
          clearInterval(downInterval);
          isJumping = false;
        }
        playerBottom -= gravity;
        player.style.bottom = playerBottom + 'px';
      }, 20);

    } else {
      playerBottom += gravity;
      player.style.bottom = playerBottom + 'px';
    }
  }, 20);
}

function checkCollision() {
  // Verifica se jogador está em uma nuvem
  let onCloud = false;
  for (let cloud of clouds) {
    const cloudLeft = cloud.x;
    const cloudRight = cloud.x + cloud.width;
    const playerLeft = parseInt(player.style.left);
    const playerRight = playerLeft + 40;
    const playerBottomPos = playerBottom;

    if (
      playerRight > cloudLeft &&
      playerLeft < cloudRight &&
      playerBottomPos <= 100 && // altura da nuvem (50 + 40 de tamanho do player)
      playerBottomPos >= 50
    ) {
      onCloud = true;
      break;
    }
  }
  if (!onCloud && !isJumping) {
    alert(`Game Over! Sua pontuação foi: ${score}`);
    resetGame();
  }
}

function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  clouds.forEach(c => gameArea.removeChild(c.element));
  clouds = [];
  playerBottom = 60;
  player.style.bottom = playerBottom + 'px';
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

createCloud();
setInterval(createCloud, 2000);

setInterval(() => {
  moveClouds();
  checkCollision();
}, 20);
