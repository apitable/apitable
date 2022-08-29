import { ConfigConstant } from '@vikadata/core';
import { Spin } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { FC, useContext, useRef, useState } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import TreeViewContext from '../tree_view_context';
import './style.module.less';

export interface ITreeItemProps {
  label: React.ReactNode | string;
  nodeId: string;
  selectable?: boolean;
  isLeaf?: boolean;
  // 如果想要在相关的事件监听器中获取当前节点的数据，就可以在渲染时将数据传递给该组件
  data?: any;
  className?: string;
  draggable?: boolean;
  [customProp: string]: any;
}

const TreeItemBase: FC<ITreeItemProps> = ({
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
    module, icons, indent, expandAction, multiple, draggable: treeDraggable, dragNodeId, highlightNodeId,
    loadingNodeId, renderTreeItem, isExpanded, isSelected, isFocused, focus, toggleExpansion, onRightClick, selectNode,
    dragOver, drop, dragStart, onDoubleClick,
  } = useContext(TreeViewContext);
  const nodeRef = useRef<any>(null);

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
    canDrag: () => draggable && treeDraggable,
  });

  const [{ isOver }, dndDrop] = useDrop({
    accept: module,
    hover: (item, monitor) => {
      setHoverNodeId(nodeId);
      const isGap = isOverGap(monitor.getClientOffset(), nodeRef.current);
      setDropPosition(isGap);
      dragOver({ dom: nodeRef.current, id: nodeId, parentNode, dropPosition: isGap });
    },
    drop() {
      drop({ dragNodeId, dropNodeId: hoverNodeId, dropPosition });
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const isOverGap = (clientOffset, treeNode: HTMLDivElement) => {
    const offsetTop = getOffset(treeNode).top;
    const offsetHeight = treeNode.offsetHeight;
    const gapHeight = 12;
    const pageY = clientOffset.y;
    let newDropPosition = 0;
    // 判断鼠标位置是否在元素的下半部分
    if (pageY >= (offsetTop + (offsetHeight + 2) - gapHeight) && pageY <= (offsetTop + (offsetHeight + 2))) {
      newDropPosition = 1;
      // 判断鼠标位置是否在元素的下半部分
    } else if (pageY <= (offsetTop + gapHeight) && pageY >= offsetTop - 4) {
      newDropPosition = -1;
    }
    return newDropPosition;
  };

  // 获取节点偏移信息
  const getOffset = ele => {
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
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft,
      };
    }

    return rect;
  };

  /* 当前节点是否是展开状态  */
  const expanded = isExpanded ? isExpanded(nodeId) : false;
  /* 当前节点是否是选中状态 */
  const selected = isSelected ? isSelected(nodeId) : false;
  /* 当前节点是否是聚焦状态 */
  const focused = isFocused ? isFocused(nodeId) : false;
  /* 当前节点是否是加载状态 */
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
      // TODO: 多选操作
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

  const renderChildren = children => {
    return React.Children.map(children, (item, index) => renderTreeItem(item, index, pos));
  };

  /* 当前节点的深度 */
  const depth = pos ? (pos.split('-').length - 1) : 0;

  drag(dndDrop(dragRef));

  return (
    <li className="treeItemRoot" tabIndex={-1}>
      <div
        className={classnames('treeItem', {
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
        }, className)}
        ref={dragRef}
        onClick={clickHandler}
        onDoubleClick={doubleClickHandler}
        onContextMenu={rightClickHandle}
        draggable={draggable && treeDraggable}
        style={{ paddingLeft: (depth - 1) === 0 ? 8 : (depth - 1) * indent }}
        data-test-id={'treeNodeItem'}
      >
        <div className={'iconContainer'}>
          {!isLeaf &&
            <div className={'icon'} onClick={clickSwitcherHandler}>
              {loading ? <Spin size="small" className="spin" /> : icons.switcherIcon}
            </div>
          }
        </div>
        <div
          className={'label'}
          ref={nodeRef}
        >
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
