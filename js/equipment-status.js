document.addEventListener("DOMContentLoaded", () => {
  const currentDateLabel = document.getElementById("current-date");
  const prevDateButton = document.getElementById("prev-date");
  const nextDateButton = document.getElementById("next-date");
  const reservationContainer = document.querySelector(".reservation-container");

  let currentDate = new Date(); // 當前日期

  const timeSlots = [
    { label: "晨光段", time: "08:10-08:35" },
    { label: "第一節", time: "08:40-09:20" },
    { label: "第二節", time: "09:30-10:10" },
    { label: "第三節", time: "10:30-11:10" },
    { label: "第四節", time: "11:20-12:00" },
    { label: "午休段", time: "12:10-13:20" },
    { label: "第五節", time: "13:30-14:10" },
    { label: "第六節", time: "14:20-15:00" },
    { label: "第七節", time: "15:15-15:55" },
    { label: "放學後", time: "16:10-21:00" },
  ];

  let reservations = {}; // 儲存從 Google Sheets 獲取的資料

  // 更新日期顯示
  function updateDateLabel() {
    const options = { month: "short", day: "2-digit" };
    currentDateLabel.textContent = currentDate.toLocaleDateString("en-US", options).toUpperCase();
  }

  // 生成預約資訊
  function generateReservations() {
    reservationContainer.innerHTML = ""; // 清空現有資料

    const dateKey = currentDate.toISOString().split("T")[0]; // 格式化為 YYYY-MM-DD

    timeSlots.forEach((slot, index) => {
      const card = document.createElement("div");
      card.classList.add("reservation-card");

      // 根據時間段索引設置不同的背景顏色
      const colors = ["#e3f2fd", "#fce4ec", "#e8f5e9", "#fff9c4", "#d1c4e9", "#ffccbc", "#c8e6c9", "#b3e5fc", "#ffcdd2", "#d7ccc8"];
      card.style.backgroundColor = colors[index % colors.length];

      const header = document.createElement("div");
      header.classList.add("card-header");
      header.textContent = `${slot.label} (${slot.time})`;

      card.appendChild(header);

      if (reservations[dateKey] && reservations[dateKey][slot.time]) {
        reservations[dateKey][slot.time].forEach((res) => {
          const item = document.createElement("div");
          item.classList.add("reservation-item");
          item.innerHTML = `<span>「${res["借用教師"]}」</span>${res["預約地點"]}</p>${res["項目類別"]} - ${res["設備名稱"]} (${res["預約數量"]})`;
          card.appendChild(item);
        });
      } else {
        const noDataItem = document.createElement("div");
        noDataItem.classList.add("reservation-item");
        noDataItem.textContent = "無預約資料";
        card.appendChild(noDataItem);
      }

      reservationContainer.appendChild(card);
    });
  }

  // 從 Google Sheets 獲取資料
  async function fetchReservations() {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxRvOeC5WnUV6vLYuYwNwHAv0iWx3TdNnTwcmrD-cRcuoxIQI2qtRbAAFyzos5w_F-m/exec?action=getReservations"); // 替換為您的 Web App URL
      const result = await response.json();

      console.log("獲取的資料：", result); // 將獲取的資料輸出到 console 以便調試

      if (result.success) {
        // 將資料轉換為以日期和時段為鍵的結構
        reservations = result.data.reduce((acc, item) => {
          // 確保日期處理為本地時間
          const date = new Date(item["預約日期"]);
          const localDate = date.toISOString().split("T")[0]; // 保留 YYYY-MM-DD 格式
          const time = item["預約時段"];
          if (!acc[localDate]) acc[localDate] = {};
          if (!acc[localDate][time]) acc[localDate][time] = [];
          acc[localDate][time].push(item);
          return acc;
        }, {});

        // 在 console 中輸出轉換後的資料結構
      console.log("轉換後的 reservations 資料結構:", reservations);

        generateReservations(); // 生成卡片
      } else {
        console.error("無法獲取資料：", result.message);
      }
    } catch (error) {
      console.error("請求失敗：", error);
    }
  }

  // 切換日期
  prevDateButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateLabel();
    generateReservations();
  });

  nextDateButton.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateLabel();
    generateReservations();
  });

  // 初始化
  updateDateLabel();
  fetchReservations(); // 獲取資料並生成卡片
});
