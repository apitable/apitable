# Developer Guide

This guide helps you get started developing APITable.

## Dependencies
Make sure you have the following dependencies installed before setting up your developer environment:

- `git`
- `docker`
- `make`

APITable use `docker` to run everything. It is unnecessary to set up programming language environment. But if you want to do so, following these dependencies installed.

- `node`: NodeJS v16.15.0
- `java`: Java SDK 8
- `python`: Python 3


## macOS

We recommend using [Homebrew](https://brew.sh/) for installing any missing dependencies:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make

## optional
brew install bash
brew install node@16
brew tap adoptopenjdk/openjdk
brew install --cask adoptopenjdk8
```

## Windows
If you are running APITable on Windows 10, we recommend installing the Windows Subsystem for Linux (WSL). 
For installation instructions, refer to our [APITable setup guide for Windows environment](./windows-guide.md).

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