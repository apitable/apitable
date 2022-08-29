import React, { FC, useContext, useState, useRef } from 'react';
import TreeViewContext from '../tree_view_context';
import { useDrag, useDrop } from 'react-dnd';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';

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

const TreeItemWrapper = styled.li`
  outline: none;
  list-style: none;
`;

const Item = styled.div.attrs(applyDefaultTheme) < {
  hoverColor?: string, level: number, selected: boolean, expanded: boolean, dragOverGapTop: boolean,
  dragOver: boolean, dragOverGapBottom: boolean
} >`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid transparent;
  padding-left: ${props => {
    const level = props.level;
    return ((level - 1) === 0 ? 8 : level * 16) + 'px';
  }};
  
  ${props => props.selected && css`
    background-color: ${props.theme.color.deepPurple[50]};
    ${props.expanded && css`border-radius: 4px 4px 0 0;`}
    & + ${ChildWrapper} {
      background-color: ${props.theme.color.blackBlue[100]};
      border-radius: 0 0 4px 4px;
    }
  `}

  ${props => props.dragOverGapTop && css`
    & > ${LabelWrapper}{
      ::before {
        display: block;
        top: ${(-2 - 1) + 'px'};
      }

      ::after {
        display: block;
        top: ${-6 - 1 + 2 + 'px'} 
      }
    }
  `}

  ${props => props.dragOverGapBottom && css`
    & > ${LabelWrapper}{
      ::before {
        display: block;
        bottom: ${(-2 - 1) + 'px'};
      }
      ::after {
        display: block;
        bottom: ${(-6 - 1 + 2 + 'px')};
      }
    }
  `}

  ${props => props.dragOver && css`
    border-color: ${props.theme.color.deepPurple[500]};
  `}

  @media (any-hover: hover) {
    ${props => !props.selected && css`
      &:hover {
        background: ${props.hoverColor || props.theme.color.blackBlue[100]};
      }
    `}
  }
`;

const Switcher = styled.div<{ hoverColor?: string, expanded: boolean, loading: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;

  & > svg {
    ${props => props.expanded ? css`transform: rotate(90deg);` : css`transform: rotate(0deg);`}
    transition: transform 500ms ease;
  }

  @media (any-hover: hover) {
    &:hover {
      background-color: ${props => props.hoverColor || props.theme.color.black[200]};
    }
  }
`;
const LabelWrapper = styled.div.attrs(applyDefaultTheme)`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;

  &::before {
    display: none;
    content: "";
    position: absolute;
    left: ${(6 - 1) + 'px'};
    right: 0;
    ${props => css`border-top: 2px  solid ${props.theme.color.deepPurple[500]};`}
    z-index: 1;
    pointer-events: none;
  }

  &::after {
    display: none;
    box-sizing: border-box;
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    ${props => css`border: 2px solid ${props.theme.color.deepPurple[500]};`}
    left: 0;
    right: 0;
    z-index: 1;
    pointer-events: none;
  }
`;

const ChildWrapper = styled.ul`
  padding: 0;
  margin: 0;
`;

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
    module, icons, expandAction, multiple, draggable: treeDraggable, dragNodeId,
    loadingNodeId, renderTreeItem, isExpanded, isSelected, isFocused, focus, toggleExpansion, selectNode,
    dragOver, drop,
  } = useContext(TreeViewContext);
  const nodeRef = useRef<any>(null);

  /* 拖拽时是否高亮 */
  // const [dragNodeHighlight, setDragNodeHighlight] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<null | number>(null);
  const [hoverNodeId, setHoverNodeId] = useState('');

  const [, drag] = useDrag({
    type: module,
    item: { id: nodeId },
    // item: () => {
    //   dragStart({ dom: nodeRef.current, id: nodeId });
    //   // setDragNodeHighlight(true);
    // },
    // end: () => {
    //   // setDragNodeHighlight(false);
    // },
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

  const isOverGap = (clientOffset: { x: number, y: number } | null, treeNode: HTMLDivElement) => {
    let newDropPosition = 0;
    if (!clientOffset) { return newDropPosition; }
    const offsetTop = getOffset(treeNode).top;
    const offsetHeight = treeNode.offsetHeight;
    const gapHeight = 12;
    const pageY = clientOffset.y;
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
  const getOffset = (ele: HTMLDivElement) => {
    // let doc;
    // let win;
    // let docElem;

    if (!ele.getClientRects().length) {
      return { top: 0, left: 0 };
    }

    const rect = ele.getBoundingClientRect();

    if (rect.width || rect.height) {
      // doc = ele.ownerDocument;
      // win = doc.defaultView;
      // docElem = doc.documentElement;

      return {
        top: rect.top,
        left: rect.left
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
      toggleExpansion(nodeId, false);
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

  const clickSwitcherHandler = (e: React.MouseEvent) => {
    if (expandAction === false) {
      toggleExpansion(nodeId, false);
      e.stopPropagation();
      return;
    }
  };

  // const rightClickHandle = (e: React.MouseEvent) => {
  //   onRightClick && onRightClick(e, { ...data, pos });
  // };

  const renderChildren = (children: any) => {
    return React.Children.map(children, (item, index) => renderTreeItem(item, index, pos));
  };

  /* 当前节点的深度 */
  const depth = pos ? (pos.split('-').length - 1) : 0;
  console.log('你好: ', isOver, dropPosition);

  drag(dndDrop(dragRef));

  return (
    <TreeItemWrapper className="treeItemRoot" tabIndex={-1}>
      <Item
        level={depth}
        selected={selected}
        expanded={expanded}
        ref={dragRef}
        draggable={draggable && treeDraggable}
        dragOverGapTop={isOver && dropPosition === -1}
        dragOver={isOver && dropPosition === 0}
        dragOverGapBottom={isOver && dropPosition === 1}
        onClick={clickHandler}
      >
        <Switcher onClick={clickSwitcherHandler} expanded={expanded} loading={loading}>
          {!isLeaf &&
            loading ? icons.switcherLoadingIcon : icons.switcherIcon
          }
        </Switcher>
        <LabelWrapper ref={nodeRef}> {label}</LabelWrapper>
      </Item>
      {
        children && expanded && (
          <ChildWrapper
            className={'group'}
            role="group"
            aria-labelledby="tree_label"
          >
            {renderChildren(children)}
          </ChildWrapper>
        )
      }
    </TreeItemWrapper >
  );
};

export const TreeItem = React.memo(TreeItemBase);
