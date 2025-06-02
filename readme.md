> [!WARNING]
> `gohang`配下で作業することを前提としています

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


```
pip freeze > requirements.txt
```

```
pip install -r requirements.txt
```

ファイルを作成
```
.env
```
