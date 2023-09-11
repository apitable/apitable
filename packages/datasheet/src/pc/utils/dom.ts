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

import classNames from 'classnames';
import React from 'react';
import { Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { CELL_CLASS, FIELD_HEAD_CLASS, GROUP_TITLE, OPERATE_BUTTON_CLASS, OPERATE_HEAD_CLASS } from './constant';

interface IPoint {
  x: number;
  y: number;
}

interface ICloneIconFuncProps {
  icon: React.ReactNode;
  defaultSize?: number;
  extraClassName?: string;
}

/**
 * Determine if the specified point is within the given container range
 * @param {IPoint} point is an object with x,y attributes
 * @param {DOMRect} container is a DOMRect object
 * @param {number} spacing distance from container boundary (no value by default)
 * @returns {object}
 */
export function checkPointInContainer(point: IPoint, container: DOMRect | ClientRect, spacing = 0): any {
  const innerLeftBoundary = container.left + spacing;
  const innerRightBoundary = container.right - spacing;
  const innerTopBoundary = container.top + spacing;
  const innerBottomBoundary = container.bottom - spacing;
  const baseSpeed = 15;
  const scrollParam = {
    columnSpeed: 0,
    rowSpeed: 0,
    shouldScroll: false,
    scrollDirection: '',
  };
  if (innerLeftBoundary < point.x && point.x < innerRightBoundary && innerTopBoundary < point.y && point.y < innerBottomBoundary) {
    return scrollParam;
  }
  // To the left
  if (container.left < point.x && point.x < innerLeftBoundary) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'left';
    scrollParam.rowSpeed = Math.ceil((baseSpeed * (point.x - innerLeftBoundary)) / spacing);
  }
  // To the right
  if (innerRightBoundary < point.x && point.x < container.right) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'right';
    scrollParam.rowSpeed = Math.ceil((baseSpeed * (point.x - innerRightBoundary)) / spacing);
  }
  // To the top
  if (container.top < point.y && point.y < innerTopBoundary) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'top';
    scrollParam.columnSpeed = Math.ceil((baseSpeed * (point.y - innerTopBoundary)) / spacing);
  }
  // To the bottom
  if (innerBottomBoundary < point.y && point.y < container.bottom) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'bottom';
    scrollParam.columnSpeed = Math.ceil((baseSpeed * (point.y - innerBottomBoundary)) / spacing);
  }
  return scrollParam;
}

function getParentNodeByOneClass(element: HTMLElement, className: string) {
  return element.closest(`.${className}`) as HTMLElement | null;
}

/**
 * @description
 * @export
 * @param {HTMLElement} element
 * @param {(string | string[])} className
 * @returns
 */
export function getParentNodeByClass(element: HTMLElement, className: string | string[]): HTMLElement | null | undefined {
  if (!element || !className || !className.length) {
    return null;
  }

  if (Array.isArray(className)) {
    if (className.length === 1) {
      return getParentNodeByOneClass(element, className[0]);
    }
    for (const cn of className) {
      const ele = getParentNodeByOneClass(element, cn);
      if (ele) {
        return ele;
      }
    }
    return null;
  }
  return getParentNodeByOneClass(element, className);
}

export function getElementDataset(element: HTMLElement | null | undefined, key: string) {
  if (!element) {
    return null;
  }
  if (!element.dataset) {
    // If the browser is not compatible with HTMLElement.dataset, try to use getAttribute to get
    const attrKey = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const dataset = element.getAttribute(attrKey);
    if (dataset) {
      return dataset;
    }
    return null;
  }
  return element.dataset[key];
}

export function stopPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

export function byte2Mb(byte: number | undefined) {
  if (!byte) {
    return 0;
  }
  return parseFloat((byte / 1024 / 1024).toFixed(2));
}

// Calculate the corresponding rowIndex and columnIndex based on the recordId and fieldId bound to the clicked cell
export const getClickCellId = (target: HTMLElement, includeGroupHead = false) => {
  let recordId = getElementDataset(getParentNodeByClass(target, [CELL_CLASS, OPERATE_HEAD_CLASS]), 'recordId');

  if (!recordId && includeGroupHead) {
    recordId = getElementDataset(getParentNodeByClass(target, [GROUP_TITLE]), 'groupHeadRecordId');
  }

  const fieldId = getElementDataset(getParentNodeByClass(target, [CELL_CLASS, FIELD_HEAD_CLASS]), 'fieldId');

  return {
    fieldId,
    recordId,
  };
};

export const getGroupHeadRecordId = (e: React.MouseEvent | MouseEvent) => {
  const groupHeadRecordId = getElementDataset(
    getParentNodeByClass(e.target as HTMLElement, [OPERATE_HEAD_CLASS, CELL_CLASS, OPERATE_BUTTON_CLASS, GROUP_TITLE]),
    'groupHeadRecordId',
  );
  return groupHeadRecordId;
};

export const getCookie = (name: string) => {
  if (document.cookie.length > 0) {
    const cname = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return '';
  }
  return '';
};

function copySuccess() {
  Message.success({ content: t(Strings.message_copy_link_successfully) });
}

function copyFailed() {
  Message.error({ content: t(Strings.message_copy_link_failed) });
}

const CLIPBOARD_INPUT = 'CLIPBOARD_INPUT';

function copyLinkWithInput(content: string, successFn: () => void = copySuccess) {
  let input = document.getElementById(CLIPBOARD_INPUT) as HTMLInputElement;
  if (!input) {
    input = document.createElement('input');
    input.id = CLIPBOARD_INPUT;
    document.body.appendChild(input);
  }
  input.setAttribute('value', content);
  input.setAttribute('readonly', 'readonly');
  input.select();
  // Asynchronous operations in safari browser return false
  if (document.execCommand('copy')) {
    successFn();
  } else {
    copyFailed();
  }
}

export function copy2clipBoard(content: string, successFn: () => void = copySuccess) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(content).then(
      () => {
        successFn();
      },
      () => {
        copyLinkWithInput(content, successFn);
      },
    );
  } else {
    copyLinkWithInput(content, successFn);
  }
}

export function getFieldHeaderByFieldId(fieldId: string) {
  return document.querySelector(`.fieldHeaderClass[data-field-id=${fieldId}]`);
}

/**
 * Get the length of a piece of text
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
 * console.log(getTextWidth("hello there!", "bold 12pt arial"));  // close to 86
 */
export function getTextWidth(text: string, font: string): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

/**
 * clone an svg, so that the svg has the default style and can be customized at the same time
 */
export const stylizeIcon = (funcProps: ICloneIconFuncProps) => {
  const { icon, defaultSize, extraClassName } = funcProps;
  const finalIcon =
    icon &&
    (React.isValidElement<{ className?: string; width?: number; height?: number; fill?: string; style?: React.CSSProperties }>(icon)
      ? React.cloneElement(icon, {
        width: icon.props.width || defaultSize,
        height: icon.props.height || defaultSize,
        fill: icon.props.fill || 'currentColor',
        style: icon.props.style,
        className: classNames({
          [icon.props.className!]: icon.props.className,
          [extraClassName!]: Boolean(extraClassName),
        }),
      })
      : { icon });
  return finalIcon;
};

/**
 * Find a list of subitems under the selector of the dom container
 * @param container Fixed dom container
 * @param selector The name of the attribution selector for the list of subitems to be found under the dom container
 */
export const getChildListByContainerSelector = (container: HTMLElement, selector: string) => {
  const element = container.querySelector(selector);
  const childNodes = element?.children;
  if (!childNodes || childNodes.length === 0) return [];
  return Array.from(childNodes) as HTMLElement[];
};

export const isInContainer = (el: Element, container: any) => {
  if (!el || !container) return false;

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return (
    elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right
  );
};

export const getSearchParams = () => {
  if (process.env.SSR) {
    return new Map();
  }
  return new URLSearchParams(window.location.search);
};

export const isRenderServer = () => {
  return process.env.SSR;
};
