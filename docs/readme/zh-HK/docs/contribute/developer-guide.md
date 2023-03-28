# 開發者指南

本指南幫助您開始開發 APITable 。

## 依賴關係

請確保您在設置開發者環境之前安裝了以下依賴關係和編程語言：

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### 編程語言

如果您使用 macOS 或 Linux。 我們建議使用 SDK 管理器 `sdkman` 和 `nvm` 安裝編程語言。

```bash
# 安裝 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# 安裝 sdkman
curl -s "https://get.sdkman.io" | bash
# 安裝 nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# 安裝 java 開發者環境
sdk env install
# 安裝 rust 工具鏈
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### macOS

我們建議使用 [Homebrew](https://brew.sh/) 來安裝任何缺失的依賴包：

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

在 CentOS / RHEL或其他 Linux 發行版使用 `yum`

```bash
sudo yum install git
sudo yum install make
```

在 Ubuntu / Debian 或其他 Linux 發行版使用 `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

如果您正在Windows 10/11上運行 APITable ，我們建議在Windows上安裝[Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) 和 [Windows Terminal](https://aka.ms/terminal), 您可以在 [官方網站](https://learn.microsoft.com/en-us/windows/wsl) 了解更多關於 Windows 子系統 的Linux (WSL) 的信息。

使用 `apt` 在 Ubuntu 上安裝缺少的依賴：

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## 我們使用什麼構建工具？

我們使用 `make` 作為我們的中心構建工具，來驅動其他構建工具，如 `gradle` / `npm` / `yarn`

所以您可以只輸入 `make` 命令並看到所有構建命令：

```bash
make
```

![命令截圖](../static/make.png)



## 如何設置開發環境？

APITable 由 3 個進程組成:

1. backend-server
2. room-server
3. web-server

要啟動本地開發環境，請運行這些命令：

```bash
# 在 Docker 中啟動數據庫
make dataenv 
# 安裝依賴關係
make install 
# 啟動 backend-server
make run # enter 1  
# 然後切換到新的終端
# 啟動 room-server
make run # enter 2
# 然後切換到新的終端
# 啟動 web-server
make run # enter 3

```




## 您應該使用什麼IDE？

我們建議您使用 `Visual Studio Code` 或 `Intellij IDEA` 為您的 IDE。

APITable 已準備好這兩個IDE調試配置。

只需打開 IDE 的 APITable 根目錄。



## 如何配置SMTP服務器？

默認情況下，APITable 不配置SMTP服務器，這意味著您不能邀請用戶，因為它需要電子郵件發送功能。

It is needed to modify `.env` configuration using self email, and restart backend server.

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

In addition, some mailboxes need to be enabled in the background to use smtp. For details, you can search for xxx mailbox smtp tutorial.


## macOS M1 下 docker 運行的性能問題？

## API文檔在哪裡？

You can access the API documentation by starting a local server:

1. backend-server 的文檔地址為: http://localhost:8081/api/v1/doc.html

2. room-rserver 的文檔地址為: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## 如何在儀表板中設置小部件數量限制？ （默認為 30）

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## 我可以增加 API 的請求速率限制嗎？ （默認為 5）

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. 您可以設置參數 `LIMIT_POINTS` 和 `LIMIT_DURATION` 來設置在單位時間段內可以發出的請求數。 其中 LIMIT_POINTS 是次數，LIMIT_DURATION 是持續時間，以秒為單位。

2. 您可以設置參數 `LIMIT_WHITE_LIST` 來為特定用戶設置單獨的請求頻率。 它的值為一個JSON字符串，其結構可以參考`Map<string, IBaseRateLimiter>`。

## 如何增加每次 API 調用插入行記錄的數量？ （默認為 10）

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## 如何更新到最新的版本?


## 如何更改默認的80端口?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080