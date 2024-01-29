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

import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { DATASHEET_ID, DropDirectionType, Selectors } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { CELL_CLASS, FIELD_DOT, FIELD_HEAD_CLASS, getElementDataset, getParentNodeByClass, OPACITY_LINE_CLASS, OPERATE_HEAD_CLASS } from 'pc/utils';
import { IDragOption, IDragProps } from '../drag/interface';
import { IElementRectProps, MoveType } from './interface';

interface IHoverLineOwnProps {
  isChangeColumnsWidth: boolean;
  dragOption: IDragOption;
  setDirection: React.Dispatch<React.SetStateAction<DropDirectionType>>;
  getFieldId?: (e: any) => string | null | undefined;
  getRecordId?: (e: any) => string | null | undefined;
  getElementRect?: (e: any, type: MoveType) => IElementRectProps;
  checkIsOpacityLine?: (e: any) => boolean;
}

type IHoverLine = IHoverLineOwnProps & Pick<IDragProps, 'width' | 'height' | 'rowHeight'>;

type IPosition = { x: number; y: number } | null;

export const HoverLine: React.FC<React.PropsWithChildren<IHoverLine>> = (props) => {
  const {
    isChangeColumnsWidth,
    setDirection,
    dragOption: { overTargetId },
    rowHeight,
    width,
    height,
    getFieldId,
    getRecordId,
    getElementRect,
  } = props;
  const colors = useThemeColors();
  const dragTarget = useAppSelector((state) => Selectors.getGridViewDragState(state).dragTarget);
  const primaryFieldId = useAppSelector((state) => {
    const view = Selectors.getCurrentView(state)!;
    return view.columns[0].fieldId;
  });
  const [position, setPosition] = useState<IPosition>(null);

  function dragMoveForField(e: MouseEvent, element: HTMLElement) {
    const target = e.target as HTMLDivElement;

    if (target.classList.contains(FIELD_DOT) || getParentNodeByClass(target, FIELD_DOT)?.classList.contains(FIELD_DOT)) {
      return;
    }

    const opacityLine = getParentNodeByClass(target, OPACITY_LINE_CLASS);
    const info: any = getElementRect?.(e, MoveType.Column) || element.getBoundingClientRect();
    const overFieldId = getFieldId?.(e) || getElementDataset(element, 'fieldId');

    if (overFieldId == null || primaryFieldId === overTargetId || opacityLine) {
      return;
    }

    const isLayoutColumnLeft = (info?.offsetX || e.offsetX) <= Math.ceil(info.width / 2);
    setDirection(isLayoutColumnLeft ? DropDirectionType.BEFORE : DropDirectionType.AFTER);
    setPosition({
      x: isLayoutColumnLeft ? info.left : info.right,
      y: info.top,
    });
  }

  function dragMoveForRecord(e: MouseEvent, element: HTMLElement) {
    const info: any = getElementRect?.(e, MoveType.Row) || element.getBoundingClientRect();
    const overRecordId = getRecordId?.(e) || getElementDataset(element, 'recordId');

    if (overRecordId == null) {
      return;
    }

    const isLayoutRowTop = (info?.offsetY || e.offsetY) <= Math.ceil(rowHeight / 2);
    setDirection(isLayoutRowTop ? DropDirectionType.BEFORE : DropDirectionType.AFTER);
    setPosition({
      x: info.left,
      y: isLayoutRowTop ? info.top : info.bottom,
    });
  }

  // Solve dragging to the first row, need to determine whether the current period is the top half of the height or the bottom half of the height
  function dragMove(e: MouseEvent) {
    if (!e) return;

    const element = getParentNodeByClass(e.target as HTMLElement, [CELL_CLASS, OPERATE_HEAD_CLASS, FIELD_HEAD_CLASS]);

    if ((!element || typeof element.getBoundingClientRect !== 'function') && !getElementRect) {
      setPosition(null);
      return;
    }

    if (dragTarget.fieldId) {
      dragMoveForField(e, element!);
      return;
    }

    dragMoveForRecord(e, element!);
  }

  function changeColumnsWidth(e: MouseEvent) {
    if (!isChangeColumnsWidth) {
      return;
    }
    setPosition({
      x: e.pageX,
      y: e.pageY,
    });
  }

  useEffect(() => {
    if (isChangeColumnsWidth) {
      window.addEventListener('mousemove', changeColumnsWidth);
    }
    if (Object.keys(dragTarget).length) {
      window.addEventListener('mousemove', dragMove);
    }
    return () => {
      window.removeEventListener('mousemove', changeColumnsWidth);
      window.removeEventListener('mousemove', dragMove);
    };
  });

  let style: React.CSSProperties = {
    background: colors.primaryColor,
    position: 'absolute',
    cursor: 'col-resize',
    zIndex: 10,
    pointerEvents: 'none',
  };

  const containerRect = useMemo(() => {
    const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
    return containerDom!.getBoundingClientRect();
    // eslint-disable-next-line
  }, [width]);

  if ((!Object.keys(dragTarget).length && !isChangeColumnsWidth) || !position) {
    return <></>;
  }

  if (dragTarget.fieldId || isChangeColumnsWidth) {
    style = { ...style, height, width: 2, top: 0, left: position.x - containerRect.left };
  } else {
    style = { ...style, height: 2, width, top: position.y - containerRect.top, left: 0 };
  }

  return <div style={style} />;
};
