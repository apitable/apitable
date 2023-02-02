# 開發者指南

本指南可幫助您開始開發 APITable。

## 依賴關係

在設置開發人員環境之前，請確保安裝了以下依賴項和編程語言：

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### 編程語言

如果您使用的是 macOS 或 Linux。 我們建議使用 SDK 管理器 sdkman 和 nvm 安裝編程語言。

```bash
# quick install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# quick install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# install java development kit
sdk env install
# install rust toolchain
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### macOS

我們建議使用 Homebrew 來安裝任何缺少的依賴項：

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```

### Linux

在 CentOS/RHEL 或其他帶有 yum 的 Linux 發行版上

```bash
sudo yum install git
sudo yum install make
```

在 Ubuntu / Debian 或其他帶有 apt 的 Linux 發行版上

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

如果您在 Windows 10/11 上運行 APITable，我們建議在 Windows 上安裝 Docker Desktop，在 WSL 上安裝 Ubuntu 和 Windows Terminal，您可以在官方網站上了解更多關於 Windows Subsystem for Linux (WSL) 的信息。

使用 apt 在 Ubuntu 上安裝缺少的依賴項：

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## What Build Tool we use?

我們使用 make 作為我們的中心構建工具入口，驅動其他構建工具，如 gradle / npm / yarn。

所以你可以只輸入 make 命令並查看所有構建命令：

```bash
make
```

![make command screenshot](../static/make.png)



## How to start development environment?

APITable consists of 3 processes:

1. 後端服務器
2. 房間服務器
3. 網絡服務器

要在本地啟動開發環境，請運行以下命令：

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
# start web-server
make run # enter 3

```




## What IDE should you use?

我們建議您使用 Visual Studio Code 或 Intellij IDEA 作為您的 IDE。

APITable 已經準備好這兩個IDE 的debug configs。

用IDE打開APITable的根目錄即可。



## How to configure the SMTP server?

By default, APITable doesn't configure the SMTP server, which means you cannot invite users since it require the email sending feature.

It is needed to modify .env configuration using self email, and restart backend server.

`
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email`

In addition, some mailboxes need to be enabled in the background to use smtp. For details, you can search for xxx mailbox smtp tutorial.


## Performance problem under macOS M1 docker run?

## Where is the API documentation?

You can access the API documentation by starting a local server:

1. The documentation address for the Backend server is: http://localhost:8081/api/v1/doc.html

2. The documentation address for the Room server is: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## How to set the limitation of widget quantity in dashboard? (30 by default)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Can I increase request rate limit of the API? (5 by default)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. You can set `LIMIT_POINTS` and `LIMIT_DURATION` to indicate the number of requests that can be made in a unit time period. Where LIMIT_POINTS is the number of times and LIMIT_DURATION is the duration, measured in seconds.

2. You can set the parameter `LIMIT_WHITE_LIST` to set a separate request frequency for specific users. Its value is a JSON string, and its structure can refer to `Map<string, IBaseRateLimiter>`.

## How to increase the number of records inserted per API call? (10 by default)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## How to upgrade to the newest release version?


## How to change the default 80 port?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080