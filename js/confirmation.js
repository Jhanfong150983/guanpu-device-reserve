document.addEventListener("DOMContentLoaded", () => {
  const confirmationContainer = document.querySelector(".confirmation-container");
  const confirmButton = document.getElementById("confirm-button");

  // 從 localStorage 獲取用戶選擇的借用資訊
  const selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
  const selectedTimeSlots = JSON.parse(localStorage.getItem("selectedTimeSlots")) || [];
  const selectedSubcategory = localStorage.getItem("selectedSubcategory") || "未選擇設備";
  const selectedQuantities = JSON.parse(localStorage.getItem("selectedQuantities")) || {}; // 獲取借用數量

  // 檢查是否有借用資訊
  if (selectedDates.length === 0 || selectedTimeSlots.length === 0) {
    confirmationContainer.innerHTML = `
      <p class="no-data">尚未選擇任何借用資訊。</p>
    `;
    confirmButton.disabled = true; // 禁用確認按鈕
    return;
  }

  // 動態生成借用資訊列表
  selectedDates.forEach((date) => {
    selectedTimeSlots.forEach((timeSlot) => {
      const quantityKey = `${date}_${timeSlot}_${selectedSubcategory}`; // 對應的借用數量鍵
      const borrowedQuantity = selectedQuantities[quantityKey] || 0; // 獲取借用數量，默認為 0

      const div = document.createElement("div");
      div.classList.add("confirmation-item");
      div.innerHTML = `
        <p><strong>日期：</strong>${date}</p>
        <p><strong>時段：</strong>${timeSlot}</p>
        <p><strong>設備名稱：</strong>${selectedSubcategory}</p>
        <p><strong>預約數量：</strong>${borrowedQuantity}</p>
      `;
      confirmationContainer.appendChild(div);
    });
  });

  // 點擊確認按鈕
  confirmButton.addEventListener("click", () => {
    alert("借用資訊已送出！");
    // 清空 localStorage 或執行其他提交邏輯
    localStorage.clear();
    window.location.href = "success.html"; // 跳轉到成功頁面
  });
});