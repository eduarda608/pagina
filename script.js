// script.js
const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');

let jogador1 = {
  x: 100,
  y: 100,
  cor: '#ff0000',
  velocidade: 5
};

let jogador2 = {
  x: 700,
  y: 100,
  cor: '#0000ff',
  velocidade: 5
};

let bandeira1 = {
  x: 100,
  y: 500,
  cor: '#ff0000'
};

let bandeira2 = {
  x: 700,
  y: 500,
  cor: '#0000ff'
};

let projeteis = [];

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    jogador1.y -= jogador1.velocidade;
  }
  
  if (e.key === 's') {
    jogador1.y += jogador1.velocidade;
  }
  
  if (e.key === 'a') {
    jogador1.x -= jogador1.velocidade;
  }
  
  if (e.key === 'd') {
    jogador1.x += jogador1.velocidade;
  }
  
  if (e.key === 'ArrowUp') {
    jogador2.y -= jogador2.velocidade;
  }
  
  if (e.key === 'ArrowDown') {
    jogador2.y += jogador2.velocidade;
  }
  
  if (e.key === 'ArrowLeft') {
    jogador2.x -= jogador2.velocidade;
  }
  
  if (e.key === 'ArrowRight') {
    jogador2.x += jogador2.velocidade;
  }
  
  if (e.key === ' ') {
    projeteis.push({
      x: jogador1.x,
      y: jogador1.y,
      cor: jogador1.cor,
      velocidade: 10
    });
  }
});

function desenhar() {
  ctx.clearRect(0, 0, tela.width, tela.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, tela.width, tela.height);
  
  ctx.fillStyle = jogador1.cor;
  ctx.fillRect(jogador1.x, jogador1.y, 50, 50);
  
  ctx.fillStyle = jogador2.cor;
  ctx.fillRect(jogador2.x, jogador2.y, 50, 50);
  
  ctx.fillStyle = bandeira1.cor;
  ctx.fillRect(bandeira1.x, bandeira1.y, 20, 20);
  
  ctx.fillStyle = bandeira2.cor;
  ctx.fillRect(bandeira2.x, bandeira2.y, 20, 20);
  
  for (let i = 0; i < projeteis.length; i++) {
    ctx.fillStyle = projeteis[i].cor;
    ctx.fillRect(projeteis[i].x, projeteis[i].y, 10, 10);
    projeteis[i].x += projeteis[i].velocidade;
  }
}

setInterval(() => {
  desenhar();
}, 16);
