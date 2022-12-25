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
import { UrlStyled } from './styled';

interface ICellUrl {
  value: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellUrl = (props: ICellUrl) => {
  const { value, cellClassName, cellStyle } = props;
  if (!value) {
    return null;
  }
  const handleClick = () => {
    let url = '';
    try {
      // use URL Verifying Address Legitimacy with URL Constructors.
      const testURL = new URL(value);
      if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
        url = testURL.href;
      } else {
        console.log('error', 'Illegal links');
        return;
      }
    } catch (error) {
      // No protocol header, add http protocol header by default.
      try {
        const testURL = new URL(`http://${value}`);
        url = testURL.href;
      } catch (error) {
        console.log('error', 'Illegal links');
        return;
      }
    }
    try {
      const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
      newWindow && ((newWindow as any).opener = null);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <UrlStyled className={cellClassName} style={cellStyle} onClick={handleClick}>
      {value}
    </UrlStyled>
  );
};