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
  // If you want to get the data of the current node in the relevant event listener, you can pass the data to the component during rendering
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

const TreeItemBase: FC<React.PropsWithChildren<ITreeItemProps>> = ({
  label,
  nodeId,
  selectable = true,
  isLeaf = false,
  pos,
  parentNode,
  children,
  draggable = true,
}) => {
  const {
    module, icons, expandAction, multiple, draggable: treeDraggable, dragNodeId,
    loadingNodeId, renderTreeItem, isExpanded, isSelected, isFocused, focus, toggleExpansion, selectNode,
    dragOver, drop,
  } = useContext(TreeViewContext);
  const nodeRef = useRef<any>(null);

  const dragRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<null | number>(null);
  const [hoverNodeId, setHoverNodeId] = useState('');

  const [, drag] = useDrag({
    type: module,
    item: { id: nodeId },
  });

  const [{ isOver }, dndDrop] = useDrop({
    accept: module,
    hover: (_item, monitor) => {
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
    // Determine whether the mouse position is in the lower part of the element
    if (pageY >= (offsetTop + (offsetHeight + 2) - gapHeight) && pageY <= (offsetTop + (offsetHeight + 2))) {
      newDropPosition = 1;
    } else if (pageY <= (offsetTop + gapHeight) && pageY >= offsetTop - 4) {
      newDropPosition = -1;
    }
    return newDropPosition;
  };

  // Get node offset data
  const getOffset = (ele: HTMLDivElement) => {

    if (!ele.getClientRects().length) {
      return { top: 0, left: 0 };
    }

    const rect = ele.getBoundingClientRect();

    if (rect.width || rect.height) {
      return {
        top: rect.top,
        left: rect.left
      };
    }

    return rect;
  };

  /**
   * Whether the current node is expanded
   */
  const expanded = isExpanded ? isExpanded(nodeId) : false;
  /**
   * Whether the current node is selected
   */
  const selected = isSelected ? isSelected(nodeId) : false;
  /**
   * Whether the current node is in focus
   */
  const focused = isFocused ? isFocused(nodeId) : false;
  /**
   * Whether the current node is in loading status
   */
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
      // TODO: Multiple selection operation
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

  /* Depth of the current node */
  const depth = pos ? (pos.split('-').length - 1) : 0;

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
