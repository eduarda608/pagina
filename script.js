// Definindo as variáveis globais
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definindo as dimensões do canvas
const gridSize = 20;
const canvasWidth = 600;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake = [{ x: 100, y: 100 }];
let snakeLength = 1;
let direction = "RIGHT";
let food = generateFood();
let gameOver = false;
let gameInterval;

// Inicia o jogo
function startGame() {
  gameOver = false;
  snake = [{ x: 100, y: 100 }];
  snakeLength = 1;
  direction = "RIGHT";
  food = generateFood();
  document.getElementById("gameOver").style.display = "none";
  gameInterval = setInterval(updateGame, 100);
}

// Função para gerar a comida
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize
  };
}

// Função para desenhar o jogo
function drawGame() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Desenha a cobra
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lime"; // A cabeça da cobra é verde
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Desenha a comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Função para atualizar a lógica do jogo
function updateGame() {
  if (gameOver) {
    clearInterval(gameInterval);
    document.getElementById("gameOver").style.display = "block";
    return;
  }

  // Movendo a cobra
  let head = { ...snake[0] };

  if (direction === "RIGHT") head.x += gridSize;
  if (direction === "LEFT") head.x -= gridSize;
  if (direction === "UP") head.y -= gridSize;
  if (direction === "DOWN") head.y += gridSize;

  // Verifica colisões
  if (
    head.x < 0 || head.x >= canvasWidth || 
    head.y < 0 || head.y >= canvasHeight || 
    collisionWithSnake(head)
  ) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  // Verifica se comeu a comida
  if (head.x === food.x && head.y === food.y) {
    snakeLength++;
    food = generateFood();
  } else {
    snake.pop();
  }

  drawGame();
}

// Função para verificar colisão com a cobra
function collisionWithSnake(head) {
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Função para alterar a direção
function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Reiniciar o jogo ao pressionar a tecla "R"
function restartGame(event) {
  if (event.key === "r" || event.key === "R") startGame();
}

// Adicionando os eventos de teclado
document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", restartGame);

// Iniciar o jogo
startGame();
