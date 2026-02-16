document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memoryGrid");
  const startBtn = document.getElementById("startBtn");
  const sizeSelect = document.getElementById("sizeSelect");
  const themeSelect = document.getElementById("themeSelect");

  // ==================== ДАННЫЕ ПЕРСОНАЖЕЙ (ГАРАНТИРОВАННО РАБОЧИЕ ССЫЛКИ) ====================
  const themes = {
    smeshariki: {
      name: "Смешарики",
      chars: [
        { 
          name: "Крош", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/krosh.png" 
        },
        { 
          name: "Ёжик", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/ezhik.png" 
        },
        { 
          name: "Нюша", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/nyusha.png" 
        },
        { 
          name: "Бараш", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/barash.png" 
        },
        { 
          name: "Лосяш", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/losyash.png" 
        },
        { 
          name: "Копатыч", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/kopatych.png" 
        },
        { 
          name: "Совунья", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/sovunya.png" 
        },
        { 
          name: "Пин", 
          img: "https://raw.githubusercontent.com/gfif3737-cloud/kids-games-1/main/images/pin.png" 
        }
      ]
    },
    prostokvashino: {
      name: "Простоквашино",
      chars: [
        { name: "Матроскин", img: "https://via.placeholder.com/200/F57C00/FFFFFF?text=Матроскин" },
        { name: "Шарик", img: "https://via.placeholder.com/200/F57C00/FFFFFF?text=Шарик" },
        { name: "Дядя Фёдор", img: "https://via.placeholder.com/200/F57C00/FFFFFF?text=Фёдор" },
        { name: "Печкин", img: "https://via.placeholder.com/200/F57C00/FFFFFF?text=Печкин" }
      ]
    },
    fixiki: {
      name: "Фиксики",
      chars: [
        { name: "Нолик", img: "https://via.placeholder.com/200/0000FF/FFFFFF?text=Нолик" },
        { name: "Симка", img: "https://via.placeholder.com/200/0000FF/FFFFFF?text=Симка" },
        { name: "Папус", img: "https://via.placeholder.com/200/0000FF/FFFFFF?text=Папус" },
        { name: "Мася", img: "https://via.placeholder.com/200/0000FF/FFFFFF?text=Мася" }
      ]
    },
    vinni: {
      name: "Винни Пух",
      chars: [
        { name: "Винни", img: "https://via.placeholder.com/200/FFD700/000000?text=Винни" },
        { name: "Пятачок", img: "https://via.placeholder.com/200/FFD700/000000?text=Пятачок" },
        { name: "Кролик", img: "https://via.placeholder.com/200/FFD700/000000?text=Кролик" },
        { name: "Иа", img: "https://via.placeholder.com/200/FFD700/000000?text=Иа" }
      ]
    },
    masha: {
      name: "Маша и Медведь",
      chars: [
        { name: "Маша", img: "https://via.placeholder.com/200/FF69B4/FFFFFF?text=Маша" },
        { name: "Медведь", img: "https://via.placeholder.com/200/FF69B4/FFFFFF?text=Медведь" },
        { name: "Панда", img: "https://via.placeholder.com/200/FF69B4/FFFFFF?text=Панда" },
        { name: "Зайка", img: "https://via.placeholder.com/200/FF69B4/FFFFFF?text=Зайка" }
      ]
    }
  };

  // Рубашка карточек
  const cardBackImage = "https://via.placeholder.com/200/2c3e50/FFFFFF?text=?";

  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;
  let timer = 0;
  let timerInterval = null;
  let canOpen = true;

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
      card.dataset.img = char.img;
      
      card.style.backgroundImage = `url('${cardBackImage}')`;
      card.style.backgroundSize = "contain";
      card.style.backgroundPosition = "center";
      card.style.backgroundRepeat = "no-repeat";
      card.style.backgroundColor = "#2c3e50";
      
      card.onclick = () => flip(card);
      grid.appendChild(card);
    });

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
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard.classList.remove("open");
          card.style.backgroundImage = `url('${cardBackImage}')`;
          firstCard.style.backgroundImage = `url('${cardBackImage}')`;
          firstCard = null;
          lock = false;
        }, 700);
      }
    }
  }

  startBtn.onclick = () => {
    const theme = themeSelect.value;
    const size = sizeSelect.value;
    renderGrid(theme, size);
  };

  renderGrid("smeshariki", "4x4");
});