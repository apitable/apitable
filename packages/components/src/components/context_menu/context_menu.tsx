import React, { useRef, useEffect, useState, FC, MouseEvent, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { StyledMenuContainer, StyledSubMenu, StyledMenuItem, StyledMenuItemContent, StyledMenuItemArrow,
  StyledMenuShadow, StyledMenuItemExtra } from './styled';
import { ICacheOverlay, IContextMenuClickState, IContextMenuItemProps, IContextMenuProps } from './interface';
import { manager } from './event_manager';
import { EVENT_TYPE } from './consts';
import { Tooltip } from 'antd';
import { omit } from 'lodash';

const DEFAULT_MENU_WIDTH = 240;
const SYADOW_HEIGHT = 20;

const ContextMenuWrapper: FC<IContextMenuProps> = (props) => {
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

  // 兼容旧的 context-menu 参数回调方式
  const getExtraInfo = (info) => {
    return info;
  };

  const getHidden = React.useCallback((hidden) => {
    if (!offset) {
      return;
    }
    if (typeof hidden === 'function') {
      return hidden(getExtraInfo(extraInfo));
    }
    return Boolean(hidden);
  }, [extraInfo, offset]);

  // 缓存每个菜单项当前的层级和在当前层级的索引，用于定位当前父元素
  const cacheOverlay: { [key: string]: ICacheOverlay } | null = useMemo(() => {
    if (!overlay || overlay.length === 0 || !contextMenuState.offset) {
      return null;
    }
    const cache: { [key: string]: ICacheOverlay } = {};
    const calcCacheLevel = (list: IContextMenuItemProps[], level = 0) => {
      let sub = 0;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
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

  // 关闭 context-menu，将菜单项路径，坐标及submenu样式还原
  const cancelContextMenu = React.useCallback(() => {
    setPaths([]);
    setContextMenuState({ offset: null });
    const menu = menuRef.current;
    if (menu && !children) {
      const childs = menu.childNodes;
      for (let i = 0; i < childs.length; i++) {
        const child = childs[i] as HTMLElement;
        child.style.cssText = '';
      }
    }
    if (onClose) {
      onClose();
    }
  }, [setPaths, menuRef, setContextMenuState, children, onClose]);

  // 计算滚动事件
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

  // 监听鼠标外侧点击事件
  const handleOuterClick = React.useCallback((e) => {
    const menu = menuRef.current;
    if (!menu) return;

    if (!menu.contains(e.target)) {
      cancelContextMenu();
    }
  }, [menuRef, cancelContextMenu]);

  // menu Item 鼠标点击
  const handleClick = (item: IContextMenuItemProps, keyPath, e: MouseEvent<HTMLElement>) => {
    if (
      (typeof item.disabled === 'function' && item.disabled(getExtraInfo(extraInfo))) ||
      (typeof item.disabled === 'boolean' && item.disabled)
    ) {
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

  // 鼠标移入，设置移入的路径
  const handleMouseEnter = (item, index) => {
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

  // 递🐢
  const dfs = (source: IContextMenuItemProps[], results, index = 0) => {
    if (!results[index]) {
      results[index] = [];
    }
    const filterHiddenSource = source.filter((v) => !getHidden(v.hidden));
    for (let i = 0; i < filterHiddenSource.length; i++) {
      const item = filterHiddenSource[i];
      // 过滤 hidden，不让其设置到 dom 上
      const newItem = omit(item, 'hidden');
      const { key, id, disabled = false, icon, label, arrow, children, groupId, extraElement, disabledTip, ...rest } = newItem;
      const selected = paths[index] === key;
      let isGroup = false;
      const nextItem = filterHiddenSource[i + 1];
      // 判断是否存在分组
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
            {label}
          </StyledMenuItemContent>
          {extraElement && <StyledMenuItemExtra>{extraElement}</StyledMenuItemExtra>}
          {!extraElement && arrow && <StyledMenuItemArrow>{arrow}</StyledMenuItemArrow>}
        </StyledMenuItem>
      );

      if (isDisabled && disabledTip) {
        labelElement = (
          <Tooltip title={disabledTip}>
            {labelElement}
          </Tooltip>
        );
      }

      results[index].push({
        key,
        label: labelElement,
      });
      if (selected && children) {
        dfs(children, results, index + 1);
      }
    }
  };

  // 兼容 menuId 与 show 的使用方式
  const handler = React.useCallback((configs: { e: React.MouseEvent<HTMLElement>, extraInfo?: any }) => {
    const { e, extraInfo } = configs;
    setContextMenuState({
      offset: [e.clientX, e.clientY],
      extraInfo,
    });
    if (onShown) {
      onShown(getExtraInfo(extraInfo));
    }
  }, [onShown]);

  const renderChildren = () => {
    if (children) {
      return children;
    }
    if (!overlay || !contextMenuState.offset) {
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

  // 监听 contextMenu 转为内部 state
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

    // 计算 top 值，用于超出屏幕高度时进行计算
    const getTop = (top, height) => {
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
     * 计算菜单项的尺寸位置信息
     * 高度计算原理 => 
     * 1、element.totalHeight = element.top + element.scrollHeight 得到总高度
     * 2、element.totalHeight > innerHeight ? result1 : result2; 比较总高度与当前空间高度
     * 
     * 宽度计算原理 =>
     * 1、element.startX = offset[0] + preMenuWidthSum 得到起点
     * 2、element.finalX = startX - preMenuWidthSum - element.width * (i+1)
     */
    for (let i = 0; i < childList.length; i++) {
      const child = childList[i] as HTMLElement;
      const parentKey = paths[i - 1];
      const scrollHeight = child.scrollHeight;
      const lastElement = child.lastElementChild as HTMLElement;

      if (!parentKey) {
        let total = offset[1] + scrollHeight;
        const curTop = getTop(offset[1], scrollHeight);
        total = curTop + scrollHeight;
        const isOver = total > innerHeight;
        let cssText = isOver ? `height: ${innerHeight - menuSubSpaceHeight}px; overflow: auto;` : '';

        // 计算是否存在剩余空间，不够的话计算差值
        const endX = offset[0] + menuOffset[0] + width;
        const subX = endX > innerWidth ? endX - innerWidth : 0;

        cssText += `
          left: ${offset[0] + menuOffset[0] - subX}px;
          top: ${curTop + menuOffset[1]}px;
          opacity: 1;
          width: ${width}px;
        `;
        child.style.cssText = cssText;
        lastElement.style.cssText = isOver ? `
          left: ${offset[0] + menuOffset[0] - subX}px;
          top: ${curTop + innerHeight - (menuSubSpaceHeight + SYADOW_HEIGHT) + menuOffset[1]}px;
          width: ${width}px;
        ` : '';
        calcScroll(child);
        continue;
      }

      // 找到子菜单从属的父菜单子项，根据父菜单子项的 top 得到子菜单的 top
      const parentContainer = childList[i - 1] as HTMLElement;
      const parentList = parentContainer.childNodes;
      const { index } = cacheOverlay[parentKey];
      const parentElement = parentList[index] as HTMLElement;
      const { top: parentTop } = parentElement.getBoundingClientRect();
      const parentTopWithoutPadding = parentTop - 4;

      let childTotal = parentTopWithoutPadding + scrollHeight;
      const childTop = getTop(parentTop, scrollHeight);
      childTotal = childTop + scrollHeight;

      const isOverChild = childTotal > innerHeight;

      const preParentWidthSum = Array.from(childList)
        .filter((item, k) => k < i)
        .reduce((pre) => {
          pre += width;
          return pre;
        }, 0);

      // 计算左右偏移量，当剩余空间不够放置时，以父级为参照单位
      let childStartX = (childList[0] as HTMLElement).offsetLeft + preParentWidthSum + menuOffset[0];
      if (childStartX + width > innerWidth) {
        childStartX -= (preParentWidthSum + width * i);
      }

      let childCssText = `opacity: 1; width: ${width}px;`;
      childCssText += `
        left: ${childStartX}px;
        top: ${childTop + menuOffset[1]}px;
      `;
      childCssText += isOverChild ? `height: ${innerHeight - menuSubSpaceHeight}px; overflow: auto;` : '';
      child.style.cssText = childCssText;
      lastElement.style.cssText = isOverChild ? `
        left: ${childStartX}px;
        top: ${childTop + innerHeight - (menuSubSpaceHeight + SYADOW_HEIGHT) + menuOffset[1]}px;
        width: ${width}px;
      ` : '';
      calcScroll(child);
    }
  }, [offset, paths, menuRef, menuOffset, cacheOverlay, menuSubSpaceHeight, width, setContextMenuState, onShown]);

  useEffect(() => {
    window.addEventListener('mousedown', handleOuterClick);
    return () => window.removeEventListener('mousedown', handleOuterClick);
  }, [offset, handleOuterClick]);

  // 兼容 menuId 与 show 的使用方式
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
      style.left = offset[0] + menuOffset[0];
      style.top = offset[1] + menuOffset[1];
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
