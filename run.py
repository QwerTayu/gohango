import os
from dotenv import load_dotenv
from app import create_app

# .envファイルから環境変数を読み込む！超重要！
load_dotenv()

app = create_app()

if __name__ == "__main__":
    # 環境変数からポート番号をゲトる！なかったら5000番にする（ローカル用）
    port = int(os.environ.get("PORT", 5000))
    # サーバーで動かすときは、外からアクセスできるように'0.0.0.0'を指定！
    host = os.environ.get("HOST", "127.0.0.1")
    
    # app.runにちゃんと教えてあげる！
    app.run(host=host, port=port)
