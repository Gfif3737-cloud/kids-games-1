const grid = document.getElementById("memoryGrid");
const startBtn = document.getElementById("startBtn");
const sizeSelect = document.getElementById("sizeSelect");
const themeSelect = document.getElementById("themeSelect");

const themes = {
  smeshariki: ["Крош", "Ёжик", "Нюша", "Бараш", "Лосяш", "Копатыч"],
  prostokvashino: ["Матроскин", "Шарик", "Дядя Фёдор", "Печкин", "Мурка", "Гаврюша"],
  fixiki: ["Нолик", "Симка", "Папус", "Мася", "Игрек", "Верта"],
  vinni: ["Винни", "Пятачок", "Тигра", "Кролик", "Иа", "Сова"],
  masha: ["Маша", "Медведь", "Панда", "Розочка", "Зайка", "Волк"],
};

let firstCard = null;
let lock = false;

startBtn.onclick = startGame;

function startGame() {
  const size = sizeSelect.value;
  const cols = 4;
  const rows = parseInt(size.split("x")[1]);
  const total = cols * rows;
  const pairs = total / 2;

  const base = themes[themeSelect.value];
  let values = [];

  for (let i = 0; i < pairs; i++) {
    values.push(base[i % base.length]);
    values.push(base[i % base.length]);
  }

  values = shuffle(values);

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  firstCard = null;
  lock = false;

  values.forEach(val => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.textContent = "❓";
    card.dataset.value = val;
    card.onclick = () => flip(card);
    grid.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = card.dataset.value;

  if (!firstCard) {
    firstCard = card;
  } else {
    if (firstCard.dataset.value === card.dataset.value) {
      firstCard = null;
    } else {
      lock = true;
      setTimeout(() => {
        card.classList.remove("open");
        firstCard.classList.remove("open");
        card.textContent = "❓";
        firstCard.textContent = "❓";
        firstCard = null;
        lock = false;
      }, 700);
    }
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}