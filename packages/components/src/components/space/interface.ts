import { ElementType } from 'react';
import { FLEX_ALIGN } from './constant';

type IAlign = keyof typeof FLEX_ALIGN;

export interface ISpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 间距，px 单位，默认为 8 */
  size?: number | number[];
  /** 自定义 HTML 标签，默认为 `div` */
  component?: ElementType;
  /** 列布局 */
  vertical?: boolean;
  /** 换行 */
  wrap?: boolean;
  align?: IAlign;
  split?: boolean;
}