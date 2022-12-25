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

import { css } from 'styled-components';

const fontWeightBold = 'bold';
const fontWeightRegular = 'normal';

const buildVariant = (fontWeight: string, fontSize: number, lineHeight: number) => (css`
  font-size: ${`${fontSize}px`};
  font-weight: ${fontWeight};
  line-height: ${`${lineHeight}px`};
`);

export const fontVariants = {
  h1: buildVariant(fontWeightBold, 32, 48),
  h2: buildVariant(fontWeightBold, 28, 42),
  h3: buildVariant(fontWeightBold, 24, 36),
  h4: buildVariant(fontWeightBold, 20, 30),
  h5: buildVariant(fontWeightBold, 18, 28),
  h6: buildVariant(fontWeightBold, 16, 24),
  h7: buildVariant(fontWeightBold, 14, 22),
  h8: buildVariant(fontWeightBold, 13, 20),
  h9: buildVariant(fontWeightBold, 12, 18),
  body1: buildVariant(fontWeightRegular, 16, 24),
  body2: buildVariant(fontWeightRegular, 14, 22),
  body3: buildVariant(fontWeightRegular, 13, 20),
  body4: buildVariant(fontWeightRegular, 12, 18),
};

export type IFontVariants = keyof typeof fontVariants;