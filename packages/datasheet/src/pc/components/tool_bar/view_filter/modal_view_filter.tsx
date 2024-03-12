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

import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import * as React from 'react';
import { useThemeColors, useListenVisualHeight } from '@apitable/components';
import {
  BasicValueType,
  Field,
  FilterConjunction as CoreFilterConjunction,
  FilterDuration,
  getNewId,
  IDPrefix,
  IFilterInfo,
  IGridViewProperty,
  ILookUpField,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import ConditionList from './condition_list';
import { ExecuteFilterFn } from './interface';
import styles from './style.module.less';

const MIN_HEIGHT = 70;
const MAX_HEIGHT = 260;

interface IViewFilter {
  datasheetId: string;
  filterInfo: IFilterInfo;
  setFilters: Function;
  field?: ILookUpField;
}

const ViewFilterBase: React.FC<React.PropsWithChildren<IViewFilter>> = (props) => {
  const colors = useThemeColors();
  const { datasheetId, filterInfo, setFilters, field } = props;
  const view = useAppSelector((state) => Selectors.getCurrentView(state, datasheetId))! as IGridViewProperty;
  const columns = view.columns;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;

  const changeFilter = (cb: ExecuteFilterFn) => {
    const result = cb(filterInfo!);
    setFilters(result);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  // Mark if a new filter has been added, scrolling to the bottom directly in the addViewFilter function is not valid.
  const added = useRef<boolean>(false);

  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    childNode: childRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    position: 'sticky',
    showOnParent: false,
    onScroll: ({ height, scrollHeight, scrollTop }) => {
      const ele = scrollShadowRef.current;
      if (!ele) return;
      if (scrollTop + height > scrollHeight - 10) {
        // Masked scrollable styles.
        ele.style.display = 'none';
        return;
      }
      // Display scrollable style.
      if (ele.style.display === 'block') {
        return;
      }
      ele.style.display = 'block';
    },
  });

  function addViewFilter() {
    const firstColumns = fieldMap[columns[0].fieldId];
    const exitIds = filterInfo ? filterInfo.conditions.map((item) => item.conditionId) : [];
    const acceptFilterOperators = Field.bindModel(firstColumns).acceptFilterOperators;
    const newOperate = acceptFilterOperators[0];
    setFilters({
      conjunction: filterInfo?.conjunction || CoreFilterConjunction.And,
      conditions: [
        ...(filterInfo?.conditions || []),
        {
          conditionId: getNewId(IDPrefix.Condition, exitIds),
          fieldId: columns[0].fieldId,
          operator: newOperate,
          fieldType: firstColumns.type as any,
          value: Field.bindModel(firstColumns).valueType === BasicValueType.DateTime ? [FilterDuration.ExactDate, null] : null,
        },
      ],
    });
    added.current = true;
  }

  useEffect(() => {
    if (added.current) {
      const conditionWrapper = document.querySelector(`.${styles.condition}`) as HTMLDivElement;
      conditionWrapper.scrollTop = conditionWrapper.scrollHeight;
      added.current = false;
    }
  }, [filterInfo?.conditions.length, onListenResize]);

  function deleteFilter(idx: number) {
    setFilters({
      conjunction: filterInfo!.conjunction,
      conditions: filterInfo!.conditions.filter((_item, index) => {
        return index !== idx;
      }),
    });
  }

  return (
    <div ref={containerRef} className={styles.viewFilter}>
      <div ref={childRef} style={{ ...style, maxHeight: '264px', overflow: 'auto' }}>
        <ConditionList
          filterInfo={filterInfo}
          fieldMap={fieldMap}
          changeFilter={changeFilter}
          deleteFilter={deleteFilter}
          datasheetId={datasheetId}
          field={field}
        />
        <div ref={scrollShadowRef} className={classNames(!isMobile && styles.scrollShadow)} />
      </div>
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
