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

import classNames from 'classnames';
import { without } from 'lodash';
import { FC, memo, useContext } from 'react';
import { useDragLayer, DragLayerMonitor } from 'react-dnd';
import { ISetRecordOptions, moveArrayElement } from '@apitable/core';
import { Handle, NodeProps, Position } from '@apitable/react-flow';
import { DragNodeType, GHOST_NODE_SIZE } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import useRafState from 'pc/components/org_chart_view/hooks/use_raf_state';
import { IDragItem, INodeData } from 'pc/components/org_chart_view/interfaces';
import { DropWrapper } from '../../drop_wrapper';
import styles from '../styles.module.less';

export const GhostNode: FC<React.PropsWithChildren<NodeProps<INodeData>>> = memo((props) => {
  const { id, data, sourcePosition, targetPosition } = props;

  const { parents } = data;

  const {
    overGhostRef,
    nodesMap,
    pre,
    onChange,
    orgChartStyle: { linkFieldId },
    horizontal,
  } = useContext(FlowContext);

  const [nodeVisible, setNodeVisible] = useRafState(false);

  const { dragItem } = useDragLayer((monitor: DragLayerMonitor) => ({
    dragItem: monitor.getItem(),
  }));

  const parent = nodesMap[parents[0].id];

  const isParent = (dragId: string) => {
    let _parent = parent;
    if (_parent?.id === dragId) {
      return true;
    }
    while (_parent && pre[_parent.id].length >= 1) {
      _parent = pre[_parent.id][0];
      if (_parent.id === dragId) {
        return true;
      }
    }
    return false;
  };

  const visible =
    nodeVisible && dragItem && overGhostRef.current?.id === id && !overGhostRef.current?.id.includes(dragItem.id) && !isParent(dragItem.id);

  const handleDrop = (dragItem: IDragItem) => {
    if (!id.includes(dragItem.id) && !isParent(dragItem.id)) {
      const [leftId] = id.split('-');
      const linkIds = [...parent.data.linkIds];
      const leftIndex = linkIds.findIndex((linkId) => linkId === leftId);

      const [dragItemParent] = nodesMap[dragItem.id].data.parents;
      const newData: ISetRecordOptions[] = [];

      const targetIndex = leftIndex === -1 ? 0 : leftIndex + 1;
      const newLinkIds = [...linkIds];
      newLinkIds.splice(targetIndex, 0, dragItem.id);
      const insertData = {
        recordId: parent.id,
        fieldId: linkFieldId,
        value: newLinkIds,
      };

      /**
       * There are three cases:
       * 1. Unprocessed list node insertion
       * 2. Cross-level node insertion
       * 3. Inter-node insertion at the same level
       */
      if (!dragItemParent) {
        newData.push(insertData);
      } else if (dragItemParent.id !== parent.id) {
        newData.push(insertData);
        // Disconnecting old connections
        // FIXME: In the case of multi-player collaboration, the latest ancestral information may not be available here
        newData.push({
          recordId: dragItemParent.id,
          fieldId: linkFieldId,
          value: without(dragItemParent.data.linkIds, dragItem.id),
        });
      } else {
        const dragIndex = parent.data.linkIds.findIndex((linkId) => linkId === dragItem.id);
        const targetIndex = dragIndex > leftIndex ? leftIndex + 1 : leftIndex;
        moveArrayElement(linkIds, dragIndex, targetIndex);
        newData.push({
          recordId: parent.id,
          fieldId: linkFieldId,
          value: linkIds,
        });
      }

      onChange(newData);
      overGhostRef.current = {
        ...overGhostRef.current,
        id: undefined,
      };
      setNodeVisible(false);
    }
  };

  const handleMouseOver = () => {
    overGhostRef.current = {
      ...overGhostRef.current,
      id,
      hiddenLastNode: () => {
        setNodeVisible(false);
      },
    };
    setNodeVisible(true);
    overGhostRef.current.setEdgeVisibleFuncsMap?.[id]?.(true);
  };

  return (
    <>
      <DropWrapper
        accept={[DragNodeType.RENDER_NODE, DragNodeType.OTHER_NODE]}
        onDrop={handleDrop}
        onMouseOver={handleMouseOver}
        className={styles.ghostWrapper}
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: dragItem ? 'initial' : 'none',
        }}
      >
        <div
          className={classNames(styles.ghost, horizontal && styles.horizontal)}
          style={{
            height: horizontal ? GHOST_NODE_SIZE : '',
          }}
        />
      </DropWrapper>
      {horizontal && (
        <Handle
          type="source"
          position={sourcePosition as Position}
          className={classNames(styles.ghostHandle, {
            // [styles.visible]: visible,
          })}
        />
      )}
      {horizontal && (
        <Handle
          type="target"
          position={targetPosition as Position}
          className={classNames(styles.ghostHandle, {
            [styles.visible]: visible,
          })}
        />
      )}
    </>
  );
});
