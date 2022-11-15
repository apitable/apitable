import { isValidElement } from 'react';
import { IContextMenuItemProps } from '@apitable/components';

const generateKey = (contextItem: IContextMenuItemProps, text2Id: boolean, index: number) => {
  const { id, text } = contextItem;
  if (!text2Id) return id;
  return isValidElement(text) ? index : text;
};

export const flatContextData = (
  contextData: Partial<IContextMenuItemProps>[], 
  text2Id = false
): IContextMenuItemProps[] => {
  const dfs = (childList: IContextMenuItemProps[], groupId: string, index = 0) => {
    const res: IContextMenuItemProps[] = [];
    const childGroupId = `${groupId}_${index}`;
    for (let i = 0; i < childList.length; i++) {
      const item = childList[i];
      const resultItem = {
        ...item,
        extraElement: item.shortcutKey,
        groupId: childGroupId,
        label: item.text,
        key: generateKey(item, text2Id, index),
      };
      res.push(item.children ? {
        ...resultItem,
        children: dfs(item.children, childGroupId, index + 1)
      } : resultItem);
    }
    return res;
  };

  let groupId = 0;
  return contextData.map((v) => {
    groupId += 1;
    return v.map((item, index) => {
      const res = {
        ...item,
        extraElement: item.shortcutKey,
        groupId: groupId.toString(),
        label: item.text,
        key: generateKey(item, text2Id, index),
      };
      return item.children ? { ...res, children: dfs(item.children, groupId.toString()) } : res;
    });
  }).flat();
};
