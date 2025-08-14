const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let player1 = { x: 100, y: 200, color: "red", score: 0 };
let player2 = { x: 600, y: 200, color: "blue", score: 0 };
let speed = 5;

let point = { x: Math.random()*760, y: Math.random()*460, color: "yellow" };
let obstacles = [];

function createObstacle() {
    obstacles.push({ x: Math.random()*760, y: Math.random()*460, size: 20 });
}

setInterval(createObstacle, 2000);

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
    // Player 1
    if (keys["w"]) player1.y -= speed;
    if (keys["s"]) player1.y += speed;
    if (keys["a"]) player1.x -= speed;
    if (keys["d"]) player1.x += speed;

    // Player 2
    if (keys["ArrowUp"]) player2.y -= speed;
    if (keys["ArrowDown"]) player2.y += speed;
    if (keys["ArrowLeft"]) player2.x -= speed;
    if (keys["ArrowRight"]) player2.x += speed;

    // Limites
    [player1, player2].forEach(p => {
        p.x = Math.max(0, Math.min(canvas.width - 20, p.x));
        p.y = Math.max(0, Math.min(canvas.height - 20, p.y));
    });

    // Coletar ponto
    [player1, player2].forEach(p => {
        if (Math.abs(p.x - point.x) < 20 && Math.abs(p.y - point.y) < 20) {
            p.score++;
            document.getElementById("ponto").play();
            point.x = Math.random()*760;
            point.y = Math.random()*460;
        }
    });

    // Colisão com obstáculos
    obstacles.forEach(o => {
        [player1, player2].forEach(p => {
            if (Math.abs(p.x - o.x) < 20 && Math.abs(p.y - o.y) < 20) {
                p.score = Math.max(0, p.score - 1);
                document.getElementById("colisao").play();
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, 20, 20);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, 20, 20);

    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, 15, 15);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Jogador 1: " + player1.score, 20, 20);
    ctx.fillText("Jogador 2: " + player2.score, 600, 20);

    ctx.fillStyle = "orange";
    obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.size, o.size);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
