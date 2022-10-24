import * as React from 'react';
import styles from '../style.module.less';
import { FieldType, FilterDuration, FOperator, IFilterCondition, Strings, t } from '@apitable/core';
import { ExecuteFilterFn } from '../../interface';
import produce from 'immer';
import { MobileSelect } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { Select, useThemeColors } from '@vikadata/components';
import { snake } from 'naming-style';

export const DateDuration = [
  FilterDuration.ExactDate,
  FilterDuration.Today,
  FilterDuration.Yesterday,
  FilterDuration.Tomorrow,
  FilterDuration.SomeDayBefore,
  FilterDuration.SomeDayAfter,
];

interface IFilterDateDurationProps {
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
  condition: IFilterCondition<FieldType>;
}

export const FilterDateDuration: React.FC<IFilterDateDurationProps> = props => {
  const { conditionIndex, condition, changeFilter } = props;
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  function createOptionData() {
    const operate = condition.operator;
    let filterDuration = Object.values(FilterDuration).filter(item => {
      return item !== 'SomeDayAfter' && item !== 'SomeDayBefore';
    });

    if (
      operate === FOperator.IsLess ||
      operate === FOperator.IsLessEqual ||
      operate === FOperator.IsGreater ||
      operate === FOperator.IsGreaterEqual
    ) {
      filterDuration = DateDuration;
    }

    return filterDuration.map(item => {
      return {
        label: t(Strings[snake(FilterDuration[item]).toLowerCase()]),
        value: item,
      };
    });
  }

  function onChange(selectValue: string) {
    return changeFilter(value => {
      // TODO 需要比较
      return produce(value, draft => {
        const condition = draft.conditions[conditionIndex];
        if (selectValue === FilterDuration.ExactDate) {
          condition.value = [FilterDuration.ExactDate, null];
        }
        condition.value = [selectValue];
        return draft;
      });
    });
  }

  if (isMobile) {
    return (
      <MobileSelect
        onChange={onChange}
        defaultValue={!condition.value ? '' : condition.value[0]}
        optionData={createOptionData()}
        title={t(Strings.please_choose)}
        style={{
          background: colors.lowestBg,
          justifyContent: 'space-between',
          padding: '12px 8px',
          width: 0,
          flex: 1,
          maxWidth: 150,
        }}
      />
    );
  }

  return (
    <Select
      value={!condition.value ? '' : condition.value[0]}
      options={createOptionData()}
      onSelected={option => {
        onChange(option.value as string);
      }}
      triggerCls={styles.dataDuration}
      dropdownMatchSelectWidth={false}
      openSearch={false}
      triggerStyle={{ width: 100 }}
    />
  );
};
