const game = document.getElementById("game");

/* ===== ЛИНИЯ ПАМЯТИ ===== */

function showPairs() {
  game.innerHTML = `
    <h2>🧠 Линия памяти</h2>
    <p>Выбери персонажей:</p>
    <div class="menu">
      <button onclick="startMemory('smeshariki')">🌈 Смешарики</button>
      <button onclick="startMemory('fixiki')">🔧 Фиксики</button>
      <button onclick="startMemory('masha')">🐻 Маша и Медведь</button>
      <button onclick="startMemory('winnie')">🍯 Винни Пух</button>
      <button onclick="startMemory('prostokvashino')">🐶 Простоквашино</button>
    </div>
  `;
}

function startMemory(theme) {
  const sets = {
    smeshariki: ["🐰","🐷","🐻","🦉"],
    fixiki: ["🔧","⚙️","🔋","💡"],
    masha: ["👧","🐻","🌲","🍯"],
    winnie: ["🐻","🍯","🐷","🐯"],
    prostokvashino: ["🐶","🐱","🐮","📮"]
  };

  const cards = [...sets[theme], ...sets[theme]];
  shuffle(cards);

  let opened = [];
  let matched = 0;

  game.innerHTML = `
    <h2>🧠 Найди пару</h2>
    <p>${themeName(theme)}</p>
    <div id="board" class="board"></div>
    <p id="status"></p>
    <button onclick="showPairs()">⬅ Назад</button>
  `;

  const board = document.getElementById("board");

  cards.forEach((emoji) => {
    const card = document.createElement("button");
    card.className = "card";
    card.textContent = "❓";
    card.onclick = () => flip(card, emoji);
    board.appendChild(card);
  });

  function flip(card, emoji) {
    if (opened.length === 2 || card.textContent !== "❓") return;

    card.textContent = emoji;
    opened.push({ card, emoji });

    if (opened.length === 2) {
      setTimeout(() => {
        if (opened[0].emoji === opened[1].emoji) {
          matched += 2;
          if (matched === cards.length) {
            document.getElementById("status").textContent = "🎉 Победа!";
          }
        } else {
          opened[0].card.textContent = "❓";
          opened[1].card.textContent = "❓";
        }
        opened = [];
      }, 700);
    }
  }
}

/* ===== ЛИНИЯ ЛАБИРИНТА (ТЕЛЕФОН) ===== */

function showMaze() {
  game.innerHTML = `
    <h2>🧩 Линия лабиринта</h2>
    <p>Выбери персонажа:</p>
    <div class="menu">
      <button onclick="startMaze('cheburashka')">🧸 Чебурашка → 🍊</button>
      <button onclick="startMaze('pin')">🤖 Пин → 🐝 Биби</button>
      <button onclick="startMaze('matroskin')">🐱 Матроскин → 🐄 Мурка</button>
      <button onclick="startMaze('mashaMaze')">👧 Маша → 🏠</button>
    </div>
  `;
}

function startMaze(hero) {
  const heroes = {
    cheburashka: { icon: "🧸", target: "🍊", text: "Чебурашка идёт к апельсину" },
    pin: { icon: "🤖", target: "🐝", text: "Пин идёт к Биби" },
    matroskin: { icon: "🐱", target: "🐄", text: "Матроскин идёт к Мурке" },
    mashaMaze: { icon: "👧", target: "🏠", text: "Маша идёт к дому Мишки" }
  };

  const heroData = heroes[hero];

  const maze = [
    "█████████",
    "█       █",
    "█ ███ █ █",
    "█   █   █",
    "███ ███ █",
    "█       █",
    "█████████"
  ];

  let y = 1, x = 1;
  const targetY = 5, targetX = 7;

  game.innerHTML = `
    <h2>🧩 ${heroData.text}</h2>
    <pre id="maze" class="maze"></pre>

    <div class="controls">
      <button onclick="move('up')">⬆</button>
      <div>
        <button onclick="move('left')">⬅</button>
        <button onclick="move('right')">➡</button>
      </div>
      <button onclick="move('down')">⬇</button>
    </div>

    <p id="mazeStatus"></p>
    <button onclick="showMaze()">⬅ Назад</button>
  `;

  window.move = function(dir) {
    let ny = y, nx = x;
    if (dir === "up") ny--;
    if (dir === "down") ny++;
    if (dir === "left") nx--;
    if (dir === "right") nx++;

    if (maze[ny][nx] !== "█") {
      y = ny;
      x = nx;
    }

    if (y === targetY && x === targetX) {
      document.getElementById("mazeStatus").textContent = "🎉 Цель достигнута!";
    }

    draw();
  };

  function draw() {
    let out = "";
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        if (i === y && j === x) out += heroData.icon;
        else if (i === targetY && j === targetX) out += heroData.target;
        else out += maze[i][j];
      }
      out += "\n";
    }
    document.getElementById("maze").textContent = out;
  }

  draw();
}

/* ===== ВСПОМОГАТЕЛЬНОЕ ===== */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function themeName(key) {
  return {
    smeshariki: "Смешарики",
    fixiki: "Фиксики",
    masha: "Маша и Медведь",
    winnie: "Винни Пух",
    prostokvashino: "Простоквашино"
  }[key];
}
