# Przewodnik dla programistów

Ten przewodnik pomoże Ci rozpocząć tworzenie APITable.

## Zależności

Przed skonfigurowaniem środowiska programistycznego upewnij się, że masz zainstalowane następujące zależności i języki programowania:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### Język programowania

Jeśli używasz macOS lub Linux. Zalecamy zainstalowanie języka programowania z menedżerem SDK `sdkman` i `nvm`.

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

Zalecamy użycie Homebrew do zainstalowania wszelkich brakujących zależności:

```bash
## wymagane jest
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

Na CentOS / RHEL lub innej dystrybucji Linuksa z `yum`

```bash
sudo yum install git
sudo yum install make
```

Na Ubuntu / Debian lub innej dystrybucji Linuksa z `apt`.

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

Jeśli używasz APITable na Windows 10/11, zalecamy zainstalowanie Docker Desktop na Windows, Ubuntu na WSL i Windows Terminal, Możesz dowiedzieć się więcej o Windows Subsystem for Linux (WSL) w oficjalnej witrynie.

Zainstaluj brakujące zależności na Ubuntu używając `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## Jakiego narzędzia kompilacyjnego używamy?

Używamy `make` jako naszego centralnego wpisu narzędzia budowania, który napędza inne narzędzia budowania jak `gradle` / `npm` / `pnpm`.

Więc możesz po prostu wprowadzić polecenie make i zobaczyć wszystkie polecenia budowania:

```bash
make
```

![utwórz zrzut ekranu polecenia](../static/make.png)



## Uruchom środowisko programistyczne?

APITable składa się z 3 procesów:

1. backend-server
2. room-server
3. web-server

Aby uruchomić środowisko programistyczne lokalnie, uruchom te polecenia:

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




## Co powinieneś zrobić?

Zalecamy używanie Visual Studio Code lub Intellij IDEA jako IDE.

APITable przygotowało dla tych dwóch IDE konfiguracje debugowania.

Wystarczy otworzyć katalog główny APITable za pomocą IDE.



## Jak przyczynić się do tłumaczeń?

Mamy dwa sposoby, aby usprawnić tłumaczenie APITable:

1. Możesz modyfikować pliki markdown w kodzie źródłowym i bezpośrednio utworzyć PR
2. Dołącz do naszego [Crowdin](https://crowdin.com/project/apitablecode) aby znaleźć `strings` aby zmodyfikować

We współpracy z tłumaczeniem wielojęzycznym śledzimy następujący proces:

![Zrzut ekranu procesu wielojęzycznego tłumaczenia](../static/collaboration_of_multilingual_translation.png)

## Jak skonfigurować serwer SMTP?

Domyślnie APITable nie konfiguruje serwera SMTP, co oznacza, że nie możesz zaprosić użytkowników, ponieważ wymaga to funkcji wysyłania wiadomości e-mail.

Jest to konieczne, aby zmodyfikować konfigurację `.env` używając własnej wiadomości e-mail i zrestartować serwer backend.

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

Ponadto niektóre skrzynki pocztowe muszą być włączone w tle, aby używać smtp. Aby uzyskać więcej informacji, możesz wyszukać samouczek smtp xxx.


## Problem z wydajnością w docker macOS M1?

## Gdzie jest dokumentacja API?

Możesz uzyskać dostęp do dokumentacji API, uruchamiając lokalny serwer:

1. Adres dokumentacji dla serwera Backend to: http://localhost:8081/api/v1/doc.html

2. Adres dokumentacji dla room-server to: http://localhost:3333/nest/v1/docs

Jeśli jesteś zainteresowany interfejsami API usługi w chmurze, możesz również uzyskać bezpośredni dostęp do dokumentacji API online na https://developers.apitable.com/api/introduction.

## Jak ustawić ograniczenie ilości widżetu w panelu nawigacyjnym? (domyślnie 30)

Można to osiągnąć poprzez ustawienie parametru `DSB_WIDGET_MAX_COUNT` w pliku `.env`.

## Czy mogę zwiększyć limit stawki żądania API? (domyślnie 5)

W pliku `.env.default` z `serwerów pokoju`istnieją dwa parametry, które mogą dostosować częstotliwość żądania:

1. Możesz ustawić `LIMIT_POINTS` i `LIMIT_DURATION`, aby wskazać liczbę żądań, które można złożyć w jednostkowym okresie czasu. Gdzie LIMIT_POINTS jest liczbą razy, a LIMIT_DURATION to czas trwania, mierzony w sekundach.

2. Możesz ustawić parametr `LIMIT_WHITE_LIST`, aby ustawić oddzielną częstotliwość żądania dla określonych użytkowników. Jego wartość jest ciągiem JSON, a jego struktura może odnosić się do `mapy<string, IBaseRateLimiter>`.

## Jak zwiększyć liczbę wpisów na wywołanie API? (domyślnie 10)

Można to osiągnąć, ustawiając parametr `API_MAX_MODIFY_RECORD_COUNTS` w pliku `.env.default` serwera `room-server`.


## Jak zaktualizować do najnowszej wersji?


## Jak zmienić domyślny port 80?
Właściwości konfiguracji w pliku `.env` mogą być również nadpisane przez określenie ich env vars `NGINX_HTTP_PORT`

Na przykład. Jest on ustawiony jako NGINX_HTTP_PORT=8080