import { Node } from 'slate';
import { EditorValue } from '../interface/editor';
import { ElementType } from '../constant';

export const text = (document: EditorValue) => {
  return document.reduce((res, node) => {
    if (node.isVoid) {
      if (node.type === ElementType.IMAGE) {
        return `${res}[img]`;
      }
      if (node.type === ElementType.MENTION) {
        return `${res}[@${node.data.name}]`;
      }
      if (node.type === ElementType.DIVIDER) {
        return `${res}[---]`;
      }
      return `${res}[embed]`;
    }
    return `${res}${Node.string(node)}`;
  }, '');
};