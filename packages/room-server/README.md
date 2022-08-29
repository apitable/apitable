# Room Server

## 描述

基于 [Nest](https://github.com/nestjs/nest) 框架的 TypeScript 服务端工程

## 学习资料

> * [awesome-nestjs](https://github.com/juliandavidmr/awesome-nestjs)

## Dependencies

> * [mysql](https://github.com/mysqljs/mysql) mysql客户端
> * [typeorm](https://github.com/typeorm/typeorm) 数据库对象存储框架
> * [redis](https://github.com/luin/ioredis) redis客户端
> * [redis-lock](https://github.com/errorception/redis-lock) redis key lock
> * [rxjs](https://github.com/ReactiveX/RxJS) JavaScript响应式编程
> * [socket.io-client](https://github.com/socketio/socket.io) socket.io for nodejs 客户端
> * [socket.io-redis](https://github.com/socketio/socket.io-redis) socket.io for redis 客户端
> * [class-transformer](https://github.com/typestack/class-transformer) JSON转对象，搭配reflect-metadata一起使用
> * [class-validator](https://github.com/typestack/class-validator) 验证框架
> * [rimraf](https://github.com/isaacs/rimraf) The UNIX command rm -rf for nodejs
> * [winston](https://github.com/winstonjs/winston) log framework for nodejs

## Installation

```bash
yarn install
```

## Running the app

```bash

# watch mode
$ yarn start:room-server

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 环境变量

部署环境：
`process.env.NODE_ENV`
enum: 'development' | 'production'

## JAVA 服务 api 地址

`process.env.HTTP_SERVER_HOST`
default: <http://vbs-integration.vika.ltd/>

## redis 配置

redis 端口
`process.env.REDIS_PORT`

redis 密码
`process.env.REDIS_PASS`

redis db
`process.env.REDIS_DB`

## 服务暴露端口

`process.env.ROOM_PORT`
default: 3333

## Logging Framework

> * [winston](https://github.com/winstonjs/winston)
> * [bunyan](https://github.com/trentm/node-bunyan)
> * [log4js](https://github.com/log4js-node/log4js-node)
> * [nestjs-Logger](https://docs.nestjs.com/techniques/logger)
