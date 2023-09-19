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

import { ApiTipConstant, CellFormatEnum, FieldType, getNewId, IAttacheField, ICellValue, IDPrefix, IReduxState, Reducers } from '@apitable/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { AttachmentField } from 'fusion/field/attachment.field';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { EnvConfigKey } from 'shared/common';
import { ApiException } from 'shared/exception';
import { IFieldValue, IOssConfig } from 'shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { IAssetDTO } from 'shared/services/rest/rest.interface';
import { RestService } from 'shared/services/rest/rest.service';

/* eslint-disable */
describe('AttachmentField', () => {
  let app: NestFastifyApplication;
  let fieldClass: AttachmentField;
  let field: IAttacheField;
  let oss: IOssConfig;
  let restService: RestService;
  let store: Store<IReduxState>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    restService = app.get<RestService>(RestService);
    const envConfigService = app.get(EnvConfigService);
    oss = envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    fieldClass = new AttachmentField(restService);
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Attachment',
      type: FieldType.Attachment,
      property: null,
    };
    store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validate', () => {
    it('null--should return null', async () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });

    it('Non array--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError(ApiTipConstant.api_param_attachment_array_type_error);

      const fieldValues: IFieldValue = {
        token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
        preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
        size: 5008519,
        height: 0,
        width: 0,
        name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
        mimeType: 'application/pdf',
      };
      expect(() => {
        fieldClass.validate(fieldValues, field);
      }).toThrow(error);
    });

    it('required parameter validation token--zh-CN--should throw not exists error', async () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_instance_attachment_token_error);

      const fieldValues: IFieldValue = [
        {
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        },
      ];
      expect(() => {
        fieldClass.validate(fieldValues, field);
      }).toThrow(error);
    });

    it('required parameter validation name--zh-CN--should throw ServerException', async () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_instance_attachment_name_error);

      const fieldValues: IFieldValue = [
        {
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          mimeType: 'application/pdf',
        },
      ];
      expect(() => {
        fieldClass.validate(fieldValues, field);
      }).toThrow(error);
    });

    it('token type validation[string]--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError(ApiTipConstant.api_param_attachment_token_type_error);
      expect(() => {
        fieldClass.validate(
          [
            {
              token: 2222,
              preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
              size: 5008519,
              height: 0,
              width: 0,
              name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
              mimeType: 'application/pdf',
            },
          ],
          field,
        );
      }).toThrow(error);
    });

    it('name type verification [string]--zh-CN--should throw type error', async () => {
      const error = ApiException.tipError(ApiTipConstant.api_param_attachment_name_type_error);
      const fieldValues = [
        {
          name: 2222,
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          mimeType: 'application/pdf',
        },
      ];
      expect(() => fieldClass.validate(fieldValues, field)).toThrow(error);
    });

    it('verification passed should return null', async () => {
      const fieldValues = [
        {
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        },
      ];
      expect(() => fieldClass.validate(fieldValues, field)).not.toThrow();
    });
  });

  describe('roTransform', () => {
    it('token value does not exist--should throw ServerException', async () => {
      jest.spyOn(restService, 'getAssetInfo').mockImplementationOnce(
        async (): Promise<IAssetDTO | undefined> => {
          return undefined;
        },
      );
      const error = ApiException.tipError(ApiTipConstant.api_param_attachment_not_exists);
      // The assertion for a promise must be returned.
      expect.assertions(1);

      const fieldValues: IFieldValue[] = [
        {
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ecdddddd',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        }
      ];
      try {
        await fieldClass.roTransform(fieldValues, field);
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
            height: undefined,
            token: '',
            width: 0,
            mimeType: 'application/pdf',
            bucket: 'QNY1',
            preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          };
        },
      );

      const fieldValues: IFieldValue[] = [
        {
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        },
      ];
      const data = await fieldClass.roTransform(fieldValues, field);

      expect(data![0].token).toBe('space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
      expect(data![0].preview).toBe('space/2020/06/20/166113199f5848e7884207c4b54d521f');
      expect(data![0].size).toBe(5008519);
      expect(data![0].id).toBeDefined();
      expect(data![0].height).toBe(undefined);
      expect(data![0].width).toBe(undefined);
      expect(data![0].name).toBe('Internet Media Industry: 2020 Weibo Animation White Paper.pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].bucket).toBe(oss.bucket);
    });

    it('pdf--should return without height/with but preview without host', async () => {
      jest.spyOn(restService, 'getAssetInfo').mockImplementationOnce(
        async (): Promise<IAssetDTO | undefined> => {
          return {
            // tslint:disable-next-line:no-empty
            size: 5008519,
            height: undefined,
            token: '',
            width: 0,
            mimeType: 'application/pdf',
            bucket: 'QNY1',
            preview: 'space/2020/09/22/11cacb59a7c647528011fe35164d3ef8',
          };
        },
      );

      const fieldValues: IFieldValue[] = [
        {
          id: 'atc1ZkTyvGMS3',
          name: 'Alibaba Java Development Manual (Huashan Edition).pdf',
          size: 1420182,
          mimeType: 'application/pdf',
          token: 'space/2020/09/22/9429338c768644f2b161a59cbfe18bdc',
          width: 0,
          height: 0,
          preview: 'https://s1.vika.cn/space/2020/09/22/11cacb59a7c647528011fe35164d3ef8',
          url: 'https://s1.vika.cn/space/2020/09/22/9429338c768644f2b161a59cbfe18bdc',
        },
      ];
      const data = await fieldClass.roTransform(fieldValues, field);

      expect(data![0].token).toBe('space/2020/09/22/9429338c768644f2b161a59cbfe18bdc');
      expect(data![0].preview).toBe('space/2020/09/22/11cacb59a7c647528011fe35164d3ef8');
      expect(data![0].size).toBe(5008519);
      expect(data![0].id).toBeDefined();
      expect(data![0].height).toBe(undefined);
      expect(data![0].width).toBe(undefined);
      expect(data![0].name).toBe('Alibaba Java Development Manual (Huashan Edition).pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].bucket).toBe(oss.bucket);
    });
  });

  describe('voTransform', () => {
    it('pdf--json--should return without height/with but preview', () => {
      const cellValue: ICellValue = [
        {
          id: getNewId(IDPrefix.File),
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          size: 5008519,
          bucket: oss.bucket,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        },
      ];
      // The assertion for a promise must be returned.source.host
      const data = fieldClass.voTransform(
        cellValue,
        field,
        { cellFormat: CellFormatEnum.JSON, store }
      );
      expect(data![0].token).toBe('space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
      expect(data![0].preview).toBe(oss.host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec?imageView2/0');
      expect(data![0].size).toBe(5008519);
      expect(data![0].height).toBe(0);
      expect(data![0].width).toBe(0);
      expect(data![0].name).toBe('Internet Media Industry: 2020 Weibo Animation White Paper.pdf');
      expect(data![0].mimeType).toBe('application/pdf');
      expect(data![0].url).toBe(oss.host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec');
    });

    it('pdf--string--should returns name（url）', () => {
      const cellValue: ICellValue = [
        {
          id: getNewId(IDPrefix.File),
          token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
          preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
          size: 5008519,
          bucket: oss.bucket,
          height: 0,
          width: 0,
          name: 'Internet Media Industry: 2020 Weibo Animation White Paper.pdf',
          mimeType: 'application/pdf',
        },
      ];
      // The assertion for a promise must be returned.
      expect(
        fieldClass.voTransform(
          cellValue,
          field,
          { cellFormat: CellFormatEnum.STRING, store },
        ),
      ).toBe('Internet Media Industry: 2020 Weibo Animation White Paper.pdf (https://s1.vika.cn/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec)');
    });

    it('image--json--should return json array', () => {
      const cellValue: ICellValue = [
        {
          id: getNewId(IDPrefix.File),
          token: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
          mimeType: 'image/jpeg',
          size: 7194,
          name: '9d4911932181f254433a86b05797f9a6 (1).jpeg',
          height: 478,
          width: 479,
          bucket: oss.bucket,
        }
      ];

      const data = fieldClass.voTransform(
        cellValue,
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
