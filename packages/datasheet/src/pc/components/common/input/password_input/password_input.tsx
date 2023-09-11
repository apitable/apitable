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

import { useBoolean } from 'ahooks';
import { FC } from 'react';
import { ITextInputProps, TextInput } from '@apitable/components';
import { EyeCloseOutlined, EyeOpenOutlined, LockFilled } from '@apitable/icons';
import styles from './style.module.less';

export const PasswordInput: FC<React.PropsWithChildren<ITextInputProps>> = (props) => {
  const [isVisible, { toggle }] = useBoolean(false);

  return (
    <TextInput
      type={isVisible ? 'text' : 'password'}
      prefix={<LockFilled />}
      suffix={
        <div className={styles.suffixIcon} onClick={() => toggle()} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {isVisible ? <EyeOpenOutlined /> : <EyeCloseOutlined />}
        </div>
      }
      {...props}
    />
  );
};
