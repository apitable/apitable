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

import { isEmpty } from 'lodash';
import dynamic from 'next/dynamic';
import { FC, memo, useContext, useEffect } from 'react';
import { FieldType, Selectors, StoreActions } from '@apitable/core';
import { Rect } from 'pc/components/konva_components';
import { GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, KonvaGridViewContext, useGrid } from 'pc/components/konva_grid';
import { useDispatch, useQuery } from 'pc/hooks';
import { store } from 'pc/store';
import { EXPORT_BRAND_DESC_HEIGHT, EXPORT_IMAGE_PADDING, useBrandDesc, useViewWatermark } from '../gantt_view';
import { IScrollState, PointPosition } from '../gantt_view/interface';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_GROUP_ADD_FIELD_BUTTON_WIDTH } from './constant';

const Layer = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/layer'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

export interface IKonvaGridProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  offsetX?: number;
  isExporting?: boolean;
}

export const KonvaGrid: FC<React.PropsWithChildren<IKonvaGridProps>> = memo((props) => {
  const { instance, scrollState, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, pointPosition, offsetX = 0, isExporting } = props;

  const {
    fieldHeads,
    frozenFieldHead,
    fillHandler,
    frozenFillHandler,
    hoverRowHeadOperation,
    frozenCells,
    cells,
    dateAlarms,
    frozenDateAlarms,
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
    dateAddAlarm,
    frozenDateAddAlarm,
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
  } = useGrid({
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
    scrollState,
    isExporting,
  });

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { scrollTop, scrollLeft } = scrollState;
  const { groupInfo, datasheetId, fieldMap } = useContext(KonvaGridViewContext);
  const { frozenColumnWidth, containerWidth, containerHeight, rowInitSize } = instance;
  const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
  const lastColumnWidth = instance.getColumnWidth(columnStopIndex);
  const lastColumnOffset = instance.getColumnOffset(columnStopIndex);
  const addFieldBtnWidth = groupInfo.length ? GRID_GROUP_ADD_FIELD_BUTTON_WIDTH : GRID_ADD_FIELD_BUTTON_WIDTH;
  const cellGroupClipWidth = Math.min(
    containerWidth - frozenAreaWidth,
    addFieldBtnWidth + lastColumnOffset + lastColumnWidth - scrollLeft - frozenAreaWidth,
  );

  const watermarkText = useViewWatermark({
    containerWidth,
    containerHeight: containerHeight + 16,
    isExporting,
  });

  const brandDesc = useBrandDesc({
    containerWidth,
    containerHeight: containerHeight + 16,
    isExporting,
  });

  const query = useQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    // first render try to focus workdoc cell
    const recordId = query.get('recordId');
    const fieldId = query.get('fieldId');
    if (recordId && fieldId) {
      const fieldType = fieldMap[fieldId]?.type;
      const state = store.getState();
      const snapshot = Selectors.getSnapshot(state, datasheetId)!;
      const cv = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      if (fieldType === FieldType.WorkDoc && !isEmpty(cv)) {
        dispatch(
          StoreActions.setActiveCell(datasheetId, {
            recordId,
            fieldId,
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layer>
      {isExporting && (
        <Rect
          width={containerWidth + EXPORT_IMAGE_PADDING * 2}
          height={containerHeight + EXPORT_IMAGE_PADDING * 2 + EXPORT_BRAND_DESC_HEIGHT}
          fill={colors.fc6}
        />
      )}
      <Group x={isExporting ? EXPORT_IMAGE_PADDING : undefined} y={isExporting ? EXPORT_IMAGE_PADDING : undefined}>
        <Group clipX={offsetX} clipY={0} clipWidth={containerWidth - offsetX} clipHeight={containerHeight}>
          <Group x={offsetX}>
            <Group offsetY={scrollTop}>
              {frozenCells}
              {otherRows}
              {hoverRowHeadOperation}
              {frozenGroupStats}
              {frozenPlaceHolderCells}
              {frozenCollaboratorBorders}
              {frozenActivedCell}
              {frozenDateAlarms}
              {frozenDateAddAlarm}
            </Group>
            {!isExporting && <Rect width={8} height={8} fill={colors.lowestBg} listening={false} />}
            {frozenFieldHead}
            {frozenOpacityLines}
            <Group clipX={frozenAreaWidth + 1} clipY={0} clipWidth={cellGroupClipWidth} clipHeight={containerHeight}>
              <Group offsetX={scrollLeft} offsetY={scrollTop}>
                {cells}
                {groupStats}
              </Group>
              <Group offsetX={scrollLeft}>
                {fieldHeads}
                {opacityLines}
                {addFieldBtn}
              </Group>
            </Group>
            {frozenFieldSplitter.top}
            {frozenFieldSplitter.middle}
            <Group
              clipX={frozenAreaWidth - 1}
              clipY={rowInitSize - 1}
              clipWidth={containerWidth - frozenAreaWidth}
              clipHeight={containerHeight - rowInitSize}
            >
              <Group offsetX={scrollLeft} offsetY={scrollTop}>
                {placeHolderCells}
                {collaboratorBorders}
                {activedCell}
                {activeCellBorder}
                {activeCollaboratorBorder}
                {fillHandler}
                {draggingOutline}
                {dateAlarms}
                {dateAddAlarm}
                {collaboratorAvatars}
              </Group>
            </Group>
            {frozenFieldSplitter.topPlaceholder}
            <Group clipX={0} clipY={rowInitSize - 1} clipWidth={frozenAreaWidth + 4} clipHeight={containerHeight - rowInitSize}>
              <Group offsetY={scrollTop}>
                {frozenActiveCellBorder}
                {frozenActiveCollaboratorBorder}
                {frozenFillHandler}
                {frozenCollaboratorAvatars}
              </Group>
            </Group>
          </Group>
        </Group>
        {bottomStatBackground}
        <Group clipX={offsetX} clipY={0} clipWidth={containerWidth - offsetX} clipHeight={containerHeight}>
          <Group x={offsetX}>
            <Group offsetX={scrollLeft}>{bottomStats}</Group>
            {bottomFrozenStats}
            {frozenFieldSplitter.bottom}
            {frozenFieldSplitter.bottomPlaceholder}
          </Group>
        </Group>
      </Group>

      {isExporting && (
        <>
          {watermarkText}
          {brandDesc}
        </>
      )}
    </Layer>
  );
});
