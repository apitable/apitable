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

import { useThrottleFn } from 'ahooks';
import cls from 'classnames';
import RcTrigger, { TriggerProps } from 'rc-trigger';
import { forwardRef, useCallback, memo, useRef, useState, useLayoutEffect, useImperativeHandle } from 'react';

import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getChildListByContainerSelector, stopPropagation } from 'pc/utils';
import styles from './style.module.less';

export type IText = string | JSX.Element | (() => JSX.Element);
type IAlign = 'flex-start' | 'flex-end';
type IUnionDOMText = HTMLElement & ICollapseItemTextState;

export interface ICollapseItemProps {
  key: string;
  text: IText;
  label?: string;
  fixedWidth?: number;
  editing?: boolean;
  editingWidth?: number;
}

export interface ICollapseProps extends Omit<TriggerProps, 'children' | 'popup' | 'className'> {
  mode?:
    | 'auto'
    | {
        fontSize: number;
        labelMaxWidth: number;
      };
  id?: string;
  align?: IAlign;
  data: ICollapseItemProps[];
  trigger: IText | (() => JSX.Element | null);
  triggerClassName?: {
    normal: string;
    active?: string;
  };
  collapseItemClassName?: string;
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
  stopCalculate?: { width: number };
  unSortable?: boolean;
  disabledPopup?: boolean;
  fixedIndex?: number;
  activeKey?: string;
  extra?: IText | boolean;
  extraClassName?: string;
  fxiedIndex?: number;
  popupItemClassName?: string;
  popupItemStyle?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => {};
  wrapClick?: (e: React.MouseEvent) => void;
  onSort?: (from: number, to: number) => void;
  onItemClick?: (e: React.MouseEvent, id: string) => void;
  onRenderPopup?: (list: ICollapseItemProps[]) => IText;
  onPopupVisibleChange?: (visible: boolean) => void;
}

export interface ICollapseFunc {
  getHideList: () => ICollapseItemProps[];
  getFocusElementType: () => string | undefined;
  clearFocusElementType: () => void;
}

interface ICollapseItemState extends ICollapseItemProps {
  hidden?: boolean;
}

interface ICollapseItemTextState extends ICollapseItemProps {
  width: number;
}

export interface ICollapseListState {
  show: ICollapseItemState[];
  hide: ICollapseItemProps[];
  displayWidth: number;
}

const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
  'Segoe UI Symbol', 'Noto Color Emoji'`;

const CollapseBase: React.ForwardRefRenderFunction<ICollapseFunc, ICollapseProps> = (props, ref) => {
  const {
    mode = 'auto',
    id = 'sort',
    align = 'flex-start',
    data,
    trigger,
    triggerClassName,
    collapseItemClassName,
    wrapClassName,
    wrapStyle,
    unSortable = false,
    disabledPopup = false,
    extra,
    extraClassName,
    fixedIndex = 0,
    activeKey,
    popupStyle,
    popupClassName,
    popupItemClassName,
    onItemClick,
    wrapClick,
    onRenderPopup,
    onClick,
    onSort,
    onPopupVisibleChange,
  } = props;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const extraRef = useRef<HTMLDivElement | null>(null);
  const [preActive, setPreActive] = useState<string | null>(null);
  const [focusElementType, setFocusElementType] = useState<string | undefined>();
  const [collapseList, setCollapseList] = useState<ICollapseListState>({
    show: data.map((v) => ({ ...v, hidden: true, positionX: 0 })),
    hide: [],
    displayWidth: 0,
  });
  const isAuto = mode === 'auto';

  const getChildWithTextList = () => {
    if (mode === 'auto') {
      return [];
    }
    const { labelMaxWidth, fontSize } = mode;
    const arr: ICollapseItemTextState[] = [];
    const cssText = `
      display: inline-block;
      font-size: ${fontSize}px;
      font-family: ${fontFamily};
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 0;
      opacity: 0;
    `;
    const dom = document.createElement('div');
    dom.style.cssText = cssText;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const { label = '', fixedWidth = 0, editing = false, editingWidth = 0 } = item;
      let width = 0;
      dom.innerText = label;
      if (!document.body.contains(dom)) {
        document.body.appendChild(dom);
      }
      if (editing) {
        width = editingWidth;
      } else {
        width = dom.offsetWidth;
        width = width > labelMaxWidth ? labelMaxWidth : width;
        width += fixedWidth;
      }
      arr.push({ width, ...item });
    }
    document.body.removeChild(dom);
    return arr;
  };

  /**
   * Inverted visual list, calculating how many items need to be removed to place the inserted display label
   */
  const reCalculateDisplayWidth = (list: string | any[], childList: IUnionDOMText[], originTotal: number, total: number, item: IUnionDOMText) => {
    let sum = originTotal;
    let index = list.length - 1;
    let deleteCount = 0;
    const itemWidth = item.width;
    const showChildList = childList.slice(0, list.length);

    // There is an item not in the list, and the intercepted item is longer than the length of the item
    if (originTotal + itemWidth <= total) {
      return {
        show: [...list, item],
        total: originTotal + itemWidth,
      };
    }

    // console.log(`total: ${total}, itemWidth: ${itemWidth}`);
    for (; index >= 0; index--) {
      const cur = childList[index];
      const curWidth = cur.width;
      const sub = sum - curWidth;
      deleteCount++;
      // console.log(`index: ${index}, curWidth: ${curWidth}, sum: ${sum}, sub: ${sub}`);
      if (sub + itemWidth <= total) {
        sum = sub + itemWidth;
        break;
      }
      sum = sub;
    }

    // console.log(`list.length: ${list.length}, index: ${index}, deleteCount: ${deleteCount}`);
    const finallyChildList = showChildList.slice(0, list.length - deleteCount);
    const totalWidth = finallyChildList.reduce((pre, v) => (pre += v.width), 0) + itemWidth;

    if (deleteCount === 0) {
      return {
        show: [...list, item],
        total: totalWidth,
      };
    }

    const result = [...list];
    result.splice(result.length - deleteCount, deleteCount, item);

    return {
      show: [...result],
      total: totalWidth,
    };
  };

  // Calculate hidden layouts
  const setPopup = () => {
    const container = wrapRef.current,
          triggerBtn = triggerRef.current,
          extraWrap = extraRef.current;
    if (!container || !triggerBtn) {
      return;
    }
    const { width } = container.getBoundingClientRect();
    const { width: triggerWidth } = triggerBtn.getBoundingClientRect();
    const extraWidth = extraWrap ? extraWrap.getBoundingClientRect().width : 0;

    const childList = (isAuto ? getChildListByContainerSelector(container, '.collapseShowArea') : getChildWithTextList()) as IUnionDOMText[];
    if (childList.length === 0) {
      return;
    }

    // Calculate if there is a need to fix the first few items
    let fixedTotalWidth = 0;
    const fixedIndexResult = fixedIndex > childList.length || fixedIndex < 0 ? 0 : fixedIndex;
    for (let i = 0; i < childList.length; i++) {
      if (i > fixedIndexResult - 1) {
        break;
      }
      const child = childList[i];
      fixedTotalWidth += isAuto ? child.offsetWidth : child.width;
    }

    // Get active tags
    let activeItem: IUnionDOMText | null = null;
    if (activeKey) {
      activeItem = childList.filter((v) => v.key === activeKey)[0];
    }

    // Width without extra, width without extra and trigger
    const displayWithTriggerWidth = width - extraWidth;
    const displayWidth = displayWithTriggerWidth - triggerWidth;
    let realDisplayWidth = displayWidth;

    let widthSum = fixedTotalWidth,
        sliceIndex = -1;
    // Do mutually exclusive operations, activation and fixed n terms cannot occur at the same time
    const startIndex = activeKey ? 0 : fixedIndexResult;
    // Compare the width of the list to the width of the container and determine from which position it is hidden
    for (let i = startIndex; i < childList.length; i++) {
      const curWidth = isAuto ? childList[i].offsetWidth : childList[i].width;
      widthSum += curWidth;
      // Determining where the first interception is to take place
      if (widthSum > displayWidth && sliceIndex === -1) {
        sliceIndex = i;
        // If the target is hit on the first try, determine if the width is 0
        const sub = widthSum - curWidth;
        realDisplayWidth = sub || curWidth;
      }
      // exceeds the width of the containing trigger and needs to be intercepted
      if (widthSum > displayWithTriggerWidth) {
        break;
      }
      // The total length is not exceeded when the traversal is complete and no interception is required
      if (i === childList.length - 1 && widthSum <= displayWithTriggerWidth) {
        sliceIndex = -1;
        realDisplayWidth = widthSum;
      }
    }

    // Preventing a no-loop situation where childList.length = fixedIndex
    realDisplayWidth = widthSum < realDisplayWidth ? widthSum : realDisplayWidth;
    const sliceFlag = sliceIndex === -1;
    const hide = sliceFlag ? [] : data.slice(sliceIndex);

    let show = isAuto
      ? data.map((v, i) => ({ ...v, hidden: sliceFlag ? false : i >= sliceIndex && i >= startIndex }))
      : data.slice(0, sliceFlag ? data.length : sliceIndex);

    if (activeItem) {
      let activeIndex = -1;

      const list = sliceIndex === -1 ? childList : childList.slice(0, sliceIndex);
      activeIndex = list.findIndex((v) => v.key === activeKey);

      if (activeIndex < 0 || (collapseList.show.length && collapseList.show.findIndex((v) => v.key === activeKey) < 0)) {
        const result = reCalculateDisplayWidth(show, childList, realDisplayWidth, displayWidth, activeItem);
        show = result.show;
        realDisplayWidth = result.total;
        setPreActive(activeItem.key);
      } else if (preActive) {
        const preActiveIndex = data.findIndex((v) => v.key === preActive);
        const existShowIndex = list.findIndex((v) => v.key === preActive);

        if (preActiveIndex > -1 && preActive !== activeKey && existShowIndex < 0) {
          const result = reCalculateDisplayWidth(show, childList, realDisplayWidth, displayWidth, childList[preActiveIndex]);

          if (result.show.findIndex((v) => v.key === activeKey) > -1) {
            show = result.show;
            realDisplayWidth = result.total;
          }
        }
      }
    }

    const list = {
      show,
      hide,
      displayWidth: realDisplayWidth,
    };
    setCollapseList(list);
  };

  const { run, cancel } = useThrottleFn(setPopup, { wait: 100 });
  useLayoutEffect(() => {
    const observer = new MutationObserver(run);
    if (wrapRef.current) {
      run();
      observer.observe(wrapRef.current, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      });
    }
    return () => {
      observer.disconnect();
      cancel();
    };
  }, [data, fixedIndex, cancel, run]);

  useImperativeHandle(
    ref,
    () => ({
      getHideList: () => {
        return collapseList.hide;
      },
      getRef: () => wrapRef,
      getFocusElementType: () => focusElementType,
      clearFocusElementType: () => setFocusElementType(undefined),
    }),
    [collapseList, wrapRef, focusElementType],
  );

  const handleClick = (e: React.MouseEvent) => {
    stopPropagation(e);
    if (wrapClick) {
      wrapClick(e);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { show } = collapseList;
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (onSort) {
      const dragItem = show.filter((_v, index) => index === source.index)[0];
      const dropItem = show.filter((_v, index) => index === destination.index)[0];
      if (!dragItem || !dropItem) return;
      const dragIndex = data.findIndex((v) => v.key === dragItem.key);
      const dropIndex = data.findIndex((v) => v.key === dropItem.key);
      if (dragItem.key === preActive || dropItem.key === preActive) {
        setPreActive(null);
      }
      if (dropIndex > destination.index) {
        onSort(dropIndex, destination.index);
      }
      onSort(dragIndex, destination.index);
    }
  };

  const renderOverlay = useCallback(() => {
    if (onRenderPopup) {
      return onRenderPopup(collapseList.hide);
    }
    return collapseList.hide.map((v) => {
      const result = typeof v.text === 'function' ? v.text() : typeof v.text === 'string' ? v.text : React.cloneElement(v.text, { isHide: true });
      return (
        <div className={cls(styles.popupItem, popupItemClassName)} key={v.key}>
          {result}
        </div>
      );
    });
  }, [collapseList, onRenderPopup, popupItemClassName]);

  const mergeTriggerCls = cls(
    styles.toggle,
    {
      [styles.toggleHidden]: collapseList.hide.length === 0,
    },
    triggerClassName?.normal,
  );

  const mergeCollapseCls = cls(styles.collapse, wrapClassName);
  const mergeStyle: React.CSSProperties = { justifyContent: align, ...wrapStyle };

  const extraCls = cls(styles.extraBtn, extraClassName);
  const itemCls = cls(styles.item, collapseItemClassName);

  const { displayWidth, show } = collapseList;

  const activeIndex = show.findIndex((v) => v.key === activeKey);

  return (
    <div
      onClick={handleClick}
      onMouseDown={(e) => setFocusElementType((e.target as HTMLElement).nodeName)}
      ref={wrapRef}
      className={mergeCollapseCls}
      style={mergeStyle}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable isDropDisabled={unSortable} droppableId={id} direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cls(styles.content, 'collapseShowArea')}
              style={{ width: displayWidth || '100%' }}
            >
              {show.map((item, index) => {
                const { key, text } = item;
                const result =
                  typeof text === 'function'
                    ? text()
                    : typeof text === 'string'
                      ? text
                      : React.cloneElement(text, { isLastDisplay: index === show.length - 1, activeIndex, displayIndex: index });
                return (
                  <Draggable isDragDisabled={unSortable} key={item.key} draggableId={item.key} index={index}>
                    {(providedChild) => {
                      return (
                        <div
                          data-nid={key}
                          ref={providedChild.innerRef}
                          {...providedChild.draggableProps}
                          {...providedChild.dragHandleProps}
                          className={cls(itemCls, { [styles.itemHidden]: item.hidden })}
                          // Detail https://github.com/atlassian/react-beautiful-dnd/issues/1872
                          onMouseDown={(e) => e.currentTarget.focus()}
                          onClick={(e) => {
                            if (onItemClick) {
                              onItemClick(e, item.key);
                            }
                          }}
                        >
                          {result}
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <RcTrigger
        destroyPopupOnHide
        action={!disabledPopup ? ['click'] : ['']}
        popup={renderOverlay()}
        popupAlign={{
          points: ['tr', 'br'],
          overflow: { adjustX: 1, adjustY: 1 },
          offset: [0, 4],
          targetOffset: [0, 0],
        }}
        popupStyle={popupStyle}
        popupClassName={popupClassName}
        onPopupVisibleChange={onPopupVisibleChange}
      >
        <div ref={triggerRef} onClick={onClick} className={mergeTriggerCls}>
          {typeof trigger === 'function' ? trigger() : trigger}
        </div>
      </RcTrigger>
      {extra && (
        <div className={extraCls} ref={extraRef}>
          {typeof extra === 'function' ? extra() : extra}
        </div>
      )}
    </div>
  );
};

export const Collapse = memo(forwardRef(CollapseBase));
