document.addEventListener('DOMContentLoaded', () => {
    // ==================== КОНФИГУРАЦИЯ ====================
    const LEVELS = [
        { id: 'level1', size: '4x2', name: 'Лёгкий', cards: 8, pairs: 4, rewardIndex: 0 },
        { id: 'level2', size: '4x3', name: 'Средний', cards: 12, pairs: 6, rewardIndex: 1 },
        { id: 'level3', size: '4x4', name: 'Сложный', cards: 16, pairs: 8, rewardIndex: 2 },
        { id: 'level4', size: '4x5', name: 'Эксперт', cards: 20, pairs: 10, rewardIndex: 3 },
        { id: 'level5', size: '4x6', name: 'Мастер', cards: 24, pairs: 12, rewardIndex: 4 }
    ];

    const THEMES = {
        smeshariki: { name: 'Смешарики', icon: '🐰', chars: [
            { name: 'Крош', emoji: '🐰', color: '#FF69B4' },
            { name: 'Ёжик', emoji: '🦔', color: '#8B4513' },
            { name: 'Нюша', emoji: '🐷', color: '#FFB6C1' },
            { name: 'Бараш', emoji: '🐑', color: '#87CEEB' },
            { name: 'Лосяш', emoji: '🦌', color: '#FFD700' },
            { name: 'Копатыч', emoji: '🐻', color: '#CD853F' },
            { name: 'Совунья', emoji: '🦉', color: '#9370DB' },
            { name: 'Пин', emoji: '🐧', color: '#4169E1' }
        ], rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш'] },
        prostokvashino: { name: 'Простоквашино', icon: '🐱', chars: [
            { name: 'Матроскин', emoji: '🐱', color: '#FFA500' },
            { name: 'Шарик', emoji: '🐶', color: '#DEB887' },
            { name: 'Дядя Фёдор', emoji: '👦', color: '#98FB98' },
            { name: 'Печкин', emoji: '📮', color: '#708090' },
            { name: 'Галчонок', emoji: '🐦', color: '#000000' },
            { name: 'Мурка', emoji: '🐄', color: '#FFFFFF' },
            { name: 'Тётя Зина', emoji: '👩', color: '#FFB6C1' },
            { name: 'Бобр', emoji: '🦫', color: '#8B4513' }
        ], rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок'] },
        fixiki: { name: 'Фиксики', icon: '🔧', chars: [
            { name: 'Нолик', emoji: '0️⃣', color: '#00BFFF' },
            { name: 'Симка', emoji: '1️⃣', color: '#FF69B4' },
            { name: 'Папус', emoji: '👨', color: '#4169E1' },
            { name: 'Мася', emoji: '👩', color: '#FFA500' },
            { name: 'Дедус', emoji: '👴', color: '#708090' },
            { name: 'Игрек', emoji: '🔧', color: '#FFD700' },
            { name: 'Шпуля', emoji: '🧵', color: '#9370DB' },
            { name: 'Верта', emoji: '🔩', color: '#00FF00' },
            { name: 'Файер', emoji: '🔥', color: '#FF4500' }
        ], rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус'] },
        vinni: { name: 'Винни Пух', icon: '🐻', chars: [
            { name: 'Винни', emoji: '🐻', color: '#CD853F' },
            { name: 'Пятачок', emoji: '🐖', color: '#FFB6C1' },
            { name: 'Кролик', emoji: '🐇', color: '#87CEEB' },
            { name: 'Иа', emoji: '🐴', color: '#708090' },
            { name: 'Сова', emoji: '🦉', color: '#9370DB' },
            { name: 'Тигра', emoji: '🐯', color: '#FFA500' },
            { name: 'Кенга', emoji: '🦘', color: '#8B4513' },
            { name: 'Ру', emoji: '👶', color: '#FFB6C1' }
        ], rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова'] },
        masha: { name: 'Маша и Медведь', icon: '👧', chars: [
            { name: 'Маша', emoji: '👧', color: '#FF69B4' },
            { name: 'Медведь', emoji: '🐻', color: '#8B4513' },
            { name: 'Панда', emoji: '🐼', color: '#000000' },
            { name: 'Розочка', emoji: '🌸', color: '#FFB6C1' },
            { name: 'Зайка', emoji: '🐰', color: '#87CEEB' },
            { name: 'Волк', emoji: '🐺', color: '#708090' },
            { name: 'Белка', emoji: '🐿️', color: '#FFA500' },
            { name: 'Ёжик', emoji: '🦔', color: '#8B4513' }
        ], rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка'] }
    };

    // ==================== ДОСТИЖЕНИЯ ====================
    let achievements = JSON.parse(localStorage.getItem('memory_achievements')) || {
        allDifficulties: {},
        allLevels: false,
        fastWin: {}
    };

    let bestTimes = JSON.parse(localStorage.getItem('memory_best_times')) || {};

    function checkAchievements(theme, levelIndex, time) {
        const level = LEVELS[levelIndex];
        const themeName = THEMES[theme].name;
        
        // 1. Прошел все сложности на мультике
        if (!achievements.allDifficulties[theme]) {
            let allCompleted = true;
            for (let i = 0; i < LEVELS.length; i++) {
                if (!levelProgress[theme][LEVELS[i].id + '_completed']) {
                    allCompleted = false;
                    break;
                }
            }
            if (allCompleted) {
                achievements.allDifficulties[theme] = true;
                unlockAchievement(`🌟 Все сложности пройдены в мультфильме "${themeName}"!`);
            }
        }
        
        // 2. Прошел все уровни (все мультики, все сложности)
        if (!achievements.allLevels) {
            let allThemesCompleted = true;
            for (let t in THEMES) {
                for (let i = 0; i < LEVELS.length; i++) {
                    if (!levelProgress[t][LEVELS[i].id + '_completed']) {
                        allThemesCompleted = false;
                        break;
                    }
                }
            }
            if (allThemesCompleted) {
                achievements.allLevels = true;
                unlockAchievement(`🏆 Полная коллекция! Все уровни во всех мультфильмах пройдены!`);
            }
        }
        
        // 3. Прошел уровень меньше чем за 20 сек (4×6)
        if (level.size === '4x6' && time < 20) {
            if (!achievements.fastWin[theme]) {
                achievements.fastWin[theme] = true;
                unlockAchievement(`⚡ Скоростной рекорд! Уровень Мастер в "${themeName}" пройден за ${time} секунд!`);
            }
        }
        
        localStorage.setItem('memory_achievements', JSON.stringify(achievements));
    }

    function unlockAchievement(text) {
        setTimeout(() => {
            alert(`🏅 ДОСТИЖЕНИЕ ПОЛУЧЕНО!\n\n${text}\n\nНаграда добавлена в Музей!`);
        }, 500);
        
        // Сохраняем награду в музей
        let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};
        if (!artifacts.memoryAchievements) artifacts.memoryAchievements = [];
        if (!artifacts.memoryAchievements.includes(text)) {
            artifacts.memoryAchievements.push(text);
            localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
        }
    }

    // ==================== ОСТАЛЬНОЙ КОД (как был, с добавлением проверки достижений) ====================
    // ... (весь остальной код memory.js, но в конце победы добавить:)
    // checkAchievements(currentTheme, currentLevel, timer);
});