# 开发者指南

本指南帮助您开始开发 APITable 。

## 依赖

在设置你的开发者环境之前，请确保你已经安装了以下依赖和编程语言：

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`
- [sdkman](https://sdkman.io/): 用于安装 `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): 用于安装 `node`, NodeJS v16.15.0


### 编程语言

如果您使用 macOS 或 Linux。 我们建议使用 SDK 管理器 `sdkman` 和 `nvm` 安装编程语言。

```bash
# 快速安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# 快速安装 sdkman
curl -s "https://get.sdkman.io" | bash
# 安装 Node.js 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# 安装 java 开发包
sdk install java 8.0.342-amzn && sdk use java 8.0.342-amzn
```

### macOS

我们建议使用 [Homebrew](https://brew.sh/) 来安装任何缺失的依赖包：

```bash
## 必要
brew install git
brew install --cask docker
brew install make
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

如果您在 Windows 10/11 上运行 APITable，我们建议在 Windows 上安装 [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)，[Ubuntu on WSL](https://ubuntu.com/wsl) 和 [Windows Terminal](https://aka.ms/terminal), 您可以在 [官方网站](https://learn.microsoft.com/en-us/windows/wsl) 了解更多关于 Windows WSL 的信息。</p>

然后就可以在 WSL 中使用 `apt` 在 Ubuntu 上安装缺少的依赖：


```bash
sudo apt update
sudo apt install git
sudo apt install make
```

## 构建工具

我们使用 `make` 作为我们的中央构建工具，来驱动其他构建工具，如 `gradle` / `npm` / `yarn`

所以您可以只输入 `make` 命令并看到所有构建命令：

```bash
make
```

![命令截图](../static/make.png)

## 启动开发环境

APITable 由 4 个进程组成：

1. backend-server
2. room-server
3. socket-server
4. web-server

要启动本地开发环境，请运行这些命令：

```bash
# 在 Docker 中启动数据库
make dataenv 

# 安装依赖关系
make install

# 启动 backend-server 
make run # 输入1  

# 然后切换到新的终端
# 启动 room-server
make run # 输入2

# 然后切换到新的终端
# 启动 socket-server
make run # 输入3  

# 然后切换到新的终端
# 启动 web-server
make run # 输入4
```

## 集成开发环境（IDE）

我们建议您使用 `Visual Studio Code` 或 `Intellij IDEA` 作为您的 IDE。

APITable 已准备好这两个 IDE 的调试配置。

只需在 IDE 中打开 APITable 的根目录即可。
