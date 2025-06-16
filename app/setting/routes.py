from flask import Blueprint, render_template
from . import setting_bp

@setting_bp.route('/')
def list_blogs():
    return render_template("setting.html") # 1st引数はテンプレートhtml名、2nd引数はコンテキスト変数
