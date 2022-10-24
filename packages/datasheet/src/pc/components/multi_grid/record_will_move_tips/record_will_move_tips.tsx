import { CellType, DATASHEET_ID, RecordMoveType, Selectors, Strings, t } from '@apitable/core';
import { Tooltip } from 'antd';
import { useThemeColors } from '@vikadata/components';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import FiltrationIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_filter_normal.svg';
import RankIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_rank_normal.svg';

export const RecordWillMoveTips = (props: { rowHeight: number; y?: number }) => {
  const { rowHeight, y: _y } = props;
  const colors = useThemeColors();
  const sideBarVisible = useSelector(state => state.space.sideBarVisible);
  const {
    recordMoveType,
    activeCell,
  } = useSelector(state => {
    const recordMoveType = Selectors.getRecordMoveType(state);
    const activeCell = Selectors.getActiveCell(state);
    return {
      recordMoveType,
      activeCell,
    };
  }, shallowEqual);

  const ref = useRef<number>(0);
  const [y, setY] = useState<number | null>(null);
  const getActiveRelativeY = (cell: { fieldId: string, recordId: string }) => {
    const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
    // note: 这里新增对cell的处理， 原因在于处理删除record，redux的更新不会及时卸载该组件，导致数据源缺失，但是该方法
    // 依旧被触发，导致cell.row 找不到
    if (!containerDom || !cell) {
      return null;
    }
    const cellDom = containerDom.querySelector(
      `[data-record-id="${cell.recordId}"][data-field-id="${cell.fieldId}"][data-cell-type="${CellType.Record}"]`
    );
    if (cellDom) {
      const cellRect = cellDom.getBoundingClientRect();
      const containerRect = containerDom.getBoundingClientRect();
      const deltaTop = cellRect.top - containerRect.top;
      const getDelta = (delta: number, selfSize: number, containerSize: number) => {
        const safeBorder = 2;
        if (delta > safeBorder) {
          // 每超出左边界也没超出右边界
          if (delta < containerSize - selfSize) {
            return delta;
          }
          // 停在右边界
          return containerSize - selfSize - safeBorder;
        }
        // 停在左边界
        return safeBorder;
      };
      return getDelta(deltaTop, cellRect.height, containerRect.height);
    }
    return null;
  };

  useEffect(() => {
    const syncTipsPosition = () => {
      if (activeCell) {
        const { fieldId, recordId } = activeCell;
        const y = _y || getActiveRelativeY({ fieldId, recordId });
        if (y) {
          setY(y);
        }
      }
      ref.current = requestAnimationFrame(syncTipsPosition);
    };
    syncTipsPosition();
    return () => {
      cancelAnimationFrame(ref.current);
    };
  }, [_y, activeCell]);
  if (!activeCell?.recordId || y == null) return null;
  return (
    <Tooltip
      title={recordMoveType === RecordMoveType.OutOfView ? t(Strings.record_pre_filtered) : t(Strings.record_pre_move)}
      arrowPointAtCenter
      autoAdjustOverflow
      placement={sideBarVisible ? 'top' : 'right'}
    >
      <div
        style={{
          position: 'absolute',
          top: y,
          left: -24,
          cursor: 'pointer',
          borderRadius: '12px 0px 0px 12px',
          background: colors.warn,
          width: 24,
          height: rowHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <>
          {recordMoveType === RecordMoveType.OutOfView && <FiltrationIcon fill={colors.black[50]} />}
          {recordMoveType === RecordMoveType.WillMove && <RankIcon fill={colors.black[50]} />}
        </>
      </div>
    </Tooltip>
  );
};