---
title: Logging Module
hide_title: true
sidebar_label: Logging Module
---

## Usage

Register LoggerModule synchronously:

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

Register LoggerModule asynchronously:

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

Inject into the constructor:

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

Obtain the logger from a Nestjs App instance:

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
