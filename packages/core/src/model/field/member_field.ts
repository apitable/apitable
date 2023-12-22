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

import Joi from 'joi';
import { isEqual, isNil, isString } from 'lodash';
import { ICellValue } from 'model/record';
import { getMemberTypeString } from 'model/utils';
import { IOpenMemberFieldProperty, IOpenMemberOption } from 'types/open/open_field_read_types';
import { IAddOpenMemberFieldProperty, IUpdateOpenMemberFieldProperty } from 'types/open/open_field_write_types';
import { Strings, t } from '../../exports/i18n';
import { IReduxState } from '../../exports/store/interfaces';
import { getUnitMap } from 'modules/org/store/selectors/unit_info';
import { IAPIMetaMember, IAPIMetaMemberFieldProperty, IMemberField, IMemberFieldOpenValue, IMemberProperty } from '../../types';
import { IStandardValue, IUnitIds } from '../../types/field_types';
import { polyfillOldData } from './const';
import { MemberBaseField } from './member_base_field';
import { getFieldDefaultProperty } from './const';
import { FieldType } from '../../types/field_types';

export class MemberField extends MemberBaseField {
  constructor(public override field: IMemberField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    isMulti: Joi.boolean().required(),
    unitIds: Joi.array().items(Joi.string()).required(),
    shouldSendMsg: Joi.boolean(),
    subscription: Joi.boolean(),
  }).required();

  static cellValueSchema = Joi.array().items(Joi.string().pattern(/^\d{10}/).required()).allow(null).required();

  static openWriteValueSchema = Joi.custom((owv: string[] | IMemberFieldOpenValue[], helpers) => {
    const memberIds = (owv as any).map((v: string | IMemberFieldOpenValue) => isString(v) ? v : v.id);
    if (!memberIds?.length) {
      return helpers.error('value format error');
    }
    for (const key of memberIds) {
      if (typeof key !== 'string') {
        return helpers.error(`memberId ${key} is must string`);
      }
    }
    return owv;
  }).allow(null).required();

  validateProperty() {
    return MemberField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cellValue: ICellValue) {
    return MemberField.cellValueSchema.validate(cellValue);
  }

  validateOpenWriteValue(owv: string[] | IMemberFieldOpenValue[] | null) {
    return MemberField.openWriteValueSchema.validate(owv);
  }

  override get apiMetaProperty(): IAPIMetaMemberFieldProperty {
    const unitMap = getUnitMap(this.state);
    const options: IAPIMetaMember[] = [];
    if (unitMap) {
      this.field.property.unitIds.forEach(unitId => {
        if (unitMap.hasOwnProperty(unitId)) {
          const { name, type, avatar } = unitMap[unitId]!;
          options.push({
            id: unitId,
            name,
            type: getMemberTypeString(type),
            avatar,
          });
        }
      });
    }
    return {
      options,
      isMulti: this.field.property.isMulti,
      shouldSendMsg: this.field.property.shouldSendMsg,
      subscription: this.field.property.subscription,
    };
  }

  get openValueJsonSchema() {
    return {
      type: 'array',
      title: this.field.name,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            title: t(Strings.robot_variables_join_member_IDs),
          },
          type: {
            type: 'string',
            title: t(Strings.robot_variables_join_member_types),
          },
          name: {
            type: 'string',
            title: t(Strings.robot_variables_join_member_names),
          },
          avatar: {
            type: 'string',
            title: t(Strings.robot_variables_join_member_avatars),
          },
        },
      }
    };
  }

  static polyfillOldData = polyfillOldData;
  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Member) as IMemberProperty;
  }

  override recordEditable(datasheetId?: string, mirrorId?: string) {
    if (!super.recordEditable(datasheetId, mirrorId)) {
      return false;
    }
    const { templateId } = this.state.pageParams;
    return !templateId;
  }

  override isMultiValueField(): boolean {
    return true;
  }

  override stdValueToCellValue(stdValue: IStandardValue): ICellValue | null {
    // Match matching member information with name text in redux.
    const unitMap = getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    const unitValue = Object.values(unitMap);
    // The members of the space station may have the same name, so every time the data is converted,
    // it is necessary to first find the members that are activated and not deleted, so all data must be checked
    const unitNames = Array.from(new Set(stdValue.data.map(d => d.text.split(/, ?/)).flat()));
    const cvMap = new Map();
    for (const name of unitNames) {
      for (const unit of unitValue) {
        if (unit.name !== name) {
          continue;
        }
        cvMap.set(name, unit.unitId);
        if (unit.isActive && !unit.isDeleted) {
          break;
        }
      }
    }

    return cvMap.size ? [...cvMap.values()] : null;
  }

  override eq(cv1: IUnitIds | null, cv2: IUnitIds | null): boolean {
    if (cv1 == null || cv2 == null) {
      return cv1 === cv2;
    }
    // Compatible with old data comparison
    return isEqual(MemberField.polyfillOldData([cv1].flat()), MemberField.polyfillOldData([cv2].flat()));
  }

  override getUnitNames(cellValue: IUnitIds) {
    const unitMap = getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    return cellValue.map(id => {
      // There is unitId in the cell, but there is no corresponding user information in the space. Two situations need to be compatible here:
      // 1. Old data
      // 2. Data pasted from other spaces, or data stored in the dumped table
      if (!unitMap[id]) {
        return '';
      }
      return unitMap[id]!.name;
    });
  }

  override getUnitIds(cellValue: IUnitIds | null) {
    return MemberField.polyfillOldData(cellValue);
  }

  override getUnits(cellValue: IUnitIds) {
    const unitMap = getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    return cellValue.map(unitId => {
      return unitMap[unitId];
    }).filter(item => item);
  }

  /**
   * API returns basic information of members
   * @param cellValues
   */
  override cellValueToApiStandardValue(cellValues: any[] | null): any[] | null {
    if (isNil(cellValues)) {
      return null;
    }
    const unitMap = getUnitMap(this.state);
    if (isNil(unitMap)) {
      return null;
    }
    const units: any[] = [];
    cellValues.forEach(unitId => {
      if (unitMap.hasOwnProperty(unitId)) {
        units.push({
          id: unitId,
          unitId: unitMap[unitId]!.originalUnitId,
          type: getMemberTypeString(unitMap[unitId]!.type),
          name: unitMap[unitId]!.name,
          avatar: unitMap[unitId]?.avatar,
        });
      }
    });
    return units;
  }

  override enrichProperty(stdVals: IStandardValue[]): IMemberProperty {
    const cellValues = stdVals.map(stdVal => {
      const cv = this.stdValueToCellValue(stdVal);
      if (!cv) {
        return [];
      }
      return cv;
    }).flat() as string[];

    return {
      ...this.field.property,
      unitIds: [...new Set(cellValues)],
    };
  }

  validate(value: any): boolean {
    if (value == null) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every(unitId => {
        return typeof unitId === 'string';
      });
    }

    return false;
  }

  override get openFieldProperty(): IOpenMemberFieldProperty {
    const unitMap = getUnitMap(this.state);
    const options: IOpenMemberOption[] = [];
    if (unitMap) {
      this.field.property.unitIds.forEach(unitId => {
        if (unitMap.hasOwnProperty(unitId)) {
          const { name, type, avatar } = unitMap[unitId]!;
          options.push({
            id: unitId,
            name,
            type: getMemberTypeString(type),
            avatar,
          });
        }
      });
    }
    const { isMulti, shouldSendMsg, subscription } = this.field.property;
    return {
      options,
      isMulti,
      shouldSendMsg,
      subscription
    };
  }

  static openUpdatePropertySchema = Joi.object({
    isMulti: Joi.boolean(),
    shouldSendMsg: Joi.boolean(),
    subscription: Joi.boolean(),
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenMemberFieldProperty) {
    return MemberField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenMemberFieldProperty): IMemberProperty {
    const { isMulti, shouldSendMsg, subscription } = openFieldProperty;
    const { unitIds } = this.field.property;
    return {
      isMulti: Boolean(isMulti),
      shouldSendMsg: Boolean(shouldSendMsg),
      subscription: Boolean(subscription),
      unitIds
    };
  }

  override addOpenFieldPropertyTransformProperty(openFieldProperty: IAddOpenMemberFieldProperty): IMemberProperty {
    const { isMulti, shouldSendMsg, subscription } = openFieldProperty;
    const defaultProperty = MemberField.defaultProperty();
    return {
      isMulti: isMulti ?? defaultProperty.isMulti,
      shouldSendMsg: shouldSendMsg ?? defaultProperty.shouldSendMsg,
      subscription: subscription ?? defaultProperty.subscription,
      unitIds: []
    };
  }
}
