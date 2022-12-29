import { IWrapTextDataProps } from '../../utils';

export interface IRenderContentBase {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  url: string;
  id: string;
  unitInfo: any;
  style: {
    background?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    textDecoration?: 'underline' | 'line-through',
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  };
  textData?: IWrapTextDataProps;
}
export interface IRenderData {
  width: number;
  height: number;
  isOverflow: boolean;
  renderContent: IRenderContentBase | IRenderContentBase[] | null;
}