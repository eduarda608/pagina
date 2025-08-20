const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const winnerScreen = document.getElementById("winnerScreen");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");
const rankingList = document.getElementById("rankingList");

const engineSound = document.getElementById("engineSound");
const winSound = document.getElementById("winSound");

let player1Name = "";
let player2Name = "";
let ranking = [];

let gameInterval;

// Curvas da pista com Bezier
const trackPoints = [
    {x:150, y:450}, {x:150, y:100}, {x:750, y:100}, {x:750, y:450}, {x:150, y:450}
];

const cars = [
    {x: 200, y: 400, color: "red", upKey: "w", downKey: "s", leftKey: "a", rightKey: "d", name: "", score: 0},
    {x: 400, y: 400, color: "blue", upKey: "ArrowUp", downKey: "ArrowDown", leftKey: "ArrowLeft", rightKey: "ArrowRight", name: "", score: 0}
];

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if(!engineSound.paused) return;
    engineSound.play();
});
document.addEventListener('keyup', (e) => keys[e.key] = false);

function startGame() {
    player1Name = document.getElementById("player1").value || "Jogador 1";
    player2Name = document.getElementById("player2").value || "Jogador 2";
    cars[0].name = player1Name;
    cars[1].name = player2Name;

    menu.style.display = "none";
    winnerScreen.style.display = "none";

    cars[0].x = 200; cars[0].y = 400;
    cars[1].x = 400; cars[1].y = 400;

    gameInterval = setInterval(gameLoop, 20);
}

function gameLoop() {
    updateCars();
    drawTrack();
    drawCars();
    checkWinner();
}

function updateCars() {
    cars.forEach(car => {
        if(keys[car.upKey]) car.y -= 4;
        if(keys[car.downKey]) car.y += 4;
        if(keys[car.leftKey]) car.x -= 4;
        if(keys[car.rightKey]) car.x += 4;

        // Limites do canvas
        if(car.x < 0) car.x = 0;
        if(car.x > canvas.width) car.x = canvas.width;
        if(car.y < 0) car.y = 0;
        if(car.y > canvas.height) car.y = canvas.height;
    });
}

function drawTrack() {
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Grama
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Pista com curvas Bezier
    ctx.beginPath();
    ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
    ctx.bezierCurveTo(150, 200, 750, 200, trackPoints[1].x, trackPoints[1].y);
    ctx.lineTo(trackPoints[2].x, trackPoints[2].y);
    ctx.bezierCurveTo(700, 200, 200, 200, trackPoints[3].x, trackPoints[3].y);
    ctx.closePath();
    ctx.fillStyle = "#808080";
    ctx.fill();

    // Faixas brancas
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 15]);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawCars() {
    cars.forEach(car => {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x - 15, car.y - 25, 30, 50);
    });
}

function checkWinner() {
    cars.forEach(car => {
        if(car.y <= 110) {
            clearInterval(gameInterval);
            engineSound.pause();
            engineSound.currentTime = 0;
            winnerText.textContent = `${car.name} VENCEU!`;
            winnerScreen.style.display = "block";
            winSound.play();
            addToRanking(car.name);
        }
    });
}

function addToRanking(name) {
    let found = ranking.find(player => player.name === name);
    if(found) found.score += 1;
    else ranking.push({name, score: 1});
    updateRanking();
}

function updateRanking() {
    rankingList.innerHTML = "";
    ranking.sort((a,b) => b.score - a.score);
    ranking.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.score} vitórias`;
        rankingList.appendChild(li);
    });
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
