import React from 'react';
import { IListItemProps } from './interface';
import { ListItemActionsStyled, ListItemStyled } from './styled';

export const ListItem = (props: IListItemProps) => {
  const { children, actions } = props;
  return (
    <ListItemStyled>
      {children}
      {Boolean(actions) && (
        <ListItemActionsStyled>
          {actions}
        </ListItemActionsStyled>
      )}
    </ListItemStyled>
  );
}; 