// Game state
let balance = 1.00;
let wins = 0;
let losses = 0;
let buyins = 1;

// DOM elements
const balanceEl = document.getElementById('balance');
const gambleBtn = document.getElementById('gambleBtn');
const resultEl = document.getElementById('result');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const winRateEl = document.getElementById('winRate');
const buyinsEl = document.getElementById('buyins');
const betAmountInput = document.getElementById('betAmount');
const buyinBtn = document.getElementById('buyinBtn');

// Load saved state from localStorage
function loadGame() {
    const savedBalance = localStorage.getItem('balance');
    const savedWins = localStorage.getItem('wins');
    const savedLosses = localStorage.getItem('losses');
    const savedBuyins = localStorage.getItem('buyins');

    if (savedBalance !== null) balance = parseFloat(savedBalance);
    if (savedWins !== null) wins = parseInt(savedWins);
    if (savedLosses !== null) losses = parseInt(savedLosses);
    if (savedBuyins !== null) buyins = parseInt(savedBuyins);

    updateDisplay();
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    localStorage.setItem('buyins', buyins);
}

// Update all display elements
function updateDisplay() {
    balanceEl.textContent = `$${balance.toFixed(2)}`;
    winsEl.textContent = wins;
    lossesEl.textContent = losses;
    buyinsEl.textContent = buyins;

    const totalGambles = wins + losses;
    const winRate = totalGambles > 0 ? ((wins / totalGambles) * 100).toFixed(1) : 0;
    winRateEl.textContent = `${winRate}%`;

    // Update bet input max value
    betAmountInput.max = balance.toFixed(2);

    // Disable button if balance is 0 or negative
    if (balance <= 0) {
        gambleBtn.disabled = true;
        betAmountInput.disabled = true;
        buyinBtn.style.display = 'block';
        resultEl.textContent = '💸 Game Over! Buy in again to continue.';
        resultEl.className = 'result lose';
    } else {
        gambleBtn.disabled = false;
        betAmountInput.disabled = false;
        buyinBtn.style.display = 'none';
    }
}

// The gambling function - 33% chance for multiplier >1x, 66% for <1x
function gamble() {
    const betAmount = parseFloat(betAmountInput.value);

    // Validate bet amount
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        resultEl.textContent = '⚠️ Invalid bet amount!';
        resultEl.className = 'result lose';
        return;
    }

    // Disable controls during animation
    gambleBtn.disabled = true;
    betAmountInput.disabled = true;
    resultEl.textContent = '🎲 Rolling...';
    resultEl.className = 'result';

    setTimeout(() => {
        // Random number between 0 and 1
        const random = Math.random();
        let multiplier;
        let didWin;

        // 33% chance for multiplier >1x, 66% for <1x
        if (random < 0.33) {
            // Win: multiplier between 1.1x and 3.0x
            multiplier = 1.1 + Math.random() * 1.9;
            didWin = true;
        } else {
            // Lose: multiplier between 0x and 0.9x
            multiplier = Math.random() * 0.9;
            didWin = false;
        }

        const payout = betAmount * multiplier;
        const profit = payout - betAmount;

        balance = balance - betAmount + payout;

        // Ensure balance doesn't go below 0
        if (balance < 0) balance = 0;

        if (didWin) {
            wins++;
            resultEl.textContent = `🎉 ${multiplier.toFixed(2)}x - WON $${profit.toFixed(2)}! 🎉`;
            resultEl.className = 'result win';
        } else {
            losses++;
            resultEl.textContent = `😭 ${multiplier.toFixed(2)}x - LOST $${Math.abs(profit).toFixed(2)}! 😭`;
            resultEl.className = 'result lose';
        }

        updateDisplay();
        saveGame();

        // Re-enable controls after animation
        setTimeout(() => {
            if (balance > 0) {
                gambleBtn.disabled = false;
                betAmountInput.disabled = false;
            }
        }, 500);
    }, 800);
}

// Buy in again
function buyIn() {
    balance = 1.00;
    buyins++;
    resultEl.textContent = '💵 Bought in for $1.00!';
    resultEl.className = 'result';
    updateDisplay();
    saveGame();
}

// Event listeners
gambleBtn.addEventListener('click', gamble);
buyinBtn.addEventListener('click', buyIn);

// Validate bet input on change
betAmountInput.addEventListener('input', () => {
    let value = parseFloat(betAmountInput.value);
    if (value > balance) {
        betAmountInput.value = balance.toFixed(2);
    }
    if (value < 0) {
        betAmountInput.value = '0.01';
    }
});

// Initialize game on load
loadGame();
