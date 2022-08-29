import {
  BasicValueType, Field, FieldType,
  FilterDuration, FOperator, IField, IFilterCondition, IFieldMap,
  IFilterInfo,
  Strings, t,
} from '@vikadata/core';
import produce from 'immer';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { MobileSelect } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { ExecuteFilterFn } from '../interface';
import styles from './style.module.less';
import { Select, useThemeColors } from '@vikadata/components';

interface IFilterOperateProps {
  conditions: IFilterCondition[];
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
  condition: IFilterCondition<FieldType>;
  field: IField;
  fieldMap: IFieldMap;
}

const checkNullOperator = (operator: FOperator) => {
  return operator === FOperator.IsNotEmpty || operator === FOperator.IsEmpty || operator === FOperator.IsRepeat;
};

export const FilterOperate: React.FC<IFilterOperateProps> = props => {
  const { conditionIndex, conditions, changeFilter, condition, field, fieldMap } = props;
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  function generateValue(operator: FOperator) {
    const field = fieldMap[condition.fieldId];
    const { valueType } = Field.bindModel(field);
    const isNullOperator= checkNullOperator(operator);
    // 切换为空/非空，清除掉所有的条件，对所有字段类型生效
    if (isNullOperator) {
      return null;
    }

    if (valueType === BasicValueType.DateTime) {
      // 日期字段的筛选条件从 「空」或者「非空」切换成其他条件，需要设置 value 为 [FilterDuration.ExactDate, null]
      // 否则切换后，选择日期区间的组件不会出现
      const lastOperateIsEmpty = checkNullOperator(condition.operator);
      return lastOperateIsEmpty && !isNullOperator ?
        [FilterDuration.ExactDate, null] : [FilterDuration.ExactDate, condition.value[1]];
    }
    if (
      field.type === FieldType.SingleSelect &&
      (
        condition.operator === FOperator.DoesNotContain ||
        condition.operator === FOperator.Contains
      ) &&
      (operator === FOperator.Is || operator === FOperator.IsNot)
    ) {
      return null;
    }

    return condition.value;
  }

  function mapHandle(field: IField, item: FOperator) {
    if (item === FOperator.IsRepeat) {
      const isRepeatCondition = conditions.find(item => item.operator === FOperator.IsRepeat);
      return {
        label: Field.bindModel(field).showFOperatorDesc(item),
        value: item,
        disabled: isRepeatCondition && isRepeatCondition.conditionId !== condition.conditionId,
        disabledTip: t(Strings.is_repeat_disable_tip)
      };
    }
    return {
      label: Field.bindModel(field).showFOperatorDesc(item),
      value: item
    };
  }

  function onChange(value: FOperator) {
    changeFilter((filterInfo: IFilterInfo) => {
      return produce(filterInfo, draft => {
        const condition = draft.conditions[conditionIndex];
        draft.conditions[conditionIndex] = {
          ...condition,
          // 类型不一致（比如神奇引用切换类型），改动操作后要修正
          fieldType: field.type,
          operator: value,
          value: generateValue(value),
        };
        return draft;
      });
    });
  }

  if (isMobile) {
    return (
      <MobileSelect
        defaultValue={condition.operator}
        optionData={
          Field.bindModel(field).acceptFilterOperators.map(fop => mapHandle(field, fop))
        }
        onChange={onChange}
        title={t(Strings.please_choose)}
        style={{
          justifyContent: 'space-between',
          background: colors.lowestBg,
          padding: '12px 8px',
        }}
      />
    );
  }

  return (
    <Select
      value={condition.operator}
      options={Field.bindModel(field).acceptFilterOperators.map(fop => mapHandle(field, fop))}
      onSelected={option => onChange(option.value as FOperator)}
      triggerCls={styles.con}
      openSearch={false}
      dropdownMatchSelectWidth={false}
    />
  );
};
