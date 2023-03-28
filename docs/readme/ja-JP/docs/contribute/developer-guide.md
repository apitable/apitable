# 開発者ガイド

このガイドは、APITable の開発を開始するのに役立ちます。

## 依存関係

開発者環境を設定する前に、次の依存関係とプログラミング言語がインストールされていることを確認してください。

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### プログラミング言語

macOS または Linux を使用している場合。 macOS または Linux を使用している場合。 SDKマネージャー`sdkman`と`nvm`でプログラミング言語をインストールすることをお勧めします。

```bash
# クイック インストール nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# sdkman のクイック インストール
curl -s "https://get.sdkman.io" | bash
# nodejs をインストール
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# Java 開発キットをインストール
sdk env install
# Rust ツールチェーンのインストール
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profileminimal -y && source "$HOME/.cargo/env"
```

### ＃＃＃ マックOS

不足している依存関係をインストールするには、[Homebrew](https://brew.sh/) を使用することをお勧めします。

```bash
## 必須必須
brew install git
brew install --cask docker
brew install make
```

### Linux

CentOS / RHEL または `yum` を使用するその他の Linux ディストリビューション

```bash
sudo yum install git
sudo yum install make
```

`apt` を使用した Ubuntu / Debian またはその他の Linux ディストリビューション

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### ＃＃＃ ウィンドウズ

Windows 10/11 で APITable を実行している場合は、[Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)、\[Ubuntu on WSL\](https:/ /ubuntu.com/wsl) および [Windows ターミナル](https://aka.ms/terminal)、 Windows Subsystem for Linux (WSL) の詳細については、[公式サイト](https://learn.microsoft.com/en-us/windows/wsl) を参照してください。

`apt` を使用して、不足している依存関係を Ubuntu にインストールします。

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## 使用するビルド ツールは?

`gradle` / `npm` / `yarn` などの他のビルド ツールを駆動する中心的なビルド ツール エントリとして `make` を使用します。

したがって、`make` コマンドを入力するだけで、すべてのビルド コマンドを表示できます。

```bash
make
```

![make コマンドのスクリーンショット](../static/make.png)



## 開発環境の起動方法は?

APITable は 3 つのプロセスで構成されています。

1. backend-server
2. room-server
3. web-server

開発環境をローカルで開始するには、次のコマンドを実行します。

```bash
# Docker でデータベースを起動
make dataenv 
# 依存関係をインストール
make install 
#backend-server を起動
make run # 1 を入力
# その後、新しいターミナルに切り替えます
# ルームサーバー起動
make run # 2 を入力してください
# その後、新しいターミナルに切り替えます
# ウェブサーバー起動
make run # 3 を入力

```




## どの IDE を使用する必要がありますか?

IDE には「Visual Studio Code」または「Intellij IDEA」を使用することをお勧めします。

APITable は、これら 2 つの IDE のデバッグ構成を準備しました。

APITable のルート ディレクトリを IDE で開くだけです。



## SMTP サーバーの設定方法は?

デフォルトでは、APITable は SMTP サーバーを構成しません。 つまり、メール送信機能が必要なため、ユーザーを招待することはできません。

自己メールを使用して .env 構成を変更し、バックエンド サーバーを再起動する必要があります。

`
MAIL_ENABLED=真
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
メールポート=465
MAIL_SSL_ENABLE=真
MAIL_TYPE=smtp
MAIL_USERNAME=your_email`

さらに、一部のメールボックスは、smtp を使用するためにバックグラウンドで有効にする必要があります。 詳細については、xxx メールボックス smtp チュートリアルを検索してください。 詳細については、xxx メールボックスの smtp チュートリアルを検索できます。


## macOS M1 docker run でのパフォーマンスの問題?

## API ドキュメントはどこにありますか?

ローカル サーバーを起動すると、API ドキュメントにアクセスできます。

1. バックエンド サーバーのドキュメント アドレスは次のとおりです: http://localhost:8081/api/v1/doc.html

2. ルーム サーバーのドキュメント アドレスは次のとおりです。 http://localhost:3333/nest/v1/docs

クラウド サービス API インターフェースに関心がある場合は、https://developers.apitable.com/api/introduction でオンライン API ドキュメントに直接アクセスすることもできます。

## ダッシュボードでウィジェット数の制限を設定するには? (デフォルトでは 30)

これは、`room-server`の`.env.default`ファイルで`API_MAX_MODIFY_RECORD_COUNTS`パラメータを設定することで実現できます。

## API のリクエスト レート制限を引き上げることはできますか? (デフォルトでは 5)

「room-server」の「.env.default」ファイルには、リクエストの頻度を調整できる 2 つのパラメーターがあります。

1. `LIMIT_POINTS` と `LIMIT_DURATION` を設定して、単位時間内に行うことができるリクエストの数を示すことができます。 ここで、LIMIT_POINTS は回数、LIMIT_DURATION は継続時間で、秒単位で測定されます。

2. パラメータ `LIMIT_WHITE_LIST` を設定して、特定のユーザーに個別のリクエスト頻度を設定できます。 その値は JSON 文字列であり、その構造は `Map<string, IBaseRateLimiter>` を参照できます。

## API 呼び出しごとに挿入されるレコードの数を増やすには? (デフォルトで 10)

これは、`.env` ファイルで `DSB_WIDGET_MAX_COUNT` パラメータを設定することで実現できます。


## 最新のリリース バージョンにアップグレードするには?


## デフォルトの 80 ポートを変更するには?
`.env` ファイルの構成プロパティは、環境変数 `NGINX_HTTP_PORT` を指定することでオーバーライドすることもできます

例えば。 NGINX_HTTP_PORT=8080 として設定されます