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
import * as React from 'react';
import { useContext } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, useThemeColors } from '@apitable/components';
import { FilterConjunction as CoreFilterConjunction, FilterConjunctionDescMap, IFilterInfo, Strings, t } from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useResponsive } from 'pc/hooks';
import { ExecuteFilterFn } from '../interface';
import styles from './style.module.less';

interface IConjunctionProps {
  conjunction: string;
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
}

export const FilterConjunction: React.FC<React.PropsWithChildren<IConjunctionProps>> = (props) => {
  const { conjunction, conditionIndex, changeFilter } = props;
  const { isViewLock } = useContext(ViewFilterContext);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const color = useThemeColors();

  if (conditionIndex === 0) {
    return (
      <div className={styles.junction} style={{ paddingLeft: '10px', color: isViewLock ? color.thirdLevelText : '' }}>
        {t(Strings.where)}
      </div>
    );
  }

  if (conditionIndex !== 1) {
    return (
      <div className={styles.junction} style={{ paddingLeft: '10px', color: isViewLock ? color.thirdLevelText : '' }}>
        {FilterConjunctionDescMap[conjunction]}
      </div>
    );
  }

  function onChange(value: CoreFilterConjunction) {
    changeFilter((filterInfo: IFilterInfo) => {
      return produce(filterInfo, (draft) => {
        draft.conjunction = value;
        return draft;
      });
    });
  }

  if (isMobile) {
    return (
      <MobileSelect
        defaultValue={conjunction}
        optionData={Object.values(CoreFilterConjunction).map((item) => {
          return {
            label: FilterConjunctionDescMap[item],
            value: item,
          };
        })}
        onChange={onChange}
        title={t(Strings.please_choose)}
        style={{ marginRight: 8, background: 'none', width: '100%', padding: '12px 8px' }}
        disabled={isViewLock}
      />
    );
  }

  return (
    <Select
      triggerCls={styles.junction}
      value={conjunction}
      options={Object.values(CoreFilterConjunction).map((item) => {
        return {
          label: FilterConjunctionDescMap[item],
          value: item,
        };
      })}
      onSelected={(option) => onChange(option.value as CoreFilterConjunction)}
      openSearch={false}
      dropdownMatchSelectWidth={false}
      disabled={isViewLock}
      disabledTip={t(Strings.view_lock_setting_desc)}
    />
  );
};
