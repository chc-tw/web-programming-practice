const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const numbers = document.querySelectorAll('#numbers span');

let intervals = [];
let stoppedNumbers = 0;

function generateUniqueNumbers(excludeNumbers) {
    let uniqueNumber;
    do {
        uniqueNumber = Math.floor(Math.random() * 49) + 1;
    } while (excludeNumbers.includes(uniqueNumber));
    return uniqueNumber;
}

function startLottery() {
    startBtn.textContent = stoppedNumbers === numbers.length ? 'Start Drawing' : 'Restart Drawing';
    stopBtn.disabled = false;
    stoppedNumbers = 0;

    numbers.forEach((number, index) => {
        if (intervals[index]) {
            clearInterval(intervals[index]);
        }
        intervals[index] = setInterval(() => {
            let excludeNumbers = [];
            for (let i = 0; i < index; i++) {
                excludeNumbers.push(parseInt(numbers[i].textContent));
            }
            number.textContent = generateUniqueNumbers(excludeNumbers);
        }, 100);
    });
}

startBtn.addEventListener('click', startLottery);

stopBtn.addEventListener('click', () => {
    if (stoppedNumbers < numbers.length) {
        clearInterval(intervals[stoppedNumbers]);
        stoppedNumbers++;

        if (stoppedNumbers === numbers.length) {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            startBtn.textContent = 'Start Drawing';
            stoppedNumbers = 0;
        }
    }
});
