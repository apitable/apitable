/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { disableHSTS, environment, isDevMode } from 'app.environment';
import { AppModule } from 'app.module';
import { useContainer } from 'class-validator';
import helmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import { HelmetOptions } from 'helmet';
import * as immer from 'immer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { initHttpHook, initRedisIoAdapter, initRoomGrpc, initSentry, initSocketGrpc, initSwagger } from 'shared/adapters/adapters.init';
import { GRPC_MAX_PACKAGE_SIZE } from 'shared/common';
import { APPLICATION_NAME, BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { GlobalExceptionFilter } from 'shared/filters';
import { FastifyZipkinPlugin } from 'shared/helpers';
import { HttpResponseInterceptor } from 'shared/interceptor';
import { TracingHandlerInterceptor } from 'shared/interceptor/sentry.handlers.interceptor';
import { ZIPKIN_MODULE_OPTIONS, ZIPKIN_MODULE_PROVIDER } from 'shared/services/zipkin/zipkin.constants';
import { IZipkinModuleOptions } from 'shared/services/zipkin/zipkin.interface';
import { ZipkinService } from 'shared/services/zipkin/zipkin.service';

/**
 * entrance method
 */
async function bootstrap() {
  immer.setAutoFreeze(false);

  const fastifyAdapter = new FastifyAdapter({ logger: isDevMode, bodyLimit: GRPC_MAX_PACKAGE_SIZE });
  fastifyAdapter.register(fastifyMultipart);
  // registe helmet in fastify to avoid conflict with swagger
  let helmetOptions: HelmetOptions = {
    // update script-src to be compatible with swagger
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
  };
  if (disableHSTS) {
    helmetOptions = { ...helmetOptions, hsts: false };
  }
  fastifyAdapter.register(helmet, helmetOptions);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

  const zipkinOptions = app.get<IZipkinModuleOptions>(ZIPKIN_MODULE_OPTIONS);
  if (zipkinOptions.enabled && zipkinOptions.endpoint) {
    const zipkinService = app.get<ZipkinService>(ZIPKIN_MODULE_PROVIDER);
    await app.register(FastifyZipkinPlugin.fastifyZipkinPlugin, {
      serviceName: `${environment}-room-server`,
      port: Number(process.env.PORT),
      tracer: zipkinService.tracer,
    });
  }

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  initRedisIoAdapter(app);
  initSwagger(app);
  initHttpHook(app);
  initSentry(app);

  // express performance traces
  // app.use(Sentry.Handlers.requestHandler());

  // global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(app.get<I18nService>(I18nService)));

  // tracing all the requests by sentry
  app.useGlobalInterceptors(new TracingHandlerInterceptor());

  // global intercept with standard format
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  // global pipes for custom validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // enable shutdown hooks
  app.enableShutdownHooks();

  // grpc
  initRoomGrpc(logger, app);
  initSocketGrpc(logger, app);

  await app.startAllMicroservices();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // listening port
  await app.listen(BootstrapConstants.SERVER_PORT, '0.0.0.0');

  // print running environment
  logger.log(`Application[${APPLICATION_NAME}]-Env[${environment}]`, 'Bootstrap');
  // print server info
  logger.log(`The service is running, please visit it: [ ${await app.getUrl()} ]`, 'Bootstrap');
}

bootstrap();