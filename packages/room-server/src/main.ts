import '@vikadata/i18n-lang';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Client } from '@sentry/types';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from 'app.module';
import { APPLICATION_NAME, GRPC_MAX_PACKAGE_SIZE } from './shared/common';
import { HttpResponseInterceptor } from './shared/interceptor';
import { GlobalExceptionFilter } from './shared/filters';
import { initHttpHook, initSwagger } from 'shared/adapters/adapters.init';
import { environment, isDevMode, isProdMode } from 'app.environment';
import { WINSTON_MODULE_NEST_PROVIDER } from 'shared/logger/winston.constants';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'fastify-helmet';
import { ValidationPipe } from 'shared/middleware/pipe/validation.pipe';
import fastifyMultipart from 'fastify-multipart';
import { FastifyZipkinPlugin } from './shared/helpers';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import { ZipkinService } from './shared/services/zipkin/zipkin.service';
import { ZIPKIN_MODULE_OPTIONS, ZIPKIN_MODULE_PROVIDER } from './shared/services/zipkin/zipkin.constants';
import { IZipkinModuleOptions } from './shared/services/zipkin/zipkin.interface';
import { TracingHandlerInterceptor } from './shared/interceptor/sentry.handlers.interceptor';
import { SentryTraces } from 'shared/helpers/sentry/sentry.traces.sampler';

/**
 * 启动入口
 */
async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ logger: isDevMode, bodyLimit: GRPC_MAX_PACKAGE_SIZE });
  fastifyAdapter.register(fastifyMultipart);
  // 将helmet直接在fastify中注册，避免和swagger冲突
  fastifyAdapter.register(helmet, {
    // 修改了 script-src 兼容swagger
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': [],
      },
    },
  });

  const nestApp = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

  const zipkinOptions = nestApp.get<IZipkinModuleOptions>(ZIPKIN_MODULE_OPTIONS);
  if (zipkinOptions.enabled && zipkinOptions.endpoint) {
    const zipkinService = nestApp.get<ZipkinService>(ZIPKIN_MODULE_PROVIDER);
    await nestApp.register(FastifyZipkinPlugin.fastifyZipkinPlugin, {
      serviceName: `${environment}-room-server`,
      port: Number(process.env.PORT),
      tracer: zipkinService.tracer,
    });
  }

  const logger = nestApp.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  nestApp.useLogger(logger);

  initSwagger(nestApp);
  initHttpHook(nestApp);

  const PORT = process.env.PORT || 3333;

  const configService = nestApp.get(ConfigService);

  const sentrySampleRate = configService.get<number>('sentry.tracesSampleRate', 0.2);
  const sentryDsn = process.env.SENTRY_DSN || configService.get<string>('sentry.dsn');

  Sentry.init({
    debug: isDevMode,
    // 开发模式下不上报异常
    enabled: Boolean(!isDevMode && sentryDsn),
    dsn: sentryDsn,
    environment: process.env.ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Mysql(),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: err => {
          if (err.name === 'SentryError') {
            console.log(err);
          } else {
            (Sentry.getCurrentHub().getClient<Client>() as Client).captureException(err);
            process.exit(1);
          }
        },
      }),
      new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
    ],
    tracesSampler: new SentryTraces(sentrySampleRate).tracesSampler(),
    ignoreErrors: [
      'ServerException',
      'ApiException'
    ]
  });

  // 如果需要启用「express」性能跟踪，放开注释
  // nestApp.use(Sentry.Handlers.requestHandler());

  // 全局异常处理
  nestApp.useGlobalFilters(new GlobalExceptionFilter(logger, nestApp.get<I18nService>(I18nService)));

  // 为每个传入请求创建性能跟踪
  nestApp.useGlobalInterceptors(new TracingHandlerInterceptor());

  // 全局注册拦截器(成功返回格式)
  nestApp.useGlobalInterceptors(new HttpResponseInterceptor());

  // 全局验证器,自定义参数异常的返回
  nestApp.useGlobalPipes(
    new ValidationPipe({
      // 提示参数字段
      enableErrorDetail: !isProdMode,
    }),
  );

  // 监听应用停止关闭事件
  nestApp.enableShutdownHooks();

  // 打印运行环境
  logger.log(`应用[${APPLICATION_NAME}]-运行环境[${environment}]`, 'Bootstrap');
  // grpc
  const grpcUrl = configService.get<string>('grpc.url');
  logger.log(`grpc服务url为[${grpcUrl}]`);
  nestApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: grpcUrl,
      // ['hero', 'hero2']
      package: ['grpc', 'vika.grpc'],
      // ['./hero/hero.proto', './hero/hero2.proto']
      protoPath: [join(__dirname, './proto/service.proto'), join(__dirname, 'proto/socket.service.proto')],
      // 100M
      maxSendMessageLength: GRPC_MAX_PACKAGE_SIZE,
      maxReceiveMessageLength: GRPC_MAX_PACKAGE_SIZE,
      loader: {
        json: true
      }
    },
  });
  await nestApp.startAllMicroservicesAsync();
  nestApp.enableShutdownHooks();
  // 监听端口
  await nestApp.listen(+PORT, '0.0.0.0');
  // 打印服务信息
  logger.log(`服务已经启动,请访问: [ ${await nestApp.getUrl()} ]`, 'Bootstrap');
}

bootstrap();
