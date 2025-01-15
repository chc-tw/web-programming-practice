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
    document.getElementById('daily-planner').classList.remove('active');
});

document.getElementById('todolist-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('daily-tasks').classList.add('active');
    document.getElementById('todolist-nav').classList.add('active');
    document.getElementById('daily-weather').classList.remove('active');
    document.getElementById('weather-nav').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.remove('active');
    document.getElementById('daily-planner').classList.remove('active');
});

document.getElementById('dailyplanner-nav').addEventListener('click', function() {
    //document.querySelector('.feature.active').classList.remove('active');
    document.getElementById('dailyplanner-nav').classList.add('active');
    document.getElementById('daily-planner').classList.add('active');
    document.getElementById('daily-weather').classList.remove('active');
    document.getElementById('weather-nav').classList.remove('active');
    document.getElementById('todolist-nav').classList.remove('active');
    document.getElementById('daily-tasks').classList.remove('active');
});



// 實時更新時間
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();  // 立即顯示時間，不用等待第一個間隔

// 取得天氣
const apiKey = '9b5de20d3b7b200da28e50ec80cb5b64';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

function getWeather(city) {
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;  // 得到溫度
            const humidity = data.main.humidity; // 得到濕度
            const windSpeed = data.wind.speed; // 得到風速
            const description = data.weather[0].description;  // 得到天氣描述
            const icon = data.weather[0].icon;  // 得到圖標代碼
            const weatherDiv = document.getElementById('weather');

            // 顯示天氣
            document.getElementById('weather-description').textContent = description;
            document.getElementById('weather-temperature').textContent = `溫度：${temperature}`;
            document.getElementById('weather-humidity').textContent = `濕度：${humidity}`;
            document.getElementById('weather-windspeed').textContent = `風速：${windSpeed}`;
            // 顯示圖標
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

// 透過選單選擇城市並顯示天氣
citySelect.addEventListener('change', (e) => {
    const city = e.target.value;
    console.log(city)
    getWeather(city);
});

getWeather('Taipei');  // 獲取台北的天氣資訊


// Get new form inputs
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskName = document.getElementById('task-name');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskStatus = document.getElementById('task-status');

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
    const tasksWithoutHeader = tasksArray.filter(task => task.querySelector('.task-name').textContent !== "名字");

    // Group by category
    const groupedByCategory = tasksWithoutHeader.reduce((groupedTasks, task) => {
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

    // Create new task item
    const newTask = document.createElement('li');
    newTask.classList.add(getPriorityClass(taskPriority.value));
    newTask.innerHTML = `
        <div class="task-name">${taskName.value}</div>
        <div class="task-category">${taskCategory.value}</div>
        <div class="task-priority">${taskPriority.value}</div>
        <input type="checkbox" class="task-completed">
        <button class="task-delete">刪除</button>
    `;

    // Add delete button functionality
    newTask.querySelector('.task-delete').addEventListener('click', () => {
        taskList.removeChild(newTask);
        updateTaskStatus();
    });

    // Add task completion functionality
    newTask.querySelector('.task-completed').addEventListener('change', updateTaskStatus);

    // Add task to list and sort
    taskList.appendChild(newTask);
    sortTasks();
    

    // Update task status and clear form
    updateTaskStatus();
    taskName.value = '';
    taskCategory.value = '';
    initializePlanner();
});
updateTaskStatus();

// Get required elements
const unplannedTasks = document.getElementById('unplanned-tasks');
const plannerTable = document.getElementById('planner-table');


function initializePlanner() {
    // Copy tasks from task list to unplanned tasks list
    const tasksArray = Array.from(taskList.children);
    tasksArray.forEach(task => {
        const taskName = task.querySelector('.task-name').textContent;
        const newTask = document.createElement('li');
        newTask.textContent = taskName;
        unplannedTasks.appendChild(newTask);
    });

    // Generate planner table
    let plannerHTML = '<tr><th>時間</th><th>任務</th></tr>';
    const startHour = 6;
    const endHour = 27;  // End at 3am next day
    for (let i = startHour; i < endHour; i++) {
        const hour = i % 24;  // Convert to 24-hour time
        plannerHTML += `<tr><td>${hour}:00</td><td></td></tr>`;
        plannerHTML += `<tr><td>${hour}:30</td><td></td></tr>`;
    }
    plannerTable.innerHTML = plannerHTML;
}

// Initialize planner
initializePlanner();
