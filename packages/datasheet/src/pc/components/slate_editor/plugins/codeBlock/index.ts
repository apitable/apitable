import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { Text, Editor } from 'slate';
import { IElement } from '../../interface/element';
import { ElementType } from '../../constant';

export * from './language';

export const getTokenLength = (token: any): number => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  }
  return token.content.reduce((l: number, t: any) => l + getTokenLength(t), 0);
};

export const getDecorate = (editor: Editor) => ([node, path]) => {
  const element = editor.children[path[0]] as IElement;
  const ranges: any = [];
  if (!element || element.type !== ElementType.CODE_BLOCK_WRAP || !Text.isText(node)) {
    return ranges;
  }
  const lang = element.data.lang as string || 'plaintext';
  const grammar = Prism.languages[lang];
  if (!grammar) {
    return ranges;
  }
  const tokens = Prism.tokenize(node.text, grammar);
  let start = 0;
  for (const token of tokens) {
    const length = getTokenLength(token);
    const end = start + length;

    if (typeof token !== 'string') {
      ranges.push({
        codeToken: `token ${token.type}`,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      });
    }

    start = end;
  }
  return ranges;
};