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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import {
  CellType,
  FieldType,
  ILookUpField,
  KONVA_DATASHEET_ID,
  LOOKUP_VALUE_FUNC_SET,
  PREVIEW_DATASHEET_ID,
  RollUpFuncType,
  Selectors,
  Strings,
  t,
  ThemeName,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { AreaType, generateTargetName, IScrollState, PointPosition } from 'pc/components/gantt_view';
import { Icon, Line, Rect } from 'pc/components/konva_components';
import {
  GRID_BOTTOM_STAT_HEIGHT,
  GRID_GROUP_OFFSET,
  GRID_ICON_COMMON_SIZE,
  GRID_ROW_HEAD_WIDTH,
  GridCoordinate,
  ICellHeightProps,
  KonvaGridContext,
  KonvaGridViewContext,
  useCellAlarm,
  useCellCollaborator,
  useCells,
  useDynamicCells,
  useHeads,
  useStats,
} from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { GroupTab } from '../components/cell/cell_other/group_tab';
import { RowHeadOperation } from '../components/operation_area';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const ORIGIN_HEIGHT_SET = new Set([FieldType.Number, FieldType.Percent, FieldType.Currency, FieldType.AutoNumber]);

const LOOKUP_DEFAULT_HEIGHT_SET = new Set([FieldType.Checkbox, FieldType.Attachment]);

const DEFAULT_HEIGHT_SET = new Set([
  ...LOOKUP_DEFAULT_HEIGHT_SET,
  FieldType.Rating,
  FieldType.SingleSelect,
  FieldType.CreatedBy,
  FieldType.LastModifiedBy,
]);

export const getCellHeight = (props: ICellHeightProps) => {
  const { field, realField, rowHeight, activeHeight, isActive = false } = props;

  if (!field || !isActive) return rowHeight;
  const fieldType = field.type;
  const isLookUp = fieldType === FieldType.LookUp;
  if (ORIGIN_HEIGHT_SET.has(fieldType)) return rowHeight;
  if (
    (isLookUp &&
      (!realField || LOOKUP_DEFAULT_HEIGHT_SET.has(realField.type)) &&
      !LOOKUP_VALUE_FUNC_SET.has((field as ILookUpField).property.rollUpType || RollUpFuncType.VALUES)) ||
    (!isLookUp && DEFAULT_HEIGHT_SET.has(fieldType))
  )
    return rowHeight;
  return activeHeight || rowHeight;
};

export interface IUseGridProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
  isExporting?: boolean;
}

const AddOutlinedPath = AddOutlined.toString();

export const useGrid = (props: IUseGridProps) => {
  const { instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, pointPosition, scrollState, isExporting } = props;

  const { groupInfo, activeCell, linearRows, recordRanges, visibleColumns, sortInfo, datasheetId, mirrorId, permissions } =
    useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  const { frozenColumnWidth, rowInitSize, containerWidth, containerHeight, rowCount, columnCount, frozenColumnCount } = instance;
  const { realAreaType, rowIndex: pointRowIndex } = pointPosition;
  const state = store.getState();
  const { fieldCreatable } = permissions;
  const isAllowDrag = !(!groupInfo?.length && sortInfo?.keepSort);
  const { recordId: pointRecordId, type: pointRowType } = linearRows[pointRowIndex] || {};
  const columnLength = visibleColumns.length;
  const { scrollLeft, isScrolling } = scrollState;
  const [shadowHover, setShadowHover] = useState(false);
  const themeName = useAppSelector((state) => state.theme);

  /**
   * Field header
   */
  const { frozenFieldHead, fieldHeads } = useHeads({
    instance,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
    scrollState,
    isExporting,
  });

  /**
   * Static cells
   */
  const { frozenCells, cells } = useCells({
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
  });

  /**
   * Dynamic cells in active and hover states
   */
  const {
    activedCell,
    activeCellBorder,
    frozenActivedCell,
    frozenActiveCellBorder,
    fillHandler,
    frozenFillHandler,
    placeHolderCells,
    frozenPlaceHolderCells,
    draggingOutline,
    toggleEditing,
  } = useDynamicCells({
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    scrollState,
  }) as any;

  /**
   * Group tab and statistics column at the bottom of the group
   */
  const { groupStats, frozenGroupStats, bottomStats, bottomFrozenStats, bottomStatBackground } = useStats({
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
  });

  /**
   * Cell sync related
   */
  const {
    collaboratorAvatars,
    frozenCollaboratorAvatars,
    collaboratorBorders,
    frozenCollaboratorBorders,
    activeCollaboratorBorder,
    frozenActiveCollaboratorBorder,
  } = useCellCollaborator({
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
  });

  const { dateAlarms, dateAddAlarm, frozenDateAddAlarm, frozenDateAlarms } = useCellAlarm({
    instance,
    scrollState,
    rowStartIndex,
    rowStopIndex,
    columnStopIndex,
    pointPosition,
    toggleEditing,
  });

  /**
   * Includes placeholders for group tabs, blank rows, and add rows buttons
   */
  const otherRows: React.ReactNode[] = [];
  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    if (rowIndex > rowCount - 1) break;

    const { recordId, type, depth } = linearRows[rowIndex];
    if (type === CellType.Record) continue;
    const y = instance.getRowOffset(rowIndex);
    const curHeight = instance.getRowHeight(rowIndex);

    switch (type) {
      case CellType.Add: {
        otherRows.push(
          <Rect
            key={`row-add-${depth}-${recordId}`}
            y={y + 1}
            name={KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON}
            width={containerWidth}
            height={curHeight - 1}
            fill={'transparent'}
          />,
        );
        break;
      }
      case CellType.GroupTab: {
        const offsetX = depth * GRID_GROUP_OFFSET;
        const firstColumnWidth = instance.getColumnWidth(0);
        otherRows.push(
          <GroupTab
            key={`row-tab-${depth}-${recordId}`}
            x={offsetX}
            y={y}
            width={GRID_ROW_HEAD_WIDTH + firstColumnWidth - offsetX}
            height={curHeight}
            depth={depth}
            recordId={recordId}
          />,
        );
      }
    }
  }

  // Row head toolbar
  const hoverRowHeadOperation: React.ReactNode[] = [];
  const datasheet = useAppSelector((state) => Selectors.getDatasheet(state));
  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    if (rowIndex > rowCount - 1) break;
    const row = linearRows[rowIndex];
    if (row == null) continue;
    const { type, recordId } = row;
    if (type !== CellType.Record || recordId == null) continue;
    const isActive = activeCell?.recordId === recordId;
    const isChecked = Boolean(recordRanges?.includes(recordId!));
    if (!isActive && !isChecked && realAreaType === AreaType.None) continue;
    const isHovered = recordId === pointRecordId && pointRowType === CellType.Record;
    const commentCount = Selectors.getRecord(state, recordId, datasheetId)?.commentCount || 0;
    const isPreview = datasheet?.id === PREVIEW_DATASHEET_ID;
    hoverRowHeadOperation.push(
      <RowHeadOperation
        key={`hover-head-operation-${recordId}`}
        instance={instance}
        isChecked={isChecked}
        isHovered={isHovered}
        isActive={isActive}
        rowIndex={rowIndex}
        commentCount={commentCount}
        isAllowDrag={isAllowDrag}
        isPreview={isPreview}
        recordId={recordId}
      />,
    );
  }

  /**
   * Add column button
   */
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const { embedId } = useAppSelector((state) => state.pageParams);
  const isEmbedShow = embedId ? !embedInfo.isShowEmbedToolBar && !embedInfo.viewControl?.tabBar : false;
  const addFieldBtn = useMemo(() => {
    if (columnStopIndex !== columnLength - 1) return;
    const { fieldId } = visibleColumns[columnStopIndex];
    const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
    const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
    const x = lastColumnOffset + lastColumnWidth;
    const btnWidth = groupInfo.length ? 40 : 100;
    const offsetX = (btnWidth - GRID_ICON_COMMON_SIZE) / 2;
    const offsetY = (rowInitSize - GRID_ICON_COMMON_SIZE) / 2;
    const creatable = !mirrorId && fieldCreatable;
    return (
      <Group x={x}>
        {!isExporting && <Rect x={0.5} y={0.5} width={btnWidth + 1} height={8} fill={colors.lowestBg} listening={false} />}
        <Rect
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GRID_FIELD_ADD_BUTTON,
            fieldId,
            mouseStyle: 'pointer',
          })}
          x={0.5}
          y={0.5}
          width={btnWidth}
          height={rowInitSize}
          cornerRadius={[0, isEmbedShow ? 0 : 8, 0, 0]}
          stroke={colors.sheetLineColor}
          strokeWidth={1}
          listening={creatable}
        />
        {creatable && <Icon x={offsetX} y={offsetY} data={AddOutlinedPath} fill={colors.thirdLevelText} listening={false} />}
      </Group>
    );
    // eslint-disable-next-line
  }, [
    columnStopIndex,
    columnLength,
    visibleColumns,
    instance,
    groupInfo.length,
    rowInitSize,
    mirrorId,
    fieldCreatable,
    colors.lowestBg,
    colors.sheetLineColor,
    colors.thirdLevelText,
    isExporting,
  ]);

  const getOpacityLines = useCallback(
    (columnStartIndex: number, columnStopIndex: number) => {
      const opacityLines: React.ReactNode[] = [];

      for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;

        const x = instance.getColumnOffset(columnIndex);
        const { fieldId } = visibleColumns[columnIndex];
        const columnWidth = instance.getColumnWidth(columnIndex);

        opacityLines.push(
          <Rect
            key={`opacity-line-${fieldId}`}
            name={generateTargetName({
              targetName: KONVA_DATASHEET_ID.GRID_FIELD_HEAD_OPACITY_LINE,
              fieldId,
            })}
            x={x + columnWidth - 3}
            width={6}
            height={rowInitSize}
            fill={'transparent'}
          />,
        );
      }
      return opacityLines;
    },
    [columnCount, instance, visibleColumns, rowInitSize],
  );

  /**
   * First column width draggable area
   */
  const frozenOpacityLines = useMemo(() => {
    if (isScrolling) return null;
    return getOpacityLines(0, frozenColumnCount - 1);
  }, [frozenColumnCount, getOpacityLines, isScrolling]);

  /**
   * Column width draggable area
   */
  const opacityLines = useMemo(() => {
    if (isScrolling) return null;
    return getOpacityLines(columnStartIndex, columnStopIndex);
  }, [columnStartIndex, columnStopIndex, getOpacityLines, isScrolling]);

  /**
   * First column edge projection
   */
  const frozenShadowVisible = scrollLeft > 0;
  const remainWidth = containerWidth - frozenColumnWidth;
  const frozenFieldSplitter = useMemo(() => {
    if (frozenColumnCount === 1 && !frozenShadowVisible) {
      return {
        top: null,
        middle: null,
        bottom: null,
        topPlaceholder: null,
        bottomPlaceholder: null,
      };
    }
    const finalColor = shadowHover ? colors.borderCommonHover : colors.borderGridVertical;
    const baseProps = {
      x: GRID_ROW_HEAD_WIDTH + frozenColumnWidth + 0.5,
      stroke: colors.borderGridVertical,
      strokeWidth: 1,
    };
    const commonProps = {
      x: GRID_ROW_HEAD_WIDTH + frozenColumnWidth + 0.5,
      stroke: finalColor,
      strokeWidth: 1,
    };
    const shadowProps = frozenShadowVisible
      ? {
        shadowColor: themeName === ThemeName.Light ? '#E7E8EC' : '#191919',
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowForStrokeEnabled: true,
      }
      : {};

    const top = <Line points={[0, 0, 0, rowInitSize]} {...commonProps} {...shadowProps} />;
    const middle = (
      <Group x={0} y={0}>
        <Line points={[0, rowInitSize, 0, containerHeight - GRID_BOTTOM_STAT_HEIGHT]} {...baseProps} />
        <Line points={[0, rowInitSize, 0, containerHeight - GRID_BOTTOM_STAT_HEIGHT]} {...commonProps} {...shadowProps} />
      </Group>
    );
    const bottom = (
      <Group x={0} y={0}>
        <Line points={[0, containerHeight - GRID_BOTTOM_STAT_HEIGHT, 0, containerHeight]} {...baseProps} {...shadowProps} />
        <Line points={[0, containerHeight - GRID_BOTTOM_STAT_HEIGHT, 0, containerHeight]} {...commonProps} {...shadowProps} />
      </Group>
    );
    const generatePlaceholder = (y: number, height: number) => (
      <Rect
        name={KONVA_DATASHEET_ID.GRID_FROZEN_SHADOW_LINE}
        x={GRID_ROW_HEAD_WIDTH + frozenColumnWidth - 2.5}
        y={y}
        width={6}
        height={height}
        fill={'transparent'}
        onMouseEnter={(e: any) => {
          const y = e.evt.layerY;
          const offsetX = remainWidth <= 385 ? -5 : 5;
          setShadowHover(true);
          setTooltipInfo({
            title: t(Strings.freeze_line_tips),
            visible: true,
            placement: 'right',
            x: GRID_ROW_HEAD_WIDTH + frozenColumnWidth + offsetX,
            y,
            width: 0,
            height: 1,
            coordXEnable: false,
            coordYEnable: false,
          });
        }}
        onMouseLeave={() => {
          setShadowHover(false);
          clearTooltipInfo();
        }}
      />
    );
    return {
      top,
      middle,
      bottom,
      topPlaceholder: generatePlaceholder(rowInitSize, containerHeight - rowInitSize),
      bottomPlaceholder: generatePlaceholder(containerHeight - GRID_BOTTOM_STAT_HEIGHT, GRID_BOTTOM_STAT_HEIGHT),
    };
  }, [
    containerHeight,
    frozenColumnWidth,
    frozenShadowVisible,
    remainWidth,
    shadowHover,
    setTooltipInfo,
    clearTooltipInfo,
    frozenColumnCount,
    rowInitSize,
    colors.borderCommonHover,
    colors.borderGridVertical,
    themeName,
  ]);

  return {
    fieldHeads,
    frozenFieldHead,
    fillHandler,
    frozenFillHandler,
    hoverRowHeadOperation,
    frozenCells,
    cells,
    dateAlarms,
    frozenDateAlarms,
    dateAddAlarm,
    frozenDateAddAlarm,
    activedCell,
    activeCellBorder,
    frozenActivedCell,
    frozenActiveCellBorder,
    otherRows,
    addFieldBtn,
    groupStats,
    frozenGroupStats,
    bottomStats,
    bottomFrozenStats,
    bottomStatBackground,
    opacityLines,
    frozenOpacityLines,
    collaboratorAvatars,
    frozenCollaboratorAvatars,
    frozenFieldSplitter,
    collaboratorBorders,
    frozenCollaboratorBorders,
    activeCollaboratorBorder,
    frozenActiveCollaboratorBorder,
    placeHolderCells,
    frozenPlaceHolderCells,
    draggingOutline,
  };
};
