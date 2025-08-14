// script.js
const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');

let jogador1 = {
  x: 100,
  y: 100,
  cor: '#ff0000',
  velocidade: 5,
  largura: 50,
  altura: 50
};

let jogador2 = {
  x: 650,
  y: 100,
  cor: '#0000ff',
  velocidade: 5,
  largura: 50,
  altura: 50
};

let bandeira1 = {
  x: 100,
  y: 500,
  cor: '#ff0000',
  largura: 20,
  altura: 20
};

let bandeira2 = {
  x: 680,
  y: 500,
  cor: '#0000ff',
  largura: 20,
  altura: 20
};

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
});

function desenhar() {
  ctx.clearRect(0, 0, tela.width, tela.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, tela.width, tela.height);
  
  ctx.fillStyle = jogador1.cor;
  ctx.fillRect(jogador1.x, jogador1.y, jogador1.largura, jogador1.altura);
  
  ctx.fillStyle = jogador2.cor;
  ctx.fillRect(jogador2.x, jogador2.y, jogador2.largura, jogador2.altura);
  
  ctx.fillStyle = bandeira1.cor;
  ctx.fillRect(bandeira1.x, bandeira1.y, bandeira1.largura, bandeira1.altura);
  
  ctx.fillStyle = bandeira2.cor;
  ctx.fillRect(bandeira2.x, bandeira2.y, bandeira2.largura, bandeira2.altura);
}

setInterval(() => {
  desenhar();
}, 16);
