import Joi from 'joi';
import { IReduxState, IUnitValue, Selectors } from 'store';
import { IAPIMetaMember, IAPIMetaMemberFieldProperty, IMemberField, IMemberFieldOpenValue, IMemberProperty } from '../../types';
import { IStandardValue, IUnitIds } from '../../types/field_types';
import { MemberBaseField } from './member_base_field';
import { ICellValue } from 'model/record';
import { isEqual, isNil, isString } from 'lodash';
import { getMemberTypeString } from 'model/utils';
import { t, Strings } from 'i18n';
import { IOpenMemberFieldProperty, IOpenMemberOption } from 'types/open/open_field_read_types';
import { IAddOpenMemberFieldProperty, IUpdateOpenMemberFieldProperty } from 'types/open/open_field_write_types';

export class MemberField extends MemberBaseField {
  constructor(public field: IMemberField, public state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    isMulti: Joi.boolean().required(),
    unitIds: Joi.array().items(Joi.string()).required(),
    shouldSendMsg: Joi.boolean(),
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

  get apiMetaProperty(): IAPIMetaMemberFieldProperty {
    const unitMap = Selectors.getUnitMap(this.state);
    const options: IAPIMetaMember[] = [];
    if (unitMap) {
      this.field.property.unitIds.forEach(unitId => {
        if (unitMap.hasOwnProperty(unitId)) {
          const { name, type, avatar } = unitMap[unitId];
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

  static polyfillOldData(cellValue: IUnitIds | null) {
    if (!cellValue) {
      return cellValue;
    }
    if (!Array.isArray(cellValue)) {
      return null;
    }
    return cellValue.map(item => {
      if (typeof item === 'object') {
        // 旧数据只返回 unitId
        return (item as IUnitValue).unitId;
      }
      return item;
    });
  }

  static defaultProperty() {
    return {
      isMulti: true,
      shouldSendMsg: true,
      unitIds: [],
    };
  }

  recordEditable(datasheetId?: string, mirrorId?: string) {
    if (!super.recordEditable(datasheetId, mirrorId)) {
      return false;
    }
    const { templateId } = this.state.pageParams;
    return templateId ? false : true;
  }

  isMultiValueField(): boolean {
    return true;
  }

  stdValueToCellValue(stdValue: IStandardValue): ICellValue | null {
    // 在 redux 中以 name 文本匹配符合的成员信息。
    const unitMap = Selectors.getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    const unitValue = Object.values(unitMap);
    // 空间站的成员存在重名的可能性，所以每次对数据转换，需要优先找到激活且未被删除的成员，所以要对所有数据进行检查
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

  eq(cv1: IUnitIds | null, cv2: IUnitIds | null): boolean {
    if (cv1 == null || cv2 == null) {
      return cv1 === cv2;
    }
    // 兼容旧数据的比较
    return isEqual(MemberField.polyfillOldData([cv1].flat()), MemberField.polyfillOldData([cv2].flat()));
  }

  getUnitNames(cellValue: IUnitIds) {
    const unitMap = Selectors.getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    return cellValue.map(id => {
      // 单元格里存有unitId，但是空间内没有对应的用户信息，这里需要兼容两种情况：
      // 1、 旧数据
      // 2. 从其他空间粘贴的数据，或者是转存的表里存储的数据
      if (!unitMap[id]) {
        return '';
      }
      return unitMap[id].name;
    });
  }

  getUnitIds(cellValue: IUnitIds | null) {
    return MemberField.polyfillOldData(cellValue);
  }

  getUnits(cellValue: IUnitIds) {
    const unitMap = Selectors.getUnitMap(this.state);
    if (!unitMap) {
      return null;
    }
    return cellValue.map(unitId => {
      return unitMap[unitId];
    }).filter(item => item);
  }

  /**
   * API 返回成员基本信息
   * @param cellValues
   */
  cellValueToApiStandardValue(cellValues: any[] | null): any[] | null {
    if (isNil(cellValues)) {
      return null;
    }
    const unitMap = Selectors.getUnitMap(this.state);
    if (isNil(unitMap)) {
      return null;
    }
    const units: any[] = [];
    cellValues.forEach(unitId => {
      if (unitMap.hasOwnProperty(unitId)) {
        units.push({
          id: unitId,
          type: getMemberTypeString(unitMap[unitId].type),
          name: unitMap[unitId].name,
          avatar: unitMap[unitId]?.avatar,
        });
      }
    });
    return units;
  }

  enrichProperty(stdVals: IStandardValue[]): IMemberProperty {
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

  get openFieldProperty(): IOpenMemberFieldProperty {
    const unitMap = Selectors.getUnitMap(this.state);
    const options: IOpenMemberOption[] = [];
    if (unitMap) {
      this.field.property.unitIds.forEach(unitId => {
        if (unitMap.hasOwnProperty(unitId)) {
          const { name, type, avatar } = unitMap[unitId];
          options.push({
            id: unitId,
            name,
            type: getMemberTypeString(type),
            avatar,
          });
        }
      });
    }
    const { isMulti, shouldSendMsg } = this.field.property;
    return {
      options,
      isMulti,
      shouldSendMsg
    };
  }

  static openUpdatePropertySchema = Joi.object({
    isMulti: Joi.boolean(),
    shouldSendMsg: Joi.boolean(),
  }).required();

  validateUpdateOpenProperty(updateProperty: IUpdateOpenMemberFieldProperty) {
    return MemberField.openUpdatePropertySchema.validate(updateProperty);
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenMemberFieldProperty): IMemberProperty {
    const { isMulti, shouldSendMsg } = openFieldProperty;
    const { unitIds } = this.field.property;
    return {
      isMulti: Boolean(isMulti),
      shouldSendMsg: Boolean(shouldSendMsg),
      unitIds
    };
  }

  addOpenFieldPropertyTransformProperty(openFieldProperty: IAddOpenMemberFieldProperty): IMemberProperty {
    const { isMulti, shouldSendMsg } = openFieldProperty;
    const defaultProperty = MemberField.defaultProperty();
    return {
      isMulti: isMulti ?? defaultProperty.isMulti,
      shouldSendMsg: shouldSendMsg ?? defaultProperty.shouldSendMsg,
      unitIds: []
    };
  }
}
