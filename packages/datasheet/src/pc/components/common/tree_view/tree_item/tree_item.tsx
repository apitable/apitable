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

import { Spin } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { FC, useContext, useRef, useState } from 'react';
import { DragSourceMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import { ConfigConstant } from '@apitable/core';
import './style.module.less';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from '../../component_display';
import TreeViewContext from '../tree_view_context';

export interface ITreeItemProps {
  label: React.ReactNode | string;
  nodeId: string;
  selectable?: boolean;
  isLeaf?: boolean;
  data?: any;
  className?: string;
  draggable?: boolean;

  [customProp: string]: any;
}

const TreeItemBase: FC<React.PropsWithChildren<ITreeItemProps>> = ({
  label,
  nodeId,
  selectable = true,
  isLeaf = false,
  data = null,
  pos,
  parentNode,
  children,
  className,
  draggable = true,
}) => {
  const {
    module,
    icons,
    indent,
    expandAction,
    multiple,
    draggable: treeDraggable,
    dragNodeId,
    highlightNodeId,
    loadingNodeId,
    renderTreeItem,
    isExpanded,
    isSelected,
    isFocused,
    focus,
    toggleExpansion,
    onRightClick,
    selectNode,
    dragOver,
    drop,
    dragStart,
    onDoubleClick,
  } = useContext(TreeViewContext);
  const nodeRef = useRef<any>(null);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const dragRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<null | number>(null);
  const [hoverNodeId, setHoverNodeId] = useState('');

  const [{ isDragging }, drag] = useDrag({
    type: module,
    item: () => {
      dragStart({ dom: nodeRef.current, id: nodeId });
      return { id: nodeId };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => draggable && treeDraggable && !isMobile,
  });

  const [{ isOver }, dndDrop] = useDrop({
    accept: module,
    hover: (_item, monitor) => {
      setHoverNodeId(nodeId);
      const isGap = isOverGap(monitor.getClientOffset()!, nodeRef.current);
      setDropPosition(isGap);
      dragOver({ dom: nodeRef.current, id: nodeId, parentNode, dropPosition: isGap });
    },
    drop() {
      drop({ dragNodeId, dropNodeId: hoverNodeId, dropPosition });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const isOverGap = (clientOffset: XYCoord, treeNode: HTMLDivElement) => {
    const offsetTop = getOffset(treeNode).top;
    const offsetHeight = treeNode.offsetHeight;
    const gapHeight = 12;
    const pageY = clientOffset.y;
    let newDropPosition = 0;
    if (pageY >= offsetTop + (offsetHeight + 2) - gapHeight && pageY <= offsetTop + (offsetHeight + 2)) {
      newDropPosition = 1;
    } else if (pageY <= offsetTop + gapHeight && pageY >= offsetTop - 4) {
      newDropPosition = -1;
    }
    return newDropPosition;
  };

  const getOffset = (ele: HTMLDivElement) => {
    let doc;
    let win;
    let docElem;

    if (!ele.getClientRects().length) {
      return { top: 0, left: 0 };
    }

    const rect = ele.getBoundingClientRect();

    if (rect.width || rect.height) {
      doc = ele.ownerDocument;
      win = doc.defaultView;
      docElem = doc.documentElement;

      return {
        top: rect.top + (win?.pageYOffset || 0) - docElem.clientTop,
        left: rect.left + (win?.pageXOffset || 0) - docElem.clientLeft,
      };
    }

    return rect;
  };

  const expanded = isExpanded ? isExpanded(nodeId) : false;
  const selected = isSelected ? isSelected(nodeId) : false;
  const focused = isFocused ? isFocused(nodeId) : false;
  const loading = loadingNodeId === nodeId;

  const clickHandler = (e: React.MouseEvent) => {
    const isMultiple = multiple && (e.shiftKey || e.ctrlKey || e.metaKey);

    if (!focused) {
      focus(e, nodeId);
    }

    if (!e.defaultPrevented && expandAction !== false) {
      toggleExpansion(nodeId);
    }

    if (!selectable) {
      return;
    }
    if (isMultiple) {
      // TODO: Multi-select operation
    } else {
      selectNode(e, nodeId);
    }
  };

  const doubleClickHandler = (e: React.MouseEvent) => {
    onDoubleClick && onDoubleClick(e, { key: nodeId, level: pos });
  };

  const clickSwitcherHandler = (e: React.MouseEvent) => {
    if (expandAction === false) {
      toggleExpansion(nodeId);
      e.stopPropagation();
      return;
    }
  };

  const rightClickHandle = (e: React.MouseEvent) => {
    onRightClick && onRightClick(e, { ...data, pos });
  };

  const renderChildren = (children: any) => {
    return React.Children.map(children, (item, index) => renderTreeItem(item, index, pos));
  };

  const depth = pos ? pos.split('-').length - 1 : 0;

  drag(dndDrop(dragRef));

  return (
    <li className="treeItemRoot" tabIndex={-1}>
      <div
        className={classnames(
          'treeItem',
          {
            expanded,
            selected,
            focused,
            draggable: draggable && treeDraggable,
            dragging: dragNodeId,
            disabled: !selectable,
            dragNodeHighlight: isDragging,
            parentHighlight: highlightNodeId === nodeId,
            dragOverGapTop: isOver && dropPosition === -1,
            dragOver: isOver && data.type == ConfigConstant.NodeType.FOLDER && dropPosition === 0,
            dragOverGapBottom: isOver && dropPosition === 1,
          },
          className,
        )}
        ref={dragRef}
        onClick={clickHandler}
        onDoubleClick={doubleClickHandler}
        onContextMenu={rightClickHandle}
        draggable={draggable && treeDraggable}
        style={{ paddingLeft: depth - 1 === 0 ? 8 : (depth - 1) * indent }}
        data-test-id={'treeNodeItem'}
      >
        <div className={'iconContainer'}>
          {!isLeaf && (
            <div className={'icon'} onClick={clickSwitcherHandler}>
              {loading ? <Spin size="small" className="spin" /> : icons.switcherIcon}
            </div>
          )}
        </div>
        <div className={'label'} ref={nodeRef}>
          {label}
        </div>
      </div>
      {children && expanded && (
        <ul className={'group'} role="group" aria-labelledby="tree_label">
          {renderChildren(children)}
        </ul>
      )}
    </li>
  );
};

export const TreeItem = React.memo(TreeItemBase);
