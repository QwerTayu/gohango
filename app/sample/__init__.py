from flask import Blueprint

sample_bp = Blueprint('sample_bp', __name__, template_folder='templates', static_folder='static')

from . import routes
