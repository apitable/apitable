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

import { IUserInfo } from '../../exports/store/interfaces';
import { getUserMap } from 'modules/org/store/selectors/unit_info';
import { hasIntersect, isSameSet } from 'utils/array';
import {
  BasicValueType, IUnitIds, IStandardValue, IUuids,
  IMemberField, ICreatedByField, ILastModifiedByField,
} from '../../types/field_types';
import { FOperator, IFilterCondition, IFilterMember } from '../../types/view_types';
import { ICellValue, ICellToStringOption } from '../record';
import { ArrayValueField } from './array_field';
import { FieldType, IAPIMetaMemberBaseFieldProperty } from 'types';
import { IMemberFieldOpenValue } from 'types/field_types_open';
import { isNullValue } from 'model/utils';
import { OtherTypeUnitId } from './const';

export type ICommonMemberField = IMemberField | ICreatedByField | ILastModifiedByField;

export abstract class MemberBaseField extends ArrayValueField {

  get apiMetaProperty(): IAPIMetaMemberBaseFieldProperty {
    return null;
  }

  /**
   * The underlying type of the cell value of the current field.
   */
  get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override get innerBasicValueType() {
    return BasicValueType.String;
  }

  override get acceptFilterOperators(): FOperator[] {
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
   * Get member unitIds, then sort and concatenate into strings
   */
  unitIdsToString(cellValue: IUnitIds | IUuids | null) {
    const unitIds = this.getUnitIds(cellValue);
    unitIds && unitIds.sort();
    return this.arrayValueToString(unitIds);
  }

  /**
   * Multiple members are grouped according to unitIds (orderInCellValueSensitive is false)
   * Solve problem 1: Many members have one-to-one correspondence but the order of members is different and they are divided into different groups
   * Solve problem 2: members with the same name but different unitId are assigned to the same group
   */
  override compare(cellValue1: IUnitIds | IUuids | null, cellValue2: IUnitIds | IUuids | null, orderInCellValueSensitive?: boolean): number {
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

  override isMeetFilter(
    operator: FOperator,
    cellValue: IUnitIds | IUuids | null,
    conditionValue: Exclude<IFilterMember, null>,
  ) {
    const cv4filter = cellValue ? this.getUnitIds(cellValue)! : [];
    // If it is judged in advance that it is empty or not, it should be judged directly as null, which is compatible with old data.
    // There is no guarantee that cv comes with null, not an empty array.
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
    // Identify the current user options and restore unitId/uuid
    if (selfIndex > -1) {
      const { uuid, unitId } = this.state!.user.info!;
      const selfUnitId = this.field.type === FieldType.Member ? unitId : uuid;
      conditionValue.splice(selfIndex, 1, selfUnitId || '');
    }
    return conditionValue;
  }

  /**
   * Inherited classes need to implement this method
   * @desc Get uuids/unitIds according to cellValue
   */
  getUnitIds(_cellValue: IUnitIds | IUuids | null): null | string[] {
    return null;
  }

  /**
   * Inherited classes need to implement this method
    * @desc Get an array of corresponding names according to uuids/unitIds
   */
  getUnitNames(_cellValue: IUnitIds | IUuids): null | string[] {
    return null;
  }

  /**
   * Inherited classes need to implement this method
    * @desc Get an array of corresponding unit information according to uuids/unitIds
   */
  getUnits(_cellValue: IUnitIds | IUuids): null | any[] {
    return null;
  }

  /**
   * Inherited classes need to implement this method
    * @desc Get an array of corresponding names according to uuids/unitIds
   */
  getUnitList(_cellValue: IUnitIds | IUuids): null | string[] {
    return null;
  }

  /**
   * @desc Get an array of corresponding names according to cellValue
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
   * @desc Get the string concatenated with the corresponding name according to cellValue
   */
  cellValueToString(cellValue: IUnitIds | IUuids | null, _cellToStringOption?: ICellToStringOption): string | null {
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

  stdValueToCellValue(_stdValue: IStandardValue): ICellValue | null {
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

  override defaultValue(): ICellValue {
    return null;
  }

  /**
   * api returns basic user information
   * @param cellValues array of uuids or uuid
   * @return
   * @author Zoe Zheng
   * @date 2021/3/15 3:03 pm
   */
  cellValueToApiStandardValue(cellValues: ICellValue | null): any | null {
    if (cellValues == null) return null;
    const userMap = getUserMap(this.state);
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
    // user on redux in iframe is different from user in main thread
    const userInfo = this.state.user.info || this.state.user as any as IUserInfo;
    const transUserId = (id: string) => {
      // For openWriteValue, it may be the userId of the current user, so try to determine whether it is the userId of the current user.
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
