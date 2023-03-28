# Entwicklerhandbuch

Dieser Leitfaden hilft Ihnen beim Einstieg in die Entwicklung von APITable.

## Abhängigkeiten

Stellen Sie sicher, dass Sie die folgenden Abhängigkeiten und Programmiersprachen installiert haben, bevor Sie Ihre Entwicklerumgebung einrichten:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Programmiersprache

Wenn Sie macOS oder Linux verwenden. Wir empfehlen, die Programmiersprache mit dem SDK-Manager „sdkman“ und „nvm“ zu installieren.

```bash
# schnell installieren nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# sdkman schnell installieren
curl -s "https://get.sdkman.io" | bash
# installiere nodejs
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# Java-Entwicklungskit installieren
SDK-Env installieren
# Rust-Toolchain installieren
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### macOS

Wir empfehlen die Verwendung von [Homebrew](https://brew.sh/) zum Installieren fehlender Abhängigkeiten:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

Auf CentOS / RHEL oder anderen Linux-Distributionen mit `yum`

```bash
sudo yum install git
sudo yum install make
```

Auf Ubuntu / Debian oder anderen Linux-Distributionen mit `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Fenster

Wenn Sie APITable unter Windows 10/11 ausführen, empfehlen wir die Installation von [Docker Desktop unter Windows](https://docs.docker.com/desktop/install/windows-install/), \[Ubuntu on WSL\](https:/ /ubuntu.com/wsl) und \[Windows Terminal\] (https://aka.ms/terminal), Weitere Informationen zum Windows-Subsystem für Linux (WSL) finden Sie auf [der offiziellen Website](https://learn.microsoft.com/en-us/windows/wsl).

Installieren Sie fehlende Abhängigkeiten auf Ubuntu mit `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Welches Build-Tool verwenden wir?

Wir verwenden `make` als unseren zentrischen Buildwerkzeug, der andere Buildwerkzeuge wie `Gradle` / `npm` / `Garn` antreibt.

So können Sie einfach `make` Befehl eingeben und alle Build-Befehle sehen:

```bash
make
```

![Screenshot des Befehls erstellen](../static/make.png)



## Wie starte ich die Entwicklungsumgebung?

APITable besteht aus 3 Prozessen:

1. backend-server
2. room-server
3. web-server

Um die Entwicklungsumgebung lokal zu starten, führen Sie diese Befehle aus:

```bash
# Datenbanken in Dockern starten
make dataenv
# Abhängigkeiten installieren
make install
# Backend-Server starten
make run # geben Sie 1 ein
# und dann zu einem neuen Terminal wechseln
# Raumserver starten
make run  # 2 eingeben
# und dann zu einem neuen Terminal wechseln
# Webserver starten
make run # 3 eingeben

```




## Welche IDE sollten Sie verwenden?

Wir empfehlen die Verwendung von „Visual Studio Code“ oder „Intellij IDEA“ für Ihre IDE.

APITable hat die Debug-Konfigurationen dieser beiden IDEs vorbereitet.

Öffnen Sie einfach das Stammverzeichnis von APITable mit IDE.



## Wie konfiguriere ich den SMTP-Server?

Standardmäßig konfiguriert APITable den SMTP-Server nicht, was bedeutet, dass Sie keine Benutzer einladen können, da dies die E-Mail-Sendefunktion erfordert.

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


## Performance-Problem unter macOS M1 Docker-Lauf?

## Wo ist die API-Dokumentation?

You can access the API documentation by starting a local server:

1. Die Dokumentationsadresse für den backend-server lautet: http://localhost:8081/api/v1/doc.html

2. Die Dokumentationsadresse für den room-server lautet: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## Wie stelle ich die Begrenzung der Widget-Menge im Dashboard ein? (standardmäßig 30)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Kann ich das Anforderungsratenlimit der API erhöhen? (standardmäßig 5)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. Sie können „LIMIT_POINTS“ und „LIMIT_DURATION“ festlegen, um die Anzahl der Anforderungen anzugeben, die in einer Zeiteinheit erfolgen können. Dabei ist LIMIT_POINTS die Anzahl der Male und LIMIT_DURATION die Dauer, gemessen in Sekunden.

2. Sie können den Parameter `LIMIT_WHITE_LIST` setzen, um eine separate Anforderungshäufigkeit für bestimmte Benutzer festzulegen. Sein Wert ist ein JSON-String, und seine Struktur kann auf `Map<string, IBaseRateLimiter>` verweisen.

## Wie kann die Anzahl der pro API-Aufruf eingefügten Datensätze erhöht werden? (10 standardmäßig)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## Wie aktualisiere ich auf die neueste Release-Version?


## Wie ändere ich den Standardport 80?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080