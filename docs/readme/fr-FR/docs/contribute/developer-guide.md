# Guide du développeur

Ce guide vous aide à commencer à développer APITable.

## Dépendances

Assurez-vous d'avoir les dépendances suivantes et les langages de programmation installés avant de configurer votre environnement de développeur:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `faire`
- [sdkman](https://sdkman.io/): pour installer `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): pour installer `noeud`, NodeJS v16.15.0


### Langue de programmation

Si vous utilisez macOS ou Linux. Nous recommandons d'installer le langage de programmation avec le gestionnaire SDK `sdkman` et `nvm`.

```bash
# quick install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install. h | bash
# installation rapide sdkman
curl -s "https://get.sdkman.io" | bash
# installer nodejs 
nvm install 16. 5.0 && nvm utilise 16.15. && corepack active
# installer le kit de développement java
sdk install java 8. .342-amzn && sdk utilise java 8.0.342-amzn
```

### macOS

Nous recommandons d'utiliser [Homebrew](https://brew.sh/) pour installer les dépendances manquantes :

```bash
## nécessaire
brew install git
brew install --cask docker
brew install make make
```

### Linux

Sur CentOS / RHEL ou toute autre distribution Linux avec `yum`

```bash
sudo yum install git
sudo yum install make make
```

Sur Ubuntu / Debian ou toute autre distribution Linux avec `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Fenêtres

Si vous exécutez APITable sous Windows 10/11, nous vous recommandons d'installer [Docker Desktop sous Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu sur WSL](https://ubuntu.com/wsl) et [Terminal Windows](https://aka.ms/terminal), Vous pouvez en savoir plus sur Windows Subsystem pour Linux (WSL) dans [le site officiel](https://learn.microsoft.com/en-us/windows/wsl).

Installer les dépendances manquantes sur Ubuntu en utilisant `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Outil de construction

Nous utilisons `make` comme entrée d'outil de construction centrée qui conduit d'autres outils de construction comme `gradle` / `npm` / `yarn`.

Donc vous pouvez simplement entrer la commande `make` et voir toutes les commandes de build :

```bash
faire
```

![faire une capture d'écran de commande](../static/make.png)



## Démarrer l'environnement de développement

APITable se compose de 4 processus :

1. serveur backend
2. room-server
3. socket-server
4. serveur web

Pour démarrer l'environnement de développement localement, exécutez ces commandes :

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
# start socket-server
make run # enter 3  

# and then switch to a new terminal
# start web-server
make run # enter 4

```




## IDE

Nous vous recommandons d'utiliser `Visual Studio Code` ou `Intellij IDEA` pour votre IDE.

APITable a préparé ces deux configurations de débogage d'IDE.

Ouvrez simplement le répertoire racine d'APITable avec IDE.
