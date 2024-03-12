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

import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { indigo } from '@apitable/components';
import { ConfigConstant, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@apitable/core';
import { TComponent } from 'pc/components/common/t_component';
import { getFieldLock } from 'pc/components/field_permission';
import { AreaType, IScrollState, PointPosition } from 'pc/components/gantt_view';
import { Icon, IconType, Line, Rect } from 'pc/components/konva_components';
import { GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { useAppSelector } from 'pc/store/react-redux';
import { FieldHead } from '../components';

interface IUseHeadsProps {
  instance: GridCoordinate;
  columnStartIndex: number;
  columnStopIndex: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
  isExporting?: boolean;
}

export const useHeads = (props: IUseHeadsProps) => {
  const { instance, columnStartIndex, columnStopIndex, pointPosition, isExporting = false } = props;

  const { view, mirrorId, fieldMap, visibleColumns, sortInfo, recordRanges, permissions, fieldRanges, visibleRows, filterInfo, fieldPermissionMap } =
    useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const viewType = view.type;
  const { columnIndex: pointColumnIndex, targetName: pointTargetName, realAreaType: pointAreaType } = pointPosition;
  const { columnCount, frozenColumnWidth, frozenColumnCount, rowInitSize: fieldHeadHeight, autoHeadHeight } = instance;
  const { editable } = permissions;
  const pointFieldId = visibleColumns[pointColumnIndex]?.fieldId;

  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const { embedId } = useAppSelector((state) => state.pageParams);
  const isEmbedShow = embedId ? !embedInfo.isShowEmbedToolBar && !embedInfo.viewControl?.tabBar : false;
  const getFieldHeadStatus = useCallback(
    (fieldId: string, columnIndex: number) => {
      const iconVisible =
        (pointAreaType === AreaType.Grid ||
          [KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC, KONVA_DATASHEET_ID.GRID_FIELD_HEAD, KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE].includes(
            pointTargetName,
          )) &&
        pointFieldId === fieldId;
      const isFilterField = filterInfo ? filterInfo.conditions.some((item) => item.fieldId === fieldId) : false;
      const isSortField = sortInfo?.keepSort ? sortInfo.rules.some((sort) => sort.fieldId === fieldId) : false;
      const isHighlight = isFilterField || isSortField;
      const isSelected = Boolean(fieldRanges && fieldRanges.includes(fieldId));
      let permissionInfo: any = null;

      if (columnIndex !== 0) {
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        if (fieldPermissionMap && fieldRole) {
          permissionInfo = getFieldLock(fieldPermissionMap[fieldId].manageable ? ConfigConstant.Role.Manager : fieldRole);
        }
      }

      return {
        iconVisible,
        isHighlight,
        isSelected,
        permissionInfo,
      };
    },
    [filterInfo, sortInfo, fieldPermissionMap, fieldRanges, pointAreaType, pointFieldId, pointTargetName],
  );

  const getColumnHead = useCallback(
    (columnStartIndex: number, columnStopIndex: number, isFrozen = false) => {
      const _fieldHeads: React.ReactNode[] = [];

      for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const { fieldId } = visibleColumns[columnIndex];
        const field = fieldMap[fieldId];
        if (field == null) continue;
        const x = instance.getColumnOffset(columnIndex);
        const columnWidth = instance.getColumnWidth(columnIndex);
        const { iconVisible, isHighlight, isSelected, permissionInfo } = getFieldHeadStatus(fieldId, columnIndex);

        _fieldHeads.push(
          <FieldHead
            x={x}
            y={0}
            key={`field-head-${fieldId}`}
            width={columnWidth}
            height={fieldHeadHeight}
            field={field}
            iconVisible={iconVisible}
            permissionInfo={permissionInfo}
            isSelected={isSelected}
            isHighlight={isHighlight}
            editable={editable && !mirrorId}
            columnIndex={columnIndex}
            viewType={viewType}
            stroke={columnIndex === 0 ? 'transparent' : undefined}
            isFrozen={isFrozen}
            autoHeadHeight={autoHeadHeight}
          />,
        );
      }
      return _fieldHeads;
    },
    [columnCount, editable, fieldHeadHeight, fieldMap, getFieldHeadStatus, instance, mirrorId, viewType, visibleColumns, autoHeadHeight],
  );

  /**
   * Drawing the first column header
   */
  const frozenFieldHead = useMemo(() => {
    const isChecked = recordRanges?.length === visibleRows.length;
    const head = getColumnHead(0, frozenColumnCount - 1, true);
    return (
      <>
        <Rect
          x={0.5}
          y={0.5}
          width={GRID_ROW_HEAD_WIDTH + 1}
          height={fieldHeadHeight}
          fill={colors.defaultBg}
          cornerRadius={[8, 0, 0, 0]}
          listening={false}
        />
        <Icon
          name={KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX}
          x={28}
          y={(fieldHeadHeight - GRID_ICON_COMMON_SIZE) / 2}
          type={isChecked ? IconType.Checked : IconType.Unchecked}
          fill={isChecked ? colors.primaryColor : colors.thirdLevelText}
        />
        {head}
        <Rect
          x={0.5}
          y={0.5}
          width={frozenColumnWidth + GRID_ROW_HEAD_WIDTH}
          height={fieldHeadHeight}
          stroke={colors.sheetLineColor}
          strokeWidth={1}
          fill={'transparent'}
          cornerRadius={[isEmbedShow ? 0 : 8, 0, 0, 0]}
          listening={false}
        />
        {!isExporting && (
          <Line
            x={GRID_ROW_HEAD_WIDTH + 0.5}
            y={0.5}
            points={[0, 0, 10, 0, 0, 10]}
            closed
            stroke={indigo[100]}
            fill={indigo[100]}
            listening
            onMouseEnter={() =>
              setTooltipInfo({
                title: <TComponent tkey={t(Strings.tip_primary_field_frozen)} params={{ tag: <br /> }} />,
                visible: true,
                width: 10,
                height: 10,
                x: GRID_ROW_HEAD_WIDTH,
                y: 0,
                coordXEnable: false,
                coordYEnable: false,
              })
            }
            onMouseOut={clearTooltipInfo}
          />
        )}
      </>
    );
    // eslint-disable-next-line
  }, [
    recordRanges?.length,
    visibleRows.length,
    getColumnHead,
    frozenColumnCount,
    fieldHeadHeight,
    colors.defaultBg,
    isExporting,
    colors.primaryColor,
    colors.thirdLevelText,
    colors.sheetLineColor,
    frozenColumnWidth,
    clearTooltipInfo,
    setTooltipInfo,
  ]);

  /**
   * Drawing other column headers
   */
  const fieldHeads = useMemo(() => {
    return getColumnHead(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex);
  }, [getColumnHead, columnStartIndex, columnStopIndex, frozenColumnCount]);

  return {
    fieldHeads,
    frozenFieldHead,
  };
};
