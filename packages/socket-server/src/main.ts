import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { initLogger, initRedisIoAdapter } from './adapter/adapters.init';
import { GatewayConstants } from './constants/gateway.constants';
import { RuntimeExceptionFilter } from './filter/runtime-exception.filter';
import { isDev, logger } from './common/helper';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SocketConstants } from './constants/socket-constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initRedisIoAdapter(app);
  initLogger(app);

  Sentry.init({
    debug: isDev(),
    // 开发模式下不上报异常
    enabled: Boolean(!isDev() && process.env.SENTRY_DSN),
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: err => {
          if (err.name === 'SentryError') {
            logger('ApplicationContext').error(err);
          } else {
            Sentry.captureException(err);
            process.exit(1);
          }
        },
      }),
    ],
  });

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
  app.useGlobalFilters(new RuntimeExceptionFilter());
  logger('ApplicationContext').log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
