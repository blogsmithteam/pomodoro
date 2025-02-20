// Get DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeToggle = document.getElementById('modeToggle');
const statusDisplay = document.getElementById('currentStatus');
const pomodoroCount = document.getElementById('pomodoroCount');
const modeIcon = modeToggle.querySelector('i');
const addFiveButton = document.getElementById('addFive');
const focusModal = document.getElementById('focusModal');
const focusInput = document.getElementById('focusInput');
const setFocusButton = document.getElementById('setFocus');
const focusDisplay = document.getElementById('focusDisplay');

// Initialize variables
let isWorkTime = true;
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerInterval = null;
let dailyPomodoros = 0;
let lastPomodoroDate = localStorage.getItem('lastPomodoroDate');
const today = new Date().toLocaleDateString();

// Initialize or reset daily count
if (lastPomodoroDate !== today) {
    localStorage.setItem('pomodoroCount', '0');
    localStorage.setItem('lastPomodoroDate', today);
} else {
    dailyPomodoros = parseInt(localStorage.getItem('pomodoroCount') || '0');
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display elements
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `(${timeString}) ${mode} - Pomodoro Timer`;
}

function startTimer() {
    if (timerInterval === null) {
        if (isWorkTime && !focusDisplay.textContent) {  // Only show modal if no focus is set
            focusModal.style.display = 'flex';
            return;
        }
        startTimerExecution();
    }
}

function startTimerExecution() {
    if (timerInterval === null) {
        if (isWorkTime) {
            dailyPomodoros++;
            localStorage.setItem('pomodoroCount', dailyPomodoros.toString());
            localStorage.setItem('lastPomodoroDate', today);
            updateStatus();
        }
        
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
    if (isWorkTime) {
        focusDisplay.textContent = '';  // Clear focus text on reset during work mode
    }
    updateDisplay();
}

function updateStatus() {
    pomodoroCount.textContent = `Daily Pomodoros: ${dailyPomodoros}`;
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    if (!isWorkTime) {
        focusDisplay.textContent = '';
    }
    updateStatus();
    modeIcon.className = isWorkTime ? 'fas fa-sun' : 'fas fa-moon';
    updateDisplay();
}

function addFiveMinutes() {
    // Only allow adding time during work mode
    if (isWorkTime) {
        timeLeft += 5 * 60; // Add 5 minutes in seconds
        updateDisplay();
    }
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('click', toggleMode);
addFiveButton.addEventListener('click', addFiveMinutes);

// Add event listeners for the modal
setFocusButton.addEventListener('click', () => {
    const focusText = focusInput.value.trim();
    if (focusText) {
        focusDisplay.textContent = `Focus: ${focusText}`;
        focusDisplay.style.marginTop = '10px'; // Add some spacing
    } else {
        focusDisplay.textContent = '';
    }
    focusModal.style.display = 'none';
    focusInput.value = '';
    startTimerExecution();
});

// Enhance modal close behavior
focusModal.addEventListener('click', (e) => {
    if (e.target === focusModal) {
        focusModal.style.display = 'none';
        if (!focusDisplay.textContent) {  // Only start if no focus is set
            startTimerExecution();
        }
    }
});

// Initialize display
updateStatus(); 