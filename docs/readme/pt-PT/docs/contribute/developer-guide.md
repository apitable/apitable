# Guia do Desenvolvedor

Este guia ajuda-o a começar a desenvolver a APITable.

## Dependências

Assegure-se de ter as seguintes dependências e linguagens de programação instaladas antes de configurar o seu ambiente de desenvolvimento:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Linguagem de Programação

Se estiver a utilizar macOS ou Linux. Recomendamos instalar a linguagem de programação com SDK manager `sdkman` e `nvm`.

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

Recomendamos o uso de homebrew para instalar quaisquer dependências em falta:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

Em CentOS / RHEL ou outra distribuição Linux com `yum`.

```bash
sudo yum install git
sudo yum install make
```

Em Ubuntu / Debian ou outra distribuição Linux com `apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Se estiver a executar o APITable no Windows 10/11, recomendamos a instalação do Docker Desktop no Windows, Ubuntu no WSL e Windows Terminal, Pode saber mais sobre o Subsistema Windows para Linux (WSL) no site oficial.

Instalar dependências em falta no Ubuntu usando o `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Qual ferramenta de compilação utilizamos?

Usamos como nossa entrada de ferramenta de construção cêntrica que conduz outras ferramentas de construção como `gradle` / `npm` / `fio`.

Assim, pode simplesmente introduzir o comando make e ver todos os comandos de construção:

```bash
make
```

![fazer captura de tela de comando](../static/make.png)



## Como iniciar o ambiente de desenvolvimento?

APITable consiste em 3 processos:

1. backend-server
2. room-server
3. web-server

Para iniciar o ambiente de desenvolvimento localmente, executar estes comandos:

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




## Qual IDE você deve usar?

Recomendamos-lhe que utilize Visual Studio Code ou Intellij IDEA para a sua IDE.

A APITable preparou estas duas IDE's debug configs.

Basta abrir o directório raiz do APITable com IDE.



## Como configurar o servidor SMTP?

Por padrão, a APITable não configura o servidor SMTP, o que significa que você não pode convidar usuários, pois requer o recurso de envio de email.

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


## Problema de desempenho na execução docker do macOS M1?

## Onde fica a documentação da API?

You can access the API documentation by starting a local server:

1. O endereço da documentação para o servidor do Backend é: http://localhost:8081/api/v1/doc.html

2. O endereço da documentação para o room-server é:http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## Como definir a limitação da quantidade de widget no painel? (30 por padrão)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## Posso aumentar a taxa de solicitação do limite da API? (5 por padrão)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. Você pode definir `LIMIT_POINTS` e `LIMIT_DURATION` para indicar o número de solicitações que podem ser feitas em um período de tempo unitário. Onde LIMIT_POINTS é o número de vezes e LIMIT_DURATION é a duração, medida em segundos.

2. Você pode definir o parâmetro `LIMIT_WHIT_LIST` para definir uma frequência de solicitação separada para usuários específicos. Seu valor é uma string JSON, e sua estrutura pode se referir ao `Mapa<string, IBaseRateLimiter>`.

## Como aumentar o número de registros inseridos por chamada de API? (10 por padrão)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## Como atualizar para a versão mais recente?


## Como mudar a porta padrão 80?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080