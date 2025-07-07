document.addEventListener('DOMContentLoaded', function() {
    const soldoutForm = document.getElementById('soldoutForm');

    soldoutForm.addEventListener('submit', function(event) {
        event.preventDefault(); // フォームのデフォルト送信を防ぐ

        const menuNames = [
            'a_lunch', 'b_lunch', 'curry', 'katsu_curry',
            'katsu_don', 'chuuka_men', 'udon_soba', 'gohan'
        ];
        const soldoutStatus = {};

        menuNames.forEach(name => {
            const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);

            if (selectedRadio) {
                // valueは文字列の"true"または"false"なので、ブール値に変換
                soldoutStatus[name] = (selectedRadio.value === 'true');
            } else {
                // 何も選択されていない場合はnullを代入
                soldoutStatus[name] = null;
            }
        });

        // soldoutStatus オブジェクトをサーバーに送信したり、他の処理を行ったりできます。
        console.log('販売状況報告ステータス:', soldoutStatus);

        alert('販売状況が報告されました。詳細はコンソールを確認してください。');

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
            alert('報告が正常に送信されました！');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('報告の送信中にエラーが発生しました。');
        });
        */
    });
});
