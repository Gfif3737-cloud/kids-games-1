document.addEventListener("DOMContentLoaded", () => {

    const width = 6; // поле 6x6
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");

    const colors = [
        "#e74c3c",
        "#3498db",
        "#f1c40f",
        "#2ecc71",
        "#9b59b6"
    ];

    let squares = [];
    let firstSelected = null;

    // Создание поля
    function createBoard() {
        board.innerHTML = "";
        squares = [];

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.classList.add("cell");

            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            square.style.backgroundColor = randomColor;

            square.setAttribute("data-id", i);
            board.appendChild(square);
            squares.push(square);

            square.addEventListener("click", () => selectSquare(square));
        }
    }

    // Выбор клетки
    function selectSquare(square) {
        if (!firstSelected) {
            firstSelected = square;
            square.style.border = "2px solid white";
        } else {
            swapSquares(firstSelected, square);
            firstSelected.style.border = "none";
            firstSelected = null;
            checkMatches();
        }
    }

    // Обмен клеток
    function swapSquares(square1, square2) {
        const color1 = square1.style.backgroundColor;
        const color2 = square2.style.backgroundColor;

        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    // Проверка совпадений
    function checkMatches() {
        let matched = false;

        // Горизонталь
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].style.backgroundColor;
                if (
                    color &&
                    squares[i + 1].style.backgroundColor === color &&
                    squares[i + 2].style.backgroundColor === color
                ) {
                    squares[i].style.backgroundColor = "";
                    squares[i + 1].style.backgroundColor = "";
                    squares[i + 2].style.backgroundColor = "";
                    matched = true;
                }
            }
        }

        // Вертикаль
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].style.backgroundColor;
            if (
                color &&
                squares[i + width].style.backgroundColor === color &&
                squares[i + width * 2].style.backgroundColor === color
            ) {
                squares[i].style.backgroundColor = "";
                squares[i + width].style.backgroundColor = "";
                squares[i + width * 2].style.backgroundColor = "";
                matched = true;
            }
        }

        if (matched) {
            setTimeout(dropSquares, 200);
        }
    }

    // Падение фишек
    function dropSquares() {
        for (let i = width * width - 1; i >= 0; i--) {
            if (!squares[i].style.backgroundColor) {
                if (i - width >= 0) {
                    squares[i].style.backgroundColor =
                        squares[i - width].style.backgroundColor;
                    squares[i - width].style.backgroundColor = "";
                } else {
                    squares[i].style.backgroundColor =
                        colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }

        setTimeout(checkMatches, 200);
    }

    restartBtn.addEventListener("click", createBoard);

    createBoard();
});