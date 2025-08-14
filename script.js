/* Galaxy Rumble — 1v1 Neon Arena
   Tudo em JS (WebAudio synth) — salve como script.js e abra index.html
*/

(() => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  // UI
  const score1El = document.getElementById('score1');
  const score2El = document.getElementById('score2');
  const statusEl = document.getElementById('status');
  const btnStart = document.getElementById('btnStart');
  const btnReset = document.getElementById('btnReset');
  const btnSound = document.getElementById('btnSound');

  // Audio synth
  const Snd = {
    enabled: true, ctx: null,
    ensure(){ if (!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)(); },
    play({freq=440, type='sine', dur=0.08, gain=0.12, glide=0} = {}) {
      if (!this.enabled) return;
      this.ensure();
      const t0 = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq+glide), t0+dur);
      o.connect(g).connect(this.ctx.destination);
      o.start(t0); o.stop(t0+dur);
    },
    hit(){ this.play({freq:150, type:'sawtooth', dur:.12, gain:.18, glide:-100}); },
    shoot(){ this.play({freq:920,type:'square',dur:.06,gain:.07,glide:-200}); },
    explode(){ this.play({freq:220,type:'triangle',dur:.35,gain:.18,glide:-360}); },
    pow(){ this.play({freq:520,type:'sine',dur:.26,gain:.14,glide:200}); },
    toggle(){ this.enabled = !this.enabled; btnSound.textContent = this.enabled ? '🔊 Som' : '🔇 Som'; if (this.enabled) this.play({freq:330,dur:.1}); }
  };

  btnSound.addEventListener('click', ()=>Snd.toggle());
  btnReset.addEventListener('click', ()=>{ resetGame(); running=false; updateStatus('Reiniciado'); });

  // Resize canvas to displayed size * DPR for crisp
  function resize(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  // Helpers
  const rand = (a,b)=> Math.random()*(b-a)+a;
  const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));
  const dist = (a,b)=> Math.hypot(a.x-b.x, a.y-b.y);

  // World
  const W = { w: canvas.width, h: canvas.height, shake:0 };

  // Entities
  class Ship {
    constructor(x,y,color,keys){
      this.x=x; this.y=y; this.vx=0; this.vy=0; this.r=20;
      this.color=color; this.keys=keys; this.input={up:0,down:0,left:0,right:0,fire:0,dash:0};
      this.cool=0; this.score=0; this.dead=false; this.respawn=0;
      this.power=0; this.trail=[];
      this.kills=0;
    }
    update(dt){
      if (this.respawn>0){ this.respawn-=dt; if (this.respawn<=0){ this.dead=false; this.x = rand(80, W.w-80); this.y = rand(80, W.h-80); this.vx=this.vy=0; } return; }
      const spd = this.power>0 ? 380 : 260;
      const ax = (this.input.right - this.input.left) * spd * 6;
      const ay = (this.input.down - this.input.up) * spd * 6;
      this.vx += ax*dt; this.vy += ay*dt;
      // friction
      this.vx *= 0.88; this.vy *= 0.88;
      // dash
      if (this.input.dash && this.cool<=0){
        const m = Math.hypot(this.vx,this.vy)||1;
        this.vx = (this.vx/m)*900; this.vy = (this.vy/m)*900;
        this.cool = 0.9; Snd.hit(); spawnParticles(this.x,this.y, this.color, 18);
        W.shake = 10;
      }
      if (this.cool>0) this.cool -= dt;
      this.x += this.vx*dt; this.y += this.vy*dt;
      // bounds
      const r = this.r;
      if (this.x<r){ this.x=r; this.vx = Math.abs(this.vx)*0.6; }
      if (this.x>W.w-r){ this.x=W.w-r; this.vx = -Math.abs(this.vx)*0.6; }
      if (this.y<r){ this.y=r; this.vy = Math.abs(this.vy)*0.6; }
      if (this.y>W.h-r){ this.y=W.h-r; this.vy = -Math.abs(this.vy)*0.6; }

      if (this.power>0) this.power -= dt;
      // trail
      this.trail.push({x:this.x,y:this.y,t:1});
      if (this.trail.length>20) this.trail.shift();
    }
    draw(){
      // trail glow
      for (let i=0;i<this.trail.length;i++){
        const p = this.trail[i]; const a = i/this.trail.length*0.35;
        ctx.globalAlpha = a;
        glow(p.x,p.y, this.r*(0.5 + i/this.trail.length*0.6), this.color, 12);
      }
      ctx.globalAlpha = 1;
      // ship core
      glow(this.x, this.y, this.r, this.color, 18);
      // triangle ship
      ctx.save();
      ctx.translate(this.x,this.y);
      const ang = Math.atan2(this.vy, this.vx) || 0;
      ctx.rotate(ang+Math.PI/2);
      ctx.beginPath();
      ctx.moveTo(0,-this.r*0.9);
      ctx.lineTo(-this.r*0.6, this.r*0.8);
      ctx.lineTo(this.r*0.6, this.r*0.8);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  class Bullet {
    constructor(x,y,vx,vy,color,owner){
      this.x=x; this.y=y; this.vx=vx; this.vy=vy; this.r=6; this.color=color;
      this.life=2.2; this.owner=owner;
    }
    update(dt){ this.x+=this.vx*dt; this.y+=this.vy*dt; this.life-=dt; if (this.x<-50||this.y<-50||this.x>W.w+50||this.y>W.h+50) this.life=0; }
    draw(){ glow(this.x,this.y,this.r,this.color,8); }
  }

  class PU {
    constructor(x,y,type){
      this.x=x; this.y=y; this.type=type; this.r=14; this.life=12; this.t=0;
    }
    update(dt){ this.t+=dt; this.y += Math.sin(this.t*2)*8*dt; this.life -= dt; }
    draw(){
      if (this.type==='health') drawStar(this.x,this.y,14,5,'#ffd86b');
      else if (this.type==='power') drawStar(this.x,this.y,14,5,'#b0ff7a');
      else drawStar(this.x,this.y,14,5,'#ffd0ff');
    }
  }

  // Collections
  const ships = [
    new Ship(200, 360, '#ff2fa6', {up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',fire:'KeyF',dash:'ShiftLeft'}),
    new Ship(1080,360, '#0ff3ff', {up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',fire:'KeyL',dash:'Slash'})
  ];
  const bullets = [];
  const particles = [];
  const powerups = [];

  // Particle helpers
  function spawnParticles(x,y,color,count=12){
    for (let i=0;i<count;i++){
      particles.push({
        x, y, vx: rand(-260,260), vy: rand(-260,260), t:0, life: rand(0.4,0.9), size: rand(2,6), color
      });
    }
  }
  function glow(x,y,r,color,blur=16){
    ctx.save();
    ctx.shadowBlur = blur; ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  function drawStar(x,y,r,spikes,color){
    ctx.save();
    ctx.translate(x,y);
    ctx.beginPath();
    const step = Math.PI/spikes;
    for (let i=0;i<spikes*2;i++){
      const rad = i%2===0 ? r : r*0.45;
      const a = i*step;
      ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
    }
    ctx.closePath();
    ctx.shadowBlur = 26; ctx.shadowColor = color;
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  // Input
  const down = new Set();
  window.addEventListener('keydown', e=>{
    down.add(e.code);
    updateInputs();
    // prevent scroll
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Slash','ShiftLeft','KeyW','KeyA','KeyS','KeyD','KeyF','KeyL'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e=>{
    down.delete(e.code);
    updateInputs();
  });

  function updateInputs(){
    ships.forEach(s=>{
      s.input.up = down.has(s.keys.up)?1:0;
      s.input.down = down.has(s.keys.down)?1:0;
      s.input.left = down.has(s.keys.left)?1:0;
      s.input.right = down.has(s.keys.right)?1:0;
      s.input.fire = down.has(s.keys.fire)?1:0;
      s.input.dash = down.has(s.keys.dash)?1:0;
    });
  }

  // Spawning powerups
  let puTimer = 4.2;
  function spawnPU(){
    const types = ['power','score','shield'];
    powerups.push(new PU(rand(80, W.w-80), rand(80, W.h-80), types[Math.floor(rand(0,types.length))]));
  }

  // Game flow
  let running = false, last = 0, winner = null;
  const GOAL = 20;

  function resetGame(){
    ships[0].x = 200; ships[0].y = 360; ships[0].vx=ships[0].vy=0; ships[0].score=0; ships[0].dead=false; ships[0].respawn=0; ships[0].power=0; ships[0].trail=[];
    ships[1].x = 1080; ships[1].y = 360; ships[1].vx=ships[1].vy=0; ships[1].score=0; ships[1].dead=false; ships[1].respawn=0; ships[1].power=0; ships[1].trail=[];
    bullets.length = 0; particles.length = 0; powerups.length = 0; puTimer = 4.2; winner = null;
    updateScores();
    W.shake = 0;
  }

  function updateScores(){ score1El.textContent = ships[0].score; score2El.textContent = ships[1].score; }

  // Fire logic (automatic rate-of-fire)
  function tryFire(ship){
    if (ship.dead || ship.respawn>0) return;
    if (!ship._rof) ship._rof = 0;
    if (ship.input.fire && ship._rof <= 0){
      // create bullet in direction of current velocity or upwards if still
      let dx = ship.vx || 0.0001, dy = ship.vy || -1;
      const mag = Math.hypot(dx,dy) || 1;
      dx /= mag; dy /= mag;
      const speed = 820;
      bullets.push(new Bullet(ship.x + dx*(ship.r+8), ship.y + dy*(ship.r+8), dx*speed + ship.vx*0.2, dy*speed + ship.vy*0.2, ship.color, ship));
      ship._rof = ship.power>0 ? 0.14 : 0.22;
      Snd.shoot();
      spawnParticles(ship.x + dx*(ship.r+8), ship.y + dy*(ship.r+8), ship.color, 6);
    }
    ship._rof -= 1/60;
  }

  // Collision detection
  function checkCollisions(dt){
    bullets.forEach(b=>{
      ships.forEach(s=>{
        if (b.owner===s) return;
        if (s.dead || s.respawn>0) return;
        const d = Math.hypot(b.x - s.x, b.y - s.y);
        if (d < b.r + s.r*0.85){
          // hit!
          b.life = 0;
          // K.O.
          s.dead = true;
          s.respawn = 1.1;
          b.owner.score += 1;
          b.owner.kills = (b.owner.kills||0)+1;
          Snd.explode();
          spawnParticles(s.x, s.y, '#fff', 28);
          W.shake = 16;
          // small explosion pushes nearest ship a bit
          s.vx = rand(-180,180); s.vy = rand(-180,180);
          updateScores();
          // win check
          if (b.owner.score >= GOAL){
            winner = b.owner;
            running = false;
            statusEl.textContent = (winner===ships[0] ? 'Jogador 1 venceu!' : 'Jogador 2 venceu!') + ' (Clique Iniciar para jogar de novo)';
          }
        }
      });

      // powerup pickup
      powerups.forEach(p=>{
        powerups.forEach(() => {}); // placeholder to avoid lint issues
        ships.forEach(s=>{
          if (s.dead) return;
          if (Math.hypot(s.x-p.x, s.y-p.y) < s.r + p.r){
            // apply
            if (p.type==='power'){ s.power = 6; Snd.pow(); spawnParticles(p.x,p.y,'#b0ff7a',18); }
            else if (p.type==='score'){ s.score++; Snd.play({freq:880,dur:.08}); spawnParticles(p.x,p.y,'#ffd86b',14); updateScores(); }
            else { s.power = 4; Snd.play({freq:660,dur:.08}); spawnParticles(p.x,p.y,'#ffd0ff',14); }
            p.life = 0;
          }
        });
      });
    });
  }

  // Update loop
  function loop(ts){
    requestAnimationFrame(loop);
    if (!last) last = ts;
    const dt = Math.min(0.033, (ts-last)/1000);
    last = ts;

    // update world dims (in case resized)
    W.w = canvas.width / (window.devicePixelRatio || 1);
    W.h = canvas.height / (window.devicePixelRatio || 1);

    // spawn powerups occasionally
    if (running){
      puTimer -= dt;
      if (puTimer <= 0){
        spawnPU();
        puTimer = rand(6,12);
      }
    }

    // updates
    if (running && !winner){
      ships.forEach(s=> s.update(dt));
      bullets.forEach(b=> b.update(dt));
      particles.forEach(p=> { p.t += dt; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 200*dt; });
      powerups.forEach(p=> p.update(dt));

      // firing
      ships.forEach(s=> tryFire(s));

      // collisions
      checkCollisions(dt);

      // cleanup
      for (let i=bullets.length-1;i>=0;i--) if (bullets[i].life <= 0) bullets.splice(i,1);
      for (let i=particles.length-1;i>=0;i--) if (particles[i].t > particles[i].life) particles.splice(i,1);
      for (let i=powerups.length-1;i>=0;i--) if (powerups[i].life <= 0) powerups.splice(i,1);
    }

    // draw
    if (W.shake>0){ W.shake = Math.max(0, W.shake - 28*dt); ctx.save(); ctx.translate(rand(-W.shake, W.shake), rand(-W.shake, W.shake)); drawAll(); ctx.restore(); }
    else drawAll();
  }

  // draw all
  function drawAll(){
    // clear
    ctx.clearRect(0,0,W.w,W.h);
    // starfield
    drawBackground();

    // draw powerups
    powerups.forEach(p=> p.draw());
    // bullets
    bullets.forEach(b=> b.draw());
    // ships
    ships.forEach(s=> s.draw());
    // particles
    particles.forEach(p=>{
      const a = clamp(1 - p.t/p.life, 0, 1);
      ctx.globalAlpha = a;
      glow(p.x, p.y, p.size, p.color, 10);
      ctx.globalAlpha = 1;
    });

    // HUD in-canvas
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '14px system-ui';
    ctx.fillText(`Meta: ${GOAL}`, 12, 20);
    ctx.restore();
  }

  // background starfield
  const stars = Array.from({length:120}, ()=>({x:rand(0,1280), y:rand(0,720), s: rand(0.6,2.6), tw: rand(0.4,1.6), off: rand(0,10)}));
  function drawBackground(){
    // soft gradient
    const g = ctx.createLinearGradient(0,0,0,W.h);
    g.addColorStop(0,'rgba(20,12,40,0.15)');
    g.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W.w,W.h);

    // stars
    const t = Date.now()/1000;
    for (let i=0;i<stars.length;i++){
      const s = stars[i];
      const a = 0.2 + 0.8*(0.5 + 0.5*Math.sin(t*s.tw + s.off));
      ctx.globalAlpha = a*0.9;
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(s.x * (W.w/1280), s.y * (W.h/720), s.s, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // start / stop
  function toggleStart(){
    if (winner){ resetGame(); running = true; winner = null; statusEl.textContent = 'Reiniciado — Jogo iniciado!'; return; }
    running = !running;
    if (running) statusEl.textContent = 'Jogo em andamento'; else statusEl.textContent = 'Pausado';
  }
  btnStart.addEventListener('click', toggleStart);

  // init
  resetGame();
  requestAnimationFrame(loop);

  // mobile note: you can adapt later to touch controls

  // expose small API for debug
  window._GR = { ships, bullets, particles, powerups, resetGame };
})();
