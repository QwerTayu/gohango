document.addEventListener("DOMContentLoaded", function () {
  const soldoutForm = document.getElementById("soldoutForm");

  // ★★★ ここからが神！URLからパラメータを引っこ抜く！ ★★★
  const urlParams = new URLSearchParams(window.location.search);
  const menuA_key = urlParams.get('menu_a');
  const menuB_key = urlParams.get('menu_b');

  // ★★★ メニュー名とキーをマッピングしとく！超かしこい！ ★★★
  const menuKeyMap = {
    'a_lunch': menuA_key,
    'b_lunch': menuB_key,
    'curry': 'C1RRY1',
    'katsu_curry': 'PORKC1',
    'katsu_don': 'KTSDN1',
    'chuuka_men': 'SYURM1',
    'udon_soba': 'HYUDN1',
    'gohan': 'RICE01'
  };

  soldoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    // まずローカルストレージからstudent_idをゲトる！
    const studentId = localStorage.getItem("student_id");

    // IDがなかったら、登録ページに飛ばしちゃう！
    if (!studentId) {
      alert("ユーザ未登録です。送信できません");
      window.location.href = "/setting"; // /settingページにリダイレクト
      return; // ここで処理を止める！超重要！
    }

    const menuNames = [
      "a_lunch",
      "b_lunch",
      "curry",
      "katsu_curry",
      "katsu_don",
      "chuuka_men",
      "udon_soba",
      "gohan",
    ];
    const soldoutStatus = {};

    menuNames.forEach((name) => {
      const selectedRadio = document.querySelector(
        `input[name="${name}"]:checked`
      );

      if (selectedRadio) {
        // valueは文字列の"true"または"false"なので、ブール値に変換
        soldoutStatus[name] = selectedRadio.value === "true";
      } else {
        // 何も選択されていない場合はnullを代入
        soldoutStatus[name] = null;
      }
    });

    // soldoutStatus オブジェクトをサーバーに送信したり、他の処理を行ったりできます。
    console.log("販売状況報告ステータス:", soldoutStatus);

    const requests = []; // APIリクエストをためとく配列

    // soldoutStatusをループして、nullじゃないやつだけリクエスト作る！
    Object.entries(soldoutStatus).forEach(([name, isSoldout]) => {
      // isSoldoutがnullだったら何もしない！
      if (isSoldout === null) {
        return; // 次のループへGO！
      }

    const menuKey = menuKeyMap[name];

    if (!menuKey) {
        console.error(`${name} のmenu_keyが見つからん！URLとかマップを確認して！`);
        return; // menu_keyないと意味ないから次！
    }

      const requestBody = {
        menu_key: menuKey,
        student_id: studentId,
        reported_at: new Date().toISOString(), // 今の時間を入れる！
        is_soldout: isSoldout,
      };

      console.log("送信するデータ:", requestBody);

      // fetchリクエストをrequests配列に追加！
      requests.push(
        fetch("/api/v1/soldout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
      );
    });

    // 1件も報告がなかったら何もしない
    if (requests.length === 0) {
      alert("報告する項目が選択されてないよ！");
      return;
    }

    // Promise.allで全部のリクエストが終わるのを待つ！
    Promise.all(requests)
      .then((responses) => {
        // 1つでも失敗してたらエラーにする
        const allSuccess = responses.every((res) => res.ok);
        if (allSuccess) {
          alert("報告ありがとー！反映しとくね！💖");
          window.location.href = "/"; // トップページに戻る
        } else {
          throw new Error("いくつかの報告に失敗しちゃった…");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("報告中にエラーが発生しちゃった…もう一回試してみて！🙏");
      });
  });
});
