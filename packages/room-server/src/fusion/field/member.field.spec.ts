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

import { FieldType, IMemberField } from '@apitable/core';
import '@apitable/i18n-lang';
import { MemberField } from 'fusion/field/member.field';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { UnitService } from 'unit/services/unit.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('MemberField', () => {
  let app: NestFastifyApplication;
  let fieldClass: MemberField;
  let field: IMemberField;
  let unitService: UnitService;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    unitService = app.get(UnitMemberService);
    fieldClass = new MemberField(unitService);
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Member',
      type: FieldType.Member,
      property: {
        isMulti: true,
        shouldSendMsg: false,
        unitIds: [''],
      },
    };
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validate', () => {
    it('null--should pass', () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });
    it('not an array--should throw an error', () => {
      expect(() => fieldClass.validate({}, field)).toThrow(/^api_param_member_field_type_error$/);
    });
    it('single member with multiple--should throw an error', () => {
      field.property.isMulti = false;
      expect(() => fieldClass.validate(['member1', 'member2'], field)).toThrow(/^api_params_member_field_records_max_count_error$/);
    });
    it('memberId not string--should throw an error', () => {
      field.property.isMulti = false;
      expect(() => fieldClass.validate([{
        id: 1
      }], field)).toThrow(/^api_param_member_id_type_error$/);
    });
    it('name not exist--should throw an error', () => {
      field.property.isMulti = false;
      expect(() => fieldClass.validate([{}], field)).toThrow(/^api_params_instance_member_name_error$/);
    });
    it('type not exist--should throw an error', () => {
      field.property.isMulti = false;
      expect(() => fieldClass.validate([{
        name: 'name'
      }], field)).toThrow(/^api_params_instance_member_type_error$/);
    });
  });
});
