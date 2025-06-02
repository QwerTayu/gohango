from flask import Flask, render_template_string
import psycopg2
from dotenv import load_dotenv
load_dotenv()  # .envファイルから環境変数を読み込む

import os

app = Flask(__name__)

# PostgreSQL接続設定 (ご自身の環境に合わせて変更してください)
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')  # デフォルトのポートは5432
DB_NAME = os.getenv('DB_NAME')  # pgAdminで作成したデータベース名
DB_USER = os.getenv('DB_USER')  # PostgreSQLのスーパーユーザー
DB_PASS = os.getenv('DB_PASS')  # postgresユーザーのパスワード

@app.route('/')
def hello_world():
    message = "Hello, Flask on Windows 11 with PostgreSQL!"
    data = []
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        cur.execute("SELECT version();") # PostgreSQLのバージョン情報を取得する簡単なクエリ
        data = cur.fetchone()
        cur.close()
        conn.close()
        message += f"<br>Database connected: {data}"
    except Exception as e:
        message += f"<br>Database connection error: {e}"

    return render_template_string(f"<h1>{message}</h1>")

if __name__ == '__main__':
    app.run(debug=True) # debug=True は開発時のみ
