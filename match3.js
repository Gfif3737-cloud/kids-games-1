document.addEventListener('DOMContentLoaded', () => {
    const BOARD_WIDTH = 5;
    const BOARD_SIZE = BOARD_WIDTH * BOARD_WIDTH;
    const boardElement = document.getElementById('game-board');
    
    let board = [];
    let selectedCell = null;
    
    // Цвета
    const colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
    
    // Создание доски
    function initBoard() {
        boardElement.innerHTML = '';
        board = [];
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            cell.style.backgroundColor = color;
            
            cell.addEventListener('click', () => handleClick(i));
            boardElement.appendChild(cell);
            
            board.push({
                element: cell,
                color: color
            });
        }
    }
    
    // Поиск троек
    function findMatches() {
        const matches = new Set();
        
        // Горизонтальные
        for (let row = 0; row < BOARD_WIDTH; row++) {
            for (let col = 0; col < BOARD_WIDTH - 2; col++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + 1;
                const idx3 = idx1 + 2;
                
                if (board[idx1].color && 
                    board[idx1].color === board[idx2].color && 
                    board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }
        
        // Вертикальные
        for (let col = 0; col < BOARD_WIDTH; col++) {
            for (let row = 0; row < BOARD_WIDTH - 2; row++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + BOARD_WIDTH;
                const idx3 = idx2 + BOARD_WIDTH;
                
                if (board[idx1].color && 
                    board[idx1].color === board[idx2].color && 
                    board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }
        
        return Array.from(matches);
    }
    
    // Удаление троек и падение
    function removeMatches() {
        const matches = findMatches();
        if (matches.length === 0) return false;
        
        // Удаляем
        matches.forEach(index => {
            board[index].color = '';
            board[index].element.style.backgroundColor = '';
        });
        
        // Падение
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const columnIndices = [];
            for (let row = 0; row < BOARD_WIDTH; row++) {
                columnIndices.push(row * BOARD_WIDTH + col);
            }
            
            // Собираем цвета
            const columnColors = [];
            for (let i = BOARD_WIDTH - 1; i >= 0; i--) {
                const idx = columnIndices[i];
                if (board[idx].color) {
                    columnColors.push(board[idx].color);
                }
            }
            
            // Дополняем новыми
            while (columnColors.length < BOARD_WIDTH) {
                columnColors.push(colors[Math.floor(Math.random() * colors.length)]);
            }
            
            // Записываем обратно
            for (let i = 0; i < BOARD_WIDTH; i++) {
                const idx = columnIndices[BOARD_WIDTH - 1 - i];
                board[idx].color = columnColors[i];
                board[idx].element.style.backgroundColor = columnColors[i];
            }
        }
        
        return true;
    }
    
    // Обработка клика
    function handleClick(index) {
        if (selectedCell === null) {
            selectedCell = index;
            board[index].element.style.border = '3px solid white';
        } else {
            board[selectedCell].element.style.border = '';
            
            if (index !== selectedCell) {
                // Меняем цвета
                const tempColor = board[selectedCell].color;
                board[selectedCell].color = board[index].color;
                board[index].color = tempColor;
                
                board[selectedCell].element.style.backgroundColor = board[selectedCell].color;
                board[index].element.style.backgroundColor = board[index].color;
                
                // Проверяем тройки
                if (findMatches().length > 0) {
                    // Есть тройка - удаляем
                    while (removeMatches()) {}
                } else {
                    // Нет тройки - меняем обратно
                    const tempBack = board[selectedCell].color;
                    board[selectedCell].color = board[index].color;
                    board[index].color = tempBack;
                    
                    board[selectedCell].element.style.backgroundColor = board[selectedCell].color;
                    board[index].element.style.backgroundColor = board[index].color;
                }
            }
            
            selectedCell = null;
        }
    }
    
    // Запуск
    initBoard();
});