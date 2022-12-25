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
import { CellEnhanceText } from '../cell_enhance_text';

interface ICellMultiText {
  text: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellMultiText = (props: ICellMultiText) => {
  const { text, cellClassName, cellStyle } = props;
  if (!text) {
    return null;
  }
  const multiTexts = text.split(/\n/g);
  return (
    <div className={cellClassName} style={cellStyle}>
      {multiTexts.map((multiText, index) => (
        <CellEnhanceText key={index} text={multiText} />
      ))}
    </div>
  );
};