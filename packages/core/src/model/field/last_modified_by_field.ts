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
import { isEqual } from 'lodash';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ICellValue } from 'model/record';
import { getApiMetaUserProperty } from 'model/utils';
import { IFieldUpdatedMap, IRecord, IRecordMap, IReduxState } from '../../exports/store/interfaces';
import { getUserMap } from 'modules/org/store/selectors/unit_info';
import {
  BasicValueType, CollectType, FieldType, IAPIMetaLastModifiedByFieldProperty, IField, ILastModifiedByField, ILastModifiedByProperty, IUuids
} from '../../types';
import { MemberBaseField } from './member_base_field';
import { datasheetIdString, joiErrorResult } from './validate_schema';
import { t, Strings } from '../../exports/i18n';
import { IUpdateOpenLastModifiedByFieldProperty } from 'types/open/open_field_write_types';
import { IOpenLastModifiedByFieldProperty } from 'types/open/open_field_read_types';
import { getFieldDefaultProperty } from './const';

export class LastModifiedByField extends MemberBaseField {
  constructor(public override field: ILastModifiedByField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    uuids: Joi.array().items(Joi.string()).required(),
    datasheetId: datasheetIdString().required(),
    // dependent field collection type
    collectType: Joi.valid(CollectType.AllFields, CollectType.SpecifiedFields).required(),
    // dependent fields
    fieldIdCollection: Joi.array().items(Joi.string()).required(),
  }).required();

  override get apiMetaProperty(): IAPIMetaLastModifiedByFieldProperty {
    const userMap = getUserMap(this.state);
    return getApiMetaUserProperty(this.field.property.uuids, userMap);
  }

  get openValueJsonSchema() {
    return {
      type: 'object',
      title: this.field.name,
      properties: {
        id: {
          type: 'string',
          title: t(Strings.robot_variables_editor_ID),
        },
        name: {
          type: 'string',
          title: t(Strings.robot_variables_editor_name),
        },
        avatar: {
          type: 'string',
          title: t(Strings.robot_variables_editor_avatar),
        },
      }
    };
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.LastModifiedBy) as ILastModifiedByProperty;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ILastModifiedByField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.LastModifiedBy,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  override get isComputed() {
    return true;
  }

  override get basicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  override recordEditable() {
    return false;
  }

  override stdValueToCellValue(): null {
    return null;
  }

  override validate(cv: ICellValue) {
    if (cv) {
      return false;
    }
    return true;
  }

  validateProperty() {
    return LastModifiedByField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  getUuidByFieldUpdatedMap(fieldUpdatedMap: IFieldUpdatedMap, rangeIds: string[]): string | null {
    const fieldUpdateInfo = rangeIds.reduce((prev, fieldId) => {
      const info = fieldUpdatedMap[fieldId];

      if (!info?.at || !info?.by || (prev?.at > info?.at)) {
        return prev;
      }
      return { at: info.at, by: info.by };
    }, { at: 0, by: null } as { at: number, by: string | null });

    return fieldUpdateInfo?.by || null;
  }

  getCellValue(record: IRecord): ICellValue {
    const { collectType, fieldIdCollection } = this.field.property;
    const updatedMap = record.recordMeta?.fieldUpdatedMap;

    // Depends on fieldUpdatedMap, otherwise returns null
    if (!updatedMap) {
      return null;
    }

    const isAllField = collectType === CollectType.AllFields;
    const fieldIds = isAllField ? Object.keys(updatedMap) : fieldIdCollection;
    const updatedBy = this.getUuidByFieldUpdatedMap(updatedMap, fieldIds);
    return updatedBy == null ? null : updatedBy;
  }

  // Get the uuid involved in all records
  getUuidsByRecordMap(recordMap: IRecordMap): string[] {
    const fieldUuids: string[] = [];
    const uuids = Object.values(recordMap)
      .reduce((acc, record) => {
        const fieldUpdatedMap = record.recordMeta?.fieldUpdatedMap;
        fieldUpdatedMap && Object.values(fieldUpdatedMap).forEach(updatedInfo => {
          updatedInfo?.by && fieldUuids.push(updatedInfo.by);
        });
        if (record.recordMeta?.updatedBy) {
          acc.push(record.recordMeta.updatedBy);
        }
        return acc;
      }, [] as string[]);
    return [...new Set([...uuids, ...fieldUuids])];
  }

  override getUnitNames(cellValue: IUuids) {
    const userMap = getUserMap(this.state);
    if (!userMap) return null;
    return cellValue.map(uuid => {
      if (!userMap[uuid]) { return ''; }
      return userMap[uuid].name;
    });
  }

  override eq(cv1: IUuids | null, cv2: IUuids | null): boolean {
    if (cv1 == null || cv2 == null) return cv1 === cv2;
    return isEqual(cv1, cv2);
  }

  override getUnitIds(cellValue: IUuids | null): string[] | null {
    if (!cellValue) {
      return null;
    }
    return [cellValue].flat();
  }

  override getUnits(cellValue: IUuids) {
    const userMap = getUserMap(this.state);
    if (!userMap) return null;
    return cellValue.reduce((ids, uuid) => {
      if (userMap[uuid]) {
        ids.push(userMap[uuid] as never);
      }
      return ids;
    }, []);
  }

  override get openFieldProperty(): IOpenLastModifiedByFieldProperty {
    const { collectType, fieldIdCollection } = this.field.property;
    return {
      collectType,
      fieldIdCollection
    };
  }

  static openUpdatePropertySchema = Joi.object({
    collectType: Joi.number().valid(CollectType.AllFields, CollectType.SpecifiedFields),
    fieldIdCollection: Joi.array().items(Joi.string())
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenLastModifiedByFieldProperty) {
    return LastModifiedByField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenLastModifiedByFieldProperty): ILastModifiedByProperty {
    const { collectType, fieldIdCollection } = openFieldProperty;
    const { uuids, datasheetId } = this.field.property;
    const defaultProperty = LastModifiedByField.defaultProperty();
    return {
      uuids: uuids || [],
      datasheetId,
      collectType: collectType ?? defaultProperty.collectType,
      fieldIdCollection: fieldIdCollection || []
    };
  }

}
