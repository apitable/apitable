import { CellType, ViewType } from '@vikadata/core';
import { ITargetNameDetail, TimeoutID } from '../interface';

export const cancelTimeout = (timeoutID: TimeoutID) => {
  cancelAnimationFrame(timeoutID.id);
};

export const requestTimeout = (callback: Function, delay: number): TimeoutID => {
  const start = Date.now();

  function tick() {
    if (Date.now() - start >= delay) {
      callback.call(null);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }

  const timeoutID: TimeoutID = {
    id: requestAnimationFrame(tick),
  };

  return timeoutID;
};

/**
 * 根据 linearRow 的类型，获取 rowHeight
 */
export const getLinearRowHeight = (cellType: CellType, rowHeight: number, viewType: ViewType = ViewType.Grid) => {
  switch (cellType) {
    case CellType.Blank:
      return viewType === ViewType.Gantt ? 0 : 16;
    case CellType.Add:
      return 32;
    case CellType.Record:
      return rowHeight;
    case CellType.GroupTab:
      return 48;
  }
};

/**
 * 根据传入信息，生成图形的 targetName
 */
export const generateTargetName = ({
  targetName,
  fieldId,
  recordId,
  mouseStyle,
}: ITargetNameDetail) => {
  const flag = '$';
  return `${targetName}-${fieldId || flag}-${recordId || flag}-${mouseStyle || flag}`;
};

/**
 * 解析 targetName，获取内置信息
 */
export const getDetailByTargetName = (_targetName: string | null): ITargetNameDetail => {
  if (_targetName == null) {
    return { 
      targetName: null, 
      fieldId: null,
      recordId: null, 
      mouseStyle: null 
    };
  }

  const flag = '$';
  const [targetName, fieldId, recordId, mouseStyle] = _targetName.split('-');
  return { 
    targetName, 
    fieldId: fieldId === flag ? null : fieldId, 
    recordId: recordId === flag ? null : recordId,
    mouseStyle: mouseStyle === flag ? null : mouseStyle,
  };
};

/**
 * 格式化 groupId，统一入口
 */
export const getGanttGroupId = (recordId: string, depth: number) => {
  return `${recordId}-${depth}`;
};