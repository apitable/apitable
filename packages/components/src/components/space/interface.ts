import { ElementType } from 'react';
import { FLEX_ALIGN } from './constant';

type IAlign = keyof typeof FLEX_ALIGN;

export interface ISpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing, default is 8px */
  size?: number | number[];
  /** Custom HTML tag, default is ` div` */
  component?: ElementType;
  /** Vertical layout */
  vertical?: boolean;
  /** Whether wrap or not */
  wrap?: boolean;
  align?: IAlign;
  split?: boolean;
}