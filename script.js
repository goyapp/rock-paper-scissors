/**
 * Rock, Paper, Scissors Game
 * Classic player vs computer game with modern UI
 */

// ===== Game State =====
const gameState = {
    playerScore: 0,
    computerScore: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    currentStreak: 0,
    bestStreak: 0,
    isPlaying: false
};

// ===== Constants =====
const CHOICES = ['rock', 'paper', 'scissors'];
const CHOICE_EMOJIS = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

const RESULTS = {
    WIN: 'win',
    LOSE: 'lose',
    TIE: 'tie'
};

const RESULT_MESSAGES = {
    win: ['You Win! 🎉', 'Victory! 💪', 'Nice One! 🔥', 'Champion! 🏆'],
    lose: ['You Lose! 😢', 'Too Bad! 💔', 'Try Again! 🎯', 'So Close! 😅'],
    tie: ["It's a Tie! 🤝", 'Draw! ⚖️', 'Equal! 🔄', 'Matched! ♻️']
};

// ===== DOM Elements =====
const elements = {
    playerScore: document.getElementById('playerScore'),
    computerScore: document.getElementById('computerScore'),
    playerChoiceIcon: document.getElementById('playerChoiceIcon'),
    computerChoiceIcon: document.getElementById('computerChoiceIcon'),
    resultDisplay: document.getElementById('resultDisplay'),
    resultText: document.querySelector('.result-text'),
    rockBtn: document.getElementById('rockBtn'),
    paperBtn: document.getElementById('paperBtn'),
    scissorsBtn: document.getElementById('scissorsBtn'),
    resetBtn: document.getElementById('resetBtn'),
    gamesPlayed: document.getElementById('gamesPlayed'),
    winRate: document.getElementById('winRate'),
    streak: document.getElementById('streak')
};

// ===== Game Logic =====

/**
 * Get random computer choice
 * @returns {string} Computer's choice
 */
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[randomIndex];
}

/**
 * Determine the winner of a round
 * @param {string} playerChoice - Player's choice
 * @param {string} computerChoice - Computer's choice
 * @returns {string} Result: 'win', 'lose', or 'tie'
 */
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return RESULTS.TIE;
    }
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    if (winConditions[playerChoice] === computerChoice) {
        return RESULTS.WIN;
    }
    
    return RESULTS.LOSE;
}

/**
 * Get random result message
 * @param {string} result - Game result
 * @returns {string} Random message for the result
 */
function getResultMessage(result) {
    const messages = RESULT_MESSAGES[result];
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Update the game state based on result
 * @param {string} result - Game result
 */
function updateGameState(result) {
    gameState.gamesPlayed++;
    
    switch (result) {
        case RESULTS.WIN:
            gameState.playerScore++;
            gameState.wins++;
            gameState.currentStreak++;
            if (gameState.currentStreak > gameState.bestStreak) {
                gameState.bestStreak = gameState.currentStreak;
            }
            break;
        case RESULTS.LOSE:
            gameState.computerScore++;
            gameState.losses++;
            gameState.currentStreak = 0;
            break;
        case RESULTS.TIE:
            gameState.ties++;
            // Streak continues on tie
            break;
    }
}

/**
 * Calculate win rate percentage
 * @returns {number} Win rate as percentage
 */
function calculateWinRate() {
    if (gameState.gamesPlayed === 0) return 0;
    const winRate = (gameState.wins / gameState.gamesPlayed) * 100;
    return Math.round(winRate);
}

// ===== UI Updates =====

/**
 * Update all UI elements with current state
 */
function updateUI() {
    elements.playerScore.textContent = gameState.playerScore;
    elements.computerScore.textContent = gameState.computerScore;
    elements.gamesPlayed.textContent = gameState.gamesPlayed;
    elements.winRate.textContent = `${calculateWinRate()}%`;
    elements.streak.textContent = gameState.currentStreak;
}

/**
 * Update choice display icons
 * @param {string} playerChoice - Player's choice
 * @param {string} computerChoice - Computer's choice
 */
function updateChoiceDisplays(playerChoice, computerChoice) {
    elements.playerChoiceIcon.textContent = CHOICE_EMOJIS[playerChoice];
    elements.computerChoiceIcon.textContent = CHOICE_EMOJIS[computerChoice];
    
    elements.playerChoiceIcon.classList.add('active');
    elements.computerChoiceIcon.classList.add('active');
    
    // Remove active class after animation
    setTimeout(() => {
        elements.playerChoiceIcon.classList.remove('active');
        elements.computerChoiceIcon.classList.remove('active');
    }, 1000);
}

/**
 * Update result display
 * @param {string} result - Game result
 */
function updateResultDisplay(result) {
    const message = getResultMessage(result);
    elements.resultText.textContent = message;
    
    // Remove previous result classes
    elements.resultText.classList.remove('win', 'lose', 'tie');
    
    // Add new result class
    elements.resultText.classList.add(result);
}

/**
 * Show thinking animation
 */
function showThinkingAnimation() {
    elements.computerChoiceIcon.textContent = '🤔';
    elements.computerChoiceIcon.classList.add('thinking');
}

/**
 * Hide thinking animation
 */
function hideThinkingAnimation() {
    elements.computerChoiceIcon.classList.remove('thinking');
}

/**
 * Reset choice displays to initial state
 */
function resetChoiceDisplays() {
    elements.playerChoiceIcon.textContent = '❓';
    elements.computerChoiceIcon.textContent = '❓';
    elements.resultText.textContent = 'Make your move!';
    elements.resultText.classList.remove('win', 'lose', 'tie');
}

// ===== Game Actions =====

/**
 * Play a round of the game
 * @param {string} playerChoice - Player's choice
 */
async function playRound(playerChoice) {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    
    // Update player choice immediately
    elements.playerChoiceIcon.textContent = CHOICE_EMOJIS[playerChoice];
    elements.playerChoiceIcon.classList.add('active');
    
    // Show thinking animation
    showThinkingAnimation();
    elements.resultText.textContent = 'Computer is thinking...';
    elements.resultText.classList.remove('win', 'lose', 'tie');
    
    // Wait for dramatic effect
    await delay(800);
    
    // Get computer choice and determine winner
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    
    // Hide thinking and show result
    hideThinkingAnimation();
    updateChoiceDisplays(playerChoice, computerChoice);
    updateResultDisplay(result);
    
    // Update game state
    updateGameState(result);
    updateUI();
    
    // Save to local storage
    saveGame();
    
    gameState.isPlaying = false;
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.gamesPlayed = 0;
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.ties = 0;
    gameState.currentStreak = 0;
    
    resetChoiceDisplays();
    updateUI();
    
    // Clear local storage
    localStorage.removeItem('rpsGameState');
    
    // Add reset animation to button
    elements.resetBtn.querySelector('.reset-icon').style.animation = 'spin 0.5s ease-in-out';
    setTimeout(() => {
        elements.resetBtn.querySelector('.reset-icon').style.animation = '';
    }, 500);
}

// ===== Utility Functions =====

/**
 * Delay execution
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Save game state to local storage
 */
function saveGame() {
    localStorage.setItem('rpsGameState', JSON.stringify(gameState));
}

/**
 * Load game state from local storage
 */
function loadGame() {
    const savedState = localStorage.getItem('rpsGameState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        Object.assign(gameState, parsed);
        updateUI();
    }
}

// ===== Event Listeners =====

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Choice buttons
    elements.rockBtn.addEventListener('click', () => playRound('rock'));
    elements.paperBtn.addEventListener('click', () => playRound('paper'));
    elements.scissorsBtn.addEventListener('click', () => playRound('scissors'));
    
    // Reset button
    elements.resetBtn.addEventListener('click', resetGame);
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (gameState.isPlaying) return;
        
        switch (e.key.toLowerCase()) {
            case 'r':
            case '1':
                playRound('rock');
                break;
            case 'p':
            case '2':
                playRound('paper');
                break;
            case 's':
            case '3':
                playRound('scissors');
                break;
            case 'escape':
                resetGame();
                break;
        }
    });
}

// ===== Initialize Game =====

/**
 * Initialize the game
 */
function init() {
    loadGame();
    initEventListeners();
    
    console.log('🎮 Rock Paper Scissors loaded!');
    console.log('Keyboard shortcuts: R/1 = Rock, P/2 = Paper, S/3 = Scissors, ESC = Reset');
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
