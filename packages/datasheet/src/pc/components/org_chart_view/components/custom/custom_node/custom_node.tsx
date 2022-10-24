import { FC, memo, useCallback, useContext, useRef } from 'react';
import { NodeProps, Handle, Position } from '@vikadata/react-flow-renderer';
import { DragLayerMonitor, DropTargetMonitor, useDragLayer, useDrop } from 'react-dnd';
import { ISetRecordOptions, Strings, t } from '@apitable/core';
import { notify } from 'pc/components/common/notify';
import { IDragItem, INodeData } from 'pc/components/org_chart_view/interfaces';
import { DragNodeType } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import { CustomNodeBase } from './custom_node_base';
import { useMount } from 'ahooks';
import styles from '../styles.module.less';
import classNames from 'classnames';

export const CustomNode: FC<NodeProps<INodeData>> = memo((props) => {
  const { id, data, sourcePosition, targetPosition } = props;

  const { linkIds, parents } = data;

  const {
    nodeStateMap,
    setNodeStateMap,
    orgChartStyle,
    nodesMap,
    linkField,
    onChange,
    overGhostRef,
    horizontal,
  } = useContext(FlowContext);

  const {
    linkFieldId,
  } = orgChartStyle;

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
        !(linkField && linkField.property.limitSingleRecord && nodesMap[id].data.linkIds.length > 0)
        && !dragItem.data.parents?.some((parent) => parent.id === id) // 不能是父节点
        && !foundInChildren(dragItem) // 不能是子节点
      );
    },
    [id, nodesMap, linkField]
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
       * 可以分情况讨论
       * 1. 目标节点是拖拽节点的父节点
       * 2. 目标节点是拖拽节点的子节点
       * 3. 目标节点既不是拖拽节点的父节点，也不是拖拽节点的子节点
       */
      drop: (dragItem: IDragItem, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();

        if (
          didDrop
          || dragItem.id === id // 不能是自己
        ) {
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
          // 待断开的连接🔗
          const sourceLinkData = dragItem.data.parents?.reduce((sourceLinkData, parent) => {
            const {
              id: sourceId,
              data: {
                linkIds,
              }
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
          const {
            id = '',
            hiddenLastNode,
            setEdgeVisibleFuncsMap,
          } = overGhostRef.current;
          hiddenLastNode?.();
          setEdgeVisibleFuncsMap?.[id]?.(false);
          overGhostRef.current.id = undefined;
        }
      },
    }),
    [data]
  );

  const {
    isDragging,
  } = useDragLayer((monitor: DragLayerMonitor) => ({
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
        <CustomNodeBase
          id={id}
          data={data}
          isOver={Boolean(isOver || isOverCurrent)}
          isDragging={isDragging}
        />
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
