# Developer Guide

This guide helps you get started developing APITable.

## Dependencies

Make sure you have the following dependencies and programming languages installed before setting up your developer environment:

- `git`
- `docker`
- `docker-compose v2`
- `make`
- [sdkman](https://sdkman.io/): for install `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): for install `node`, NodeJS v16.15.0


## Programming Language

If you are using macOS or Linux.
We recommend install programming language with SDK manager `sdkman` and `nvm`.

```bash
# quick install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# quick install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16.15.0 && nvm use 16.15.0
# install java development kit
sdk install java 8.0.342-amzn && sdk use java 8.0.342-amzn
```

## macOS

We recommend using [Homebrew](https://brew.sh/) for installing any missing dependencies:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```


## Windows

If you are running APITable on Windows 10/11, we recommend installing [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) and [Windows Terminal](https://aka.ms/terminal),
you can learn more about Windows Subsystem for Linux (WSL) in [the official site](https://learn.microsoft.com/en-us/windows/wsl).

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



## IDE

### Visual Studio Code

### Intellij IDEA
