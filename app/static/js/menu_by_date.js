document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.getElementById("menu-list");
  // テンプレートから日付を取得 (h1タグから取る荒業！本当はdata属性とかの方がイケてる)
  const date = document.querySelector("h2").textContent.split(" ")[0];

  async function fetchMenus() {
    try {
      const response = await fetch(`/api/v1/menus/date?date=${date}`);
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }
      const menus = await response.json();

      menuList.innerHTML = "";

      if (menus && menus.length > 0) {
        menus.forEach((menu) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${menu.name} (${menu.price}円)`;
          menuList.appendChild(listItem);
        });
      } else {
        menuList.textContent = "この日のメニューはないみたい🥺";
      }
    } catch (error) {
      menuList.textContent = `エラー発生: ${error.message}`;
      menuList.style.color = "red";
    }
  }

  fetchMenus();
});
