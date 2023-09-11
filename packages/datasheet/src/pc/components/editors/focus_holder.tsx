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

import { useImperativeHandle, forwardRef, useRef } from 'react';

import * as React from 'react';
import style from './style.module.less';

const noop = () => {};

export const FocusHolderBase: React.ForwardRefRenderFunction<{ focus(): void }> = (_, ref) => {
  const focusRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      focusRef.current && focusRef.current.focus();
    },
    setValue: noop,
    saveValue: noop,
  }));

  return <input style={{ height: 0 }} ref={focusRef} className={style.focusHolder} />;
};

export const FocusHolder = forwardRef(FocusHolderBase);
