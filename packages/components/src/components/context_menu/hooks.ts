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

import { useState, MouseEvent } from 'react';
import { EVENT_TYPE } from './const';
import { manager } from './event_manager';
import { IContextMenuClickState } from './interface';

export function useContextMenu(configs?: { id: string }) {
  const [contextMenu, setContextMenu] = useState<IContextMenuClickState>({
    offset: null,
    extraInfo: null,
  });

  const onSetContextMenu = (e: MouseEvent<HTMLElement>, extraInfo?: any) => {
    setContextMenu({
      offset: [e.clientX, e.clientY],
      extraInfo,
    });
  };

  const onCancelContextMenu = () => {
    setContextMenu({
      offset: null,
      extraInfo: null,
    });
  };

  const onShow = (e: MouseEvent<HTMLElement>, extraInfo?: any) => {
    if (!configs?.id) {
      return;
    }
    manager.emit(configs.id, { e, extraInfo });
  };

  const hideAll = () => {
    manager.emit(EVENT_TYPE.HIDE_ALL);
  };

  return {
    contextMenu,
    onSetContextMenu,
    onCancelContextMenu,
    show: onShow,
    hideAll,
  };
}

export const contextMenuHideAll = () => {
  manager.emit(EVENT_TYPE.HIDE_ALL);
};

export const contextMenuShow = (e: MouseEvent<HTMLElement>, id: string, extraInfo?: any) => {
  manager.emit(id, { e, extraInfo });
};
