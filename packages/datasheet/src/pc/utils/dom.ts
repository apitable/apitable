import { Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { Message } from 'pc/components/common/message/message';
import React from 'react';
import { shallowEqual } from 'react-redux';
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
 * 判断指定点是否在给定的容器范围内
 * @param {IPoint} point 是一个包含x,y属性的对象
 * @param {DOMRect} container 是一个DOMRect对象
 * @param {number} [spacing] 与容器边界的距离（默认没有该值）
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
  if (innerLeftBoundary < point.x && point.x < innerRightBoundary
    && innerTopBoundary < point.y && point.y < innerBottomBoundary) {
    return scrollParam;
  }
  // 向左
  if (container.left < point.x && point.x < innerLeftBoundary) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'left';
    scrollParam.rowSpeed = Math.ceil(baseSpeed * (point.x - innerLeftBoundary) / spacing);
  }
  // 向右
  if (innerRightBoundary < point.x && point.x < container.right) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'right';
    scrollParam.rowSpeed = Math.ceil(baseSpeed * (point.x - innerRightBoundary) / spacing);
  }
  // 向上
  if (container.top < point.y && point.y < innerTopBoundary) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'top';
    scrollParam.columnSpeed = Math.ceil(baseSpeed * (point.y - innerTopBoundary) / spacing);
  }
  // 向下
  if (innerBottomBoundary < point.y && point.y < container.bottom) {
    scrollParam.shouldScroll = true;
    scrollParam.scrollDirection = 'bottom';
    scrollParam.columnSpeed = Math.ceil(baseSpeed * (point.y - innerBottomBoundary) / spacing);
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
export function getParentNodeByClass(
  element: HTMLElement,
  className: string | string[],
): HTMLElement | null | undefined {
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
    // 浏览器不兼容 HTMLElement.dataset 的时候尝试用 getAttribute 获取
    const attrKey = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const dataset = element.getAttribute(attrKey);
    if (dataset) {
      return dataset;
    }
    return null;
  }
  return element.dataset[key];
}

export function stopPropagation(e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

export function byte2Mb(byte: number | undefined) {
  if (!byte) {
    return 0;
  }
  return parseFloat((byte / 1024 / 1024).toFixed(2));
}

// 根据单击的cell上绑定的recordId和fieldId计算出相应的rowIndex和columnIndex
export const getClickCellId = (target: HTMLElement, includeGroupHead = false) => {
  let recordId = getElementDataset(
    getParentNodeByClass(target, [CELL_CLASS, OPERATE_HEAD_CLASS]), 'recordId',
  );

  if (!recordId && includeGroupHead) {
    recordId = getElementDataset(
      getParentNodeByClass(target, [GROUP_TITLE]), 'groupHeadRecordId',
    );
  }

  const fieldId = getElementDataset(
    getParentNodeByClass(target, [CELL_CLASS, FIELD_HEAD_CLASS]), 'fieldId',
  );

  return {
    fieldId,
    recordId,
  };
};

export const getGroupHeadRecordId = (e: React.MouseEvent | MouseEvent) => {
  const groupHeadRecordId = getElementDataset(
    getParentNodeByClass(
      e.target as HTMLElement, [OPERATE_HEAD_CLASS, CELL_CLASS, OPERATE_BUTTON_CLASS, GROUP_TITLE]), 'groupHeadRecordId',
  );
  return groupHeadRecordId;
};

// 用于排查细嫩的工具函数
export function findRenderCause<T>(pre: T, cur: T, except?: string[]) {
  for (const k in pre) {
    if (except && except.includes(k)) {
      continue;
    }
    if (pre[k] !== cur[k]) {
      console.group(k);
      console.log(pre[k]);
      console.log(cur[k]);
      console.groupEnd();
    }
  }
  return shallowEqual(pre, cur);
}

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

const CLIPBOARD_INPUT = 'CLIPBOARD_INPUT';

export function copy2clipBoard(content: string, successFn: () => void = copySuccess) {
  let input = document.getElementById(CLIPBOARD_INPUT) as HTMLInputElement;
  if (!input) {
    input = document.createElement('input');
    input.id = CLIPBOARD_INPUT;
    document.body.appendChild(input);
  }

  input.setAttribute('value', content);
  input.setAttribute('readonly', 'readonly');
  input.select();
  if (document.execCommand('copy')) {
    successFn();
  }
}

export function getFieldHeaderByFieldId(fieldId: string) {
  return document.querySelector(`.fieldHeaderClass[data-field-id=${fieldId}]`);
}

/**
 * 获取一段文本的长度
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
 * @param text 文本
 * @param font 字体 eg. 'bold 12pt arial'
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
 * clone一个svg，使svg具有默认样式的同时可自定义样式
 * @param icon 需要处理的icon
 * @param defaultSize icon默认的宽高
 * @param extraClassName 需要给该icon添加额外的className
 */
export const stylizeIcon = (funcProps: ICloneIconFuncProps) => {
  const { icon, defaultSize, extraClassName } = funcProps;
  const finalIcon = icon && (
    React.isValidElement<{ className?: string, width?: number, height?: number, fill?: string, style?: React.CSSProperties }>(icon)
      ? React.cloneElement(
        icon,
        {
          width: icon.props.width || defaultSize,
          height: icon.props.height || defaultSize,
          fill: icon.props.fill || 'currentColor',
          style: icon.props.style,
          className: classNames({
            [icon.props.className!]: icon.props.className,
            [extraClassName!]: Boolean(extraClassName),
          }),
        },
      )
      : { icon }
  );
  return finalIcon;
};

/**
 * 查找 dom 容器下的选择器下的子项列表
 * @param container 固定的 dom 容器
 * @param selector dom 容器下需要查找的子项列表的归属选择器名称
 */
export const getChildListByContainerSelector = (container: HTMLElement, selector: string) => {
  const element = container.querySelector(selector);
  const childNodes = element?.children;
  if (!childNodes || childNodes.length === 0) return [];
  return Array.from(childNodes) as HTMLElement[];
};

export const isInContainer = (el, container) => {
  if (!el || !container) return false;

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right;
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

