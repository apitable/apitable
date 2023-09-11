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

import type { InputRef } from 'antd';
import { Input, Tooltip } from 'antd';
import { InputProps } from 'antd/lib/input';
import classNames from 'classnames';
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from 'react';
import styles from './style.module.less';

export interface IRenameInputProps extends InputProps {
  errorMsg?: string;
  customStyle?: string;
}

const RenameInputBase: ForwardRefRenderFunction<any, IRenameInputProps> = (props, ref) => {
  const inputRef = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current && inputRef.current.focus();
    },
  }));

  const { errorMsg, customStyle, ...rest } = props;
  const returnInputClass = (errorMsg?: string, customStyle?: string) => {
    const hasIcon = Boolean(rest.prefix || rest.suffix);
    if (errorMsg) {
      return classNames(customStyle, {
        [styles.inputError]: hasIcon,
        error: !hasIcon,
      });
    }
    return classNames(customStyle);
  };
  return (
    <div className={styles.viewItemInput}>
      <Tooltip title={errorMsg} placement="top" visible={Boolean(errorMsg)}>
        <Input ref={inputRef} className={returnInputClass(errorMsg, customStyle)} {...rest} />
      </Tooltip>
    </div>
  );
};

export const RenameInput = forwardRef(RenameInputBase);
