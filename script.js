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

    // Jogador 1 usa tecla 'A'
    if (event.key === "a" || event.key === "A") {
        car1.style.left = (car1.offsetLeft + 20) + "px";
    }

    // Jogador 2 usa tecla 'L'
    if (event.key === "l" || event.key === "L") {
        car2.style.left = (car2.offsetLeft + 20) + "px";
    }

    // Verifica vencedor
    let trackWidth = car1.parentElement.offsetWidth;
    if (car1.offsetLeft + car1.offsetWidth >= trackWidth) {
        document.getElementById("winner").innerText = player1Name + " venceu! 🏆";
        winner = true;
    }
    if (car2.offsetLeft + car2.offsetWidth >= trackWidth) {
        document.getElementById("winner").innerText = player2Name + " venceu! 🏆";
        winner = true;
    }
}

function restartGame() {
    location.reload();
}
