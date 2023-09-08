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

import produce from 'immer';
// @ts-ignore
import { snake } from 'naming-style';
import * as React from 'react';
import { useContext } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, useThemeColors } from '@apitable/components';
import { FieldType, FilterDuration, FOperator, IFilterCondition, Strings, t } from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useResponsive } from 'pc/hooks';
import { ExecuteFilterFn } from '../../interface';
import styles from '../style.module.less';

export const DateDuration = [
  FilterDuration.ExactDate,
  FilterDuration.Today,
  FilterDuration.Yesterday,
  FilterDuration.Tomorrow,
  FilterDuration.SomeDayBefore,
  FilterDuration.SomeDayAfter,
];

interface IFilterDateDurationProps {
  disabled?: boolean;
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
  condition: IFilterCondition<FieldType>;
}

export const FilterDateDuration: React.FC<React.PropsWithChildren<IFilterDateDurationProps>> = (props) => {
  const { conditionIndex, condition, disabled = false, changeFilter } = props;
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { isViewLock: isViewLockOrigin } = useContext(ViewFilterContext);
  const isViewLock = isViewLockOrigin || disabled;

  function createOptionData() {
    const operate = condition.operator;
    let filterDuration = Object.values(FilterDuration).filter((item) => {
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

    return filterDuration.map((item) => {
      return {
        label: t(Strings[snake(FilterDuration[item]).toLowerCase()]),
        value: item,
      };
    });
  }

  function onChange(selectValue: string) {
    return changeFilter((value) => {
      // TODO Need to compare.
      return produce(value, (draft) => {
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
        disabled={isViewLock}
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
      onSelected={(option) => {
        onChange(option.value as string);
      }}
      triggerCls={styles.dataDuration}
      dropdownMatchSelectWidth={false}
      openSearch={false}
      triggerStyle={{ width: 100 }}
      disabled={isViewLock}
    />
  );
};
