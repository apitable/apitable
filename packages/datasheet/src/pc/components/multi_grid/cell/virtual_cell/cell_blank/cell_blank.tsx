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

import * as React from 'react';
import { ILinearRowBlank } from '@apitable/core';
import { GRAY_COLOR_BORDER } from '../cell_group_tab/cell_group_tab';
import { getGroupColor } from '../utils';

interface ICellBlank {
  actualColumnIndex: number;
  style: React.CSSProperties;
  columnsLength: number;
  groupLength: number;
  row: ILinearRowBlank;
  needOffsetBorderBottom?: boolean;
}

export const CellBlank: React.FC<React.PropsWithChildren<ICellBlank>> = (props) => {
  const { style, row, actualColumnIndex, groupLength, needOffsetBorderBottom } = props;
  return (
    <div
      style={{
        ...style,
        background: getGroupColor(groupLength)(row.depth - 1),
        marginLeft: actualColumnIndex === 0 && groupLength - 1 > 0 ? (groupLength - 1) * 16 : 0,
        borderBottom: needOffsetBorderBottom ? GRAY_COLOR_BORDER : '',
      }}
    />
  );
};
