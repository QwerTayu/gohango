from app import create_app # appフォルダの__init__.pyからcreate_appをインポート

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
