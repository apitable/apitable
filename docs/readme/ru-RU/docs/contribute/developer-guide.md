# Руководство для разработчиков

Это руководство поможет вам начать разработку APITable.

## Зависимости

Перед настройкой среды разработчика убедитесь, что у вас установлены следующие зависимости и языки программирования:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Язык программирования

Если вы используете macOS или Linux. Мы рекомендуем установить язык программирования с SDK-менеджером `sdkman`` и`nvm</0>.

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
## Требуется
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



## Как сделать перевод?

У нас есть два способа улучшить перевод APITable:

1. Вы можете изменить markdown файлы в исходном коде и создать PR напрямую
2. Join our [Crowdin](https://crowdin.com/project/apitablecom) to find the `strings` to modify

Also, for the text of the UI, you can change the `strings` in code files directly, they are located at（Different languages correspond to different language files）:

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...

В сотрудничестве с многоязычным переводом мы следуем следующему процессу:

![Скриншот процесса многоязычного перевода](../static/collaboration_of_multilingual_translation.png)

## Как настроить SMTP-сервер?

По умолчанию, APITable не настраивает SMTP-сервер, что означает, что вы не можете пригласить пользователей, так как для этого требуется возможность отправки электронной почты.

Необходимо изменить конфигурацию `.env` используя собственную электронную почту и перезапустить бэкэнд сервер.

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

Кроме того, некоторые почтовые ящики должны быть включены в фоновом режиме, чтобы использовать smtp. Для получения подробной информации вы можете найти учебник по адресу xxx mailbox smtp.


## Проблемы с производительностью в macOS M1 docker run?

## Где находится документация для разработчиков?

Вы можете получить доступ к документации по API, запустив локальный сервер:

1. Адрес документации сервера бэкэнда: http://localhost:8081/api/v1/doc.html

2. Адрес документации для сервера Room: http://localhost:3333/nest/v1/docs

Если вас интересуют интерфейсы API облачных сервисов, вы также можете получить прямой доступ к документации по API по адресу https://developers.apitable.com/api/introduction.

## Как установить ограничение количества виджета на панели управления? (по умолчанию 30)

Это можно сделать, установив параметр `DSB_WIDGET_MAX_COUNT` в файле `.env`.

## Могу ли я увеличить лимит запросов API? (по умолчанию 5)

В файле `.env.default` из `комнат-сервера`есть два параметра, которые могут настраивать частоту запроса:

1. Вы можете установить `LIMIT_POINTS` и `LIMIT_DURATION` , чтобы указать количество запросов, которые могут быть сделаны за единичный период времени. Если LIMIT_POINTS - это количество раз, а LIMIT_DURATION - это длительность, измеряемая в секундах.

2. Вы можете установить параметр `LIMIT_WHITE_LIST` , чтобы установить отдельную частоту запросов для определенных пользователей. Его значение является JSON строкой, и его структура может ссылаться на `Map<string, IBaseRateLimiter>`.

## Как увеличить количество записей, добавляемых во время вызова API? (по умолчанию 10)

Это можно сделать, установив параметр `API_MAX_MODIFY_RECORD_COUNTS` в файле `.env.default` в `room-server`.


## Как обновиться до последней версии?


## Как изменить стандартный 80 порт?
Свойства конфигурации в файле `.env` также можно переопределить путем указания их env vars `NGINX_HTTP_PORT`

Например. Она будет установлена как NGINX_HTTP_PORT=8080

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
