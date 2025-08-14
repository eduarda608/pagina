// Configurações do Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Propriedades do jogador
const playerWidth = 50;
const playerHeight = 50;
let playerX = canvas.width / 2 - playerWidth / 2;
const playerSpeed = 5;

// Propriedades dos itens e obstáculos
const itemWidth = 30;
const itemHeight = 30;
const obstacleWidth = 40;
const obstacleHeight = 40;
let items = [];
let obstacles = [];
let score = 0;
let gameOver = false;

// Sons
const collectSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const collisionSound = new Audio('https://www.soundjay.com/button/close-01.wav');

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = "#3498db";
    ctx.fillRect(playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
}

// Função para desenhar os itens (moedas)
function drawItems() {
    ctx.fillStyle = "#f39c12";
    items.forEach(item => {
        ctx.fillRect(item.x, item.y, itemWidth, itemHeight);
    });
}

// Função para desenhar os obstáculos
function drawObstacles() {
    ctx.fillStyle = "#e74c3c";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Função para movimentar o jogador
function movePlayer() {
    if (keys.left && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys.right && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
}

// Função para criar itens
function createItem() {
    const x = Math.random() * (canvas.width - itemWidth);
    items.push({ x: x, y: 0 });
}

// Função para criar obstáculos
function createObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: 0 });
}

// Função para atualizar itens e obstáculos
function updateItemsAndObstacles() {
    items.forEach(item => {
        item.y += 3;
        if (item.y > canvas.height) {
            items.shift();
        }
    });

    obstacles.forEach(obstacle => {
        obstacle.y += 5;
        if (obstacle.y > canvas.height) {
            obstacles.shift();
        }
    });
}

// Função para verificar colisões
function checkCollisions() {
    items.forEach((item, index) => {
        if (item.x < playerX + playerWidth && item.x + itemWidth > playerX && item.y < canvas.height - playerHeight && item.y + itemHeight > canvas.height - playerHeight - 10) {
            score++;
            items.splice(index, 1);
            collectSound.play();
        }
    });

    obstacles.forEach((obstacle, index) => {
        if (obstacle.x < playerX + playerWidth && obstacle.x + obstacleWidth > playerX && obstacle.y < canvas.height - playerHeight && obstacle.y + obstacleHeight > canvas.height - playerHeight - 10) {
            gameOver = true;
            collisionSound.play();
            document.getElementById('gameOverMessage').textContent = "GAME OVER!";
        }
    });
}

// Função para atualizar a pontuação
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Função de animação do jogo
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    updateItemsAndObstacles();
    drawPlayer();
    drawItems();
    drawObstacles();
    checkCollisions();
    updateScore();

    if (Math.random() < 0.02) createItem();
    if (Math.random() < 0.01) createObstacle();

    requestAnimationFrame(gameLoop);
}

// Controle das teclas
const keys = {
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// Iniciar o jogo
gameLoop();
