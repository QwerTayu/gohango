from flask import Blueprint, jsonify, request
from app.db import get_cursor
from psycopg2 import errors

api_menus_bp = Blueprint('api_menus_bp', __name__, url_prefix='/api/v1/menus')

# 全件取得
"""
req: GET /api/v1/menus/, query params: None
res: 200 OK, JSON array
```
[
  {
    "menu_key": "A5S7D9",
    "name": "麻婆豆腐飯",
    "type": "B",
    "price": 380,
    "start_at": "2025-06-20",
    "finish_at": "2025-06-20",
    "allergy": ["komugi"],
    "badge": null
  },
  ...
]
```
"""
@api_menus_bp.route('/', methods=['GET'])
def get_all_menus():
  cur = get_cursor()
  cur.execute("SELECT * FROM Menus;")
  items = cur.fetchall()
  cur.close()
  return jsonify(items), 200

# 日付で範囲検索
"""
req: GET /api/v1/menus/date?date=2025-06-20, query params: date
res: 200 OK, JSON array
```
[
  {
    "menu_key": "A5S7D9",
    "name": "麻婆豆腐飯",
    "type": "B",
    "price": 380,
    "start_at": "2025-06-20",
    "finish_at": "2025-06-20",
    "allergy": ["komugi"],
    "badge": null
  },
  ...
]
```
"""
@api_menus_bp.route('/date', methods=['GET'])
def get_menus_by_date():
  date = request.args.get('date')
  if not date:
      return jsonify({"error": "date query param required"}), 400
  cur = get_cursor()
  cur.execute("""
      SELECT * FROM Menus
      WHERE start_at <= %s AND finish_at >= %s;
  """, (date, date))
  items = cur.fetchall()
  cur.close()
  return jsonify(items), 200

# 日付で範囲検索
"""
req: GET /api/v1/menus/today?date=2025-06-20, query params: date
res: 200 OK, JSON array with soldout counts
```
[
  {
    "menu_key": "A5S7D9",
    "name": "麻婆豆腐飯",
    "type": "B",
    "price": 380,
    "start_at": "2025-06-20",
    "finish_at": "2025-06-20",
    "allergy": ["komugi"],
    "badge": null,
    "soldout_true": 2,
    "soldout_false": 3
  },
  ...
]
```
"""
@api_menus_bp.route('/today', methods=['GET'])
def get_menus_today():
  date = request.args.get('date')
  if not date:
      return jsonify({"error": "date query param required"}), 400
  cur = get_cursor()
  # MenusとSoldout_reportsをLEFT JOINして、menu_keyごとにis_soldoutのtrue/falseをカウント
  cur.execute(
    """
      SELECT
        m.*,
        COALESCE(SUM(CASE WHEN s.is_soldout = TRUE THEN 1 ELSE 0 END), 0) AS soldout_true,
        COALESCE(SUM(CASE WHEN s.is_soldout = FALSE THEN 1 ELSE 0 END), 0) AS soldout_false
      FROM Menus m
      LEFT JOIN Soldout_reports s
        ON m.menu_key = s.menu_key
        AND DATE(s.reported_at) = %s
      WHERE m.start_at <= %s AND m.finish_at >= %s
      GROUP BY m.menu_key, m.name, m.type, m.price, m.start_at, m.finish_at, m.allergy, m.badge
      ORDER BY m.menu_key
    """,
    (date, date, date)
  )
  items = cur.fetchall()
  cur.close()
  return jsonify(items), 200
