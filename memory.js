document.addEventListener("DOMContentLoaded", () => {
  // ==================== ЭЛЕМЕНТЫ ====================
  const grid = document.getElementById("memoryGrid");
  const startBtn = document.getElementById("startBtn");
  const sizeSelect = document.getElementById("sizeSelect");
  const themeSelect = document.getElementById("themeSelect");

  // ==================== ДАННЫЕ ПЕРСОНАЖЕЙ ====================
  const themes = {
    smeshariki: {
      name: "Смешарики",
      chars: [
        { name: "Крош", emoji: "🐰", color: "#FF69B4" },
        { name: "Ёжик", emoji: "🦔", color: "#8B4513" },
        { name: "Нюша", emoji: "🐷", color: "#FFB6C1" },
        { name: "Бараш", emoji: "🐑", color: "#87CEEB" },
        { name: "Лосяш", emoji: "🦌", color: "#FFD700" },
        { name: "Копатыч", emoji: "🐻", color: "#CD853F" },
        { name: "Совунья", emoji: "🦉", color: "#9370DB" },
        { name: "Пин", emoji: "🐧", color: "#4169E1" }
      ]
    },
    prostokvashino: {
      name: "Простоквашино",
      chars: [
        { name: "Матроскин", emoji: "🐱", color: "#FFA500" },
        { name: "Шарик", emoji: "🐶", color: "#DEB887" },
        { name: "Дядя Фёдор", emoji: "👦", color: "#98FB98" },
        { name: "Печкин", emoji: "📮", color: "#708090" },
        { name: "Галчонок", emoji: "🐦", color: "#000000" },
        { name: "Мурка", emoji: "🐄", color: "#FFFFFF" },
        { name: "Тётя Зина", emoji: "👩", color: "#FFB6C1" },
        { name: "Бобр", emoji: "🦫", color: "#8B4513" }
      ]
    },
    fixiki: {
      name: "Фиксики",
      chars: [
        { name: "Нолик", emoji: "0️⃣", color: "#00BFFF" },
        { name: "Симка", emoji: "1️⃣", color: "#FF69B4" },
        { name: "Папус", emoji: "👨", color: "#4169E1" },
        { name: "Мася", emoji: "👩", color: "#FFA500" },
        { name: "Дедус", emoji: "👴", color: "#708090" },
        { name: "Игрек", emoji: "🔧", color: "#FFD700" },
        { name: "Шпуля", emoji: "🧵", color: "#9370DB" },
        { name: "Верта", emoji: "🔩", color: "#00FF00" },
        { name: "Файер", emoji: "🔥", color: "#FF4500" }
      ]
    },
    vinni: {
      name: "Винни Пух",
      chars: [
        { name: "Винни", emoji: "🐻", color: "#CD853F" },
        { name: "Пятачок", emoji: "🐖", color: "#FFB6C1" },
        { name: "Кролик", emoji: "🐇", color: "#87CEEB" },
        { name: "Иа", emoji: "🐴", color: "#708090" },
        { name: "Сова", emoji: "🦉", color: "#9370DB" },
        { name: "Тигра", emoji: "🐯", color: "#FFA500" },
        { name: "Кенга", emoji: "🦘", color: "#8B4513" },
        { name: "Ру", emoji: "👶", color: "#FFB6C1" }
      ]
    },
    masha: {
      name: "Маша и Медведь",
      chars: [
        { name: "Маша", emoji: "👧", color: "#FF69B4" },
        { name: "Медведь", emoji: "🐻", color: "#8B4513" },
        { name: "Панда", emoji: "🐼", color: "#000000" },
        { name: "Розочка", emoji: "🌸", color: "#FFB6C1" },
        { name: "Зайка", emoji: "🐰", color: "#87CEEB" },
        { name: "Волк", emoji: "🐺", color: "#708090" },
        { name: "Белка", emoji: "🐿️", color: "#FFA500" },
        { name: "Ёжик", emoji: "🦔", color: "#8B4513" }
      ]
    }
  };

  // ==================== ПЕРЕМЕННЫЕ ====================
  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;
  let timer = 0;
  let timerInterval = null;
  let canOpen = true;

  // Для отслеживания пройденных размеров
  let completedSizes = JSON.parse(localStorage.getItem("memory_completed")) || [];

  // ==================== СИСТЕМА АРТЕФАКТОВ ====================
  let artifacts = JSON.parse(localStorage.getItem("metro_artifacts")) || {
    wagons: [false, false, false, false, false, false, false, false, false, false],
    stations: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    tickets: [false, false, false, false, false, false, false, false],
    interiors: [false, false, false, false, false, false, false, false, false, false, false, false],
    uniforms: [false, false, false, false, false, false],
    equipment: [false, false, false, false, false, false, false, false, false],
    construction: [false, false, false, false, false, false, false],
    bonus: [false, false, false]
  };

  // Данные артефактов для памяти
  const artifactNames = [
    "Первый билет (1935)",
    "Жетон «Метро» (1961)",
    "Билет на 5 поездок (1970)",
    "Проездной на месяц (1980)"
  ];

  // Рубашка карточек
  const cardBackStyle = {
    backgroundColor: "#2c3e50",
    text: "❓",
    color: "white"
  };

  // ==================== ФУНКЦИЯ ВЫДАЧИ АРТЕФАКТА ====================
  function giveArtifact(artifactIndex) {
    if (!artifacts.tickets[artifactIndex]) {
      artifacts.tickets[artifactIndex] = true;
      localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
      
      setTimeout(() => {
        alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${artifactNames[artifactIndex]}\n\nЗагляни в Музей метро!`);
      }, 500);
    }
  }

  // ==================== ФУНКЦИИ ====================
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

  function checkAndGiveArtifact(size) {
    const sizeIndex = {
      "4x2": 0,
      "4x3": 1,
      "4x4": 2,
      "4x5": 3
    }[size];

    if (sizeIndex !== undefined && !completedSizes.includes(size)) {
      completedSizes.push(size);
      localStorage.setItem("memory_completed", JSON.stringify(completedSizes));
      giveArtifact(sizeIndex);
    }
  }

  function renderGrid(theme, size) {
    grid.innerHTML = "";
    createStatsPanel();

    const values = createCards(theme, size);
    const cols = 4;

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    firstCard = null;
    lock = false;
    moves = 0;
    matchedPairs = 0;
    canOpen = true;
    updateStats();

    values.forEach((char, index) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = index;
      card.dataset.name = char.name;
      card.dataset.emoji = char.emoji;
      card.dataset.color = char.color;
      
      card.style.backgroundImage = "none";
      card.style.backgroundColor = cardBackStyle.backgroundColor;
      card.style.color = cardBackStyle.color;
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.justifyContent = "center";
      card.style.fontSize = "24px";
      card.textContent = cardBackStyle.text;
      
      card.onclick = () => flip(card, size);
      grid.appendChild(card);
    });

    startTimer();
  }

  function flip(card, currentSize) {
    if (lock || !canOpen) return;
    if (card.classList.contains("open") || card.classList.contains("matched")) return;

    card.classList.add("open");
    card.style.backgroundColor = card.dataset.color;
    card.style.color = "white";
    card.style.fontSize = "32px";
    card.textContent = card.dataset.emoji;

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
          checkAndGiveArtifact(currentSize);
          setTimeout(() => {
            alert(`🎉 Победа! Ты сделал ${moves} ходов за ${timer} секунд!`);
          }, 300);
        }
      } else {
        lock = true;
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard.classList.remove("open");
          
          card.style.backgroundColor = cardBackStyle.backgroundColor;
          card.style.color = cardBackStyle.color;
          card.style.fontSize = "24px";
          card.textContent = cardBackStyle.text;
          
          firstCard.style.backgroundColor = cardBackStyle.backgroundColor;
          firstCard.style.color = cardBackStyle.color;
          firstCard.style.fontSize = "24px";
          firstCard.textContent = cardBackStyle.text;
          
          firstCard = null;
          lock = false;
        }, 700);
      }
    }
  }

  // ==================== СЛУШАТЕЛИ ====================
  startBtn.onclick = () => {
    const theme = themeSelect.value;
    const size = sizeSelect.value;
    renderGrid(theme, size);
  };

  // ==================== ЗАПУСК ====================
  renderGrid("smeshariki", "4x4");
});