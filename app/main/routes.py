from flask import Blueprint, render_template, request
from . import main_bp

@main_bp.route("/")
def index():
    query = request.args.get('query')
    return render_template("index.html", query=query, message="Welcome to the Index Page!")

@main_bp.route("/report")
def report():
    return render_template("soldout.html")

