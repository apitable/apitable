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

import cx from 'classnames';
import { IElement, IElementRenderProps } from '../../interface/element';
import Decorate from '../element_decorate';
import styles from './style.module.less';

export type THeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

const headingMap = ['', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export interface IHeadingProps extends IElementRenderProps<IElement> {
  depth: THeadingDepth;
}

const Heading = ({ depth, children, data, ...others }: IHeadingProps) => {
  const Tag: any = headingMap[depth] || 'h1';
  return (
    <Decorate {...others} className={cx(styles.heading, styles[`heading${depth}`])}>
      <Tag>{children}</Tag>
    </Decorate>
  );
};

export default Heading;
