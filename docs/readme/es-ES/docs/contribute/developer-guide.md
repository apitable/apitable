# Guía de Desarrollador

Esta guía te ayuda a empezar a desarrollar APITable.

## Dependencias

Asegúrese de que tiene instaladas las siguientes dependencias y lenguajes de programación antes de configurar su entorno de desarrollador:

- `git`
- [acoplador](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `hacer`
- [sdkman](https://sdkman.io/): para instalar `java`, Java SDK 8
- [nvm](https://github.com/nvm-sh/nvm): para instalar `node`, NodeJS v16.15.0


### Lenguaje de programación

Si está usando macOS o Linux. Recomendamos instalar el lenguaje de programación con el administrador de SDK `sdkman` y `nvm`.

```bash
# rápido install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install. h | bash
# rápido install sdkman
curl -s "https://get.sdkman.io" | bash
# install nodejs 
nvm install 16. 5.0 && nvm usar 16.15. && corepack habilitar
# instalar java development kit
sdk install java 8. .342-amzn && sdk usar java 8.0.342-amzn
```

### macOS

Recomendamos usar [Homebrew](https://brew.sh/) para instalar cualquier dependencia faltante:

```bash
## necesario
brew install git
brew install --cask docker
brew install make
```

### Linux

En CentOS / RHEL u otra distribución Linux con `yum`

```bash
sudo yum install git
sudo yum install make
```

En Ubuntu / Debian u otra distribución Linux con `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Ventanas

Si está ejecutando APITable en Windows 10/11, le recomendamos instalar [Docker Desktop en Windows](https://docs.docker.com/desktop/install/windows-install/), [Ubuntu en WSL](https://ubuntu.com/wsl) y [Terminal de Windows](https://aka.ms/terminal), Puede obtener más información sobre el Subsistema de Windows para Linux (WSL) en [el sitio oficial](https://learn.microsoft.com/en-us/windows/wsl).

Instalar dependencias faltantes en Ubuntu usando `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Construir herramienta

Utilizamos `make` como nuestra entrada central de herramientas de construcción que impulsa otras herramientas de construcción como `gradle` / `npm` / `yarn`.

Así que solo puedes introducir `make` comando y ver todos los comandos de construcción:

```bash
hacer
```

![hacer captura de pantalla de comandos](../static/make.png)



## Iniciar entorno de desarrollo

APITable consta de 4 procesos:

1. servidor-backend
2. sala-servidor
3. servidor-socket
4. servidor web

Para iniciar el entorno de desarrollo localmente, ejecute estos comandos:

```bash
# iniciar bases de datos en dockers
make dataenv 

# install dependencies
make install 

#start backend-server
make run # enter 1  

# y luego cambiar a un nuevo terminal
# start room-server
make run # enter 2

# y luego cambiar a un nuevo terminal
# start socket-server
make run # enter 3  

# y luego cambiar a un nuevo terminal
# start web-server
make run # enter 4

```




## IDE

Le recomendamos que utilice `Visual Studio Code` o `Intellij IDEA` para su IDE.

APITable ha preparado estas dos configuraciones de depuración del IDE.

Simplemente abra el directorio raíz de APITable's con IDE.
