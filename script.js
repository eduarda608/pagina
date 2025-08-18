let player1Name, player2Name;
let car1, car2;
let winner = false;

function startGame() {
    player1Name = document.getElementById("player1").value || "Jogador 1";
    player2Name = document.getElementById("player2").value || "Jogador 2";

    document.getElementById("input-nomes").style.display = "none";
    document.getElementById("game").style.display = "block";

    car1 = document.getElementById("car1");
    car2 = document.getElementById("car2");

    document.addEventListener("keydown", moveCar);
}

function moveCar(event) {
    if (winner) return;

    const trackWidth = car1.parentElement.offsetWidth - car1.offsetWidth;

    // Jogador 1 usa tecla 'A'
    if (event.key === "a" || event.key === "A") {
        car1.style.left = Math.min(car1.offsetLeft + 20, trackWidth) + "px";
    }

    // Jogador 2 usa tecla 'L'
    if (event.key === "l" || event.key === "L") {
        car2.style.left = Math.min(car2.offsetLeft + 20, trackWidth) + "px";
    }

    // Verifica vencedor
    if (car1.offsetLeft >= trackWidth) {
        document.getElementById("winner").innerText = player1Name + " venceu! 🏆";
        winner = true;
    }
    if (car2.offsetLeft >= trackWidth) {
        document.getElementById("winner").innerText = player2Name + " venceu! 🏆";
        winner = true;
    }
}

function restartGame() {
    location.reload();
}
