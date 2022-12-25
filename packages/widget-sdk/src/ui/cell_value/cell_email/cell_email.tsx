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

import React, { CSSProperties } from 'react';
import { EmailStyled } from './styled';

interface ICellEmail {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellEmail = (props: ICellEmail) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    const url = `mailto:${value}`;
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <EmailStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </EmailStyled>
  );
};