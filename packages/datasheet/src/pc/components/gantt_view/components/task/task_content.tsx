import { FieldType, RowHeight, Selectors, Strings, t, ViewType } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { getRecordName } from 'pc/components/expand_record';
import { GanttCoordinate } from 'pc/components/gantt_view';
import { cellHelper, konvaDrawer, KonvaGridViewContext } from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { FC, useContext } from 'react';
import { KonvaGanttViewContext } from '../../context';

const Shape = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/shape'), { ssr: false });
interface ITaskContentProps {
  instance: GanttCoordinate;
  recordId: string;
  color: string;
  bgColor: string;
}

const TaskContent: FC<ITaskContentProps> = (props) => {
  const { recordId, instance, color, bgColor } = props;
  const { rowHeight, rowHeightLevel } = instance;
  const { unitTitleMap, cacheTheme } = useContext(KonvaGridViewContext);
  const {
    snapshot,
    fieldMap,
    visibleColumns
  } = useContext(KonvaGridViewContext);
  const { ganttVisibleColumns } = useContext(KonvaGanttViewContext);
  const firstFieldId = visibleColumns[0].fieldId;
  const state = store.getState();

  const cellsDrawer = (ctx: any) => {
    let curOffset = 10;
    for (let i = 0; i < ganttVisibleColumns.length; i ++) {
      const { fieldId } = ganttVisibleColumns[i];
      const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      const field = fieldMap[fieldId];
      const realField = Selectors.findRealField(state, field);
      if (!realField) continue;

      if (fieldId === firstFieldId) {
        const title = getRecordName(cellValue, field) || t(Strings.record_unnamed);
        konvaDrawer.initCtx(ctx);
        konvaDrawer.setStyle({
          fontSize: 13,
          fontWeight: 'bold'
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
        style: {
          color,
          bgColor,
        },
        viewType: ViewType.Gantt,
        callback: ({ width }) => curOffset += width,
        unitTitleMap,
        cacheTheme
      };
      cellHelper.initCtx(ctx);
      cellHelper.initStyle(field, { fontWeight: 'normal' });
      cellHelper.renderCellValue(renderProps, ctx);
    }
  };

  return (
    <Shape
      listening={false}
      perfectDrawEnabled={false}
      sceneFunc={cellsDrawer}
    />
  );
};

export default TaskContent;
