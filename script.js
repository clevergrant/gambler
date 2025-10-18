// Game state
let balance = 100;
let wins = 0;
let losses = 0;

// DOM elements
const balanceEl = document.getElementById('balance');
const gambleBtn = document.getElementById('gambleBtn');
const resultEl = document.getElementById('result');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const winRateEl = document.getElementById('winRate');
const resetBtn = document.getElementById('resetBtn');

// Load saved state from localStorage
function loadGame() {
    const savedBalance = localStorage.getItem('balance');
    const savedWins = localStorage.getItem('wins');
    const savedLosses = localStorage.getItem('losses');

    if (savedBalance !== null) balance = parseInt(savedBalance);
    if (savedWins !== null) wins = parseInt(savedWins);
    if (savedLosses !== null) losses = parseInt(savedLosses);

    updateDisplay();
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
}

// Update all display elements
function updateDisplay() {
    balanceEl.textContent = `$${balance}`;
    winsEl.textContent = wins;
    lossesEl.textContent = losses;

    const totalGambles = wins + losses;
    const winRate = totalGambles > 0 ? ((wins / totalGambles) * 100).toFixed(1) : 0;
    winRateEl.textContent = `${winRate}%`;

    // Disable button if balance is 0 or negative
    if (balance <= 0) {
        gambleBtn.disabled = true;
        resultEl.textContent = '💸 You\'re broke! Reset to play again.';
        resultEl.className = 'result lose';
    } else {
        gambleBtn.disabled = false;
    }
}

// The gambling function - 33% chance to win
function gamble() {
    // Disable button during animation
    gambleBtn.disabled = true;
    resultEl.textContent = '🎲 Rolling...';
    resultEl.className = 'result';

    setTimeout(() => {
        // Random number between 0 and 1
        const random = Math.random();

        // 33% chance to win (random < 0.33)
        const didWin = random < 0.33;

        // Random bet amount between $10 and $30
        const betAmount = Math.floor(Math.random() * 21) + 10;

        if (didWin) {
            balance += betAmount;
            wins++;
            resultEl.textContent = `🎉 YOU WON $${betAmount}! 🎉`;
            resultEl.className = 'result win';
        } else {
            balance -= betAmount;
            losses++;
            resultEl.textContent = `😭 YOU LOST $${betAmount}! 😭`;
            resultEl.className = 'result lose';
        }

        updateDisplay();
        saveGame();

        // Re-enable button after animation
        setTimeout(() => {
            if (balance > 0) {
                gambleBtn.disabled = false;
            }
        }, 500);
    }, 800);
}

// Reset the game
function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
        balance = 100;
        wins = 0;
        losses = 0;
        resultEl.textContent = '';
        resultEl.className = 'result';
        updateDisplay();
        saveGame();
    }
}

// Event listeners
gambleBtn.addEventListener('click', gamble);
resetBtn.addEventListener('click', resetGame);

// Initialize game on load
loadGame();
