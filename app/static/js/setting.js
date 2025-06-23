// DOMが完全に読み込まれてからスクリプトが実行されるようにする
document.addEventListener('DOMContentLoaded', () => {

  // HTML要素を取得
  const loggedInView = document.getElementById('logged-in-view');
  const loggedOutView = document.getElementById('logged-out-view');
  const currentStudentIdSpan = document.getElementById('current-student-id');
  const logoutButton = document.getElementById('logout-button');

  const form = document.getElementById('student-entry-form');
  const studentIdField = document.getElementById('student-id-field');
  const errorDisplay = document.getElementById('error-display');

  // ★★★ ログイン状態をチェックして表示を切り替える関数 ★★★
  function checkLoginState() {
    const studentId = localStorage.getItem('student_id');

    if (studentId) {
      // ログインしてる場合
      loggedInView.style.display = 'block'; // ログイン中ビューを表示
      loggedOutView.style.display = 'none';  // 登録フォームを非表示
      currentStudentIdSpan.textContent = studentId; // 学籍番号を表示
    } else {
      // ログインしてない場合
      loggedInView.style.display = 'none';   // ログイン中ビューを非表示
      loggedOutView.style.display = 'block'; // 登録フォームを表示
    }
  }

  // ★★★ ログアウト処理 ★★★
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('student_id'); // localStorageから削除！
    alert('ログアウトしました！またね！👋');
    checkLoginState(); // 表示を更新
  });

  // ページ読み込み時にまずログイン状態をチェック！
  checkLoginState();

  // フォームの送信イベントに対するリスナーを設定
  form.addEventListener('submit', (event) => {
    // JavaScript要件: ページの再読み込みをキャンセル
    event.preventDefault();

    // JavaScript要件: 入力値を取得し、前後の空白を削除
    const studentIdRaw = studentIdField.value.trim();

    // JavaScript要件: 正規表現で学籍番号をバリデーション
    const studentIdRegex = /^(M|E|C|A|ME|AC)\d{4}$/i;

    if (!studentIdRegex.test(studentIdRaw)) {
      // JavaScript要件: バリデーション失敗時の処理
      errorDisplay.textContent = 'この学籍番号は登録できません';
      errorDisplay.style.color = 'red';
    } else {
      // JavaScript要件: バリデーション成功時の処理
      errorDisplay.textContent = ''; // エラー表示をクリア

      // 大文字に変換
      const studentId = studentIdRaw.toUpperCase();

      // JavaScript要件: 現在日時をISO 8601形式で生成
      const registrationTime = new Date().toISOString();

      // 送信するJSONデータを準備 (大文字に変換したやつを使うよ！)
      const data = {
        student_id: studentId,
        created_at: registrationTime
      };
      
      // JavaScript要件: Fetch APIでPOSTリクエストを送信
      fetch('/api/v1/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        return response.json().then(body => ({ status: response.status, body, ok: response.ok }));
      })
      .then(({ status, body, ok }) => {
        if (status === 201) {
          console.log('登録リクエストを送信しました。サーバーからの返事:', body);
          studentIdField.value = '';
          localStorage.setItem('student_id', studentId);
          checkLoginState();
          alert('ユーザ登録を完了しました');
        } else if (status === 409) {
          console.log('既に登録済みのユーザーです。サーバーからの返事:', body);
          localStorage.setItem('student_id', studentId);
          checkLoginState();
          alert('登録済みです。ログインしました');
        } else if (!ok) {
          const errorMessage = body.error || `サーバーエラー (ステータス: ${status}) `;
          throw new Error(errorMessage);
        } else {
          checkLoginState();
          console.log('リクエスト成功したけどおもてたんとちがう:', status, body);
        }
      })
      .catch(error => {
        console.error('リクエスト送信中にエラー発生:', error);
        errorDisplay.textContent = `登録失敗 我求再試行 (${error.message})`;
        errorDisplay.style.color = 'red';
        checkLoginState();
      });
    }
  });
});
