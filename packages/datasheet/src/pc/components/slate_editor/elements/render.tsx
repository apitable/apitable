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

import omit from 'lodash/omit';
import * as React from 'react';
import { colorVars } from '@apitable/components';

// import { useThemeColors } from '@apitable/components';

import { ElementType, NodeType, LIST_ITEM_TYPE_DICT, HIGHLIGHT_COLORS } from '../constant';
import { IElementRenderProps, ILeafRenderProps, IElement } from '../interface/element';
import { CodeBlockWrap, CodeBlock } from './codeBlock';
import Divider from './divider';
import { HeadingFive, HeadingFour, HeadingOne, HeadingSix, HeadingThree, HeadingTwo } from './heading';
import Image from './image';
import Link from './link';
import ListItem from './list_item';
import Mention from './mention';
import OrderedList from './ordered_list';
import Paragraph from './paragraph';
import Quote from './quote';
import QuoteItem from './quote_item';
import Section from './section';
import Task from './task';
import TaskItem from './task_item';
import UnorderedList from './unordered_list';
import styles from './style.module.less';

export const ElementRender = (props: IElementRenderProps<IElement>) => {
  const { element } = props;
  const type = element?.type ?? ElementType.PARAGRAPH;
  const isInline = element?.object === NodeType.INLINE;
  const isListItem = LIST_ITEM_TYPE_DICT[type];
  let Element: any = Paragraph;
  switch (type) {
    case ElementType.HEADING_ONE:
      Element = HeadingOne;
      break;
    case ElementType.HEADING_TWO:
      Element = HeadingTwo;
      break;
    case ElementType.HEADING_THREE:
      Element = HeadingThree;
      break;
    case ElementType.HEADING_FOUR:
      Element = HeadingFour;
      break;
    case ElementType.HEADING_FIVE:
      Element = HeadingFive;
      break;
    case ElementType.HEADING_SIX:
      Element = HeadingSix;
      break;
    case ElementType.ORDERED_LIST:
      Element = OrderedList;
      break;
    case ElementType.UNORDERED_LIST:
      Element = UnorderedList;
      break;
    case ElementType.LIST_ITEM:
      Element = ListItem;
      break;
    case ElementType.QUOTE:
      Element = Quote;
      break;
    case ElementType.QUOTE_ITEM:
      Element = QuoteItem;
      break;
    case ElementType.TASK_LIST:
      Element = Task;
      break;
    case ElementType.TASK_LIST_ITEM:
      Element = TaskItem;
      break;
    case ElementType.CODE_BLOCK_WRAP:
      Element = CodeBlockWrap;
      break;
    case ElementType.CODE_BLOCK:
      Element = CodeBlock;
      break;
    case ElementType.IMAGE:
      Element = Image;
      break;
    case ElementType.LINK:
      Element = Link;
      break;
    case ElementType.MENTION:
      Element = Mention;
      break;
    case ElementType.DIVIDER:
      Element = Divider;
      break;
    default:
      Element = Paragraph;
      break;
  }

  return isInline || isListItem ? (
    <Element {...props} />
  ) : (
    <Section {...props}>
      <Element {...props} />
    </Section>
  );
};

export const LeafRender = (props: ILeafRenderProps) => {
  const { attributes, children, leaf } = props;
  let renderedChildren = children;
  const marks = omit(leaf, 'text');
  const { bold, underLine, strikeThrough, inlineCode, italic, highlight, codeToken, ...otherMarks } = marks;
  const style = otherMarks as React.CSSProperties;
  let hasBg = false;
  if (highlight != null) {
    const color = typeof highlight === 'string' ? highlight : HIGHLIGHT_COLORS.show[Number(highlight)];
    style.backgroundColor = color;
    style.color = colorVars.textReverseDefault;
    style.padding = '4px 0';
    hasBg = true;
  }
  if (codeToken) {
    renderedChildren = <span className={codeToken as string}>{renderedChildren}</span>;
  }
  if (bold) {
    renderedChildren = <b>{renderedChildren}</b>;
  }
  if (underLine) {
    renderedChildren = <u className={styles.underline}>{renderedChildren}</u>;
  }
  if (inlineCode) {
    renderedChildren = <code className={styles.code}>{renderedChildren}</code>;
  }
  if (italic) {
    renderedChildren = <i>{renderedChildren}</i>;
  }
  if (strikeThrough) {
    renderedChildren = <s>{renderedChildren}</s>;
  }

  return (
    <span {...attributes} style={style} data-has-bg={hasBg}>
      {renderedChildren}
    </span>
  );
};
