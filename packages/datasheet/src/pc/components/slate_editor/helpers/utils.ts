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

import _isUrl from 'is-url';
import { cloneDeep } from 'lodash';
import { Editor, Range, Selection, Node, Element, Location } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType, LIST_ITEM_TYPE_DICT, IS_WRAP } from '../constant';
import { IVikaEditor } from '../interface/editor';
import { IElement, IImageElementData } from '../interface/element';

const defaultPoint = {
  path: [0, 0],
  offset: 0,
};

export const defaultSelection = {
  anchor: cloneDeep(defaultPoint),
  focus: cloneDeep(defaultPoint),
};

export const getDefaultSelection = (firstChild: IElement) => {
  if (!firstChild) {
    return defaultSelection;
  }
  if (IS_WRAP[firstChild.type]) {
    const point = cloneDeep(defaultPoint);
    point.path.push(0);
    return {
      anchor: point,
      focus: cloneDeep(point),
    };
  }
  return defaultSelection;
};

export const getValidSelection = (editor: Editor & IVikaEditor) => {
  // Special Note!
  // Here the cached lastSelection in unwrapNodes may cause a failure to find the node by caching the selection, thus causing a crash
  // When there is a need to unwrap or wrap the node, you should actively restore the previous selection beforehand
  return editor.selection || editor.lastSelection || getDefaultSelection(editor.children[0] as IElement);
};

export const getCurrentElement = (editor: any, location?: Location) => {
  const selection = location || (getValidSelection(editor) as Selection);
  const path = !selection
    ? [0, 0]
    : Range.isRange(selection)
      ? [...selection.focus.path]
      : Array.isArray(selection)
        ? [...selection, 0]
        : [...selection.path, 0];
  // The last path is a leaf text node and needs to be removed
  path.pop();
  try {
    let ele = Node.get(editor, path);
    while (ele && path.length && !Editor.isBlock(editor, ele)) {
      path.pop();
      ele = Node.get(editor, path);
    }
    return ele as IElement;
  } catch (error) {
    return editor as IElement;
  }
};

export const getParentElement = (editor: ReactEditor, curElement: IElement) => {
  try {
    const curElementPath = ReactEditor.findPath(editor, curElement);
    return Node.parent(editor, curElementPath);
  } catch (error) {
    return null;
  }
};

export const getValidElementType = (editor: ReactEditor, curElement: IElement): ElementType => {
  if (!curElement) {
    return ElementType.PARAGRAPH;
  }

  const curType = curElement.type;
  if (LIST_ITEM_TYPE_DICT[curType]) {
    const parent = getParentElement(editor, curElement);
    return parent ? getValidElementType(editor, parent as IElement) : ElementType.PARAGRAPH;
  }

  return curType;
};

export const isBlockActive = (editor: Editor, blockType: ElementType) => {
  try {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (n as IElement).type === blockType,
      at: getValidSelection(editor),
    });

    return !!match;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getMarkValue = (editor: Editor, mark: string) => {
  try {
    const marks = Editor.marks(editor);
    return marks && marks[mark];
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isMarkActive = (editor: Editor, mark: string, value: string | number | boolean = true) => {
  const markValue = getMarkValue(editor, mark);
  return markValue ? markValue === value : false;
};

export const isUrl = _isUrl;

export const isImage = (str: string) => {
  if (!isUrl(str)) {
    return false;
  }
  return /\.(png|jpg|jpeg|svg|gif|bmp|webp)$/i.test(str);
};

export interface ICalcPositionOption {
  anchor: DOMRect;
  popup: DOMRect;
  offset?: { x: number; y: number };
  align?: ['left' | 'center' | 'right', 'top' | 'middle' | 'bottom'];
}

export const getValidPopupPosition = ({ anchor, popup, offset = { x: 0, y: 0 }, align = ['right', 'top'] }: ICalcPositionOption) => {
  const [alh, alv] = align;
  const { top: at, left: al, height: ah, width: aw } = anchor;
  let { width: pw, height: ph } = popup;
  const { x: ox, y: oy } = offset;
  const wh = window.innerHeight;
  const ww = window.innerWidth;
  let top = at + oy,
      left = al + ox;
  if (alh === 'center') {
    pw /= 2;
    left = al - pw + aw / 2;
  }
  if (alv === 'middle') {
    ph /= 2;
    top -= ph;
  }
  if (alv === 'bottom') {
    top += ah;
  }
  if (left + pw > ww || alh === 'left') {
    left = al - ox - pw;
  }
  if (left < 0) {
    left = 0;
  }
  if (top + ph > wh) {
    top = at - oy - ph;
  }
  if (top < 0) {
    top = 0;
  }
  return { left, top };
};

export const getImgData = (file: File, url?: string): IImageElementData => {
  return {
    name: file.name,
    url,
    type: file.type,
    size: file.size,
  };
};

export const getValidUrl = (str: string) => {
  // encode the url, prevent special symbols from being recognized incorrectly
  if (isUrl(encodeURI(str)) || str.startsWith('/')) {
    return str;
  }
  return `https://${str}`;
};

export const elementIsEmpty = (element: IElement) => {
  const eleString = Node.string(element);
  const hasVoidChild = element.children.find((child) => (child as IElement).isVoid);
  return !hasVoidChild && !eleString;
};
