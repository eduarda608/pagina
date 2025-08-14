const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 200;
let birdVelocity = 0;
let gravity = 0.5;
let pipes = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", jump);
canvas.addEventListener("click", jump);
document.getElementById("restartBtn").addEventListener("click", restart);

function jump() {
    if (!gameOver) {
        birdVelocity = -7;
    }
}

function restart() {
    birdY = 200;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    loop();
}

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * 200) + 50;
    pipes.push({ x: canvas.width, height: pipeHeight });
}

function update() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Gerar novos canos
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
        createPipe();
    }

    // Mover canos
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        // Colisão
        if (
            (birdY < pipes[i].height || birdY > pipes[i].height + 120) &&
            pipes[i].x < 50 && pipes[i].x > 0
        ) {
            gameOver = true;
        }

        // Pontuação
        if (pipes[i].x === 48) {
            score++;
        }
    }

    // Pássaro tocou no chão ou teto
    if (birdY > canvas.height || birdY < 0) {
        gameOver = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pássaro
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(50, birdY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Canos
    ctx.fillStyle = "green";
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, 0, 50, pipes[i].height); // Cano de cima
        ctx.fillRect(pipes[i].x, pipes[i].height + 120, 50, canvas.height); // Cano de baixo
    }

    // Pontuação
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Pontos: " + score, 10, 20);

    // Fim de jogo
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", 100, 250);
    }
}

function loop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(loop);
    } else {
        draw();
    }
}

loop();
