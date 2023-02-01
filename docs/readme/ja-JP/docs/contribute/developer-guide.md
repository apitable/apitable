# 開発者ガイド

このガイドは、APITableの開発を開始するのに役立ちます。

## 依存関係

開発者環境を設定する前に、以下の依存関係とプログラミング言語がインストールされていることを確認してください。

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `作る`
- [sdkman](https://sdkman.io/): `java`, Java SDK 8 をインストールする
- [nvm](https://github.com/nvm-sh/nvm): インストール用 `ノード`, NodeJS v16.15.0


### プログラミング言語

macOS または Linux を使用している場合。 SDKマネージャー `sdkman` と `nvm` を使用してプログラミング言語をインストールすることをお勧めします。

```bash
# quick install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# quick install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# install java development kit
sdk install java 8.0.342-amzn && sdk use java 8.0.342-amzn
```

### macOS

不足している依存関係をインストールするには、 [Homebrew](https://brew.sh/) を使用することをお勧めします：

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```

### Linux

CentOS / RHEL または `yum` を含む Linux ディストリビューションでは

```bash
sudo yum install git
sudo yum install make
```

Ubuntu / Debian または他の Linux ディストリビューションで `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

If you are running APITable on Windows 10/11, we recommend installing [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) and [Windows Terminal](https://aka.ms/terminal), You can learn more about Windows Subsystem for Linux (WSL) in [the official site](https://learn.microsoft.com/en-us/windows/wsl).

`apt` を使用してUbuntuに不足している依存関係をインストールする :

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## ビルドツール

`make` を中心としたビルドツールエントリとして `gradle` / `npm` / `yarn` のような他のビルドツールを駆動します。

ですから、 `make` コマンドを入力するだけで、すべてのビルドコマンドを確認できます。

```bash
作る
```

![コマンドのスクリーンショット作成](../static/make.png)



## 開発環境を開始

APITableは以下の4つのプロセスで構成されています。

1. バックエンドサーバー
2. room-server
3. ソケットサーバー
4. web-server

開発環境をローカルで起動するには、以下のコマンドを実行します。

```bash
# start databases in dockers
make dataenv 

# install dependencies
make install 

#start backend-server
make run # enter 1  

# and then switch to a new terminal
# start room-server
make run # enter 2

# and then switch to a new terminal
# start socket-server
make run # enter 3  

# and then switch to a new terminal
# start web-server
make run # enter 4

```




## IDE

ご使用の IDE に `Visual Studio Code` または `Intellij IDEA` を使用することをお勧めします。

APITableは、これらの2つのIDEのデバッグ設定を用意しています。

IDEでAPITableのルートディレクトリを開くだけです。
