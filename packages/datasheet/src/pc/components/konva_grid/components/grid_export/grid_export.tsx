import { useCreation } from 'ahooks';
import { FC, useContext } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { 
  IndicesMap, KonvaGridViewContext, KonvaGridStage, GridCoordinate, GRID_ADD_FIELD_BUTTON_WIDTH,
  DEFAULT_POINT_POSITION, GRID_BOTTOM_STAT_HEIGHT, GRID_ROW_HEAD_WIDTH, GRID_GROUP_ADD_FIELD_BUTTON_WIDTH
} from 'pc/components/konva_grid';
import { DEFAULT_SCROLL_STATE, getLinearRowHeight } from 'pc/components/gantt_view';
import { CellType, IGridViewProperty, ILinearRow, IViewColumn, RowHeightLevel, Selectors, ViewType } from '@vikadata/core';

export const getRowIndicesMap = (linearRows: ILinearRow[], rowHeight: number, viewType: ViewType = ViewType.Grid) => {
  const rowIndicesMap: IndicesMap = {};
  linearRows.forEach((row, index) => {
    const rowType = row.type;
    if (rowType !== CellType.Record) {
      rowIndicesMap[index] = getLinearRowHeight(rowType, rowHeight, viewType);
    }
  });
  return rowIndicesMap;
};

export const getColumnIndicesMap = (visibleColumns: IViewColumn[]) => {
  const columnIndicesMap: IndicesMap = {};
  visibleColumns.forEach((column, index) => {
    columnIndicesMap[index] = Selectors.getColumnWidth(column);
  });
  return columnIndicesMap;
};

interface IGridExportProps {
  fieldHeadHeight: number;
}

export const GridExport: FC<IGridExportProps> = (props) => {
  const { fieldHeadHeight } = props;
  const {
    view,
    rowHeight,
    rowHeightLevel,
    groupInfo
  } = useSelector((state) => {
    const view = Selectors.getCurrentView(state)! as IGridViewProperty;
    const rowHeightLevel = view.rowHeightLevel || RowHeightLevel.Short;
    return {
      view,
      rowHeightLevel,
      rowHeight: Selectors.getRowHeightFromLevel(rowHeightLevel),
      groupInfo: Selectors.getActiveViewGroupInfo(state),
    };
  }, shallowEqual);
  const { 
    linearRows,
    visibleColumns
  } = useContext(KonvaGridViewContext);
  const rowCount = linearRows.length;
  const { autoHeadHeight } = view;

  const instance = useCreation<GridCoordinate>(() => {
    const gridCoordinate = new GridCoordinate({
      rowHeight,
      columnWidth: 0,
      rowCount,
      columnCount: visibleColumns.length,
      containerWidth: 0,
      containerHeight: 0,
      rowIndicesMap: getRowIndicesMap(linearRows, rowHeight),
      columnIndicesMap: getColumnIndicesMap(visibleColumns),
      autoHeadHeight,
      rowInitSize: fieldHeadHeight,
      columnInitSize: GRID_ROW_HEAD_WIDTH,
      rowHeightLevel,
      frozenColumnCount: 1,
    });
    const addFieldBtnWidth = groupInfo.length ? GRID_GROUP_ADD_FIELD_BUTTON_WIDTH : GRID_ADD_FIELD_BUTTON_WIDTH;
    gridCoordinate.containerWidth = gridCoordinate.totalWidth + addFieldBtnWidth + 1;
    gridCoordinate.containerHeight = gridCoordinate.totalHeight + GRID_BOTTOM_STAT_HEIGHT;
    return gridCoordinate;
  }, []);

  return (
    <KonvaGridStage
      instance={instance}
      scrollState={DEFAULT_SCROLL_STATE}
      pointPosition={DEFAULT_POINT_POSITION}
      setPointPosition={() => {}}
      isExporting
      listening={false}
    />
  );
};