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