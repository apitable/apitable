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

import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { FocusHolder } from '../focus_holder';
import { IEditor, IBaseEditorProps } from '../interface';

export interface IEditorProps extends IBaseEditorProps {
  editing: boolean;
  style: React.CSSProperties;
  toggleEditing?: (next?: boolean) => void;
}

export const NoneEditorBase: React.ForwardRefRenderFunction<IEditor, IEditorProps> = (_props, ref) => {
  const inputRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        inputRef.current && inputRef.current.focus();
      },
      onEndEdit: () => {
        return;
      },
      onStartEdit: () => {
        return;
      },
      setValue: () => {
        return;
      },
      saveValue: () => {
        return;
      },
    }),
  );

  return <FocusHolder ref={inputRef} />;
};

export const NoneEditor = forwardRef(NoneEditorBase);
