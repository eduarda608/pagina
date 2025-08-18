window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let score = 0;
    let gameOver = false;
    let obstacles = [];
    let keys = {};
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    const car = {
        x: canvas.width/2 - 20,
        y: canvas.height - 80,
        width: 40,
        height: 70,
        speed: 5
    };

    document.addEventListener("keydown", (e) => keys[e.key] = true);
    document.addEventListener("keyup", (e) => keys[e.key] = false);

    function resetGame() {
        score = 0;
        gameOver = false;
        obstacles = [];
        car.x = canvas.width/2 - 20;
        document.getElementById("gameOverScreen").classList.add("hidden");
        loop();
    }

    document.getElementById("restartBtn").addEventListener("click", () => {
        const name = document.getElementById("playerName").value || "Anon";
        leaderboard.push({name, score});
        leaderboard.sort((a,b)=>b.score-a.score);
        leaderboard = leaderboard.slice(0,10);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        updateLeaderboard();
        resetGame();
    });

    function updateLeaderboard() {
        const lb = document.getElementById("leaderboard");
        lb.innerHTML = "";
        leaderboard.forEach(player=>{
            const li = document.createElement("li");
            li.textContent = `${player.name}: ${player.score}`;
            lb.appendChild(li);
        });
    }

    function drawCar() {
        ctx.fillStyle = "#28d7ff";
        ctx.fillRect(car.x, car.y, car.width, car.height);
    }

    function moveCar() {
        if(keys["ArrowLeft"] && car.x > 0) car.x -= car.speed;
        if(keys["ArrowRight"] && car.x + car.width < canvas.width) car.x += car.speed;
    }

    function createObstacle() {
        const width = Math.random()*50 + 30;
        const x = Math.random()*(canvas.width - width);
        obstacles.push({x, y: -50, width, height: 30});
    }

    function drawObstacles() {
        ctx.fillStyle = "#ff4650";
        obstacles.forEach(obs=>{
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function moveObstacles() {
        obstacles.forEach(obs => obs.y += 4);
        obstacles = obstacles.filter(obs => obs.y < canvas.height);
    }

    function checkCollision() {
        for(let obs of obstacles){
            if(car.x < obs.x + obs.width &&
               car.x + car.width > obs.x &&
               car.y < obs.y + obs.height &&
               car.y + car.height > obs.y){
                   gameOver = true;
                   document.getElementById("finalScore").textContent = score;
                   document.getElementById("gameOverScreen").classList.remove("hidden");
               }
        }
    }

    function loop() {
        if(gameOver) return;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        moveCar();
        drawCar();
        moveObstacles();
        drawObstacles();
        checkCollision();
        score++;
        document.getElementById("score").textContent = score;

        if(score % 100 === 0) createObstacle();

        requestAnimationFrame(loop);
    }

    // Inicializa leaderboard
    updateLeaderboard();
    loop();
});
