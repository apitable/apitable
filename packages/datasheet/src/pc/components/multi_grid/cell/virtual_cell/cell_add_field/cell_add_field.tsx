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
import { CellType, IGroupInfo, ILinearRow, IPermissions } from '@apitable/core';
import { GRAY_COLOR_BORDER, groupColor } from '../cell_group_tab/cell_group_tab';

interface ICellAddField {
  rowIndex: number;
  actualColumnIndex: number;
  rows: ILinearRow[];
  groupInfo: IGroupInfo;
  permissions: IPermissions;
  style: React.CSSProperties;
  className: any;
  isEmptyRows: boolean;
}

export enum AddFieldWidth {
  Editable = '100px',
  EditDisable = '32px',
  Group = '40px',
}

export function getAddFieldWidth(fieldEditable: boolean, groupInfo: IGroupInfo) {
  if (!fieldEditable) {
    return AddFieldWidth.EditDisable;
  }
  if (groupInfo && groupInfo.length) {
    return AddFieldWidth.Group;
  }
  return AddFieldWidth.Editable;
}

export const CellAddField: React.FC<React.PropsWithChildren<ICellAddField>> = (props) => {
  const { rowIndex, rows, style, className, isEmptyRows, groupInfo, permissions } = props;
  const width = getAddFieldWidth(permissions.fieldCreatable, groupInfo);
  const row = rows[rowIndex];
  const nextRow = rows[rowIndex + 1];
  const isRowDepth0Blank = row.depth === 0 && row.type === CellType.Blank;
  const isNextRowDepth0Blank = (nextRow && nextRow.type === CellType.Blank && nextRow.depth === 0) || !nextRow;
  const showBorderBottom = isNextRowDepth0Blank;
  if (isRowDepth0Blank) {
    return null;
  }
  return (
    <div
      style={{
        ...style,
        width,
        borderBottom: showBorderBottom ? GRAY_COLOR_BORDER : 'none',
        borderTop: row.type === CellType.GroupTab && row.depth === 0 ? GRAY_COLOR_BORDER : 'none',
        borderRight: row.type === CellType.Blank && row.depth === 0 ? 'none' : '',
      }}
      className={classNames(className, !isEmptyRows && groupInfo.length ? groupColor(groupInfo.length)[0] : '')}
    />
  );
};
