from flask import Blueprint, render_template
from . import sample_bp
import datetime

@sample_bp.route('/')
def list_blogs():
    return render_template("sample.html") # 1st引数はテンプレートhtml名、2nd引数はコンテキスト変数

@sample_bp.route('/<string:date_str>')
def menu_by_date_page(date_str):
    """指定された日付のメニュー一覧ページを表示する."""
    return render_template("menu_by_date.html", date=date_str)

@sample_bp.route('/today')
def menu_today_page():
    """今日のメニュー一覧ページを表示する."""
    today_str = datetime.date.today().isoformat()
    return render_template("menu_today.html", date=today_str)

