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

import cls from 'classnames';
import { useState } from 'react';
import * as React from 'react';
import { ChevronDownOutlined } from '@apitable/icons';
import { IFieldProps } from '../../../interface';
import { IHelp, HelpIconButton } from './style';
import styles from './style.module.less';

export const TitleField = (
  props: Pick<IFieldProps, 'id' | 'title' | 'required'> & {
    help?: IHelp;
    hasCollapse?: boolean;
    defaultCollapse?: boolean;
    onChange?: (collapse: boolean) => void;
    style?: React.CSSProperties;
  },
) => {
  const { title, id, help, hasCollapse, style, defaultCollapse = false, onChange, required } = props;
  const [, level] = (id || '').split('-');
  const titleLevel = Math.min(parseInt(level, 10) || 0, 2);
  const titleCls = cls(styles.h, {
    [styles.h1]: titleLevel === 0,
    [styles.h2]: titleLevel === 2,
    [styles.h3]: titleLevel === 3,
    [styles.hasCollapse]: hasCollapse,
  });
  const [collapse, setCollapse] = useState<boolean>(defaultCollapse);

  const switchCollapse = () => {
    if (!hasCollapse) return;
    const newValue = !collapse;
    setCollapse(newValue);
    onChange && onChange(newValue);
  };
  return (
    <div className={titleCls} style={style} id={id} onClick={switchCollapse}>
      {required && <span style={{ color: 'red', width: 10 }}>*</span>}
      {title}
      {help && <HelpIconButton help={help} />}
      {hasCollapse && (
        <span className={cls(styles.suffixIcon, { [styles.isIconRotate]: !collapse })}>
          {' '}
          <ChevronDownOutlined color="#8C8C8C" />
        </span>
      )}
    </div>
  );
};
