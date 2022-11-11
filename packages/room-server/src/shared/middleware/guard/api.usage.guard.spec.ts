import '@vikadata/i18n-lang';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { ApiException, CommonException, ServerException } from '../../exception';
import { WINSTON_MODULE_PROVIDER } from 'shared/logger/winston.constants';
import { RestService } from 'shared/services/rest/rest.service';
import { ApiUsageGuard } from './api.usage.guard';
import { ApiTipConstant } from '@apitable/core';

describe('ApiUsageGuard', () => {
  let app;
  let guard: ApiUsageGuard;
  let logger;
  let context;
  let restService;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    logger = app.resolve(WINSTON_MODULE_PROVIDER);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    restService = app.get(RestService);
    guard = new ApiUsageGuard(logger, restService);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('usage--call backend error--should return error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): Promise<string[]> => {
          throw new ServerException(CommonException.SERVER_ERROR);
        },
      );
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_server_error));
      });
    });
    it('usage not isAllowOverLimit throws an error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): any => {
          return {
            data: {
              isAllowOverLimit: false,
              maxApiUsageCount:2,
              apiUsageUsedCount: 4
            }
          };
        },
      );
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_forbidden_because_of_usage));
      });
    });
    it('java api not response throws an error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): any => {
          return null;
        },
      );
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_forbidden));
      });
    });
  });
});
