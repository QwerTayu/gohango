// DOMが完全に読み込まれてからスクリプトが実行されるようにする
document.addEventListener('DOMContentLoaded', () => {

  // HTML要素を取得
  const form = document.getElementById('student-entry-form');
  const studentIdField = document.getElementById('student-id-field');
  const errorDisplay = document.getElementById('error-display');
  const userListDisplay = document.getElementById('user-list-display');

  async function fetchAndDisplayUsers() {
    try {
      const response = await fetch('/api/v1/users/');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'APIからのレスポンスがJSONじゃないかも' }));
        throw new Error(`APIエラー: ${response.status} - ${errorData.error || response.statusText}`);
      }
      const users = await response.json();

      userListDisplay.innerHTML = '';

      if (users && users.length > 0) {
        users.forEach(user => {
          const listItem = document.createElement('li');
          listItem.textContent = user.student_id;
          userListDisplay.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'レコード無し';
        userListDisplay.appendChild(listItem);
      }
    } catch (error) {
      console.error('ユーザーリスト取得でエラー発生:', error);
      userListDisplay.innerHTML = '';
      const listItem = document.createElement('li');
      listItem.textContent = `ユーザーリストの取得失敗… (${error.message}) `;
      listItem.style.color = 'orange';
      userListDisplay.appendChild(listItem);
    }
  }

  // ページ読み込み時にまずユーザーリスト表示する！
  fetchAndDisplayUsers();

  // フォームの送信イベントに対するリスナーを設定
  form.addEventListener('submit', (event) => {
    // JavaScript要件: ページの再読み込みをキャンセル
    event.preventDefault();

    // JavaScript要件: 入力値を取得し、前後の空白を削除
    const studentId = studentIdField.value.trim();

    // JavaScript要件: 正規表現で学籍番号をバリデーション
    const studentIdRegex = /^(M|E|C|A|ME|AC)\d{4}$/;

    if (!studentIdRegex.test(studentId)) {
      // JavaScript要件: バリデーション失敗時の処理
      errorDisplay.textContent = 'この学籍番号は登録できません';
      errorDisplay.style.color = 'red';
    } else {
      // JavaScript要件: バリデーション成功時の処理
      errorDisplay.textContent = ''; // エラー表示をクリア

      // JavaScript要件: 現在日時をISO 8601形式で生成
      const registrationTime = new Date().toISOString();

      // 送信するJSONデータを準備
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
          alert('ユーザ登録を完了しました');
        } else if (status === 409) {
          console.log('既に登録済みのユーザーです。サーバーからの返事:', body);
          alert('登録済みです。ログインしました');
        } else if (!ok) {
          const errorMessage = body.error || `サーバーエラー (ステータス: ${status}) `;
          throw new Error(errorMessage);
        } else {
          console.log('リクエスト成功したけどおもてたんとちがう:', status, body);
        }
      })
      .catch(error => {
        console.error('リクエスト送信中にエラー発生:', error);
        errorDisplay.textContent = `登録失敗 我求再試行 (${error.message})`;
        errorDisplay.style.color = 'red';
      });
    }
  });
});
