import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { ICell } from '@apitable/core';
import { IEditorPosition } from 'pc/components/editors';
import { KonvaGridContext } from '../../context';
import { UrlActionUI } from './url_action_ui';
import { getCellRelativeRect } from './util';

interface IUrlActionContainer {
  rectCalculator?: (activeCell: ICell) => Partial<IEditorPosition> | null;
  activeCell: ICell | null;
  fieldId?: string;
  recordId?: string;
  datasheetId: string;
  scrollTop?: number;
  scrollLeft?: number;
}

export const UrlActionContainer = (props: IUrlActionContainer) => {
  const { rectCalculator, activeCell, fieldId, recordId, datasheetId, scrollLeft = 0, scrollTop = 0 } = props;
  const { setActiveUrlAction, activeUrlAction } = useContext(KonvaGridContext);
  const [editPositionInfo, setEditPositionInfo] = useState<IEditorPosition>(() => ({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  }));

  const calcEditorRect = () => {
    if (!activeCell) {
      return;
    }
    const rect = rectCalculator ? rectCalculator(activeCell) : getCellRelativeRect(activeCell);
    if (rect) {
      const { x, y, width, height } = rect;
      setEditPositionInfo((prev) => ({
        x: x || prev.x,
        y: y || prev.y,
        width: width || prev.width,
        height: height || prev.height,
      }));
    }
  };

  useEffect(() => {
    if (activeCell === null) {
      setActiveUrlAction(false);
    }
  }, [activeCell, setActiveUrlAction]);

  useEffect(() => {
    setTimeout(() => {
      calcEditorRect();
    }, 0);
    // eslint-disable-next-line
  }, []);

  const { x, y, height } = editPositionInfo;

  return (
    <UrlActionUI
      activeUrlAction={activeUrlAction}
      setActiveUrlAction={setActiveUrlAction}
      fieldId={fieldId}
      recordId={recordId}
      datasheetId={datasheetId}
      style={{
        left: x - scrollLeft,
        top: y + height + 2 - scrollTop,
      }}
    />
  );
};
