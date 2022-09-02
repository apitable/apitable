import { getDiffCount } from 'pc/components/gantt_view';
import { originalChange } from './date';
import { ISetRecordOptions, Selectors, fastCloneDeep } from '@vikadata/core';
import { getAllTaskLine, getAllCycleDAG } from './task_line';

export const autoTaskScheduling = (visibleRows, state, snapshot, ganttStyle, autoEntrance: any = null) => {
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
    if (startTime && endTime) {
      visibleRowsTime[row.recordId] = {
        startTime,
        endTime,
      };
    }
  });

  const { sourceAdj } = getAllTaskLine(targetAdj);

  const cycleEdges = getAllCycleDAG(nodeIdMap, sourceAdj);

  const rowsTimeList = fastCloneDeep(visibleRowsTime);

  const autoDFS = recordId => {
    // 查看是否有关联任务
    if (!sourceAdj[recordId]) {
      return;
    }
    sourceAdj[recordId].forEach(targetId => {
      if (cycleEdges.includes(`taskLine-${recordId}-${targetId}`) || !rowsTimeList[targetId]) {
        return;
      }
      // 比较所有后置任务所有前置任务的大小取最靠近的那个
      let recentRecordId;
      if (targetAdj[targetId].length == 1) {
        recentRecordId = recordId;
      } else {
        let recentTime;
        targetAdj[targetId].forEach((sourceItem, index) => {
          const sourceItemTime = rowsTimeList[sourceItem]?.endTime;
          if (index === 0) {
            recentTime = sourceItemTime;
            recentRecordId = sourceItem;
          } else if (sourceItemTime > recentTime) {
            recentTime = sourceItemTime;
            recentRecordId = sourceItem;
          }
        });
      }

      // 更新当前的时间

      const nodeEndTime = rowsTimeList[recentRecordId]?.endTime;
      const startTime = rowsTimeList[targetId].startTime;
      const endTime = rowsTimeList[targetId]?.endTime;
      const diffTime = getDiffCount(startTime, endTime);

      rowsTimeList[targetId] = {
        startTime: originalChange(nodeEndTime, 1, 'day').valueOf(),
        endTime: originalChange(nodeEndTime, 1 + diffTime, 'day').valueOf(),
      };

      // 沿着路径递归更新
      autoDFS(targetId);
    });
  };

  // 遍历一下所有task 发现入度为0的递归设置
  if (!autoEntrance) {
    visibleRows.forEach(row => {
      if (!targetAdj[row.recordId]) {
        autoDFS(row.recordId);
      }
    });
  } else {
    if (!rowsTimeList[autoEntrance.recordId] || !rowsTimeList[autoEntrance.recordId].endTime) {
      return [];
    }
    rowsTimeList[autoEntrance.recordId].endTime = autoEntrance.value;
    autoDFS(autoEntrance.recordId);
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
