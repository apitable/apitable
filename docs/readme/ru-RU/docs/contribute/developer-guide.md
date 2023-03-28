# Руководство для разработчиков

Это руководство поможет вам начать разработку APITable.

## Зависимости

Перед настройкой среды разработчика убедитесь, что у вас установлены следующие зависимости и языки программирования:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Язык программирования

Если вы используете macOS или Linux. Мы рекомендуем установить язык программирования с SDK-менеджером `sdkman`` и `nvm</0>.

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

Мы рекомендуем использовать Homebrew для установки всех недостающих зависимостей:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

На CentOS / RHEL или другой дистрибутив Linux с помощью yum

```bash
sudo yum install git
sudo yum install make
```

На Ubuntu / Debian или другом дистрибутиве Linux с помощью  `apt`.

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Если вы используете APITable на Windows 10/11, мы рекомендуем установить Docker Desktop на Windows, Ubuntu на WSL и Windows Terminal, Вы можете узнать больше о Windows Subsystem for Linux (WSL) на официальном сайте.

Установите недостающие зависимости на Ubuntu с помощью `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Какой инструмент сборки мы используем?

Мы используем `make` как наш основной инструмент сборки, который управляет другими инструментами сборки, такими как `gradle` / `npm` / `yarn`.

Поэтому вы можете просто ввести команду make и увидеть все команды сборки:

```bash
make
```

![make command screenshot](../static/make.png)



## Запуск среды разработки?

APITable состоит из 3 процессов:

1. backend-server
2. room-server
3. web-server

Чтобы запустить среду разработки локально, выполните эти команды:

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




## Какой IDE вы должны использовать?

Мы рекомендуем вам использовать Visual Studio Code или Intellij IDEA в качестве IDE.

APITable подготовил отладочные конфигурации для этих двух IDE.

Просто откройте корневой каталог APITable с помощью IDE.



## Как настроить SMTP-сервер?

По умолчанию, APITable не настраивает SMTP-сервер, что означает, что вы не можете пригласить пользователей, так как для этого требуется возможность отправки электронной почты.

It is needed to modify `.env` configuration using self email, and restart backend server.

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

In addition, some mailboxes need to be enabled in the background to use smtp. For details, you can search for xxx mailbox smtp tutorial.


## Проблемы с производительностью в macOS M1 docker run?

## Где находится документация для разработчиков?

You can access the API documentation by starting a local server:

1. Адрес документации сервера бэкэнда: http://localhost:8081/api/v1/doc.html

2. Адрес документации для сервера Room: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## Как установить ограничение количества виджета на панели управления? (по умолчанию 30)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Могу ли я увеличить лимит запросов API? (по умолчанию 5)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. Вы можете установить `LIMIT_POINTS` и `LIMIT_DURATION` , чтобы указать количество запросов, которые могут быть сделаны за единичный период времени. Если LIMIT_POINTS - это количество раз, а LIMIT_DURATION - это длительность, измеряемая в секундах.

2. Вы можете установить параметр `LIMIT_WHITE_LIST` , чтобы установить отдельную частоту запросов для определенных пользователей. Его значение является JSON строкой, и его структура может ссылаться на `Map<string, IBaseRateLimiter>`.

## Как увеличить количество записей, добавляемых во время вызова API? (по умолчанию 10)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## Как обновиться до последней версии?


## Как изменить стандартный 80 порт?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080