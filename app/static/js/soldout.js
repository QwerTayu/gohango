document.addEventListener('DOMContentLoaded', function() {
    const soldoutForm = document.getElementById('soldoutForm');

    soldoutForm.addEventListener('submit', function(event) {
        event.preventDefault(); // フォームのデフォルト送信を防ぐ

        const soldoutStatus = {
            a_lunch: document.getElementById('a_lunch').checked,
            b_lunch: document.getElementById('b_lunch').checked,
            curry: document.getElementById('curry').checked,
            katsu_curry: document.getElementById('katsu_curry').checked,
            katsu_don: document.getElementById('katsu_don').checked,
            chuuka_men: document.getElementById('chuuka_men').checked,
            udon_soba: document.getElementById('udon_soba').checked,
            soba: document.getElementById('soba').checked,
            gohan: document.getElementById('gohan').checked
        };

        // ここで soldoutStatus オブジェクトをサーバーに送信したり、
        // 他の処理を行ったりすることができます。
        console.log('売り切れ報告ステータス:', soldoutStatus);

        alert('売り切れ報告が送信されました。詳細はコンソールを確認してください。');
        // 例: 実際にはここで fetch API などを使ってサーバーにデータを送信します
        /*
        fetch('/api/soldout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(soldoutStatus),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('売り切れ報告が正常に送信されました！');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('売り切れ報告の送信中にエラーが発生しました。');
        });
        */
    });
});
