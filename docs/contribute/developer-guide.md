# Developer Guide

This guide helps you get started developing APITable.

## Dependencies

Make sure you have the following dependencies and programming languages installed before setting up your developer environment:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Programming Language

If you are using macOS or Linux.
We recommend install programming language with SDK manager `sdkman` and `nvm`.

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

If you are running APITable on Windows 10/11, we recommend installing [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu on WSL](https://ubuntu.com/wsl) and [Windows Terminal](https://aka.ms/terminal),
You can learn more about Windows Subsystem for Linux (WSL) in [the official site](https://learn.microsoft.com/en-us/windows/wsl).

Install missing dependencies on Ubuntu using `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## What Build Tool we use?

We use `make` as our centric build tool entry that drives other build tool like `gradle` / `npm` / `yarn`.

So you can just input `make` command and see all build commands:

```bash
make
```

![make command screenshot](../static/make.png)



## How to start development environment?

APITable consists of 3 processes:

1. backend-server
2. room-server
3. web-server

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
# start web-server
make run # enter 3

```




## What IDE should you use?

We recommend you use `Visual Studio Code` or `Intellij IDEA` for your IDE.

APITable have prepared these two IDE's debug configs.

Just open APITable's root directory with IDE.



## How to configurate the SMTP server?

By default, APITable doesn't configure the SMTP server, which means you cannot invite users since it require the email sending feature.


## Performance problem under macOS M1 docker run?

## Where is the API documentation?

the api document local access address is http://localhost:8081/api/v1/doc.html 

## How to set the limitation of widget quantity in dashboard? (Default 30)

## Can I improve the API query rate limit? (Default 5)
Yes, You can configure it in the .env file.
But, we recommend you don't set it too large due to the performance problem.

## Can I improve the API query batch tasks? (Default 10)

## How to upgrade to the newest release version?

## How to change the default 80 port?




