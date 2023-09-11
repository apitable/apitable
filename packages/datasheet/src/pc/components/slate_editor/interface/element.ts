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

import { Element, Text } from 'slate';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { IUnitValue } from '@apitable/core';
import { ElementType, NodeType, ALIGN } from '../constant';

export interface IElementData {
  className?: string;
  indent?: number;
  align?: ALIGN;
  [key: string]: unknown;
}

export interface ILinkElementData extends IElementData {
  link: string;
}
export interface ITaskElementData extends IElementData {
  checked: boolean;
}

export interface IImageElementData extends IElementData {
  url?: string;
  name?: string;
  size?: number;
  type?: string;
  width?: number;
}
export interface IMentionElementData extends IElementData, IUnitValue {}
export interface ICodeBlockWrapElementData extends IElementData {
  lang?: string;
}

export interface IElement<T = IElementData> extends Element {
  type: ElementType;
  object: NodeType;
  _id: string;
  data: T;
  isVoid?: boolean;
}

export interface IElementRenderProps<E extends IElement, D = IElementData> extends RenderElementProps {
  element: E;
  data?: D;
}

interface IMarks {
  [key: string]: string | number | boolean;
}

export declare type TText = Text & IMarks;

export interface ILeafRenderProps extends RenderLeafProps {
  leaf: TText;
}
