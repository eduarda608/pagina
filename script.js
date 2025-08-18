const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const playerNameInput = document.getElementById('playerName');
const startScreen = document.querySelector('.start-screen');
const gameScreen = document.querySelector('.game-screen');
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const rankingList = document.getElementById('rankingList');

const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');
const pointSound = document.getElementById('pointSound');
const bgMusic = document.getElementById('bgMusic');

let playerName='', score=0, timeLeft=60;
let obstacles=[], items=[], lines=[], gameInterval, timerInterval;
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// Início do jogo
startBtn.addEventListener('click',()=>{
  playerName = playerNameInput.value || 'Jogador';
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
});

restartBtn.addEventListener('click', resetGame);

// Movimentação do jogador
document.addEventListener('keydown',(e)=>{
  const step = 20;
  let left = parseInt(player.style.left) || 325;
  if(e.key==='ArrowLeft' && left>0){ player.style.left=(left-step)+'px'; }
  if(e.key==='ArrowRight' && left<650){ player.style.left=(left+step)+'px'; }
});

// Começa a rodada
function startGame(){
  score=0; timeLeft=60;
  scoreDisplay.textContent=`Pontuação: ${score}`;
  timerDisplay.textContent=`Tempo: ${timeLeft}s`;
  obstacles=[]; items=[]; lines=[];
  createLines();
  bgMusic.play();
  gameInterval=setInterval(gameLoop,50);
  timerInterval=setInterval(()=>{
    timeLeft--;
    timerDisplay.textContent=`Tempo: ${timeLeft}s`;
    if(timeLeft<=0){ endGame(); }
  },1000);
}

function resetGame(){
  clearInterval(gameInterval); clearInterval(timerInterval);
  gameArea.querySelectorAll('.obstacle,.item,.line').forEach(el=>el.remove());
  startGame();
}

// Criar linhas da pista
function createLines(){
  for(let i=0;i<6;i++){
    const line=document.createElement('div');
    line.classList.add('line');
    line.style.top=(i*100)+'px';
    gameArea.appendChild(line);
    lines.push(line);
  }
}

// Loop principal do jogo
function gameLoop(){
  moveLines();
  if(Math.random()<0.02) createObstacle();
  if(Math.random()<0.03) createItem();
  moveObjects(obstacles,4,false);
  moveObjects(items,3,true);
}

// Movimentar linhas da pista
function moveLines(){
  lines.forEach(line=>{
    let top = parseInt(line.style.top);
    top += 10;
    if(top>500) top = -100;
    line.style.top = top+'px';
  });
}

// Criar obstáculos (cones neon)
function createObstacle(){
  const ob=document.createElement('div');
  ob.classList.add('obstacle');
  ob.style.left=Math.random()*660+'px';
  ob.style.top='-50px';
  gameArea.appendChild(ob);
  obstacles.push(ob);
}

// Criar itens (moedas neon)
function createItem(){
  const it=document.createElement('div');
  it.classList.add('item');
  it.style.left=Math.random()*660+'px';
  it.style.top='-50px';
  gameArea.appendChild(it);
  items.push(it);
}

// Movimentar objetos
function moveObjects(array,speed,isItem){
  array.forEach((obj,i)=>{
    obj.style.top=(parseInt(obj.style.top)+speed)+'px';
    if(parseInt(obj.style.top)>500){ obj.remove(); array.splice(i,1); }
    else if(checkCollision(player,obj)){
      if(isItem){ score++; pointSound.play(); createParticles(obj); }
      else{ score--; missSound.play(); }
      scoreDisplay.textContent=`Pontuação: ${score}`;
      obj.remove(); array.splice(i,1);
    }
  });
}

// Colisão
function checkCollision(a,b){
  const ax=a.offsetLeft, ay=a.offsetTop, aw=a.offsetWidth, ah=a.offsetHeight;
  const bx=b.offsetLeft, by=b.offsetTop, bw=b.offsetWidth, bh=b.offsetHeight;
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}

// Partículas neon
function createParticles(el){
  for(let i=0;i<10;i++){
    const p=document.createElement('div');
    p.style.position='absolute';
    p.style.width='10px';
    p.style.height='10px';
    p.style.backgroundColor='#0ff';
    p.style.borderRadius='50%';
    p.style.top=(parseInt(el.style.top)+15)+'px';
    p.style.left=(parseInt(el.style.left)+15)+'px';
    p.style.pointerEvents='none';
    gameArea.appendChild(p);
    const xMove=(Math.random()-0.5)*100;
    const yMove=(Math.random()-0.5)*100;
    p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${xMove}px,${yMove}px)`,opacity:0}],{duration:500,easing:'ease-out'});
    setTimeout(()=>p.remove(),500);
  }
}

// Final do jogo
function endGame(){
  clearInterval(gameInterval); clearInterval(timerInterval);
  updateRanking();
  alert(`Tempo esgotado! Pontuação de ${playerName}: ${score}`);
  resetGame();
}

// Ranking
function updateRanking(){
  const existing = ranking.find(r=>r.name===playerName);
  if(existing){ if(score>existing.score) existing.score=score; }
  else{ ranking.push({name:playerName,score}); }
  ranking.sort((a,b)=>b.score-a.score);
  localStorage.setItem('ranking',JSON.stringify(ranking));
  rankingList.innerHTML='';
  ranking.slice(0,5).forEach(r=>{
    const li=document.createElement('li');
    li.textContent=`${r.name}: ${r.score}`;
    rankingList.appendChild(li);
  });
}
