document.addEventListener("DOMContentLoaded", () => {
  // 檢查是否為 index.html 頁面
  if (window.location.pathname.endsWith("date-selection.html")) {
    // 清空 localStorage 中的選擇日期
    localStorage.removeItem("selectedDates");
    selectedDates = new Set(); // 初始化選擇日期的 Set
  } else {
    // 從 localStorage 加載已選擇的日期
    const storedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
    storedDates.forEach((date) => selectedDates.add(date));
  }

  // 初始化日曆
  generateCalendar(currentYear, currentMonth);
});

const calendarEl = document.getElementById("calendar-grid");
const calendarTitleEl = document.getElementById("calendar-title");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const nextButton = document.querySelector(".next-step-button");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDates = new Set(); // 使用 Set 來追蹤已選擇的日期

// 從 localStorage 加載已選擇的日期
const storedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
storedDates.forEach((date) => selectedDates.add(date));

function generateCalendar(year, month) {
  calendarEl.innerHTML = "";
  calendarTitleEl.textContent = `${year}年${month + 1}月`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
  const today = new Date(); // 獲取今天的日期
  const maxDate = new Date(today); // 計算 180 天後的日期
  maxDate.setDate(today.getDate() + 180);

  // 添加星期標題
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  weekdays.forEach((d, index) => {
    const dayEl = document.createElement("div");
    dayEl.textContent = d;
    dayEl.style.fontWeight = "bold";
    dayEl.classList.add("weekday-header");

    // 點擊事件：框選整個月中該星期的所有日期
    dayEl.addEventListener("click", () => {
      toggleWeekDaySelection(index, year, month);
    });

    calendarEl.appendChild(dayEl);
  });

  // 添加空白日期格
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  // 添加所有日期格
  for (let i = 1; i <= daysInMonth; i++) {
    const dateEl = document.createElement("div");
    dateEl.textContent = i;
    dateEl.classList.add("date-cell");

    // 儲存日期資料方便後續操作
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    dateEl.dataset.dateKey = dateKey;

    const currentDate = new Date(year, month, i);

    // 禁用今日以前的日期
    if (currentDate < today.setHours(0, 0, 0, 0)) {
      dateEl.classList.add("disabled-date");
    } 
    // 禁用超過 180 天的日期
    else if (currentDate > maxDate) {
      dateEl.classList.add("disabled-date");
    } 
    else {
      // 檢查日期是否已被選中
      if (selectedDates.has(dateKey)) {
        dateEl.classList.add("selected-date");
      }

      // 點擊事件：切換單一日期的選擇狀態
      dateEl.addEventListener("click", (event) => {
        event.stopPropagation(); // 防止與框選星期的邏輯衝突
        toggleDateSelection(dateKey, dateEl);
      });
    }

    calendarEl.appendChild(dateEl);
  }
}

// 切換單一日期的選擇狀態
function toggleDateSelection(dateKey, dateEl) {
  if (selectedDates.has(dateKey)) {
    selectedDates.delete(dateKey);
    dateEl.classList.remove("selected-date");
  } else {
    selectedDates.add(dateKey);
    dateEl.classList.add("selected-date");
  }

  // 更新 localStorage
  localStorage.setItem("selectedDates", JSON.stringify(Array.from(selectedDates)));

  // 調試輸出
  console.log("目前選擇的日期：", Array.from(selectedDates));
}

// 切換特定星期幾的所有日期的選擇狀態
function toggleWeekDaySelection(dayOfWeek, year, month) {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const daysInMonth = lastDate.getDate();
  const today = new Date(); // 獲取今天的日期

  // 計算該星期幾的所有日期
  let weekdayDates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === dayOfWeek && date >= today.setHours(0, 0, 0, 0)) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      weekdayDates.push(formattedDate);
    }
  }

  // 檢查是否所有該星期幾的日期都已被選中
  let allSelected = true;
  for (let dateKey of weekdayDates) {
    if (!selectedDates.has(dateKey)) {
      allSelected = false;
      break;
    }
  }

  // 如果全部已選中，則取消所有選擇，否則全部選中
  weekdayDates.forEach((dateKey) => {
    const dateEl = document.querySelector(`[data-date-key="${dateKey}"]`);

    if (allSelected) {
      selectedDates.delete(dateKey);
      if (dateEl) dateEl.classList.remove("selected-date");
    } else {
      selectedDates.add(dateKey);
      if (dateEl) dateEl.classList.add("selected-date");
    }
  });

  // 更新 localStorage
  localStorage.setItem("selectedDates", JSON.stringify(Array.from(selectedDates)));
  // 調試輸出
  console.log("目前選擇的日期：", Array.from(selectedDates));
}

// 上一個月按鈕
prevMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

// 下一個月按鈕
nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// 下一步按鈕
nextButton.addEventListener("click", () => {
  console.log("目前選擇的日期數量：", selectedDates.size);
  if (selectedDates.size === 0) {
    alert("請至少選擇一個日期！");
    return;
  }
  window.location.href = "time-selection.html"; // 跳轉到下一步
});

// 初始化日曆
generateCalendar(currentYear, currentMonth);