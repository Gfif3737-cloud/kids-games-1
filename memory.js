document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memoryGrid");
  const startBtn = document.getElementById("startBtn");
  const sizeSelect = document.getElementById("sizeSelect");
  const themeSelect = document.getElementById("themeSelect");

  // ==================== ВСЕ ПЕРСОНАЖИ СО ВСЕХ МУЛЬТФИЛЬМОВ ====================
  const themes = {
    smeshariki: {
      name: "Смешарики",
      chars: [
        { name: "Крош", img: "https://i.postimg.cc/7Y0cZQk1/krosh.png" },
        { name: "Ёжик", img: "https://i.postimg.cc/jS0pX0Yh/ezhik.png" },
        { name: "Нюша", img: "https://i.postimg.cc/SKp0X0Yj/nyusha.png" },
        { name: "Бараш", img: "https://i.postimg.cc/QMp0X0Yk/barash.png" },
        { name: "Лосяш", img: "https://i.postimg.cc/6qp0X0Yl/losyash.png" },
        { name: "Копатыч", img: "https://i.postimg.cc/Dfp0X0Ym/kopatych.png" },
        { name: "Совунья", img: "https://i.postimg.cc/9fp0X0Yn/sovunya.png" },
        { name: "Пин", img: "https://i.postimg.cc/Bbp0X0Yo/pin.png" },
        { name: "Кар-Карыч", img: "https://i.postimg.cc/Kv0X0Yp/karkarych.png" },
        { name: "Биби", img: "https://i.postimg.cc/Hn0X0Yq/bibi.png" }
      ]
    },
    prostokvashino: {
      name: "Простоквашино",
      chars: [
        { name: "Матроскин", img: "https://i.postimg.cc/Fd0X0Yr/matroskin.png" },
        { name: "Шарик", img: "https://i.postimg.cc/Yq0X0Ys/sharik.png" },
        { name: "Дядя Фёдор", img: "https://i.postimg.cc/2y0X0Yt/fedor.png" },
        { name: "Печкин", img: "https://i.postimg.cc/4x0X0Yu/pechkin.png" },
        { name: "Галчонок", img: "https://i.postimg.cc/wv0X0Yv/galchonok.png" },
        { name: "Корова Мурка", img: "https://i.postimg.cc/7Y0X0Yw/murka.png" },
        { name: "Тётя Зина", img: "https://i.postimg.cc/jS0X0Yx/zina.png" },
        { name: "Бобр", img: "https://i.postimg.cc/SK0X0Yy/bobr.png" }
      ]
    },
    fixiki: {
      name: "Фиксики",
      chars: [
        { name: "Нолик", img: "https://i.postimg.cc/QM0X0Yz/nolik.png" },
        { name: "Симка", img: "https://i.postimg.cc/6q0X0Y1/simka.png" },
        { name: "Папус", img: "https://i.postimg.cc/Df0X0Y2/papus.png" },
        { name: "Мася", img: "https://i.postimg.cc/9f0X0Y3/masya.png" },
        { name: "Дедус", img: "https://i.postimg.cc/Bb0X0Y4/dedus.png" },
        { name: "Игрек", img: "https://i.postimg.cc/Hn0X0Y5/igrek.png" },
        { name: "Шпуля", img: "https://i.postimg.cc/Fd0X0Y6/shpulya.png" },
        { name: "Верта", img: "https://i.postimg.cc/Yq0X0Y7/verta.png" },
        { name: "Файер", img: "https://i.postimg.cc/2y0X0Y8/fayer.png" }
      ]
    },
    vinni: {
      name: "Винни Пух",
      chars: [
        { name: "Винни", img: "https://i.postimg.cc/4x0X0Y9/vinni.png" },
        { name: "Пятачок", img: "https://i.postimg.cc/wv0X0Z1/pyatachok.png" },
        { name: "Кролик", img: "https://i.postimg.cc/7Y0X0Z2/krolik.png" },
        { name: "Иа", img: "https://i.postimg.cc/jS0X0Z3/ia.png" },
        { name: "Сова", img: "https://i.postimg.cc/SK0X0Z4/sova.png" },
        { name: "Тигра", img: "https://i.postimg.cc/QM0X0Z5/tigra.png" },
        { name: "Кенга", img: "https://i.postimg.cc/6q0X0Z6/kenga.png" },
        { name: "Ру", img: "https://i.postimg.cc/Df0X0Z7/ru.png" }
      ]
    },
    masha: {
      name: "Маша и Медведь",
      chars: [
        { name: "Маша", img: "https://i.postimg.cc/9f0X0Z8/masha.png" },
        { name: "Медведь", img: "https://i.postimg.cc/Bb0X0Z9/medved.png" },
        { name: "Панда", img: "https://i.postimg.cc/Hn0X1A1/panda.png" },
        { name: "Розочка", img: "https://i.postimg.cc/Fd0X1A2/rozochka.png" },
        { name: "Зайка", img: "https://i.postimg.cc/Yq0X1A3/zayka.png" },
        { name: "Волк", img: "https://i.postimg.cc/2y0X1A4/volk.png" },
        { name: "Белка", img: "https://i.postimg.cc/4x0X1A5/belka.png" },
        { name: "Ёжик", img: "https://i.postimg.cc/wv0X1A6/ezhik-masha.png" }
      ]
    }
  };

  // Рубашка карточек
  const cardBackImage = "https://i.postimg.cc/Qt0X0Yp/back.jpg";

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