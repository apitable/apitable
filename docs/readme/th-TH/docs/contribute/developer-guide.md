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
# install rust toolchain
curl -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source "$HOME/.cargo/env"
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



## จะกำหนดค่าเซิร์ฟเวอร์ SMTP ได้อย่างไร?

ตามค่าเริ่มต้น APITable จะไม่กำหนดค่าเซิร์ฟเวอร์ SMTP ซึ่งหมายความว่าคุณไม่สามารถเชิญผู้ใช้ได้เนื่องจากต้องใช้คุณลักษณะการส่งอีเมล

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


## ปัญหาประสิทธิภาพการทำงานภายใต้การรัน macOS M1 docker?

## เอกสาร API อยู่ที่ไหน

You can access the API documentation by starting a local server:

1. ที่อยู่เอกสารสำหรับเซิร์ฟเวอร์ส่วนหลังคือ:http://localhost:8081/api/v1/doc.html

2. ที่อยู่เอกสารสำหรับเซิร์ฟเวอร์ห้องคือ:http://localhost:3333/nest/v1/docs

If you are interested in cloud service API interfaces, you can also directly access the online API documentation at https://developers.apitable.com/api/introduction.

## จะตั้งค่าข้อ จำกัด ของปริมาณวิดเจ็ตในแดชบอร์ดได้อย่างไร? (30 โดยค่าเริ่มต้น)

This can be achieved by setting the `DSB_WIDGET_MAX_COUNT` parameter in the `.env` file.

## ฉันสามารถเพิ่มขีดจำกัดอัตราคำขอของ API ได้หรือไม่ (5 โดยค่าเริ่มต้น)

In the `.env.default` file of `room-server`, there are two parameters that can adjust request frequency:

1. คุณสามารถตั้งค่า `LIMIT_POINTS` และ `LIMIT_DURATION` เพื่อระบุจำนวนคำขอที่สามารถทำได้ในช่วงเวลาหนึ่งหน่วย. โดยที่ LIMIT_POINTS คือจำนวนครั้ง และ LIMIT_DURATION คือระยะเวลา วัดเป็นวินาที.

2. คุณสามารถตั้งค่าพารามิเตอร์ `LIMIT_WHITE_LIST` เพื่อกำหนดความถี่คำขอแยกต่างหากสำหรับผู้ใช้เฉพาะราย. ค่าของมันคือสตริง JSON และโครงสร้างสามารถอ้างถึง `Map<string, IBaseRateLimiter>`

## จะเพิ่มจำนวนระเบียนที่แทรกต่อการเรียก API ได้อย่างไร? (10 โดยค่าเริ่มต้น)

This can be achieved by setting the `API_MAX_MODIFY_RECORD_COUNTS` parameter in the `.env.default` file of `room-server`.


## จะอัพเกรดเป็นเวอร์ชั่นล่าสุดได้อย่างไร?


## จะเปลี่ยนพอร์ต 80 เริ่มต้นได้อย่างไร?
Configuration properties in  the `.env` file can also be overridden  by specifying them env vars `NGINX_HTTP_PORT`

For example. It would be set as NGINX_HTTP_PORT=8080