import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { CellFormatEnum, FieldType, getNewId, IAttacheField, ICellValue, IDPrefix, IReduxState, Reducers } from '@apitable/core';
import { AppModule } from 'app.module';
import { EnvConfigKey } from '../../shared/common';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { ApiException } from '../../shared/exception/api.exception';
import { IOssConfig } from '../../shared/interfaces';
import { IAssetDTO } from 'shared/services/rest/rest.interface';
import { RestService } from 'shared/services/rest/rest.service';
import { AttachmentField } from 'fusion/field/attachment.field';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';

/* eslint-disable */
describe('AttachmentField', () => {
  let app;
  let fieldClass: AttachmentField;
  let field: IAttacheField;
  let oss: IOssConfig;
  let restService: RestService;
  let store: Store<IReduxState>;
  beforeAll(async () => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    restService = app.get(RestService);
    const envConfigService = app.get(EnvConfigService);
    oss = envConfigService.getRoomConfig(EnvConfigKey.OSS);
    fieldClass = new AttachmentField(restService);
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '附件',
      type: FieldType.Attachment,
      property: null,
    };
    store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('validate', () => {
    it('null--should return null', async () => {
      expect(fieldClass.validate(null, field)).toBe(undefined);
    });

    it('非数组--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError('api_param_attachment_array_type_error');
      expect(() => {
        fieldClass.validate(
          {
            token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
            preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
            size: 5008519,
            height: 0,
            width: 0,
            name: '互联网传媒行业：2020微博动漫白皮书.pdf',
            mimeType: 'application/pdf',
          },
          field,
        );
      }).toThrow(error);
    });

    it('必传参数验证token--zh-CN--should throw not exists error', async () => {
      const error = ApiException.tipError('api_params_instance_attachment_token_error');
      expect(() => {
        fieldClass.validate(
          [
            {
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              name: '互联网传媒行业：2020微博动漫白皮书.pdf',
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      }).toThrow(error);
    });

    it('必传参数验证name--zh-CN--should throw ServerException', async () => {
      const error = ApiException.tipError('api_params_instance_attachment_name_error');
      expect(() => {
        fieldClass.validate(
          [
            {
              token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      }).toThrow(error);
    });

    it('token类型验证[string]--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError('api_param_attachment_token_type_error');
      expect(() => {
        fieldClass.validate(
          [
            {
              token: 2222,
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              name: '互联网传媒行业：2020微博动漫白皮书.pdf',
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      }).toThrow(error);
    });

    it('name类型验证[string]--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError('api_param_attachment_name_type_error');
      expect(() => {
        fieldClass.validate(
          [
            {
              name: 2222,
              token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      }).toThrow(error);
    });

    it('验证通过 should return null', async () => {
      expect(
        fieldClass.validate(
          [
            {
              token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              name: '互联网传媒行业：2020微博动漫白皮书.pdf',
              mimeType: 'application/pdf',
            },
          ],
          field,
        ),
      ).toBe(undefined);
    });
  });

  describe('roTransform', () => {
    it('token值不存在--should throw ServerException', async () => {
      jest.spyOn(restService, 'getAssetInfo').mockImplementationOnce(
        async (): Promise<IAssetDTO | undefined> => {
          return undefined;
        },
      );
      const error = ApiException.tipError('api_param_attachment_not_exists');
      // The assertion for a promise must be returned.
      expect.assertions(1);
      try {
        await fieldClass.roTransform(
          [
            {
              token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ecdddddd',
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              name: '互联网传媒行业：2020微博动漫白皮书.pdf',
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      } catch (e) {
        expect(e).toEqual(error);
      }
    });

    it('pdf--should return without height/with but preview', async () => {
      jest.spyOn(restService, 'getAssetInfo').mockImplementationOnce(
        async (): Promise<IAssetDTO | undefined> => {
          return {
            // tslint:disable-next-line:no-empty
            size: 5008519,
            height: null,
            token: '',
            width: 0,
            mimeType: 'application/pdf',
            bucket: 'QNY1',
            preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          };
        },
      );
      const data = await fieldClass.roTransform(
        [
          {
            token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
            preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
            size: 5008519,
            height: 0,
            width: 0,
            name: '互联网传媒行业：2020微博动漫白皮书.pdf',
            mimeType: 'application/pdf',
          },
        ],
        field,
      );
      expect(data![0].token).toBe('space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
      expect(data![0].preview).toBe('space/2020/06/20/166113199f5848e7884207c4b54d521f');
      expect(data![0].size).toBe(5008519);
      expect(data![0].id).toBeDefined();
      expect(data![0].height).toBe(undefined);
      expect(data![0].width).toBe(undefined);
      expect(data![0].name).toBe('互联网传媒行业：2020微博动漫白皮书.pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].bucket).toBe(oss.bucket);
    });

    it('pdf--should return without height/with but preview without host', async () => {
      jest.spyOn(restService, 'getAssetInfo').mockImplementationOnce(
        async (): Promise<IAssetDTO | undefined> => {
          return {
            // tslint:disable-next-line:no-empty
            size: 5008519,
            height: null,
            token: '',
            width: 0,
            mimeType: 'application/pdf',
            bucket: 'QNY1',
            preview: 'space/2020/09/22/11cacb59a7c647528011fe35164d3ef8',
          };
        },
      );
      const data = await fieldClass.roTransform(
        [
          {
            id: 'atc1ZkTyvGMS3',
            name: '阿里巴巴Java开发手册（华山版）.pdf',
            size: 1420182,
            mimeType: 'application/pdf',
            token: 'space/2020/09/22/9429338c768644f2b161a59cbfe18bdc',
            width: 0,
            height: 0,
            preview: 'https://s1.vika.cn/space/2020/09/22/11cacb59a7c647528011fe35164d3ef8',
            url: 'https://s1.vika.cn/space/2020/09/22/9429338c768644f2b161a59cbfe18bdc',
          },
        ],
        field,
      );
      expect(data![0].token).toBe('space/2020/09/22/9429338c768644f2b161a59cbfe18bdc');
      expect(data![0].preview).toBe('space/2020/09/22/11cacb59a7c647528011fe35164d3ef8');
      expect(data![0].size).toBe(5008519);
      expect(data![0].id).toBeDefined();
      expect(data![0].height).toBe(undefined);
      expect(data![0].width).toBe(undefined);
      expect(data![0].name).toBe('阿里巴巴Java开发手册（华山版）.pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].bucket).toBe(oss.bucket);
    });
  });

  describe('voTransform', () => {
    it('pdf--json--should return without height/with but preview', () => {
      // The assertion for a promise must be returned.source.host
      const data = fieldClass.voTransform(
        [
          {
            id: getNewId(IDPrefix.File),
            token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
            preview: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
            size: 5008519,
            bucket: oss.bucket,
            height: 0,
            width: 0,
            name: '互联网传媒行业：2020微博动漫白皮书.pdf',
            mimeType: 'application/pdf',
          },
        ] as ICellValue,
        field,
        { cellFormat: CellFormatEnum.JSON, store },
      );
      expect(data![0].token).toBe('space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
      expect(data![0].preview).toBe(oss.host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
      expect(data![0].size).toBe(5008519);
      expect(data![0].height).toBe(0);
      expect(data![0].width).toBe(0);
      expect(data![0].name).toBe('互联网传媒行业：2020微博动漫白皮书.pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].url).toBe(oss.host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
    });

    it('pdf--string--should returns name（url）', () => {
      // The assertion for a promise must be returned.
      expect(
        fieldClass.voTransform(
          [
            {
              id: getNewId(IDPrefix.File),
              token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              bucket: oss.bucket,
              height: 0,
              width: 0,
              name: '互联网传媒行业：2020微博动漫白皮书.pdf',
              mimeType: 'application/pdf',
            },
          ] as ICellValue,
          field,
          { cellFormat: CellFormatEnum.STRING, store },
        ),
      ).toBe('互联网传媒行业：2020微博动漫白皮书.pdf (https://s1.vika.cn/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec)');
    });

    it('image--json--should return json array', () => {
      const data = fieldClass.voTransform(
        [
          {
            id: getNewId(IDPrefix.File),
            token: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
            mimeType: 'image/jpeg',
            size: 7194,
            name: '9d4911932181f254433a86b05797f9a6 (1).jpeg',
            height: 478,
            width: 479,
            bucket: oss.bucket,
          },
        ] as ICellValue,
        field,
        { cellFormat: CellFormatEnum.JSON, store },
      );
      expect(data![0].token).toBe('space/2020/07/28/6fdc652231a8480398e302606ae28213');
      expect(data![0].url).toBe(oss.host + '/space/2020/07/28/6fdc652231a8480398e302606ae28213');
      expect(data![0].size).toBe(7194);
      expect(data![0].height).toBe(478);
      expect(data![0].width).toBe(479);
      expect(data![0].name).toBe('9d4911932181f254433a86b05797f9a6 (1).jpeg');
      expect(data![0].mimeType).toBe('image/jpeg');
    });
  });
});
