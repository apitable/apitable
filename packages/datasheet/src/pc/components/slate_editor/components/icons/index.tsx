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

import { FC } from 'react';
import { colorVars } from '@apitable/components';
import {
  Headline1Filled,
  Headline2Filled,
  Headline3Filled,
  BodyFilled,
  OrderedFilled,
  UnorderedFilled,
  CodeFilled,
  UnderlineFilled,
  StrikethroughFilled,
  BoldFilled,
  ItalicsFilled,
  QuoteFilled,
  HighlightFilled,
  LinkOutlined,
  TextLeftFilled,
  TextMiddleFilled,
  TextRightFilled,
  TaskListFilled,
  DividingLineFilled,
  ImageOutlined,
  GotoOutlined,
  LinkDisconnectOutlined,
  CheckOutlined,
  IIconProps,
} from '@apitable/icons';

import { ElementType, MarkType, ALIGN } from '../../constant';

import styles from './style.module.less';

const HeadingIcon = ({ depth = 1 }) => {
  return (
    <i className={styles.iconWrap}>
      H<sub>{depth}</sub>
    </i>
  );
};

const IconFactor = (Icon: FC<React.PropsWithChildren<IIconProps>>) => {
  return ({ color = colorVars.secondLevelText, ...others }: IIconProps) => <Icon color={color} {...others} />;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [ElementType.PARAGRAPH]: IconFactor(BodyFilled),
  [ElementType.HEADING_ONE]: IconFactor(Headline1Filled),
  [ElementType.HEADING_TWO]: IconFactor(Headline2Filled),
  [ElementType.HEADING_THREE]: IconFactor(Headline3Filled),
  [ElementType.HEADING_FOUR]: IconFactor(() => <HeadingIcon depth={4} />),
  [ElementType.HEADING_FIVE]: IconFactor(() => <HeadingIcon depth={5} />),
  [ElementType.HEADING_SIX]: IconFactor(() => <HeadingIcon depth={6} />),
  [ElementType.ORDERED_LIST]: IconFactor(OrderedFilled),
  [ElementType.UNORDERED_LIST]: IconFactor(UnorderedFilled),
  [ElementType.IMAGE]: IconFactor(ImageOutlined),
  [ElementType.TASK_LIST]: IconFactor(TaskListFilled),
  [ElementType.QUOTE]: IconFactor(QuoteFilled),
  [ElementType.DIVIDER]: IconFactor(DividingLineFilled),
  [ElementType.CODE_BLOCK_WRAP]: IconFactor(CodeFilled),
  // table: '',
  // Inline elements
  [ElementType.LINK]: IconFactor(LinkOutlined),
  [ElementType.MENTION]: IconFactor(() => <i className={styles.iconWrap}>@</i>),
  [MarkType.ITALIC]: IconFactor(ItalicsFilled),
  [MarkType.UNDERLINE]: IconFactor(UnderlineFilled),
  [MarkType.STRIKE_THROUGH]: IconFactor(StrikethroughFilled),
  [MarkType.BOLD]: IconFactor(BoldFilled),
  [MarkType.INLINE_CODE]: IconFactor(CodeFilled),
  [MarkType.HIGHLIGHT]: IconFactor(HighlightFilled),
  // Alignment method
  [ALIGN.LEFT]: IconFactor(TextLeftFilled),
  [ALIGN.CENTER]: IconFactor(TextMiddleFilled),
  [ALIGN.RIGHT]: IconFactor(TextRightFilled),
  visit: IconFactor(GotoOutlined),
  unlink: IconFactor(LinkDisconnectOutlined),
  ok: IconFactor(CheckOutlined),
};
