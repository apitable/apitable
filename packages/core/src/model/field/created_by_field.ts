import Joi from 'joi';
import { isEqual } from 'lodash';
import { DatasheetActions } from 'model/datasheet';
import { ICellValue } from 'model/record';
import { getApiMetaUserProperty } from 'model/utils';
import { IRecord, IRecordMap, IReduxState, Selectors } from 'store';
import { IAPIMetaCreateByFieldProperty } from 'types/field_api_property_types';
import {
  BasicValueType, FieldType, IAddOpenCreatedByFieldProperty, ICreatedByField, ICreatedByProperty, IField, IJsonSchema, IUuids
} from '../../types';
import { MemberBaseField, OtherTypeUnitId } from './member_base_field';
import { datasheetIdString, joiErrorResult } from './validate_schema';
import { t, Strings } from 'i18n';

export class CreatedByField extends MemberBaseField {

  constructor(public field: ICreatedByField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    uuids: Joi.array().items(Joi.string()).required(),
    datasheetId: datasheetIdString().required(),
  }).required();

  static defaultProperty() {
    return {
      uuids: [],
      datasheetId: '',
    };
  }

  validateProperty() {
    return CreatedByField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validate(cv) {
    return cv == null;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICreatedByField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.CreatedBy,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  get apiMetaProperty(): IAPIMetaCreateByFieldProperty {
    const userMap = Selectors.getUserMap(this.state);
    return getApiMetaUserProperty((this.field.property as ICreatedByProperty).uuids, userMap);
  }

  get openValueJsonSchema(): IJsonSchema {
    return {
      type: 'object',
      title: this.field.name,
      properties: {
        id: {
          type: 'string',
          title: t(Strings.robot_variables_creator_ID),
        },
        name: {
          type: 'string',
          title: t(Strings.robot_variables_creator_name),
        },
        avatar: {
          type: 'string',
          title: t(Strings.robot_variables_creator_avatar),
        },
      }
    };
  }

  get isComputed() {
    return true;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  recordEditable() {
    return false;
  }

  // CreatedBy 为只读字段，不需要实现此方法
  stdValueToCellValue(): null {
    return null;
  }

  getCellValue(record: IRecord): ICellValue {
    const createdBy = record.recordMeta?.createdBy;
    return createdBy == null ? OtherTypeUnitId.Alien : createdBy;
  }

  // 获取所有 record 中涉及的 uuid
  getUuidsByRecordMap(recordMap: IRecordMap): string[] {
    const uuids = Object.values(recordMap)
      .reduce((ids, record) => {
        if (record.recordMeta?.createdBy) {
          ids.push(record.recordMeta?.createdBy);
        }
        return ids;
      }, [] as string[]);
    return [...new Set(uuids)];
  }

  getUnitNames(cellValue: IUuids) {
    const userMap = Selectors.getUserMap(this.state);
    if (!userMap) {
      return null;
    }
    return cellValue.map(uuid => {
      if (!userMap[uuid]) {
        return '';
      }
      return userMap[uuid].name;
    });
  }

  eq(cv1: IUuids | null, cv2: IUuids | null): boolean {
    if (cv1 == null || cv2 == null) {
      return cv1 === cv2;
    }
    return isEqual(cv1, cv2);
  }

  getUnitIds(cellValue: IUuids | null): string[] | null {
    if (!cellValue) {
      return null;
    }
    return [cellValue].flat();
  }

  getUnits(cellValue: IUuids) {
    const userMap = Selectors.getUserMap(this.state);
    if (!userMap) {
      return null;
    }
    return cellValue.reduce((res, uuid) => {
      if (userMap[uuid]) {
        res.push(userMap[uuid]);
      }
      return res;
    }, [] as any[]);
  }

  validateAddOpenFieldProperty(updateProperty: IAddOpenCreatedByFieldProperty) {
    if (updateProperty === null) {
      return { error: undefined, value: null };
    }
    return this.validateUpdateOpenProperty(updateProperty);
  }
}
