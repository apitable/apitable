import { useContext } from 'react';
import { KonvaGanttViewContext } from 'pc/components/gantt_view/context';
import { GanttCoordinate, GANTT_TASK_GAP_SIZE, IScrollState } from 'pc/components/gantt_view';
import { TaskLine } from 'pc/components/gantt_view/components/task/task_lines';
import { PointPosition, TaskPositionYType } from '../interface';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { useTooltip } from './use_gantt_tooltip';
import { getTaskLineName } from 'pc/components/gantt_view/utils';
import { fastCloneDeep } from '@vikadata/core';

interface IAssociaLinePorps {
  instance: GanttCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
}

export const useGanttAssocitionLine = (props: IAssociaLinePorps) => {
  const { instance, scrollState, rowStartIndex, rowStopIndex, pointPosition } = props;
  const { rowsCellValueMap, linkCycleEdges } = useContext(KonvaGanttViewContext);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { scrollTop, isScrolling } = scrollState;
  const { tooltip, setTooltipInfo } = useTooltip({ isScrolling });
  
  const taskLineList: React.ReactNode[] = [];
  if(!rowsCellValueMap) {
    return {
      lineTooltip: tooltip,
      taskLineList
    };
  }
  
  const { rowHeight } = instance;
  const { taskEdges, cycleEdges } = linkCycleEdges;

  const topY = scrollTop - rowHeight * 5;
  const bottomY = scrollTop + instance.containerHeight;
  // 存放向上或者向下消失线的nodeId 不重复渲染
  const nodeTopLineMap: Map<string, string> = new Map();
  const nodeBottomLineMap: Map<string, string> = new Map();

  // 存放分组收起来的任务task按照x的位置储存
  const sourceCollapseXMap : Map<string, Map<string, string>> = new Map();
  const targetCollapseXMap : Map<string, Map<string, string>> = new Map();

  // 将每次计算过后的y值储存起来
  const taskYPositionMap: Map<string, number> = new Map();

  const getTaskXPosition = (startFiledValue: string, endFiledValue: string) => {
    const { startOffset, endOffset, width } = instance.getTaskData(startFiledValue, endFiledValue);
    if (startOffset == null && endOffset == null) return null;
    if (!width) return null;
    const x = (startOffset ?? endOffset)!;
    return {
      x,
      width
    };
  };

  const associationLineRender = (sourceId: string, targetId: string) => {

    if(!rowsCellValueMap[sourceId] || !rowsCellValueMap[targetId]) {
      return null;
    }

    const sourceTask = fastCloneDeep(rowsCellValueMap[sourceId]);
    const targetTask = fastCloneDeep(rowsCellValueMap[targetId]);

    if(!sourceTask || !targetTask) {
      return null;
    }

    if(!sourceTask.isCollapse) {
    
      if(sourceTask.rowIndex < rowStartIndex) {
        sourceTask.positionYType = TaskPositionYType.Top;
        sourceTask.y = topY;
      }

      if(sourceTask.rowIndex >= rowStartIndex && sourceTask.rowIndex <= rowStopIndex) {
        sourceTask.positionYType = TaskPositionYType.Viewable;
        if(taskYPositionMap.has(sourceId)) {
          sourceTask.y = taskYPositionMap.get(sourceId);
        } else {
          sourceTask.y = instance.getRowOffset(sourceTask.rowIndex);
          taskYPositionMap.set(sourceId, sourceTask.y);
        }
      }
    
      if(sourceTask.rowIndex > rowStopIndex) {
        sourceTask.positionYType = TaskPositionYType.Bottom;
        sourceTask.y = bottomY;
      }
    } else {
      if(taskYPositionMap.has(sourceId)) {
        sourceTask.y = taskYPositionMap.get(sourceId);
      } else {
        sourceTask.y = instance.getRowOffset(sourceTask.rowIndex);
        taskYPositionMap.set(sourceId, sourceTask.y);
      }
    } 

    if(!sourceTask.isCollapse) {
      if(targetTask.rowIndex < rowStartIndex) {
        targetTask.positionYType = TaskPositionYType.Top;
        targetTask.y = topY;
      }

      if(targetTask.rowIndex >= rowStartIndex && targetTask.rowIndex <= rowStopIndex) {
        targetTask.positionYType = TaskPositionYType.Viewable;
        if(taskYPositionMap.has(targetId)) {
          targetTask.y = taskYPositionMap.get(targetId);
        } else {
          targetTask.y = instance.getRowOffset(targetTask.rowIndex);
          taskYPositionMap.set(targetId, targetTask.y);
        }
      }

      if(targetTask.rowIndex > rowStopIndex) {
        targetTask.positionYType = TaskPositionYType.Bottom;
        targetTask.y = bottomY;
      }
    } else {
      if(taskYPositionMap.has(targetId)) {
        targetTask.y = taskYPositionMap.get(targetId);
      } else {
        targetTask.y = instance.getRowOffset(targetTask.rowIndex);
        taskYPositionMap.set(targetId, targetTask.y);
      }
    } 

    const sourcePositionType = sourceTask.positionYType;
    const targetPositionType = targetTask.positionYType;

    if(!(sourcePositionType === TaskPositionYType.Viewable || targetPositionType === TaskPositionYType.Viewable)) {
      return null;
    }

    if(sourcePositionType === TaskPositionYType.Viewable && targetPositionType !== TaskPositionYType.Viewable) {
      if(targetPositionType === TaskPositionYType.Top) {
        if(nodeTopLineMap.has(sourceId)) return null;
        nodeTopLineMap.set(sourceId, sourceId);
      
      }
      if(targetPositionType === TaskPositionYType.Bottom) { 
        if(nodeBottomLineMap.has(sourceId)) return null;
        nodeBottomLineMap.set(sourceId, sourceId);
      }
      if(targetTask.Collapse) {
          
        if(targetCollapseXMap.get(sourceId)?.has(targetTask.x)) {
          return null;
        } 
        const targetXList = targetCollapseXMap.get(sourceId) ? 
        targetCollapseXMap.get(sourceId) as Map<string, string> : new Map();
        targetXList.set(targetTask.x, targetTask.x);
        targetCollapseXMap.set(sourceId, targetXList); 
        
      }
    }

    if(targetPositionType === TaskPositionYType.Viewable && sourcePositionType !== TaskPositionYType.Viewable) {
      if(sourcePositionType === TaskPositionYType.Top) {
        if(nodeTopLineMap.has(targetId)) return null;
        nodeTopLineMap.set(targetId, targetId);
      
      }
      if(sourcePositionType === TaskPositionYType.Bottom) { 
        if(nodeBottomLineMap.has(targetId)) return null;
        nodeBottomLineMap.set(targetId, targetId);
      }

      if(sourceTask.isCollapse) {
          
        if(sourceCollapseXMap.get(sourceId)?.has(sourceTask.x)) {
          return null;
        } 
        const sourceXList = sourceCollapseXMap.get(sourceId) ? 
        sourceCollapseXMap.get(sourceId) as Map<string, string> : new Map();
        sourceXList.set(sourceTask.x, sourceTask.x);
        sourceCollapseXMap.set(targetId, sourceXList);
        
      }
    }

    const sourceXPosition = getTaskXPosition(sourceTask.startTime, sourceTask.endTime);
    if(!sourceXPosition) return null;
    sourceTask.x = sourceXPosition.x;
    sourceTask.taskWidth = sourceXPosition.width;

    const targetXPosition = getTaskXPosition(targetTask.startTime, targetTask.endTime);
    if(!targetXPosition) return null;
    targetTask.x = targetXPosition.x;

    const taskRightOffset = sourceTask.taskWidth > 32 ? 16 : sourceTask.taskWidth / 2;

    const sourcePoint = { 
      x: sourceTask.x + sourceTask.taskWidth - taskRightOffset, 
      y: sourceTask.y + rowHeight
    };
    const targetPoint = { 
      x: targetTask.x,
      y: targetTask.y + rowHeight / 2
    };
    const taskLineName = getTaskLineName(sourceId, targetId);
    const isCycleLine = cycleEdges.includes(taskLineName);
    let fillColor = isCycleLine ? colors.fc10 : colors.black[400];
    let dashEnabled = isCycleLine ? true : false;
    let points : number[] = [];

    if(targetTask.x < sourceTask.x + sourceTask.taskWidth) {
      fillColor = colors.fc10;
      dashEnabled = true;
      points = [ 
        sourcePoint.x, sourcePoint.y, 
        sourcePoint.x, sourcePoint.y + GANTT_TASK_GAP_SIZE / 4, 
        targetPoint.x - 8, sourcePoint.y + GANTT_TASK_GAP_SIZE / 4,
        targetPoint.x - 8, targetPoint.y,
        targetPoint.x, targetPoint.y
      ];
    }

    if(targetTask.x >= sourceTask.x + sourceTask.taskWidth) {
      points = [
        sourcePoint.x, sourcePoint.y, 
        sourcePoint.x, sourcePoint.y + GANTT_TASK_GAP_SIZE / 4,
        sourcePoint.x, targetPoint.y,
        targetPoint.x - 8, targetPoint.y,
        targetPoint.x, targetPoint.y
      ];
    }

    if(targetTask.isCollapse) {
      points = [
        sourcePoint.x, sourcePoint.y, 
        sourcePoint.x, targetPoint.y - 8,
        targetPoint.x, targetPoint.y - 8, 
        targetPoint.x, targetPoint.y
      ];
    }

    return (
      <TaskLine
        points={points}
        fillColor={fillColor}
        dashEnabled={dashEnabled}
        sourceId={sourceId}
        targetId={targetId}
        pointPosition={pointPosition}
        setLineTooltipInfo={setTooltipInfo}
        isCycleLine={isCycleLine}
      />
    );
  };

  taskEdges.forEach(taskLine => {
    const [sourceId, targetId] = taskLine;
    taskLineList.push(associationLineRender(sourceId, targetId));
  });
 
  return {
    lineTooltip: tooltip,
    taskLineList
  };
};