const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bola = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 5,
  vy: 5,
  raio: 10
};
const raquete1 = {
  x: 10,
  y: canvas.height / 2 - 50,
  largura: 10,
  altura: 100,
  velocidade: 5
};
const raquete2 = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  largura: 10,
  altura: 100,
  velocidade: 5
};
let pontos1 = 0;
let pontos2 = 0;

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(raquete1.x, raquete1.y, raquete1.largura, raquete1.altura);
  ctx.fillRect(raquete2.x, raquete2.y, raquete2.largura, raquete2.altura);
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, bola.raio, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Pontos: ${pontos1}`, 10, 10);
  ctx.textAlign = 'right';
  ctx.fillText(`Pontos: ${pontos2}`, canvas.width - 10, 10);
}

function atualizar() {
  bola.x += bola.vx;
  bola.y += bola.vy;

  if (bola.y < 0 || bola.y > canvas.height) {
    bola.vy = -bola.vy;
  }

  if (bola.x < raquete1.x + raquete1.largura && bola.y > raquete1.y && bola.y < raquete1.y + raquete1.altura) {
    bola.vx = -bola.vx;
  }

  if (bola.x > raquete2.x - bola.raio && bola.y > raquete2.y && bola.y < raquete2.y + raquete2.altura) {
    bola.vx = -bola.vx;
  }

  if (bola.x < 0) {
    pontos2++;
    bola.x = canvas.width / 2;
    bola.y = canvas.height / 2;
  }

  if (bola.x > canvas.width) {
    pontos1++;
    bola.x = canvas.width / 2;
    bola.y = canvas.height / 2;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    raquete1.y -= raquete1.velocidade;
  }

  if (e.key === 's') {
    raquete1.y += raquete1.velocidade;
  }

  if (e.key === 'ArrowUp') {
    raquete2.y -= raquete2.velocidade;
  }

  if (e.key === 'ArrowDown') {
    raquete2.y += raquete2.velocidade;
  }
});

setInterval(() => {
  desenhar();
  atualizar();
}, 16);
