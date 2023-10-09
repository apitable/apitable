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
import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { ConfigConstant, Field } from '@apitable/core';

import { Emoji } from 'pc/components/common';
import { stopPropagation } from 'pc/utils/dom';
import { KeyCode } from 'pc/utils/keycode';
import { FocusHolder } from '../focus_holder';
import { IBaseEditorProps, IEditor } from '../interface';
import styles from './style.module.less';

export interface ICheckboxEditorProps extends IBaseEditorProps {
  datasheetId: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  cellValue?: boolean;
  commandFn?: (data: boolean) => void;
}

const CheckboxEditorBase: React.ForwardRefRenderFunction<IEditor, ICheckboxEditorProps> = (props, ref) => {
  const { cellValue, field, editable, commandFn, disabled, style, onSave, onChange } = props;
  const [_value, setValue] = useState(false);
  const cellValueExist = cellValue != null;
  const checked = cellValue ?? false;
  const value = cellValue ? checked : _value;
  const editorRef = useRef<HTMLInputElement>(null);

  const icon = Field.bindModel(field).isComputed ? ConfigConstant.DEFAULT_CHECK_ICON : field.property.icon;
  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        focus();
      },
      onEndEdit: (cancel: boolean) => {
        if (cellValueExist) return;
        onEndEdit(cancel);
      },
      onStartEdit: (value?: boolean | null) => {
        if (cellValueExist) return;
        onStartEdit(value);
      },
      setValue: (value?: boolean | null) => {
        if (cellValueExist) return;
        onStartEdit(value);
      },
      saveValue: () => {
        if (cellValueExist) return;
        saveValue(value);
      },
    }),
  );

  const setEditorValue = (value: boolean | null) => {
    setValue(Boolean(value));
  };

  const focus = () => {
    editorRef.current && editorRef.current.focus();
  };

  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue(value);
    }
    setEditorValue(null);
  };

  const saveValue = (value: boolean) => {
    onSave && onSave(value);
  };

  const onStartEdit = (value?: boolean | null) => {
    setEditorValue(Boolean(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      if (editable) {
        const newValue = !value;
        saveValue(newValue);
      }
      stopPropagation(e);
    }
  };

  const handleChange = () => {
    if (disabled || !editable) return;
    const newValue = !value;
    setValue(newValue);
    saveValue(newValue);
    onChange && onChange(newValue);
    if (!cellValueExist && commandFn) {
      commandFn(newValue);
    }
  };
  return (
    <div className={styles.checkboxBase} style={style} onMouseDown={() => handleChange()} onMouseMove={stopPropagation} onKeyDown={handleKeyDown}>
      <FocusHolder ref={editorRef} />
      <span className={classNames({ [styles.unChecked]: !value, [styles.iconContainer]: true })}>
        <Emoji emoji={icon} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
      </span>
    </div>
  );
};

export const CheckboxEditor = memo(forwardRef(CheckboxEditorBase));
