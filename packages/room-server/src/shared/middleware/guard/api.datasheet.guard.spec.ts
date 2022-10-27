// import '@vikadata/i18n-lang';
// import { REQUEST } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { ApiException } from '../../exception';
import { ApiDatasheetGuard } from 'shared/middleware/guard/api.datasheet.guard';

describe('ApiDatasheetGuard', () => {
  let app;
  let guard: ApiDatasheetGuard;
  // let request;
  let context;
  let memberRepository: any;
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
    memberRepository = {
      selectSpaceIdsByUserId: jest.fn().mockReturnThis(),
    };
    guard = new ApiDatasheetGuard(memberRepository);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('datasheetId--null--should return error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          datasheetId: null,
        },
      });
      const error = ApiException.tipError('api_datasheet_not_exist');
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
    it('request datasheet null with error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: null,
      });
      const error = ApiException.tipError('api_datasheet_not_exist');
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
    it('request datasheet not in space error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: 'aaa',
        user: {
          spaceId: ['aa']
        },
        params: {
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError('api_datasheet_not_visible');
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
  });
});
