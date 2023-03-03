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

import { useMemo } from 'react';
import * as React from 'react';
import { IGridViewColumn, Selectors } from '@apitable/core';
import styles from './styles.module.less';
import { OPERATE_COLUMN_WIDTH } from '../cell';

interface IShallowLine {
  frozenColumns: IGridViewColumn[];
  groupOffset: number;
  scrollLeft: number;
}

export const ShallowLine: React.FC<React.PropsWithChildren<IShallowLine>> = React.memo(props => {
  const { frozenColumns, groupOffset, scrollLeft } = props;
  const frozenColumnWidth = useMemo(() => {
    return frozenColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), 0);
  }, [frozenColumns]);
  return (
    <div
      className={styles.shallowLine}
      style={{
        left: scrollLeft > 0 ?
          frozenColumnWidth + OPERATE_COLUMN_WIDTH - 5 + groupOffset + 3 : -10000,
      }}
    />
  );
});
