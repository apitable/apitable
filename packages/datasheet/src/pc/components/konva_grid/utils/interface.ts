import { CellType, FieldType, ISegment } from '@apitable/core';

export type IFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter';

export interface IGraphProps {
  x: number;
  y: number;
}

export interface ILineProps extends IGraphProps {
  points: number[];
  stroke?: string;
  closed?: boolean;
}

export interface IRectProps extends IGraphProps {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  radius?: number[] | number;
}

export interface ITextProps extends IGraphProps {
  text: string;
  fillStyle?: string;
  fontSize?: number;
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  fontWeight?: IFontWeight;
  textDecoration?: 'underline' | 'line-through' | 'none';
}

export interface ILinkData {
  endIndex: number;
  url: string;
}

export interface IWrapTextProps extends ITextProps {
  maxWidth: number;
  lineHeight: number;
  fieldType: FieldType;
  maxRow?: number;
  originValue?: ISegment[] | null;
  isLinkSplit?: boolean;
  needDraw?: boolean;
}

export interface IImageProps extends IGraphProps {
  url: string;
  width: number;
  height: number;
  opacity?: number;
  clipFunc?: (ctx) => void;
}

export type ILabelProps = Omit<IRectProps & ITextProps, 'fillStyle'> & {
  background: string;
  color?: string;
  padding?: number;
};

export interface ICtxStyleProps {
  fontSize?: number;
  fontWeight?: IFontWeight;
  fillStyle?: string;
  strokeStyle?: string;
}

export interface ITextEllipsisProps {
  text: string;
  maxWidth?: number;
  fontSize?: number;
  fontWeight?: IFontWeight;
}

export interface IRenderEndBlankProps {
  x: number;
  y: number;
  type: CellType;
  depth: number;
  groupLength: number;
  height: number;
}

export type IWrapTextDataProps = {
  offsetX: number;
  offsetY: number;
  text: string;
  width: number;
  linkUrl: string | null;
}[];

export interface IWrapTextResultProps {
  height: number;
  data: IWrapTextDataProps;
}
