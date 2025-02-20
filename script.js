// Get DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeToggle = document.getElementById('modeToggle');
const statusDisplay = document.getElementById('currentStatus');

// Initialize variables
let isWorkTime = true;
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerInterval = null;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerInterval === null) {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                toggleMode();
                return;
            }
            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    updateDisplay();
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    statusDisplay.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    modeToggle.textContent = isWorkTime ? 'Switch to Rest' : 'Switch to Work';
    updateDisplay();
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('click', toggleMode);

// Initialize display
updateDisplay(); 