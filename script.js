js
const circle = document.getElementById('circle');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const gameOverText = document.getElementById('game-over');
const popSound = document.getElementById('pop-sound');
const missSound = document.getElementById('miss-sound');

let score = 0;
let circleTimeout;
let gameActive = true;

const colors = ['#ff416c', '#ff4b2b', '#ff85a2', '#ff6f91', '#ff9a9e'];

function getRandomPosition() {
  const container = document.getElementById('game-container');
  const containerRect = container.getBoundingClientRect();
  const circleSize = circle.offsetWidth;

  const x = Math.random() * (containerRect.width - circleSize);
  const y = Math.random() * (containerRect.height - circleSize - 100) + 80; // para não ficar atrás do texto

  return { x, y };
}

function getRandomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

function showCircle() {
  if (!gameActive) return;

  const { x, y } = getRandomPosition();
  const color = getRandomColor();

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.backgroundColor = color;
  circle.style.boxShadow = `
    0 0 15px 5px ${color},
    inset 0 0 15px 5px ${shadeColor(color, 30)}
  `;
  circle.style.display = 'block';

  circleTimeout = setTimeout(() => {
    miss();
  }, 1500);
}

function shadeColor(color, percent) {
  // função para escurecer a cor
  let f = parseInt(color.slice(1),16),
      t = 0,
      R = f>>16,
      G = f>>8&0x00FF,
      B = f&0x0000FF;
  return "#" + (0x1000000 + (Math.round((t-R)*percent/100)+R)*0x10000 + (Math.round((t-G)*percent/100)+G)*0x100 + (Math.round((t-B)*percent/100)+B)).toString(16).slice(1);
}

function miss() {
  if (!gameActive) return;

  circle.style.display = 'none';
  missSound.currentTime = 0;
  missSound.play();

  gameOverText.textContent = 'Game Over! Você perdeu!';
  gameOverText.style.display = 'block';
  restartBtn.style.display = 'inline-block';
  gameActive = false;
}

function hit() {
  if (!gameActive) return;

  clearTimeout(circleTimeout);

  score++;
  scoreDisplay.textContent = score;
  popSound.currentTime = 0;
  popSound.play();

  showCircle();
}

circle.addEventListener('click', hit);

restartBtn.addEventListener('click', () => {
  score = 0;
  scoreDisplay.textContent = score;
  gameOverText.style.display = 'none';
  restartBtn.style.display = 'none';
  gameActive = true;
  showCircle();
});

// Começa o jogo
showCircle();
