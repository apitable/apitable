import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { expect } from 'chai';
import { AppModule } from 'app.module';
import { initHttpHook } from 'shared/adapters/adapters.init';
import { GlobalExceptionFilter } from '../src/shared/filters';
import { HttpResponseInterceptor } from '../src/shared/interceptor';
import { ValidationPipe } from 'shared/middleware/pipe/validation.pipe';
import { LoggerModule } from 'shared/logger/winston.module';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'shared/logger/winston.constants';
import fastifyMultipart from 'fastify-multipart';
import { I18nService } from 'nestjs-i18n';

export function successExpect(response: any, result: any) {
  expect(response.statusCode).to.be.eql(200);
  expect(result.code).to.be.eql(200);
  expect(result.message).to.be.eql('SUCCESS');
  expect(result.success).to.be.eql(true);
}

export function createSuccessExpect(response: any, result: any) {
  expect(response.statusCode).to.be.eql(201);
  expect(result.code).to.be.eql(200);
  expect(result.message).to.be.eql('SUCCESS');
  expect(result.success).to.be.eql(true);
}

export function getDefaultHeader(app) {
  return {
    Authorization: 'Bearer usk8qo1Dk9PbecBlaqFIvbb',
  };
}

export async function initNestTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule, LoggerModule],
  }).compile();
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fastifyMultipart);
  const app = module.createNestApplication<NestFastifyApplication>(fastifyAdapter);
  const logger = module.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  initHttpHook(app);
  // Global Exception Handler
  app.useGlobalFilters(new GlobalExceptionFilter(logger, app.get<I18nService>(I18nService)));
  // app.useGlobalFilters(new GlobalExceptionFilter(logger));
  // Global Interceptor Handler(return standard response body if success)
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  // Global Validator, return custom parameter validation error
  app.useGlobalPipes(new ValidationPipe({ enableErrorDetail: true }));
  await app.init();
  await app
    .getHttpAdapter()
    .getInstance()
    .ready();
  return app;
}
