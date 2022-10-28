import { CellType, defaultGanttViewStatus, IGanttViewStatus, ViewType } from '@apitable/core';
import { ITargetNameDetail, TimeoutID, AreaType } from '../interface';
import { GANTT_HEADER_HEIGHT, 
  GANTT_HORIZONTAL_DEFAULT_SPACING, GANTT_VERTICAL_DEFAULT_SPACING, IScrollOptions
} from 'pc/components/gantt_view';
import { getStorage, StorageName } from 'pc/utils/storage';

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
 * Get the rowHeight based on the type of linearRow
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
 * Generate the targetName of the graph based on the incoming information
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
 * Parse targetName for built-in information
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
 * Formatted groupId, unified entry
 */
export const getGanttGroupId = (recordId: string, depth: number) => {
  return `${recordId}-${depth}`;
};

export const getSpeed = (spacing: number) => {
  const baseSpeed = 3;
  return Math.ceil((GANTT_HORIZONTAL_DEFAULT_SPACING - spacing) * baseSpeed / GANTT_HORIZONTAL_DEFAULT_SPACING);
};

export const onDragScrollSpacing = (
  scrollHandler, 
  gridWidth, 
  instance, 
  scrollState, 
  pointPosition,
  noScrollSet,
  horizontalScrollCb,
  verticalScrollCb,
  allScrollCb
) => {
  const { containerWidth: ganttWidth, containerHeight: ganttHeight } = instance;
  const { scrollTop } = scrollState;
  const {
    x: pointX,
    y: pointY,
  } = pointPosition;
  const leftSpacing = pointX - gridWidth;
  const rightSpacing = ganttWidth + gridWidth - pointX ;
  const topSpacing = pointY - GANTT_HEADER_HEIGHT;
  const bottomSpacing = ganttHeight - pointY;
  const needScrollToLeft = leftSpacing < GANTT_HORIZONTAL_DEFAULT_SPACING;
  const needScrollToRight = rightSpacing < GANTT_HORIZONTAL_DEFAULT_SPACING;
  const needScrollToTop = topSpacing < GANTT_VERTICAL_DEFAULT_SPACING && scrollTop !== 0;
  const needScrollToBottom = bottomSpacing < GANTT_VERTICAL_DEFAULT_SPACING;
  const isHorizontalScroll = needScrollToLeft || needScrollToRight;
  const isVerticalScroll = needScrollToTop || needScrollToBottom;

  // No need for drag-and-drop scrolling
  if (!isHorizontalScroll && !isVerticalScroll) {
    scrollHandler.stopScroll();
    noScrollSet();
    return;
  }
  // Drag and drop scrolling required
  const scrollOptions: IScrollOptions = {};
  if (isHorizontalScroll) {
    scrollOptions.columnSpeed = needScrollToLeft ? -getSpeed(leftSpacing) : getSpeed(rightSpacing);
  }
  if (isVerticalScroll) {
    scrollOptions.rowSpeed = needScrollToTop ? -getSpeed(topSpacing) : getSpeed(bottomSpacing);
  }
  if (isHorizontalScroll && !isVerticalScroll) {
    scrollOptions.scrollCb = horizontalScrollCb;
  }
  if (isVerticalScroll && !isHorizontalScroll) {
    scrollOptions.scrollCb = verticalScrollCb;
  }
  if (isVerticalScroll && isHorizontalScroll) {
    scrollOptions.scrollCb = allScrollCb;
  }
  return scrollHandler.scrollByValue(scrollOptions, AreaType.Gantt);
};

export const getGanttViewStatusWithDefault = ({
  spaceId,
  datasheetId,
  viewId,
  mirrorId,
  isViewLock
}): IGanttViewStatus => {
  const ganttStatusMap = getStorage(StorageName.GanttStatusMap);
  const ganttStatus = ganttStatusMap?.[`${spaceId}_${datasheetId}_${viewId}`] || {};
  return {
    ...defaultGanttViewStatus,
    settingPanelVisible: !(mirrorId || isViewLock),
    ...ganttStatus,
  };
};