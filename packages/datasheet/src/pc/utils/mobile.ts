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

