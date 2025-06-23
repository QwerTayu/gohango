from flask import Flask
from dotenv import load_dotenv
import os

# .envファイルから環境変数を読み込む
load_dotenv(dotenv_path='../.env')

def create_app():
  app = Flask(__name__)

  # PostgreSQL接続設定
  app.config['DB_HOST'] = os.getenv('DB_HOST')
  app.config['DB_PORT'] = os.getenv('DB_PORT')
  app.config['DB_NAME'] = os.getenv('DB_NAME')
  app.config['DB_USER'] = os.getenv('DB_USER')
  app.config['DB_PASS'] = os.getenv('DB_PASS')

  # --- DB初期化 ---
  from . import db
  db.init_app(app)

  # --- Blueprintの登録 ---
  from .main.routes import main_bp
  app.register_blueprint(main_bp)

  from .sample.routes import sample_bp
  app.register_blueprint(sample_bp, url_prefix='/sample')

  from .services.users import api_users_bp
  app.register_blueprint(api_users_bp)

  from .services.menus import api_menus_bp
  app.register_blueprint(api_menus_bp)

  from .services.soldout_reports import api_soldout_bp
  app.register_blueprint(api_soldout_bp)

  return app
