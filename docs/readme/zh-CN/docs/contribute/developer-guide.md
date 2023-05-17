# 开发者指南

本指南帮助您开始开发 APITable 。

## 依赖包

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

On MacOS and Linux, Python is usually pre-installed, but its version may not meet the requirement. You can run `python --version` to check out the version of the built-in Python, if it is below 3.7, see below for the commands to install the required Python version on various systems.

### MacOS

我们建议使用 [Homebrew](https://brew.sh/) 来安装任何缺失的依赖包：

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

如果您正在Windows 10/11上运行 APITable ，我们建议在Windows上安装[Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) 和 [Windows Terminal](https://aka.ms/terminal), 您可以在 [官方网站](https://learn.microsoft.com/en-us/windows/wsl) 了解更多关于 Windows 子系统 的Linux (WSL) 的信息。

使用 `apt` 在 Ubuntu 上安装缺少的依赖：

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

![命令截图](../static/make.png)



## How to start the development environment?

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



## How to contribute to translations?

我们有两种方法改进APITable的翻译：

1. 您可以修改源代码中的 Markdown 文件并直接创建 PR
2. Join our [Crowdin](https://crowdin.com/project/apitablecom) to find the `strings` to modify

Also, for the text of the UI, you can change the `strings` in code files directly, they are located at（Different languages correspond to different language files）:

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...

在多语种翻译的协作下，我们遵循以下程序：

![多语种翻译流程的截图](../static/collaboration_of_multilingual_translation.png)

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

例如： NGINX_HTTP_PORT=8080

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
