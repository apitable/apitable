import { APIMetaMemberType, ICellValue, IField, MemberType } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isString } from 'class-validator';
import { UnitService } from 'database/services/unit/unit.service';
import { BaseField } from 'fusion/field/base.field';
import { IFieldRoTransformOptions, IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';

@Injectable()
export class MemberField extends BaseField implements OnApplicationBootstrap {
  constructor(private readonly unitService: UnitService) {
    super();
  }

  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    // Pass in an array
    if (fieldValue === null) return;
    if (!Array.isArray(fieldValue)) {
      this.throwException(field, 'api_param_member_field_type_error', extra);
    }
    const keys = Object.keys(fieldValue);
    // Only single
    if (!field.property.isMulti && keys.length > 1) {
      this.throwException(field, 'api_params_member_field_records_max_count_error');
    }
    for (const key of keys) {
      const unitId = fieldValue[key].id;
      // Pass in a string to prevent loss of precision
      if (unitId && !isString(unitId)) {
        this.throwException(field, 'api_param_member_id_type_error', extra);
      }
      // Validate the necessary parameters
      if (!fieldValue[key].name) this.throwException(field, 'api_params_instance_member_name_error');
      if (!fieldValue[key].type) this.throwException(field, 'api_params_instance_member_type_error');
    }
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

  async roTransform(fieldValues: IFieldValue, field: IField, options: IFieldRoTransformOptions): Promise<ICellValue> {
    const unitIds: string[] = [];
    const keys = Object.keys(fieldValues);
    for (const key of keys) {
      const unitId = fieldValues[key].id;
      if (unitId) {
        const count = await this.unitService.getCountBySpaceIdAndId(unitId, options.spaceId);
        // Check id
        if (0 === count) {
          this.throwException(field, 'api_param_unit_not_exists');
        }
        unitIds.push(unitId);
      } else {
        const { name, type } = fieldValues[key];
        const unitId = await this.unitService.getIdByNameAndType(name, MemberField.getTransformedUnitType(type), options.spaceId);
        // Check name
        if (!unitId) {
          this.throwException(field, 'api_param_unit_name_type_not_exists');
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
