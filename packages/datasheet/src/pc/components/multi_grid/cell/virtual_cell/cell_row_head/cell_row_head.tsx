import { useCallback } from 'react';
import * as React from 'react';
import { IGroupInfo, Selectors, ILinearRowRecord } from '@vikadata/core';
import styles from '../../styles.module.less';
import { useSelector, shallowEqual } from 'react-redux';
import { CommentCount, OperateColumn } from 'pc/components/multi_grid/operate_column';
import classNames from 'classnames';
import { OPERATE_HEAD_CLASS } from 'pc/utils';
import { GRAY_COLOR_BORDER } from '../cell_group_tab/cell_group_tab';
import { expandRecordIdNavigate } from 'pc/components/expand_record';

interface ICellRowHead {
  row: ILinearRowRecord;
  recordId: string;
  displayRowIndex: number;
  groupInfo: IGroupInfo;
  recordChecked: boolean;
  className: string;
  style?: React.CSSProperties;
}

export const CellRowHead: React.FC<ICellRowHead> = React.memo(props => {
  const { recordId, groupInfo, row, displayRowIndex, recordChecked, className, style = {}} = props;
  const operateHead = classNames({
    [OPERATE_HEAD_CLASS]: true,
    [styles.operateHead]: true,
    [className]: className.length,
  });

  const { commentCount, allowSHowCommentPane, active, activeCell } = useSelector(state => {
    const record = Selectors.getRecord(state, recordId!, state.pageParams.datasheetId!);
    return {
      commentCount: record ? record.commentCount : 0,
      allowSHowCommentPane: Selectors.allowShowCommentPane(state),
      active: Selectors.getGridViewDragState(state).hoverRecordId === recordId || recordChecked,
      activeCell: Selectors.getActiveCell(state),
    };
  }, shallowEqual);

  const count = Math.min(commentCount, 99);

  const expand = useCallback(
    () => {
      recordId && expandRecordIdNavigate(recordId);
    },
    [recordId],
  );

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
      {
        (active || activeCell?.recordId === recordId) ?
          <OperateColumn isHeader={false} recordId={recordId} commentCount={count} expand={expand} /> :
          <div className={styles.rowIndex}>
            <div />
            <div>{displayRowIndex}</div>
            {
              allowSHowCommentPane && Boolean(count) ? <CommentCount count={count} expand={expand} /> :
                <div />
            }
          </div>
      }
    </div>
  );
});
