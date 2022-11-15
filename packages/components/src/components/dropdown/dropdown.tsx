import React from 'react';
import { IDropdownProps } from './interface';
import { DropdownStyled } from './styled';
import { ContextMenu } from '../context_menu'; 
import { useContextMenu } from '@vikadata/react-contexify';
import { ChevronDownOutlined } from '@apitable/icons';

const CONTEXT_MENU_ID = 'CONTEXT_MENU_ID';

export const Dropdown = React.forwardRef<HTMLDivElement, IDropdownProps>((props: IDropdownProps, ref) => {
  const { children, id, data, trigger = ['click'], arrow = true } = props;

  const contextId = `${CONTEXT_MENU_ID}_${id}`;
  const { show } = useContextMenu({
    id: contextId,
  });

  // click event function
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger.includes('click')) {
      show(e);
    }
  };
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger.includes('contextMenu')) {
      show(e);
    }
  };
  const menuProps = {
    onClick: handleClick,
    onContextMenu: handleContextMenu,
  };
  return (
    <div>
      <DropdownStyled {...menuProps} ref={ref}>
        <span>{children}</span>
        {arrow && <ChevronDownOutlined size={16} currentColor />}
      </DropdownStyled>
      <ContextMenu menuId={contextId} data={data} />
    </div>
  );
});