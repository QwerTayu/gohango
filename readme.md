> [!WARNING]
> ルートディレクトリである`gohango`配下で作業することを前提としています
>

## 参加する前に
1. [UVのサイト](https://docs.astral.sh/uv/getting-started/installation/)にアクセスして`uv`をインストール。(`uv -V`でパスが通ってることを確認)
2. `.env`ファイルを作成(以下はサンプル)
```
DB_HOST=localhost
DB_PORT=65435
DB_NAME=gohango
DB_USER=root
DB_PASS=password
```

3. pythonバージョンを確認
```
uv python list
```
4. `python3.10.12`が無かったら...
```
uv python install 3.10.12
```

5. ポスグレサーバを作成
```
cd docker
docker compose up -d
cd ../
```

## 開発を始める前に
1. パッケージを同期する
```
uv sync
```

2. Dockerを立ち上げてポスグレサーバを起動＆DB構造を同期
```
cd docker
docker compose up -d
docker compose run liquibase
cd ../
```

## 実行方法
```
uv run app.py
```

## パッケージ追加方法
```
uv add パッケージ名
```

# archive

## venv 作成方法
```
uv venv --python 3.10 venv
```

## venv 起動方法

```
source ./venv/Scripts/activate
```

> [!WARNING]
> Linuxはまた別です。 
> `activate` の前には半角スペースです

以下でシャットダウン
```
deactivate
```

## パッケージ管理

なんかpip install でインストールしたときは下記コマンドでチーム共有
入れる前にチームに連絡
```
pip freeze > requirements.txt
```

開発始める前に下記コマンドで同期
```
pip install -r requirements.txt
```

