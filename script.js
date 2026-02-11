const game = document.getElementById("game");

/* =========================
   ===== ГЛАВНОЕ МЕНЮ =====
   ========================= */

function showMainMenu() {
  game.innerHTML = "";
}
showMainMenu();

/* =====================================================
   ================= ЛИНИЯ ПАМЯТИ ======================
   ===================================================== */

const memoryCharacterSets = {
  smeshariki: {
    name: "Смешарики",
    cards: ["🐰","🐷","🐼","🦊","🐻","🐸","🐧","🐨","🐯","🦁"]
  },
  fixiki: {
    name: "Фиксики",
    cards: ["🔧","⚙️","🔌","💡","🔋","📡","📟","🧲","🪛","🔦"]
  },
  masha: {
    name: "Маша и Медведь",
    cards: ["👧","🐻","🍯","🏡","🐝","🌲","🐾","🍓","🫖","🎀"]
  },
  winnie: {
    name: "Винни-Пух",
    cards: ["🐻","🐷","🐯","🐰","🍯","🎈","🌳","🦉","🥕","🍎"]
  },
  prostokvashino: {
    name: "Простоквашино",
    cards: ["🐱","🐶","🐄","👦","📸","🧀","🥛","🏡","📬","🚜"]
  }
};

let currentMemorySet = null;

function showMemoryMenu() {
  game.innerHTML = `
    <h2>🔴 Линия памяти</h2>
    <p>Выбери персонажей</p>
    ${Object.keys(memoryCharacterSets).map(k =>
      `<button class="line red" onclick="selectMemorySet('${k}')">${memoryCharacterSets[k].name}</button>`
    ).join("")}
  `;
}

function selectMemorySet(key) {
  currentMemorySet = memoryCharacterSets[key];
  game.innerHTML = `
    <h2>🔴 ${currentMemorySet.name}</h2>
    <p>Выбери сложность</p>
    <button class="line red" onclick="startMemory(8)">8 карточек</button>
    <button class="line red" onclick="startMemory(12)">12 карточек</button>
    <button class="line red" onclick="startMemory(16)">16 карточек</button>
    <button class="line red" onclick="startMemory(20)">20 карточек</button>
  `;
}

function startMemory(count) {
  const pairs = count / 2;
  const cards = currentMemorySet.cards.slice(0, pairs);
  const deck = [...cards, ...cards].sort(() => Math.random() - 0.5);

  game.innerHTML = `
    <h2>🔴 ${currentMemorySet.name}</h2>
    <div id="memory" class="grid"></div>
  `;

  const grid = document.getElementById("memory");
  grid.style.gridTemplateColumns = `repeat(4, 1fr)`; // всегда 4 в ширину

  let first = null;
  let lock = false;
  let matched = 0;

  deck.forEach(emoji => {
    const card = document.createElement("div");
    card.className = "cell hidden";
    card.onclick = () => {
      if (lock || card.classList.contains("open")) return;
      card.textContent = emoji;
      card.classList.add("open");

      if (!first) {
        first = card;
      } else {
        lock = true;
        if (first.textContent === card.textContent) {
          matched += 2;
          first = null;
          lock = false;
          if (matched === count) {
            setTimeout(() => alert("🎉 Победа!"), 300);
          }
        } else {
          setTimeout(() => {
            first.textContent = "";
            card.textContent = "";
            first.classList.remove("open");
            card.classList.remove("open");
            first = null;
            lock = false;
          }, 700);
        }
      }
    };
    grid.appendChild(card);
  });
}

/* =====================================================
   ================= ЛИНИЯ ЛАБИРИНТА ===================
   ===================================================== */

const mazeCharacters = {
  cheburashka: { icon: "🐵", goal: "🍊", title: "Чебурашка идёт к мандарину" },
  pin: { icon: "🐧", goal: "🚗", title: "Пин идёт к Биби" },
  matroskin: { icon: "🐱", goal: "🐄", title: "Матроскин идёт к Мурке" },
  masha: { icon: "👧", goal: "🐻", title: "Маша идёт к Мишке" }
};

let mazeGrid, playerPos, goalPos;
let currentMazeChar = null;
let mazeLevel = 1;

function showMazeMenu() {
  game.innerHTML = `
    <h2>🔵 Линия лабиринта</h2>
    <p>Выбери персонажа</p>
    <button class="line blue" onclick="startMaze('cheburashka')">🐵 Чебурашка → 🍊</button>
    <button class="line blue" onclick="startMaze('pin')">🐧 Пин → 🚗</button>
    <button class="line blue" onclick="startMaze('matroskin')">🐱 Матроскин → 🐄</button>
    <button class="line blue" onclick="startMaze('masha')">👧 Маша → 🐻</button>
  `;
}

function generateMaze(size = 9) {
  if (size % 2 === 0) size++;

  const maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 1)
  );

  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (ny > 0 && ny < size - 1 && nx > 0 && nx < size - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  maze[size - 2][size - 2] = 0;
  return maze;
}

function startMaze(characterKey) {
  currentMazeChar = mazeCharacters[characterKey];
  mazeLevel = 1;
  newMazeLevel();
}

function newMazeLevel() {
  const size = 9 + Math.min(mazeLevel - 1, 8);
  mazeGrid = generateMaze(size);
  playerPos = { x: 1, y: 1 };
  goalPos = { x: mazeGrid.length - 2, y: mazeGrid.length - 2 };
  renderMaze();
  setupControls();
}

function renderMaze() {
  game.innerHTML = `
    <h2>🔵 ${currentMazeChar.title}</h2>
    <p>Уровень ${mazeLevel}</p>
    <div id="maze" class="grid"></div>
    <div class="controls">
      <button onclick="movePlayer(0,-1)">⬆️</button><br>
      <button onclick="movePlayer(-1,0)">⬅️</button>
      <button onclick="movePlayer(1,0)">➡️</button><br>
      <button onclick="movePlayer(0,1)">⬇️</button>
    </div>
  `;

  const mazeDiv = document.getElementById("maze");
  mazeDiv.style.gridTemplateColumns = `repeat(${mazeGrid.length}, 1fr)`;

  mazeGrid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const d = document.createElement("div");
      d.className = "cell";
      if (x === playerPos.x && y === playerPos.y) {
        d.classList.add("player");
        d.textContent = currentMazeChar.icon;
      } else if (x === goalPos.x && y === goalPos.y) {
        d.classList.add("goal");
        d.textContent = currentMazeChar.goal;
      } else if (cell === 1) {
        d.classList.add("wall");
      } else {
        d.classList.add("path");
      }
      mazeDiv.appendChild(d);
    });
  });
}

function movePlayer(dx, dy) {
  const nx = playerPos.x + dx;
  const ny = playerPos.y + dy;
  if (mazeGrid[ny] && mazeGrid[ny][nx] === 0) {
    playerPos = { x: nx, y: ny };
    renderMaze();
    if (nx === goalPos.x && ny === goalPos.y) {
      setTimeout(() => {
        mazeLevel++;
        newMazeLevel();
      }, 300);
    }
  }
}

function setupControls() {
  document.onkeydown = e => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  };

  let startX, startY;
  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  document.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) movePlayer(1, 0);
      if (dx < -30) movePlayer(-1, 0);
    } else {
      if (dy > 30) movePlayer(0, 1);
      if (dy < -30) movePlayer(0, -1);
    }
  });
}

/* =====================================================
   ============ ТРИ В РЯД — МЕТРО ======================
   ===================================================== */

function showMatch3() {
  match3Level = 0;
  match3Progress = [];
  initMatch3();
}

const metroLines = [
  { name: "Сокольническая", color: "#dc2626", stations: 26 },
  { name: "Замоскворецкая", color: "#16a34a", stations: 24 },
  { name: "Арбатско-Покровская", color: "#2563eb", stations: 22 },
  { name: "Филёвская", color: "#60a5fa", stations: 13 },
  { name: "Кольцевая", color: "#92400e", stations: 12 }
];

let match3Level = 0;
let match3Progress = [];

function initMatch3() {
  if (match3Level === 0) {
    metroLines.forEach(l => {
      match3Progress.push({
        name: l.name,
        color: l.color,
        total: l.stations,
        filled: 0
      });
    });
  }
  startMatch3Level();
}

function startMatch3Level() {
  const size = 6;
  const colors = metroLines.map(l => l.color);
  let grid = [];

  function randomColor(x, y) {
    let color;
    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (
      (x >= 2 && grid[y][x - 1] === color && grid[y][x - 2] === color) ||
      (y >= 2 && grid[y - 1][x] === color && grid[y - 2][x] === color)
    );
    return color;
  }

  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      grid[y][x] = randomColor(x, y);
    }
  }

  game.innerHTML = `
    <h2>🟣 Три в ряд — Метро</h2>
    <p>Собирай цвета — открывай станции</p>
    <div id="match3" class="grid"></div>
    <div id="metroMap" class="metro-map"></div>
  `;

  const gridDiv = document.getElementById("match3");
  gridDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  const mapDiv = document.getElementById("metroMap");

  let selected = null;

  function renderMetroMap() {
    mapDiv.innerHTML = "<h3>🚇 Карта метро</h3>";
    match3Progress.forEach(line => {
      const wrapper = document.createElement("div");
      const label = document.createElement("div");
      label.className = "line-label";
      label.textContent = `${line.name} (${line.filled}/${line.total})`;
      label.style.color = line.color;

      const row = document.createElement("div");
      row.className = "metro-line";

      for (let i = 0; i < line.total; i++) {
        const st = document.createElement("div");
        st.className = "station";
        if (i < line.filled) {
          st.classList.add("filled");
          st.style.background = line.color;
          st.style.borderColor = line.color;
        } else {
          st.style.borderColor = line.color;
        }
        row.appendChild(st);
      }

      wrapper.appendChild(label);
      wrapper.appendChild(row);
      mapDiv.appendChild(wrapper);
    });
  }

  function render() {
    gridDiv.innerHTML = "";
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        const d = document.createElement("div");
        d.className = "cell";
        d.style.background = color;
        d.onclick = () => select(x, y);
        gridDiv.appendChild(d);
      });
    });
    renderMetroMap();
  }

  function select(x, y) {
    if (!selected) {
      selected = { x, y };
      return;
    }
    const dx = Math.abs(selected.x - x);
    const dy = Math.abs(selected.y - y);
    if (dx + dy === 1) {
      [grid[y][x], grid[selected.y][selected.x]] =
        [grid[selected.y][selected.x], grid[y][x]];
      if (!checkMatches()) {
        [grid[y][x], grid[selected.y][selected.x]] =
          [grid[selected.y][selected.x], grid[y][x]];
      }
    }
    selected = null;
    render();
  }

  function addStation(color) {
    const line = match3Progress.find(l => l.color === color);
    if (line && line.filled < line.total) {
      line.filled++;
    }
  }

  function checkMatches() {
    let found = false;
    const remove = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => false)
    );

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size - 2; x++) {
        const c = grid[y][x];
        if (c && grid[y][x + 1] === c && grid[y][x + 2] === c) {
          remove[y][x] = remove[y][x + 1] = remove[y][x + 2] = true;
          addStation(c);
          found = true;
        }
      }
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size - 2; y++) {
        const c = grid[y][x];
        if (c && grid[y + 1][x] === c && grid[y + 2][x] === c) {
          remove[y][x] = remove[y + 1][x] = remove[y + 2][x] = true;
          addStation(c);
          found = true;
        }
      }
    }

    if (!found) return false;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (remove[y][x]) grid[y][x] = null;
      }
    }

    drop();
    setTimeout(checkMatches, 150);
    return true;
  }

  function drop() {
    for (let x = 0; x < size; x++) {
      let col = [];
      for (let y = size - 1; y >= 0; y--) {
        if (grid[y][x]) col.push(grid[y][x]);
      }
      while (col.length < size) {
        col.push(colors[Math.floor(Math.random() * colors.length)]);
      }
      for (let y = size - 1; y >= 0; y--) {
        grid[y][x] = col[size - 1 - y];
      }
    }
    render();

    checkLevelComplete();
  }

  function checkLevelComplete() {
    const completed = match3Progress.every(l => l.filled >= l.total);
    if (completed) {
      showFinalMetroScreen();
    }
  }

  render();
}

/* =========================
   ==== ЭКРАН МЕТРО ========
   ========================= */

function showFinalMetroScreen() {
  game.innerHTML = `
    <div class="big-screen">
      <h2>🎉 Ты собрал метро!</h2>
      <p>Вот карта станций, которые ты открыл:</p>
      <div id="finalMetro" class="metro-map"></div>
      <button class="line purple" onclick="showMainMenu()">В меню</button>
    </div>
  `;

  const mapDiv = document.getElementById("finalMetro");

  match3Progress.forEach(line => {
    const wrapper = document.createElement("div");
    const label = document.createElement("div");
    label.className = "line-label";
    label.textContent = `${line.name} (${line.filled}/${line.total})`;
    label.style.color = line.color;

    const row = document.createElement("div");
    row.className = "metro-line";

    for (let i = 0; i < line.total; i++) {
      const st = document.createElement("div");
      st.className = "station filled";
      st.style.background = line.color;
      st.style.borderColor = line.color;
      row.appendChild(st);
    }

    wrapper.appendChild(label);
    wrapper.appendChild(row);
    mapDiv.appendChild(wrapper);
  });
}