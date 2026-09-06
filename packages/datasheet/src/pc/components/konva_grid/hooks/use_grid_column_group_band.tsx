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

import { KonvaEventObject } from 'konva/lib/Node';
import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { contextMenuHideAll, contextMenuShow } from '@apitable/components';
import { IColumnGroup, IGridViewProperty, KONVA_DATASHEET_ID, Strings, t } from '@apitable/core';
import { ColumnGroupBand } from '../components';
import { GRID_COLUMN_GROUP_BAND_HEIGHT } from '../constant';
import { KonvaGridViewContext } from '../context';
import { GridCoordinate } from '../model';

interface IUseGridColumnGroupBandProps {
  instance: GridCoordinate;
  columnStartIndex: number;
  columnStopIndex: number;
}

/**
 * One contiguous run of columns (by column index, inclusive) that all belong to the same
 * field(column) group. A single `IColumnGroup` can produce several of these when its
 * `fieldIds` are interrupted by columns that aren't part of the group (or belong to another
 * group) in the current column order.
 */
interface IColumnGroupSegment {
  group: IColumnGroup;
  startIndex: number;
  endIndex: number;
}

export const useGridColumnGroupBand = (props: IUseGridColumnGroupBandProps) => {
  const { instance, columnStartIndex, columnStopIndex } = props;
  const { view, visibleColumns, mirrorId, permissions } = useContext(KonvaGridViewContext);
  const { columnCount, frozenColumnCount } = instance;

  const columnGroups = (view as IGridViewProperty).columnGroups;

  // fieldId -> the group it belongs to (a field can only belong to a single group).
  const fieldIdToGroupMap = useMemo(() => {
    const map = new Map<string, IColumnGroup>();
    if (!columnGroups?.length) return map;
    for (const group of columnGroups) {
      for (const fieldId of group.fieldIds) {
        map.set(fieldId, group);
      }
    }
    return map;
  }, [columnGroups]);

  const showColumnGroupMenu = useCallback(
    (event: KonvaEventObject<MouseEvent>, columnGroupId: string) => {
      event.evt.preventDefault();
      event.evt.stopPropagation();
      event.cancelBubble = true;
      contextMenuHideAll();
      if (mirrorId || !permissions.editable) return;
      contextMenuShow(event.evt as unknown as React.MouseEvent<HTMLElement>, KONVA_DATASHEET_ID.GRID_COLUMN_GROUP_MENU, {
        props: { columnGroupId },
      });
    },
    [mirrorId, permissions.editable],
  );

  /**
   * Walk the visible columns in [columnStartIndex, columnStopIndex] and collapse consecutive
   * columns that resolve to the same group into a single segment. Groups are not assumed to be
   * contiguous in `fieldIds` — whenever the resolved group changes (including transitions to/from
   * "no group"), the current segment is closed and a new one (if any) is opened, so a group split
   * by unrelated columns naturally produces multiple segments.
   */
  const getColumnGroupSegments = useCallback(
    (columnStartIndex: number, columnStopIndex: number) => {
      const segments: IColumnGroupSegment[] = [];
      if (!fieldIdToGroupMap.size) return segments;
      let current: IColumnGroupSegment | null = null;

      for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const column = visibleColumns[columnIndex];
        if (column == null) continue;
        const group = fieldIdToGroupMap.get(column.fieldId) ?? null;

        if (group == null) {
          current = null;
          continue;
        }
        if (current && current.group.id === group.id) {
          current.endIndex = columnIndex;
        } else {
          current = { group, startIndex: columnIndex, endIndex: columnIndex };
          segments.push(current);
        }
      }
      return segments;
    },
    [columnCount, fieldIdToGroupMap, visibleColumns],
  );

  const getColumnGroupBand = useCallback(
    (columnStartIndex: number, columnStopIndex: number, isFrozen: boolean) => {
      const segments = getColumnGroupSegments(columnStartIndex, columnStopIndex);
      const bands = segments.map(({ group, startIndex, endIndex }) => {
        const x = instance.getColumnOffset(startIndex);
        const endX = instance.getColumnOffset(endIndex) + instance.getColumnWidth(endIndex);
        return (
          <ColumnGroupBand
            key={`column-group-band-${group.id}-${startIndex}`}
            x={x}
            y={0}
            width={endX - x}
            height={GRID_COLUMN_GROUP_BAND_HEIGHT}
            name={group.name || t(Strings.column_group_default_name)}
            isFrozen={isFrozen}
            onContextMenu={(event) => showColumnGroupMenu(event, group.id)}
          />
        );
      });
      return bands;
    },
    [getColumnGroupSegments, instance, showColumnGroupMenu],
  );

  /**
   * Band segments over the frozen columns — rendered outside of the horizontally-scrolled
   * Group so they stay put while the sheet scrolls.
   */
  const frozenColumnGroupBand = useMemo(() => getColumnGroupBand(0, frozenColumnCount - 1, true), [getColumnGroupBand, frozenColumnCount]);

  /**
   * Band segments over the non-frozen columns — rendered inside the `offsetX={scrollLeft}`
   * Group so they scroll together with the field heads/cells.
   */
  const columnGroupBand = useMemo(
    () => getColumnGroupBand(Math.max(columnStartIndex, frozenColumnCount), columnStopIndex, false),
    [getColumnGroupBand, columnStartIndex, columnStopIndex, frozenColumnCount],
  );

  return {
    frozenColumnGroupBand,
    columnGroupBand,
  };
};
