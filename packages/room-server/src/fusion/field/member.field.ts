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

import { APIMetaMemberType, ApiTipConstant, ICellValue, IField, MemberType } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isString } from 'class-validator';
import { BaseField } from 'fusion/field/base.field';
import { UnitTypeEnum } from 'shared/enums';
import { IFieldRoTransformOptions, IFieldValue } from 'shared/interfaces';
import { UnitService } from 'unit/services/unit.service';
import { FieldManager } from '../field.manager';

@Injectable()
export class MemberField extends BaseField implements OnApplicationBootstrap {
  constructor(private readonly unitService: UnitService) {
    super();
  }

  private static getTransformedUnitType(unitType: APIMetaMemberType | MemberType): number {
    if (typeof unitType === 'string') {
      const APIStringMemberTypeMap = {
        [APIMetaMemberType.Member]: MemberType.Member,
        [APIMetaMemberType.Team]: MemberType.Team,
      };
      return APIStringMemberTypeMap[unitType];
    }
    return unitType;
  }

  override validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    // Pass in an array
    if (fieldValue === null) return;
    if (!Array.isArray(fieldValue)) {
      this.throwException(field, ApiTipConstant.api_param_member_field_type_error, extra);
    }
    const keys = Object.keys(fieldValue);
    // Only single
    if (!field.property.isMulti && keys.length > 1) {
      this.throwException(field, ApiTipConstant.api_params_member_field_records_max_count_error);
    }
    for (const key of keys) {
      const unitId = fieldValue[key].id;
      const originalUnitId = (fieldValue as any)[key].unitId;
      // Pass in a string to prevent loss of precision
      if (unitId && !isString(unitId)) {
        this.throwException(field, ApiTipConstant.api_param_member_id_type_error, extra);
      }
      // Pass in a string to prevent loss of precision
      if (originalUnitId && !isString(originalUnitId)) {
        this.throwException(field, ApiTipConstant.api_param_member_id_type_error, extra);
      }
      // Validate the necessary parameters
      if (!unitId && !originalUnitId && !fieldValue[key].name) this.throwException(field, ApiTipConstant.api_params_instance_member_name_error);
      if (!unitId && !originalUnitId && !fieldValue[key].type) this.throwException(field, ApiTipConstant.api_params_instance_member_type_error);
    }
  }

  override async roTransform(fieldValues: IFieldValue, field: IField, options: IFieldRoTransformOptions): Promise<ICellValue> {
    const unitIds: string[] = [];
    const keys = Object.keys(fieldValues as any);
    for (const key of keys) {
      const unitId = (fieldValues as any)[key].id;
      const originalUnitId = (fieldValues as any)[key].unitId;
      if (unitId) {
        const count = await this.unitService.getCountBySpaceIdAndId(unitId, options.spaceId!);
        // Check id
        if (0 === count) {
          this.throwException(field, ApiTipConstant.api_param_unit_not_exists);
        }
        unitIds.push(unitId);
      } else if (originalUnitId) {
        const id = await this.unitService.getIdByUnitIdAndSpaceIdAndUnitType(originalUnitId, options.spaceId!, UnitTypeEnum.MEMBER);
        if (!id) {
          this.throwException(field, ApiTipConstant.api_param_unit_not_exists);
        }
        unitIds.push(id);
      } else {
        const { name, type } = (fieldValues as any)[key];
        const unitId = await this.unitService.getIdByNameAndType(name, MemberField.getTransformedUnitType(type), options.spaceId!);
        // Check name
        if (!unitId) {
          this.throwException(field, ApiTipConstant.api_param_unit_name_type_not_exists);
        }
        unitIds.push(unitId);
      }
    }
    return unitIds;
  }

  onApplicationBootstrap() {
    FieldManager.setService(MemberField.name, this);
  }
}
