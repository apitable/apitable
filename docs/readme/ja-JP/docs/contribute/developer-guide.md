# 開発者ガイド

このガイドは、APITable の開発を開始するのに役立ちます。

## 依存関係

Before you start contributing to APITable, make sure you have the following tools and programming languages installed.

Required tools:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`

Required programming languages:

- Nodejs 16.15
- Java 8
- Rust (nightly)
- Python 3.7 or above
- A proper C/C++ compiler toolchain, e.g. GCC 4.8 or above, Clang 3.5 or above.

The following subsections show the recommended way to install these dependencies. Note that on MacOS some libraries are also required, see the MacOS subsection for more information.

### Programming Languages

If you are using MacOS or Linux. We recommend `sdkman` and `nvm` for managing the versions of Java and NodeJS respectively.

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

On MacOS and Linux, Python is usually pre-installed, but its version may not meet the requirement. You can run `python --version` to check out the version of the built-in Python, if it is below 3.7, see below for the commands to install the required Python version on various systems.

### MacOS

不足している依存関係をインストールするには、[Homebrew](https://brew.sh/) を使用することをお勧めします。

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
brew install gcc
brew install python3
```

### Linux

On CentOS / RHEL or RHEL-based Linux distributions, use `yum`:

```bash
sudo yum install git
# This will install GCC toolchain and Make
sudo yum groupinstall 'Development Tools'
sudo yum install python3
```

On Ubuntu / Debian or Debian-based Linux distributions, use `apt`:

```bash
sudo apt update
sudo apt install git
# This will install GCC toolchain and Make
sudo apt install build-essential
sudo apt install python3
```

On ArchLinux or Arch-based Linux distributions, use `pacman`:

```bash
sudo pacman -Syyu git base-devel python3
```


### Windows

Windows 10/11 で APITable を実行している場合は、[Windows に Docker デスクトップ](https://docs.docker.com/desktop/install/windows-install/)、[WSL に Ubuntu](https://ubuntu.com/wsl)、および [Windows ターミナル](https://aka.ms/terminal) をインストールすることをお勧めします。 Windows Subsystem for Linux (WSL) の詳細については、[公式サイト](https://learn.microsoft.com/en-us/windows/wsl)をご覧ください。

`apt` を使用して、不足している依存関係を Ubuntu にインストールします。

```bash
sudo apt update
sudo apt install git
# This will install GCC toolchain and Make
sudo apt install build-essential
sudo apt install python3
```


## What build tools do we use?

We use `make` as our centric build tool entry that drives other build tools like `gradle` / `npm` / `yarn`.

So you can just enter `make` command and see all build commands:

```bash
make
```

![make コマンドのスクリーンショット](../static/make.png)



## How to start the development environment?

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



## How to contribute to translations?

APITableの翻訳を改善するには2つの方法があります。

1. ソースコード内のマークダウンファイルを変更し、直接PRを作成することができます。
2. Join our [Crowdin](https://crowdin.com/project/apitablecom) to find the `strings` to modify

Also, for the text of the UI, you can change the `strings` in code files directly, they are located at（Different languages correspond to different language files）:

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...

多言語翻訳のコラボレーションでは、以下の手順に従います。

![多言語翻訳プロセスのスクリーンショット](../static/collaboration_of_multilingual_translation.png)

## SMTP サーバーの設定方法は?

デフォルトでは、APITable は SMTP サーバーを構成しません。 つまり、メール送信機能が必要なため、ユーザーを招待することはできません。

自己メールを使用して `.env` 設定を変更し、バックエンドサーバを再起動する必要があります。

```
MAIL_ENABLED=真
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
メールポート=465
MAIL_SSL_ENABLE=真
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

さらに、一部のメールボックスは、smtp を使用するためにバックグラウンドで有効にする必要があります。 詳細については、xxx メールボックス smtp チュートリアルを検索してください。 詳細については、xxx メールボックスの smtp チュートリアルを検索できます。


## macOS M1 docker run でのパフォーマンスの問題?

## API ドキュメントはどこにありますか?

ローカル サーバーを起動すると、API ドキュメントにアクセスできます。

1. バックエンド サーバーのドキュメント アドレスは次のとおりです: http://localhost:8081/api/v1/doc.html

2. ルーム サーバーのドキュメント アドレスは次のとおりです。 http://localhost:3333/nest/v1/docs

クラウド サービス API インターフェースに関心がある場合は、https://developers.apitable.com/api/introduction でオンライン API ドキュメントに直接アクセスすることもできます。

## ダッシュボードでウィジェット数の制限を設定するには? (デフォルトでは 30)

これは、`room-server`の`.env.default`ファイルで`API_MAX_MODIFY_RECORD_COUNTS</0>パラメータを設定することで実現できます。</p>

<h2 spaces-before="0">API のリクエスト レート制限を引き上げることはできますか? (デフォルトでは 5)</h2>

<p spaces-before="0"><code>room-server` の `.env.default`ファイルには、リクエスト頻度を調整できる2つのパラメータがあります。

1. `LIMIT_POINTS` と `LIMIT_DURATION` を設定して、単位時間内に行うことができるリクエストの数を示すことができます。 ここで、LIMIT_POINTS は回数、LIMIT_DURATION は継続時間で、秒単位で測定されます。

2. パラメータ `LIMIT_WHITE_LIST` を設定して、特定のユーザーに個別のリクエスト頻度を設定できます。 その値は JSON 文字列であり、その構造は `Map<string, IBaseRateLimiter>` を参照できます。

## API 呼び出しごとに挿入されるレコードの数を増やすには? (デフォルトで 10)

これは、`.env` ファイルで `DSB_WIDGET_MAX_COUNT` パラメータを設定することで実現できます。


## 最新のリリース バージョンにアップグレードするには?


## デフォルトの 80 ポートを変更するには?
`.env` ファイルの構成プロパティは、環境変数 `NGINX_HTTP_PORT` を指定することでオーバーライドすることもできます

例えば： NGINX_HTTP_PORT=8080 として設定されます

## How to add supported Languages?

To add a new language to APITable, follow these steps:

1. Determine the code of the language to be added, for example `uk-UA`.
2. Add new language files in the `packages/l10n/base/` directory. For example, create a file named `strings.uk-UA.json`.
3. List the value keys for translation in the new language file, following the format of strings.en-US.json.
4. Add the language item in `packages/l10n/base/language.manifest.json`.
    ```json
    {
      "en-US": "English",
      "uk-UA": "українська",
      "zh-CN": "简体中文"
    }
    ```
5. Once the translation is complete, execute the command: `make l10n-apitable-ce`.

By following these steps, you can easily add support for new languages to your project.
