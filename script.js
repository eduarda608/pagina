const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [{ x: 8 * box, y: 8 * box }];
let direction = "right";

let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
  if (event.key === "ArrowDown" && direction !== "up") direction = "down";
});

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha a cobrinha
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Desenha a comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Atualiza posição da cabeça
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "right") head.x += box;
  if (direction === "left") head.x -= box;
  if (direction === "up") head.y -= box;
  if (direction === "down") head.y += box;

  // Fim de jogo
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over!");
    return;
  }

  snake.unshift(head);

  // Se comeu a comida
  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }
}

let game = setInterval(draw, 100);
