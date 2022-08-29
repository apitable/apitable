import { EditorValue } from './interface/editor';
import { TText } from './interface/element';
import { GENERATOR } from './elements/generator';
import { ElementType, LIST_TYPE_DICT, LIST_ITEM_TYPE_DICT } from './constant';
import { isObject } from 'lodash';

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
    // 老版本数据有解析错误的情况
    const maybeIsText = ele as unknown as TText;
    if ((ele as unknown as TText).text != null) {
      const text = (!maybeIsText.text || maybeIsText.text === 'undefined') ? '' : maybeIsText.text;
      return GENERATOR[ElementType.PARAGRAPH]({}, [{ text }]);
    }

    // 确保列表包裹元素下都为列表Item元素
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

    // 将没有包裹在列表Wrap下的列表元素转为普通段落
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