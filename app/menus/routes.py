from flask import Blueprint, render_template, request
from . import menus_bp
from datetime import date
import requests
import os

@menus_bp.route("/<string:date_str>")
def index(date_str):
    today = date_str
    # today = '2025-06-13'
    
    # APIサーバーのURLを環境変数から取得、なければデフォルト値
    api_base_url = os.environ.get("API_BASE_URL", "http://127.0.0.1:5000")
    
    # APIエンドポイントからデータを取得
    try:
        response = requests.get(f"{api_base_url}/api/v1/menus/date", params={"date": today})
        response.raise_for_status()  # エラーがあれば例外を発生させる
        menus = response.json()

        # TODO: マジックナンバー。後で何とかする
        order_keys = ['A', 'B', 'C1RRY1', 'PORKC1', 'KTSDN1', 'SYURM1', 'HYUDN1', 'RICE01']

        def get_sort_key(menu):
            key_to_check = menu.get('type') if menu.get('type') in ['A', 'B'] else menu.get('menu_key')
            try:
                # order_keysの中でkey_to_checkが何番目にあるかを取得
                return order_keys.index(key_to_check)
            except ValueError:
                # もしリストにないメニューがあったら、そいつらは後ろに回す
                return len(order_keys)

        # Pythonのsort機能で、さっき決めた順番通りに並べ替える
        menus.sort(key=get_sort_key)
    except requests.exceptions.RequestException as e:
        print(f"APIへのリクエストでエラーが発生しました: {e}")
        menus = [] # エラーの場合は空のリストを渡す

    # アレルギー表示用の辞書
    allergy_map = {
        "komugi": "小麦",
        "tamago": "卵",
        "nyuu": "乳",
        "soba": "そば",
        "rakka": "落花生",
        "ebi": "エビ",
        "kani": "カニ",
        "kurumi": "くるみ"
    }

    return render_template("menu_by_date.html", menus=menus, allergy_map=allergy_map)
