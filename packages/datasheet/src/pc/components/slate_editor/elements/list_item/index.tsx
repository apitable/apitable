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

import { useMemo } from 'react';
import cx from 'classnames';
import { IElementRenderProps, IElement } from '../../interface/element';

import styles from './list_item.module.less';

import Decorate from '../element_decorate';

const ListItem = (props: IElementRenderProps<IElement>) => {
  const { children, attributes, element } = props;
  const itemData = element.data;
  const indent = itemData.indent || 0;

  const listType = useMemo(() => {
    return (indent % 3);
  }, [indent]);

  return <Decorate element={element} startIndent={24}>
    <li {...attributes} className={cx(styles.listItem, styles[`ordered${indent}`])} data-list-type={listType}>
      {children}
    </li>
  </Decorate>;
};

export default ListItem;