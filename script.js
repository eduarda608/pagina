const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = canvas.width / box;
let snake = [];
let direction = 'RIGHT';
let food;
let gameLoop = null;  // garantir null inicial
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
  gameOverModal.classList.add('hidden');
  startGame();
});

restartBtn.addEventListener('click', () => {
  gameOverModal.classList.add('hidden');
  mobileControls.classList.remove('hidden');
  startBtn.classList.add('hidden');
  startGame();
});

mobileControls.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const dir = button.getAttribute('data-dir');
    changeDirection(dir);
  });
});
