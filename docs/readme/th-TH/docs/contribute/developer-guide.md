# คู่มือนักพัฒนา

คู่มือนี้ช่วยให้คุณเริ่มต้นพัฒนา APITable

## การพึ่งพา

ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้งการอ้างอิงและภาษาการเขียนโปรแกรมต่อไปนี้ก่อนตั้งค่าสภาพแวดล้อมสำหรับนักพัฒนาของคุณ:

- `git`
- [docker](https://docs.docker.com/engine/install/)
- [docker-compose v2](https://docs.docker.com/engine/install/)
- `make`


### ภาษาโปรแกรม

หากคุณใช้ macOS หรือ Linux เราขอแนะนำให้ติดตั้งภาษาโปรแกรมด้วยตัวจัดการ SDK sdkman และ nvm

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

ขอแนะนำให้ใช้ Homebrew เพื่อติดตั้งการพึ่งพาที่ขาดหายไป:

```bash
## necessary required
brew install git
brew install --cask docker
brew install make
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Linux

บน CentOS / RHEL หรือการแจกจ่าย Linux อื่น ๆ ด้วย `yum`

```bash
sudo yum install git
sudo yum install make
```

บน Ubuntu / Debian หรือการแจกจ่าย Linux อื่น ๆ ที่มี apt

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


### Windows

หากคุณใช้งาน APITable บน Windows 10/11 เราขอแนะนำให้ติดตั้ง Docker Desktop บน Windows, Ubuntu บน WSL และ Windows Terminal คุณสามารถเรียนรู้เพิ่มเติมเกี่ยวกับ Windows Subsystem สำหรับ Linux (WSL) ได้จากเว็บไซต์อย่างเป็นทางการ

Install missing dependencies on Ubuntu using `apt`:

```bash
sudo apt update
sudo apt install git
sudo apt install make
```


## เราใช้เครื่องมือสร้างอะไร

เราใช้ make เป็นรายการเครื่องมือสร้างศูนย์กลางของเราที่ขับเคลื่อนเครื่องมือสร้างอื่นๆ เช่น gradle / npm / yarn

คุณเพียงแค่ป้อนคำสั่ง make และดูคำสั่ง build ทั้งหมด:

```bash
make
```

![ภาพหน้าจอคำสั่ง](../static/make.png)



## เริ่มสภาพแวดล้อมการพัฒนา?

APITable ประกอบด้วย 3 กระบวนการ:

1. backend-server
2. room-server
3. web-server

ในการเริ่มสภาพแวดล้อมการพัฒนาแบบโลคัล ให้รันคำสั่งเหล่านี้:

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




## คุณควรใช้ IDE ใด

เราขอแนะนำให้คุณใช้ Visual Studio Code หรือ Intellij IDEA สำหรับ IDE ของคุณ

APITable ได้เตรียมการกำหนดค่าการดีบักของ IDE ทั้งสองนี้

เพียงเปิดไดเรกทอรีรากของ APITable ด้วย IDE



## จะร่วมแปลได้อย่างไร?

เรามีสองวิธีในการปรับปรุงการแปล APITable:

1. คุณสามารถแก้ไขไฟล์มาร์กดาวน์ในซอร์สโค้ดและสร้าง PR ได้โดยตรง
2. เข้าร่วม [Crowdin](https://crowdin.com/project/apitablecode) ของเราเพื่อค้นหา `strings` ที่จะแก้ไข

ในการทำงานร่วมกันของการแปลหลายภาษา เราปฏิบัติตามขั้นตอนต่อไปนี้:

![ภาพหน้าจอของกระบวนการแปลหลายภาษา](../static/collaboration_of_multilingual_translation.png)

## จะกำหนดค่าเซิร์ฟเวอร์ SMTP ได้อย่างไร?

ตามค่าเริ่มต้น APITable จะไม่กำหนดค่าเซิร์ฟเวอร์ SMTP ซึ่งหมายความว่าคุณไม่สามารถเชิญผู้ใช้ได้เนื่องจากต้องใช้คุณลักษณะการส่งอีเมล

จำเป็นต้องแก้ไขการกำหนดค่า `.env` โดยใช้อีเมลตัวเอง และรีสตาร์ทเซิร์ฟเวอร์ส่วนหลัง

```
MAIL_ENABLED=true
MAIL_HOST=smtp.xxx.com
MAIL_PASSWORD=your_email_password
MAIL_PORT=465
MAIL_SSL_ENABLE=true
MAIL_TYPE=smtp
MAIL_USERNAME=your_email
```

นอกจากนี้ กล่องจดหมายบางกล่องจำเป็นต้องเปิดใช้งานในพื้นหลังเพื่อใช้ smtp. สำหรับรายละเอียด คุณสามารถค้นหา xxx mailbox smtp tutorial.


## ปัญหาประสิทธิภาพการทำงานภายใต้การรัน macOS M1 docker?

## เอกสาร API อยู่ที่ไหน

คุณสามารถเข้าถึงเอกสาร API ได้โดยเริ่มต้นเซิร์ฟเวอร์ภายในเครื่อง:

1. ที่อยู่เอกสารสำหรับเซิร์ฟเวอร์ส่วนหลังคือ:http://localhost:8081/api/v1/doc.html

2. ที่อยู่เอกสารสำหรับเซิร์ฟเวอร์ห้องคือ:http://localhost:3333/nest/v1/docs

หากคุณสนใจอินเทอร์เฟซ API ของบริการคลาวด์ คุณสามารถเข้าถึงเอกสาร API ออนไลน์ได้โดยตรงที่: https://developers.apitable.com/api/introduction.

## จะตั้งค่าข้อ จำกัด ของปริมาณวิดเจ็ตในแดชบอร์ดได้อย่างไร? (30 โดยค่าเริ่มต้น)

ซึ่งสามารถทำได้โดยการตั้งค่าพารามิเตอร์ `DSB_WIDGET_MAX_COUNT` ในไฟล์ `.env`

## ฉันสามารถเพิ่มขีดจำกัดอัตราคำขอของ API ได้หรือไม่ (5 โดยค่าเริ่มต้น)

ในไฟล์ `.env.default` ของ `room-server` มีพารามิเตอร์สองตัวที่สามารถปรับความถี่ของคำขอได้:

1. คุณสามารถตั้งค่า `LIMIT_POINTS` และ `LIMIT_DURATION` เพื่อระบุจำนวนคำขอที่สามารถทำได้ในช่วงเวลาหนึ่งหน่วย. โดยที่ LIMIT_POINTS คือจำนวนครั้ง และ LIMIT_DURATION คือระยะเวลา วัดเป็นวินาที.

2. คุณสามารถตั้งค่าพารามิเตอร์ `LIMIT_WHITE_LIST` เพื่อกำหนดความถี่คำขอแยกต่างหากสำหรับผู้ใช้เฉพาะราย. ค่าของมันคือสตริง JSON และโครงสร้างสามารถอ้างถึง `Map<string, IBaseRateLimiter>`

## จะเพิ่มจำนวนระเบียนที่แทรกต่อการเรียก API ได้อย่างไร? (10 โดยค่าเริ่มต้น)

สามารถทำได้โดยการตั้งค่าพารามิเตอร์ `API_MAX_MODIFY_RECORD_COUNTS` ในไฟล์ `.env.default` ของ `room-server`


## จะอัพเกรดเป็นเวอร์ชั่นล่าสุดได้อย่างไร?


## จะเปลี่ยนพอร์ต 80 เริ่มต้นได้อย่างไร?
คุณสมบัติการกำหนดค่าในไฟล์ `.env` ยังสามารถแทนที่ได้ด้วยการระบุ env vars `NGINX_HTTP_PORT`

ยกตัวอย่างเช่น: จะถูกตั้งค่าเป็น NGINX_HTTP_PORT=8080