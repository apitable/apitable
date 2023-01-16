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

import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { expect } from 'chai';
import { AppModule } from 'app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { initHttpHook } from 'shared/adapters/adapters.init';
import { GlobalExceptionFilter } from '../src/shared/filters';
import { HttpResponseInterceptor } from '../src/shared/interceptor';
import { LoggerService, ValidationPipe } from '@nestjs/common';
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

export function getDefaultHeader() {
  return {
    Authorization: process.env.BEARER_TOKEN,
  };
}

export async function initNestTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule, WinstonModule],
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
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  await app
    .getHttpAdapter()
    .getInstance()
    .ready();
  return app;
}
