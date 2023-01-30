# Entwicklerhandbuch

Diese Anleitung hilft Ihnen bei der Entwicklung von APITable.

## Abhängigkeiten

Stellen Sie sicher, dass Sie die folgenden Abhängigkeiten und Programmiersprachen installiert haben, bevor Sie Ihre Entwicklerumgebung einrichten:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `machen`
- [sdkman](https://sdkman.io/): Installation `Java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): für `Knoten`, NodeJS v16.15.0


### Programmiersprache

Wenn Sie macOS oder Linux verwenden. Wir empfehlen die Installation der Programmiersprache mit dem SDK-Manager `sdkman` und `nvm`.

```bash
# Schnellinstallation nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install. h | bash
# quick install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16. 5.0 && nvm verwenden 16.15. && corepack aktivieren
# install Java Development Kit
sdk install java 8. .342-amzn && sdk verwenden Sie java 8.0.342-amzn
```

### macOS

Wir empfehlen [Homebrew](https://brew.sh/) zur Installation fehlender Abhängigkeiten zu verwenden:

```bash
## erforderlich
braut Installation git
braut Installation --cask docker
braut install make
```

### Linux

Auf CentOS / RHEL oder anderen Linux-Distributionen mit `yum`

```bash
sudo yum install git
sudo yum install make
```

Auf Ubuntu / Debian oder andere Linux-Distribution mit `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Fenster

Wenn Sie APITable unter Windows 10/11 ausführen, empfehlen wir die Installation von [Docker Desktop unter Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu auf WSL](https://ubuntu.com/wsl) und [Windows Terminal](https://aka.ms/terminal), Mehr über Windows Subsystem für Linux (WSL) erfahren Sie unter [der offiziellen Seite](https://learn.microsoft.com/en-us/windows/wsl).

Fehlende Abhängigkeiten auf Ubuntu mit `apt` installieren:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Erstelle Werkzeug

Wir verwenden `make` als unseren zentrischen Buildwerkzeug, der andere Buildwerkzeuge wie `Gradle` / `npm` / `Garn` antreibt.

So können Sie einfach `make` Befehl eingeben und alle Build-Befehle sehen:

```bash
machen
```

![erstelle einen Screenshot](../static/make.png)



## Entwicklungsumgebung starten

APITable besteht aus 4 Prozessen:

1. backend-Server
2. room-Server
3. socket-Server
4. web-server

Um die Entwicklungsumgebung lokal zu starten, führen Sie diese Befehle aus:

```bash
# Datenbanken in Dockern starten
make dataenv 

# # Installationsabhängigkeiten
install 

#Start backend-server
make run # 1  

# und dann zu einem neuen Terminal wechseln
# Starte Raum-Server
make run # 2

# und wechseln Sie dann zu einem neuen Terminal
# Starte Socket-Server
make run # geben Sie 3  

# ein und wechseln Sie zu einem neuen Terminal
# Start Webserver
make run # geben Sie 4 ein #

```




## IDE

Wir empfehlen Ihnen, `Visual Studio Code` oder `Intellij IDEA` für Ihre IDE zu verwenden.

APITable haben diese beiden IDE Debug-Konfigurationen vorbereitet.

Öffnen Sie einfach das Hauptverzeichnis von APITable mit IDE.
