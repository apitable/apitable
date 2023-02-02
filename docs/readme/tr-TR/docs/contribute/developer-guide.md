# Geliştirici Kılavuzu

Bu kılavuz APITable'ı geliştirmeye başlamanıza yardımcı olur.

## Bağımlılıklar

Geliştirici ortamınızı kurmadan önce aşağıdaki bağımlılıkların ve programlama dillerinin kurulu olduğundan emin olun:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Programlama Dili

Eğer macOS veya Linux kullanıyorsanız. SDK yöneticisi `sdkman` ve `nvm` ile programlama dilini yüklemenizi öneririz.

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

Eksik bağımlılıkları yüklemek için Homebrew kullanmanızı öneririz:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
```

### Linux

CentOS / RHEL veya yum ile başka bir Linux dağıtımında

```bash
sudo yum install git
sudo yum install make
```

Ubuntu / Debian veya apt ile diğer Linux dağıtımlarında

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

APITable'ı Windows 10/11 üzerinde çalıştırıyorsanız, Windows üzerinde Docker Desktop, WSL üzerinde Ubuntu ve Windows Terminal'i kurmanızı öneririz, Linux için Windows Alt Sistemi (WSL) hakkında daha fazla bilgiyi resmi siteden öğrenebilirsiniz.

Ubuntu'da `apt` kullanarak eksik bağımlılıkları yükleyin:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## What Build Tool we use?

`gradle` / `npm` / `yarn` gibi diğer derleme araçlarını yönlendiren merkezi derleme aracı girişimiz olarak make kullanıyoruz.

Böylece sadece make komutunu girebilir ve tüm derleme komutlarını görebilirsiniz:

```bash
make
```

![make command screenshot](../static/make.png)



## How to start development environment?

APITable consists of 3 processes:

1. backend-server
2. room-server
3. web-server

Geliştirme ortamını yerel olarak başlatmak için aşağıdaki komutları çalıştırın:

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

IDE'niz için Visual Studio Code veya Intellij IDEA kullanmanızı öneririz.

APITable bu iki IDE'nin hata ayıklama yapılandırmalarını hazırladı.

Sadece APITable'ın kök dizinini IDE ile açın.



## How to configure the SMTP server?

By default, APITable doesn't configure the SMTP server, which means you cannot invite users since it require the email sending feature.

It is needed to modify .env configuration using self email, and restart backend server.

`
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email`

In addition, some mailboxes need to be enabled in the background to use smtp. For details, you can search for xxx mailbox smtp tutorial.


## Performance problem under macOS M1 docker run?

## Where is the API documentation?

You can access the API documentation by starting a local server:

1. The documentation address for the Backend server is: http://localhost:8081/api/v1/doc.html

2. The documentation address for the Room server is: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## How to set the limitation of widget quantity in dashboard? (30 by default)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Can I increase request rate limit of the API? (5 by default)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. You can set `LIMIT_POINTS` and `LIMIT_DURATION` to indicate the number of requests that can be made in a unit time period. Where LIMIT_POINTS is the number of times and LIMIT_DURATION is the duration, measured in seconds.

2. You can set the parameter `LIMIT_WHITE_LIST` to set a separate request frequency for specific users. Its value is a JSON string, and its structure can refer to `Map<string, IBaseRateLimiter>`.

## How to increase the number of records inserted per API call? (10 by default)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## How to upgrade to the newest release version?


## How to change the default 80 port?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080