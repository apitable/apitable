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

import {
  ITextEllipsisProps,
} from 'pc/components/konva_grid';

import { getTextWidth } from 'pc/components/konva_grid/utils/get_text_width';
import { DEFAULT_FONT_FAMILY } from 'pc/utils';

export class TextEllipsisEngine {
  public static textEllipsis(props: ITextEllipsisProps, ctx: CanvasRenderingContext2D) {
    const { text, maxWidth, fontSize = 13, fontWeight = 'normal' } = props;

    if (text == null)
      return {
        text: '',
        textWidth: 0,
        isEllipsis: false,
      };
    const fontStyle = `${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;

    if (!maxWidth) {
      return {
        text,
        textWidth: getTextWidth(ctx, text, fontStyle),
        isEllipsis: false,
      };
    }

    const ellipsis = '…';
    const textSize = text.length;
    // Predetermine the threshold width of the incoming text
    let guessSize = Math.ceil(maxWidth / fontSize);
    let guessText = text.substr(0, guessSize);
    let guessWidth = getTextWidth(ctx, guessText, fontStyle);

    while (guessWidth <= maxWidth) {
      if (textSize <= guessSize) {
        return {
          text,
          textWidth: guessWidth,
          isEllipsis: false,
        };
      }
      guessSize++;
      guessText = text.substr(0, guessSize);
      guessWidth = getTextWidth(ctx, guessText, fontStyle);
    }

    const ellipsisWidth = getTextWidth(ctx, ellipsis, fontStyle);
    while (guessSize >= 0 && guessWidth + ellipsisWidth > maxWidth) {
      guessSize--;
      guessText = text.substr(0, guessSize);
      guessWidth = getTextWidth(ctx, guessText, fontStyle);
    }

    return {
      text: `${guessText || text[0]}${ellipsis}`,
      textWidth: maxWidth,
      isEllipsis: true,
    };
  }
}
