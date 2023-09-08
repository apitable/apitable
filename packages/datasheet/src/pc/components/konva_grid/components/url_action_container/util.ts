import { DATASHEET_ID, ICell, SegmentType } from '@apitable/core';

export const formatValue = (text: string | undefined, title: string | undefined, favicon: string | undefined) => {
  if (!text && !title) return [];
  const item: {
    type: SegmentType;
    text?: string;
    title?: string;
    favicon?: string;
  } = {
    type: SegmentType.Text,
    text: text || title,
    title: title || text,
  };
  if (favicon) {
    item.favicon = favicon;
  }
  return [item];
};

export const getCellRelativeRect = (cell: ICell) => {
  const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);

  if (!containerDom || !cell) {
    return null;
  }
  const cellDom = containerDom.querySelector(`[data-record-id="${cell.recordId}"][data-field-id="${cell.fieldId}"]`);
  if (cellDom) {
    const cellRect = cellDom.getBoundingClientRect();
    const containerRect = containerDom.getBoundingClientRect();
    const deltaLeft = cellRect.left - containerRect.left;
    const deltaTop = cellRect.top - containerRect.top;

    const getDelta = (delta: number, selfSize: number, containerSize: number) => {
      const safeBorder = 2;
      if (delta > safeBorder) {
        if (delta < containerSize - selfSize) {
          return delta;
        }

        return containerSize - selfSize - safeBorder;
      }
      return safeBorder;
    };

    return {
      x: getDelta(deltaLeft, cellRect.width, containerRect.width),
      y: getDelta(deltaTop, cellRect.height, containerRect.height),
      width: cellRect.width,
      height: cellRect.height,
    };
  }

  return null;
};
