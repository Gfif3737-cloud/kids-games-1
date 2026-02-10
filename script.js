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
    btn.className="line red";
    btn.textContent=name;
    btn.onclick=()=>chooseMemorySet(name);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button class="back" onclick="backToMenu()">⬅ Назад</button>`;
}

function chooseMemorySet(setName){
  game.innerHTML = `<h2>${setName}</h2><p>Выбери сложность</p>`;
  [8,12,16,20].forEach(count=>{
    const btn=document.createElement("button");
    btn.className="line red";
    btn.textContent=`${count} карточек`;
    btn.onclick=()=>startMemory(setName,count);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button class="back" onclick="openMemory()">⬅ Назад</button>`;
}

function startMemory(setName,count){
  const chars = memoryCharacters[setName].slice(0,count/2);
  const cards = [...chars,...chars].sort(()=>Math.random()-0.5);
  const cols = Math.sqrt(count);
  game.innerHTML = `<h2>${setName} — ${count} карточек</h2>
    <div class="grid" style="grid-template-columns:repeat(${cols},70px)"></div>
    <button class="back" onclick="chooseMemorySet('${setName}')">⬅ Назад</button>`;
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
  {name:"Пин", icon:"🧠", goal:"🤖 Биби"},
  {name:"Матроскин", icon:"🐱", goal:"🐮 Мурка"},
  {name:"Маша", icon:"👧", goal:"🏠 Дом Мишки"}
];

function openMaze(){
  game.innerHTML="<h2>🔵 Линия лабиринта</h2><p>Выбери персонажа</p>";
  mazeCharacters.forEach((ch,i)=>{
    const btn=document.createElement("button");
    btn.className="line blue";
    btn.textContent=`${ch.icon} ${ch.name} → ${ch.goal}`;
    btn.onclick=()=>startMazeGame(ch);
    game.appendChild(btn);
  });
  game.innerHTML += `<br><button class="back" onclick="backToMenu()">⬅ Назад</button>`;
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
      <button onclick="movePlayer(0,-1)">⬆️</button>
      <button onclick="movePlayer(-1,0)">⬅️</button>
      <button onclick="movePlayer(1,0)">➡️</button>
      <button onclick="movePlayer(0,1)">⬇️</button>
    </div>
    <button class="back" onclick="openMaze()">⬅ Назад</button>
  `;
  const mazeDiv=document.getElementById("maze");
  maze.forEach((row,y)=>{
    row.forEach((cell,x)=>{
      const d=document.createElement("div");
      d.className="cell";
      if(cell===1) d.style.background="#000";
      else d.classList.add("path");
      if(playerPos.x===x && playerPos.y===y){
        d.classList.add("player");
        d.textContent=currentChar.icon;
      }
      if(goalPos.x===x && goalPos.y===y){
        d.classList.add("goal");
        d.textContent="🏁";
      }
      mazeDiv.appendChild(d);
    });
  });
}

function movePlayer(dx,dy){
  const nx=playerPos.x+dx, ny=playerPos.y+dy;
  if(maze[ny][nx]===0){
    playerPos={x:nx,y:ny};
    if(nx===goalPos.x && ny===goalPos.y){
      mazeLevel++;
      setTimeout(()=>{
        alert("🎉 Уровень пройден!");
        generateAndShowMaze();
      },200);
      return;
    }
    drawMaze();
  }
}

/* =======================
   🟣 ТРИ В РЯД: МЕТРО
======================= */

const matchColors = ["red","blue","green","yellow","purple"];
const metroStations = {
  red:"🔴 Комсомольская",
  blue:"🔵 Арбатская",
  green:"🟢 Павелецкая",
  yellow:"🟡 Киевская",
  purple:"🟣 Таганская"
};
let matchBoard=[], firstPick=null, collected=[];

function openMatch3(){
  collected=[];
  game.innerHTML=`
    <h2>🟣 Три в ряд — Метро</h2>
    <p>Соединяй 3 цвета — получай станции!</p>
    <div id="matchGrid"></div>
    <div id="stations"></div>
    <button class="back" onclick="backToMenu()">⬅ Назад</button>
  `;
  generateMatchBoard();
}

function generateMatchBoard(){
  const size=6;
  matchBoard=[];
  const grid=document.getElementById("matchGrid");
  grid.style.gridTemplateColumns=`repeat(${size},60px)`;
  grid.innerHTML="";
  for(let i=0;i<size*size;i++){
    const color=randomColor();
    matchBoard.push(color);
    const d=document.createElement("div");
    d.className=`matchCell ${color}`;
    d.onclick=()=>pickMatch(i);
    grid.appendChild(d);
  }
}

function randomColor(){
  return matchColors[Math.floor(Math.random()*matchColors.length)];
}

function pickMatch(i){
  if(firstPick===null){
    firstPick=i;
    document.querySelectorAll(".matchCell")[i].classList.add("selected");
  } else {
    swapMatch(firstPick,i);
    document.querySelectorAll(".matchCell")[firstPick].classList.remove("selected");
    firstPick=null;
    setTimeout(checkMatch3,200);
  }
}

function swapMatch(a,b){
  [matchBoard[a],matchBoard[b]]=[matchBoard[b],matchBoard[a]];
  renderMatchBoard();
}

function renderMatchBoard(){
  document.querySelectorAll(".matchCell").forEach((cell,i)=>{
    cell.className=`matchCell ${matchBoard[i]}`;
  });
}

function checkMatch3(){
  const size=6;
  let matched=false;

  // горизонтали
  for(let r=0;r<size;r++){
    for(let c=0;c<size-2;c++){
      const i=r*size+c;
      const col=matchBoard[i];
      if(col && matchBoard[i+1]===col && matchBoard[i+2]===col){
        awardStation(col);
        matchBoard[i]=matchBoard[i+1]=matchBoard[i+2]=null;
        matched=true;
      }
    }
  }

  // вертикали
  for(let c=0;c<size;c++){
    for(let r=0;r<size-2;r++){
      const i=r*size+c;
      const col=matchBoard[i];
      if(col && matchBoard[i+size]===col && matchBoard[i+2*size]===col){
        awardStation(col);
        matchBoard[i]=matchBoard[i+size]=matchBoard[i+2*size]=null;
        matched=true;
      }
    }
  }

  if(matched){
    dropMatchCells();
    setTimeout(checkMatch3,300);
  }
}

function dropMatchCells(){
  const size=6;
  for(let c=0;c<size;c++){
    let col=[];
    for(let r=0;r<size;r++){
      const i=r*size+c;
      if(matchBoard[i]) col.push(matchBoard[i]);
    }
    while(col.length<size) col.unshift(randomColor());
    for(let r=0;r<size;r++){
      matchBoard[r*size+c]=col[r];
    }
  }
  renderMatchBoard();
}

function awardStation(color){
  const st=metroStations[color];
  if(!collected.includes(st)){
    collected.push(st);
    document.getElementById("stations").innerHTML =
      "Собранные станции:<br>" + collected.join("<br>");
  }
}

/* =======================
   ОБЩЕЕ
======================= */

function backToMenu(){
  game.innerHTML="";
}