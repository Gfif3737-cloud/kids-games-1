document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Игра загружена!');
    
    const BOARD_WIDTH = 5;
    const BOARD_SIZE = BOARD_WIDTH * BOARD_WIDTH;
    
    const boardElement = document.getElementById('game-board');
    console.log('boardElement:', boardElement);
    
    if (!boardElement) {
        console.error('❌ Не найден элемент #game-board!');
        return;
    }
    
    // Создаём простые цветные клетки для проверки
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        boardElement.appendChild(cell);
    }
    
    console.log('✅ Поле создано!');
});