const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hitSound = document.getElementById("hitSound");

let score = 0;
document.getElementById("score").innerText = score;

const player = {
    x: 180,
    y: 450,
    width: 40,
    height: 40,
    color: "#00FFDD",
    speed: 5
};

let obstacles = [];
let obstacleSpeed = 3;

// Controle do jogador
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Criar obstáculos
function createObstacle() {
    const width = Math.random() * 50 + 30;
    const x = Math.random() * (canvas.width - width);
    const color = getRandomColor();
    obstacles.push({x, y: -50, width, height: 20, color});
}

// Cores aleatórias
function getRandomColor() {
    const colors = ["#FF3F3F", "#3FFF7F", "#3F8FFF", "#FFF53F", "#FF3FFF"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Atualizar posição do jogador
function movePlayer() {
    if(keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if(keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
    if(keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if(keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
}

// Checar colisão
function checkCollision(rect1, rect2) {
    return !(rect1.x > rect2.x + rect2.width ||
             rect1.x + rect1.width < rect2.x ||
             rect1.y > rect2.y + rect2.height ||
             rect1.y + rect1.height < rect2.y);
}

// Atualizar jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover jogador
    movePlayer();

    // Desenhar jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Desenhar obstáculos
    for(let i = obstacles.length -1; i >=0; i--) {
        let obs = obstacles[i];
        obs.y += obstacleSpeed;
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Checar colisão
        if(checkCollision(player, obs)) {
            hitSound.play();
            alert("Fim de jogo! Sua pontuação: " + score);
            document.location.reload();
        }

        // Remover obstáculos fora da tela
        if(obs.y > canvas.height) {
            obstacles.splice(i,1);
            score++;
            document.getElementById("score").innerText = score;
            // Aumenta velocidade a cada 5 pontos
            if(score % 5 === 0) obstacleSpeed += 0.5;
        }
    }

    requestAnimationFrame(update);
}

// Criar obstáculos a cada 1.2 segundos
setInterval(createObstacle, 1200);

// Iniciar jogo
update();
