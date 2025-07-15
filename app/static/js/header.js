document.addEventListener('DOMContentLoaded', function() {
  const headerRight = document.querySelector('.header-right');
  const currentDatePlaceholder = document.getElementById('current-date-placeholder');
  const currentPagePath = window.location.pathname;

  let dateToDisplay = '';

  function formatJapaneseDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return `${year}年${month}月${day}日`;
  }

  const menuDateRegex = /\/menus\/(\d{4}-\d{2}-\d{2})/;
  const match = currentPagePath.match(menuDateRegex);

  if (currentPagePath.includes('index.html') || currentPagePath === '/') {
    const today = new Date();
    dateToDisplay = formatJapaneseDate(today);
  }
  else if (match && match[1]) {
    const dateString = match[1];
    const urlDate = new Date(dateString + 'T00:00:00');
    dateToDisplay = formatJapaneseDate(urlDate);
  }

  if (dateToDisplay) {
    headerRight.style.display = 'flex';
    currentDatePlaceholder.textContent = dateToDisplay;
  }

  // --- カレンダー機能のロジック ---
  
  const calendarToggle = document.getElementById('calendar-toggle');
  const calendarInput = document.getElementById('calendar-input');

  // Flatpickrを初期化
  const fp = flatpickr(calendarInput, {
    dateFormat: "Y-m-d",
    disableMobile: true,
    
    // ★ここから追加: 日付が選択されたときに実行される処理
    onChange: function(selectedDates, dateStr, instance) {
      // dateStrには "YYYY-MM-DD" 形式で選択された日付が入る
      if (dateStr) {
        // 選択された日付のメニューページに移動
        window.location.href = `/menus/${dateStr}`;
      }
    }
    // ★追加ここまで
  });

  // カレンダーアイコンがクリックされたときにカレンダーを開く
  headerRight.addEventListener('click', function(e) {
    e.preventDefault(); // リンクのデフォルト動作を無効化
    fp.open();
  });

});
