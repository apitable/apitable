# Посібник для розробника

Цей посібник допоможе вам розпочати розробку APITable.

## Залежності

Перед налаштуванням середовища розробника переконайтеся, що у вас встановлені наступні залежності та мови програмування:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Мова програмування

Якщо ви використовуєте macOS або Linux. Ми рекомендуємо встановити мову програмування за допомогою менеджера SDK `sdkman`` та `nvm</0>.

```bash
# quick install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# quick install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# install java development kit
sdk env install
```

### macOS

Ми рекомендуємо використовувати Homebrew для встановлення будь-яких відсутніх залежностей:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

На CentOS / RHEL або іншому дистрибутиві Linux з `yum`

```bash
sudo yum install git
sudo yum install make
```

На Ubuntu / Debian або іншому дистрибутиві Linux з `apt`.

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Якщо ви використовуєте APITable на Windows 10/11, ми рекомендуємо встановити [Docker Desktop на Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu на WSL](https://ubuntu.com/wsl) і [Windows Terminal](https://aka.ms/terminal), Ви можете дізнатися більше про Windows Subsystem for Linux (WSL) на офіційному сайті.

Встановіть відсутні залежності на Ubuntu за допомогою  `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Який інструмент збірки ми використовуємо?

Ми використовуємо `make` як центральний елемент інструменту збірки, який керує іншими інструментами збірки, такими як `gradle` / `npm` / `pnpm`.

Таким чином, ви можете просто ввести команду make і побачити всі команди збірки:

```bash
make
```

![зробити скріншот команди](../static/make.png)



## Запуск середовища розробки?

APITable складається з 3 процесів:

1. backend-server
2. room-server
3. web-server

Щоб запустити середовище розробки локально, виконайте ці команди:

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




## Що ж робити Вам?

Ми рекомендуємо використовувати Visual Studio Code або Intellij IDEA для вашого середовища розробки.

APITable підготував налагоджувальні конфігурації для цих двох IDE.

Просто відкрийте кореневу директорію APITable з IDE.



## Як внести свій внесок в переклади?

У нас є два способи поліпшити переклад АДМІНІСТІ:

1. Ви можете змінювати файли markdown в вихідному коді і створювати їх безпосередньо
2. Приєднуйтесь до нашої [Crowdin](https://crowdin.com/project/apitablecode), щоб знайти `strings` для зміни

У співпраці з багатомовним перекладом ми слідуємо наступному процесі:

![Скріншот багатомовного перекладу процесу](../static/collaboration_of_multilingual_translation.png)

## Як налаштувати SMTP сервер?

За замовчуванням, APITable не налаштувати SMTP-сервер, що означає, що Вам не потрібно відправляти листи функції відправки.

Потрібно змінити конфігурацію `.env`, використовуючи самоелектронну пошту та перезапустити сервер.

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smp
MAIL_USERNAME=your_email
```

Крім того, деякі поштові скриньки потрібно увімкнути на задньому плані, щоб використовувати smtp. Для подробиць ви можете шукати тестову розсилку xxx smtp підручник.


## Проблема продуктивності в роботі macOS M1 docker?

## Де знаходиться документація для розробників?

Ви можете отримати доступ до документації API, запустивши локальний сервер:

1. Документаційна адреса сервера Backend: http://localhost:8081/api/v1/doc.html

2. Документаційна адреса сервера Backend: http://localhost:3333/api/v1/docs

Якщо ви зацікавлені в хмарному сервіс-API інтерфейсі, ви також можете безпосередньо отримати доступ до онлайн-API документації на https://developers.apitable.com/api/introduction.

## Як встановити обмеження кількості віджетів на панелі керування? (30 за замовчуванням)

Цього можна досягти, встановивши параметр `DSB_WIDGET_MAX_COUNT` у файлі `.env`.

## Чи можна збільшити обмеження ставок запиту в API? (5 за замовчуванням)

У `.env.default` файл `сервера`є два параметри, які можуть налаштувати частоту запиту:

1. Ви можете встановити `LIMIT_POINTS` та `LIMIT_DURATION`, щоб вказати кількість запитів, які можна робити за одиницю часу. Там, де LIMIT_POINTS - це кількість часу, а LIMIT_URATION - це тривалість виміру, яка вимірюється в секундах.

2. Ви можете встановити параметр `LIMIT_WHITE_LIST` щоб встановити окрему частоту запиту для конкретних користувачів. Його значення є рядок JSON, і його структура може посилатись на `карту<string, IBaseRateLimiter>`.

## Як збільшити кількість записів, що завантажуються в API виклик? (10 за замовчуванням)

Цього можна досягти, встановивши параметр `API_MAX_MODIFY_RECORD_COUNTS` на файлі `.env.default` з `room-server`.


## Як оновитися до найновішої версії релізу?


## Як змінити 80 порт за замовчуванням?
Властивості конфігурації в файлі `.env` можна змінити шляхом зазначення їх env vars `NGINX_HTTP_PORT`

Наприклад. Воно буде задано як NGINX_HTTP_PORT=8080