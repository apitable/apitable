# Guida per gli sviluppatori

Questa guida aiuta a iniziare a sviluppare APITable.

## Dipendenze

Assicuratevi di avere installato le seguenti dipendenze e linguaggi di programmazione prima di configurare l'ambiente di sviluppo:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Linguaggio di programmazione

Se si utilizza macOS o Linux. Si consiglia di installare il linguaggio di programmazione con i gestori SDK sdkman e nvm.

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

Si consiglia di utilizzare Homebrew per installare le dipendenze mancanti:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

Su CentOS / RHEL o altre distribuzioni Linux con `yum`

```bash
sudo yum install git
sudo yum install make
```

Su Ubuntu / Debian o altre distribuzioni Linux con `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Se si esegue APITable su Windows 10/11, si consiglia di installare [Docker Desktop su Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu su WSL](https://ubuntu.com/wsl) e [Windows Terminal](https://aka.ms/terminal), È possibile saperne di più sul sottosistema Windows per Linux (WSL) in [il sito ufficiale](https://learn.microsoft.com/en-us/windows/wsl).

Installa le dipendenze mancanti su Ubuntu usando `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Quale strumento di costruzione utilizziamo?

Utilizziamo `make` come strumento di compilazione centrale che gestisce altri strumenti di compilazione come `gradle` / `npm` / `yarn`.

Quindi è sufficiente inserire il comando  `make` per vedere tutti i comandi di compilazione:

```bash
make
```

![fai screenshot dei comandi](../static/make.png)



## Avviare l'ambiente di sviluppo?

APITable è composto da 3 processi:

1. backend-server
2. room-server
3. web-server

Per avviare l'ambiente di sviluppo in locale, eseguire i seguenti comandi:

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




## Che IDE dovresti usare?

Si consiglia di utilizzare `Visual Studio Code` o `Intellij` IDEA come IDE.

APITable ha preparato le configurazioni di debug di questi due IDE.

Basta aprire la cartella principale di APITable con l'IDE.



## Come configurare il server SMTP?

Per impostazione predefinita, APITable non configura il server SMTP, il che significa che non è possibile invitare gli utenti dal momento che richiede la funzione di invio e-mail.

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


## Problema di prestazioni sotto macOS M1 docker eseguire?

## Dov'è la documentazione API?

You can access the API documentation by starting a local server:

1. L'indirizzo di documentazione del server Backend è: http://localhost:8081/api/v1/doc.html

2. L'indirizzo di documentazione del server Room è: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## Come impostare la limitazione della quantità di widget nella dashboard? (30 di default)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Posso aumentare il limite di richiesta dell'API? (5 di default)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. È possibile impostare `LIMIT_POINTS` e `LIMIT_DURATION` per indicare il numero di richieste che possono essere fatte in un periodo di tempo unitario. Dove LIMIT_POINTS è il numero di volte e LIMIT_DURATION è la durata, misurata in secondi.

2. È possibile impostare il parametro `LIMIT_WHITE_LIST` per impostare una frequenza di richiesta separata per utenti specifici. Il suo valore è una stringa JSON, e la sua struttura può fare riferimento a ` Map <string, IBaseRateLimiter>`.

## Come aumentare il numero di record inseriti per chiamata API? (10 di default)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## Come aggiornare alla versione più recente rilascio?


## Come modificare la porta predefinita 80?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080