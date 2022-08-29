import { useState, MouseEvent } from 'react';
import { EVENT_TYPE } from './consts';
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

export const contextMenuShow = (e: MouseEvent<HTMLElement>, id, extraInfo?: any) => {
  manager.emit(id, { e, extraInfo });
};
