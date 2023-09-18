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

import { jsx } from 'slate-hyperscript';
import { MarkType } from '../constant';
import { GENERATOR } from '../elements';

const getNodeDataFromAttr = (el: HTMLElement) => {
  const className = el.getAttribute('class');
  if (className && /ql-indent-(\d+)/.test(className)) {
    return { indent: +RegExp.$1 };
  }
  return {};
};

const ELEMENT_TAGS = {
  A: (el: HTMLAnchorElement) => GENERATOR.link({ data: { link: el.getAttribute('href') } }, []),
  BLOCKQUOTE: () => GENERATOR.quote({}, []),
  H1: (el: HTMLElement) => GENERATOR.headingOne({ data: getNodeDataFromAttr(el) }, []),
  H2: (el: HTMLElement) => GENERATOR.headingTwo({ data: getNodeDataFromAttr(el) }, []),
  H3: (el: HTMLElement) => GENERATOR.headingThree({ data: getNodeDataFromAttr(el) }, []),
  H4: (el: HTMLElement) => GENERATOR.headingFour({ data: getNodeDataFromAttr(el) }, []),
  H5: (el: HTMLElement) => GENERATOR.headingFive({ data: getNodeDataFromAttr(el) }, []),
  H6: (el: HTMLElement) => GENERATOR.headingSix({ data: getNodeDataFromAttr(el) }, []),
  H7: (el: HTMLElement) => GENERATOR.headingSix({ data: getNodeDataFromAttr(el) }, []),
  H8: (el: HTMLElement) => GENERATOR.headingSix({ data: getNodeDataFromAttr(el) }, []),
  H9: (el: HTMLElement) => GENERATOR.headingSix({ data: getNodeDataFromAttr(el) }, []),
  IMG: (el: HTMLImageElement) => GENERATOR.image({ data: { url: el.getAttribute('src') ?? '' } }, []),
  UL: () => GENERATOR.unorderedList({}, []),
  OL: () => GENERATOR.orderedList({}, []),
  LI: (el: HTMLElement) => GENERATOR.listItem({ data: getNodeDataFromAttr(el) }, []),
  P: (el: HTMLElement) => GENERATOR.paragraph({ data: getNodeDataFromAttr(el) }, []),
  PRE: () => GENERATOR.paragraph({}, []),
};

const TEXT_TAGS = {
  CODE: () => ({ [MarkType.BOLD]: true }),
  DEL: () => ({ [MarkType.STRIKE_THROUGH]: true }),
  EM: () => ({ [MarkType.ITALIC]: true }),
  I: () => ({ [MarkType.ITALIC]: true }),
  S: () => ({ [MarkType.STRIKE_THROUGH]: true }),
  STRONG: () => ({ [MarkType.BOLD]: true }),
  U: () => ({ [MarkType.UNDERLINE]: true }),
};

const deserializeToJsx = (el: any): any => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '';
  }

  const { nodeName } = el;
  const parent = el;

  const children = Array.from(parent.childNodes) as Array<any>;

  let imgEleList: Array<any> = [];
  let validChild: Array<any> = [];
  children.forEach((childEle) => {
    if (childEle.nodeName === 'IMG') {
      imgEleList.push(childEle);
    } else {
      validChild.push(childEle);
    }
  });
  validChild = validChild.map(deserializeToJsx).flat();
  imgEleList = imgEleList.map(deserializeToJsx).flat();
  if (!validChild.length) {
    // Child nodes have only images
    if (imgEleList.length) {
      return imgEleList;
    }
    validChild.push('');
  }

  if (nodeName === 'BODY') {
    return jsx('fragment', {}, [...imgEleList, ...validChild]);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    const node = jsx('element', attrs, validChild);
    if (!imgEleList.length) {
      return node;
    }
    // A block-level element contains text and images
    return [...imgEleList, node];
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return validChild.map((child: any) => jsx('text', attrs, child));
  }
  return validChild;
};

export const html = (htmlText: string) => {
  const parsed = new DOMParser().parseFromString(htmlText, 'text/html');
  return deserializeToJsx(parsed.body);
};
