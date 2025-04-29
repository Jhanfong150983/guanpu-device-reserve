document.addEventListener("DOMContentLoaded", () => {
  // 清空 localStorage 中的 selectedLocation
  localStorage.removeItem("selectedLocation");
  console.log("已清空 selectedLocation");

  loadLocations(); // 加載使用地點

  // 清空選借設備的 localStorage
  localStorage.removeItem("selectedBorrowOptions");
  console.log("已清空選借設備");

  // DOM 元素
  const categorySelect = document.getElementById("category");
  const subcategorySelect = document.getElementById("subcategory");
  const borrowOptions = document.getElementById("borrow-options");
  const includedItems = document.getElementById("included-items");
  const loadingOverlay = document.getElementById("loading-overlay");
  const submitButton = document.getElementById("submit-button"); // 假設送出按鈕的 ID 是 submit-button

  // 本地儲存的選擇資料
  const selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];
  const selectedTimeSlots = JSON.parse(localStorage.getItem("selectedTimeSlots")) || [];

  console.log("選擇的日期：", selectedDates);
  console.log("選擇的時段：", selectedTimeSlots);

  let groupedData = {}; // 用於存儲設備清單資料

  // 顯示載入中提示
  loadingOverlay.classList.remove("hidden");

  // Google Apps Script 部署的 Web App URL
  const API_URL = "https://script.google.com/macros/s/AKfycbxLGKDaqkCM6JTFehiIMB_fbkyEQxNe3cpk2-hylJksk2emd3xcu27wCKxeW9NkqA_i/exec";

  // 從 Google Sheets 獲取設備清單
  fetch(`${API_URL}?action=getEquipmentList`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("設備清單：", data.data);

        // 將資料按類別分組
        groupedData = data.data.reduce((acc, item) => {
          if (!acc[item["項目類別"]]) acc[item["項目類別"]] = [];
          acc[item["項目類別"]].push(item);
          return acc;
        }, {});

        // 動態生成主要類別選項
        Object.keys(groupedData).forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });

        // 初始化主要類別選項
        categorySelect.dispatchEvent(new Event("change"));
      } else {
        console.error("獲取設備清單失敗：", data.message);
      }
    })
    .catch((error) => {
      console.error("請求失敗：", error);
    })
    .finally(() => {
      // 隱藏載入中提示
      loadingOverlay.classList.add("hidden");
    });

  // 當主要類別改變時，更新子類別選項
  categorySelect.addEventListener("change", () => {
    const selectedCategory = categorySelect.value;

    localStorage.setItem("selectedCategory", selectedCategory);

    // 清空子類別選項
    subcategorySelect.innerHTML = "";

    // 加載對應的子類別
    if (groupedData[selectedCategory]) {
      groupedData[selectedCategory].forEach((item) => {
        const option = document.createElement("option");
        option.value = item["設備名稱"];
        option.textContent = item["設備名稱"];
        subcategorySelect.appendChild(option);
      });
    }

    // 初始化設備詳細資訊
    subcategorySelect.dispatchEvent(new Event("change"));
  });

  subcategorySelect.addEventListener("change", () => {
    const selectedCategory = categorySelect.value;
    const selectedSubcategory = subcategorySelect.value;

    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("selectedSubcategory", selectedSubcategory);

    console.log("主要類別：", selectedCategory, "設備名稱:", selectedSubcategory);

    // 查找選中的設備資料
    const selectedItem = groupedData[selectedCategory].find(
      (item) => item["設備名稱"] === selectedSubcategory
    );

    // 更新設備詳細資訊
    if (selectedItem) {
      const totalQuantity = parseInt(selectedItem["設備總數量"]) || 0;
      includedItems.textContent = selectedItem["內含物品"] || "-";

      // 動態插入借用規範內容
      const applicationRulesContainer = document.getElementById("application-rules");
      applicationRulesContainer.innerHTML = "";
      const applicationRules = (selectedItem["借用規範"] || "").split("\n");
      applicationRules.forEach((rule) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = rule;
        applicationRulesContainer.appendChild(paragraph);
      });

      // 動態生成選借設備的勾選方塊
      borrowOptions.innerHTML = "";
      if (selectedItem["選借設備1"]) {
        borrowOptions.appendChild(createCheckbox(selectedItem["選借設備1"]));
      }
      if (selectedItem["選借設備2"]) {
        borrowOptions.appendChild(createCheckbox(selectedItem["選借設備2"]));
      }
    }
  });

  // 送出按鈕邏輯
  submitButton.addEventListener("click", () => {
    const selectedLocation = localStorage.getItem("selectedLocation");

    // 如果未選擇使用地點，提示用戶並阻止下一步
    if (!selectedLocation || selectedLocation === "") {
      alert("請選擇使用地點！"); // 彈出提示
      return; // 阻止後續操作
    }

    console.log("已選擇使用地點：", selectedLocation);

    // 跳轉到 quantity-selection.html
    window.location.href = "quantity-selection.html";
  });
});

// 工具函式：創建勾選方塊
function createCheckbox(labelText) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("checkbox-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = labelText;
  checkbox.value = labelText;

  const label = document.createElement("label");
  label.htmlFor = labelText;
  label.textContent = labelText;

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  // 添加事件監聽器，記錄選借設備
  checkbox.addEventListener("change", () => {
    const selectedBorrowOptions = JSON.parse(localStorage.getItem("selectedBorrowOptions")) || [];
    if (checkbox.checked) {
      // 如果勾選，將設備加入選借清單
      selectedBorrowOptions.push(labelText);
    } else {
      // 如果取消勾選，從選借清單中移除
      const index = selectedBorrowOptions.indexOf(labelText);
      if (index > -1) {
        selectedBorrowOptions.splice(index, 1);
      }
    }
    // 更新 localStorage
    localStorage.setItem("selectedBorrowOptions", JSON.stringify(selectedBorrowOptions));
    console.log("選借設備更新：", selectedBorrowOptions);
  });

  return wrapper;
}

async function loadLocations() {
  const locationSelect = document.getElementById("location");
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzaT6xgU_cCGNlbTyUhUgyUN2gcsBr_wZyh84AMg1iC66Q1QdQlCAWcxvClzEWOXkYp/exec?action=getLocations"); // 替換為您的 Google Apps Script URL
    const result = await response.json();
    console.log("獲取使用地點資料：", result);
    if (result.success) {
      // 清空現有選項
      locationSelect.innerHTML = "";

      // 添加預設選項
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "請選擇使用地點";
      locationSelect.appendChild(defaultOption);

      // 加載地點選項
      result.data.forEach((location) => {
        const option = document.createElement("option");
        option.value = location["校內空間"]; // 假設工作表中有「校內空間」欄位
        option.textContent = location["校內空間"];
        locationSelect.appendChild(option);
      });

      // 添加事件監聽器，將選擇的地點存入 localStorage
      locationSelect.addEventListener("change", () => {
        const selectedLocation = locationSelect.value;
        localStorage.setItem("selectedLocation", selectedLocation); // 儲存到 localStorage
        console.log("已選擇使用地點：", selectedLocation);
      });
    } else {
      console.error("無法獲取使用地點資料：", result.message);
    }
  } catch (error) {
    console.error("請求失敗：", error);
  }
}
