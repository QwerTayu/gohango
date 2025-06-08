import psycopg2
import psycopg2.extras # RealDictCursor を使う
from flask import current_app, g 

def get_db():
    """
    リクエスト内でDB接続を確立し、gオブジェクトに保存する。
    既に接続があればそれを使う。
    """
    if 'db' not in g:
        g.db = psycopg2.connect(
            host=current_app.config['DB_HOST'],
            port=current_app.config['DB_PORT'],
            dbname=current_app.config['DB_NAME'],
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASS']
        )
    return g.db

def get_cursor():
    """
    RealDictCursor を使うと、DBからの結果がカラム名をキーにした辞書で返ってくる
    """
    return get_db().cursor(cursor_factory=psycopg2.extras.RealDictCursor)


def close_db(e=None):
    """
    リクエスト終了時にDB接続を閉じる。
    """
    db = g.pop('db', None)

    if db is not None:
        db.close()

def init_app(app):
    """
    FlaskアプリインスタンスにDB関連のコマンドや後処理を登録する。
    """
    app.teardown_appcontext(close_db)
