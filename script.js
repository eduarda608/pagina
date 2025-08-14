// Neon Bloom — jogo colorido, simples e chamativo
(() => {
  // elementos
  const canvas = document.getElementById('game');
  const overlay = document.getElementById('overlay');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const comboEl = document.getElementById('combo');
  const hint = document.getElementById('hint');
  const sfxCollect = document.getElementById('sfxCollect');
  const sfxHit = document.getElementById('sfxHit');
  const bgMusic = document.getElementById('bgMusic');
  const btnMute = document.getElementById('btnMute');
  const btnRestart = document.getElementById('btnRestart');

  if(!canvas) return console.error('Canvas não encontrado');

  // ajustar resolução do canvas para ser nítido
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(600, Math.floor(rect.width * devicePixelRatio));
    canvas.height = Math.max(420, Math.floor(rect.height * devicePixelRatio));
  }
  fitCanvas();

  const ctx = canvas.getContext('2d');
  let running = false;

  // estado do jogo
  const state = {
    score: 0,
    level: 1,
    combo: 0,
    time: 0,
    spawnTimer: 0,
    particles: [],
    flowers: [], // itens a coletar
    hazards: [], // sombras a evitar
    player: { x: canvas.width/2, y: canvas.height*0.78, r: 28 * devicePixelRatio, hue: Math.random()*360 },
    muted: false
  };

  // util cores neon
  function neonColor(h, sat=90, l=55) { return `hsl(${h}deg ${sat}% ${l}%)`; }

  // efeitos sonoros safe play
  function safePlay(audio) {
    if(!audio) return;
    audio.currentTime = 0;
    const p = audio.play();
    if(p && p.catch) p.catch(()=>{/*blocked*/});
  }

  // partículas
  function spawnParticle(x,y,color,life=700) {
    state.particles.push({
      x,y,
      vx:(Math.random()-0.5)*2.4*devicePixelRatio,
      vy:(Math.random()-0.8)*-2.6*devicePixelRatio,
      size: (Math.random()*6+2)*devicePixelRatio,
      color,
      t:0, life
    });
  }

  // criar flor colorida
  function spawnFlower() {
    const margin = 80*devicePixelRatio;
    const x = Math.random()*(canvas.width - margin*2) + margin;
    const y = Math.random()*(canvas.height*0.45) + margin;
    const hue = Math.floor(Math.random()*360);
    state.flowers.push({ x,y, r: 18*devicePixelRatio, hue, bob:Math.random()*Math.PI*2, ttl: 10000 });
  }

  // criar hazard (sombra)
  function spawnHazard() {
    const w = 40*devicePixelRatio + Math.random()*80*devicePixelRatio;
    const x = Math.random()*(canvas.width - w);
    state.hazards.push({
      x, y: -60*devicePixelRatio, w, h: 26*devicePixelRatio + Math.random()*30*devicePixelRatio,
      vy: 1.1*devicePixelRatio + Math.random()*1.6*devicePixelRatio,
      hue: Math.random()*360
    });
  }

  // reiniciar jogo
  function resetGame() {
    state.score=0; state.level=1; state.combo=0; state.time=0; state.spawnTimer=0;
    state.particles=[]; state.flowers=[]; state.hazards=[];
    state.player.x = canvas.width/2; state.player.y = canvas.height*0.78;
    // spawn inicial
    for(let i=0;i<4;i++) spawnFlower();
    running = true;
    hint.style.opacity = '0';
    updateHUD();
    // start music only after user gesture
    if(!state.muted) safePlay(bgMusic);
  }

  // HUD
  function updateHUD(){ scoreEl.innerText = state.score; levelEl.innerText = state.level; comboEl.innerText = state.combo; }

  // colisão círculo-retângulo helper
  function circRectColl(cx,cy,cr, rx,ry,rw,rh) {
    const nearestX = Math.max(rx, Math.min(cx, rx+rw));
    const nearestY = Math.max(ry, Math.min(cy, ry+rh));
    const dx = cx - nearestX; const dy = cy
