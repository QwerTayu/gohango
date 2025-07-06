document.addEventListener('DOMContentLoaded', function() {
  const currentDatePlaceholder = document.getElementById('current-date-placeholder');
  const currentPagePath = window.location.pathname;

  let dateToDisplay = '';

  function formatJapaneseDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return `${year}年${month}月${day}日`;
  }

  if (currentPagePath.includes('index.html') || currentPagePath === '/') {
    const today = new Date();
    dateToDisplay = formatJapaneseDate(today);
  }
  else if (currentPagePath.includes('menus.html')) {
    const arbitraryDate = new Date('2025-07-15');
    dateToDisplay = formatJapaneseDate(arbitraryDate);
  }

  if (dateToDisplay) {
    currentDatePlaceholder.textContent = dateToDisplay;
  } else {
    currentDatePlaceholder.style.display = 'none';
  }
});
