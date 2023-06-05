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
  favicon?: string;
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
  clipFunc?: (ctx: any) => void;
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
