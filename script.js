let pos1 = 0;
let pos2 = 0;
const limite = 800; // distância para vencer
const carro1 = document.getElementById("jogador1");
const carro2 = document.getElementById("jogador2");
const mensagem = document.getElementById("mensagem");
const somVitoria = document.getElementById("somVitoria");
const somPasso = document.getElementById("somPasso");

document.addEventListener("keydown", (event) => {
    if (mensagem.textContent) return; // se já acabou

    if (event.key.toLowerCase() === "a") {
        pos1 += 20;
        carro1.style.left = pos1 + "px";
        somPasso.play();
    }
    if (event.key.toLowerCase() === "l") {
        pos2 += 20;
        carro2.style.left = pos2 + "px";
        somPasso.play();
    }

    if (pos1 >= limite) {
        mensagem.textContent = "🚗 Jogador 1 venceu!";
        somVitoria.play();
    } else if (pos2 >= limite) {
        mensagem.textContent = "🚙 Jogador 2 venceu!";
        somVitoria.play();
    }
});
