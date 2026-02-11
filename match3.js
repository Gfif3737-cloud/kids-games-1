const colors = ["red", "yellow", "green", "blue", "purple"];
const boardSize = 8;
let board = [];
let selected = null;

const lines = {
    "Сокольническая": ["Бульвар Рокоссовского","Черкизовская","Преображенская","Сокольники","Красносельская"],
    "Арбатско-Покровская": ["Библиотека им. Ленина","Охотный ряд","Кропоткинская","Парк культуры","Киевская"],
    "Замоскворецкая": ["Беломорская","Речной вокзал","Водный стадион","Войковская","Сокол"],
    "Таганско-Краснопресненская": ["Площадь Революции","Курская","Таганская","Павелецкая","Новокузнецкая"],
    "Калининская": ["Новокосино","Первомайская","Измайловская","Партизанская","Семёновская"]
};

const lineSelect = document.getElementById("line-select");
const stationsList = document.getElementById("stations-list");
const gameBoard = document.getElementById("game-board");

for (let line in lines) {
    const option = document.createElement("option");
    option.value = line;
    option.textContent = line;
    lineSelect.appendChild(option);
}

lineSelect.addEventListener("change", renderStations);

function renderStations() {
    const line = lineSelect.value;
    stationsList.innerHTML = "";
    lines[line].forEach(station => {
        const div = document.createElement("div");
        div.className = "station";
        div.innerHTML = `<input type="checkbox" disabled> <span>${station}</span>`;
        stationsList.appendChild(div);
    });
}

function createBoard() {
    board = [];
    gameBoard.innerHTML = "";
    for (let r = 0; r < boardSize; r++) {
        const row = [];
        for (let c = 0; c < boardSize; c++) {
            let color;
            do {
                color = colors[Math.floor(Math.random() * colors.length)];
            } while (
                (c >= 2 && row[c-1].color === color && row[c-2].color === color) ||
                (r >= 2 && board[r-1][c].color === color && board[r-2][c].color === color)
            );
            const div = document.createElement("div");
            div.className = "cell";
            div.style.backgroundColor = color;
            div.dataset.row = r;
            div.dataset.col = c;
            div.addEventListener("click", selectCell);
            gameBoard.appendChild(div);
            row.push({div, color});
        }
        board.push(row);
    }
}

function selectCell(e) {
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);

    if (!selected) {
        selected = {row, col};
        this.style.transform = "scale(1.2)";
    } else {
        swap(selected, {row, col});
        selected = null;
        document.querySelectorAll(".cell").forEach(cell => cell.style.transform="scale(1)");
    }
}

function swap(a, b) {
    const tempColor = board[a.row][a.col].color;
    board[a.row][a.col].color = board[b.row][b.col].color;
    board[b.row][b.col].color = tempColor;
    board[a.row][a.col].div.style.backgroundColor = board[a.row][a.col].color;
    board[b.row][b.col].div.style.backgroundColor = board[b.row][b.col].color;
    checkMatches();
}

function checkMatches() {
    let matched = false;

    // горизонтальные линии
    for (let r=0;r<boardSize;r++){
        for (let c=0;c<boardSize-2;c++){
            const color = board[r][c].color;
            if(color === board[r][c+1].color && color === board[r][c+2].color){
                matched = true;
                board[r][c].color = board[r][c+1].color = board[r][c+2].color = colors[Math.floor(Math.random()*colors.length)];
                board[r][c].div.style.backgroundColor = board[r][c].color;
                board[r][c+1].div.style.backgroundColor = board[r][c+1].color;
                board[r][c+2].div.style.backgroundColor = board[r][c+2].color;
            }
        }
    }

    // вертикальные линии
    for (let c=0;c<boardSize;c++){
        for (let r=0;r<boardSize-2;r++){
            const color = board[r][c].color;
            if(color === board[r+1][c].color && color === board[r+2][c].color){
                matched = true;
                board[r][c].color = board[r+1][c].color = board[r+2][c].color = colors[Math.floor(Math.random()*colors.length)];
                board[r][c].div.style.backgroundColor = board[r][c].color;
                board[r+1][c].div.style.backgroundColor = board[r+1][c].color;
                board[r+2][c].div.style.backgroundColor = board[r+2][c].color;
            }
        }
    }

    if(matched) setTimeout(checkMatches, 200);
}

document.getElementById("restart").addEventListener("click", createBoard);

createBoard();
renderStations();