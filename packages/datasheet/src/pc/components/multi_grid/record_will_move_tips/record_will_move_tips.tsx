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

import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { CellType, DATASHEET_ID, RecordMoveType, Selectors, Strings, t } from '@apitable/core';
import { FilterOutlined, RankOutlined } from '@apitable/icons';

import { useAppSelector } from 'pc/store/react-redux';

export const RecordWillMoveTips = (props: { rowHeight: number; y?: number }) => {
  const { rowHeight, y: _y } = props;
  const colors = useThemeColors();
  const sideBarVisible = useAppSelector((state) => state.space.sideBarVisible);
  const { recordMoveType, activeCell } = useAppSelector((state) => {
    const recordMoveType = Selectors.getRecordMoveType(state);
    const activeCell = Selectors.getActiveCell(state);
    return {
      recordMoveType,
      activeCell,
    };
  }, shallowEqual);

  const ref = useRef<number>(0);
  const [y, setY] = useState<number | null>(null);
  const getActiveRelativeY = (cell: { fieldId: string; recordId: string }) => {
    const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
    // Note: The reason for the new handling of cell is that if the record is deleted, the redux update will not unload the component in time,
    // resulting in a missing data source, but the method will still be triggered, resulting in cell.row not being found
    if (!containerDom || !cell) {
      return null;
    }
    const cellDom = containerDom.querySelector(
      `[data-record-id="${cell.recordId}"][data-field-id="${cell.fieldId}"][data-cell-type="${CellType.Record}"]`,
    );
    if (cellDom) {
      const cellRect = cellDom.getBoundingClientRect();
      const containerRect = containerDom.getBoundingClientRect();
      const deltaTop = cellRect.top - containerRect.top;
      const getDelta = (delta: number, selfSize: number, containerSize: number) => {
        const safeBorder = 2;
        if (delta > safeBorder) {
          // Not beyond the left and not beyond the right border
          if (delta < containerSize - selfSize) {
            return delta;
          }
          // Stop at the right border
          return containerSize - selfSize - safeBorder;
        }
        // Stop at the left border
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
          {recordMoveType === RecordMoveType.OutOfView && <FilterOutlined color={colors.black[50]} />}
          {recordMoveType === RecordMoveType.WillMove && <RankOutlined color={colors.black[50]} />}
        </>
      </div>
    </Tooltip>
  );
};
