---
title: 日志模块
hide_title: true
sidebar_label: 日志模块
---

## 使用

同步注册 LoggerModule

``` typescript

@Module({
  imports: [
    LoggerModule.forRoot({
      transports: [new transports.Console()],
    }),
  ]
})
export class AppModule {}

```

异步注册 LoggerModule

``` typescript

@Module({
  imports: [
     LoggerModule.forRootAsync({
        useFactory: async (config: ConfigService) => config.get('logger'),
        inject: [ConfigService]
    }),
  ]
})
export class AppModule {}

```

在构造函数中注入

``` typescript

import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'common/decorators';
import { Logger } from 'winston';

@Injectable()
export class AppService {

  constructor(
    @InjectLogger()
    public readonly logger: Logger
  ) { }

  getHello(): string {
    this.logger.info('Hello World');
    return 'Hello World!';
  }
}

```

在 nest 上下文中获取

``` typescript

import { WINSTON_MODULE_PROVIDER } from 'modules/logger/winston.constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_PROVIDER);

  const res = await app.listenAsync(3000);

  logger.info('logger');
  logger.info(res);
}
bootstrap();

```
