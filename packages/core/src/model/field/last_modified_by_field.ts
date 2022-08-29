import Joi from 'joi';
import { isEqual } from 'lodash';
import { DatasheetActions } from 'model/datasheet';
import { ICellValue } from 'model/record';
import { getApiMetaUserProperty } from 'model/utils';
import { IFieldUpdatedMap, IRecord, IRecordMap, IReduxState, Selectors } from 'store';
import {
  BasicValueType, CollectType, FieldType, IAPIMetaLastModifiedByFieldProperty, IField, ILastModifiedByField, ILastModifiedByProperty, IUuids
} from '../../types';
import { MemberBaseField } from './member_base_field';
import { datasheetIdString, joiErrorResult } from './validate_schema';
import { t, Strings } from 'i18n';
import { IUpdateOpenLastModifiedByFieldProperty } from 'types/open/open_field_write_types';
import { IOpenLastModifiedByFieldProperty } from 'types/open/open_field_read_types';

export class LastModifiedByField extends MemberBaseField {
  constructor(public field: ILastModifiedByField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    uuids: Joi.array().items(Joi.string()).required(),
    datasheetId: datasheetIdString().required(),
    // 依赖的字段集合类型
    collectType: Joi.valid(CollectType.AllFields, CollectType.SpecifiedFields).required(),
    // 依赖的字段
    fieldIdCollection: Joi.array().items(Joi.string()).required(),
  }).required();

  get apiMetaProperty(): IAPIMetaLastModifiedByFieldProperty {
    const userMap = Selectors.getUserMap(this.state);
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
    return {
      uuids: [],
      datasheetId: '',
      collectType: CollectType.AllFields,
      fieldIdCollection: [],
    };
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ILastModifiedByField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.LastModifiedBy,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
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

  stdValueToCellValue(): null {
    return null;
  }

  validate(cv) {
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
    }, { at: 0, by: null });

    return fieldUpdateInfo?.by || null;
  }

  getCellValue(record: IRecord): ICellValue {
    const { collectType, fieldIdCollection } = this.field.property;
    const updatedMap = record.recordMeta?.fieldUpdatedMap;

    // 依赖于 fieldUpdatedMap，否则返回 null
    if (!updatedMap) {
      return null;
    }

    const isAllField = collectType === CollectType.AllFields;
    const fieldIds = isAllField ? Object.keys(updatedMap) : fieldIdCollection;
    const updatedBy = this.getUuidByFieldUpdatedMap(updatedMap, fieldIds);
    return updatedBy == null ? null : updatedBy;
  }

  // 获取所有 record 中涉及的 uuid
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

  getUnitNames(cellValue: IUuids) {
    const userMap = Selectors.getUserMap(this.state);
    if (!userMap) return null;
    return cellValue.map(uuid => {
      if (!userMap[uuid]) { return ''; }
      return userMap[uuid].name;
    });
  }

  eq(cv1: IUuids | null, cv2: IUuids | null): boolean {
    if (cv1 == null || cv2 == null) return cv1 === cv2;
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
    if (!userMap) return null;
    return cellValue.reduce((ids, uuid) => {
      if (userMap[uuid]) {
        ids.push(userMap[uuid] as never);
      }
      return ids;
    }, []);
  }

  get openFieldProperty(): IOpenLastModifiedByFieldProperty {
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

  validateUpdateOpenProperty(updateProperty: IUpdateOpenLastModifiedByFieldProperty) {
    return LastModifiedByField.openUpdatePropertySchema.validate(updateProperty);
  }
  
  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenLastModifiedByFieldProperty): ILastModifiedByProperty {
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
