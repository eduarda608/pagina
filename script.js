(() => {
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let W=canvas.width=innerWidth;
let H=canvas.height=innerHeight;

// UI
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const startBtn = document.getElementById('startBtn');

// Áudio
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audio = new AudioCtx();
function playTone(freq,dur=0.1,gain=0.08){
  const o=audio.createOscillator();
  const g=audio.createGain();
  o.type='sine'; o.frequency.value=freq;
  g.gain.value=gain;
  o.connect(g); g.connect(audio.destination);
  o.start(); g.gain.exponentialRampToValueAtTime(0.0001,audio.currentTime+dur);
  o.stop(audio.currentTime+dur+0.02);
}

// Estado
let running=false;
let score1=0, score2=0;
let balls=[], particles=[];
let frame=0;
const maxScore=10;
let winner=null;

// Jogadores
const players=[
  {x:W/4,y:H-100,w:40,h:40,color:'#00f',scoreEl:score1El,left:'a',right:'d',shoot:'w'},
  {x:W*3/4,y:H-100,w:40,h:40,color:'#f00',scoreEl:score2El,left:'ArrowLeft',right:'ArrowRight',shoot:'ArrowUp'}
];

// iniciar jogo
function startGame(){
  if(audio.state==='suspended') audio.resume();
  running=true;
  winner=null;
  score1=0; score2=0;
  balls=[]; particles=[];
  players[0].x=W/4; players[1].x=W*3/4;
  score1El.textContent=0; score2El.textContent=0;
  startBtn.textContent='Reiniciar';
}

// criar bola
function shootBall(player){
  if(!running) return;
  balls.push({x:player.x, y:player.y-20, vx:0, vy:-5, color:player.color, owner:player});
  playTone(880,0.1,0.05);
}

// partículas
function emit(x,y,color,count=15){
  for(let i=0;i<count;i++){
    particles.push({
      x,y,
      vx:Math.cos(i/count*Math.PI*2)*Math.random()*4,
      vy:Math.sin(i/count*Math.PI*2)*Math.random()*4,
      life:Math.random()*40+30,
      hue:color,
      size:Math.random()*4+2
    });
  }
}

// Loop
function loop(){
  frame++;
  if(canvas.width!==innerWidth||canvas.height!==innerHeight){
    W=canvas.width=innerWidth; H=canvas.height=innerHeight;
    players[0].y=H-100; players[1].y=H-100;
  }

  // fundo
  ctx.fillStyle=`hsl(${frame%360},50%,10%)`;
  ctx.fillRect(0,0,W,H);

  // jogador
  players.forEach(p=>{
    ctx.fillStyle=p.color;
    ctx.fillRect(p.x-p.w/2,p.y-p.h/2,p.w,p.h);
  });

  // bolas
  for(let i=balls.length-1;i>=0;i--){
    const b=balls[i];
    b.y+=b.vy; b.x+=b.vx;
    ctx.beginPath();
    ctx.fillStyle=b.color;
    ctx.arc(b.x,b.y,10,0,Math.PI*2);
    ctx.fill();

    // colisão com oponente
    players.forEach(p=>{
      if(p!==b.owner){
        if(b.x>p.x-p.w/2 && b.x<p.x+p.w/2 && b.y>p.y-p.h/2 && b.y<p.y+p.h/2){
          if(p===players[0]) score2+=1; else score1+=1;
          p.scoreEl.textContent=p===players[0]?score1:score2;
          emit(b.x,b.y,b.color);
          balls.splice(i,1);
          checkWinner();
        }
      }
    });

    // fora da tela
    if(b.y<0) balls.splice(i,1);
  }

  // partículas
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.05;
    p.life--; p.size*=0.98;
    if(p.life<=0||p.size<0.2){ particles.splice(i,1); continue;}
    ctx.beginPath();
    ctx.fillStyle=`hsl(${p.hue*2%360},90%,60%)`;
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  }

  // mostrar vencedor
  if(winner){
    ctx.fillStyle='white';
    ctx.font='bold 80px sans-serif';
    ctx.textAlign='center';
    ctx.fillText(`${winner} VENCEU!`, W/2, H/2);
    ctx.font='bold 40px sans-serif';
    ctx.fillText(`Rank: ${winner} - ${winner==="Jogador 1"?score1:score2} pontos`, W/2, H/2+60);
  }

  requestAnimationFrame(loop);
}
loop();

// teclado
const keys={};
window.addEventListener('keydown',e=>{keys[e.key]=true});
window.addEventListener('keyup',e=>{
  keys[e.key]=false;
  // disparo
  players.forEach(p=>{
    if(e.key===p.shoot) shootBall(p);
  });
});

// mover jogadores
setInterval(()=>{
  if(!running) return;
  players.forEach(p=>{
    if(keys[p.left]) p.x-=8;
    if(keys[p.right]) p.x+=8;
    if(p.x<p.w/2) p.x=p.w/2;
    if(p.x>W-p.w/2) p.x=W-p.w/2;
  });
},20);

// verificar vencedor
function checkWinner(){
  if(score1>=maxScore){ winner="Jogador 1"; running=false; }
  if(score2>=maxScore){ winner="Jogador 2"; running=false; }
}

startBtn.addEventListener('click',startGame);
})();
