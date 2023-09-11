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

import { isObject } from 'lodash';
import { ElementType, LIST_TYPE_DICT, LIST_ITEM_TYPE_DICT } from './constant';
import { GENERATOR } from './elements/generator';
import { EditorValue } from './interface/editor';
import { TText } from './interface/element';

export const normalize = (document: EditorValue) => {
  if (!document || !document.length) {
    return document;
  }
  const firstNode = document[0];
  if (firstNode.isVoid) {
    document.unshift(GENERATOR[ElementType.PARAGRAPH]({}));
  }
  document = document.map((_ele) => {
    const ele = { ..._ele };
    // Older versions of data have parsing errors
    const maybeIsText = ele as unknown as TText;
    if ((ele as unknown as TText).text != null) {
      const text = !maybeIsText.text || maybeIsText.text === 'undefined' ? '' : maybeIsText.text;
      return GENERATOR[ElementType.PARAGRAPH]({}, [{ text }]);
    }

    // Ensure that the listItem elements are all under the list wrapper element
    if (LIST_TYPE_DICT[ele.type]) {
      const listItemType = LIST_TYPE_DICT[ele.type];
      const listChildGenerator = GENERATOR[listItemType] || GENERATOR.listItem;
      if (!Array.isArray(ele.children)) {
        ele.children = [listChildGenerator({})];
      } else {
        ele.children = ele.children.map((listItem: any) => {
          if (listItem.text != null) {
            return listChildGenerator({}, [{ text: `${listItem.text}` }]);
          }
          if (listItem.type !== listItemType) {
            listItem.type = listItemType;
            return listItem;
          }
          return listItem;
        });
      }
    }

    // Convert list elements that are not wrapped under a list wrap to normal paragraphs
    if (LIST_ITEM_TYPE_DICT[ele.type]) {
      ele.type = ElementType.PARAGRAPH;
      ele.data = {};
    }
    if (!isObject(ele.data)) {
      ele.data = {};
    }

    return ele;
  });
  return document;
};
