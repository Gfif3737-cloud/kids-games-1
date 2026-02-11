const game = document.getElementById("game");
const size = 9;
let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: size - 1, y: size - 1 };
let playerEmoji = "🐻";
let goalEmoji = "🍊";

/* ---------- Персонажи ---------- */
const characters = {
  cheburashka: { player: "🐵", goal: "🍊" },
  pin: { player: "🐧", goal: "🚗" },
  matroskin: { player: "🐱", goal: "🐄" },
  masha: { player: "👧", goal: "🐻" }
};

/* ---------- Старт ---------- */
function startGame() {
  const choice = document.getElementById("characterSelect").value;
  playerEmoji = characters[choice].player;
  goalEmoji = characters[choice].goal;

  generateMaze();
  draw();
}

/* ---------- Генерация лабиринта (гарантированный выход) ---------- */
function generateMaze() {
  maze = Array(size).fill().map(() => Array(size).fill(1));

  function carve(x, y) {
    const dirs = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0]
    ].sort(() => Math.random() - 0.5);

    maze[y][x] = 0;

    for (const [dx, dy] of dirs) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
        maze[y + dy][x + dx] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);
  player = { x: 0, y: 0 };
  goal = { x: size - 1, y: size - 1 };
  maze[goal.y][goal.x] = 0;
}

/* ---------- Отрисовка ---------- */
function draw() {
  game.innerHTML = "";
  game.style.gridTemplateColumns = `repeat(${size}, 42px)`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (maze[y][x] === 1) cell.classList.add("wall");
      else cell.classList.add("path");

      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = playerEmoji;
      }

      if (x === goal.x && y === goal.y) {
        cell.classList.add("goal");
        cell.textContent = goalEmoji;
      }

      game.appendChild(cell);
    }
  }
}

/* ---------- Движение ---------- */
function move(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (
    nx >= 0 &&
    ny >= 0 &&
    nx < size &&
    ny < size &&
    maze[ny][nx] === 0
  ) {
    player.x = nx;
    player.y = ny;
    draw();

    if (player.x === goal.x && player.y === goal.y) {
      setTimeout(() => alert("🎉 Ты дошёл!"), 100);
    }
  }
}

/* ---------- Клавиатура ---------- */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
});

/* ---------- Свайпы ---------- */
let startX = 0, startY = 0;

game.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

game.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move(1, 0);
    if (dx < -30) move(-1, 0);
  } else {
    if (dy > 30) move(0, 1);
    if (dy < -30) move(0, -1);
  }
});