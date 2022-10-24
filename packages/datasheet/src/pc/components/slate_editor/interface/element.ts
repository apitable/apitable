import { Element, Text } from 'slate';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { ElementType, NodeType, ALIGN } from '../constant';
import { IUnitValue } from '@apitable/core';

export interface IElementData {
  className?: string;
  // 缩进
  indent?: number;
  align?: ALIGN;
  [key : string]: unknown;
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
export interface IMentionElementData extends IElementData, IUnitValue{
}
export interface ICodeBlockWrapElementData extends IElementData{
  lang?: string;
}

export interface IElement<T = IElementData> extends Element {
  type: ElementType;
  object: NodeType;
  _id: string;
  data: T;
  isVoid?: boolean;
}

export interface IElementRenderProps<E extends IElement, D = IElementData > extends RenderElementProps {
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
