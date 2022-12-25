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

import { string2Segment, SegmentType } from '@apitable/core';
import React, { CSSProperties } from 'react';
import { CellEmail } from '../cell_email';
import { CellText } from '../cell_text';
import { CellUrl } from '../cell_url';

interface ICellEnhanceText {
  text: string | null;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

export const CellEnhanceText = (props: ICellEnhanceText) => {
  const { text, cellClassName, cellStyle } = props;
  if (!text) {
    return null;
  }
  const enhanceTexts = string2Segment(text);
  return (
    <div className={cellClassName} style={cellStyle}>
      {enhanceTexts.map((enhanceText, index) => {
        if (enhanceText.type === SegmentType.Url) {
          return <CellUrl key={index} value={enhanceText.link} />;
        }
        if (enhanceText.type === SegmentType.Email) {
          return <CellEmail key={index} value={enhanceText.link} />;
        }
        return <CellText key={index} text={enhanceText.text}/>;
      })}
    </div>
  );
};