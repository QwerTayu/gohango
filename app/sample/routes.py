from flask import Blueprint, render_template
from . import sample_bp

@sample_bp.route('/')
def list_blogs():
    return render_template("sample.html") # 1st引数はテンプレートhtml名、2nd引数はコンテキスト変数

@sample_bp.route('/<int:blog_id>')
def blog_detail(blog_id):
    return f"<h1>ブログ記事 {blog_id} の詳細ページだよん💖</h1>"
