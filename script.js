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
        // Increment pomodoro count only when starting a work session
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
    updateDisplay();
}

function updateStatus() {
    pomodoroCount.textContent = `Daily Pomodoros: ${dailyPomodoros}`;
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    updateStatus();
    
    modeIcon.className = isWorkTime ? 'fas fa-sun' : 'fas fa-moon';
    
    modeToggle.setAttribute('aria-label', 
        isWorkTime ? 'Switch to rest mode' : 'Switch to work mode'
    );
    
    updateDisplay();
}

// Add event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('click', toggleMode);

// Initialize display
updateStatus(); 