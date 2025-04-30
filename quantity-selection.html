document.addEventListener("DOMContentLoaded", () => {
  // 清空 localStorage 中的預約數量
  localStorage.setItem("selectedQuantities", JSON.stringify({}));
  console.log("localStorage 中的預約數量已清空");
  
  // 假設從 localStorage 獲取選中的日期和時段
  const selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
  const selectedTimeSlots = JSON.parse(localStorage.getItem("selectedTimeSlots")) || [];
  const selectedSubcategory = localStorage.getItem("selectedSubcategory") || "未選擇設備";

  const scrollableContainer = document.querySelector(".scrollable-container");
  const loadingOverlay = document.querySelector(".loading-overlay"); // 假設有一個 loadingOverlay 元素
  const API_URL = "https://script.google.com/macros/s/AKfycbxLGKDaqkCM6JTFehiIMB_fbkyEQxNe3cpk2-hylJksk2emd3xcu27wCKxeW9NkqA_i/exec";

  // 時段對照表
  const timeSlotLabels = {
    "08:10-08:35": "晨光段",
    "08:40-09:20": "第一節",
    "09:30-10:10": "第二節",
    "10:30-11:10": "第三節",
    "11:20-12:00": "第四節",
    "12:10-13:20": "午休段",
    "13:30-14:10": "第五節",
    "14:20-15:00": "第六節",
    "15:15-15:55": "第七節",
    "16:10-21:00": "放學後"
  };

  // 顯示 loadingOverlay
  loadingOverlay.classList.remove("hidden");

  // 用於追蹤所有的 fetch 請求
  const fetchPromises = [];

  // 初始化 localStorage 中的借用數量
  const selectedQuantities = JSON.parse(localStorage.getItem("selectedQuantities")) || {};

  // 動態生成每筆日期與時段的可借用數量
  selectedDates.forEach((date) => {
    selectedTimeSlots.forEach((timeSlot, index) => {
      const lookupValue = `${date}_${timeSlot}_${selectedSubcategory}`; // 生成查閱值
      const requestUrl = `${API_URL}?action=lookupValue&lookupValue=${encodeURIComponent(lookupValue)}`; // 組合請求 URL

      // **顯示加載中的提示**
      const div = document.createElement("div");
      div.classList.add("quantity-item");
      div.innerHTML = `
        <p><strong>日期：</strong>${date}</p>
        <p><strong>時段：</strong>${timeSlotLabels[timeSlot] || "未知時段"} (${timeSlot})</p>
        <p><strong>剩餘數量：</strong>加載中...</p>
        <hr>
      `;
      scrollableContainer.appendChild(div);

      // 發送查閱值到後端，獲取剩餘總數量
const fetchPromise = fetch(requestUrl)
.then((response) => response.json())
.then((data) => {
  // 如果回傳的數據有效，使用回傳值；否則顯示「查詢失敗」
  const remainingQuantity =
    data.remainingQuantity !== undefined && data.remainingQuantity !== null
      ? data.remainingQuantity
      : "查詢失敗";

  // 檢查 localStorage 中是否已有數量值，否則設置為預設值 1
  const quantityKey = `${date}_${timeSlot}_${selectedSubcategory}`;
  if (!selectedQuantities[quantityKey]) {
    selectedQuantities[quantityKey] = remainingQuantity === 0 ? 0 : 1; // 如果剩餘數量為 0，預約數量設為 0，否則設為 1
    localStorage.setItem("selectedQuantities", JSON.stringify(selectedQuantities));
  }

  // 更新 DOM 中的剩餘數量和數字輸入框
  div.innerHTML = `
    <div class="quantity-item">
        <div class="info-section">
            <p><strong>日期：</strong>${date}</p>
            <p><strong>時段：</strong>${timeSlotLabels[timeSlot] || "未知時段"} (${timeSlot})</p>
            <p><strong>剩餘數量：</strong><span class="remaining-quantity">${remainingQuantity}</span></p>
        </div>
        <div class="input-section">
            <label for="quantity-${index + 1}"><strong>預約數量：</strong></label>
            <input type="number" id="quantity-${index + 1}" class="quantity-input" min="1" max="${remainingQuantity}" value="${selectedQuantities[quantityKey]}" ${remainingQuantity === 0 ? "disabled" : ""}>
        </div>
        <hr>
    </div>
  `;

  // 為數字輸入框添加事件監聽器
  const input = div.querySelector(`#quantity-${index + 1}`);
  if (input && remainingQuantity > 0) {
    input.addEventListener("input", () => {
      const max = parseInt(input.max, 10);
      const min = parseInt(input.min, 10);
      let value = parseInt(input.value, 10);

      // 如果輸入值小於最小值，設置為最小值
      if (value < min) {
        input.value = min;
      }

      // 如果輸入值大於最大值，設置為最大值
      if (value > max) {
        input.value = max;
      }

      // 更新 localStorage 中的借用數量
      selectedQuantities[quantityKey] = input.value;
      localStorage.setItem("selectedQuantities", JSON.stringify(selectedQuantities));

      // 調試輸出
      console.log("更新的借用數量：", selectedQuantities);
    });
  }
})
.catch((error) => {
  console.error("查詢失敗：", error);
  div.innerHTML = `
    <p><strong>查閱值：</strong>${lookupValue}</p>
    <p><strong>剩餘數量：</strong>查詢失敗</p>
    <hr>
  `;
});

      // 將每個 fetch 的 Promise 加入陣列
      fetchPromises.push(fetchPromise);
    });
  });

  // 等待所有的 fetch 請求完成後隱藏 loadingOverlay
  Promise.all(fetchPromises).then(() => {
    loadingOverlay.classList.add("hidden");
    console.log("所有剩餘數量已載入完成");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-button"); // 送出按鈕
  const API_URL = "https://script.google.com/macros/s/AKfycbyAFmx-LtuC13O9A6LKGADd_hOcOXO7eORGX1m71er307cewfa3ra4UhpvmGYCIACn-/exec"; // 替換為你的 Google Apps Script URL

  // 當送出按鈕被點擊時
  submitButton.addEventListener("click", () => {
    // 從 localStorage 獲取數據
    const selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
    const selectedTimeSlots = JSON.parse(localStorage.getItem("selectedTimeSlots")) || [];
    const selectedCategory = localStorage.getItem("selectedCategory") || "未選擇類別"; // 項目類別
    const selectedSubcategory = localStorage.getItem("selectedSubcategory") || "未選擇設備";
    const selectedQuantities = JSON.parse(localStorage.getItem("selectedQuantities")) || {};
    const teacherName = localStorage.getItem("loggedInUser") || "未知教師"; // 預約教師
    const selectedBorrowOptions = JSON.parse(localStorage.getItem("selectedBorrowOptions")) || []; // 選借設備
    const selectedLocation = localStorage.getItem("selectedLocation") || "未選擇地點";

    // 構造查閱值和其他參數
    const reservations = [];
    selectedDates.forEach((date) => {
      selectedTimeSlots.forEach((timeSlot) => {
        const quantityKey = `${date}_${timeSlot}_${selectedSubcategory}`;
        const quantity = selectedQuantities[quantityKey] || 0;

        // 如果數量為 0，跳過該項
        if (quantity === 0) return;

        // 構造查閱值
        const lookupValue = `${date}_${timeSlot}_${selectedSubcategory}`;

        // 將查閱值和其他參數加入 reservations
        reservations.push({
          lookupValue: lookupValue, // 添加查閱值
          date: date,
          timeSlot: timeSlot,
          category: selectedCategory, // 項目類別
          subcategory: selectedSubcategory,
          quantity: quantity,
          equipment1: selectedBorrowOptions[0] || "", // 選借設備1
          equipment2: selectedBorrowOptions[1] || "", // 選借設備2
          teacher: teacherName,
          location: selectedLocation, // 預約地點
        });
      });
    });

    // 如果沒有預約資料，提示用戶
    if (reservations.length === 0) {
      alert("請至少填寫一筆有效的預約數量！");
      return;
    }

    // **在送出資料前輸出所有變數**
    console.log("即將上傳的資料：", reservations);

    // 將資料序列化為查詢參數
    const queryParams = reservations
      .map((reservation, index) => {
        return Object.keys(reservation)
          .map((key) => `${encodeURIComponent(`${key}[${index}]`)}=${encodeURIComponent(reservation[key])}`)
          .join("&");
      })
      .join("&");

    const requestUrl = `${API_URL}?action=addReservation&${queryParams}`;

    console.log("發送的 URL:", requestUrl); // 將 URL 輸出到 console

    // 發送 GET 請求到後端
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("預約成功：", data.message);
          alert("預約資料已送出！");
          window.location.href = "index.html"; // 返回首頁
        } else {
          console.error("預約失敗：", data.message);
          alert("預約失敗，請稍後再試！");
        }
      })
      .catch((error) => {
        console.error("請求失敗：", error);
        alert("發生錯誤，請稍後再試！");
      });
  });
}); 
