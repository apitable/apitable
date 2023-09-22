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

import { FieldType, IOneWayLinkField } from '@apitable/core';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import {OneWayLinkField} from "./one_way_link.field";

describe('OneWayLinkField', () => {
  let app: NestFastifyApplication;
  let fieldClass: OneWayLinkField;
  let field: IOneWayLinkField;
  let recordService: any;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    recordService = app.get(DatasheetRecordService);
    fieldClass = new OneWayLinkField(recordService);
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'One-way Link',
      type: FieldType.OneWayLink,
      property: { foreignDatasheetId: 'string' },
    };
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validate', () => {
    it('null--should pass', () => {
      expect(() => fieldClass.validate(null!, field)).not.toThrow();
    });
    it('empty array--should throw an error', () => {
      expect(() => fieldClass.validate([], field)).toThrow(/^api_params_link_field_recordids_empty_error$/);
    });
    it('single linked with multiple--should throw an error', () => {
      field.property.limitSingleRecord = true;
      expect(() => fieldClass.validate(['rec1', 'rec2'], field)).toThrow(/^api_params_link_field_records_max_count_error$/);
    });
    it('not an array--should throw an error', () => {
      field.property.limitSingleRecord = true;
      expect(() => fieldClass.validate('rec1' as any, field)).toThrow(/^api_param_link_field_type_error$/);
    });
  });
});
