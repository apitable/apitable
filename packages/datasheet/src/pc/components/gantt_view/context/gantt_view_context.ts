import { createContext } from 'react';
import { IGanttGroupMap, ISplitterProps, ITaskLineSetting, IRowsCellValueMap, ITargetTaskInfo } from '../interface';
import { IGanttViewStatus, IGanttViewStyle, IViewColumn } from '@apitable/core';

export interface IKonvaGanttViewContextProps {
  isLocking: boolean;
  setLocking: (isLocking: boolean) => void;
  dragTaskId: string | null;
  setDragTaskId: (taskId: string | null) => void;
  transformerId: string;
  setTransformerId: (transformerId: string) => void;
  dragSplitterInfo: ISplitterProps;
  setDragSplitterInfo: (info: Partial<ISplitterProps>) => void;
  ganttStyle: IGanttViewStyle;
  ganttGroupMap: IGanttGroupMap;
  ganttViewStatus: IGanttViewStatus;
  ganttVisibleColumns: IViewColumn[];
  backTo: (dateTime: any, offsetX?: number) => void;
  setRecord: (recordId: string, startUnitIndex: number | null, endUnitIndex: number | null) => void;
  isTaskLineDrawing: boolean;
  setIsTaskLineDrawing: (isTaskLineDrawing: boolean) => void;
  rowsCellValueMap: IRowsCellValueMap | null;
  linkCycleEdges: any;
  targetTaskInfo: ITargetTaskInfo | null;
  setTargetTaskInfo: (targetTaskInfo: ITargetTaskInfo) => void;
  taskLineSetting: ITaskLineSetting | null;
  setTaskLineSetting: (taskLineSetting: ITaskLineSetting | null) => void;
}

export const KonvaGanttViewContext = createContext({} as IKonvaGanttViewContextProps);