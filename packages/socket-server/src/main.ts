import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as Sentry from '@sentry/node';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { instance } from 'src/socket/constants/logger.constants';
import { AppModule } from './app.module';
import { initRedisIoAdapter } from './socket/adapter/adapters.init';
import { isDev } from './socket/common/helper';
import { GatewayConstants } from './socket/constants/gateway.constants';
import { SocketConstants } from './socket/constants/socket-constants';
import { RuntimeExceptionFilter } from './socket/filter/runtime-exception.filter';

const initSentry = (): void => {
  Sentry.init({
    debug: isDev(),
    enabled: Boolean(!isDev() && process.env.SENTRY_DSN),
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: err => {
          if (err.name === 'SentryError') {
            // logger('ApplicationContext').error(err);
            console.error(err);
          } else {
            Sentry.captureException(err);
            process.exit(1);

          }
        },
      }),
    ],
  });
};

async function bootstrap() {
  const logger = new Logger('ApplicationContext');

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance })
  });

  initRedisIoAdapter(app);

  initSentry();

  // global exception handling
  app.useGlobalFilters(new RuntimeExceptionFilter());

  // app.enableCors({
  //   origin: true,
  //   methods: ['GET', 'OPTIONS'],
  //   allowedHeaders: ['X-Requested-With', 'Access-Control-Allow-Origin', 'Cookie', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
  //   credentials: true,
  // });

  app.enableShutdownHooks();
  app.setGlobalPrefix('socket');
  // grpc
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: GatewayConstants.GRPC_URL,
      package: GatewayConstants.GRPC_PACKAGE,
      // 10M
      maxSendMessageLength: SocketConstants.GRPC_OPTIONS.maxSendMessageLength,
      maxReceiveMessageLength: SocketConstants.GRPC_OPTIONS.maxReceiveMessageLength,
      protoPath: [join(__dirname, './grpc/proto/changeset.service.proto')],
      loader: {
        json: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(GatewayConstants.API_PORT);

  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
