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
    <ListStyled {...resetProps}>
      {Boolean(header) && <ListHeaderStyled>{header}</ListHeaderStyled>}
      {data ? data.map(renderInnerItem): children}
      {Boolean(footer) && <ListFooterStyled>{footer}</ListFooterStyled>}
    </ListStyled>
  );
});