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

import React from 'react';
import { IListProps, IListItemProps } from './interface';
import { ListFooterStyled, ListHeaderStyled, ListStyled } from './styled';
import { ListItem } from './item';

export const List = React.forwardRef(({
  children,
  header,
  footer,
  data,
  renderItem,
  ...resetProps
}: IListProps, ref: React.Ref<HTMLDivElement>) => {
  const renderInnerItem = (d: string | IListItemProps, index: number) => {
    return renderItem ? renderItem(d, index) :
      typeof d === 'string' ? <ListItem key={index}>{d}</ListItem> : <ListItem key={index} {...d}/>;
  };
  return (
    <ListStyled {...resetProps} ref={ref}>
      {Boolean(header) && <ListHeaderStyled>{header}</ListHeaderStyled>}
      {data ? data.map(renderInnerItem): children}
      {Boolean(footer) && <ListFooterStyled>{footer}</ListFooterStyled>}
    </ListStyled>
  );
});