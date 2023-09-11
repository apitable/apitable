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

import { isValidElement } from 'react';
import { IContextMenuItemProps } from '@apitable/components';

const generateKey = (contextItem: IContextMenuItemProps, text2Id: boolean, index: number) => {
  const { id, text } = contextItem;
  if (!text2Id) return id;
  return isValidElement(text) ? index : text;
};

export const flatContextData = (contextData: Partial<IContextMenuItemProps>[], text2Id = false): IContextMenuItemProps[] => {
  const dfs = (childList: IContextMenuItemProps[], groupId: string, index = 0) => {
    const res: IContextMenuItemProps[] = [];
    const childGroupId = `${groupId}_${index}`;
    for (let i = 0; i < childList.length; i++) {
      const item = childList[i];

      if (!item) continue;

      const resultItem = {
        ...item,
        extraElement: item.shortcutKey,
        groupId: childGroupId,
        label: item.text,
        key: generateKey(item, text2Id, index),
      };
      res.push(
        item.children
          ? {
            ...resultItem,
            children: dfs(item.children, childGroupId, index + 1),
          }
          : resultItem,
      );
    }
    return res;
  };

  let groupId = 0;
  return contextData
    .map((v) => {
      groupId += 1;
      return v.map((item: IContextMenuItemProps, index: number) => {
        if (!item) return;
        const res = {
          ...item,
          extraElement: item.shortcutKey,
          groupId: groupId.toString(),
          label: item.text,
          key: generateKey(item, text2Id, index),
        };
        return item.children ? { ...res, children: dfs(item.children, groupId.toString()) } : res;
      });
    })
    .flat()
    .filter((v) => v);
};
