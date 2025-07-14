document.addEventListener("DOMContentLoaded", function () {
  const soldoutForm = document.getElementById("soldoutForm");

  // ★★★ URLからパラメータを引っこ抜く！ ★★★
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

  const allRadios = document.querySelectorAll('input[type="radio"]');
  allRadios.forEach(radio => {
    // 各ラジオボタンに、自分がチェックされてるかどうかの「記憶」を持たせる
    radio.dataset.wasChecked = radio.checked;

    radio.addEventListener('click', function(event) {
      // クリックされた瞬間に、前の記憶（wasChecked）がtrueだったら
      if (event.target.dataset.wasChecked === 'true') {
        // チェックを外しちゃう！
        event.target.checked = false;
      }
      // 同じグループのラジオボタン全部の記憶を更新する
      document.querySelectorAll(`input[name="${event.target.name}"]`).forEach(r => {
        r.dataset.wasChecked = r.checked;
      });
    });
  });

  soldoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    const studentId = localStorage.getItem("student_id");
    if (!studentId) {
      alert("ユーザ未登録です。送信できません");
      window.location.href = "/setting";
      return;
    }

    const menuNames = Object.keys(menuKeyMap);
    const soldoutStatus = {};

    menuNames.forEach((name) => {
      const selectedRadio = document.querySelector(
        `input[name="${name}"]:checked`
      );

      if (selectedRadio) {
        soldoutStatus[name] = selectedRadio.value === "true";
      } else {
        // 何も選択されていない場合はnullを代入
        soldoutStatus[name] = null;
      }
    });

    console.log("販売状況報告ステータス:", soldoutStatus);

    const requests = [];
    Object.entries(soldoutStatus).forEach(([name, isSoldout]) => {
      if (isSoldout === null) {
        return;
      }

      const menuKey = menuKeyMap[name];
      if (!menuKey) {
        console.error(`${name} のmenu_keyが見つからん！`);
        return;
      }

      const requestBody = {
        menu_key: menuKey,
        student_id: studentId,
        reported_at: new Date().toISOString(),
        is_soldout: isSoldout,
      };

      requests.push(
        fetch("/api/v1/soldout/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })
      );
    });

    if (requests.length === 0) {
      alert("報告する項目が選択されてないよ！");
      return;
    }

    Promise.all(requests)
      .then((responses) => {
        const allSuccess = responses.every((res) => res.ok);
        if (allSuccess) {
          alert("報告ありがとー！反映しとくね！💖");
          window.location.href = "/";
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
