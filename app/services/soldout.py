from flask import Blueprint, jsonify, request
from app.db import get_cursor
from psycopg2 import errors

api_soldout_bp = Blueprint('api_soldout_bp', __name__, url_prefix='/api/v1/soldout')

# menu_keyと日付でis_soldoutのtrue/falseの数を返す
"""
req: GET /api/v1/soldout/count?menu_key=A5S7D9&date=2025-06-20, query params: menu_key, date
res: 200 OK, JSON object
```
{
  "true": 5,
  "false": 3
}
```
"""
@api_soldout_bp.route('/count', methods=['GET'])
def count_soldout():
    menu_key = request.args.get('menu_key')
    date = request.args.get('date')
    if not menu_key or not date:
        return jsonify({"error": "menu_key and date are required"}), 400
    cur = get_cursor()
    cur.execute("""
        SELECT is_soldout, COUNT(*) as count
        FROM Soldout_reports
        WHERE menu_key = %s AND DATE(reported_at) = %s
        GROUP BY is_soldout;
    """, (menu_key, date))
    results = cur.fetchall()
    cur.close()
    # true/falseの数をdictで返す
    counts = {"true": 0, "false": 0}
    for row in results:
        if row['is_soldout']:
            counts["true"] = row['count']
        else:
            counts["false"] = row['count']
    return jsonify(counts), 200

# insert
"""
req: POST /api/v1/soldout/
body: { "menu_key": "A5S7D9", "student_id": "123456", "reported_at": "2025-06-20T12:00:00Z", "is_soldout": true }
res: 201 Created, JSON object
```
{
  "message": "Report inserted"
}
```
"""
@api_soldout_bp.route('/', methods=['POST'])
def insert_soldout_report():
    data = request.get_json()
    required = ['menu_key', 'student_id', 'reported_at', 'is_soldout']
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    cur = get_cursor()
    try:
        cur.execute("""
            INSERT INTO Soldout_reports (menu_key, student_id, reported_at, is_soldout)
            VALUES (%s, %s, %s, %s);
        """, (data['menu_key'], data['student_id'], data['reported_at'], data['is_soldout']))
        cur.connection.commit()
        return jsonify({"message": "Report inserted"}), 201
    except Exception as e:
        cur.connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
