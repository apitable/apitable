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
import { PropsWithChildren } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { GridChildComponentProps } from 'react-window';
import { CellType, IGridViewColumn, IGridViewProperty, ILinearRowRecord, ILinearRow, RecordMoveType, Selectors, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { GRID_VIEW_BLANK_HEIGHT } from '../constant';
import { CellValueContainer } from './cell_value_container';
import { CellAddField } from './virtual_cell/cell_add_field/cell_add_field';
import { CellAddRecord } from './virtual_cell/cell_add_record/cell_add_record';
import { CellBlank } from './virtual_cell/cell_blank/cell_blank';
import { CellGroupOffset } from './virtual_cell/cell_group_offset/cell_group_offset';
import { CellGroupTab } from './virtual_cell/cell_group_tab/cell_group_tab';
import styles from './styles.module.less';

interface IData {
  isGroupEmptyContent: boolean; // TODO: Remove here
  datasheetId: string;
  rowHeightLevel: number;
  columns: IGridViewColumn[];
  // rows: IRowsForGroup;
  recordMoveType: RecordMoveType;
  rows: ILinearRow[];
}

export interface ICellFuncOwnProps {
  data: IData;
  rowIndex: number;
  columnIndex: number;
  style: React.CSSProperties;
  rightRegion: boolean;
}

const CellFunc: React.FC<React.PropsWithChildren<GridChildComponentProps & ICellFuncOwnProps>> = ({
  rowIndex,
  data,
  columnIndex,
  style: _style,
  rightRegion,
}) => {
  const { isGroupEmptyContent, datasheetId, rowHeightLevel, columns, recordMoveType, rows } = data as IData;

  const style = {
    ..._style,
    // Uniformly add animations to all cells
    transition: 'top 0.2s ease-in-out 0.2s',
  };
  const { permissions, groupInfo, columnsLength, actualColumnIndex } = useAppSelector((state) => {
    const view = Selectors.getCurrentView(state) as IGridViewProperty;
    return {
      permissions: Selectors.getPermissions(state),
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      columnsLength: Selectors.getVisibleColumns(state).length,
      actualColumnIndex: rightRegion ? columnIndex + view.frozenColumnCount : columnIndex,
    };
  }, shallowEqual);

  const preRow = rows[rowIndex - 1] as ILinearRowRecord;
  const row = rows[rowIndex];
  const nextRow = rows[rowIndex + 1];
  const isNextRowBlank = (nextRow && nextRow.type === CellType.Blank) || !nextRow;
  const needOffsetBorderBottom = row && row.type === CellType.Blank && isNextRowBlank;
  let gridCellWrapper = classNames(styles.gridCellWrapper);
  gridCellWrapper = classNames(gridCellWrapper, styles.cellLevelTop1);
  const debugging = localStorage.getItem('render_debugging');

  // Horizontal standing blank processing
  if (!row) {
    // Spacing at the bottom of the grid
    return <div style={{ ...style, height: GRID_VIEW_BLANK_HEIGHT }} />;
  }

  // Add column processing for vertical stations
  if (actualColumnIndex === columnsLength) {
    return (
      <CellAddField
        groupInfo={groupInfo}
        permissions={permissions}
        rowIndex={rowIndex}
        actualColumnIndex={actualColumnIndex}
        rows={rows}
        style={style}
        className={gridCellWrapper}
        isEmptyRows={isGroupEmptyContent}
      />
    );
  }

  const renderCell = () => {
    switch (row.type) {
      case CellType.Blank:
        return (
          <CellBlank
            groupLength={groupInfo.length}
            row={row}
            actualColumnIndex={actualColumnIndex}
            style={style}
            columnsLength={columnsLength}
            needOffsetBorderBottom={needOffsetBorderBottom}
          />
        );
      case CellType.GroupTab:
        return (
          <CellGroupTab
            columnsLength={columnsLength}
            actualColumnIndex={actualColumnIndex}
            row={row}
            style={style}
            groupInfo={groupInfo}
            isSort={!rightRegion}
          />
        );
      case CellType.Add:
        return (
          <CellAddRecord
            groupInfo={groupInfo}
            permissions={permissions}
            actualColumnIndex={actualColumnIndex}
            row={row}
            preRow={preRow}
            style={style}
            className={gridCellWrapper}
            columnsLength={columnsLength}
            rightRegion={rightRegion}
            isEmptyRows={isGroupEmptyContent}
          />
        );
      case CellType.Record:
        return (
          <>
            {debugging ? (
              <div style={style}>{t(Strings.debug_cell_text_1)}</div>
            ) : (
              <CellValueContainer
                datasheetId={datasheetId}
                rowHeightLevel={rowHeightLevel}
                columns={columns}
                style={style}
                groupInfo={groupInfo}
                gridCellWrapper={gridCellWrapper}
                actualColumnIndex={actualColumnIndex}
                row={row}
                recordMoveType={recordMoveType}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };
  return (
    <CellGroupOffset
      groupLength={groupInfo.length}
      columnsLength={columnsLength}
      actualColumnIndex={actualColumnIndex}
      isEmptyRows={isGroupEmptyContent || (row.type === CellType.Blank && row.depth === 0)}
      style={style}
      isGroupTab
      needOffsetBorderBottom={needOffsetBorderBottom}
      row={row}
      nextRow={nextRow}
    >
      {renderCell()}
    </CellGroupOffset>
  );
};

const CellFuncRight = (props: PropsWithChildren<GridChildComponentProps>) => {
  return CellFunc({ ...props, rightRegion: true });
};

const CellFuncLeft = (props: PropsWithChildren<GridChildComponentProps>) => {
  return CellFunc({ ...props, rightRegion: false });
};

const areEqual = (
  prevProps: Readonly<PropsWithChildren<GridChildComponentProps>>,
  nextProps: Readonly<PropsWithChildren<GridChildComponentProps>>,
) => {
  const { style: prevStyle, data: prevData, ...prevRest } = prevProps;
  const { style: nextStyle, data: nextData, ...nextRest } = nextProps;
  return shallowEqual(prevStyle, nextStyle) && shallowEqual(prevData, nextData) && shallowEqual(prevRest, nextRest);
};

export const CellRight = React.memo(CellFuncRight, areEqual);

export const CellLeft = React.memo(CellFuncLeft, areEqual);
