// ======= Seletores =======
const track = document.getElementById('track');
const car1 = document.getElementById('car1');
const car2 = document.getElementById('car2');
const startScreen = document.getElementById('start-screen');
const winnerScreen = document.getElementById('winner-screen');
const nameForm = document.getElementById('name-form');
const name1 = document.getElementById('name1');
const name2 = document.getElementById('name2');
const winnerText = document.getElementById('winner-text');
const playAgainBtn = document.getElementById('play-again');
const changeNamesBtn = document.getElementById('change-names');
const p1Badge = document.getElementById('p1-badge');
const p2Badge = document.getElementById('p2-badge');

// ======= Estado =======
let players = { p1: 'Jogador 1', p2: 'Jogador 2' };
let running = false;
let finished = false;

let x1 = 0, x2 = 0;         // posição em px (transformX)
let v1 = 0, v2 = 0;         // velocidade (px/s)
let aPressed = false, lPressed = false;

const ACCEL = 1100;         // aceleração ao segurar (px/s^2)
const FRICTION = 900;       // desaceleração quando solta
const VMAX = 1350;          // velocidade máxima (px/s)

let last = 0;
let finishX = 0;

// ======= Funções util =======
function resetPositions() {
  x1 = 0; x2 = 0;
  v1 = 0; v2 = 0;
  car1.style.setProperty('--x', `${x1}px`);
  car2.style.setProperty('--x', `${x2}px`);
  car1.style.transform = `translateX(${x1}px)`;
  car2.style.transform = `translateX(${x2}px)`;
  car1.classList.remove('accel');
  car2.classList.remove('accel');
}

function computeFinish() {
  const trackRect = track.getBoundingClientRect();
  const carW = car1.getBoundingClientRect().width;
  const finishW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--finish-w')) || 24;
  // margem para considerar a ponta do carro cruzando a linha:
  finishX = trackRect.width - finishW - carW - 6;
}

function startRace() {
  computeFinish();
  resetPositions();
  running = true;
  finished = false;
  last = performance.now();
  requestAnimationFrame(loop);
}

function endRace(winnerName) {
  running = false;
  finished = true;
  winnerText.textContent = `🏆 ${winnerName} venceu a corrida!`;
  winnerScreen.classList.add('visible');
}

function updateBadges() {
  p1Badge.textContent = `${players.p1} — tecla A`;
  p2Badge.textContent = `${players.p2} — tecla L`;
}

// ======= Loop principal =======
function loop(ts) {
  if (!running) return;
  const dt = Math.min((ts - last) / 1000, 0.05); // limitar delta para estabilidade
  last = ts;

  // Aceleração
  if (aPressed) { v1 = Math.min(VMAX, v1 + ACCEL * dt); car1.classList.add('accel'); }
  else          { v1 = Math.max(0, v1 - FRICTION * dt); car1.classList.remove('accel'); }

  if (lPressed) { v2 = Math.min(VMAX, v2 + ACCEL * dt); car2.classList.add('accel'); }
  else          { v2 = Math.max(0, v2 - FRICTION * dt); car2.classList.remove('accel'); }

  // Atualizar posições
  x1 = Math.min(finishX, x1 + v1 * dt);
  x2 = Math.min(finishX, x2 + v2 * dt);

  car1.style.transform = `translateX(${x1}px)`;
  car1.style.setProperty('--x', `${x1}px`);
  car2.style.transform = `translateX(${x2}px)`;
  car2.style.setProperty('--x', `${x2}px`);

  // Chegada
  if (!finished && (x1 >= finishX || x2 >= finishX)) {
    const winner = x1 > x2 ? players.p1 : (x2 > x1 ? players.p2 : 'Empate');
    endRace(winner);
    return;
  }

  requestAnimationFrame(loop);
}

// ======= Eventos de teclado =======
window.addEventListener('keydown', (e) => {
  if (!running) return;
  if (e.repeat) e.preventDefault(); // evita scroll/zoom em alguns navegadores
  if (e.key === 'a' || e.key === 'A') aPressed = true;
  if (e.key === 'l' || e.key === 'L') lPressed = true;
});
window.addEventListener('keyup', (e) => {
  if (!running) return;
  if (e.key === 'a' || e.key === 'A') aPressed = false;
  if (e.key === 'l' || e.key === 'L') lPressed = false;
});

// ======= Formulário de nomes =======
nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  players.p1 = (name1.value || 'Jogador 1').trim();
  players.p2 = (name2.value || 'Jogador 2').trim();
  updateBadges();
  startScreen.classList.remove('visible');
  startRace();
});

// ======= Botões pós-corrida =======
playAgainBtn.addEventListener('click', () => {
  winnerScreen.classList.remove('visible');
  startRace();
});
changeNamesBtn.addEventListener('click', () => {
  winnerScreen.classList.remove('visible');
  startScreen.classList.add('visible');
  name1.focus();
});

// ======= Responsividade (recalcular chegada ao redimensionar) =======
window.addEventListener('resize', () => {
  if (!running) return;
  const pct1 = x1 / Math.max(finishX, 1);
  const pct2 = x2 / Math.max(finishX, 1);
  computeFinish();
  x1 = pct1 * finishX;
  x2 = pct2 * finishX;
  car1.style.transform = `translateX(${x1}px)`;
  car2.style.transform = `translateX(${x2}px)`;
});

// ======= Inicial =======
updateBadges();
