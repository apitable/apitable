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
import { FC, useContext } from 'react';
import { FieldType, IPermissions, IReduxState, RowHeight, Selectors, Strings, t, ViewType } from '@apitable/core';
import { getRecordName } from 'pc/components/expand_record';
import { GanttCoordinate } from 'pc/components/gantt_view';
import { cellHelper, konvaDrawer, KonvaGridViewContext } from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { KonvaGanttViewContext } from '../../context';

const Shape = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/shape'), { ssr: false });
interface ITaskContentProps {
  instance: GanttCoordinate;
  recordId: string;
  color: string;
  bgColor: string;
}

const TaskContent: FC<React.PropsWithChildren<ITaskContentProps>> = (props) => {
  const { recordId, instance, color, bgColor } = props;
  const { rowHeight, rowHeightLevel } = instance;
  const { unitTitleMap, cacheTheme } = useContext(KonvaGridViewContext);
  const { snapshot, fieldMap, visibleColumns } = useContext(KonvaGridViewContext);
  const { ganttVisibleColumns } = useContext(KonvaGanttViewContext);
  const firstFieldId = visibleColumns[0].fieldId;
  const state = store.getState();

  const cellsDrawer = (ctx: any) => {
    let curOffset = 10;
    for (let i = 0; i < ganttVisibleColumns.length; i++) {
      const { fieldId } = ganttVisibleColumns[i];

      const permissions = Selectors.getDatasheet(state)?.permissions || {};
      const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      const field = fieldMap[fieldId];
      const realField = Selectors.findRealField(state, field);
      if (!realField) continue;

      if (fieldId === firstFieldId) {
        const title = getRecordName(cellValue, field) || t(Strings.record_unnamed);
        konvaDrawer.initCtx(ctx);
        konvaDrawer.setStyle({
          fontSize: 13,
          fontWeight: 'bold',
        });
        konvaDrawer.text({
          x: curOffset,
          y: (rowHeight - 13) / 2,
          text: title,
          fontWeight: 'bold',
          fillStyle: color,
        });
        curOffset += ctx.measureText(title).width;
        continue;
      }

      const y = realField.type === FieldType.Attachment ? 0 : (rowHeight - RowHeight.Short) / 2;
      const renderProps = {
        x: curOffset,
        y,
        rowHeight,
        columnWidth: null,
        recordId,
        field,
        cellValue,
        rowHeightLevel,
        permissions,
        style: {
          color,
          bgColor,
        },
        viewType: ViewType.Gantt,
        callback: ({ width }: { width: number }) => (curOffset += width),
        unitTitleMap,
        cacheTheme,
      };
      cellHelper.initCtx(ctx);
      cellHelper.initStyle(field, { fontWeight: 'normal' });
      cellHelper.renderCellValue(renderProps, ctx);
    }
  };

  return <Shape listening={false} perfectDrawEnabled={false} sceneFunc={cellsDrawer} />;
};

export default TaskContent;
