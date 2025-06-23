from flask import Blueprint

menus_bp = Blueprint('menus_bp', __name__, template_folder='templates', static_folder='static')

from . import routes
