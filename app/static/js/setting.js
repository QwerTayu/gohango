// DOMが完全に読み込まれてからスクリプトが実行されるようにする
document.addEventListener("DOMContentLoaded", () => {
  // HTML要素を取得
  const loggedInView = document.getElementById("logged-in-view");
  const loggedOutView = document.getElementById("logged-out-view");
  const currentStudentIdSpan = document.getElementById("current-student-id");
  const logoutButton = document.getElementById("logout-button");

  const form = document.getElementById("student-entry-form");
  const studentIdField = document.getElementById("student-id-field");
  const errorDisplay = document.getElementById("error-display");

  // バーコードスキャン用の要素
  const startScanButton = document.getElementById("start-scan-button");
  const scannerContainer = document.getElementById("scanner-container");
  const scanStatus = document.getElementById("scan-status");

  // ★★★ ログイン状態をチェックして表示を切り替える関数 ★★★
  function checkLoginState() {
    const studentId = localStorage.getItem("student_id");

    if (studentId) {
      // ログインしてる場合
      loggedInView.style.display = "block"; // ログイン中ビューを表示
      loggedOutView.style.display = "none"; // 登録フォームを非表示
      currentStudentIdSpan.textContent = studentId; // 学籍番号を表示
    } else {
      // ログインしてない場合
      loggedInView.style.display = "none"; // ログイン中ビューを非表示
      loggedOutView.style.display = "block"; // 登録フォームを表示
    }
  }

  // ★★★ ログアウト処理 ★★★
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("student_id"); // localStorageから削除！
    alert("ログアウトしました！またね！👋");
    checkLoginState(); // 表示を更新
  });

  // ★★★ ユーザー登録処理 (手入力とスキャンで共通化) ★★★
  function registerStudent(studentId) {
    const studentIdRegex = /^(M|E|C|A|ME|AC)\d{4}$/i;
    if (!studentIdRegex.test(studentId)) {
      errorDisplay.textContent = "この学籍番号は登録できません";
      errorDisplay.style.color = "red";
      // スキャンUIをリセット
      scanStatus.textContent = "エラー。もう一回試して！";
      Quagga.stop();
      scannerContainer.style.display = "none";
      return;
    }

    errorDisplay.textContent = ""; // エラー表示をクリア
    const upperCaseStudentId = studentId.toUpperCase();
    const registrationTime = new Date().toISOString();
    const data = {
      student_id: upperCaseStudentId,
      created_at: registrationTime,
    };

    // Fetch APIでPOSTリクエストを送信
    fetch("/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response
          .json()
          .then((body) => ({ status: response.status, body, ok: response.ok }));
      })
      .then(({ status, body, ok }) => {
        if (status === 201) {
          console.log(
            "登録リクエストを送信しました。サーバーからの返事:",
            body
          );
          studentIdField.value = "";
          localStorage.setItem("student_id", upperCaseStudentId);
          checkLoginState();
          alert("ユーザ登録を完了しました");
        } else if (status === 409) {
          console.log("既に登録済みのユーザーです。サーバーからの返事:", body);
          localStorage.setItem("student_id", upperCaseStudentId);
          checkLoginState();
          alert("登録済みです。ログインしました");
        } else if (!ok) {
          const errorMessage =
            body.error || `サーバーエラー (ステータス: ${status}) `;
          throw new Error(errorMessage);
        } else {
          checkLoginState();
          console.log(
            "リクエスト成功したけどおもてたんとちがう:",
            status,
            body
          );
        }
      })
      .catch((error) => {
        console.error("リクエスト送信中にエラー発生:", error);
        errorDisplay.textContent = `登録失敗 我求再試行 (${error.message})`;
        errorDisplay.style.color = "red";
        checkLoginState();
      });
  }

  // ★★★ バーコードスキャン処理 ★★★
  startScanButton.addEventListener("click", () => {
    // // ★★★ HTTPチェック ★★★
    // if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    //   scanStatus.textContent = "カメラを使うにはHTTPS接続が必要だよ！ブラウザの設定を確認してみて！";
    //   scannerContainer.style.display = 'block'; // メッセージ表示エリアは見せる
    //   return;
    // }
    // // ★★★ ここまで ★★★

    scannerContainer.style.display = "block";
    scanStatus.textContent = "カメラを準備してるから待っててね...";

    const detectedCodes = [];
    const SCAN_LIMIT = 10;
    // Quagga.onDetectedが短時間に連続で発火するのを防ぐための変数
    let isProcessing = false;

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerContainer,
          constraints: {
            width: 900,
            height: 600,
            facingMode: "environment", // スマホのリアカメラを使う設定
          },
        },
        decoder: {
          readers: ["code_39_reader"], // 読み取り規格をcode39に限定！
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          scanStatus.textContent =
            "カメラの起動に失敗しちゃった...。ページをリロードしてみて！";
          return;
        }
        console.log("Initialization finished. Ready to start");
        scanStatus.textContent = "バーコードをかざしてね！";
        Quagga.start();
      }
    );

    // ★★★ ここから追加！リアルタイムで枠を描画する神処理 ★★★
    Quagga.onProcessed((result) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        // 前に描いた枠を一旦ぜんぶ消す！
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        );

        // バーコードとして認識できたエリア（箱）があったら緑の枠を描く！
        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00FF00", // 緑色！
            lineWidth: 4,
          });
        }

        // バーコードの線自体を赤線でなぞる！
        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, { 
            color: "red", 
            lineWidth: 6 
          });
        }
      }
    });

    Quagga.onDetected((data) => {
      // 処理中の場合はスルー
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      const code = data.codeResult.code;
      console.log(`バーコードを検出したよ！: ${code}`); // ★コンソールに読み取った文字列を表示
      detectedCodes.push(code);
      scanStatus.textContent = `スキャン中... (${detectedCodes.length}/${SCAN_LIMIT}回)`;

      if (detectedCodes.length >= SCAN_LIMIT) {
        Quagga.stop();
        scannerContainer.style.display = "none";
        scanStatus.textContent = "スキャン完了！結果をチェックしてるよ...";

        // 最も多く出現したコードを見つける天才的なコード
        const codeCounts = detectedCodes.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});

        const mostFrequentCode = Object.keys(codeCounts).reduce((a, b) =>
          codeCounts[a] > codeCounts[b] ? a : b
        );

        console.log("スキャンしたコードたち:", detectedCodes);
        console.log("これが一番多かったコードだ！:", mostFrequentCode);
        scanStatus.textContent = `スキャン結果: ${mostFrequentCode}`;

        // 登録処理を呼び出す！
        registerStudent(mostFrequentCode);
      } else {
        // 次のスキャンまで少し待つ
        setTimeout(() => {
          isProcessing = false;
        }, 10);
      }
    });
  });

  // ページ読み込み時にまずログイン状態をチェック！
  checkLoginState();

  // ★★★ URLのクエリパラメータをチェックして表示を切り替える処理 ★★★
  // URLから?以降のパラメータをいい感じに取ってきてくれるマジカルなやつ
  const urlParams = new URLSearchParams(window.location.search);
  // 'mode'っていうパラメータがあるかチェック！
  const mode = urlParams.get('mode');
  // <hr>も一緒に表示/非表示したいから取っとく
  const hrSeparator = document.querySelector('#barcode-scanner-area + hr');

  // もしmodeが'text'だったら…
  if (mode === 'text') {
    // 手入力フォームを表示！
    form.style.display = 'block';
    if (hrSeparator) {
      hrSeparator.style.display = 'block';
    }
  } else {
    // それ以外は非表示にしとく！
    form.style.display = 'none';
    if (hrSeparator) {
      hrSeparator.style.display = 'none';
    }
  }

  // フォームの送信イベントに対するリスナーを設定
  form.addEventListener("submit", (event) => {
    // JavaScript要件: ページの再読み込みをキャンセル
    event.preventDefault();

    // JavaScript要件: 入力値を取得し、前後の空白を削除
    const studentIdRaw = studentIdField.value.trim();

    // バリデーションと登録処理を共通関数に任せる
    registerStudent(studentIdRaw);
  });
});
