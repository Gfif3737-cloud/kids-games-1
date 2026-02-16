document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memoryGrid");
  const startBtn = document.getElementById("startBtn");
  const sizeSelect = document.getElementById("sizeSelect");
  const themeSelect = document.getElementById("themeSelect");

  // ==================== ДАННЫЕ ПЕРСОНАЖЕЙ С ФОТО ====================
  const themes = {
    smeshariki: {
      name: "Смешарики",
      chars: [
        { name: "Крош", img: "https://i.imgur.com/1.jpg" },
        { name: "Ёжик", img: "https://i.imgur.com/2.jpg" },
        { name: "Нюша", img: "https://i.imgur.com/3.jpg" },
        { name: "Бараш", img: "https://i.imgur.com/4.jpg" },
        { name: "Лосяш", img: "https://i.imgur.com/5.jpg" },
        { name: "Копатыч", img: "https://i.imgur.com/6.jpg" },
        { name: "Совунья", img: "https://i.imgur.com/7.jpg" },
        { name: "Пин", img: "https://i.imgur.com/8.jpg" }
      ]
    },
    prostokvashino: {
      name: "Простоквашино",
      chars: [
        { name: "Матроскин", img: "https://i.imgur.com/9.jpg" },
        { name: "Шарик", img: "https://i.imgur.com/10.jpg" },
        { name: "Дядя Фёдор", img: "https://i.imgur.com/11.jpg" },
        { name: "Печкин", img: "https://i.imgur.com/12.jpg" },
        { name: "Мурка", img: "https://i.imgur.com/13.jpg" },
        { name: "Гаврюша", img: "https://i.imgur.com/14.jpg" },
        { name: "Тётя Зина", img: "https://i.imgur.com/15.jpg" },
        { name: "Бобр", img: "https://i.imgur.com/16.jpg" }
      ]
    },
    fixiki: {
      name: "Фиксики",
      chars: [
        { name: "Нолик", img: "https://i.imgur.com/17.jpg" },
        { name: "Симка", img: "https://i.imgur.com/18.jpg" },
        { name: "Папус", img: "https://i.imgur.com/19.jpg" },
        { name: "Мася", img: "https://i.imgur.com/20.jpg" },
        { name: "Игрек", img: "https://i.imgur.com/21.jpg" },
        { name: "Верта", img: "https://i.imgur.com/22.jpg" },
        { name: "Дедус", img: "https://i.imgur.com/23.jpg" },
        { name: "Файер", img: "https://i.imgur.com/24.jpg" }
      ]
    },
    vinni: {
      name: "Винни Пух",
      chars: [
        { name: "Винни", img: "https://i.imgur.com/25.jpg" },
        { name: "Пятачок", img: "https://i.imgur.com/26.jpg" },
        { name: "Тигра", img: "https://i.imgur.com/27.jpg" },
        { name: "Кролик", img: "https://i.imgur.com/28.jpg" },
        { name: "Иа", img: "https://i.imgur.com/29.jpg" },
        { name: "Сова", img: "https://i.imgur.com/30.jpg" },
        { name: "Кенга", img: "https://i.imgur.com/31.jpg" },
        { name: "Ру", img: "https://i.imgur.com/32.jpg" }
      ]
    },
    masha: {
      name: "Маша и Медведь",
      chars: [
        { name: "Маша", img: "https://i.imgur.com/33.jpg" },
        { name: "Медведь", img: "https://i.imgur.com/34.jpg" },
        { name: "Панда", img: "https://i.imgur.com/35.jpg" },
        { name: "Розочка", img: "https://i.imgur.com/36.jpg" },
        { name: "Зайка", img: "https://i.imgur.com/37.jpg" },
        { name: "Волк", img: "https://i.imgur.com/38.jpg" },
        { name: "Белка", img: "https://i.imgur.com/39.jpg" },
        { name: "Ёжик", img: "https://i.imgur.com/40.jpg" }
      ]
    }
  };

  // ==================== УРОВНИ СЛОЖНОСТИ ====================
  const levels = {
    easy: {
      name: "🌟 Лёгкий",
      hideDelay: 1200,
      showAllAtStart: true,
      showTime: 3000
    },
    medium: {
      name: "⚡ Средний",
      hideDelay: 700,
      showAllAtStart: false
    },
    hard: {
      name: "🔥 Сложный",
      hideDelay: 350,
      showAllAtStart: false
    }
  };

  let currentLevel = "medium";
  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;
  let timer = 0;
  let timerInterval = null;
  let canOpen = false;

  // Создание панели выбора уровня
  function createLevelSelector() {
    const levelDiv = document.createElement("div");
    levelDiv.className = "level-selector";
    
    levelDiv.innerHTML = `
      <button class="level-btn" data-level="easy">🌟 Лёгкий</button>
      <button class="level-btn active" data-level="medium">⚡ Средний</button>
      <button class="level-btn" data-level="hard">🔥 Сложный</button>
    `;
    
    const controls = document.querySelector(".controls");
    controls.parentNode.insertBefore(levelDiv, controls.nextSibling);
    
    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".level-btn").forEach(b => 
          b.classList.remove("active")
        );
        e.target.classList.add("active");
        currentLevel = e.target.dataset.level;
      });
    });
  }

  // Создание панели статистики
  function createStatsPanel() {
    const oldStats = document.getElementById("statsPanel");
    if (oldStats) oldStats.remove();
    
    const statsDiv = document.createElement("div");
    statsDiv.id = "statsPanel";
    statsDiv.innerHTML = `<span>Ходы: 0</span><span>Время: 0с</span>`;
    grid.parentNode.insertBefore(statsDiv, grid);
  }

  function updateStats() {
    const statsDiv = document.getElementById("statsPanel");
    if (statsDiv) {
      statsDiv.innerHTML = `<span>Ходы: ${moves}</span><span>Время: ${timer}с</span>`;
    }
  }

  function startTimer() {
    stopTimer();
    timer = 0;
    updateStats();
    timerInterval = setInterval(() => {
      timer++;
      updateStats();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCards(theme, size) {
    const cols = 4;
    const rows = parseInt(size.split("x")[1]);
    const total = cols * rows;
    totalPairs = total / 2;

    const themeData = themes[theme];
    const chars = themeData.chars;
    
    let values = [];
    for (let i = 0; i < totalPairs; i++) {
      const char = chars[i % chars.length];
      values.push({ ...char });
      values.push({ ...char });
    }

    return shuffleArray(values);
  }

  function renderGrid(theme, size) {
    grid.innerHTML = "";
    createStatsPanel();

    const values = createCards(theme, size);
    const cols = 4;
    const level = levels[currentLevel];

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    firstCard = null;
    lock = false;
    canOpen = false;
    moves = 0;
    matchedPairs = 0;
    updateStats();

    // Создаём карточки
    values.forEach((char, index) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = index;
      card.dataset.name = char.name;
      card.dataset.img = char.img;
      
      // Рубашка (временно используем цвет, позже заменим на фото)
      card.style.backgroundImage = "url('https://i.imgur.com/back.jpg')";
      card.style.backgroundColor = "#2c3e50";
      
      card.onclick = () => flip(card);
      grid.appendChild(card);
    });

    // Для лёгкого уровня показываем все карточки в начале
    if (level.showAllAtStart) {
      canOpen = true;
      document.querySelectorAll(".memory-card").forEach(card => {
        card.style.backgroundImage = `url('${card.dataset.img}')`;
      });
      
      setTimeout(() => {
        document.querySelectorAll(".memory-card").forEach(card => {
          if (!card.classList.contains("matched")) {
            card.style.backgroundImage = "url('https://i.imgur.com/back.jpg')";
          }
        });
        canOpen = true;
      }, level.showTime || 3000);
    } else {
      canOpen = true;
    }

    startTimer();
  }

  function flip(card) {
    if (lock || !canOpen) return;
    if (card.classList.contains("open") || card.classList.contains("matched")) return;

    card.classList.add("open");
    card.style.backgroundImage = `url('${card.dataset.img}')`;

    if (!firstCard) {
      firstCard = card;
    } else {
      moves++;
      updateStats();
      
      if (firstCard.dataset.name === card.dataset.name) {
        firstCard.classList.add("matched");
        card.classList.add("matched");
        firstCard = null;
        matchedPairs++;
        
        if (matchedPairs === totalPairs) {
          stopTimer();
          setTimeout(() => {
            alert(`🎉 Победа! Ты сделал ${moves} ходов за ${timer} секунд!`);
          }, 300);
        }
      } else {
        lock = true;
        const level = levels[currentLevel];
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard.classList.remove("open");
          card.style.backgroundImage = "url('https://i.imgur.com/back.jpg')";
          firstCard.style.backgroundImage = "url('https://i.imgur.com/back.jpg')";
          firstCard = null;
          lock = false;
        }, level.hideDelay);
      }
    }
  }

  startBtn.onclick = () => {
    const theme = themeSelect.value;
    const size = sizeSelect.value;
    renderGrid(theme, size);
  };

  createLevelSelector();
  renderGrid("smeshariki", "4x4");
});