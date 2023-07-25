import { Test } from '@nestjs/testing';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { clearDatabase, clearRedis } from './test-util';
import { getConnection } from 'typeorm';
import { RedisService } from '@apitable/nestjs-redis';
import { AppModule } from 'app.module';
import { initFastify } from '../adapters/adapters.init';
import { GlobalExceptionFilter } from '../filters';
import { HttpResponseInterceptor } from '../interceptor';

export class NestTestEnvironment {
  get app(): NestFastifyApplication {
    return this._app;
  }

    private _app!: NestFastifyApplication;

    async setup() {
      jest.setTimeout(60000);
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const fastifyAdapter = await initFastify();

      this._app = moduleFixture.createNestApplication<NestFastifyApplication>(fastifyAdapter);

      const logger = this._app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
      this._app.useLogger(logger);

      const i18nService = this._app.get<I18nService>(I18nService);
      // Global Exception Handler
      this._app.useGlobalFilters(new GlobalExceptionFilter(i18nService));
      // app.useGlobalFilters(new GlobalExceptionFilter(logger));
      // Global Interceptor Handler(return standard response body if success)
      this._app.useGlobalInterceptors(new HttpResponseInterceptor());
      // Global Validator, return custom parameter validation error
      this._app.useGlobalPipes(new ValidationPipe());

      await this._app.init();
      await this._app.getHttpAdapter().getInstance().ready();
    }

    async teardown() {
      await this._app.close();
    }

    async reset() {
      await this.resetDatabase();
      await this.resetRedis();
    }

    async resetDatabase() {
      await clearDatabase(getConnection());
    }

    async resetRedis() {
      const redisService = this._app.get<RedisService>(RedisService);
      await clearRedis(redisService);
    }
}