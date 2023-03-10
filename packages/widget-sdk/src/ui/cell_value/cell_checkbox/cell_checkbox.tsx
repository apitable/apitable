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

import { compact } from 'lodash';
import React, { CSSProperties } from 'react';
import { Emoji } from 'ui/_private/emoji';
import { CheckboxStyled, CheckboxWrapperStyled } from './styled';

interface ICellCheckbox {
  field: {
    icon: string
  };
  checked: boolean | boolean[];
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellCheckbox = (props: ICellCheckbox) => {
  const { field, checked, className, style, cellClassName, cellStyle } = props;
  const renderCheckbox = (status: boolean, idx?: number) => (
    <CheckboxStyled checked={status} className={cellClassName} style={cellStyle} key={idx}>
      <Emoji emoji={field.icon} size={16} />
    </CheckboxStyled>
  );
  return Array.isArray(checked) ? (
    <CheckboxWrapperStyled className={className} style={style}>
      {compact(checked).map(renderCheckbox)}
    </CheckboxWrapperStyled>
  ) : renderCheckbox(checked);
};