let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let player1 = { name: "", x: 50, y: 120, color: "red" };
let player2 = { name: "", x: 50, y: 250, color: "yellow" };
let finishLine = 750;
let gameRunning = false;

function startGame() {
  player1.name = document.getElementById("player1").value || "Jogador 1";
  player2.name = document.getElementById("player2").value || "Jogador 2";

  document.getElementById("setup").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("result").innerHTML = "";
  document.getElementById("restartBtn").style.display = "none";

  player1.x = 50;
  player2.x = 50;
  gameRunning = true;

  requestAnimationFrame(updateGame);
}

function updateGame() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pista
  ctx.fillStyle = "#34495e";
  ctx.fillRect(0, 100, canvas.width, 200);

  // Linha de chegada
  ctx.fillStyle = "white";
  ctx.fillRect(finishLine, 100, 10, 200);

  // Jogadores (carros)
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, 50, 30);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, 50, 30);

  // Movimento automático dos carros
  player1.x += Math.random() * 5;
  player2.x += Math.random() * 5;

  // Verificar vencedor
  if (player1.x >= finishLine - 50) {
    endGame(player1.name);
  } else if (player2.x >= finishLine - 50) {
    endGame(player2.name);
  } else {
    requestAnimationFrame(updateGame);
  }
}

function endGame(winner) {
  gameRunning = false;
  document.getElementById("result").innerHTML = `🏆 ${winner} venceu a corrida!`;
  document.getElementById("restartBtn").style.display = "inline-block";
}

function restartGame() {
  document.getElementById("setup").style.display = "block";
  canvas.style.display = "none";
}
