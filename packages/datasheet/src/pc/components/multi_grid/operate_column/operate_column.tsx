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
import { useMemo } from 'react';
import * as React from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { useThemeColors } from '@apitable/components';
import { Selectors, StoreActions, Strings, t } from '@apitable/core';
import { CheckboxFilled, CommentBgFilled, DragOutlined, ExpandOutlined, UncheckedOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './styles.module.less';

interface IOperateColumnOwnProperty {
  isHeader: boolean;
  recordId?: string;
  commentCount?: number;
  expand?(): void;
}

export interface IRowCheckedProps {
  onCheck?(e: any): void;
  isChecked: boolean;
  shape?: 'default' | 'circle';
}

const noop = () => {};

export const RowChecked: React.FC<React.PropsWithChildren<IRowCheckedProps>> = (props) => {
  const colors = useThemeColors();
  const { onCheck = noop, isChecked, shape = 'default' } = props;

  if (shape === 'circle') {
    return (
      <div onClick={onCheck} className={styles.iconCheckWrapper}>
        <span className={classNames(styles.radioCheck, isChecked && styles.checked)}>
          <span className={styles.radioInner} />
        </span>
      </div>
    );
  }
  return (
    <div onClick={onCheck} className={styles.iconCheckWrapper}>
      {isChecked ? <CheckboxFilled size={15} color={colors.primaryColor} /> : <UncheckedOutlined size={15} color={colors.thirdLevelText} />}
    </div>
  );
};

export const CommentCount = ({ count, expand }: { count: number; expand(): void }) => {
  return (
    <div className={styles.commentCount} onClick={expand}>
      <CommentBgFilled />
      <span>{count}</span>
    </div>
  );
};

export const OperateColumn: React.FC<React.PropsWithChildren<IOperateColumnOwnProperty>> = React.memo((props) => {
  const { isHeader, recordId, commentCount, expand } = props;
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { datasheetId, visibleRows, recordRanges, rowSortable, isAllowDrag, allowSHowCommentPane, rowsIndexMap, visibleColumns } = useAppSelector(
    (state) => {
      const sortInfo = Selectors.getActiveViewSortInfo(state);
      const groupInfo = Selectors.getActiveViewGroupInfo(state);
      const isAllowDrag = !((!groupInfo || !groupInfo.length) && sortInfo && sortInfo.keepSort);
      return {
        datasheetId: Selectors.getActiveDatasheetId(state)!,
        visibleRows: Selectors.getVisibleRows(state),
        visibleColumns: Selectors.getVisibleColumns(state),
        recordRanges: Selectors.getSelectionRecordRanges(state),
        rowSortable: Selectors.getPermissions(state).rowSortable,
        isAllowDrag,
        allowSHowCommentPane: Selectors.allowShowCommentPane(state),
        rowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
      };
    },
    shallowEqual,
  );

  const recordIds = visibleRows.map((row) => row.recordId);
  const fieldIds = visibleColumns.map((column) => column.fieldId);

  const isChecked = useMemo(() => {
    if (!recordId) {
      return false;
    }
    return recordRanges?.includes(recordId);
  }, [recordRanges, recordId]);

  const isCheckedAll = recordRanges && recordRanges.length === recordIds.length && recordIds.length !== 0;

  function onMouseDown(e: React.MouseEvent) {
    if (!rowSortable || !isAllowDrag) {
      return;
    }
    e.persist();

    store.dispatch(
      batchActions([
        StoreActions.clearSelectionButKeepCheckedRecord(datasheetId),
        StoreActions.setDragTarget(datasheetId, {
          recordId,
        }),
      ]),
    );
  }

  function onCheck(e: MouseEvent) {
    const defaultFn = () => {
      if (recordId) {
        dispatch(StoreActions.setRecordRange(datasheetId, [recordId]));
        dispatch(
          StoreActions.setSelection({
            start: {
              recordId,
              fieldId: fieldIds[0],
            },
            end: {
              recordId,
              fieldId: fieldIds[fieldIds.length - 1],
            },
          }),
        );
      }
    };

    if (e.shiftKey) {
      if (!recordRanges || recordRanges.length === 0) {
        defaultFn();
        return;
      }

      if (recordRanges.includes(recordId!)) {
        return;
      }

      const rowIndexes = recordRanges.map((id) => rowsIndexMap.get(id)!).sort((a, b) => a - b);

      const checkedRowIndex = rowsIndexMap.get(recordId!)!;

      const [startIndex, endIndex] = [Math.min(checkedRowIndex, rowIndexes[0]), Math.max(checkedRowIndex, rowIndexes[rowIndexes.length - 1])];

      dispatch(StoreActions.setRecordRange(datasheetId, recordIds.slice(startIndex, endIndex + 1)));
      dispatch(
        StoreActions.setSelection({
          start: {
            recordId: recordIds[startIndex],
            fieldId: fieldIds[0],
          },
          end: {
            recordId: recordIds[endIndex],
            fieldId: fieldIds[fieldIds.length - 1],
          },
        }),
      );
      return;
    }

    defaultFn();
  }

  function selectAll() {
    if (isCheckedAll) {
      dispatch(StoreActions.setRecordRange(datasheetId, []));
    } else {
      dispatch(StoreActions.setRecordRange(datasheetId, recordIds));
    }
  }

  if (isHeader) {
    return (
      <div className={styles.headerIcon} onClick={selectAll} data-record-id={recordId}>
        {isCheckedAll ? <CheckboxFilled size={15} color={colors.primaryColor} /> : <UncheckedOutlined size={15} color={colors.thirdLevelText} />}
      </div>
    );
  }

  const showCommentCount = allowSHowCommentPane && Boolean(commentCount);

  return (
    <div className={styles.rowColumnIndex} data-record-id={recordId}>
      <div className={styles.dragIcon} onMouseDown={onMouseDown}>
        {isAllowDrag ? (
          <DragOutlined size={10} color={isChecked ? colors.defaultBg : colors.thirdLevelText} />
        ) : (
          <Tooltip title={t(Strings.grit_keep_sort_disable_drag)}>
            <span>
              <DragOutlined size={10} color={isChecked ? colors.defaultBg : colors.thirdLevelText} />
            </span>
          </Tooltip>
        )}
      </div>
      <RowChecked onCheck={onCheck} isChecked={isChecked!} />
      <Tooltip title={showCommentCount ? t(Strings.activity_marker) : t(Strings.expand_current_record)} placement="bottom">
        <div className={styles.expandIcon} onClick={expand} data-test-id={'expandRecordButton'}>
          {showCommentCount ? <CommentCount count={commentCount!} expand={expand!} /> : <ExpandOutlined size={15} color={colors.primaryColor} />}
        </div>
      </Tooltip>
    </div>
  );
});
