# Guía de Desarrollador

Esta guía lo ayuda a comenzar a desarrollar APITable.

## Dependencias

Asegúrese de tener instalados los siguientes lenguajes de programación y dependencias antes de configurar su entorno de desarrollador:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Lenguaje de programación

Si está utilizando macOS o Linux. Recomendamos instalar el lenguaje de programación con SDK manager `sdkman` y `nvm`.

```bash
# instalación rápida nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | intento
# instalación rápida sdkman
curl -s "https://get.sdkman.io" | intento
# instalar nodejs
nvm install 16.15.0 && nvm use 16.15.0 && corepack habilitado
# instalar el kit de desarrollo java
instalar sdk env
# instalar la cadena de herramientas de óxido
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

### Mac OS

Recomendamos usar [Homebrew](https://brew.sh/) para instalar las dependencias que falten:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

En CentOS/RHEL u otra distribución de Linux con `yum`

```bash
sudo yum install git
sudo yum install make
```

En Ubuntu/Debian u otra distribución de Linux con `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### ventanas

Si ejecuta APITable en Windows 10/11, le recomendamos que instale [Docker Desktop en Windows](https://docs.docker.com/desktop/install/windows-install/), \[Ubuntu en WSL\](https:/ /ubuntu.com/wsl) y [Terminal de Windows](https://aka.ms/terminal), Puede obtener más información sobre el Subsistema de Windows para Linux (WSL) en \[el sitio oficial\] (https://learn.microsoft.com/en-us/windows/wsl).

Instale las dependencias que faltan en Ubuntu usando `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## ¿Qué herramienta de compilación usamos?

Usamos `make` como nuestra entrada de herramienta de compilación centrada que impulsa otra herramienta de compilación como `gradle` / `npm` / `yarn`.

Así que puedes ingresar el comando `make` y ver todos los comandos de compilación:

```bash
make
```

![hacer captura de pantalla del comando](../static/make.png)



## ¿Cómo iniciar el entorno de desarrollo?

APITable consta de 3 procesos:

1. backend-server
2. room-server
3. web-server

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
# start web-server
make run # enter 3

```




## ¿Qué IDE debería usar?

Le recomendamos que utilice `Visual Studio Code` o `Intellij IDEA` para su IDE.

APITable ha preparado estas dos configuraciones de depuración de IDE.

Simplemente abra el directorio raíz de APITable con IDE.



## ¿Cómo configurar el servidor SMTP?

De forma predeterminada, APITable no configura el servidor SMTP, lo que significa que no puede invitar a los usuarios, ya que requiere la función de envío de correo electrónico.

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


## ¿Problema de rendimiento al ejecutar macOS M1 docker?

## ¿Dónde está la documentación de la API?

You can access the API documentation by starting a local server:

1. La dirección de documentación para el servidor Backend es: http://localhost:8081/api/v1/doc.html

2. La dirección de documentación para el servidor Room es: http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## ¿Cómo establecer la limitación de la cantidad de widgets en el tablero?  (30 por defecto)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## ¿Puedo aumentar el límite de tasa de solicitudes de la API? (5 por defecto)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. Puede establecer `LIMIT_POINTS` y `LIMIT_DURATION` para indicar el número de solicitudes que se pueden realizar en una unidad de tiempo. Donde LIMIT_POINTS es el número de veces y LIMIT_DURATION es la duración, medida en segundos.

2. Puede configurar el parámetro `LIMIT_WHITE_LIST` para establecer una frecuencia de solicitud separada para usuarios específicos. Su valor es una cadena JSON y su estructura puede hacer referencia a `Map<string, IBaseRateLimiter>`.

## ¿Cómo aumentar la cantidad de registros insertados por llamada API? (10 por defecto)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## ¿Cómo actualizar a la versión de lanzamiento más reciente?


## ¿Cómo cambiar el puerto 80
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080