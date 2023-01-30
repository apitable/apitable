# Developer Guide

This guide helps you get started developing APITable.

## Dependencies

Make sure you have the following dependencies and programming languages installed before setting up your developer environment:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`
- [sdkman](https://sdkman.io/): for install `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): for install `node`, NodeJS v16.15.0


### Programming Language

If you are using macOS or Linux. We recommend install programming language with SDK manager `sdkman` and `nvm`.

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

We recommend using [Homebrew](https://brew.sh/) for installing any missing dependencies:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```

### Linux

On CentOS / RHEL or other Linux distribution with `yum`

```bash
sudo yum install git
sudo yum install make
```

On Ubuntu / Debian or other Linux distribution with `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

If you are running APITable on Windows 10/11, we recommend installing [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) and [Windows Terminal](https://aka.ms/terminal), You can learn more about Windows Subsystem for Linux (WSL) in [the official site](https://learn.microsoft.com/en-us/windows/wsl).

Install missing dependencies on Ubuntu using `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Build Tool

We use `make` as our centric build tool entry that drives other build tool like `gradle` / `npm` / `yarn`.

So you can just input `make` command and see all build commands:

```bash
make
```

![make command screenshot](../static/make.png)



## Start Development Environment

APITable consists of 4 processes:

1. backend-server
2. room-server
3. socket-server
4. web-server

To start the development environment locally, run these commands:

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

We recommend you use `Visual Studio Code` or `Intellij IDEA` for your IDE.

APITable have prepared these two IDE's debug configs.

Just open APITable's root directory with IDE.
