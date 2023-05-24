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



## 如何貢獻翻譯？

您可以修改源碼中的markdown文件，直接創建PR

另外，對於 UI 的文本，可以直接更改代碼文件中的`strings`，它們位於（不同的語言對應不同的語言文件）：


1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...



## 如何配置SMTP服務器？

默認情況下，APITable 不配置SMTP服務器，這意味著您不能邀請用戶，因為它需要電子郵件發送功能。

需要使用自己的郵箱修改.env配置，重啟 backend-server。

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

另外，有些郵箱需要在後台啟用smtp。 詳細可以搜索xxx郵箱smtp教程。


## macOS M1 下 docker 運行的性能問題？

## API文檔在哪裡？

您可以通過啟動本地服務器來訪問 API 文檔：

1. backend-server 的文檔地址為: http://localhost:8081/api/v1/doc.html

2. room-rserver 的文檔地址為: http://localhost:3333/nest/v1/docs

如果您對雲服務 API 接口感興趣，也可以直接訪問 https://developers.apitable.com/api/introduction 獲取在線 API 文檔。

## 如何在儀表板中設置小部件數量限制？ （默認為 30）

可以在`.env`文件中設置`DSB_WIDGET_MAX_COUNT`參數來實現。

## 我可以增加 API 的請求速率限制嗎？ （默認為 5）

在 `room-server` 下的 `.env.default` 文件中，有兩個參數可以調整請求頻率：

1. 您可以設置參數 `LIMIT_POINTS` 和 `LIMIT_DURATION` 來設置在單位時間段內可以發出的請求數。 其中 LIMIT_POINTS 是次數，LIMIT_DURATION 是持續時間，以秒為單位。

2. 您可以設置參數 `LIMIT_WHITE_LIST` 來為特定用戶設置單獨的請求頻率。 它的值為一個JSON字符串，其結構可以參考`Map<string, IBaseRateLimiter>`。

## 如何增加每次 API 調用插入行記錄的數量？ （默認為 10）

可以通過在 `room-server` 下的 `.env.default` 文件中設置 `API_MAX_MODIFY_RECORD_COUNTS` 參數來實現。


## 如何更新到最新的版本?


## 如何更改默認的80端口?
`.env` 文件中的配置屬性也可以通過指定環境變量 `NGINX_HTTP_PORT` 來覆蓋。

For example. 例如： NGINX_HTTP_PORT=8080

## How to add supported Languages?

To add a new language to APITable, follow these steps:

1. Determine the code of the language to be added, for example `uk-UA`.
2. Add new language files in the `packages/l10n/base/` directory. For example, create a file named `strings.uk-UA.json`. For example, create a file named `strings.uk-UA.json`.
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
