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

import { createContext } from 'react';
import { IGanttViewStatus, IGanttViewStyle, IViewColumn } from '@apitable/core';
import { IGanttGroupMap, ISplitterProps, ITaskLineSetting, IRowsCellValueMap, ITargetTaskInfo } from '../interface';

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
