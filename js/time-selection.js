document.addEventListener("DOMContentLoaded", () => {
  const timeSlots = document.querySelectorAll(".time-slot");
  let selectedTimeSlots = new Set(
    JSON.parse(localStorage.getItem("selectedTimeSlots")) || []
  ); // 從 localStorage 加載已選擇的時段

  // 初始化已選擇的時段
  timeSlots.forEach((slot) => {
    slot.classList.remove("selected"); // 移除選中的樣式

    if (selectedTimeSlots.has(slot.dataset.time)) {
      slot.classList.add("selected"); // 添加選中的樣式
    }

    // 點擊事件：切換時段的選擇狀態
    slot.addEventListener("click", () => {
      const time = slot.dataset.time;

      if (selectedTimeSlots.has(time)) {
        selectedTimeSlots.delete(time); // 如果已選擇，則取消選擇
        slot.classList.remove("selected"); // 移除選中的樣式
      } else {
        selectedTimeSlots.add(time); // 新增選擇的時段
        slot.classList.add("selected"); // 添加選中的樣式
      }

      // 更新 localStorage
      const updatedTimeSlots = Array.from(selectedTimeSlots); // 將 Set 轉換為陣列
      localStorage.setItem("selectedTimeSlots", JSON.stringify(updatedTimeSlots));

      // 在 Console 中檢查更新的值
      console.log("更新的時段：", updatedTimeSlots);
    });
  });

  const nextButton = document.querySelector(".next-step-button");
  nextButton.addEventListener("click", () => {
    if (selectedTimeSlots.size === 0) {
      alert("請至少選擇一個時段！");
      return;
    }
    window.location.href = "item-selection.html"; // 跳轉到下一步
  });
});
