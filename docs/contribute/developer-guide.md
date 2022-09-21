# Developer Guide

This guide helps you get started developing APITable.

## Dependencies
Make sure you have the following dependencies installed before setting up your developer environment:

- `git`
- `docker`
- `make`

## macOS

We recommend using [Homebrew](https://brew.sh/) for installing any missing dependencies:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```


## Windows
If you are running APITable on Windows 10, we recommend installing the Windows Subsystem for Linux (WSL). 
For installation instructions, refer to our [APITable setup guide for Windows environment](./windows-guide.md).

## Local Programming Language Environment

APITable use `docker` to run everything. It is unnecessary to set up programming language environment. 
But if you want to do so, we recommend following these SDK manager installed.

- [sdkman](https://sdkman.io/): for install `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): for install `node`, NodeJS v16.15.0

Then install programming langauge environment locally:

```bash
sdk install java 8.0.342-amzn
nvm install 16.15.0 && nvm use 16.15.0
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