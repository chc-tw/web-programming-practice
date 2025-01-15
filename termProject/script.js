document.getElementById('theme-switcher').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    var themeIcon = document.getElementById('theme-icon');
    themeIcon.src = document.body.classList.contains('dark-mode') ? 'moon.png' : 'sun.png';
});

document.getElementById('weather-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('daily-weather').classList.add('active');
    document.getElementById('weather-nav').classList.add('active');
    document.getElementById('daily-tasks').classList.remove('active');
    document.getElementById('todolist-nav').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.remove('active');
    document.getElementById('daily-schedule').classList.remove('active');
    document.getElementById('pomodoro-nav').classList.remove('active');
    document.getElementById('pomodoro').style.display = 'none';
});

document.getElementById('todolist-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('daily-tasks').classList.add('active');
    document.getElementById('todolist-nav').classList.add('active');
    document.getElementById('daily-weather').classList.remove('active');
    document.getElementById('weather-nav').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.remove('active');
    document.getElementById('daily-schedule').classList.remove('active');
    document.getElementById('pomodoro-nav').classList.remove('active');
    document.getElementById('pomodoro').style.display = 'none';
});

document.getElementById('dailyplanner-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.add('active');
    document.getElementById('daily-schedule').classList.add('active');
    document.getElementById('daily-weather').classList.remove('active');
    document.getElementById('weather-nav').classList.remove('active');
    document.getElementById('todolist-nav').classList.remove('active');
    document.getElementById('daily-tasks').classList.remove('active');
    document.getElementById('pomodoro-nav').classList.remove('active');
    document.getElementById('pomodoro').style.display = 'none';
});

document.getElementById('pomodoro-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('pomodoro-nav').classList.add('active');
    document.getElementById('pomodoro').style.display = 'flex';
    document.getElementById('daily-weather').classList.remove('active');
    document.getElementById('weather-nav').classList.remove('active');
    document.getElementById('todolist-nav').classList.remove('active');
    document.getElementById('daily-tasks').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.remove('active');
    document.getElementById('daily-schedule').classList.remove('active');
});



function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();


const apiKey = "xxxx";
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

function getWeather(city) {
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;  
            const humidity = data.main.humidity; 
            const windSpeed = data.wind.speed;  
            const description = data.weather[0].description;  
            const icon = data.weather[0].icon;  
            const weatherDiv = document.getElementById('weather');

            
            document.getElementById('weather-description').textContent = description;
            document.getElementById('weather-temperature').textContent = `溫度：${temperature}`;
            document.getElementById('weather-humidity').textContent = `濕度：${humidity}`;
            document.getElementById('weather-windspeed').textContent = `風速：${windSpeed}`;
            
            const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
            const img = document.createElement('img');
            img.src = iconUrl;
            const weatherIconDiv = document.getElementById('weather-icon');
            weatherIconDiv.textContent = '';
            weatherIconDiv.appendChild(img);
        })
        .catch(err => console.error(err));
}

const citySelect = document.getElementById('city-select');


citySelect.addEventListener('change', (e) => {
    const city = e.target.value;
    console.log(city)
    getWeather(city);
});

getWeather('Taipei');  


// Get new form inputs
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskName = document.getElementById('task-name');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskStatus = document.getElementById('task-status');

window.addEventListener('load', (e) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
    updateTaskStatus();
    clearTasksAt6AM();
});

function updateTaskStatus() {
    const tasks = taskList.children;
    let completedTasks = 0;

    for (let task of tasks) {
        if (task.querySelector('.task-completed').checked) {
            completedTasks++;
        }
    }

    taskStatus.textContent = `未完成任務數/任務數：${completedTasks}/${tasks.length}`;
}

// Function to convert priority level to a numerical value
function getPriorityValue(priority) {
    switch (priority) {
        case '高':
            return 3;
        case '中':
            return 2;
        case '低':
            return 1;
        default:
            return 0;
    }
}
// Function to convert priority level to a class
function getPriorityClass(priority) {
    switch (priority) {
        case '高':
            return 'task-priority-high';
        case '中':
            return 'task-priority-mid';
        case '低':
            return 'task-priority-low';
        default:
            return '';
    }
}

// Helper function to sort tasks by priority
function sortTasks() {
    // Convert HTMLCollection to array
    const tasksArray = Array.from(taskList.children);

    // Filter out the header element
    // const header = tasksArray.filter(task => task.querySelector('.task-name').textContent === "名字")[0];
    //const tasksWithoutHeader = tasksArray.filter(task => task.querySelector('.task-name').textContent !== "名字");

    // Group by category
    const groupedByCategory = tasksArray.reduce((groupedTasks, task) => {
        const category = task.querySelector('.task-category').textContent;
        if (!groupedTasks[category]) {
            groupedTasks[category] = [];
        }
        groupedTasks[category].push(task);
        return groupedTasks;
    }, {});

    // Sort within each category by priority
    Object.values(groupedByCategory).forEach(tasks => {
        tasks.sort((a, b) => {
            const aPriority = getPriorityValue(a.querySelector('.task-priority').textContent);
            const bPriority = getPriorityValue(b.querySelector('.task-priority').textContent);
            return bPriority - aPriority;
        });
    });
    
    // Remove all tasks from list
    while (taskList.firstChild) {
        taskList.firstChild.remove();
    }

    // // Add header back to list
    // taskList.appendChild(header);

    // Add tasks back to list in sorted order
    Object.values(groupedByCategory).forEach(tasks => {
        tasks.forEach(task => taskList.appendChild(task));
    });
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const task = {
        name: taskName.value,
        category: taskCategory.value,
        priority: taskPriority.value
    };

    
    addTaskToDOM(task);
    addTaskToLocalStorage(task);
    
    taskName.value = '';
    taskCategory.value = '';
    updateTaskStatus();
    populateTaskNames();
});
updateTaskStatus();

// Remove task from localStorage
function removeTaskFromLocalStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskToRemove.name || task.category !== taskToRemove.category || task.priority !== taskToRemove.priority);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function addTaskToDOM(task) {
    const newTask = document.createElement('li');
    newTask.classList.add(getPriorityClass(task.priority));
    newTask.innerHTML = `
        <div class="task-name">${task.name}</div>
        <div class="task-category">${task.category}</div>
        <div class="task-priority">${task.priority}</div>
        <input type="checkbox" class="task-completed">
        <button class="task-delete">刪除</button>
    `;
    //
    // Add delete button functionality
    newTask.querySelector('.task-delete').addEventListener('click', () => {
        taskList.removeChild(newTask);
        removeTaskFromLocalStorage(task);
        populateTaskNames();
        updateTaskStatus();
    });

    // Add task completion functionality
    newTask.querySelector('.task-completed').addEventListener('change', updateTaskStatus);

    // Add task to list and sort
    taskList.appendChild(newTask);
    // Initialize planner

    sortTasks();
}


function addTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function clearTasksAt6AM() {
    const now = new Date();
    let millisTill6AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0) - now;
    if (millisTill6AM < 0) { 
        millisTill6AM += 86400000;
    }
    setTimeout(() => {
        localStorage.removeItem('tasks');
        while (taskList.firstChild) {
            taskList.firstChild.remove();
        }
        updateTaskStatus();
        clearTasksAt6AM();
    }, millisTill6AM);
}

// To do list

// Insert new tasks
function clearSchedule() {
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(timeSlot => {
        timeSlot.textContent = '';
        timeSlot.style.backgroundColor = 'transparent';
    });
}


function populateSchedule() {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const timeSlots = document.querySelectorAll('.time-slot');
    schedules.forEach(schedule => {
        const startSlot = document.querySelector(`.time-slot[data-time="${schedule.startTime}"]`);
        const endSlot = document.querySelector(`.time-slot[data-time="${schedule.endTime}"]`);
        if (startSlot && endSlot) {
            const startIndex = Array.from(timeSlots).indexOf(startSlot);
            const endIndex = Array.from(timeSlots).indexOf(endSlot);
            
            for (let i = startIndex; i < endIndex; i++) {
                const slot = timeSlots[i];
                slot.style.backgroundColor = schedule.color;
                if (i === Math.floor((startIndex + endIndex) / 2)) {
                    slot.textContent = schedule.taskName;
                }
            }
        }
    });
}

function populateTaskNames() {
    const scheduleTasks = document.getElementById('schedule-tasks');
    scheduleTasks.innerHTML = '';
    
    // Get the datalist
    const datalist = document.getElementById('task-names');
    

    // Clear any existing options
    datalist.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;
        scheduleTasks.appendChild(taskItem);

        // Add the task to the datalist
        const option = document.createElement('option');
        option.value = task.name;
        datalist.appendChild(option);
    });

    // Get schedules from localStorage
    populateSchedule();
}


function createTimeSlots() {
    const timeOptions = [];
    for (let i = 6; i < 27; i++) {
        let hour = i;
        if (hour > 24) hour -= 24;
        const time1 = `${hour.toString().padStart(2, '0')}:00`;
        timeOptions.push(time1);

        if (i != 26) {  // Don't add a half-hour slot for the last interval
            const time2 = `${hour.toString().padStart(2, '0')}:30`;
            timeOptions.push(time2);
        }
    }

    const timeTableBody = document.getElementById('schedule-body');
    const startTimeSelect = document.getElementById('schedule-start');
    const endTimeSelect = document.getElementById('schedule-end');
    const startTimeSelectEdit = document.getElementById('edit-start');
    const endTimeSelectEdit = document.getElementById('edit-end');
    timeOptions.forEach(timeOption => {
        // Add row to time table
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        const taskCell = document.createElement('td');

        timeCell.textContent = timeOption;
        timeCell.classList.add('time-column');
        taskCell.classList.add('time-slot');
        taskCell.dataset.time = timeOption;

        row.appendChild(timeCell);
        row.appendChild(taskCell);
        timeTableBody.appendChild(row);

        // Add options to start and end time select inputs
        const startOption = document.createElement('option');
        startOption.value = timeOption;
        startOption.text = timeOption;
        startTimeSelect.appendChild(startOption);
        startTimeSelectEdit.appendChild(startOption.cloneNode(true));

        const endOption = document.createElement('option');
        endOption.value = timeOption;
        endOption.text = timeOption;
        endTimeSelect.appendChild(endOption);
        endTimeSelectEdit.appendChild(endOption.cloneNode(true));
        
    });
}


document.getElementById('schedule-add').addEventListener('click', function() {
    const startTime = document.getElementById('schedule-start').value;
    const endTime = document.getElementById('schedule-end').value;
    const taskName = document.getElementById('schedule-name').value;
    const color = document.getElementById('schedule-color').value;

    const newSchedule = {
        startTime,
        endTime,
        taskName,
        color
    };

    // Get existing schedules or initialize to empty array if none exist
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];

    // Add the new schedule and save to localStorage
    schedules.push(newSchedule);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    
    // Get the table rows
    const tableRows = document.getElementById('schedule-body').children;

    let startIdx = -1;
    let endIdx = -1;

    // Find start and end indices
    for (let i = 0; i < tableRows.length; i++) {
        if (tableRows[i].children[0].textContent === startTime && startIdx === -1) {
            startIdx = i;
        }
        if (tableRows[i].children[0].textContent === endTime && endIdx === -1) {
            endIdx = i;
        }
    }

    // Get the middle index to add the task name
    const middleIdx = startIdx + Math.floor((endIdx - startIdx) / 2);

    // Add the task to the rows and change the color
    for (let i = startIdx; i < endIdx; i++) {
        if (i === middleIdx) {
            tableRows[i].children[1].textContent = taskName;
        }
        tableRows[i].children[1].style.backgroundColor = color;
    }
});

document.getElementById('clear-schedule').addEventListener('click', function() {
    // Clear schedules from localStorage
    localStorage.removeItem('schedules');

    // Clear time slots from the table
    clearSchedule();
});

createTimeSlots();
populateTaskNames();


// edit the schedule

// Get the modal
var modal = document.getElementById("edit-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Get all time slots
var timeSlots = document.querySelectorAll('.time-slot');

// Add event listener to each time slot
timeSlots.forEach(timeSlot => {
    timeSlot.addEventListener('click', function() {
        const schedule = JSON.parse(localStorage.getItem('schedules')) || [];
        console.log(schedule);
        const clickedTime = this.dataset.time;

        // Find schedule that spans across the clicked time
        const currentSchedule = schedule.find(s => s.startTime <= clickedTime && s.endTime > clickedTime);
        console.log(currentSchedule);
        if (!currentSchedule) return; // if no schedule at this time, do nothing

        document.getElementById('edit-start').value = currentSchedule.startTime;
        document.getElementById('edit-end').value = currentSchedule.endTime;
        document.getElementById('edit-name').value = currentSchedule.taskName;
        document.getElementById('edit-color').value = currentSchedule.color;

        modal.style.display = "block";
    });
});



// Handle form submission
document.getElementById('edit-submit').addEventListener('click', function() {
    const schedule = JSON.parse(localStorage.getItem('schedules')) || [];
    const index = schedule.findIndex(s => s.startTime <= document.getElementById('edit-start').value && s.endTime > document.getElementById('edit-start').value);
    console.log(index)
    if (index < 0) return; // if no schedule found, do nothing

    const updatedSchedule = {
        startTime: document.getElementById('edit-start').value,
        endTime: document.getElementById('edit-end').value,
        taskName: document.getElementById('edit-name').value,
        color: document.getElementById('edit-color').value,
    };

    console.log(updatedSchedule.startTime, updatedSchedule.endTime, updatedSchedule.taskName, updatedSchedule.color);

    // Update schedule in localStorage
    schedule[index] = updatedSchedule;
    localStorage.setItem('schedules', JSON.stringify(schedule));

    // Update schedule on the table
    clearSchedule(); // function to clear the schedule table
    populateSchedule(); // function to repopulate the schedule table from localStorage

    modal.style.display = "none";
});

// pomodoro
let timesUpSound = new Audio('timesup.mp3');
let timeLeft; 
let timeStart = 5;
let timerInterval;
let totalFocusTime = localStorage.getItem('totalFocusTime') ? Number(localStorage.getItem('totalFocusTime')) : 0; 
let isBreakTime = false;

const timerDisplay = document.getElementById('timer-display');
const addTimeButton = document.getElementById('add-time');
const subtractTimeButton = document.getElementById('subtract-time');
const startTimerButton = document.getElementById('start-timer');
const resetTimerButton = document.getElementById('reset-timer');
const stopTimerButton = document.getElementById('stop-timer');
const totalFocusTimeDisplay = document.getElementById('total-focus-time');

function updateDisplayTime() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateFocusTime() {
  totalFocusTimeDisplay.textContent = Math.floor(totalFocusTime / 60);
  localStorage.setItem('totalFocusTime', totalFocusTime); 
}

function startBreakTime() {
  timeStart = 25 * 60; 
  timeLeft = timeStart;
  isBreakTime = true;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplayTime();
    } else {
        clearInterval(timerInterval);
        timeLeft = timeStart;
        updateDisplayTime();
        timesUpSound.play();
        isBreakTime = false;
    }
  }, 1000);
}

addTimeButton.addEventListener('click', () => {
  if (!isBreakTime) {
    timeStart += 5 * 60;
    timeLeft = timeStart;
    updateDisplayTime();
  }
});

subtractTimeButton.addEventListener('click', () => {
  if (!isBreakTime && timeStart >= 5 * 60) {
    timeStart -= 5 * 60;
    timeLeft = timeStart;
    updateDisplayTime();
  }
});

startTimerButton.addEventListener('click', () => {
  if (!isBreakTime) {
    timeLeft = timeStart;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        totalFocusTime++;
        updateDisplayTime();
        updateFocusTime();
      } else {
        clearInterval(timerInterval);
        timesUpSound.play();
        startBreakTime();
      }
    }, 1000);
  }
});

resetTimerButton.addEventListener('click', () => {
  if (!isBreakTime) {
    clearInterval(timerInterval);
    timeLeft = timeStart;
    updateDisplayTime();
  }
});

stopTimerButton.addEventListener('click', () => {
  clearInterval(timerInterval);
});