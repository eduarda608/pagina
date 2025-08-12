
// Função para mudar a cor de fundo
function changeBackgroundColor() {
    const colors = ['#ff6347', '#32cd32', '#1e90ff', '#ffd700', '#8a2be2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}

// Adicionando um evento de clique no botão
document.getElementById('changeColorButton').addEventListener('click', changeBackgroundColor);
