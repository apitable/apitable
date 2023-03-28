# 개발자 가이드

이 가이드는 APITable 개발을 시작하는 데 도움이 됩니다.

## 종속성

개발자 환경을 설정하기 전에 다음 종속 요소와 프로그래밍 언어가 설치되어 있는지 확인하세요:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2 ](https://docs.docker.com/engine/install/)
- `make`


### 프로그래밍 언어

macOS 또는 Linux를 사용하는 경우. SDK 관리자 sdkman과 nvm으로 프로그래밍 언어를 설치하는 것을 권장합니다.

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

누락된 종속성을 설치하려면 홈브루를 사용하는 것이 좋습니다:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```

### Linux

CentOS/RHEL 또는 기타 Linux 배포판에서 yum을 사용하여

```bash
sudo yum install git
sudo yum install make
```

Ubuntu/Debian 또는 기타 Linux 배포판에서 apt을 사용하여

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Windows 10/11에서 APITable을 실행하는 경우 Windows에 Docker Desktop, WSL에 Ubuntu 및 Windows 터미널을 설치하는 것이 좋으며, 공식 사이트에서 WSL(Windows 서브 시스템 for Linux)에 대해 자세히 알아볼 수 있습니다.

apt를 사용하여 우분투에 누락된 종속성을 설치합니다:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## 우리가 사용하는 빌드 도구는 무엇입니까?

우리는 make를 중심 빌드 도구 항목으로 사용하여 gradle / npm / yarn과 같은 다른 빌드 도구를 구동합니다.

따라서 make 명령만 입력하면 모든 빌드 명령어를 볼 수 있습니다:

```bash
make
```

![make command screenshot](../static/make.png)



## 개발 환경 시작?

에이피테이블은 3개의 프로세스로 구성됩니다

1. backend-server
2. room-server
3. web-server

개발 환경을 로컬에서 시작하려면 다음 명령을 실행합니다:

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




## 어떤 IDE를 사용해야 합니까?

IDE는 Visual Studio Code 또는 Intellij IDEA를 사용하는 것을 권장합니다.

APITable은 이 두 가지 IDE의 디버그 구성을 준비했습니다.

IDE로 APITable의 루트 디렉토리를 열기만 하면 됩니다.



## SMTP 서버를 구성하는 방법은 무엇입니까?

기본적으로 APITable은 SMTP 서버를 구성하지 않습니다. 즉, 이메일 전송 기능이 필요하므로 사용자를 초대할 수 없습니다.

자체 이메일을 사용하여 .env 구성을 수정하고 백엔드 서버를 다시 시작해야 합니다.

`
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email`

In addition, some mailboxes need to be enabled in the background to use smtp. For details, you can search for xxx mailbox smtp tutorial.


## macOS M1 도커 실행 시 성능 문제가 있습니까?

## 개발자 문서는 어디에 있습니까?

로컬 서버를 시작하여 API 문서에 액세스할 수 있습니다:

1. Backend server 의 문서 주소는 다음과 같습니다: http://localhost:8081/api/v1/doc.html

2. room-server 의 문서 주소는 다음과 같습니다. http://localhost:3333/nest/v1/docs

클라우드 서비스 API 인터페이스에 관심이 있는 경우 다음에서 온라인 API 설명서에 직접 액세스할 수도 있습니다 https://developers.apitable.com/api/introduction.

## 대시보드에서 위젯 수량 제한을 설정하는 방법은 무엇입니까? (기본적으로 30개)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Can I increase request rate limit of the API? (기본적으로 5개)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. You can set `LIMIT_POINTS` and `LIMIT_DURATION` to indicate the number of requests that can be made in a unit time period. Where LIMIT_POINTS is the number of times and LIMIT_DURATION is the duration, measured in seconds.

2. You can set the parameter `LIMIT_WHITE_LIST` to set a separate request frequency for specific users. Its value is a JSON string, and its structure can refer to `Map<string, IBaseRateLimiter>`.

## How to increase the number of records inserted per API call? (10 by default)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## How to upgrade to the newest release version?


## How to change the default 80 port?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080