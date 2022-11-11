
import '@vikadata/i18n-lang';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ApiException } from '../../exception/api.exception';
import { FieldCreateRo } from '../../../fusion/ros/field.create.ro';
import { CreateFieldPipe } from './create.field.pipe';
import { ApiTipConstant } from '@apitable/core';

describe('CreateFieldPipe', () => {
  let app;
  let pipe: CreateFieldPipe;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    pipe = new CreateFieldPipe();
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validate field', () => {

    it('missing field name, should return 400 code', () => {
      const ro: FieldCreateRo = new FieldCreateRo('', 'Text');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
      expect(() => {
        pipe.validate(ro);
      }).toThrow(error);
    });

    it('name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
      expect(() => {
        const name = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const ro: FieldCreateRo = new FieldCreateRo(name, '');
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('invalid field type, should return 400 code', () => {
      const ro: FieldCreateRo = new FieldCreateRo('abc', 'Textt');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: ro.type });
      expect(() => {
        pipe.validate(ro);
      }).toThrow(error);
    });

    it('invalid field property, should return 400 code', () => {
      const field: FieldCreateRo = new FieldCreateRo('abc', 'number');
      field.property = {};
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'property', value: field.property });
      expect(() => {
        pipe.validate(field);
      }).toThrow(error);
    });
    
  });

  describe('transformProperty', () => {

    it('transform number property, should change precision from string to number', () => {
      const field = {
        name: 'abc',
        type: 'Number',
        property: {
          defaultValue: '1.0',
          precision: '2.0',
        }
      };
      pipe.transformProperty(field);
      expect(field).toHaveProperty(['property', 'precision'], 2.0);
      expect(field).not.toHaveProperty(['property', 'precision'], '2.0');
    });
  });
  
});
