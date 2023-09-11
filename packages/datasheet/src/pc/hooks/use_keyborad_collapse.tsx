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

import { useEffect, useRef } from 'react';
import { browser } from 'modules/shared/browser';

export function useKeyboardCollapse(callback: Function) {
  const callbackRef = useRef<Function>();
  callbackRef.current = callback;
  const originHeight = useRef<number>(document.documentElement.clientHeight || document.body.clientHeight);

  useEffect(() => {
    const isAndroid = browser?.is('android');
    const handelAndroidResize = () => {
      const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (originHeight.current < resizeHeight) {
        callbackRef.current?.();
      }
      originHeight.current = resizeHeight;
    };

    if (isAndroid) {
      window.addEventListener('resize', handelAndroidResize, false);
    }

    return () => {
      if (isAndroid) {
        window.removeEventListener('resize', handelAndroidResize, false);
      }
    };
  }, []);
}
