import { ScreenWidth } from '@vikadata/core';
import { isNumber } from 'lodash';

// https://github.com/airbnb/is-touch-device/blob/master/src/index.js
export function isTouchDevice() {
  return (
    !!(typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        ((window as any).DocumentTouch &&
          typeof document !== 'undefined' &&
          document instanceof (window as any).DocumentTouch))) ||
    !!(typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints || navigator['msMaxTouchPoints']))
  );
}

const mobileReg =
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

export function isPcDevice() {
  return !navigator.userAgent.match(mobileReg);
}

export function isSameSize(w1: number | null, w2: number | null) {
  if (!(isNumber(w1) && isNumber(w2))) {
    return false;
  }
  for (const [, v] of Object.entries(ScreenWidth)) {
    if ((w1 <= v && w2 > v) || (w2 <= v && w1 > v)) {
      return false;
    }
  }
  return true;
}
