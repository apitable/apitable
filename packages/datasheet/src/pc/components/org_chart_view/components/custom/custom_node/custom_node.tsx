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

import { useMount } from 'ahooks';
import classNames from 'classnames';
import { FC, memo, useCallback, useContext, useRef } from 'react';
import { DragLayerMonitor, DropTargetMonitor, useDragLayer, useDrop } from 'react-dnd';
import { ISetRecordOptions, Strings, t } from '@apitable/core';
import { NodeProps, Handle, Position } from '@apitable/react-flow';
import { notify } from 'pc/components/common/notify';
import { DragNodeType } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import { IDragItem, INodeData } from 'pc/components/org_chart_view/interfaces';
import styles from '../styles.module.less';
import { CustomNodeBase } from './custom_node_base';

export const CustomNode: FC<React.PropsWithChildren<NodeProps<INodeData>>> = memo((props) => {
  const { id, data, sourcePosition, targetPosition } = props;

  const { linkIds, parents } = data;

  const { nodeStateMap, setNodeStateMap, orgChartStyle, nodesMap, linkField, onChange, overGhostRef, horizontal } = useContext(FlowContext);

  const { linkFieldId } = orgChartStyle;

  const canDropFn = useCallback(
    (dragItem: IDragItem) => {
      const foundInChildren = (dragItem: IDragItem) => {
        const queue = [dragItem.id];
        while (queue.length > 0) {
          const nodeId = queue.shift()!;
          for (const linkId of nodesMap[nodeId].data.linkIds) {
            queue.push(linkId);
            if (linkId === id) {
              return true;
            }
          }
        }
        return false;
      };

      return (
        !(linkField && linkField.property.limitSingleRecord && nodesMap[id].data.linkIds.length > 0) &&
        !dragItem.data.parents?.some((parent) => parent.id === id) &&
        !foundInChildren(dragItem)
      );
    },
    [id, nodesMap, linkField],
  );

  const innerRef = useRef<HTMLDivElement>(null);

  const [{ isOver, isOverCurrent }, dropRef] = useDrop(
    () => ({
      accept: [DragNodeType.RENDER_NODE, DragNodeType.OTHER_NODE],
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
      /**
       * Discussed here by situation:
       * 1. The target node is the parent of the dragged node
       * 2. The target node is a child of the drag and drop node
       * 3. The target node is neither a parent nor a child of the dragged node
       */
      drop: (dragItem: IDragItem, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();

        if (didDrop || dragItem.id === id) {
          return;
        }

        if (!canDropFn(dragItem)) {
          notify.open({
            message: t(Strings.org_chart_can_not_drop),
          });
          return;
        }

        setNodeStateMap((prevState) => {
          const nextState = { ...prevState };
          nextState[id] = {
            collapsed: false,
          };
          delete nextState[dragItem.id];
          linkIds.forEach((linkId) => {
            delete nextState[linkId];
          });
          return nextState;
        });

        const value = Array.from(new Set([...linkIds, dragItem.id]));
        const data: ISetRecordOptions[] = [{ recordId: id, fieldId: linkFieldId, value }];

        if (dragItem.data.degree && dragItem.data.degree.inDegree >= 1) {
          // Connections to be disconnected
          const sourceLinkData = dragItem.data.parents?.reduce((sourceLinkData, parent) => {
            const {
              id: sourceId,
              data: { linkIds },
            } = parent;

            sourceLinkData.push({
              recordId: sourceId,
              fieldId: linkFieldId,
              value: linkIds.filter((id) => id !== dragItem.id),
            });
            return sourceLinkData;
          }, [] as ISetRecordOptions[]);
          data.push(...(sourceLinkData || []));
        }
        onChange(data);
      },
      hover: () => {
        if (overGhostRef.current) {
          const { id = '', hiddenLastNode, setEdgeVisibleFuncsMap } = overGhostRef.current;
          hiddenLastNode?.();
          setEdgeVisibleFuncsMap?.[id]?.(false);
          overGhostRef.current.id = undefined;
        }
      },
    }),
    [data],
  );

  const { isDragging } = useDragLayer((monitor: DragLayerMonitor) => ({
    isDragging: monitor.isDragging(),
  }));

  useMount(() => {
    if (innerRef.current) {
      dropRef(innerRef.current);
    }
  });

  return (
    <>
      <div ref={innerRef}>
        <CustomNodeBase id={id} data={data} isOver={Boolean(isOver || isOverCurrent)} isDragging={isDragging} />
      </div>
      {horizontal && (
        <Handle
          type="source"
          position={sourcePosition as Position}
          className={classNames(styles.handle, {
            [styles.visible]: linkIds.length > 0 && !nodeStateMap[id]?.collapsed,
          })}
        />
      )}
      {horizontal && (
        <Handle
          type="target"
          position={targetPosition as Position}
          className={classNames(styles.handle, {
            [styles.visible]: parents.length > 0,
          })}
        />
      )}
    </>
  );
});
