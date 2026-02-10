const game = document.getElementById("game");

/* =======================
   🔴 ЛИНИЯ ПАМЯТИ
======================= */

const memoryCharacters = {
  "Смешарики": ["🟠 Крош","🟣 Ёжик","🟢 Копатыч","🟡 Нюша","🔵 Лосяш","🔴 Бараш","⚪ Совунья","🟤 Кар-Карыч"],
  "Фиксики": ["🔧 Нолик","⚙️ Симка","🔩 Папус","🧠 Мася","📱 ДимДимыч","💡 Верта","🛠️ Игрек","🔌 Файер"],
  "Маша и Медведь": ["👧 Маша","🐻 Медведь","🐺 Волк","🐰 Заяц","🐿️ Белка","🦔 Ёжик","🐷 Свинка","🐦 Птичка"],
  "Винни Пух": ["🐻 Винни","🐷 Пятачок","🐯 Тигра","🐰 Кролик","🦉 Сова","🦘 Кенга","👶 Ру","🍯 Горшок"],
  "Простоквашино": ["🐱 Матроскин","🐶 Шарик","👦 Дядя Фёдор","🐮 Мурка","📮 Печкин","🐦 Галчонок","🐭 Мышонок","🏠 Дом"]
};

function openMemory(){
  game.innerHTML = "<h2>🔴 Линия памяти</h2><p>Выбери персонажей</p>";
  Object.keys(memoryCharacters).forEach(name=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="line red";
    btn.textContent=name;
    btn.onclick=()=>chooseMemorySet(name);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button type="button" class="back" onclick="backToMenu()">⬅ Назад</button>`;
}

function chooseMemorySet(setName){
  game.innerHTML = `<h2>${setName}</h2><p>Выбери сложность</p>`;
  [8,12,16,20].forEach(count=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="line red";
    btn.textContent=`${count} карточек`;
    btn.onclick=()=>startMemory(setName,count);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button type="button" class="back" onclick="openMemory()">⬅ Назад</button>`;
}

function startMemory(setName,count){
  const chars = memoryCharacters[setName].slice(0,count/2);
  const cards = [...chars,...chars].sort(()=>Math.random()-0.5);
  const cols = Math.sqrt(count);
  game.innerHTML = `<h2>${setName} — ${count} карточек</h2>
    <div class="grid" style="grid-template-columns:repeat(${cols},70px)"></div>
    <button type="button" class="back" onclick="chooseMemorySet('${setName}')">⬅ Назад</button>`;
  const grid = document.querySelector(".grid");
  let first=null, lock=false, found=0;

  cards.forEach(val=>{
    const c=document.createElement("div");
    c.className="card";
    c.textContent="🚇";
    c.onclick=()=>{
      if(lock || c.classList.contains("open")) return;
      c.textContent=val;
      c.classList.add("open");
      if(!first){
        first=c;
      } else {
        if(first.textContent!==c.textContent){
          lock=true;
          setTimeout(()=>{
            first.textContent="🚇";
            c.textContent="🚇";
            first.classList.remove("open");
            c.classList.remove("open");
            first=null;
            lock=false;
          },700);
        } else {
          first.classList.add("matched");
          c.classList.add("matched");
          first=null;
          found++;
          if(found===count/2){
            setTimeout(()=>alert("🎉 Все пары найдены!"),300);
          }
        }
      }
    };
    grid.appendChild(c);
  });
}

/* =======================
   🔵 ЛИНИЯ ЛАБИРИНТА
======================= */

const mazeCharacters = [
  {name:"Чебурашка", icon:"🐻", goal:"🍊 Апельсин"},
  {name:"Пин", icon:"🐧", goal:"🤖 Биби"},
  {name:"Матроскин", icon:"🐱", goal:"🐮 Мурка"},
  {name:"Маша", icon:"👧", goal:"🏠 Дом Мишки"}
];

function openMaze(){
  game.innerHTML="<h2>🔵 Линия лабиринта</h2><p>Выбери персонажа</p>";
  mazeCharacters.forEach(ch=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="line blue";
    btn.textContent=`${ch.icon} ${ch.name} → ${ch.goal}`;
    btn.onclick=()=>startMazeGame(ch);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button type="button" class="back" onclick="backToMenu()">⬅ Назад</button>`;
}

let maze=[], playerPos={}, goalPos={}, mazeSize=9, currentChar=null, mazeLevel=1;

function startMazeGame(character){
  currentChar=character;
  mazeLevel=1;
  generateAndShowMaze();
}

function generateAndShowMaze(){
  maze = generateMaze(mazeSize, mazeSize);
  playerPos = {x:1,y:1};
  goalPos = {x:mazeSize-2,y:mazeSize-2};
  maze[goalPos.y][goalPos.x]=0;
  drawMaze();
}

function generateMaze(w,h){
  const m = Array.from({length:h},()=>Array(w).fill(1));
  function carve(x,y){
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-0.5);
    dirs.forEach(([dx,dy])=>{
      const nx=x+dx*2, ny=y+dy*2;
      if(ny>0 && ny<h-1 && nx>0 && nx<w-1 && m[ny][nx]===1){
        m[y+dy][x+dx]=0;
        m[ny][nx]=0;
        carve(nx,ny);
      }
    });
  }
  m[1][1]=0;
  carve(1,1);
  return m;
}

function drawMaze(){
  game.innerHTML = `
    <h2>${currentChar.icon} ${currentChar.name} → ${currentChar.goal}</h2>
    <p>Уровень ${mazeLevel}</p>
    <div id="maze" style="grid-template-columns:repeat(${mazeSize},40px)"></div>
    <div class="controls">