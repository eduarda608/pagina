const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const playerNameInput = document.getElementById('playerName');
const startScreen = document.querySelector('.start-screen');
const gameScreen = document.querySelector('.game-screen');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const rankingList = document.getElementById('rankingList');

const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');
const pointSound = document.getElementById('pointSound');
const bgMusic = document.getElementById('bgMusic');

let playerName = '';
let score = 0;
let shapes = [];
let shapeInterval;
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

startBtn.addEventListener('click', () => {
  playerName = playerNameInput.value || 'Jogador';
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  bgMusic.play();
  startGame();
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

function startGame() {
  score = 0;
  scoreDisplay.textContent = `Pontuação: ${score}`;
  shapeInterval = setInterval(createShape, 1000);
}

function resetGame() {
  shapes.forEach(s => s.remove());
  shapes = [];
  clearInterval(shapeInterval);
  startGame();
}

function createShape() {
  const shape = document.createElement('div');
  const type = ['circle','square','triangle'][Math.floor(Math.random()*3)];
  shape.classList.add('shape', type);

  shape.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
  shape.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';

  if(type === 'circle'){
    shape.style.width = '50px';
    shape.style.height = '50px';
    shape.style.borderRadius = '50%';
    shape.style.backgroundColor = getRandomNeonColor();
  } else if(type === 'square'){
    shape.style.width = '50px';
    shape.style.height = '50px';
    shape.style.backgroundColor = getRandomNeonColor();
  } else if(type === 'triangle'){
    shape.style.width = '0';
    shape.style.height = '0';
    shape.style.borderLeft = '25px solid transparent';
    shape.style.borderRight = '25px solid transparent';
    shape.style.borderBottom = `50px solid ${getRandomNeonColor()}`;
    shape.style.backgroundColor = 'transparent';
  }

  shape.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    hitSound.play();
    pointSound.play();
    createParticles(shape);
    shape.remove();
    shapes = shapes.filter(s => s !== shape);
    updateRanking();
  });

  gameArea.appendChild(shape);
  shapes.push(shape);

  setTimeout(() => {
    if(document.body.contains(shape)){
      shape.remove();
      shapes = shapes.filter(s => s !== shape);
      missSound.play();
    }
  }, 3000);
}

function getRandomNeonColor(){
  const colors = ['#ff00ff','#00ffff','#ffdd00','#ff0077','#00ff99','#ff5500','#00ffcc'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// Cria partículas brilhantes ao clicar
function createParticles(element){
  for(let i=0;i<10;i++){
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = getRandomNeonColor();
    particle.style.borderRadius = '50%';
    particle.style.top = element.offsetTop + 20 + 'px';
    particle.style.left = element.offsetLeft + 20 + 'px';
    particle.style.pointerEvents = 'none';
    gameArea.appendChild(particle);
    const xMove = (Math.random()-0.5)*100;
    const yMove = (Math.random()-0.5)*100;
    particle.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0 }
    ], { duration: 500, easing: 'ease-out' });
    setTimeout(()=>particle.remove(), 500);
  }
}

function updateRanking(){
  const existing = ranking.find(r => r.name === playerName);
  if(existing){
    if(score > existing.score) existing.score = score;
  } else {
    ranking.push({name: playerName, score});
  }
  ranking.sort((a,b)=>b.score-a.score);
  localStorage.setItem('ranking', JSON.stringify(ranking));

  rankingList.innerHTML = '';
  ranking.slice(0,5).forEach(r=>{
    const li = document.createElement('li');
    li.textContent = `${r.name}: ${r.score}`;
    rankingList.appendChild(li);
  });
}
