const months = [ //用矩陣儲存每個月份的天數
    { name: "一月", days: 31 },
    { name: "二月", days: 28 },
    { name: "三月", days: 31 },
    { name: "四月", days: 30 },
    { name: "五月", days: 31 },
    { name: "六月", days: 30 },
    { name: "七月", days: 31 },
    { name: "八月", days: 31 },
    { name: "九月", days: 30 },
    { name: "十月", days: 31 },
    { name: "十一月", days: 30 },
    { name: "十二月", days: 31 }
  ];
  
  const createCalendar = (year, month) => {
    // 計算每個月的天數
    const days = [];
    // 計算本月第一天是星期幾
    const firstDay = new Date(year, month, 1).getDay();
    // 取得本月天數
    const lastDate = months[month].days;
    // 計算上個月的編號
    const lastMonth = month === 0 ? 11 : month - 1;
    // 取得上個月的天數
    const lastMonthLastDate = months[lastMonth].days;
  
    // 填充上個月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({day: lastMonthLastDate - i, otherMonth: true});
    }
  
    // 填充本月的日期
    for (let i = 1; i <= lastDate; i++) {
      days.push({day: i, otherMonth: false});
    }
  
    // 填充剩下的空白
    const lastDay = new Date(year, month, lastDate).getDay();
    const remainingCells = 6 - lastDay;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({day: i, otherMonth: true});
    }
  
    // 創建月曆
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");
  
    // 創建月曆標題
    const header = document.createElement("h2");
    header.innerText = `${year}年${months[month].name}`;
    calendar.appendChild(header);
  
    // 創建表格
    const table = document.createElement("table");
  
    // 創建星期幾標題
    const weekDaysRow = document.createElement("tr");
    for (let i = 0; i < 7; i++) {
      const th = document.createElement("th");
      th.innerText = ["日", "一", "二", "三", "四", "五", "六"][i];
      weekDaysRow.appendChild(th);
    }
    table.appendChild(weekDaysRow);
  
    // 填充日期
    for (let i = 0; i < days.length; i++) {
      if (i % 7 === 0) {
        // 創建新的星期行
        var weekRow = document.createElement("tr");
        table.appendChild(weekRow);
      }
  
      // 創建新的單元格
      const td = document.createElement("td");
      td.innerText = days[i].day;
  
      // 如果當前日期是今天，則標記單元格
      if (year === new Date().getFullYear() &&
          month === new Date().getMonth() &&
          days[i].day === new Date().getDate()) {
        td.classList.add("today");
      }
  
      // 如果日期是上個月的日期，則標記為 .other-month 樣式
      if (days[i].otherMonth) {
      td.classList.add("other-month");
    } else if (i % 7 === 0 || i % 7 === 6) { // 如果日期是週末，則標記為 .weekend 樣式
      td.classList.add("weekend");
    }

    weekRow.appendChild(td);
  }

  calendar.appendChild(table);
  return calendar;
};
  
  
  
  
  
  

const container = document.querySelector(".calendar-container");

for (let i = 0; i < 12; i++) {
container.appendChild(createCalendar(2023, i));
}