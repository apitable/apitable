// import '@vikadata/i18n-lang';
// import { REQUEST } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { ApiException } from '../../exception';
import { ApiAuthGuard } from './api.auth.guard';

describe('ApiAuthGuard', () => {
  let app;
  let guard: ApiAuthGuard;
  // let request;
  let context;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    // request = app.resolve(REQUEST);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    guard = new ApiAuthGuard();
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('request user null error', () => {
      const error = ApiException.tipError('api_unauthorized');
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        user: null,
      });
      try {
        guard.canActivate(context);
      }catch (e) {
        expect(e).toStrictEqual(error);
      }
    });
    it('request user not null with true', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        user: 'aaa',
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
