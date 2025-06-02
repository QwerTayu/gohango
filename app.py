from flask import Flask, render_template_string
import psycopg2

app = Flask(__name__)

# PostgreSQL接続設定 (ご自身の環境に合わせて変更してください)
DB_HOST = "localhost"
DB_NAME = "your_database_name"  # pgAdminで作成したデータベース名
DB_USER = "postgres"            # PostgreSQLのスーパーユーザー
DB_PASS = "your_password"       # postgresユーザーのパスワード

@app.route('/')
def hello_world():
    message = "Hello, Flask on Windows 11 with PostgreSQL!"
    data = []
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
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
