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

import { Text } from 'slate';
import { ElementType, MarkType, HIGHLIGHT_COLORS } from '../constant';
import { EditorValue } from '../interface/editor';
import { IElement, TText, IElementData, IImageElementData, ILinkElementData, IMentionElementData } from '../interface/element';

const INDENT_CLASS_PREFIX = 've_indent_';
const ALIGN_CLASS_PREFIX = 've_align_';

const textStringify = (node: TText) => {
  const { text, ...others } = node;
  let tNode = text;
  if (others[MarkType.BOLD]) {
    tNode = `<b>${tNode}</b>`;
  }
  if (others[MarkType.ITALIC]) {
    tNode = `<i>${tNode}</i>`;
  }
  if (others[MarkType.STRIKE_THROUGH]) {
    tNode = `<s>${tNode}</s>`;
  }
  if (others[MarkType.UNDERLINE]) {
    tNode = `<u>${tNode}</u>`;
  }
  if (others[MarkType.INLINE_CODE]) {
    tNode = `<code>${tNode}</code>`;
  }
  if (others[MarkType.HIGHLIGHT]) {
    const highlight = others[MarkType.HIGHLIGHT];
    const color = typeof highlight === 'string' ? highlight : HIGHLIGHT_COLORS.show[Number(highlight)];
    tNode = `<span style="background-color: ${color};" >${tNode}</span>`;
  }
  return tNode;
};

const attrStringify = (data: IElementData): string => {
  const cls = [] as string[];
  if (data.className) {
    cls.push(data.className);
  }
  if (data.indent) {
    cls.push(`${INDENT_CLASS_PREFIX}${data.indent}`);
  }
  if (data.align) {
    cls.push(`${ALIGN_CLASS_PREFIX}${data.align}`);
  }
  if (cls.length) {
    return `class="${cls.join(' ')}"`;
  }
  return '';
};

const blockFactory = (tag: string, element: IElement) => {
  const { children = [], data = {} } = element;
  const childHtml = children.reduce((acc, childNode: any) => {
    if (Text.isText(childNode)) {
      return `${acc}${textStringify(childNode as any)}`;
    }
    return `${acc}${elementStringify(childNode)}`;
  }, '');
  const attr = attrStringify(data);
  return `<${tag} ${attr}>${childHtml}</${tag}>`;
};

const stringifyVoidData = (data: IElementData) => {
  const str = JSON.stringify(data);
  if (String.prototype.replaceAll as any) {
    return str.replaceAll('"', "'");
  }
  return str.replace(/"/g, "'");
};

const elementMap = {
  [ElementType.PARAGRAPH]: (element: IElement) => blockFactory('p', element),
  [ElementType.HEADING_ONE]: (element: IElement) => blockFactory('h1', element),
  [ElementType.HEADING_TWO]: (element: IElement) => blockFactory('h2', element),
  [ElementType.HEADING_THREE]: (element: IElement) => blockFactory('h3', element),
  [ElementType.HEADING_FOUR]: (element: IElement) => blockFactory('h4', element),
  [ElementType.HEADING_FIVE]: (element: IElement) => blockFactory('h5', element),
  [ElementType.HEADING_SIX]: (element: IElement) => blockFactory('h6', element),
  [ElementType.ORDERED_LIST]: (element: IElement) => blockFactory('ol', element),
  [ElementType.UNORDERED_LIST]: (element: IElement) => blockFactory('ul', element),
  [ElementType.LIST_ITEM]: (element: IElement) => blockFactory('li', element),
  [ElementType.TASK_LIST]: (element: IElement) => blockFactory('dl', element),
  [ElementType.TASK_LIST_ITEM]: (element: IElement) => blockFactory('dd', element),
  [ElementType.QUOTE]: (element: IElement) => blockFactory('blockquote', element),
  [ElementType.QUOTE_ITEM]: (element: IElement) => blockFactory('div', element),
  [ElementType.IMAGE]: (element: IElement<IImageElementData>) => {
    const { data } = element;
    const wrapAttr = attrStringify(data);
    let imgAttr = `src="${data.url || ''}"`;
    if (data.name) {
      imgAttr = `${imgAttr} name="${data.name}" alt="${data.name}"`;
    }
    if (data.width) {
      imgAttr = `${imgAttr} width="${typeof data.width === 'string' ? data.width : `${data.width}px`}"`;
    }
    return `<p data-void="${ElementType.IMAGE}" data-void-data="${stringifyVoidData(data)}" ${wrapAttr}><img ${imgAttr} /></p>`;
  },
  [ElementType.LINK]: (element: IElement<ILinkElementData>) => {
    const { data, children } = element;
    const childHtml = children.reduce((acc, childNode: any) => `${acc}${textStringify(childNode)}`, '');
    return `<a href="${data.link || '/'}">${childHtml}</a>`;
  },
  [ElementType.MENTION]: (element: IElement<IMentionElementData>) => {
    const { data } = element;
    return `<a data-void="${ElementType.MENTION}" data-void-data="${stringifyVoidData(data)}">@${data.name}</a>`;
  },
  [ElementType.DIVIDER]: (element: IElement<IMentionElementData>) => {
    const { data } = element;
    return `<div data-void="${ElementType.DIVIDER}" data-void-data="${stringifyVoidData(data)}">---</div>`;
  },
};

const elementStringify = (node: IElement) => {
  const { type } = node;
  const stringifyFunc = elementMap[type] || elementMap[ElementType.PARAGRAPH];
  return stringifyFunc(node);
};

export const html = (document: EditorValue) => {
  return document.reduce((acc, element) => {
    return `${acc}${elementStringify(element)}`;
  }, '');
};
