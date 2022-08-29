import { IUserInfo, Selectors } from 'store';
import { hasIntersect, isSameSet } from 'utils/array';
import {
  BasicValueType, IUnitIds, IStandardValue, IUuids,
  IMemberField, ICreatedByField, ILastModifiedByField,
} from '../../types/field_types';
import { FOperator, IFilterCondition, IFilterMember } from '../../types/view_types';
import { ICellValue, ICellToStringOption } from '../record';
import { ArrayValueField } from './field';
import { FieldType, IAPIMetaMemberBaseFieldProperty } from 'types';
import { IMemberFieldOpenValue } from 'types/field_types_open';
import { isNullValue } from 'model/utils';

export type ICommonMemberField = IMemberField | ICreatedByField | ILastModifiedByField;

export enum OtherTypeUnitId {
  Self = 'Self', // 用于标识当前用户
  Alien = 'Alien', // 用于标识匿名者
}

export abstract class MemberBaseField extends ArrayValueField {

  get apiMetaProperty(): IAPIMetaMemberBaseFieldProperty {
    return null;
  }

  /**
   * 当前字段的单元格值的基础类型。
   */
  get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  get innerBasicValueType() {
    return BasicValueType.String;
  }

  get acceptFilterOperators(): FOperator[] {
    return [
      FOperator.Is,
      FOperator.IsNot,
      FOperator.Contains,
      FOperator.DoesNotContain,
      FOperator.IsEmpty,
      FOperator.IsNotEmpty,
      FOperator.IsRepeat,
    ];
  }

  /**
   * 获取成员 unitIds，然后排序并拼接成字符串
   */
  unitIdsToString(cellValue: IUnitIds | IUuids | null) {
    const unitIds = this.getUnitIds(cellValue);
    unitIds && unitIds.sort();
    return this.arrayValueToString(unitIds);
  }

  /**
   * 多成员根据 unitIds 进行分组（orderInCellValueSensitive 为 false）
   * 解决问题1: 多成员一一对应但成员顺序不同被分到不同组
   * 解决问题2: 同名成员但 unitId 不同被分到同一个组
   */
  compare(cellValue1: IUnitIds | IUuids | null, cellValue2: IUnitIds | IUuids | null, orderInCellValueSensitive?: boolean): number {
    if (!orderInCellValueSensitive) {
      if (this.eq(cellValue1, cellValue2)) return 0;
      if (cellValue1 == null) return -1;
      if (cellValue2 == null) return 1;

      let str1 = this.unitIdsToString(cellValue1);
      let str2 = this.unitIdsToString(cellValue2);
      if (str1 === str2) return 0;
      if (str1 == null) return -1;
      if (str2 == null) return 1;

      str1 = str1.trim();
      str2 = str2.trim();

      return str1 === str2 ? 0 : (str1 > str2 ? 1 : -1);
    }
    return super.compare(cellValue1, cellValue2);
  }

  isMeetFilter(
    operator: FOperator,
    cellValue: IUnitIds | IUuids | null,
    conditionValue: Exclude<IFilterMember, null>,
  ) {
    const cv4filter = cellValue ? this.getUnitIds(cellValue)! : [];
    // 提前判断为空不为空, 应该直接判断 null 就行了，这里兼容旧数据。不能保证 cv 来的一定是 null，而不是空数组。
    if (operator === FOperator.IsEmpty) {
      return cv4filter.length === 0;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cv4filter.length > 0;
    }
    const conditionValue4Filter = conditionValue ? this.getUnitIds(conditionValue)! : [];
    switch (operator) {
      case FOperator.Is: {
        const realConditionValue = this.conditionValueToReal(conditionValue4Filter);
        return cellValue != null && isSameSet(cv4filter, realConditionValue);
      }

      case FOperator.IsNot: {
        const realConditionValue = this.conditionValueToReal(conditionValue4Filter);
        return cellValue == null || !isSameSet(cv4filter, realConditionValue);
      }

      case FOperator.Contains: {
        const realConditionValue = this.conditionValueToReal(conditionValue4Filter);
        return cellValue != null && hasIntersect(cv4filter, realConditionValue);
      }

      case FOperator.DoesNotContain: {
        const realConditionValue = this.conditionValueToReal(conditionValue4Filter);
        return cellValue == null || !hasIntersect(cv4filter, realConditionValue);
      }

      default: {
        return super.isMeetFilter(operator, cv4filter, conditionValue4Filter);
      }
    }
  }

  conditionValueToReal(value: string[]) {
    const conditionValue = value.slice();
    const selfIndex = conditionValue.indexOf(OtherTypeUnitId.Self);
    // 识别当前用户选项，进行 unitId/uuid 还原
    if (selfIndex > -1) {
      const { uuid, unitId } = this.state!.user.info!;
      const selfUnitId = this.field.type === FieldType.Member ? unitId : uuid;
      conditionValue.splice(selfIndex, 1, selfUnitId || '');
    }
    return conditionValue;
  }

  /**
   * 继承类需实现此方法
   * @desc 根据 cellValue 获取 uuids/unitIds
   */
  getUnitIds(cellValue: IUnitIds | IUuids | null): null | string[] {
    return null;
  }

  /**
   * 继承类需实现此方法
   * @desc 根据 uuids/unitIds 获取对应 name 组成的数组
   */
  getUnitNames(cellValue: IUnitIds | IUuids): null | string[] {
    return null;
  }

  /**
   * 继承类需实现此方法
   * @desc 根据 uuids/unitIds 获取对应 unit 信息组成的数组
   */
  getUnits(cellValue: IUnitIds | IUuids): null | any[] {
    return null;
  }

  /**
   * 继承类需实现此方法
   * @desc 根据 uuids/unitIds 获取对应 name 组成的数组
   */
  getUnitList(cellValue: IUnitIds | IUuids): null | string[] {
    return null;
  }

  /**
   * @desc 根据 cellValue 获取对应 name 组成的数组
   */
  cellValueToArray(cellValue: IUnitIds | IUuids | null): string[] | null {
    if (!cellValue) return null;
    const unitIds = this.getUnitIds(cellValue);
    return this.getUnitNames(unitIds!);
  }

  arrayValueToString(cellValues: any[] | null) {
    return cellValues && cellValues.length ? cellValues.join(', ') : null;
  }

  /**
   * @desc 根据 cellValue 获取对应 name 拼接的字符串
   */
  cellValueToString(cellValue: IUnitIds | IUuids | null, cellToStringOption?: ICellToStringOption): string | null {
    if (!cellValue) return null;
    return this.arrayValueToString(this.cellValueToArray([cellValue].flat()));
  }

  cellValueToStdValue(cellValue: IUnitIds | null): IStandardValue {
    const stdValue: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };
    if (!cellValue) return stdValue;
    const nameValues = this.cellValueToArray(cellValue);
    if (!nameValues) return stdValue;
    nameValues.forEach(item => {
      stdValue.data.push({
        text: item,
      });
    });
    return stdValue;
  }

  stdValueToCellValue(stdValue: IStandardValue): ICellValue | null {
    return null;
  }

  defaultValueForCondition(
    condition: IFilterCondition<FieldType.Member> |
      IFilterCondition<FieldType.CreatedBy> |
      IFilterCondition<FieldType.LastModifiedBy>,
  ): ICellValue {
    if (this.field.type !== FieldType.Member) {
      return null;
    }

    const isMulti = this.field.property.isMulti;

    if (isMulti) {
      if ([FOperator.Is, FOperator.Contains].includes(condition.operator)) {
        return condition.value;
      }
      return null;
    }

    if (
      condition.operator === FOperator.Is ||
      (
        condition.operator === FOperator.Contains &&
        condition.value &&
        condition.value.length === 1
      )
    ) {
      return condition.value;
    }

    return null;
  }

  defaultValue(): ICellValue {
    return null;
  }

  /**
   * api返回用户基本信息
   * @param cellValues uuids的数组或者uuid
   * @return
   * @author Zoe Zheng
   * @date 2021/3/15 3:03 下午
   */
  cellValueToApiStandardValue(cellValues: ICellValue | null): any | null {
    if (cellValues == null) return null;
    const userMap = Selectors.getUserMap(this.state);
    if (userMap == null) return null;
    const uuid = cellValues as string;
    if (userMap.hasOwnProperty(uuid)) {
      return {
        id: uuid,
        name: userMap[uuid].name,
        avatar: userMap[uuid]?.avatar,
      };
    }
    return null;
  }

  cellValueToApiStringValue(cellValues: IUnitIds | IUuids | null): string | null {
    return this.cellValueToString(cellValues);
  }
  cellValueToOpenValue(cellValues: IUnitIds | IUuids | null): any | null {
    return this.cellValueToApiStandardValue(cellValues);
  }

  openWriteValueToCellValue(openWriteValue: string[] | IMemberFieldOpenValue[] | null): IUnitIds | IUuids | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    const isSimple = openWriteValue.length && typeof openWriteValue[0] === 'string';
    // iframe 中 redux 上 user 和 主线程中 user 不一样
    const userInfo = this.state.user.info || this.state.user as any as IUserInfo;
    const transUserId = (id: string) => {
      // 对于 openWriteValue 可能为来自当前用户的userId，所以这里尝试去判断一下是否为当前用户的userId
      if (id === userInfo?.userId && userInfo.unitId) {
        return userInfo.unitId;
      }
      return id;
    };
    if (isSimple) {
      return (openWriteValue as string[]).map(v => transUserId(v));
    }
    return (openWriteValue as IMemberFieldOpenValue[]).map(v => transUserId(v.id));
  }
}
