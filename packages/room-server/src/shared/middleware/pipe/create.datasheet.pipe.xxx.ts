
// import '@vikadata/i18n-lang';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ApiException } from '../../exception/api.exception';
import { CreateDatasheetPipe } from './create.datasheet.pipe';
import { REQUEST } from '@nestjs/core';
import { DatasheetFieldCreateRo } from '../../../fusion/ros/datasheet.field.create.ro';
import { DatasheetCreateRo } from '../../../fusion/ros/datasheet.create.ro';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

describe('CreateDatasheetPipe', () => {
  let app;
  let pipe: CreateDatasheetPipe;
  let request;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    request = app.resolve(REQUEST);
    pipe = new CreateDatasheetPipe(request);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('transform', () => {
    it('name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'name', value: 100 });
      expect(() => {
        const name = '表格fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const ro: DatasheetCreateRo = new DatasheetCreateRo(name, '');
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('description is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'description', value: 500 });
      expect(() => {
        const content = '表格fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        let desc = content;
        for(let i = 1; i < 5; i++){
          desc = `${content}${desc}`;
        }
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', desc);
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('missing field name, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue, { property: 'field.name' });
      const field: DatasheetFieldCreateRo = {
        name: '',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [field];
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('field name is not unique, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsMustUnique, { property: 'field.name' });
      const field: DatasheetFieldCreateRo = {
        name: 'abc',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [field, field];
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('fields is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsMaxCountError, { property: 'fields', value: 200 });
      const field: DatasheetFieldCreateRo = {
        name: 'abc',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [];
      for(let i = 1; i < 202; i++){
        const name = `abc${i}`;
        fields.push({ name, type: field.type });
      }
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

  });

  describe('transformProperty', () => {

    it('transform number property, should change precision from string to number', () => {
      let fields: any[] = [{
        name: 'abc',
        type: 'Number',
        property: {
          defaultValue: '1.0',
          precision: '2.0',
        }
      }];
      fields = pipe.transformProperty(fields);
      const field: any = fields[0];
      expect(field).toHaveProperty(['property', 'precision'], 2.0);
      expect(field).not.toHaveProperty(['property', 'precision'], '2.0');
    });
  });

  describe('validate primary field type', () => {
    it('the primary field.type is invalid, should return 400 code', () => {
      const type = 'SingleSelect';
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsInvalidPrimaryFieldTypeError, { value: type });
      expect(() => {
        pipe.validatePrimaryFieldType(type);
      }).toThrow(error);
    });

  });

  describe('validate fields', () => {

    it('field.name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsMaxLengthError, { property: 'field.name', value: 100 });
      expect(() => {
        const fieldName = '表格fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const fields: DatasheetFieldCreateRo[] = [{
          name: fieldName,
          type: 'Text'
        }];
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('invalid field type, should return 400 code', () => {
      const fields: DatasheetFieldCreateRo[] = [{
        name: 'abc',
        type: 'Textt'
      }];
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue
        , { property: `fields[${fields[0].name}].type`, value: fields[0].type });
      expect(() => {
        pipe.validateFields(fields);
      }).toThrow(error);
    });

    it('invalid field property, should return 400 code', () => {
      const fields: DatasheetFieldCreateRo[] = [{
        name: 'abc',
        type: 'number',
        property: {}
      }];
      const error = ApiException.tipError(ApiTipIdEnum.apiParamsInvalidValue
        , { property: `fields[${fields[0].name}].property`, value: fields[0].property });
      expect(() => {
        pipe.validateFields(fields);
      }).toThrow(error);
    });

  });

});
