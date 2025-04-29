document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const loginMessage = document.getElementById("login-message");
  const loginButton = document.querySelector(".login-button");
  const logo = document.querySelector(".logo");

  // 讓 logo 在頁面加載後觸發動畫
  setTimeout(() => {
    logo.style.opacity = "1"; // 顯示 logo
    logo.style.animation = "dropIn 1s ease-out"; // 觸發動畫
  }, 100); // 延遲 100 毫秒以確保頁面完全加載

  // Google Apps Script 部署的 API URL
  const API_URL = "https://script.google.com/macros/s/AKfycbxLGKDaqkCM6JTFehiIMB_fbkyEQxNe3cpk2-hylJksk2emd3xcu27wCKxeW9NkqA_i/exec";

  // 處理登入按鈕點擊
  loginButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();

    if (!username) {
      loginMessage.textContent = "請輸入姓名！";
      loginMessage.classList.add("error");
      return;
    }

    // 顯示載入中
    loginMessage.textContent = "查詢中，請稍候...";
    loginMessage.classList.remove("error", "success");

    const requestUrl = `${API_URL}?action=checkUser&username=${encodeURIComponent(username)}`;
    console.log("發送的 URL:", requestUrl); // 將 URL 輸出到 console
    fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // 記住用戶姓名
          localStorage.setItem("loggedInUser", username);

          loginMessage.textContent = `歡迎，${username}！`;
          loginMessage.classList.add("success");
          window.location.href = "date-selection.html";
        } else {
          loginMessage.textContent = "查無此人，請確認姓名是否正確！";
          loginMessage.classList.add("error");
        }
      })
      .catch((error) => {
        console.error("查詢失敗：", error);
        loginMessage.textContent = "系統錯誤，請稍後再試！";
        loginMessage.classList.add("error");
      });
  });
});