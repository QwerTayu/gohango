document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.getElementById("menu-list");
  const date = document.querySelector("h2").textContent.match(/\(([^)]+)\)/)[1];

  async function fetchTodayMenus() {
    try {
      const response = await fetch(`/api/v1/menus/today?date=${date}`);
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }
      const menus = await response.json();

      menuList.innerHTML = "";

      if (menus && menus.length > 0) {
        menus.forEach((menu) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${menu.name} (${menu.price}円) - 売り切れ報告: [あり:${menu.soldout_true}, なし:${menu.soldout_false}]`;
          menuList.appendChild(listItem);
        });
      } else {
        menuList.textContent = "今日のメニューはないみたい🥺";
      }
    } catch (error) {
      menuList.textContent = `エラー発生: ${error.message}`;
      menuList.style.color = "red";
    }
  }

  fetchTodayMenus();
});
