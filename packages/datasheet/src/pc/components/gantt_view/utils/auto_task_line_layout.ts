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

import { ISetRecordOptions, Selectors, fastCloneDeep, IViewRow, IGanttViewStyle } from '@apitable/core';
import { getDiffOriginalCount } from 'pc/components/gantt_view';
import { store } from 'pc/store';
import { originalChange } from './date';
import { getAllTaskLine, detectCyclesStack } from './task_line';

interface ISourceRecordData {
  recordId: string;
  endTime: number | null;
  targetRecordId?: string;
}

export const autoTaskScheduling = (visibleRows: IViewRow[], ganttStyle: IGanttViewStyle, sourceRecord?: ISourceRecordData) => {
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state)!;
  const { linkFieldId, startFieldId, endFieldId } = ganttStyle;
  // target adjacency list
  const targetAdj = {};
  const nodeIdMap: string[] = [];
  const visibleRowsTime = {};

  visibleRows.forEach((row) => {
    const linkCellValue = Selectors.getCellValue(state, snapshot, row.recordId, linkFieldId) || [];
    if (linkCellValue.length > 0) {
      targetAdj[row.recordId] = linkCellValue;
    }
    nodeIdMap.push(row.recordId);

    const startTime = Selectors.getCellValue(state, snapshot, row.recordId, startFieldId);
    const endTime = Selectors.getCellValue(state, snapshot, row.recordId, endFieldId);
    const diffCount = getDiffOriginalCount(startTime, endTime);
    if (startTime || endTime) {
      visibleRowsTime[row.recordId] = {
        startTime,
        endTime,
        diffCount,
      };
    }
  });

  const { sourceAdj } = getAllTaskLine(targetAdj);

  const cycleEdges = detectCyclesStack(nodeIdMap, sourceAdj);

  const rowsTimeList = fastCloneDeep(visibleRowsTime);

  const autoDFS = (sourceId: string) => {
    // Check if there are associated tasks
    if (!sourceAdj[sourceId] || !rowsTimeList[sourceId]) return;

    if (rowsTimeList[sourceId].diffCount < 0) return;
    
    sourceAdj[sourceId]?.forEach((targetId) => {
      if (cycleEdges.includes(`taskLine-${sourceId}-${targetId}`) || !rowsTimeList[targetId]) return;
      
      const { diffCount } = rowsTimeList[targetId];
      if (diffCount < 0) return;
      // Compare the size of all post-tasks to the size of all pre-tasks, whichever is closest

      let recentRecordId = sourceId;
      let recentTime = rowsTimeList[sourceId].endTime ?? rowsTimeList[sourceId].startTime;

      targetAdj[targetId].forEach((sourceItem: string) => {
        if(!rowsTimeList[sourceItem]) {
          return;
        }
        const { diffCount: sourceItemDiffTime } = rowsTimeList[sourceItem];
        if (sourceItemDiffTime < 0) {
          return;
        }
        const sourceItemTime = rowsTimeList[sourceItem]?.endTime ?? rowsTimeList[sourceItem]?.startTime;

        if (sourceItemTime > recentTime) {
          recentTime = sourceItemTime;
          recentRecordId = sourceItem;
        }
      });

      // Update the current time

      const nodeEndTime = rowsTimeList[recentRecordId]?.endTime ?? rowsTimeList[recentRecordId]?.startTime;
      const startTime = rowsTimeList[targetId]?.startTime;
      const endTime = rowsTimeList[targetId]?.endTime;
      const diffTime = getDiffOriginalCount(startTime, endTime) || 0;

      rowsTimeList[targetId] = {
        startTime: startTime ? originalChange(nodeEndTime, 1, 'day').valueOf() : startTime,
        endTime: endTime ? originalChange(nodeEndTime, 1 + diffTime, 'day').valueOf() : endTime,
      };

      // Recursive updates along the path
      autoDFS(targetId);
    });
  };

  if (!sourceRecord) {
    visibleRows.forEach((row) => {
      if (!targetAdj[row.recordId]) {
        autoDFS(row.recordId);
      }
    });
  } else {
    const { recordId: sourceId, endTime, targetRecordId: targetId } = sourceRecord;
    if (!rowsTimeList[sourceId] || !endTime) {
      return [];
    }
    rowsTimeList[sourceId].endTime = endTime;

    if (targetId) {
      sourceAdj[sourceId] = sourceAdj[sourceId] ? [...sourceAdj[sourceId]!, targetId] : [targetId];
      targetAdj[targetId] = targetAdj[targetId] ? [...targetAdj[targetId], sourceId] : [sourceId];
    }
    autoDFS(sourceId);
  }

  const res: ISetRecordOptions[] = [];
  Object.keys(visibleRowsTime).forEach((recordId) => {
    const originDate = visibleRowsTime[recordId];
    const newDate = rowsTimeList[recordId];
    if (newDate.startTime !== originDate.startTime || newDate.endTime !== originDate.endTime) {
      res.push({
        recordId: recordId,
        fieldId: startFieldId,
        value: newDate.startTime,
      });
      res.push({
        recordId: recordId,
        fieldId: endFieldId,
        value: newDate.endTime,
      });
    }
  });

  return res;
};
