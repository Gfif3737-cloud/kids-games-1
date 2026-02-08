alert("JS работает!");
const game = document.getElementById("game");

function showPairs() {
  game.innerHTML = `
    <h2>🧠 Игра "Найди пару"</h2>
    <p>Нажми на карточки:</p>
    <div style="font-size:40px">
      🐶 🐱 🐶 🐱
    </div>
  `;
}

function showMaze() {
  game.innerHTML = `
    <h2>🧩 Лабиринт</h2>
    <p>Скоро здесь будет игра 😉</p>
  `;
}
