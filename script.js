const rows = 15;
const cols = 15;

let gameDiv = document.getElementById('game');
let timerSpan = document.getElementById('timer');
let scoreSpan = document.getElementById('score');
let playerDisplay = document.getElementById('player-display');

let startScreen = document.getElementById('start-screen');
let gameScreen = document.getElementById('game-screen');
let rankingScreen = document.getElementById('ranking-screen');

let rankingList = document.getElementById('ranking-list');
let playerNameInput = document.getElementById('player-name');
let startBtn = document.getElementById('start-btn');
let restartBtn = document.getElementById('restart-btn');
let playAgainBtn = document.getElementById('play-again-btn');

let moveSound = document.getElementById('move-sound');
let hitSound = document.getElementById('hit-sound');
let winSound = document.getElementById('win-sound');

let maze = [];
let playerPos = { x: 1, y: 1 };
let exitPos = { x: cols - 2, y: rows - 2 };

let timer = 0;
let interval;
let gameRunning = false;

playerNameInput.addEventListener('input', () => {
  startBtn.disabled = playerNameInput.value.trim() === '';
});

startBtn.addEventListener('click', () => {
  playerDisplay.textContent = playerNameInput.value.trim();
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  rankingScreen.classList.add('hidden');
  init();
});

restartBtn.addEventListener('click', () => {
  init();
});

playAgainBtn.addEventListener('click', () => {
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  rankingScreen.classList.add('hidden');
  playerNameInput.value = '';
  startBtn.disabled = true;
  playerNameInput.focus();
});

function createMaze() {
  maze = Array(rows).fill().map(() => Array(cols).fill(0));
  
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      if(r === 0 || c === 0 || r === rows-1 || c === cols-1) {
        maze[r][c] = 1;
      } else if(Math.random() < 0.25 && !(r === 1 && c ===1) && !(r === exitPos.y && c === exitPos.x)) {
        maze[r][c] = 1;
      }
    }
  }
}

function drawMaze(flashCell = null) {
  gameDiv.innerHTML = '';
  gameDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gameDiv.style.gridTemplateRows = `repeat(${rows}, 30px)`;

  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if(maze[r][c] === 1) cell.classList.add('wall');
      if(r === playerPos.y && c === playerPos.x) cell.classList.add('player');
      if(r === exitPos.y && c === exitPos.x) cell.classList.add('exit');
      if(flashCell && flashCell.x === c && flashCell.y === r) {
        cell.classList.add('flash');
      }
      gameDiv.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  if(!gameRunning) return;
  let newX = playerPos.x + dx;
  let newY = playerPos.y + dy;

  if(maze[newY][newX] === 0) {
    playerPos.x = newX;
    playerPos.y = newY;
    moveSound.currentTime = 0;
    moveSound.play();
    drawMaze({x: newX, y: newY});
    checkWin();
  } else {
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

function checkWin() {
  if(playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
    gameRunning = false;
    clearInterval(interval);
    winSound.play();
    saveScore(playerNameInput.value.trim(), timer);
    showRanking();
    alert(`Parabéns, ${playerNameInput.value.trim()}! Você escapou em ${timer} segundos!`);
  }
}

function startTimer() {
  timer = 0;
  timerSpan.textContent = timer;
  interval = setInterval(() => {
    timer++;
    timerSpan.textContent = timer;
    updateScore();
  }, 1000);
}

function updateScore
