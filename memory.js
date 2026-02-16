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
        { name: "Крош", img: "https://static.wikia.nocookie.net/smeshariki/images/8/8f/Krosh.png" },
        { name: "Ёжик", img: "https://static.wikia.nocookie.net/smeshariki/images/2/20/Yozhik.png" },
        { name: "Нюша", img: "https://static.wikia.nocookie.net/smeshariki/images/8/85/Nyusha.png" },
        { name: "Бараш", img: "https://static.wikia.nocookie.net/smeshariki/images/3/39/Barash.png" },
        { name: "Лосяш", img: "https://static.wikia.nocookie.net/smeshariki/images/e/ed/Losyash.png" },
        { name: "Копатыч", img: "https://static.wikia.nocookie.net/smeshariki/images/1/14/Kopatych.png" },
        { name: "Совунья", img: "https://static.wikia.nocookie.net/smeshariki/images/6/64/Sovunya.png" },
        { name: "Пин", img: "https://static.wikia.nocookie.net/smeshariki/images/2/23/Pin.png" }
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
        { name: "Гаврюша", img: "https://i.imgur.com/14.jpg" }
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
        { name: "Верта", img: "https://i.imgur.com/22.jpg" }
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
        { name: "Сова", img: "https://i.imgur.com/30.jpg" }
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
        { name: "Волк", img: "https://i.imgur.com/38.jpg" }
      ]
    }
  };

  let firstCard = null;
  let lock = false;
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;
  let timer = 0;
  let timerInterval = null;
  let canOpen = true;

  // Рубашка карточек
  const cardBackImage = "https://i.imgur.com/back.jpg";

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
      card.style.backgroundColor = "#2c3e50";
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
      
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