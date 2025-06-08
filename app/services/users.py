from flask import Blueprint, jsonify, request
from app.db import get_cursor
from psycopg2 import errors

api_users_bp = Blueprint('api_users_bp', __name__, url_prefix='/api/v1/users')

@api_users_bp.route('/<student_id>', methods=['GET'])
def get_users_by_studentid(student_id):
  """
  ユーザ情報を student_id で取得するAPIエンドポイント
  """
  cur = get_cursor()
  cur.execute("SELECT student_id, created_at FROM users WHERE student_id = %s;", (student_id,))
  item = cur.fetchone() 
  cur.close()
  if not item:
    return jsonify({"error": "User not found", "student_id": student_id}), 404
  return jsonify(item), 200

@api_users_bp.route('/', methods=['GET']) # TODO: これは恐らく運用時は使わないので削除する
def get_users():
  """
  ユーザ情報を全て取得するAPIエンドポイント
  """
  cur = get_cursor()
  cur.execute("SELECT student_id, created_at FROM users;")
  item = cur.fetchall() 
  cur.close()
  if not item:
    return jsonify({"error": "User not found"}), 404
  return jsonify(item), 200

@api_users_bp.route('/', methods=['POST'])
def post_users():
  """
  ユーザ情報を登録するAPIエンドポイント
  リクエストボディから student_id と created_at を受け取る
  """
  data = request.get_json()
  if not data:
      return jsonify({"error": "Request body must be JSON"}), 400
  
  student_id = data.get('student_id')
  created_at = data.get('created_at')

  if not student_id:
      return jsonify({"error": "Missing student_id in request body"}), 400

  cur = get_cursor()
  try:
    cur.execute("INSERT INTO users (student_id, created_at) VALUES (%s, %s);", (student_id, created_at))
    cur.connection.commit()
    return jsonify({"message": "User created successfully!", "student_id": student_id, "created_at": str(created_at)}), 201
  except errors.UniqueViolation: # 既に登録済みのユーザの場合
    cur.connection.rollback()
    return jsonify({"error": "User already exists", "student_id": student_id}), 409
  except Exception as e:
    print(f"うわーん！DBエラーだお！｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡: {e}")
    cur.connection.rollback()
    return jsonify({"error": "Failed to create user", "details": str(e)}), 500
  finally:
    cur.close()
