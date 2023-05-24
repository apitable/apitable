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
## necesario
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



## ¿Cómo contribuir con las traducciones?

Puede modificar los archivos de markdown en el código fuente y crear un PR directamente

Además, para el texto de la interfaz de usuario, puede cambiar las `cadenas` en los archivos de código directamente, se encuentran en (Diferentes idiomas corresponden a diferentes archivos de idioma):

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...


## ¿Cómo configurar el servidor SMTP?

De forma predeterminada, APITable no configura el servidor SMTP, lo que significa que no puede invitar a los usuarios, ya que requiere la función de envío de correo electrónico.

Es necesario modificar la configuración de `.env` usando autoemail, y reiniciar el servidor de backend.

```
MAIL_ENABLED=verdadero
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=tu_contraseña_de_correo electrónico
CORREO_PUERTO=465
MAIL_SSL_ENABLE=verdadero
MAIL_TYPE=smtp
MAIL_USERNAME=tu_correo electrónico
```

Además, algunos buzones deben habilitarse en segundo plano para usar smtp. Para obtener más información, puede buscar el tutorial smtp del buzón xxx.


## ¿Problema de rendimiento al ejecutar macOS M1 docker?

## ¿Dónde está la documentación de la API?

Puede acceder a la documentación de la API iniciando un servidor local:

1. La dirección de documentación para el servidor Backend es: http://localhost:8081/api/v1/doc.html

2. La dirección de documentación para el servidor Room es: http://localhost:3333/nest/v1/docs

Si está interesado en las interfaces de la API del servicio en la nube, también puede acceder directamente a la documentación de la API en línea en https://developers.apitable.com/api/introduction.

## ¿Cómo establecer la limitación de la cantidad de widgets en el tablero?  (30 por defecto) (30 by default)

Esto se puede lograr configurando el parámetro `DSB_WIDGET_MAX_COUNT` en el archivo `.env`.

## ¿Puedo aumentar el límite de tasa de solicitudes de la API? (5 por defecto) (5 by default)

En el archivo `.env.default` de `room-server`, hay dos parámetros que pueden ajustar la frecuencia de la solicitud:

1. Puede establecer `LIMIT_POINTS` y `LIMIT_DURATION` para indicar el número de solicitudes que se pueden realizar en una unidad de tiempo. Donde LIMIT_POINTS es el número de veces y LIMIT_DURATION es la duración, medida en segundos.

2. Puede configurar el parámetro `LIMIT_WHITE_LIST` para establecer una frecuencia de solicitud separada para usuarios específicos. Su valor es una cadena JSON y su estructura puede hacer referencia a `Map<string, IBaseRateLimiter>`.

## ¿Cómo aumentar la cantidad de registros insertados por llamada API? (10 por defecto) (10 by default)

Esto se puede lograr configurando el parámetro `API_MAX_MODIFY_RECORD_COUNTS` en el archivo `.env.default` de `room-server`.


## ¿Cómo actualizar a la versión de lanzamiento más reciente?


## ¿Cómo cambiar el puerto 80
Predeterminado?Konfigurationseigenschaften in der `.env`-Datei können auch überschrieben werden, indem sie env vars `NGINX_HTTP_PORT` angeben

Zum Beispiel. Es würde als NGINX_HTTP_PORT=8080 festgelegt werden

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
