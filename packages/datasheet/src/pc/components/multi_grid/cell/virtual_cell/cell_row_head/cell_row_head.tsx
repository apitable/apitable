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
import { useCallback } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { IGroupInfo, Selectors, ILinearRowRecord } from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { CommentCount, OperateColumn } from 'pc/components/multi_grid/operate_column';
import { useAppSelector } from 'pc/store/react-redux';
import { OPERATE_HEAD_CLASS } from 'pc/utils';
import styles from '../../styles.module.less';
import { GRAY_COLOR_BORDER } from '../cell_group_tab/cell_group_tab';

interface ICellRowHead {
  row: ILinearRowRecord;
  recordId: string;
  displayRowIndex: number;
  groupInfo: IGroupInfo;
  recordChecked: boolean;
  className: string;
  style?: React.CSSProperties;
}

export const CellRowHead: React.FC<React.PropsWithChildren<ICellRowHead>> = React.memo((props) => {
  const { recordId, groupInfo, row, displayRowIndex, recordChecked, className, style = {} } = props;
  const operateHead = classNames({
    [OPERATE_HEAD_CLASS]: true,
    [styles.operateHead]: true,
    [className]: className.length,
  });

  const { commentCount, allowSHowCommentPane, active, activeCell } = useAppSelector((state) => {
    const record = Selectors.getRecord(state, recordId!, state.pageParams.datasheetId!);
    return {
      commentCount: record ? record.commentCount : 0,
      allowSHowCommentPane: Selectors.allowShowCommentPane(state),
      active: Selectors.getGridViewDragState(state).hoverRecordId === recordId || recordChecked,
      activeCell: Selectors.getActiveCell(state),
    };
  }, shallowEqual);

  const count = Math.min(commentCount, 99);

  const expand = useCallback(() => {
    recordId && expandRecordIdNavigate(recordId);
  }, [recordId]);

  return (
    <div
      className={operateHead}
      style={{
        borderBottom: groupInfo.length ? GRAY_COLOR_BORDER : '',
        ...style,
      }}
      data-record-id={row.recordId}
      data-row-index={displayRowIndex}
    >
      {active || activeCell?.recordId === recordId ? (
        <OperateColumn isHeader={false} recordId={recordId} commentCount={count} expand={expand} />
      ) : (
        <div className={styles.rowIndex}>
          <div />
          <div>{displayRowIndex}</div>
          {allowSHowCommentPane && Boolean(count) ? <CommentCount count={count} expand={expand} /> : <div />}
        </div>
      )}
    </div>
  );
});
