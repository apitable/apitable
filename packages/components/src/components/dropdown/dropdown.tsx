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
import { IDropdownProps } from './interface';
import { DropdownStyled } from './styled';
import { ContextMenu } from '../context_menu'; 
import { useContextMenu } from '@apitable/react-contexify';
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