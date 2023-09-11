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

import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import classNames from 'classnames';
import { FC } from 'react';
import styles from './style.module.less';

export interface ITextInputProps extends InputProps {
  err?: string;
}

export const TextInput: FC<React.PropsWithChildren<ITextInputProps>> = (props) => {
  const { err, width = 330, height = 50, ...rest } = props;
  return (
    <div
      className={classNames({
        [styles.textInput]: true,
      })}
    >
      <Input {...rest} className={err ? 'err' : ''} style={{ height, width }} />
      <div className={styles.errmsg}>{err}</div>
    </div>
  );
};
