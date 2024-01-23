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
import { intersection } from 'lodash';
import Trigger from 'rc-trigger';
import { useCallback, useMemo, useRef } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  Field,
  getFieldResultByStatType,
  getStatTypeList,
  Group,
  IGridViewColumn,
  IGridViewProperty,
  ILinearRowGroupTab,
  IRange,
  IReduxState,
  Selectors,
  StatType,
  Strings,
  t,
} from '@apitable/core';
import { TriangleDownFilled } from '@apitable/icons';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import styles from './styles.module.less';

interface IStatOption {
  fieldId: string;
  row?: ILinearRowGroupTab; // The statistics column on the group will pass in this information
  className?: string;
  style?: React.CSSProperties;
}

// If more than 1 cell is selected, you need to display the statistics of the records in the selection.
export function hasLargeSelection(range?: IRange, selectRecordRanges?: string[]) {
  if (range) {
    if (range.start.recordId !== range.end.recordId || range.start.fieldId !== range.end.fieldId) {
      return true;
    }
  }
  if (selectRecordRanges && selectRecordRanges.length > 1) {
    return true;
  }
  return false;
}

export const getFieldStatType = (state: IReduxState, fieldId: string) => {
  const selections = Selectors.getSelectRanges(state);
  const selectRecordRanges = Selectors.getSelectionRecordRanges(state);
  const column = Selectors.getColumnByFieldId(state, fieldId) as IGridViewColumn;
  const range = selections && selections[0];
  if (!column) {
    return null;
  }
  const field = Selectors.getField(state, column.fieldId);
  const fieldStatTypeList = getStatTypeList(field, state);
  // No incorrect statType displayed
  if (column.statType && !fieldStatTypeList.includes(column.statType)) {
    return null;
  }
  // When more than one cell is selected and the field is not in the selection, it is not displayed.
  if (hasLargeSelection(range, selectRecordRanges)) {
    if (range) {
      const rangeFields = Selectors.getRangeFields(state, range, state.pageParams.datasheetId!);
      const fieldInRange = Boolean(rangeFields && rangeFields.some((f) => f.id === fieldId));
      if (!fieldInRange) {
        return null;
      }
    }
  }
  return column.statType;
};

const StatOptionBase: React.FC<React.PropsWithChildren<IStatOption>> = (props) => {
  const colors = useThemeColors();
  const { className, row, fieldId } = props;
  const triggerRef = useRef<any>(null);
  const state = store.getState();
  const { field, shouldUseSelectRecordAggregate, viewId, groupInfo, statType, selectRecordIds, fieldIndex, permission, recordIds, groupBreakpoint } =
    useAppSelector((state) => {
      const field = Selectors.getField(state, fieldId);
      const view = Selectors.getCurrentView(state) as IGridViewProperty;
      const selection = Selectors.getSelectRanges(state);
      const selectRecordRanges = Selectors.getSelectionRecordRanges(state);
      const statType = getFieldStatType(state, fieldId);
      const fieldIndex = Selectors.getVisibleColumns(state)!.findIndex((f) => f.fieldId === fieldId);
      const groupInfo = Selectors.getActiveViewGroupInfo(state);
      const shouldUseSelectRecordAggregate = hasLargeSelection(selection && selection[0], selectRecordRanges);
      const selectRecordIds = Selectors.getSelectRecordIds(state);
      const recordIds: string[] = Selectors.getVisibleRowIds(state);
      const groupBreakpoint = Selectors.getGroupBreakpoint(state);

      return {
        recordIds,
        field,
        selectRecordIds,
        shouldUseSelectRecordAggregate,
        groupInfo,
        fieldIndex,
        statType,
        viewId: view.id,
        permission: Selectors.getPermissions(state),
        groupBreakpoint,
      };
    }, shallowEqual);
  const fieldStatTypeList = getStatTypeList(field, state);

  // TODO: Optimize the performance issues, add caching and execution conditions.
  const getStatRecordIds = useCallback(() => {
    const isGroupStat = Boolean(row);
    let res = recordIds;
    // Default is all records
    if (isGroupStat) {
      const groupSketch = new Group(groupInfo, groupBreakpoint);
      // The statistics column for the grouping, showing the records under the grouping
      res = groupSketch.getRecordsInGroupByDepth(state, row!.recordId, row!.depth).map((row) => row.recordId);
    }
    // Presence of constituency
    if (shouldUseSelectRecordAggregate) {
      if (isGroupStat) {
        return intersection(recordIds, selectRecordIds);
      }
      return selectRecordIds;
    }
    return res;
    // eslint-disable-next-line
  }, [groupInfo, row, shouldUseSelectRecordAggregate, selectRecordIds, recordIds, groupBreakpoint]);

  const statText = useMemo(() => {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state)!;
    if (!statType) {
      return t(Strings.statistics);
    }
    const count = getFieldResultByStatType(statType!, getStatRecordIds(), field, snapshot, state);
    if (statType === StatType.CountAll) {
      return t(Strings.records_of_count, {
        count,
      });
    }
    const statText = Field.bindModel(field).statType2text(statType!);
    return statText + ' ' + count;
  }, [statType, getStatRecordIds, field]);

  function commandForStat(e: React.MouseEvent, newStatType: StatType) {
    if (!statType && newStatType === StatType.None) {
      return triggerRef.current!.close(e);
    }
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetColumnsProperty,
          viewId,
          fieldId: field.id,
          data: {
            statType: newStatType,
          },
        });
      },
      {
        columns: Selectors.getVisibleColumns(state).map((column) => (column.fieldId === field.id ? { ...column, statType: newStatType } : column)),
      },
    );

    triggerRef.current!.close(e);
  }

  function statOptionList() {
    return (
      <div className={styles.statList} onWheel={stopPropagation} onMouseDown={stopPropagation}>
        {fieldStatTypeList &&
          fieldStatTypeList.map((item: StatType | never) => {
            return (
              <div
                key={item}
                className={styles.statItem}
                onClick={(e) => {
                  commandForStat(e, item);
                }}
              >
                {Field.bindModel(field).statType2text(item)}
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <Trigger
      action={permission.columnCountEditable ? ['click'] : ['']}
      popup={statOptionList()}
      destroyPopupOnHide
      popupAlign={{ points: ['tr', 'br'], offset: [0, 0], overflow: { adjustX: true, adjustY: true } }}
      popupStyle={{
        width: '150px',
        zIndex: 2,
        position: 'absolute',
      }}
      ref={triggerRef}
    >
      <div
        className={classNames(styles.statistics, className)}
        style={{
          ...(props.style ? props.style : {}),
          flex: fieldIndex !== 0 ? 1 : '',
          color: statType ? colors.thirdLevelText : '',
        }}
      >
        <div style={{ marginRight: '4px' }}>{statText}</div>
        <div style={{ width: '8px', display: statType ? 'inline-block' : '' }}>
          <TriangleDownFilled size={8} color={colors.fourthLevelText} />
        </div>
      </div>
    </Trigger>
  );
};

export const StatOption = React.memo(StatOptionBase);
