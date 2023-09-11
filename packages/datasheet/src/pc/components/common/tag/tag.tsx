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
import React, { FC } from 'react';
import { lightColors } from '@apitable/components';
import styles from './style.module.less';

enum TagMod {
  FILL = 'fill',
  STROKE = 'stroke',
}

export const TagColors = {
  manager: lightColors.rc01,
  owner: lightColors.rc01,
  editor: lightColors.rc04,
  reader: lightColors.rc07,
  templateVisitor: lightColors.rc07,
  anonymous: lightColors.rc07,
  foreigner: lightColors.rc01,
  updater: lightColors.rc02,
};

export interface ITagProps {
  color?: string;
  mod?: 'fill' | 'stroke';
  size?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Tag: FC<React.PropsWithChildren<ITagProps>> = ({ color = '#000000', mod = TagMod.FILL, style, className, children }) => {
  const hexToRgba = (hex: string, opacity: number) => {
    // eslint-disable-next-line
    return `rgba(${parseInt(`0x${hex.slice(1, 3)}`, 16)},${parseInt('0x' + hex.slice(3, 5), 16)},${parseInt(
      '0x' + hex.slice(5, 7),
      16,
    )}, ${opacity})`;
  };

  const tagStyle =
    mod === TagMod.FILL
      ? {
        background: hexToRgba(color, 0.2),
        color,
      }
      : {
        border: `1px solid ${color}`,
        color,
      };

  return (
    <span className={classnames(styles.tag, mod === TagMod.FILL ? styles.fill : styles.stroke, className)} style={{ ...style, ...tagStyle }}>
      {children}
    </span>
  );
};
