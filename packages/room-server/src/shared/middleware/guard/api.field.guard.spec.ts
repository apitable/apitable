import { ApiTipConstant } from '@apitable/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import '@vikadata/i18n-lang';
import { AppModule } from 'app.module';
import { ApiException } from '../../exception';
import { ApiFieldGuard } from './api.field.guard';

describe('ApiDatasheetGuard', () => {
  let app;
  let guard: ApiFieldGuard;
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
    guard = new ApiFieldGuard(memberRepository);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('missing spaceId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          datasheetId: 'abc'
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_params_instance_space_id_error);
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('missing datasheetId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          spaceId: 'abc',
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('invalid datasheetId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: null,
        params: {
          spaceId: 'bbb',
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('datasheetId is not in space, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: { spaceId: 'aaa' },
        user: {
          id: 'dafad',
        },
        params: {
          spaceId: 'bbb',
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('do not have permission to visit space, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: 'aaa',
        user: {
          id: 'abadf',
        },
        params: {
          spaceId: 'aaa',
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError(ApiTipConstant.api_forbidden_because_of_not_in_space);
      return guard.canActivate(context ).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
  });
});
