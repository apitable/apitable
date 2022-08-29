import Position from './position';

import { throttle } from 'lodash';
// 检查当前元素是否可见
export const isInView = (node: HTMLElement): boolean => {
  const rect = node.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight && 
    rect.right <= window.innerWidth
  );
};

export const isVisible = (node: HTMLElement) => {
  const style = node.style;
  if((node.offsetWidth <= 0 && node.offsetHeight <= 0) ||
    node.hidden || 
    ((style.opacity.length > 0) && (Number(style.opacity) < 1)) ||
    style.display === 'none' ||
    ['collapse', 'hidden'].indexOf(style.visibility) > -1){
    return false;
  }
  return true;
};
const scrollManually = (node: HTMLElement) => {
  const elementRect = node.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle = absoluteElementTop - (window.innerHeight / 2);

  window.scrollTo(0, middle);
};

/**
 * Brings the element to middle of the view port if not in view
 * @public
 */
export const bringInView = (node: HTMLElement, scrollIntoViewOptions?: ScrollIntoViewOptions) => {
  if (isInView(node)) {
    return;
  }

  // If browser does not support scrollIntoView
  if (!node.scrollIntoView) {
    scrollManually(node);
    return;
  }

  try {
    const finalOptions = scrollIntoViewOptions || { behavior: 'instant',block: 'center' };
    node.scrollIntoView(finalOptions as ScrollIntoViewOptions);
  } catch (e) {
    // `block` option is not allowed in older versions of firefox, scroll manually
    scrollManually(node);
  }
};

/**
   * Gets the size for popover
   * @returns {{height: number, width: number}}
   * @public
   */
export const getSize = (node: HTMLElement): {height: number, width: number} => {
  return {
    height: Math.max(node.scrollHeight, node.offsetHeight),
    width: Math.max(node.scrollWidth, node.offsetWidth),
  };
};

export const getCalculatedPosition = (node: HTMLElement): Position => {
  const body = document.body;
  const documentElement = document.documentElement;

  const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
  const elementRect = node.getBoundingClientRect();
  return new Position({
    top: elementRect.top + scrollTop,
    left: elementRect.left + scrollLeft,
    right: elementRect.left + scrollLeft + elementRect.width,
    bottom: elementRect.top + scrollTop + elementRect.height,
  });
};
/**
   * @returns {{height: number, width: number}}
   * @public
   */
export const getFullPageSize = (): {height: number, width: number} => {
  // eslint-disable-next-line prefer-destructuring
  const body = document.body;
  const html = document.documentElement;

  return {
    height: Math.max(body.scrollHeight, body.offsetHeight, html.scrollHeight, html.offsetHeight),
    width: Math.max(body.scrollWidth, body.offsetWidth, html.scrollWidth, html.offsetWidth),
  };
};

// 获取元素的css属性
export const getStyleProperty = (element, propertyName, prefixVendor = false) => {
  if (prefixVendor) {
    const prefixes = ['', '-webkit-', '-ms-', 'moz-', '-o-'];
    for (let counter = 0; counter < prefixes.length; counter++) {
      const prefixedProperty = prefixes[counter] + propertyName;
      const foundValue = getStyleProperty(element, prefixedProperty);

      if (foundValue) {
        return foundValue;
      }
    }

    return '';
  }

  let propertyValue = '';

  if (element.currentStyle) {
    propertyValue = element.currentStyle[propertyName];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    propertyValue = document.defaultView
      .getComputedStyle(element, null)
      .getPropertyValue(propertyName);
  }

  return propertyValue && propertyValue.toLowerCase ? propertyValue.toLowerCase() : propertyValue;
};

export const canMakeRelative = (targetDom: HTMLElement) => {
  const currentPosition = getStyleProperty(targetDom, 'position');
  const avoidPositionsList = ['absolute', 'fixed', 'relative'];
  return avoidPositionsList.indexOf(currentPosition) === -1;
};

export class DomEventListener {
  static prevDom: Element | null;
  static prevDomEventFunc: (() => void) | null = null;

  static addEventListener(targetDom: Element, func: () => void) {
    this.removeEventListener();
    this.prevDom = targetDom;
    this.prevDomEventFunc = throttle(() => {
      func();
      this.removeEventListener();
    }, 2000, { trailing: false });
    targetDom.addEventListener('click', this.prevDomEventFunc);
  }
  static removeEventListener() {
    if (this.prevDom && this.prevDomEventFunc) {
      this.prevDom && this.prevDom.removeEventListener('click', this.prevDomEventFunc);
      this.prevDom = null;
      this.prevDomEventFunc = null;
    }
  }
}

interface IFocusDomParams {
  element: string;
  domFound: (dom: HTMLElement) => void;
  timer: any;
  onTarget?: () => void;
}
export const FocusDom = function(params: IFocusDomParams){
  const domFound = params.domFound;
  let count = 0;
  const startFind = () => {
    params.timer = window.setInterval(() => {
      const targetDom = document.querySelector(params.element);
      if (targetDom){
        clearInterval(params.timer);
        params.timer = null;
        domFound(targetDom as HTMLElement);
        // 监听事件
        params.onTarget && DomEventListener.addEventListener(targetDom, params.onTarget);
      } else {
        if (++count >= 80) {
          clearInterval(params.timer);
        }
        console.warn('this element in this guide step didn\'t found:', params.element);
      }
    }, 50);
  };

  const F = function(){};

  F.prototype.init = function(){
    startFind();
  };

  return F;
};
