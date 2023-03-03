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

import {
  BasicValueType, Field, FilterConjunction as CoreFilterConjunction,
  FilterDuration, getNewId, IDPrefix, IFilterInfo, IGridViewProperty, ILookUpField, Selectors, Strings, t,
} from '@apitable/core';
import { useRef } from 'react';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import ConditionList from './condition_list';
import { ExecuteFilterFn } from './interface';
import styles from './style.module.less';
import { AddOutlined } from '@apitable/icons';

interface IViewFilter {
  datasheetId: string;
  filterInfo: IFilterInfo;
  setFilters: Function;
  field?: ILookUpField;
}

const ViewFilterBase: React.FC<React.PropsWithChildren<IViewFilter>> = props => {
  const colors = useThemeColors();
  const { datasheetId, filterInfo, setFilters, field } = props;
  const view = useSelector(state => Selectors.getCurrentView(state, datasheetId))! as IGridViewProperty;
  const columns = view.columns;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId))!;

  const changeFilter = (cb: ExecuteFilterFn) => {
    const result = cb(filterInfo!);
    setFilters(result);
  };

  // Mark if a new filter has been added, scrolling to the bottom directly in the addViewFilter function is not valid.
  const added = useRef<boolean>(false);

  function addViewFilter() {
    const firstColumns = fieldMap[columns[0].fieldId];
    const exitIds = filterInfo ? filterInfo.conditions.map(item => item.conditionId) : [];
    const acceptFilterOperators = Field.bindModel(firstColumns).acceptFilterOperators;
    const newOperate = acceptFilterOperators[0];
    setFilters({
      conjunction: filterInfo?.conjunction || CoreFilterConjunction.And,
      conditions: [...(filterInfo?.conditions || []), {
        conditionId: getNewId(IDPrefix.Condition, exitIds),
        fieldId: columns[0].fieldId,
        operator: newOperate,
        fieldType: firstColumns.type as any,
        value: Field.bindModel(firstColumns).valueType === BasicValueType.DateTime ?
          [FilterDuration.ExactDate, null] : null,
      }],
    });
    added.current = true;
  }

  useEffect(() => {
    if (added.current) {
      const conditionWrapper = document.querySelector(`.${styles.condition}`) as HTMLDivElement;
      conditionWrapper.scrollTop = conditionWrapper.scrollHeight;
      added.current = false;
    }
  }, [filterInfo?.conditions.length]);

  function deleteFilter(idx: number) {
    setFilters({
      conjunction: filterInfo!.conjunction,
      conditions: filterInfo!.conditions.filter((_item, index) => {
        return index !== idx;
      }),
    });
  }

  return (
    <div className={styles.viewFilter} style={{ width: 670 }}>
      <ConditionList
        filterInfo={filterInfo}
        fieldMap={fieldMap}
        changeFilter={changeFilter}
        deleteFilter={deleteFilter}
        datasheetId={datasheetId}
        field={field}
      />
      <div className={styles.addNewButton} onClick={addViewFilter}>
        <div className={styles.iconAdd}>
          <AddOutlined size={16} color={colors.thirdLevelText} />
        </div>
        {t(Strings.add_filter)}
      </div>
    </div>
  );
};

export const ModalViewFilter = React.memo(ViewFilterBase);
