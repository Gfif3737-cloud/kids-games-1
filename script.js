const game = document.getElementById("game");

/* =======================
   ГЛАВНОЕ МЕНЮ
======================= */

function showHome() {
  game.innerHTML = "";
}

function showPairs() {
  game.innerHTML = `
    <h2>🔴 Линия памяти</h2>
    <p>Выбери персонажей:</p>
    <button onclick="startMemory('smeshariki')">🌈 Смешарики</button>
    <button onclick="startMemory('fixiki')">🔧 Фиксики</button>
    <button onclick="startMemory('masha')">🐻 Маша и Медведь</button>
    <button onclick="startMemory('winnie')">🍯 Винни Пух</button>
    <button onclick="startMemory('prostokvashino')">🐱 Простоквашино</button>
    <br><br>
    <button onclick="showHome()">⬅ Назад</button>
  `;
}

function showMaze() {
  game.innerHTML = `
    <h2>🔵 Линия лабиринта</h2>
    <p>Выбери героя:</p>
    <button onclick="startMaze('cheburashka')">🐻 Чебурашка → 🍊</button>
    <button onclick="startMaze('pin')">🤖 Пин → Биби</button>
    <button onclick="startMaze('matroskin')">🐱 Матроскин → 🐄 Мурка</button>
    <button onclick="startMaze('masha')">👧 Маша → 🏠 Мишка</button>
    <br><br>
    <button onclick="showHome()">⬅ Назад</button>
  `;
}

/* =======================
   ЛАБИРИНТ (НОВЫЙ)
======================= */

const mazeLevels = [
  [
    "########",
    "#S.....#",
    "#.###.#.#",
    "#...#.#.#",
    "###.#.#.#",
    "#.....#E",
    "########"
  ],
  [
    "#########",
    "#S..#...#",
    "#.#.#.#.#",
    "#.#...#.#",
    "#.#####.#",
    "#.......E",
    "#########"
  ],
  [
    "#########",
    "#S..#...#",
    "##.#.#.#.#",
    "#..#.#.#.#",
    "#.##.#.#.#",
    "#.....#..E",
    "#########"
  ]
];

let mazeLevel = 0;
let maze;
let player = { x: 0, y: 0 };
let goal = { x: 0, y: 0 };
let heroEmoji = "";
let goalEmoji = "";
let mazeChar = "";

const mazeHeroes = {
  cheburashka: { hero: "🐻", goal: "🍊", text: "Чебурашка идёт к апельсину 🍊" },
  pin: { hero: "🤖", goal: "🐧", text: "Пин идёт к Биби 🤖" },
  matroskin: { hero: "🐱", goal: "🐄", text: "Матроскин идёт к Мурке 🐄" },
  masha: { hero: "👧", goal: "🏠", text: "Маша идёт к дому Мишки 🏠" }
};

function startMaze(type) {
  mazeLevel = 0;
  mazeChar = type;
  heroEmoji = mazeHeroes[type].hero;
  goalEmoji = mazeHeroes[type].goal;
  loadMaze();
}

function loadMaze() {
  maze = mazeLevels[mazeLevel].map(r => r.split(""));

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "S") {
        player = { x, y };
        maze[y][x] = ".";
      }
      if (maze[y][x] === "E") {
        goal = { x, y };
        maze[y][x] = ".";
      }
    }
  }

  drawMaze();
}

function drawMaze() {
  let html = `
    <h2>${mazeHeroes[mazeChar].text}</h2>
    <p>Уровень ${mazeLevel + 1}</p>
    <div id="maze" style="display:grid;grid-template-columns:repeat(${maze[0].length},40px);gap:6px;justify-content:center;margin:20px 0;">
  `;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      let cell = maze[y][x];
      let content = "";
      let bg = "#111";

      if (x === player.x && y === player.y) {
        content = heroEmoji;
        bg = "#ffe066";
      } else if (x === goal.x && y === goal.y) {
        content = goalEmoji;
        bg = "#9cff9c";
      } else if (cell === "#") {
        bg = "#000";
      } else {
        bg = "#eee";
      }

      html += `<div style="
        width:40px;
        height:40px;
        border-radius:8px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        background:${bg};
      ">${content}</div>`;
    }
  }

  html += `
    </div>

    <div class="controls">
      <button onclick="movePlayer(0,-1)">⬆</button><br>
      <button onclick="movePlayer(-1,0)">⬅</button>
      <button onclick="movePlayer(1,0)">➡</button><br>
      <button onclick="movePlayer(0,1)">⬇</button>
    </div>

    <br>
    <button onclick="showMaze()">⬅ Назад</button>
  `;

  game.innerHTML = html;
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (maze[ny][nx] === "#") return;

  player.x = nx;
  player.y = ny;

  if (player.x === goal.x && player.y === goal.y) {
    setTimeout(() => {
      mazeLevel++;
      if (mazeLevel >= mazeLevels.length) {
        game.innerHTML = `
          <h2>🎉 Победа!</h2>
          <p>Все уровни пройдены!</p>
          <button onclick="showMaze()">🔁 Снова</button>
          <br><br>
          <button onclick="showHome()">⬅ В меню</button>
        `;
      } else {
        loadMaze();
      }
    }, 300);
    return;
  }

  drawMaze();
}

/* =======================
   ЛИНИЯ ПАМЯТИ
   ❗ НЕ МЕНЯЛАСЬ
======================= */

// ← здесь оставь свой существующий код памяти без изменений