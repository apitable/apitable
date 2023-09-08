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

// https://github.com/airbnb/is-touch-device/blob/master/src/index.js
export function isTouchDevice() {
  return (
    !!(
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        ((window as any).DocumentTouch && typeof document !== 'undefined' && document instanceof (window as any).DocumentTouch))
    ) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || navigator['msMaxTouchPoints']))
  );
}

const mobileReg =
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

export function isPcDevice() {
  return !navigator.userAgent.match(mobileReg);
}
