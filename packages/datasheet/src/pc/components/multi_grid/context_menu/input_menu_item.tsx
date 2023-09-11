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

import classnames from 'classnames';
import * as React from 'react';
import { ChangeEvent, KeyboardEvent, ForwardRefRenderFunction, useImperativeHandle, useState, forwardRef, CSSProperties } from 'react';
import { TextInput } from '@apitable/components';
import { TComponent } from 'pc/components/common/t_component';
import styles from './styles.module.less';

interface IInputMenuItemProps {
  text: string;
  textKey: string;
  className?: string;
  style?: CSSProperties;
  initValue?: string | number;
  onChange?: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface IInputEditor {
  getValue: () => string;
  setValue: (value: string) => void;
}

const InputMenuItemBase: ForwardRefRenderFunction<IInputEditor, IInputMenuItemProps> = (props, ref) => {
  const { text, textKey, initValue, style, className, onChange: _onChange, onKeyDown } = props;
  const [value, setValue] = useState(initValue == null ? '' : String(initValue));

  useImperativeHandle(
    ref,
    (): IInputEditor => ({
      getValue() {
        return value;
      },
      setValue(value: string) {
        setValue(value);
      },
    }),
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const curValue = e.target.value;
    return _onChange ? _onChange(curValue) : setValue(curValue);
  };

  return (
    <div className={styles.menuInputItem}>
      <TComponent
        tkey={text}
        params={{
          [textKey]: (
            <TextInput
              value={value}
              size={'small'}
              style={{
                textAlign: 'center',
                ...style,
              }}
              className={classnames(styles.menuInput, className)}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          ),
        }}
      />
    </div>
  );
};

export const InputMenuItem = forwardRef(InputMenuItemBase);
