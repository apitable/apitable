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

import React, { useRef, useEffect, useState, FC, MouseEvent, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import {
  StyledMenuContainer,
  StyledSubMenu,
  StyledMenuItem,
  StyledMenuItemContent,
  StyledMenuItemArrow,
  StyledMenuShadow,
  StyledMenuItemExtra,
} from './styled';
import { ICacheOverlay, IContextMenuClickState, IContextMenuItemProps, IContextMenuProps } from './interface';
import { manager } from './event_manager';
import { IMenuConfig } from './interface';
import { EVENT_TYPE } from './const';
import { FloatUiTooltip as Tooltip } from '../tooltip';
import { omit } from 'lodash';

const DEFAULT_MENU_WIDTH = 240;
const SYADOW_HEIGHT = 20;

const ContextMenuWrapper: FC<React.PropsWithChildren<IContextMenuProps>> = (props) => {
  const {
    children,
    contextMenu,
    onClose,
    onShown,
    overlay,
    onClick,
    id,
    menuId,
    width = DEFAULT_MENU_WIDTH,
    menuOffset = [0, 0],
    menuSubSpaceHeight = 10,
  } = props;
  const [contextMenuState, setContextMenuState] = useState<IContextMenuClickState>({
    offset: null,
  });
  const [paths, setPaths] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { offset, extraInfo } = contextMenuState;

  // Compatible with the old context menu parameter callback method
  const getExtraInfo = (info: any) => {
    return info;
  };

  const getHidden = React.useCallback(
    (hidden: any) => {
      if (!offset) {
        return;
      }
      if (typeof hidden === 'function') {
        return hidden(getExtraInfo(extraInfo));
      }
      return Boolean(hidden);
    },
    [extraInfo, offset]
  );

  // Cache the current level and index of the menu item at the current level to locate the current parent element
  const cacheOverlay: { [key: string]: ICacheOverlay } | null = useMemo(() => {
    if (!overlay || overlay.length === 0 || !contextMenuState.offset) {
      return null;
    }
    const cache: { [key: string]: ICacheOverlay } = {};
    const calcCacheLevel = (list: IContextMenuItemProps[], level = 0) => {
      let sub = 0;
      for (let i = 0; i < list.length; i++) {
        const item = list[i]!;
        if (getHidden(item.hidden)) {
          sub += 1;
          continue;
        }
        cache[item.key] = { item, level, index: i - sub };
        if (item.children) {
          calcCacheLevel(item.children, level + 1);
        }
      }
    };
    calcCacheLevel(overlay);
    return cache;
  }, [overlay, contextMenuState, getHidden]);

  // close context menu reset submenu styles and paths
  const cancelContextMenu = React.useCallback(() => {
    setPaths([]);
    setContextMenuState({ offset: null });
    const menu = menuRef.current;
    if (menu && !children) {
      const nodes = menu.childNodes;
      for (let i = 0; i < nodes.length; i++) {
        const child = nodes[i] as HTMLElement;
        child.style.cssText = '';
      }
    }
    if (onClose) {
      onClose();
    }
  }, [setPaths, menuRef, setContextMenuState, children, onClose]);

  // Calculate scroll event
  const calcScroll = (ele: HTMLElement) => {
    const curTop = ele.scrollTop + ele.clientHeight;
    const lastChild = ele.lastElementChild as HTMLElement;
    if (curTop > ele.scrollHeight - 10) {
      lastChild.style.display = 'none';
      return;
    }
    if (lastChild.style.display === 'block') {
      return;
    }
    lastChild.style.display = 'block';
  };

  // out menu click listen function
  const handleOuterClick = React.useCallback(
    (e: any) => {
      const menu = menuRef.current;
      if (!menu) return;

      if (!menu.contains(e.target)) {
        cancelContextMenu();
      }
    },
    [menuRef, cancelContextMenu]
  );

  // menu Item click event
  const handleClick = (item: IContextMenuItemProps, keyPath: string[], e: MouseEvent<HTMLElement>) => {
    if ((typeof item.disabled === 'function' && item.disabled(getExtraInfo(extraInfo))) || (typeof item.disabled === 'boolean' && item.disabled)) {
      return;
    }

    if (item.onClick) {
      item.onClick(getExtraInfo(extraInfo));
    } else if (onClick) {
      onClick({ item, keyPath, event: e, extraInfo });
    }

    if (!item.children) {
      cancelContextMenu();
    }
  };

  // mouse enter event
  const handleMouseEnter = (item: IContextMenuItemProps, index: number) => {
    const menu = menuRef.current;
    if (!menu) return;
    setPaths((source) => {
      source[index] = item.key;
      return source.slice(0, index + 1);
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const ele = e.target as HTMLElement;
    calcScroll(ele);
  };

  // recursion
  const dfs = (source: IContextMenuItemProps[], results: { key: string; label: JSX.Element }[][], index = 0) => {
    if (!results[index]) {
      results[index] = [];
    }
    const filterHiddenSource = source.filter((v) => !getHidden(v.hidden));
    for (let i = 0; i < filterHiddenSource.length; i++) {
      const item = filterHiddenSource[i]!;
      // filter hidden key
      const newItem = omit(item, 'hidden');
      const { key, id, disabled = false, icon, label, arrow, children, groupId, extraElement, disabledTip, ...rest } = newItem;
      const selected = paths[index] === key;
      let isGroup = false;
      const nextItem = filterHiddenSource[i + 1];
      // Whether grouping exists
      if (groupId && nextItem && nextItem.groupId !== groupId) {
        isGroup = true;
      }

      const isDisabled = typeof disabled === 'function' ? disabled(getExtraInfo(extraInfo)) : disabled;

      let labelElement = (
        <StyledMenuItem
          {...rest}
          key={id || key}
          onClick={(e) => handleClick(item, paths, e)}
          onMouseEnter={() => handleMouseEnter(item, index)}
          onTouchStart={() => handleMouseEnter(item, index)}
          disabled={isDisabled}
          isGroup={isGroup}
          role="menuitem"
        >
          {icon}
          <StyledMenuItemContent variant="body2" ellipsis>
            {typeof label === 'function' ? label(getExtraInfo(extraInfo)) : label}
          </StyledMenuItemContent>
          {extraElement && <StyledMenuItemExtra>{extraElement}</StyledMenuItemExtra>}
          {!extraElement && arrow && <StyledMenuItemArrow>{arrow}</StyledMenuItemArrow>}
        </StyledMenuItem>
      );

      if (isDisabled && disabledTip) {
        labelElement = <Tooltip content={disabledTip}>{labelElement}</Tooltip>;
      }

      results[index]!.push({
        key,
        label: labelElement,
      });
      if (selected && children) {
        dfs(children, results, index + 1);
      }
    }
  };

  // Compatible with the usage of menuId and show
  const handler = React.useCallback(
    (configs?: IMenuConfig) => {
      if (!configs) return;
      const { e, extraInfo } = configs;
      setContextMenuState({
        offset: [e.clientX, e.clientY],
        extraInfo,
      });
      if (onShown) {
        onShown(getExtraInfo(extraInfo));
      }
    },
    [onShown]
  );

  const renderChildren = () => {
    if (children) {
      return children;
    }
    if (!overlay || !overlay.length || !contextMenuState.offset) {
      return null;
    }
    const hidden = overlay.every((item) => item.hidden);
    if (hidden) {
      return null;
    }
    const results: { key: string; label: JSX.Element }[][] = [];
    dfs(overlay, results);
    return results.map((v) => {
      return (
        <StyledSubMenu role="menu" onScroll={handleScroll} key={`${v[0]?.key}-ul`}>
          {v.map((item) => item.label)}
          <StyledMenuShadow />
        </StyledSubMenu>
      );
    });
  };

  // cache contextMenu state
  useEffect(() => {
    if (contextMenu) {
      setContextMenuState(contextMenu);
      if (onShown) {
        onShown(getExtraInfo(contextMenu.extraInfo));
      }
    }
  }, [contextMenu, setContextMenuState, onShown]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !offset || !cacheOverlay) {
      return;
    }
    const childList = menu.childNodes;
    const { innerHeight } = window;

    // Calculate the top value when the screen height is exceeded
    const getTop = (top: number, height: number) => {
      const total = top + height;
      if (height > innerHeight) {
        return 0;
      }
      if (total > innerHeight) {
        const diff = total - innerHeight;
        if (diff > top) {
          return 0;
        }
        return top - diff;
      }
      return top;
    };

    /**
     * Calculate the location of menu
     * High computing strategy: =>
     * 1、element.totalHeight = element.top + element.scrollHeight total height
     * 2、element.totalHeight > innerHeight ? result1 : result2; compare total hidden and current window height
     *
     * Width computing strategy: =>
     * 1、element.startX = offset[0] + preMenuWidthSum  Get starting point
     * 2、element.finalX = startX - preMenuWidthSum - element.width * (i+1)
     */
    for (let i = 0; i < childList.length; i++) {
      const child = childList[i] as HTMLElement;
      const parentKey = paths[i - 1];
      const scrollHeight = child.scrollHeight;
      const lastElement = child.lastElementChild as HTMLElement;

      if (!parentKey) {
        let total = offset[1]! + scrollHeight;
        const curTop = getTop(offset[1]!, scrollHeight);
        total = curTop + scrollHeight;
        const isOver = total > innerHeight;
        let cssText = isOver ? `height: ${innerHeight - menuSubSpaceHeight}px; overflow: auto;` : '';

        // Calculate whether there is free space. If not, calculate the difference
        const endX = offset[0]! + menuOffset[0]! + width;
        const subX = endX > innerWidth ? endX - innerWidth : 0;

        cssText += `
          left: ${offset[0]! + menuOffset[0]! - subX}px;
          top: ${curTop + menuOffset[1]!}px;
          opacity: 1;
          width: ${width}px;
        `;
        child.style.cssText = cssText;
        lastElement.style.cssText = isOver
          ? `
          left: ${offset[0]! + menuOffset[0]! - subX}px;
          top: ${curTop + innerHeight - (menuSubSpaceHeight + SYADOW_HEIGHT) + menuOffset[1]!}px;
          width: ${width}px;
        `
          : '';
        calcScroll(child);
        continue;
      }

      // Find the parent menu sub item of the sub menu, and get the top of the sub menu according to the top of the parent menu sub item
      const parentContainer = childList[i - 1] as HTMLElement;
      const parentList = parentContainer.childNodes;
      const { index } = cacheOverlay[parentKey]!;
      const parentElement = parentList[index] as HTMLElement;
      const { top: parentTop } = parentElement.getBoundingClientRect();
      const parentTopWithoutPadding = parentTop - 4;

      let childTotal = parentTopWithoutPadding + scrollHeight;
      const childTop = getTop(parentTop, scrollHeight);
      childTotal = childTop + scrollHeight;

      const isOverChild = childTotal > innerHeight;

      const preParentWidthSum = Array.from(childList)
        .filter((_item, k) => k < i)
        .reduce((pre) => {
          pre += width;
          return pre;
        }, 0);

      // Calculate the left and right offsets. When the remaining space is not enough for placement, take the parent as a reference
      let childStartX = (childList[0] as HTMLElement).offsetLeft + preParentWidthSum + menuOffset[0]!;
      if (childStartX + width > innerWidth) {
        childStartX -= preParentWidthSum + width * i;
      }

      let childCssText = `opacity: 1; width: ${width}px;`;
      childCssText += `
        left: ${childStartX}px;
        top: ${childTop + menuOffset[1]!}px;
      `;
      childCssText += isOverChild ? `height: ${innerHeight - menuSubSpaceHeight}px; overflow: auto;` : '';
      child.style.cssText = childCssText;
      lastElement.style.cssText = isOverChild
        ? `
        left: ${childStartX}px;
        top: ${childTop + innerHeight - (menuSubSpaceHeight + SYADOW_HEIGHT) + menuOffset[1]!}px;
        width: ${width}px;
      `
        : '';
      calcScroll(child);
    }
  }, [offset, paths, menuRef, menuOffset, cacheOverlay, menuSubSpaceHeight, width, setContextMenuState, onShown]);

  useEffect(() => {
    window.addEventListener('mousedown', handleOuterClick);
    return () => window.removeEventListener('mousedown', handleOuterClick);
  }, [offset, handleOuterClick]);

  // Compatible with the usage of menuId and show
  useEffect(() => {
    manager.on(EVENT_TYPE.HIDE_ALL, cancelContextMenu);
    if (menuId) {
      manager.on(menuId, handler);
    }
    return () => {
      manager.off(EVENT_TYPE.HIDE_ALL);
      if (menuId) {
        manager.off(menuId);
      }
    };
  }, [menuId, cancelContextMenu, handler]);

  const style: React.CSSProperties = {};
  if (Boolean(children)) {
    if (offset) {
      style.left = offset[0]! + menuOffset[0]!;
      style.top = offset[1]! + menuOffset[1]!;
    } else {
      style.opacity = 0;
      style.transform = 'scale(0)';
    }
  }

  return createPortal(
    <StyledMenuContainer id={id} style={style} ref={menuRef}>
      {renderChildren()}
    </StyledMenuContainer>,
    document.body
  );
};

export const ContextMenu = memo(ContextMenuWrapper);
