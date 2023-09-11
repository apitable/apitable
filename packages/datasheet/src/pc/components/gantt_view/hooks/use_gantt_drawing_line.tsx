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
import { useContext, useRef, useState } from 'react';
import { Message } from '@apitable/components';
import {
  CollaCommandName,
  Selectors,
  KONVA_DATASHEET_ID,
  ConfigConstant,
  t,
  Strings,
  fastCloneDeep,
  ExecuteResult,
  ISetRecordOptions,
} from '@apitable/core';
import { PointPosition, KonvaGanttViewContext, GanttCoordinate, IScrollState, generateTargetName } from 'pc/components/gantt_view';
import { onDragScrollSpacing, autoTaskScheduling } from 'pc/components/gantt_view/utils';
import { detectCyclesStack, getTaskLineName } from 'pc/components/gantt_view/utils/task_line';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

const Arrow = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/arrow'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });

interface IDrawingLineProps {
  instance: GanttCoordinate;
  taskMap: any;
  gridWidth: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
}

export const useGanttDrawingLine = (props: IDrawingLineProps) => {
  const { taskMap, gridWidth, pointPosition, instance, scrollState } = props;
  const { theme, scrollHandler } = useContext(KonvaGridContext);

  const colors = theme.color;
  const { setTargetTaskInfo, targetTaskInfo, ganttStyle, transformerId, isTaskLineDrawing, dragTaskId, isLocking, linkCycleEdges } =
    useContext(KonvaGanttViewContext);
  const { snapshot, fieldPermissionMap, fieldMap, visibleRows } = useContext(KonvaGridViewContext);
  const { linkFieldId, startFieldId, endFieldId, autoTaskLayout = false } = ganttStyle;
  const state = store.getState();
  const { rowHeight, columnWidth } = instance;
  const arrowRef = useRef<any>();
  const [drawingLinePoints, setDrawingLinePoints] = useState<number[]>([]);
  const { sourceAdj, nodeIdMap } = linkCycleEdges;

  const { x: pointX, y: pointY } = pointPosition;

  const circle1Ref = useRef<any>();
  const circle2Ref = useRef<any>();
  const taskBlock = useRef<any>();

  const setLinePointStyle = (radius: number, color: string) => {
    if (isTaskLineDrawing || !circle1Ref.current || !circle2Ref.current) {
      return;
    }
    circle1Ref.current.fill(color);
    circle1Ref.current.radius(radius * 2);
    circle2Ref.current.fill(color);
    circle2Ref.current.radius(radius);
    circle2Ref.current.strokeWidth(radius);
  };

  const linkField = fieldMap[linkFieldId];

  if (!transformerId || dragTaskId || !linkField || isLocking || !startFieldId || !endFieldId) {
    return {
      drawingLine: null,
    };
  }
  const sourceRecordId = isTaskLineDrawing ? taskBlock.current.id : transformerId.split('-')[1];

  if (!taskMap[sourceRecordId] && !isTaskLineDrawing) {
    return {
      drawingLine: null,
    };
  }

  if (!isTaskLineDrawing) {
    taskBlock.current = {
      info: taskMap[sourceRecordId],
      id: sourceRecordId,
    };
  }

  const { x: taskX, y: taskY, taskWidth } = taskBlock.current.info || taskMap[sourceRecordId];

  const x = taskWidth > columnWidth ? taskX + taskWidth - 16 : taskX + columnWidth - 16;
  const y = taskY + rowHeight - 4;

  // Calculate which task the current mouse position is in
  const includeTask = (targetX: number, targetY: number) => {
    let res = '';
    Object.keys(taskMap).forEach((task) => {
      if (task === 'taskListlength') {
        return;
      }
      const { x: taskX2, y: taskY2, taskWidth: targetTaskwidth } = taskMap[task];
      if (targetX <= taskX2 + targetTaskwidth && targetX >= taskX2 && targetY >= taskY2 && targetY < taskY2 + rowHeight) {
        res = task;
      }
    });
    return res;
  };

  const checkErrorLine = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return true;
    }
    const targetStartValue = Selectors.getCellValue(state, snapshot, targetId, startFieldId);
    const sourceEndValue = Selectors.getCellValue(state, snapshot, sourceId, endFieldId);

    if (targetStartValue && sourceEndValue && targetStartValue <= sourceEndValue) {
      return true;
    }

    const sourceAdjCopy = fastCloneDeep(sourceAdj);
    const nodeIdMapCopy = fastCloneDeep(nodeIdMap);

    sourceAdjCopy[sourceId] = sourceAdjCopy[sourceId] ? [...sourceAdjCopy[sourceId], targetId] : [targetId];

    if (!nodeIdMapCopy.includes(sourceId)) nodeIdMapCopy.push(sourceId);
    if (!nodeIdMapCopy.includes(targetId)) nodeIdMapCopy.push(targetId);

    const cycleEdges = detectCyclesStack(nodeIdMapCopy, sourceAdjCopy);

    const taskLineName = getTaskLineName(sourceId, targetId);
    if (cycleEdges.includes(taskLineName)) {
      return true;
    }

    return false;
  };

  const switchArrowStyle = (color: string, dashEnabled: boolean) => {
    circle1Ref.current.fill(color);
    circle2Ref.current.fill(color);
    arrowRef?.current?.fill(color);
    arrowRef?.current?.stroke(color);
    arrowRef?.current?.dashEnabled(dashEnabled);
  };

  const onDragMove = (e: any) => {
    const node = e.target;
    const curX = node.x();
    const curY = node.y();

    const targetRecordId = includeTask(curX, curY);

    const noScrollCb = () => setDrawingLinePoints([x, y + 6, x, curY, curX, curY]);
    const horizontalScrollCb = ({ scrollLeft }: { scrollLeft: number }) => {
      setDrawingLinePoints([x, y + 6, x, curY, scrollLeft + pointX - gridWidth, curY]);
    };
    const verticalScrollCb = ({ scrollTop }: { scrollTop: number }) =>
      setDrawingLinePoints([x, y + 6, x, scrollTop + pointY, curX, scrollTop + pointY]);
    const allScrollCb = ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) =>
      setDrawingLinePoints([x, y + 6, x, scrollTop + pointY, scrollLeft + pointX - gridWidth, scrollTop + pointY]);
    onDragScrollSpacing(
      scrollHandler,
      gridWidth,
      instance,
      scrollState,
      pointPosition,
      noScrollCb,
      horizontalScrollCb,
      verticalScrollCb,
      allScrollCb,
    );

    if (targetRecordId !== '' && checkErrorLine(sourceRecordId, targetRecordId)) {
      switchArrowStyle(colors.fc10, true);
      setTargetTaskInfo({ recordId: targetRecordId, dashEnabled: true });
    } else {
      switchArrowStyle(colors.borderBrandDefault, false);
      setTargetTaskInfo({ recordId: targetRecordId, dashEnabled: false });
    }
  };

  const onDragEnd = () => {
    setDrawingLinePoints([]);
    setLinePointStyle(2, colors.blackBlue[400]);
    if (targetTaskInfo && targetTaskInfo.recordId !== '') {
      if (targetTaskInfo.recordId === sourceRecordId) {
        return;
      }

      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, linkFieldId);
      const isDrawPermission = [ConfigConstant.Role.Editor, null].includes(fieldRole);

      if (!isDrawPermission) {
        Message.warning({
          content: t(Strings.gantt_not_rights_to_link_warning),
        });
        return;
      }
      const linkFieldInfo = Selectors.getField(state, linkFieldId);
      const limitSingleRecord = linkFieldInfo.property.limitSingleRecord;
      const cellValue = Selectors.getCellValue(state, snapshot, targetTaskInfo.recordId, linkFieldId) || [];
      if (limitSingleRecord && cellValue.length > 0) {
        Message.warning({
          content: t(Strings.gantt_not_allow_link_multuble_records_gantt_warning),
        });
        return;
      }
      if (cellValue.includes(sourceRecordId)) return;
      const result = resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        data: [
          {
            recordId: targetTaskInfo.recordId,
            fieldId: linkFieldId,
            value: [...cellValue, sourceRecordId],
          },
        ],
      });

      if (ExecuteResult.Success === result.result) {
        const endTime = Selectors.getCellValue(state, snapshot, sourceRecordId, endFieldId);
        if (!endTime || !autoTaskLayout) {
          return;
        }
        const sourceRecordData = {
          recordId: sourceRecordId,
          endTime,
          targetRecordId: targetTaskInfo.recordId,
        };

        const commandData: ISetRecordOptions[] = autoTaskScheduling(visibleRows, ganttStyle, sourceRecordData);
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetRecords,
          data: commandData,
        });
      }
    }
  };

  const drawingLine = (
    <Group onMouseMove={() => setLinePointStyle(3.5, colors.borderBrandDefault)} onMouseLeave={() => setLinePointStyle(2, colors.blackBlue[400])}>
      <Arrow
        _ref={arrowRef}
        points={drawingLinePoints}
        fill={colors.borderBrandDefault}
        stroke={colors.borderBrandDefault}
        strokeWidth={1}
        lineCap="round"
        dash={[2, 5]}
        dashEnabled={false}
        pointerLength={5}
        pointerWidth={5}
      />
      <Group x={x} y={y}>
        <Circle _ref={circle1Ref} radius={4} fill={colors.blackBlue[400]} />
        <Circle _ref={circle2Ref} radius={2} fill={colors.blackBlue[400]} stroke={colors.fc8} strokeWidth={2} />
      </Group>
      <Circle
        name={generateTargetName({
          targetName: KONVA_DATASHEET_ID.GANTT_LINE_POINT,
          recordId: sourceRecordId,
        })}
        x={x}
        y={y}
        radius={5}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        draggable
      />
    </Group>
  );

  return {
    drawingLine,
  };
};
