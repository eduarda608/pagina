/* Pet virtual — JavaScript */
const canvas = document.getElementById('petCanvas');
const ctx = canvas.getContext('2d');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const washBtn = document.getElementById('washBtn');

const hungerVal = document.getElementById('hungerVal');
const happyVal = document.getElementById('happyVal');
const cleanVal = document.getElementById('cleanVal');
const scoreVal = document.getElementById('scoreVal');

const playArea = document.getElementById('playArea');
const target = document.getElementById('target');
const endMini = document.getElementById('endMini');

const soundEat = document.getElementById('soundEat');
const soundPlay = document.getElementById('soundPlay');
const soundWash = document.getElementById('soundWash');
const soundHappy = document.getElementById('soundHappy');

let pet = {
  x: canvas.width/2,
  y: canvas.height/2 + 40,
  size: 120,
  color: '#4DE0C6',
  eyesOpen: true,
  mood: 1 // 0 triste, 1 neutro, 2 feliz
};

let stats = {
  hunger: 80,    // 0 hungry, 100 full
  happy: 70,     // 0 sad, 100 happy
  clean: 60,     // 0 dirty, 100 clean
  score: 0
};

let lastTick = Date.now();

/* Draw pet (cartoon style) */
function drawPet(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // glow background
  const g = ctx.createRadialGradient(pet.x, pet.y - 30, 10, pet.x, pet.y - 20, 160);
  g.addColorStop(0, hexToRgba(pet.color, 0.28));
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // body
  roundRect(ctx, pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size, 28, pet.color);

  // face details
  // cheeks
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.beginPath();
  ctx.ellipse(pet.x - 30, pet.y + 10, 20, 12, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(pet.x + 30, pet.y + 10, 20, 12, 0, 0, Math.PI*2);
  ctx.fill();

  // eyes
  ctx.fillStyle = '#082026';
  const eyeY = pet.y - 10;
  if(pet.eyesOpen){
    ctx.beginPath(); ctx.ellipse(pet.x - 26, eyeY, 10, 14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(pet.x + 26, eyeY, 10, 14, 0, 0, Math.PI*2); ctx.fill();
    // pupils
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(pet.x - 23, eyeY - 4, 4, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(pet.x + 29, eyeY - 4, 4, 5, 0, 0, Math.PI*2); ctx.fill();
  } else {
    // sleepy lines
    ctx.strokeStyle = '#082026';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(pet.x - 36, eyeY); ctx.quadraticCurveTo(pet.x - 26, eyeY + 10, pet.x - 16, eyeY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pet.x + 16, eyeY); ctx.quadraticCurveTo(pet.x + 26, eyeY + 10, pet.x + 36, eyeY); ctx.stroke();
  }

  // mouth (mood)
  if(stats.happy > 60){
    // smile
    ctx.strokeStyle = '#082026';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pet.x, pet.y + 28, 20, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  } else if(stats.happy < 35){
    // sad
    ctx.strokeStyle = '#082026';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pet.x, pet.y + 40, 18, 1.2 * Math.PI, 1.8 * Math.PI, true);
    ctx.stroke();
  } else {
    // flat
    ctx.fillStyle = '#082026';
    ctx.fillRect(pet.x - 12, pet.y + 30, 24, 4);
  }

  // accessory for dirt (if dirty show speckles)
  if(stats.clean < 40){
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for(let i=0;i<12;i++){
      const rx = pet.x - 40 + Math.random()*80;
      const ry = pet.y - 30 + Math.random()*80;
      ctx.fillRect(rx, ry, 3 + Math.random()*6, 2 + Math.random()*4);
    }
  }
}

/* helpers */
function roundRect(ctx, x, y, w, h, r, fillColor){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function hexToRgba(hex, a){
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* game loop: decrease stats slowly */
function gameTick(){
  const now = Date.now();
  const dt = now - lastTick;
  if(dt < 800) {
    requestAnimationFrame(gameTick);
    return;
  }
  lastTick = now;

  // natural decreases
  stats.hunger = Math.max(0, stats.hunger - 1);
  stats.clean = Math.max(0, stats.clean - 0.6);
  stats.happy = Math.max(0, stats.happy - 0.4);

  // if very hungry, lose happiness
  if(stats.hunger < 25) stats.happy = Math.max(0, stats.happy - 1.2);
  if(stats.clean < 20) stats.happy = Math.max(0, stats.happy - 0.8);

  // update HUD
  updateHUD();

  // eyelid blink small chance
  if(Math.random() < 0.12) {
    pet.eyesOpen = false;
    setTimeout(()=> pet.eyesOpen = true, 420);
  }

  // animate a little color shift based on mood
  if(stats.happy > 65) pet.color = lerpColor('#6df3c9','#9ad1ff', (stats.happy-65)/35);
  else if(stats.happy < 30) pet.color = lerpColor('#f2a6b3','#f0b27a', (30-stats.happy)/30);
  else pet.color = '#4DE0C6';

  drawPet();

  requestAnimationFrame(gameTick);
}

/* linear color mix */
function lerpColor(a,b,t){
  t = Math.max(0, Math.min(1,t));
  const pa = hexToRgb(a), pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r-pa.r)*t);
  const g = Math.round(pa.g + (pb.g-pa.g)*t);
  const bl = Math.round(pa.b + (pb.b-pa.b)*t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(hex){
  const h = hex.replace('#','');
  return {r:parseInt(h.substring(0,2),16), g:parseInt(h.substring(2,4),16), b:parseInt(h.substring(4,6),16)};
}

/* HUD update */
function updateHUD(){
  hungerVal.innerText = Math.round(stats.hunger);
  happyVal.innerText = Math.round(stats.happy);
  cleanVal.innerText = Math.round(stats.clean);
  scoreVal.innerText = Math.round(stats.score);
}

/* actions */
feedBtn.addEventListener('click', ()=> {
  if(stats.hunger >= 98) {
    // little negative feedback
    flashEffect('Você já está cheio!', '#ffd166');
    return;
  }
  stats.hunger = Math.min(100, stats.hunger + 22);
  stats.happy = Math.min(100, stats.happy + 6);
  stats.score += 5;
  soundEat.currentTime = 0; soundEat.play();
  showBubble('+Comida', '#ffdd99');
  updateHUD();
});

washBtn.addEventListener('click', ()=> {
  if(stats.clean >= 98) { flashEffect('Já está limpo!', '#bfe6ff'); return; }
  soundWash.currentTime = 0; soundWash.play();
  // bath animation: gradual increase
  let step = 0;
  const bathInt = setInterval(()=>{
    step++;
    stats.clean = Math.min(100, stats.clean + 8);
    stats.happy = Math.min(100, stats.happy + 2);
    updateHUD();
    showRipple();
    if(step >= 4) { clearInterval(bathInt); stats.score += 8; showBubble('+Banho', '#a3e4ff'); }
  }, 350);
});

playBtn.addEventListener('click', ()=> {
  // open mini game
  playArea.classList.remove('hidden');
  startMiniGame();
});

/* small on-screen bubble */
function showBubble(text, color){
  const e = document.createElement('div');
  e.style.position = 'absolute';
  e.style.left = (canvas.offsetLeft + canvas.clientWidth/2 - 36) + 'px';
  e.style.top = (canvas.offsetTop + 30) + 'px';
  e.style.pointerEvents = 'none';
  e.style.padding = '8px 10px';
  e.style.borderRadius = '10px';
  e.style.background = color;
  e.style.fontWeight = '700';
  e.style.color = '#082026';
  e.style.boxShadow = '0 8px 20px rgba(0,0,0,0.18)';
  e.innerText = text;
  document.body.appendChild(e);
  // float and remove
  e.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-80px)',opacity:0}],{duration:900,easing:'ease-out'});
  setTimeout(()=> e.remove(), 950);
}

/* flash message */
function flashEffect(text, color){
  const e = document.createElement('div');
  e.style.position = 'fixed';
  e.style.left = '50%';
  e.style.top = '12%';
  e.style.transform = 'translateX(-50%)';
  e.style.zIndex = 9999;
  e.style.padding = '10px 14px';
  e.style.borderRadius = '14px';
  e.style.background = color;
  e.style.fontWeight = '800';
  e.style.color = '#082026';
  e.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
  e.innerText = text;
  document.body.appendChild(e);
  setTimeout(()=> e.animate([{opacity:1},{opacity:0}],{duration:700}).onfinish = ()=> e.remove(), 600);
}

/* ripple effect (for bath) */
function showRipple(){
  const el = document.getElementById('effects');
  const r = document.createElement('div');
  r.style.position = 'absolute';
  r.style.left = (canvas.clientWidth/2 - 80) + 'px';
  r.style.top = (canvas.clientHeight/2 + 10) + 'px';
  r.style.width = '160px';
  r.style.height = '40px';
  r.style.borderRadius = '20px';
  r.style.background = 'radial-gradient(circle at 30% 40%, #ffffff55, transparent)';
  r.style.opacity = '0';
  r.style.pointerEvents = 'none';
  el.appendChild(r);
  r.animate([{transform:'scale(0.6)',opacity:0.9},{transform:'scale(1.6)',opacity:0}],{duration:700,easing:'ease-out'});
  setTimeout(()=> r.remove(), 720);
}

/* mini-game: click target rapidly */
let miniInterval = null;
let hits = 0;
function startMiniGame(){
  playArea.classList.remove('hidden');
  hits = 0;
  target.style.transform = 'scale(1)';
  moveTarget();
  soundPlay.currentTime = 0;
  soundPlay.play();
  // handle click/touch
  const onHit = (e) => {
    hits++;
    // quick pop animation
    target.style.transform = 'scale(0.85)';
    setTimeout(()=> target.style.transform = 'scale(1)', 120);
    showBubble('+1', '#ffd88c');
    stats.happy = Math.min(100, stats.happy + 3);
    stats.score += 2;
    updateHUD();
    // move faster after each hit
    moveTarget();
  };
  target.addEventListener('click', onHit);
  target.addEventListener('touchstart', onHit);

  // end after 8 seconds
  miniInterval = setTimeout(()=> {
    endMiniGame();
    target.removeEventListener('click', onHit);
    target.removeEventListener('touchstart', onHit);
  }, 8000);
}

function moveTarget(){
  const area = document.getElementById('miniGame');
  const w = area.clientWidth - target.clientWidth;
  const h = area.clientHeight - target.clientHeight;
  const nx = Math.random() * w;
  const ny = Math.random() * h;
  target.style.left = nx + 'px';
  target.style.top = ny + 'px';
}

endMini.addEventListener('click', () => endMiniGame());

function endMiniGame(){
  if(miniInterval) clearTimeout(miniInterval);
  playArea.classList.add('hidden');
  soundHappy.currentTime = 0; soundHappy.play();
  showBubble(`+${Math.round(hits*2)} pts`, '#b9fbc0');
  // small extra happiness from playing
  stats.happy = Math.min(100, stats.happy + Math.min(20, hits*3));
  stats.score += Math.round(hits*2);
  updateHUD();
}

/* initial draw & loop */
updateHUD();
drawPet();
requestAnimationFrame(gameTick);

/* small utility: allow tapping canvas to pet (increase happy) */
canvas.addEventListener('click', ()=>{
  stats.happy = Math.min(100, stats.happy + 4);
  stats.score++;
  showBubble('❤️', '#ff9aa2');
  soundHappy.currentTime = 0; soundHappy.play();
  updateHUD();
});

/* allow touch events for mobile */
target.addEventListener('touchstart', ()=>{ /* handled in startMiniGame */ });

/* ensure responsive render on resize */
window.addEventListener('resize', ()=> {
  // if css scales canvas, we keep logical size but center drawing
  drawPet();
});
