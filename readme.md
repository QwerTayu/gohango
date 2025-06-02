> [!WARNING]
> ルートディレクトリである`gohango`配下で作業することを前提としています

## venv 起動方法

```
cd ./venv/Scripts
. activate
cd ../../
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


## 開発始める前に
ファイルを作成
```
.env
```


## データベース関連
```
cd docker
```

```
docker compose up -d
```

```
docker compose run liquibase
```
