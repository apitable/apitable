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

import { MAX_INDENT } from '../../constant';
import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './ordered_list.module.less';

const counterReset = Array(MAX_INDENT + 1)
  .fill('ordered')
  .map((item, i) => `${item}-${i} 0`)
  .join(' ');

const OrderedList = (props: IElementRenderProps<IElement>) => {
  const { children } = props;

  return (
    <ol className={styles.orderedList} style={{ counterReset }}>
      {children}
    </ol>
  );
};

export default OrderedList;
