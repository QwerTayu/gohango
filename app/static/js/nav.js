document.addEventListener('DOMContentLoaded', function() {
    
    // --- 「明日のメニュー」のリンクを動的に設定する処理 ---
    const tomorrowMenuLink = document.getElementById('tomorrow-menu-link');
    if (tomorrowMenuLink) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        // getMonth()は0から始まるから+1する。padStart(2, '0')で「07」みたいに2桁表示にする
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // リンクのhref属性を生成したURLに設定
        tomorrowMenuLink.href = `/menus/${formattedDate}`;
    }

    // --- ここからがアクティブなタブを判定する神ロジック！ ---
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;

    // いったん全部のactiveクラスを剥がす！
    navLinks.forEach(link => link.classList.remove('active'));

    // ★★★ ここからが新しい魔法！ ★★★
    if (currentPath.startsWith('/menus/')) {
        // URLが /menus/ で始まる場合は、「明日のメニュー」をアクティブにする
        document.getElementById('tomorrow-menu-link')?.classList.add('active');
    } else if (currentPath === '/setting') {
        // URLが /setting の場合は、「設定」をアクティブにする
        document.querySelector('a[href="/setting"]')?.classList.add('active');
    } else if (currentPath === '/') {
        // URLが / の場合は、「今日のメニュー」をアクティブにする
        document.querySelector('a[href="/"]')?.classList.add('active');
    }
});
