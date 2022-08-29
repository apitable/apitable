# vikadata

vika维格表主工程，企业版&SaaS版

[![Gitpod开发环境:master](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/vikadata/vikadata)

## Contributors

<a href="https://github.com/mr-kelly"><img src="https://avatars.githubusercontent.com/u/520852?v=4" title="mr-kelly<kelly@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/JailBreakC"><img src="https://avatars.githubusercontent.com/u/7326583?v=4" title="陈加贝<chenjiabei@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/JaneSu"><img src="https://avatars.githubusercontent.com/u/20908447?v=4" title="苏简<https://github.com/JaneSu>" width="80" height="80"></a> 
<a href="https://github.com/ChiuMungZitAlexander"><img src="https://avatars.githubusercontent.com/u/22234622?v=4" title="AlexanderZhao<zhaomengzhe@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/alolonghun"><img src="https://avatars.githubusercontent.com/u/23622592?v=4" title="SkyHuang<huangchangpeng@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/Jeremy-lxy"><img src="https://avatars.githubusercontent.com/u/105105681?v=4" title="Jeremy-lxy<lixueyuan@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/laboonly"><img src="https://avatars.githubusercontent.com/u/12252796?v=4" title="刘毅<liuyi@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/yort-feng"><img src="https://avatars.githubusercontent.com/u/7292727?v=4" title="Troy<fengjun@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/xieyuheng"><img src="https://avatars.githubusercontent.com/u/4354888?v=4" title="谢宇恒<xieyuheng@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/wangkailang"><img src="https://avatars.githubusercontent.com/u/6942517?v=4" title="王开朗<wangkailang@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/F-star"><img src="https://avatars.githubusercontent.com/u/18698939?v=4" title="黄浩<huanghao@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/MrWangQAQ"><img src="https://avatars.githubusercontent.com/u/37397984?v=4" title="Boris<wangbo@vikadata.com>" width="80" height="80"></a>
<a href="https://github.com/mayneyao"><img src="https://avatars.githubusercontent.com/u/6588202?v=4" title="Mayne<yaomingyang@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/ChambersChan"><img src="https://avatars.githubusercontent.com/u/32906036?v=4" title="Chambers<chenbochao@vikadata.com>" width="80" height="80"></a> 
<a href="https://github.com/STMU1320"><img src="https://avatars.githubusercontent.com/u/8119530?v=4" title="张松<zhangsong@vikadata.com>" width="80" height="80"></a> 

## 一键云端开发环境

点击下面这个按钮，立刻体验云端开发环境：

[![Gitpod开发环境:master](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/vikadata/datasheet)


打开的在线VSCode界面，下方会有两个Terminal，左边的程序运行状态，右边是可自由操作的命令行。

你可以在本地VSCode远程打开这个开发环境进行工作。

默认打开的是master分支的开发环境，如果你需要针对自己的分支，请自行使用网址：

```
https://gitpod.io/#<分支链接>
```

常用分支的开发环境：

- [master开发环境](https://gitpod.io/#https://github.com/vikadata/datasheet)
- [integration开发环境](https://gitpod.io/#https://github.com/vikadata/datasheet/tree/integration)


使用Github账号<devops@vikadata.com>进入Gitpod，将获得无限开发环境时间。

参考配置文件[.gitpod.yml](./.gitpod.yml)，能了解到环境启动用到的命令。

## 本地启动开发环境

1. `yarn install` 后，打包 i18n-lang、core、icons、components、widget-sdk、widget 作为 datasheet 启动依赖：

  ```bash
  yarn build:dst:pre
  ```

2. 启动 web 端项目 datasheet：

  ```bash
  yarn sd
  # 或使用远程服务器
  yarn sd:r
  ```

> 注意⚠️：如果设备是 macOS M1 芯片，需要修改控制台为 rosetta 打开方式（访达 => 应用程序 => 选择控制台程序并双击 => 打开「显示简介」 => 选择 「使用 Rosetta 打开」），然后安装相关依赖再启动开发环境。

### 环境依赖

> * git version > 2.16.3
> * node version = 遵循 package.json 指定版本
> * yarn version = 项目自带版本
> * python3 > 3.6 (可选)

可以使用 [nvm](https://github.com/nvm-sh/nvm) 管理 node 版本，当 shell 的工作目录位于本仓库的任何目录下时，运行 `nvm use` 命令即可在本次 shell 会话中将 node 切换到仓库指定的版本。也可以安装 shell 插件自动运行 `nvm use`，例如 zsh 可以通过 oh my zsh 安装 [nvm](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/nvm).

## 项目介绍

vikadata 大前端使用 [monorepo](https://en.wikipedia.org/wiki/Monorepo) 方式管理多个包:
### 启动 script
在项目根目录中输入 `make` 可以展示所有可执行的脚本

### packages 介绍：
* i18n-lang
* core
* datasheet
* room-server
* components
* icons
* widget-sdk
* cypress

### i18n-lang

国际化语言包。引入包时，会将语言包全量暴露到全局中。

### 暗黑主题

支持暗黑主题，datasheet 前端工程样式 less 采用 css variables 支持，修改样式时注意不要直接使用颜色 HEX 值，而是使用颜色变量。组件库默认已经支持暗黑主题，入口文件或 ReactDOM.render 组件使用 ThemeProvider 即可。特殊情况如 js 场景可以使用组件库暴露的 colors 对象规范使用颜色。

### core

共享代码逻辑，封装了底层数据操作方法、数据请求方法，可以运行在 browser & node。

### datasheet

数据表格 web 端项目
关于请求地址路由，详情请查看 setup_proxy.js 文件。

> /room 路由到 room-server
> /notification 路由到通知中心
> /api 路由到服务端地址
> /fusion 路由到 fusion api 平台

### room-server

nodejs 项目，用于处理长链消息、协同 OT 逻辑。承载 /fusion & /datasheet 相关请求

### widget-sdk

独立小组件 SDK，给第三方开发者进行小组提供工具包和运行环境

### components

通用组件库

+ 通用基础组件
+ 需要开源的业务组件，第三方开发小组件 block 使用

### icons 

svg 组件化

从维格表 icon 表，同步 icon 信息。（需要 design 仓库和 datasheet 同级）

```
# 安装 python3 依赖
sudo pip3 install -r requirements.txt

yarn sync:icons
```

build 包
```
yarn build:icons
```

### cypress
e2e 测试目录，我们使用 cypress 框架来进行 e2e 测试保障

### 编译成可执行文件
用于私有化部署代码保护
```
yarn global add pkg
```
##### macos环境
```
pkg . --targets macos-x64 --output room-server
```
##### 容器环境
```
pkg . --targets alpine-x64 --output room-server
```
##### docker 部署
```dockerfile
# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
FROM node:16.15.0-alpine3.15
WORKDIR /home/vikadata
COPY room-server /home/vikadata/
EXPOSE 3333
CMD ["/home/vikadata/room-server"]
```


## 业务配置表（makeconfig）

在内网空间中，有 [云配置](https://integration.vika.ltd/workbench/fodeTKml3j4TD)  目录 里面放满了各种各样的配置表；

我们将这个作为我们的配置管理工具，并自动生成 JSON 格式。

执行命令，生成业务配置表：

```shell
make conf
```

之后，strings.auto.json 文案相关配置，就会存放到 `/package/i18n-lang/src/config/`，system_config.auto.json 这些 JSON 配置表则放到 `/packages/core/src/config/` 中。

如果想来了解业务配置表 `make conf` 的细节，可以查看 [SystemConfig 系统配置生成器介绍](scripts/system_config/README.md)。

API Key 为公用的 dev@vikadata.com	维格表 API TOKEN 专用号

### 配置代码自动生成

**TypeScript:**

上面的 `make conf` 命令，默认会生成 JSON 配置和 TypeScript 代码，自动化生成的 TypeScript 代码已经放置到 `/packages/core/src/config/system_config.interface.ts` 中，直接跟已有代码整合。

**Java:**

因为Java代码不是同一个工程，因此，需要指定 Java 工程根目录，进行 Java 代码的放置

比如，本机在前端工程根目录下，执行如下命令：

```shell
export VIKA_SERVER_PATH=$PWD/../vikadata-master && npm run scripts:makeconfig-javacode
```

之后，所有的 Java 代码就会在 `$VIKA_SERVER_PATH/vikadata-service/vikadata-service-api/src/main/java/com/vikadata/api/config/` 中进行生成了。

并且会把 *.json 相关的配置表，也带到了 `$VIKA_SERVER_PATH/vikadata-service/vikadata-service-api/src/main/resources/` 中。

## 多语言（i18n）

多语言基于业务配置表的里的 `config.strings` 表。  执行以上makeconfig 后，会从 strings 表导出完整的字符串。

### 前端代码用法

要在前端使用多语言化，用法：

```typescript
import { t, Strings } from '@vikadata/core';

// 传入 key，t 函数会在一个对象里找到对应文案，如果找不到，就会默认使用这个 key
console.log(t('new_datasheet'));
// t(Strings.new_datasheet) 返回值为 'new_datasheet'，下面这种写法是为了兼容旧写法
console.log(t(Strings.new_datasheet));
console.log(t(Strings.something, '参数1', '参数2')); // String.format字符串格式化模式
```

参数除了使用纯字符串之外，还可以借助 TComponent 传入 react 组件作为参数
```tsx
import { TComponent } from 'pc/components/common/t_component';
<TComponent
  tkey={t(Strings.hello_world)}
  params={{
    floor: <span className={styles.bold}>{t(Strings.grass)}</span>,
  }}
/>
```

### 浏览器语言自动发现（未落地）

用户在进入浏览器的时候，`Detector` 会判断用户的语言：

1. cookie (set cookie vika-i18n=LANGUAGE)
2. localStorage (set key vika-i18n=LANGUAGE)
3. navigator (set browser language)
4. querystring (append ?lang=LANGUAGE to URL)
5. htmlTag (add html language tag <html lang="LANGUAGE" ...)
6. path (http://my.site.com/LANGUAGE)
7. subdomain (http://LANGUAGE.site.com)

本地调试时，你可以通过在网址后方加上 `?lang=en-US` 来测试英文版。

语言符列表参考：[地址](https://www.iana.org/assignments/language-tags/language-tags.xhtml)

### 常见翻译工作流程

1. strings 表中，添加这个字段:  「 something   一些东西 」;
2. `make conf` 配置+代码；
3. 代码中植入代码 `t(Strings.something)`。

## Bug 监控

我们使用 Sentry 平台来记录、分析 bug 信息。代码的 sourceMap 会传输到 Sentry 上，在平台上可以统计到 bug 的上下文信息。https://sentry.vika.ltd 使用 ldap 账号登录
有一些预制筛选项需要重点关注，比如【页面崩溃】类的报错是致命伤，当持续出现时，需要紧急响应。

### 监控原理

Sentry 会监听全局 error，包括网络 error，script error 等，记录错误栈以及控制台 console 上下文。
同时，我们在 ErrorBoundary 组件中对 React 的 componentDidCatch 事件进行了监听。上报主动上报所有 react crash 的错误堆栈。

### 如何自定义 bug

除了自动监控之外，有时候代码逻辑中需要主动的上报 bug，这个时候可以使用自定义发送能力。
有时候我们需要特别的关注一段代码逻辑是不是会出错，这时候可以主动的去发送 Error 信息。

Sentry 本身提供了主动上报的 API：

```js
// @error 错误对象，可以是 catch 到的 error 对象，也可以是自己 new Error 的对象
// @config: { extra: object } extra 可以记录额外的自定义记录，可以选择性的上传对 debug 有帮助的任何格式信息
Sentry.captureException(error, {
  extra: {
    info,
  },
});
```

因为 Sentry 模块在 core 工程中并没有引入，所以上面的方法有时候不能直接使用，为了解决这个问题，
我们在这个基础上面封装了一层，统一使用 Player 模块，通过事件的形式上报 bug。

```js
Player.doTrigger(Hooks.app_error_logger, {
  error: new Error('这里发生了一条错误，我需要主动上报'),
  metaData: { more: '这个问题可能和浏览器版本有关' },
});
```

上面的代码可以在任何模块中调用。该事件的响应处理在 event_bindings.ts 文件中可以找到。

# 私有化部署模式的开发和调试
## 开发
> 注意事项，所有代码逻辑都应该兼容私有化部署和云部署的情况，只是通过读取配置来区分，不在代码分支上作区分。所以为私有化部署写的代码逻辑要能够安全的合并到主分支
> 私有化部署模式下拉取的 config 配置文件会影响到打包结果，将代码合并到主分支之前，需要重新执行 make config 覆盖掉配置文件

除了下面的命令之外，其余的开发过程和正常无区别。
1. yarn scripts:makeconfig:private
    * 通过这个形式拉取的 config 会注入 Settings.deploy_mode=private 通过这个配置，代码里可以区分是否是私有化部署。
2. yarn build:dst:pre
    * 构建依赖，这个和普通开发没区别
3. yarn sd:private
    * 这个命令会往环境变量里注入 REACT_APP_DEPLOYMENT_MODELS=PRIVATE 这个环境变量在前端代码里可以访问

私有化模式下，不允许访问任何公网资源，所有涉及到第三方云服务、写死公网 CDN 地址的情况都要针对性做处理

## 资源引用原则
### 域名禁止写死
私有化部署有自定义域名，所以在代码中尽量使用缺省的域名配置，或者动态进行域名拼接
### 禁止外部请求
一个严格的私有化部署环境，是不允许发起任何除主域名之外的第三方请求的（无法访问外网），这不仅是从网络环境考虑，也是处于私有化安全角度，禁止未经允许的情况下向外部发送数据。这要求我们在代码中不能使用第三方提供的静态资源地址，包括脚本、图片等。如果涉及到第三方 SDK 这种一定要使用的，则需要在私有化环境中主动屏蔽请求，防止出现请求失败。
### 工具方法
有时候需要对私有化环境进行特殊判断，比如屏蔽掉第三方登录，代码中有 `isPrivateDeployment()` 工具方法来判断是否处于私有化构建环境。

