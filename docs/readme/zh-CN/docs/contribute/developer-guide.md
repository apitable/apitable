# 开发者指南

本指南帮助您开始开发 APITable 。

## Dependencies

请确保您在设置开发者环境之前安装了以下依赖关系和编程语言：

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### 编程语言

如果您使用 macOS 或 Linux。 我们建议使用 SDK 管理器 `sdkman` 和 `nvm` 安装编程语言。

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# 安装 sdkman
curl -s "https://get.sdkman.io" | bash
# 安装 nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# 安装 java 开发者环境
sdk env install
# 安装 rust 工具链
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### macOS

我们建议使用 [Homebrew](https://brew.sh/) 来安装任何缺失的依赖包：

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

在 CentOS / RHEL或其他 Linux 发行版使用 `yum`

```bash
sudo yum install git
sudo yum install make
```

在 Ubuntu / Debian 或其他 Linux 发行版使用 `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

如果您正在Windows 10/11上运行 APITable ，我们建议在Windows上安装[Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) 和 [Windows Terminal](https://aka.ms/terminal), 您可以在 [官方网站](https://learn.microsoft.com/en-us/windows/wsl) 了解更多关于 Windows 子系统 的Linux (WSL) 的信息。

使用 `apt` 在 Ubuntu 上安装缺少的依赖：

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## 我们使用什么构建工具？

我们使用 `make` 作为我们的中心构建工具，来驱动其他构建工具，如 `gradle` / `npm` / `yarn`

所以您可以只输入 `make` 命令并看到所有构建命令：

```bash
make
```

![命令截图](../static/make.png)



## 如何设置开发环境？

APITable 由 3 个进程组成:

1. backend-server
2. room-server
3. web-server

要启动本地开发环境，请运行这些命令：

```bash
# 在 Docker 中启动数据库
make dataenv 
# 安装依赖关系
make install 
# 启动 backend-server
make run # enter 1  
# 然后切换到新的终端
# 启动 room-server
make run # enter 2
# 然后切换到新的终端
# 启动 web-server
make run # enter 3

```




## 您应该使用什么IDE？

我们建议您使用 `Visual Studio Code` 或 `Intellij IDEA` 为您的 IDE。

APITable 已准备好这两个IDE调试配置。

只需打开 IDE 的 APITable 根目录。



## 如何贡献翻译？

您可以修改源代码中的 Markdown 文件并直接创建 PR

另外，对于 UI 的文本，可以直接更改代码文件中的`strings`，它们位于（不同的语言对应不同的语言文件）：

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...



## 如何配置SMTP服务器？

默认情况下，APITable 不配置SMTP服务器，这意味着您不能邀请用户，因为它需要电子邮件发送功能。

需要使用自己的邮箱修改.env配置，重启 backend-server。

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

此外，需要在后台启用某些邮件箱才能使用smtp。 详细可以搜索xxx邮箱smtp教程。


## macOS M1 下 docker 运行的性能问题？

## API文档在哪里？

您可以通过启动本地服务器来访问 API 文档：

1. backend-server 的文档地址为: http://localhost:8081/api/v1/doc.html

2. room-server 的文档地址为: http://localhost:3333/nest/v1/docs

如果您对云服务 API 接口感兴趣，也可以直接访问 https://developers.apitable.com/api/introduction 获取在线 API 文档。

## 如何在仪表板中设置小部件数量限制？ （默认为 30）

可以在`.env`文件中设置`DSB_WIDGET_MAX_COUNT`参数来实现。

## 我可以增加 API 的请求速率限制吗？ （默认为 5）

在 `room-server` 下的 `.env.default` 文件中，有两个参数可以调整请求频率：

1. 您可以设置参数 `LIMIT_POINTS` 和 `LIMIT_DURATION` 来设置在单位时间段内可以发出的请求数。 其中 LIMIT_POINTS 是次数，LIMIT_DURATION 是持续时间，以秒为单位。

2. 您可以设置参数 `LIMIT_WHITE_LIST` 来为特定用户设置单独的请求频率。 它的值为一个JSON字符串，其结构可以参考`Map<string, IBaseRateLimiter>`。

## 如何增加每次 API 调用插入行记录的数量？ （默认为 10）

可以通过在 `room-server` 下的 `.env.default` 文件中设置 `API_MAX_MODIFY_RECORD_COUNTS` 参数来实现。


## 如何更新到最新的版本?


## 如何更改默认的80端口?
`.env` 文件中的配置属性也可以通过指定环境变量 `NGINX_HTTP_PORT` 来覆盖。

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
