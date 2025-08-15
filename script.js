// script.js - Jogo "Catch the Stars"
// Feito para apresentação: efeitos visuais + sons sem arquivos externos.
// Comentários inclusos para você entender e personalizar.

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: true });
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  // UI
  const scoreVal = document.getElementById('scoreVal');
  const startBtn = document.getElementById('startBtn');

  // Audio context (gera sons simples)
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audio = new AudioCtx();

  function playTone(freq, duration=0.12, type='sine', gain=0.08){
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(audio.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    o.stop(audio.currentTime + duration + 0.02);
  }

  // estado do jogo
  let running = false;
  let score = 0;
  let highScore = 0;

  // jogador (bandeja)
  const player = {
    x: W/2,
    y: H - 80,
    w: 140,
    h: 26,
    vx: 0,
    colorCycle: 0
  };

  // estrelas que caem
  const stars = [];
  const particles = [];

  // util - cria estrela
  function spawnStar(){
    const size = rand(16, 34);
    stars.push({
      x: rand(size, W - size),
      y: -size - rand(0,200),
      r: size,
      vy: rand(1.4, 3.6),
      spin: rand(-0.03, 0.03),
      hue: Math.random()*360,
      bob: Math.random()*Math.PI*2
    });
  }

  // util para partículas de explosão
  function emit(x,y,count=18){
    for(let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: Math.cos(i/count*Math.PI*2) * rand(1,6),
        vy: Math.sin(i/count*Math.PI*2) * rand(1,6),
        life: rand(40,100),
        hue: Math.random()*360,
        size: rand(2,6)
      });
    }
    playTone(880,0.18,'sawtooth',0.06); // som de explosão pequena
  }

  // inicia/reseta
  function startGame(){
    running = true;
    score = 0;
    stars.length = 0;
    particles.length = 0;
    player.x = W/2;
    startBtn.innerText = 'Reiniciar';
    scoreVal.innerText = score;
    // spawn inicial
    for(let i=0;i<5;i++) spawnStar();
    playTone(660,0.15,'triangle',0.08);
  }

  // loop principal
  let frame = 0;
  function loop(){
    if(!running){
      requestAnimationFrame(loop);
      drawIdle();
      return;
    }

    frame++;
    // ajustar tamanho caso mude a tela
    if(canvas.width !== innerWidth || canvas.height !== innerHeight){
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
      player.y = H - 80;
    }

    // desenha background animado (gradiente arcobaleno em movimento)
    const g = ctx.createLinearGradient(0,0,W,H);
    const offset = Math.sin(frame*0.01) * 0.5;
    g.addColorStop(0, `hsl(${(frame*0.3+0)%360} 80% 60% / 0.95)`);
    g.addColorStop(0.5, `hsl(${(frame*0.6+120)%360} 80% 55% / 0.85)`);
    g.addColorStop(1, `hsl(${(frame*0.9+240)%360} 80% 50% / 0.9)`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // brilho suave
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,W,H);
    ctx.globalAlpha = 1;

    // movimento do jogador (suave)
    player.x += (player.vx - player.x) * 0.12;

    // desenha player (bandeja) com brilho neon
    drawTray();

    // atualizar estrelas
    for(let i=stars.length-1;i>=0;i--){
      const s = stars[i];
      s.y += s.vy * (1 + Math.sin(frame*0.02 + s.bob)*0.08);
      s.bob += 0.02;
      s.hue = (s.hue + 0.3) % 360;
      s.spin += 0.002;

      // desenhar estrela
      drawStar(s);

      // checar colisão com bandeja
      if(s.y + s.r*0.9 > player.y - player.h/2 &&
         s.x > player.x - player.w/2 &&
         s.x < player.x + player.w/2){
        // pegou
        score += Math.round(10 + s.r*0.4);
        scoreVal.innerText = score;
        emit(s.x, s.y, 20);
        playTone(880 + s.r*6, 0.06, 'sine', 0.04); // som de pegar
        stars.splice(i,1);
        // spawn mais rápido quando pontua
        if(Math.random() < 0.9) spawnStar();
        continue;
      }

      // se caiu no chão (perde chance)
      if(s.y > H + 100){
        // efeito de perder (pequena nota grave)
        playTone(220, 0.09, 'sine', 0.03);
        stars.splice(i,1);
        spawnStar();
      }
    }

    // partículas
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravidade
      p.life--;
      p.size *= 0.99;
      if(p.life <= 0 || p.size < 0.2) { particles.splice(i,1); continue; }
      ctx.beginPath();
      ctx.fillStyle = `hsl(${p.hue} 80% 60% / ${Math.max(0.08, p.life/120)})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }

    // spawn ocasional de estrelas
    if(frame % Math.max(6, Math.floor(80 - Math.min(60, score/10))) === 0){
      spawnStar();
    }

    // bônus quando alcança milestone
    if(score > highScore && score % 200 < 12){
      highScore = score;
      // show a bigger explosion
      emit(rand(80, W-80), rand(80, H-200), 40);
      playTone(1200, 0.24, 'sawtooth', 0.08);
    }

    requestAnimationFrame(loop);
  }

  // desenha bandeja com efeito de gradiente e brilho
  function drawTray(){
    const {x,y,w,h} = player;
    // sombra
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.roundRect(x - w/2 + 6, y + 8, w, h+4, 16);
    ctx.fill();

    // main tray gradient
    const gr = ctx.createLinearGradient(x - w/2, y - h, x + w/2, y + h);
    gr.addColorStop(0, 'rgba(255,255,255,0.08)');
    gr.addColorStop(0.5, 'rgba(255,255,255,0.11)');
    gr.addColorStop(1, 'rgba(255,255,255,0.04)');

    ctx.beginPath();
    ctx.fillStyle = gr;
    ctx.roundRect(x - w/2, y - h, w, h, 20);
    ctx.fill();

    // neon rim
    ctx.lineWidth = 3;
    ctx.strokeStyle = `hsl(${(frame*0.7)%360} 90% 60% / 0.9)`;
    ctx.beginPath();
    ctx.roundRect(x - w/2, y - h, w, h, 20);
    ctx.stroke();

    // little sparkle dots
    for(let i=0;i<3;i++){
      const px = x - w/2 + 16 + i*(w-32)/2 + Math.sin(frame*0.03 + i)*4;
      ctx.beginPath();
      ctx.fillStyle = `hsl(${(frame*1.5 + i*50)%360} 90% 65% / 0.95)`;
      ctx.arc(px, y - h/2, 4, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // desenha estrela (forma)
  function drawStar(s){
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.spin);
    // glow
    ctx.beginPath();
    ctx.fillStyle = `hsl(${s.hue} 95% 65% / 0.16)`;
    ctx.arc(0,0,s.r*1.2,0,Math.PI*2);
    ctx.fill();

    // star shape
    ctx.beginPath();
    const spikes = 5;
    const outer = s.r;
    const inner = s.r * 0.45;
    for(let i=0;i<spikes;i++){
      const ang = i * Math.PI * 2 / spikes - Math.PI/2;
      ctx.lineTo(Math.cos(ang) * outer, Math.sin(ang) * outer);
      const ang2 = ang + Math.PI / spikes;
      ctx.lineTo(Math.cos(ang2) * inner, Math.sin(ang2) * inner);
    }
    ctx.closePath();
    const grad = ctx.createLinearGradient(-s.r, -s.r, s.r, s.r);
    grad.addColorStop(0, `hsl(${s.hue} 98% 72%)`);
    grad.addColorStop(1, `hsl(${(s.hue+40)%360} 95% 56%)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // highlight
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.ellipse(-s.r*0.22, -s.r*0.28, s.r*0.24, s.r*0.16, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  // idle draw (antes de começar)
  function drawIdle(){
    // simple pulsating background
    ctx.clearRect(0,0,W,H);
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0, `hsl(${(frame*0.2)%360} 80% 55% / 1)`);
    g.addColorStop(1, `hsl(${(frame*0.4+120)%360} 80% 50% / 0.95)`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // title large centered
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.textAlign = 'center';
    ctx.font = 'bold 52px system-ui, Arial';
    ctx.fillText('Catch the Stars ✨', W/2, H/2 - 20);
    ctx.font = '18px system-ui, Arial';
    ctx.fillText('Clique em "Começar" para jogar — use o dedo ou as setas', W/2, H/2 + 20);
  }

  // helpers
  function rand(a,b){ return a + Math.random()*(b-a); }

  // basic rounded rect helper (canvas 2D)
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
    if (w < 2*r) r = w/2;
    if (h < 2*r) r = h/2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  };

  // input: teclado
  addEventListener('keydown', e => {
    if(!running && e.key === 'Enter') startGame();
    if(e.key === 'ArrowLeft'){ player.vx -= 80; playTone(300,0.04,'sine',0.02); }
    if(e.key === 'ArrowRight'){ player.vx += 80; playTone(640,0.04,'sine',0.02); }
  });

  // touch / mouse drag
  let dragging = false;
  function pointerDown(x){
    dragging = true;
    player.vx = x;
  }
  function pointerMove(x){
    if(dragging) player.vx = x;
  }
  function pointerUp(){
    dragging = false;
  }

  // map pointer to x coordinate
  function mapPointerToX(e){
    let x = e.touches ? e.touches[0].clientX : e.clientX;
    return x;
  }

  canvas.addEventListener('mousedown', (e) => { pointerDown(mapPointerToX(e)); });
  canvas.addEventListener('mousemove', (e) => { pointerMove(mapPointerToX(e)); });
  window.addEventListener('mouseup', pointerUp);

  canvas.addEventListener('touchstart', (e) => { pointerDown(mapPointerToX(e)); });
  canvas.addEventListener('touchmove', (e) => { pointerMove(mapPointerToX(e)); e.preventDefault(); }, {passive:false});
  window.addEventListener('touchend', pointerUp);

  // convert pointer x to player.vx target
  setInterval(() => {
    if(dragging){
      // player.vx is actual clientX; convert to target center
      player.vx = (player.vx / W) * W;
      player.x = player.vx;
    }
  }, 20);

  // start button
  startBtn.addEventListener('click', () => {
    if(!running) {
      // resume audio context on some browsers
      if (audio.state === 'suspended') audio.resume();
      startGame();
    } else {
      // reiniciar força total
      startGame();
    }
  });

  // start the loop
  loop();

  // small auto spawn while idle to show color
  setInterval(() => {
    if(!running) spawnStar();
  }, 1100);

  // resize handler
  addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    player.y = H - 80;
  });

})();
