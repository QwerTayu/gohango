from flask import Blueprint, render_template
from . import menus_bp

@menus_bp.route('/')
def list_blogs():
    return render_template("menus.html") # 1st引数はテンプレートhtml名、2nd引数はコンテキスト変数
