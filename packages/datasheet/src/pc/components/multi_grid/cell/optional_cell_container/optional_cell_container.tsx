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
import * as React from 'react';
import { RowHeightLevel } from '@apitable/core';
import styles from './style.module.less';
interface IOptionalCellContainerProps {
  displayMinWidth: boolean;
  [key: string]: any;
  viewRowHeight?: RowHeightLevel;
  className?: string;
}

export const OptionalCellContainer: React.FC<React.PropsWithChildren<IOptionalCellContainerProps>> = (props) => {
  const { children, className, displayMinWidth, viewRowHeight, ...rest } = props;

  return (
    <div
      className={classNames(
        {
          [styles.optionCellContainer]: true,
          [styles.minWidth]: displayMinWidth,
          [styles.rowHeightHigh]: viewRowHeight && viewRowHeight !== RowHeightLevel.Short,
        },
        className,
        'optionCellContainer',
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
