document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memoryGrid");
  const startBtn = document.getElementById("startBtn");
  const sizeSelect = document.getElementById("sizeSelect");
  const themeSelect = document.getElementById("themeSelect");

  // ==================== ВСЕ ПЕРСОНАЖИ (МОИ РАБОЧИЕ ССЫЛКИ) ====================
  const themes = {
    smeshariki: {
      name: "Смешарики",
      chars: [
        { name: "Крош", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/krosh.png" },
        { name: "Ёжик", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/ezhik.png" },
        { name: "Нюша", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/nyusha.png" },
        { name: "Бараш", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/barash.png" },
        { name: "Лосяш", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/losyash.png" },
        { name: "Копатыч", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/kopatych.png" },
        { name: "Совунья", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/sovunya.png" },
        { name: "Пин", img: "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/pin.png" }
      ]
    }
  };

  const cardBackImage = "https://raw.githubusercontent.com/Cosmos-Fork/kids-games-1/refs/heads/main/images/back.jpg";

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