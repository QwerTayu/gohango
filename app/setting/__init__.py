from flask import Blueprint

setting_bp = Blueprint('setting_bp', __name__, template_folder='templates', static_folder='static')

from . import routes
