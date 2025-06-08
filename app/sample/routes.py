from flask import Blueprint, render_template, current_app
from app.db import get_db
from . import sample_bp

@sample_bp.route('/')
def list_blogs():
    db_conn = get_db()
    cur = db_conn.cursor()
    cur.execute("SELECT version();")
    db_version = cur.fetchone()
    cur.close()
    # こんな感じでロジックの処理を書く
    return render_template("index.html", query=db_version, message="Welcome to the Index Page!") # 1st引数はテンプレートhtml名、2nd引数はコンテキスト変数

@sample_bp.route('/<int:blog_id>')
def blog_detail(blog_id):
    return f"<h1>ブログ記事 {blog_id} の詳細ページだよん💖</h1>"
