document.addEventListener('DOMContentLoaded', function() {
    
    // idを使って「明日のメニュー」のリンク要素を取得
    const tomorrowMenuLink = document.getElementById('tomorrow-menu-link');

    // 現在の日時を取得
    const today = new Date();

    // 今日の日付に1日を加えて明日の日付を計算
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // 明日の日付を「YYYY-MM-DD」形式にフォーマット
    const year = tomorrow.getFullYear();
    // getMonth()は0から始まるため+1する。padStart(2, '0')で「05」のように2桁表示にする
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    // getDate()で日を取得。同じく2桁表示にする
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    // YYYY-MM-DD形式の文字列を作成
    const formattedDate = `${year}-${month}-${day}`;

    // リンクのhref属性を生成したURLに設定
    if (tomorrowMenuLink) {
      tomorrowMenuLink.href = `/menus/${formattedDate}`;
    }

    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      // 「今日のメニュー」(/) の特別処理
      if (linkPath === '/' && (currentPath === '/' || currentPath.includes('index.html'))) {
        link.classList.add('active');
        return; // 一致したら次のループへ
      }
      
      // 「今日のメニュー」以外で、パスが部分一致する場合
      // 例: /setting と /setting
      // 例: /menus/2025-07-15 と /menus
      if (linkPath !== '/' && currentPath.startsWith(linkPath)) {
        link.classList.add('active');
      }
    });
  });
