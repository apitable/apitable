# Guide du développeur

Ce guide vous aide à démarrer le développement d'APITable.

## Dépendances

Assurez-vous que les dépendances et les langages de programmation suivants sont installés avant de configurer votre environnement de développement :

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Langage de programmation

Si vous utilisez macOS ou Linux. Nous vous recommandons d'installer le langage de programmation avec le gestionnaire de SDK `sdkman` et `nvm`.

```bash
# installation rapide nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | frapper
# sdkman d'installation rapide
curl -s "https://get.sdkman.io" | frapper
# installer nodejs
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# installer le kit de développement java
installation de l'env du SDK
# installer la chaîne d'outils de rouille
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### mac OS

Nous vous recommandons d'utiliser [Homebrew](https://brew.sh/) pour installer les dépendances manquantes :

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

Sur CentOS / RHEL ou une autre distribution Linux avec `yum`

```bash
sudo yum install git
sudo yum install make
```

Sur Ubuntu / Debian ou autre distribution Linux avec `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Les fenêtres

Si vous exécutez APITable sur Windows 10/11, nous vous recommandons d'installer [Docker Desktop sur Windows](https://docs.docker.com/desktop/install/windows-install/), \[Ubuntu sur WSL\](https:/ /ubuntu.com/wsl) et [Terminal Windows](https://aka.ms/terminal), Vous pouvez en savoir plus sur le sous-système Windows pour Linux (WSL) sur [le site officiel](https://learn.microsoft.com/en-us/windows/wsl).

Installez les dépendances manquantes sur Ubuntu en utilisant `apt` :

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Quel outil de compilation utilisons-nous ?

Nous utilisons `make` comme entrée d'outil de construction centrée qui pilote d'autres outils de construction comme `gradle` / `npm` / `yarn`.

Vous pouvez donc simplement saisir la commande `make` et voir toutes les commandes de construction :

```bash
make
```

![capture d'écran de la commande make](../static/make.png)



## Comment démarrer l'environnement de développement ?

APITable se compose de 3 processus :

1. backend-server
2. room-server
3. web-server

Pour démarrer l'environnement de développement localement, exécutez ces commandes :

```bash
# démarrer les bases de données dans dockers
make dataenv 

# install dependencies
make install 

#start backend-server
make run # enter 1  

# puis basculer vers un nouveau terminal
# start room-server
make run # enter 2

# and then switch to a new terminal
# start web-server
make run # enter 3

```




## Quel IDE devez-vous utiliser ?

Nous vous recommandons d'utiliser `Visual Studio Code` ou `Intellij IDEA` pour votre IDE.

APITable a préparé les configurations de débogage de ces deux IDE.

Ouvrez simplement le répertoire racine d'APITable avec IDE.



## Comment configurer le serveur SMTP ?

Par défaut, APITable ne configure pas le serveur SMTP, ce qui signifie que vous ne pouvez pas inviter d'utilisateurs car il nécessite la fonctionnalité d'envoi d'e-mails.

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


## Problème de performances sous macOS M1 docker run ?

## Où est la documentation de l'API ?

You can access the API documentation by starting a local server:

1. L'adresse de la documentation du backend-server est : http://localhost:8081/api/v1/doc.html

2. L'adresse de documentation pour le room-server est :http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## Comment définir la limitation de la quantité de widgets dans le tableau de bord ? (30 par défaut)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Puis-je augmenter la limite du taux de requêtes de l'API ? (5 par défaut)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. Vous pouvez définir `LIMIT_POINTS` et `LIMIT_DURATION` pour indiquer le nombre de demandes pouvant être effectuées dans une période unitaire. Où LIMIT_POINTS est le nombre de fois et LIMIT_DURATION est la durée, mesurée en secondes.

2. Vous pouvez définir le paramètre `LIMIT_WHITE_LIST` pour définir une fréquence de demande distincte pour des utilisateurs spécifiques. Sa valeur est une chaîne JSON et sa structure peut faire référence à `Map<string, IBaseRateLimiter>`.

## Comment augmenter le nombre d'enregistrements insérés par appel API ? (10 par défaut)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## Comment mettre à niveau vers la dernière version ?


## Comment changer le port 80 par défaut ?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080