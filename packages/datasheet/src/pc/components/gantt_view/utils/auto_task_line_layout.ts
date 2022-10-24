import { getDiffOriginalCount } from 'pc/components/gantt_view';
import { originalChange } from './date';
import { ISetRecordOptions, Selectors, fastCloneDeep } from '@apitable/core';
import { getAllTaskLine, getAllCycleDAG } from './task_line';

interface ISourceRecordData {
  recordId: string;
  endTime: number | null;
  targetRecordId?: string;
}

export const autoTaskScheduling = (visibleRows, state, snapshot, ganttStyle, sourceRecord?: ISourceRecordData) => {
  const { linkFieldId, startFieldId, endFieldId } = ganttStyle;
  // target adjacency list
  const targetAdj = {};
  const nodeIdMap: string[] = [];
  const visibleRowsTime = {};
  visibleRows.forEach(row => {
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

  const cycleEdges = getAllCycleDAG(nodeIdMap, sourceAdj);

  const rowsTimeList = fastCloneDeep(visibleRowsTime);

  const autoDFS = sourceId => {
    // 查看是否有关联任务
    if (!sourceAdj[sourceId] || !rowsTimeList[sourceId]) return;

    if (rowsTimeList[sourceId].diffCount < 0) return;

    sourceAdj[sourceId].forEach(targetId => {
      if (cycleEdges.includes(`taskLine-${sourceId}-${targetId}`) || !rowsTimeList[targetId]) return;
      const { diffCount } = rowsTimeList[targetId];
      if (diffCount < 0) return;
      // 比较所有后置任务所有前置任务的大小取最靠近的那个

      let recentRecordId = sourceId;
      let recentTime = rowsTimeList[sourceId].endTime ?? rowsTimeList[sourceId].startTime;

      targetAdj[targetId].forEach(sourceItem => {
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

      // 更新当前的时间

      const nodeEndTime = rowsTimeList[recentRecordId]?.endTime ?? rowsTimeList[recentRecordId]?.startTime;
      const startTime = rowsTimeList[targetId]?.startTime;
      const endTime = rowsTimeList[targetId]?.endTime;
      const diffTime = getDiffOriginalCount(startTime, endTime) || 0;

      rowsTimeList[targetId] = {
        startTime: startTime ? originalChange(nodeEndTime, 1, 'day').valueOf() : startTime,
        endTime: endTime ? originalChange(nodeEndTime, 1 + diffTime, 'day').valueOf() : endTime,
      };

      // 沿着路径递归更新
      autoDFS(targetId);
    });
  };

  // 遍历一下所有task 发现入度为0的递归设置
  if (!sourceRecord) {
    visibleRows.forEach(row => {
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
      sourceAdj[sourceId] = sourceAdj[sourceId] ? [...sourceAdj[sourceId], targetId] : [targetId];
      targetAdj[targetId] = targetAdj[targetId] ? [...targetAdj[targetId], sourceId] : [sourceId];
    }
    autoDFS(sourceId);
  }

  const res: ISetRecordOptions[] = [];
  Object.keys(visibleRowsTime).forEach(recordId => {
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
