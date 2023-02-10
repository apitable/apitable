# دليل المطور

هذا الدليل يساعدك على البدء في تطوير APITable.

## التبعيات

تأكد من أن لديك التبعيات التالية ولغات البرمجة مثبتة قبل إعداد بيئة المطور الخاص بك:

- `git`
- [مخزن](https://docs.docker.com/engine/install/)
- [المرفأ - تكوين v2](https://docs.docker.com/engine/install/)
- `اصنع`
- [sdkman](https://sdkman.io/): لتثبيت `جافا`، جافا SDK 8
- [nvm](https://github.com/nvm-sh/nvm): لتثبيت `عقدة`, NodeJS v16.15.0


### لغة البرمجة

إذا كنت تستخدم macOS أو Linux. نوصي بتثبيت لغة البرمجة مع مدير SDK `sdkman` و `nvm`.

```bash
# تثبيت سريع nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install. (ح) <unk> bash
# تثبيت سريع sdkman
curl -s "https://get.sdkman.io" <unk> bash
# تثبيت nodejs 
nvm تثبيت 16. 5.0 && nvm يستخدم 16.15. && تمكين الحزمة
# تثبيت مجموعة تطوير جافا
sdk تثبيت جافا 8. .342-amzn && sdk استخدم java 8.0.342-amzn
```

### macOS

نوصي باستخدام [Homebrew](https://brew.sh/) لتثبيت أي تبعيات مفقودة:

```bash
## ضروري مطلوب
التثبيت git
التثبيت --كاسك دكر
التثبيت
```

### Linux

في CentOS / RHEL أو أي توزيع آخر لـ Linux مع `yum`

```bash
sudo yum تثبيت git
sudo yum التثبيت
```

على Ubuntu / Debian أو أي توزيع آخر لـ Linux مع `Apt`

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### ويندوز

إذا كنت تقوم بتشغيل APITable على Windows 10/11، نوصي بتثبيت [Docker سطح المكتب على Windows](https://docs.docker.com/desktop/install/windows-install/)، [أوبونتو على WSL](https://ubuntu.com/wsl) و [محطة ويندوز الطرفية](https://aka.ms/terminal)، يمكنك معرفة المزيد عن نظام Windows الفرعي لـ Linux (WSL) في [الموقع الرسمي](https://learn.microsoft.com/en-us/windows/wsl).

تثبيت الإعتمادات المفقودة على أوبونتو باستخدام `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## أداة البناء

نحن نستخدم `صنع` كإدخال لأداة البناء المركزي لدينا التي تقود أداة بناء أخرى مثل `صف` / `npm` / `yarn`.

لذا يمكنك فقط إدخال `صنع أمر` ومشاهدة جميع أوامر الإنشاء:

```bash
اصنع
```

![اصنع لقطة للأوامر](../static/make.png)



## بدء بيئة التطوير

APITable يتألف من 4 عمليات:

1. الخادم الخلفي
2. الغرفة-الخادم
3. مقطعة-خادم
4. خادم ويب

لبدء بيئة التطوير محلياً، قم بتشغيل هذه الأوامر:

```bash
# بدء قواعد البيانات في قاعدة البيانات
جعل البياناتينيف 

# تثبيت الإعتمادات
جعل التثبيت 

#start backend server
جعل تشغيل # ادخل 1  

# ثم قم بالتبديل الى محطة طرفية جديدة
# بدء غرفة الخادم
جعل تشغيل # ادخل 2

# ثم قم بالتبديل الى محطة طرفية جديدة
# ابدأ Socket-server
جعل تشغيل # ادخل 3  

# ثم قم بالتبديل الى محطة طرفية جديدة
# ابدأ web-server
جعل التشغيل # ادخل 4

```




## IDE

ننصحك باستخدام `Visual Studio Code` أو `Intellij IDEA` من أجل IDE الخاص بك.

لقد قام APITable بإعداد تكوينين لتصحيح أخطاء الـ IDE.

فقط قم بفتح دليل APITabL الجذري باستخدام IDE.
