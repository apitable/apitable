# دليل المطور

هذا الدليل يساعدك على البدء في تطوير APITable.

## التبعيات

Before you start contributing to APITable, make sure you have the following tools and programming languages installed.

Required tools:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`

Required programming languages:

- Nodejs 16.15
- Java 8
- Rust (nightly)
- Python 3.7 or above
- A proper C/C++ compiler toolchain, e.g. GCC 4.8 or above, Clang 3.5 or above.

The following subsections show the recommended way to install these dependencies. Note that on MacOS some libraries are also required, see the MacOS subsection for more information.

### Programming Languages

If you are using MacOS or Linux. We recommend `sdkman` and `nvm` for managing the versions of Java and NodeJS respectively.

```bash
# التثبيت السريع nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# التثبيت السريع sdkman
curl -s "https://get.sdkman.io" | bash
# تثبيت nodejs 
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
# تثبيت java development kit
sdk env install
# تثبيت rust toolchain
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
```

On MacOS and Linux, Python is usually pre-installed, but its version may not meet the requirement. You can run `python --version` to check out the version of the built-in Python, if it is below 3.7, see below for the commands to install the required Python version on various systems.

### MacOS

نوصي باستخدام [Homebrew](https://brew.sh/) لتثبيت أي تبعيات مفقودة:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
brew install gcc
brew install python3
```

### Linux

On CentOS / RHEL or RHEL-based Linux distributions, use `yum`:

```bash
sudo yum install git
# This will install GCC toolchain and Make
sudo yum groupinstall 'Development Tools'
sudo yum install python3
```

On Ubuntu / Debian or Debian-based Linux distributions, use `apt`:

```bash
sudo apt update
sudo apt install git
# This will install GCC toolchain and Make
sudo apt install build-essential
sudo apt install python3
```

On ArchLinux or Arch-based Linux distributions, use `pacman`:

```bash
sudo pacman -Syyu git base-devel python3
```


### ويندوز

إذا كنت تقوم بتشغيل APITable على Windows 10/11، نوصي بتثبيت [Docker سطح المكتب على Windows](https://docs.docker.com/desktop/install/windows-install/)، [أوبونتو على WSL](https://ubuntu.com/wsl) و [محطة ويندوز الطرفية](https://aka.ms/terminal)، يمكنك معرفة المزيد عن نظام Windows الفرعي لـ Linux (WSL) في [الموقع الرسمي](https://learn.microsoft.com/en-us/windows/wsl).

تثبيت الإعتمادات المفقودة على أوبونتو باستخدام `apt`:

```bash
sudo apt update
sudo apt install git
# This will install GCC toolchain and Make
sudo apt install build-essential
sudo apt install python3
```


## What build tools do we use?

We use `make` as our centric build tool entry that drives other build tools like `gradle` / `npm` / `yarn`.

So you can just enter `make` command and see all build commands:

```bash
make
```

![لقطة شاشة لأمر make](../static/make.png)



## How to start the development environment?

يتكون APITable من 3 عمليات:

1. backend-server
2. room-server
3. web-server

لبدء بيئة التطوير محلياً، قم بتشغيل هذه الأوامر:

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




## ما IDE الذي يجب أن تستخدمه؟

ننصحك باستخدام `Visual Studio Code` أو `Intellij IDEA` من أجل IDE الخاص بك.

لقد قام APITable بإعداد تكوينين لتصحيح أخطاء الـ IDE.

فقط قم بفتح دليل APITabL الجذري باستخدام IDE.



## How to contribute to translations?

لدينا طريقتان لتحسين ترجمة APITable:

1. يمكنك تعديل ملفات markdown في التعليمات البرمجية المصدر وإنشاء PR مباشرة
2. Join our [Crowdin](https://crowdin.com/project/apitablecom) to find the `strings` to modify

Also, for the text of the UI, you can change the `strings` in code files directly, they are located at（Different languages correspond to different language files）:

1. packages/l10n/base/strings.zh-HK.json
2. packages/l10n/base/strings.ja-JP.json
3. ...

وبالتعاون مع الترجمة المتعددة اللغات، نتابع العملية التالية:

![لقطة شاشة لعملية الترجمة متعددة اللغات](../static/collaboration_of_multilingual_translation.png)

## كيف يتم تكوين خادم SMTP؟

بشكل افتراضي ، لا يقوم APITable بتكوين خادم SMTP ، مما يعني أنه لا يمكنك دعوة المستخدمين لأنه يتطلب ميزة إرسال البريد الإلكتروني.

هناك حاجة لتعديل إعدادات `.env` باستخدام البريد الإلكتروني الذاتي، وإعادة تشغيل خادم نهاية الخلفية.

```
<code>
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email</code>
```

</code>

بالإضافة إلى ذلك ، يجب تمكين بعض صناديق البريد في الخلفية لاستخدام بروتوكول smtp. لمزيد من التفاصيل ، يمكنك البحث عن برنامج تعليمي لـ xxx mailbox smtp.


## مشكلة في الأداء في ظل تشغيل عامل ميناء macOS M1؟

## أين وثائق API؟

يمكنك الوصول إلى وثائق API عن طريق بدء خادم محلي:

1. عنوان التوثيق لخادم الواجهة الخلفية هو: http://localhost:8081/api/v1/doc.html

2. عنوان التوثيق لخادم الغرفة هو:http://localhost:3333/nest/v1/docs

إذا كنت مهتمًا بواجهات API الخاصة بالخدمة السحابية ، فيمكنك أيضًا الوصول مباشرة إلى وثائق API عبر الإنترنت على https://developers.apitable.com/api/introduction.

## كيفية ضبط حدود كمية عنصر واجهة المستخدم في لوحة القيادة؟ (30 افتراضيًا)

يمكن تحقيق ذلك عن طريق تعيين المعلمة `DSB_WIDGET_MAX_COUNT` في ملف`.env`.

## هل يمكنني زيادة حد معدل الطلب لواجهة برمجة التطبيقات؟ (5 افتراضيًا)

في ملف `.env.default` `room-server`، هناك معلمان يمكن ضبط تكرار الطلب:

1. يمكنك تعيين `LIMIT_POINTS` و `LIMIT_DURATION` للإشارة إلى عدد الطلبات التي يمكن إجراؤها في فترة زمنية للوحدة. حيث يمثل LIMIT_POINTS عدد المرات و LIMIT_DURATION هي المدة ، ويتم قياسها بالثواني.

2. يمكنك تعيين المعلمة `LIMIT_WHITE_LIST` لتحديد تردد الطلبات المنفصل للمستخدمين المحددين. قيمتها هي سلسلة JSON ، ويمكن الرجوع إلى هيكلها من خلال `Map&lt;string، IBaseRateLimiter&gt;`.

## كيفية زيادة عدد السجلات المدخلة في كل استدعاء API؟ (10 افتراضيًا)

يمكن تحقيق ذلك عن طريق تعيين المعلمة `API_MAX_MODIFY_RECORD_COUNTS` في ملف `.env.default` من `room-server`.


## كيف يمكنك الترقية إلى الإصدار الأحدث؟


## كيفية تغيير منفذ 80 الافتراضي؟
يمكن أيضًا تجاوز خصائص التهيئة في ملف `.env` من خلال تحديد متغيرات البيئة الخاصة بها`NGINX_HTTP_PORT`

على سبيل المثال. على سبيل المثال ، سيتم تعيينه كـ NGINX_HTTP_PORT = 8080

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
