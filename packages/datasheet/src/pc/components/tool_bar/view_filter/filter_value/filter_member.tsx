import {
  FieldType,
  FOperator,
  integrateCdnHost,
  IUnitValue,
  MemberType,
  OtherTypeUnitId,
  Settings,
  Strings,
  t
} from '@apitable/core';
import { memberStash } from 'pc/common/member_stash/member_stash';
import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { IFilterMemberProps } from '../interface';
import { FilterGeneralSelect } from './filter_general_select';

interface IExFilterMemberProps extends IFilterMemberProps {
  // 筛选成员 = 我（当前访问用户）是一个客户端状态。事件中没有这个状态，对应的 UI 需要隐藏这个筛选条件。
  hiddenClientOption?: boolean;
}

export const FilterMember: React.FC<IExFilterMemberProps> = props => {
  const { field, condition, onChange, hiddenClientOption } = props;
  const [isMulti, setIsMulti] = useState(false);
  const fieldType = condition.fieldType;
  const filterValue = condition.value || [];
  const stashList = memberStash.getMemberStash();

  const unitList = useMemo(() => {

    let tempUnitList: IUnitValue[] = [...new Set(stashList)];
    if (field.type !== FieldType.Member) {
      tempUnitList = tempUnitList.filter(unitValue => unitValue.type === MemberType.Member && Boolean(unitValue.userId));
    }

    const operator = condition.operator;
    // 以下 筛选条件 添加新的 筛选值 - <当前用户>
    const filterOperators = new Set([FOperator.Is, FOperator.IsNot, FOperator.Contains, FOperator.DoesNotContain]);

    if (filterOperators.has(operator)) {
      // 对于 CreatedBy 字段，新增 ”匿名者“ 标识
      if (field.type === FieldType.CreatedBy) {
        const alienUnit = {
          type: MemberType.Member,
          userId: OtherTypeUnitId.Alien,
          unitId: OtherTypeUnitId.Alien,
          avatar: integrateCdnHost(Settings.anonymous_avatar.value),
          name: t(Strings.anonymous),
          isActive: true,
          isDelete: false,
          isSelf: true,
        };
        tempUnitList.unshift(alienUnit);
      }

      const selfUnit = {
        type: MemberType.Member,
        userId: OtherTypeUnitId.Self,
        unitId: OtherTypeUnitId.Self,
        avatar: '',
        name: t(Strings.add_sort_current_user),
        isActive: true,
        isDelete: false,
        isSelf: true,
        desc: t(Strings.add_sort_current_user_tips),
      };
      if (!hiddenClientOption) {
        tempUnitList.unshift(selfUnit);
      }
    }
    return tempUnitList;
  }, [field, condition.operator, stashList, hiddenClientOption]);

  useEffect(() => {
    const operator = condition.operator;
    const _isMulti = field.property?.isMulti ||
      operator === FOperator.Contains ||
      operator === FOperator.DoesNotContain;
    setIsMulti(_isMulti);
  }, [condition.operator, fieldType, field]);

  return (
    <FilterGeneralSelect
      field={field}
      isMulti={isMulti}
      onChange={onChange}
      cellValue={filterValue}
      listData={unitList}
    />
  );
};
