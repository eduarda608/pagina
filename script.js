const gameArea = document.getElementById('game-area');
const spaceship = document.getElementById('spaceship');
const scoreDisplay = document.getElementById('score');

let score = 0;
let spaceshipX = 180;
const gameWidth = 400;
const spaceshipWidth = 40;
const objectSize = 30;

let fallingObjects = [];
let gameInterval;
let spawnInterval;
let speed = 2;

function updateScore(value) {
  score += value;
  if (score < 0) score = 0;
  scoreDisplay.textContent = score;
}

function createFallingObject() {
  const obj = document.createElement('div');
  obj.classList.add('falling-object');

  const isStar = Math.random() < 0.7; // 70% chance estrela, 30% meteoro
  if (isStar) {
    obj.classList.add('star');
  } else {
    obj.classList.add('meteor');
  }

  obj.style.left = Math.floor(Math.random() * (gameWidth - objectSize)) + 'px';
  obj.style.top = '-40px';

  gameArea.appendChild(obj);

  fallingObjects.push({
    element: obj,
    type: isStar ? 'star' : 'meteor',
    y: -40,
  });
}

function moveFallingObjects() {
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const obj = fallingObjects[i];
    obj.y += speed;
    obj.element.style.top = obj.y + 'px';

    // Colisão com nave
    if (
      obj.y + objectSize >= 560 && // vertical colisão
      obj.y <= 600 &&
      parseInt(obj.element.style.left) + objectSize > spaceshipX &&
      parseInt(obj.element.style.left) < spaceshipX + spaceshipWidth
    ) {
      if (obj.type === 'star') {
        updateScore(10);
      } else {
        updateScore(-15);
      }
      gameArea.removeChild(obj.element);
      fallingObjects.splice(i, 1);
      continue;
    }

    // Saiu da tela (chão)
    if (obj.y > 600) {
      if (obj.type === 'star') {
        updateScore(-5);
      }
      gameArea.removeChild(obj.element);
      fallingObjects.splice(i, 1);
    }
  }
}

function gameLoop() {
  moveFallingObjects();
}

function moveSpaceship(dir) {
  spaceshipX += dir * 20;
  if (spaceshipX < 0) spaceshipX = 0;
  if (spaceshipX > gameWidth - spaceshipWidth) spaceshipX = gameWidth - spaceshipWidth;
  spaceship.style.left = spaceshipX + 'px';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    moveSpaceship(-1);
  } else if (e.key === 'ArrowRight') {
    moveSpaceship(1);
  }
});

// Começa o jogo
spawnInterval = setInterval(() => {
  createFallingObject();
  // Aumenta a velocidade gradualmente
  if (speed < 7) speed += 0.02;
}, 1000);

gameInterval = setInterval(gameLoop, 20);
