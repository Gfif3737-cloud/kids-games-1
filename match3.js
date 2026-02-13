document.addEventListener("DOMContentLoaded", () => {
    const width = 6;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const scoreElement = document.getElementById("score");

    const colors = [
        "#e74c3c", // красный
        "#3498db", // синий
        "#f1c40f", // жёлтый
        "#2ecc71", // зелёный
        "#9b59b6"  // фиолетовый
    ];

    let squares = [];
    let firstSelected = null;
    let score = 0;

    function createBoard() {
        board.innerHTML = "";
        squares = [];
        score = 0;
        if (scoreElement) scoreElement.textContent = "0";

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

        // Убираем начальные совпадения
        setTimeout(() => {
            while (checkMatches(true)) {}
        }, 10);
    }

    function selectSquare(square) {
        if (!firstSelected) {
            firstSelected = square;
            square.style.border = "3px solid white";
            square.style.boxShadow = "0 0 15px rgba(255,255,255,0.8)";
        } else {
            // Проверяем, соседние ли клетки
            const index1 = parseInt(firstSelected.dataset.id);
            const index2 = parseInt(square.dataset.id);
            
            const isAdjacent = (
                (index1 === index2 - 1 && index1 % width !== width - 1) || // справа
                (index1 === index2 + 1 && index2 % width !== width - 1) || // слева
                (index1 === index2 - width) || // снизу
                (index1 === index2 + width)    // сверху
            );

            if (isAdjacent) {
                swapSquares(firstSelected, square);
                
                // Проверяем, есть ли совпадения после обмена
                setTimeout(() => {
                    if (!checkMatches()) {
                        // Если нет совпадений — меняем обратно
                        swapSquares(firstSelected, square);
                    }
                }, 10);
            }

            // Сбрасываем выделение
            firstSelected.style.border = "none";
            firstSelected.style.boxShadow = "none";
            firstSelected = null;
        }
    }

    function swapSquares(square1, square2) {
        const color1 = square1.style.backgroundColor;
        const color2 = square2.style.backgroundColor;

        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    function checkMatches(silent = false) {
        let matched = false;

        // Горизонтальные совпадения
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].style.backgroundColor;
                if (
                    color && color !== "transparent" &&
                    squares[i + 1].style.backgroundColor === color &&
                    squares[i + 2].style.backgroundColor === color
                ) {
                    squares[i].style.backgroundColor = "transparent";
                    squares[i + 1].style.backgroundColor = "transparent";
                    squares[i + 2].style.backgroundColor = "transparent";
                    matched = true;
                    if (!silent) score += 10;
                }
            }
        }

        // Вертикальные совпадения
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].style.backgroundColor;
            if (
                color && color !== "transparent" &&
                squares[i + width].style.backgroundColor === color &&
                squares[i + width * 2].style.backgroundColor === color
            ) {
                squares[i].style.backgroundColor = "transparent";
                squares[i + width].style.backgroundColor = "transparent";
                squares[i + width * 2].style.backgroundColor = "transparent";
                matched = true;
                if (!silent) score += 10;
            }
        }

        if (matched && !silent) {
            if (scoreElement) scoreElement.textContent = score;
            setTimeout(dropSquares, 200);
        }

        return matched;
    }

    function dropSquares() {
        // Падаем снизу вверх для каждого столбца
        for (let col = 0; col < width; col++) {
            for (let row = width - 1; row >= 0; row--) {
                const index = row * width + col;
                
                if (squares[index].style.backgroundColor === "transparent") {
                    // Ищем сверху непустую клетку
                    for (let above = row - 1; above >= 0; above--) {
                        const aboveIndex = above * width + col;
                        if (squares[aboveIndex].style.backgroundColor !== "transparent") {
                            squares[index].style.backgroundColor = 
                                squares[aboveIndex].style.backgroundColor;
                            squares[aboveIndex].style.backgroundColor = "transparent";
                            break;
                        }
                    }
                    
                    // Если после поиска всё ещё пусто — создаём новую
                    if (squares[index].style.backgroundColor === "transparent") {
                        squares[index].style.backgroundColor = 
                            colors[Math.floor(Math.random() * colors.length)];
                    }
                }
            }
        }

        setTimeout(() => {
            if (!checkMatches()) {
                // Если нет совпадений, проверяем возможные ходы
                if (!hasValidMoves()) {
                    alert("Игра окончена! Ваш счёт: " + score);
                }
            }
        }, 200);
    }

    function hasValidMoves() {
        // Проверяем все возможные свапы
        for (let i = 0; i < squares.length; i++) {
            // Проверяем соседа справа
            if (i % width < width - 1) {
                if (testSwap(i, i + 1)) return true;
            }
            // Проверяем соседа снизу
            if (i < width * (width - 1)) {
                if (testSwap(i, i + width)) return true;
            }
        }
        return false;
    }

    function testSwap(index1, index2) {
        // Временно меняем цвета
        const color1 = squares[index1].style.backgroundColor;
        const color2 = squares[index2].style.backgroundColor;
        
        squares[index1].style.backgroundColor = color2;
        squares[index2].style.backgroundColor = color1;
        
        // Проверяем, появились ли совпадения
        let matchFound = false;
        
        // Горизонтальная проверка для index1
        const row = Math.floor(index1 / width);
        const col = index1 % width;
        if (col <= width - 3) {
            if (squares[index1].style.backgroundColor === squares[index1 + 1].style.backgroundColor &&
                squares[index1].style.backgroundColor === squares[index1 + 2].style.backgroundColor) {
                matchFound = true;
            }
        }
        if (col >= 2) {
            if (squares[index1].style.backgroundColor === squares[index1 - 1].style.backgroundColor &&
                squares[index1].style.backgroundColor === squares[index1 - 2].style.backgroundColor) {
                matchFound = true;
            }
        }
        
        // Вертикальная проверка для index1
        if (row <= width - 3) {
            if (squares[index1].style.backgroundColor === squares[index1 + width].style.backgroundColor &&
                squares[index1].style.backgroundColor === squares[index1 + width * 2].style.backgroundColor) {
                matchFound = true;
            }
        }
        if (row >= 2) {
            if (squares[index1].style.backgroundColor === squares[index1 - width].style.backgroundColor &&
                squares[index1].style.backgroundColor === squares[index1 - width * 2].style.backgroundColor) {
                matchFound = true;
            }
        }
        
        // Возвращаем цвета обратно
        squares[index1].style.backgroundColor = color1;
        squares[index2].style.backgroundColor = color2;
        
        return matchFound;
    }

    restartBtn.addEventListener("click", createBoard);
    createBoard();
});