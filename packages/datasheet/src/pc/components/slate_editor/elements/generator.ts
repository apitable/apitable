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

import cloneDeep from 'lodash/cloneDeep';
import { getNewId, IDPrefix } from '@apitable/core';
import { NodeType, ElementType, ALIGN } from '../constant';
import { IElement, TText, IImageElementData } from '../interface/element';

type FactorChildType = TText | TText[];

const TEXT_NODE = { text: '' };

const BLOCK = { type: ElementType.PARAGRAPH, data: { align: ALIGN.LEFT }, object: NodeType.BLOCK, children: [{ ...TEXT_NODE }] };
const INLINE = { type: ElementType.LINK, data: {}, object: NodeType.INLINE, children: [{ ...TEXT_NODE }] };

const VOID_BLOCK = { ...cloneDeep(BLOCK), isVoid: true };
const VOID_INLINE = { ...cloneDeep(INLINE), isVoid: true };

const TEMPLATE = {
  text: TEXT_NODE,
  block: BLOCK,
  inline: INLINE,
  voidBlock: VOID_BLOCK,
  voidInline: VOID_INLINE,
};

type TFactoryParams = [partial: Partial<IElement>, children?: FactorChildType];

export const generateId = () => getNewId(IDPrefix.Editor);

export const uniqueElement = (nodes: any): any => {
  if (Array.isArray(nodes)) {
    return nodes.map(uniqueElement);
  }

  if (typeof nodes === 'object') {
    nodes._id = generateId();
    if (!nodes.data || typeof nodes.data !== 'object') {
      nodes.data = {};
    }
    if (nodes.children) {
      nodes.children = uniqueElement(nodes.children);
    }
  }

  return nodes;
};

const factory = (template: Omit<IElement, '_id'>, type: ElementType, partial: Partial<IElement>, children?: FactorChildType) => {
  const newNode = { ...cloneDeep(template), ...partial, type, _id: generateId() };
  if (children) {
    newNode.children = Array.isArray(children) ? children : [children];
  }
  return newNode;
};

export const GENERATOR = {
  text: (textNode: TText) => cloneDeep(textNode),
  [ElementType.PARAGRAPH]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.PARAGRAPH, ...params);
  },
  [ElementType.HEADING_ONE]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_ONE, ...params);
  },
  [ElementType.HEADING_TWO]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_TWO, ...params);
  },
  [ElementType.HEADING_THREE]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_THREE, ...params);
  },
  [ElementType.HEADING_FOUR]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_FOUR, ...params);
  },
  [ElementType.HEADING_FIVE]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_FIVE, ...params);
  },
  [ElementType.HEADING_SIX]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.HEADING_SIX, ...params);
  },
  [ElementType.LINK]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.inline, ElementType.LINK, ...params);
  },
  [ElementType.ORDERED_LIST]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.ORDERED_LIST, ...params);
  },
  [ElementType.UNORDERED_LIST]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.UNORDERED_LIST, ...params);
  },
  [ElementType.LIST_ITEM]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.LIST_ITEM, ...params);
  },
  listWrap: (type: ElementType, ...params: TFactoryParams) => {
    return factory(TEMPLATE.block, type, ...params);
  },
  [ElementType.CODE_BLOCK_WRAP]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.CODE_BLOCK_WRAP, ...params);
  },
  [ElementType.CODE_BLOCK]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.CODE_BLOCK, ...params);
  },
  [ElementType.QUOTE]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.QUOTE, ...params);
  },
  [ElementType.QUOTE_ITEM]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.QUOTE_ITEM, ...params);
  },
  [ElementType.TASK_LIST]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.block, ElementType.TASK_LIST, ...params);
  },
  [ElementType.TASK_LIST_ITEM]: (...params: TFactoryParams) => {
    const [partialElement, child] = params;
    if (!partialElement.data) {
      partialElement.data = { checked: false };
    } else if (partialElement.data.checked == null) {
      partialElement.data.checked = false;
    }
    return factory(TEMPLATE.block, ElementType.TASK_LIST_ITEM, partialElement, child);
  },
  [ElementType.IMAGE]: (partialElement: Partial<IElement<IImageElementData>>, children?: FactorChildType) => {
    const defaultData = { url: '', name: 'picture', size: 0, type: '' };
    if (!partialElement.data) {
      partialElement.data = defaultData;
    } else {
      partialElement.data = { ...defaultData, ...partialElement.data };
    }
    return factory(TEMPLATE.voidBlock, ElementType.IMAGE, partialElement, children);
  },
  [ElementType.MENTION]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.voidInline, ElementType.MENTION, ...params);
  },
  [ElementType.DIVIDER]: (...params: TFactoryParams) => {
    return factory(TEMPLATE.voidBlock, ElementType.DIVIDER, ...params);
  },
};
