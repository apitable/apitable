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
import { ReactNode, useContext } from 'react';
import { CellType, ILinearRowRecord, KONVA_DATASHEET_ID, Selectors } from '@apitable/core';
import { AvatarSize } from 'pc/components/common';
import { generateTargetName, getDetailByTargetName } from 'pc/components/gantt_view';
import { Line, Rect } from 'pc/components/konva_components';
import { getCellHeight, getCellHorizontalPosition, IUseGridBaseProps, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { backCorrectName, getCollaboratorColor } from 'pc/components/multi_grid/cell/cell_other';
import { store } from 'pc/store';
import { Avatar } from '../components';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });
const EMPTY_ARRAY: never[] = [];

const COLLABORATOR_CELL_TARGET_NAMES = new Set([KONVA_DATASHEET_ID.GRID_CELL, KONVA_DATASHEET_ID.GRID_COLLABORATOR_AVATAR]);

export const useCellCollaborator = (props: IUseGridBaseProps) => {
  const { instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, pointPosition } = props;

  const { fieldMap, linearRows, visibleColumns, collaboratorCursorMap, activeCell } = useContext(KonvaGridViewContext);
  const { setTooltipInfo, clearTooltipInfo, activeCellBound } = useContext(KonvaGridContext);
  const state = store.getState();
  const { rowHeight, rowCount, columnCount, frozenColumnCount } = instance;
  const { targetName, realTargetName, columnIndex: pointColumnIndex } = pointPosition;
  const { fieldId: targetFieldId, recordId: targetRecordId } = getDetailByTargetName(realTargetName);

  let frozenCollaboratorAvatars: React.ReactNode[] | null = null;
  let collaboratorAvatars: React.ReactNode[] | null = null;
  const collaboratorCell =
    (COLLABORATOR_CELL_TARGET_NAMES.has(targetName) && collaboratorCursorMap[`${targetFieldId}_${targetRecordId}`]) || EMPTY_ARRAY;
  if (collaboratorCell.length) {
    const cellUIIndex = Selectors.getCellUIIndex(state, {
      fieldId: targetFieldId!,
      recordId: targetRecordId!,
    });
    if (cellUIIndex) {
      const { rowIndex, columnIndex } = cellUIIndex;
      const tempCollaboratorAvatars: React.ReactNode[] = [];
      const { displayIndex } = linearRows[rowIndex] as ILinearRowRecord;
      const x = instance.getColumnOffset(columnIndex);
      const y = instance.getRowOffset(rowIndex);
      const columnWidth = instance.getColumnWidth(columnIndex);
      const isBottom = [1, 2].includes(displayIndex);
      const isActive = activeCell?.recordId === targetRecordId && activeCell?.fieldId === targetFieldId;
      const field = fieldMap[targetFieldId!];
      const height = getCellHeight({
        field,
        rowHeight,
        activeHeight: activeCellBound.height,
        isActive,
      });
      const realY = isBottom ? y + height : y - AvatarSize.Size24;
      const isFrozen = columnIndex < frozenColumnCount;

      for (let i = 0; i < collaboratorCell.length; i++) {
        const c = collaboratorCell[i];
        const userId = c.userId;
        if (!userId) continue;
        const color = getCollaboratorColor(c);
        const radius = AvatarSize.Size24 / 2 + 1;
        const realX = x + columnWidth - AvatarSize.Size24 * (i + 1) - 4 * i;
        tempCollaboratorAvatars.push(
          <Group
            key={`collaborator-${userId}`}
            x={realX}
            y={realY}
            onMouseEnter={() => {
              setTooltipInfo({
                title: c.userName,
                visible: true,
                width: AvatarSize.Size24,
                height: AvatarSize.Size24,
                x: realX,
                y: realY,
                coordXEnable: !isFrozen,
              });
            }}
            onMouseOut={clearTooltipInfo}
          >
            <Rect
              name={generateTargetName({
                targetName: KONVA_DATASHEET_ID.GRID_COLLABORATOR_AVATAR,
                fieldId: targetFieldId,
                recordId: targetRecordId,
              })}
              width={AvatarSize.Size24}
              height={AvatarSize.Size24}
              fill={'transparent'}
            />
            <Group y={isBottom ? 2 : -2} listening={false}>
              <Circle x={radius} y={radius} radius={radius} fill={color} />
              <Avatar x={1} y={1} id={userId} size={AvatarSize.Size24} src={c.avatar} title={backCorrectName(c)} />
            </Group>
          </Group>,
        );
      }
      if (pointColumnIndex < frozenColumnCount) {
        frozenCollaboratorAvatars = tempCollaboratorAvatars;
      } else {
        collaboratorAvatars = tempCollaboratorAvatars;
      }
    }
  }

  const getCollaboratorBorders = (columnStartIndex: number, columnStopIndex: number) => {
    const borders: React.ReactNode[] = [];
    let activeBorder: ReactNode = null;

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      if (columnIndex > columnCount - 1) break;
      const { fieldId } = visibleColumns[columnIndex];
      const field = fieldMap[fieldId];
      if (field == null) continue;
      const x = instance.getColumnOffset(columnIndex);

      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > rowCount - 1) break;
        const { recordId, depth, type } = linearRows[rowIndex];
        if (type !== CellType.Record) continue;
        const collaboratorCell = collaboratorCursorMap[`${fieldId}_${recordId}`] || EMPTY_ARRAY;
        if (!collaboratorCell.length) continue;

        const y = instance.getRowOffset(rowIndex);
        const isActive = activeCell?.recordId === recordId && activeCell?.fieldId === fieldId;
        const columnWidth = instance.getColumnWidth(columnIndex);
        const realField = Selectors.findRealField(state, field);
        const height = getCellHeight({
          field,
          realField,
          rowHeight,
          activeHeight: activeCellBound.height,
          isActive,
        });
        const collaborator = collaboratorCell.reduce((a, b) => (a > b ? a : b));
        const stroke = getCollaboratorColor(collaborator);
        const { width, offset } = getCellHorizontalPosition({
          depth,
          columnWidth,
          columnIndex,
          columnCount,
        });
        const realX = x + offset;

        const tmpBorder = (
          <Line
            key={`collaborator-${fieldId}-${recordId}`}
            x={realX + 0.5}
            y={y + 0.5}
            points={[0, 0, width, 0, width, height, 0, height]}
            closed
            stroke={stroke}
            strokeWidth={1}
          />
        );

        if (isActive) {
          activeBorder = tmpBorder;
          continue;
        }
        borders.push(tmpBorder);
      }
    }

    return {
      borders,
      activeBorder,
    };
  };

  const { borders: frozenCollaboratorBorders, activeBorder: frozenActiveCollaboratorBorder } = getCollaboratorBorders(0, frozenColumnCount - 1);

  const { borders: collaboratorBorders, activeBorder: activeCollaboratorBorder } = getCollaboratorBorders(
    Math.max(columnStartIndex, frozenColumnCount),
    columnStopIndex,
  );

  return {
    frozenCollaboratorAvatars,
    collaboratorAvatars,
    frozenCollaboratorBorders,
    collaboratorBorders,
    frozenActiveCollaboratorBorder,
    activeCollaboratorBorder,
  };
};
