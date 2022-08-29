import { ISetRecordOptions, moveArrayElement } from '@vikadata/core';
import { Handle, NodeProps, Position } from '@vikadata/react-flow-renderer';
import classNames from 'classnames';
import { without } from 'lodash';
import { DragNodeType, GHOST_NODE_SIZE } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import useRafState from 'pc/components/org_chart_view/hooks/use_raf_state';
import { IDragItem, INodeData } from 'pc/components/org_chart_view/interfaces';
import { FC, memo, useContext } from 'react';
import { useDragLayer, DragLayerMonitor } from 'react-dnd';
import { DropWrapper } from '../../drop_wrapper';
import styles from '../styles.module.less';

export const GhostNode: FC<NodeProps<INodeData>> = memo((props) => {

  const {
    id,
    data,
    sourcePosition,
    targetPosition,
  } = props;

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

  const {
    dragItem,
  } = useDragLayer((monitor: DragLayerMonitor) => ({
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

  const visible = (
    nodeVisible && 
    dragItem && 
    overGhostRef.current?.id === id && 
    !overGhostRef.current?.id.includes(dragItem.id) && 
    !isParent(dragItem.id)
  );

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
       * 分 3 种情况:
       * 1. 未处理列表节点插入
       * 2. 跨层级节点插入
       * 3. 同级节点间插入
       */
      if (!dragItemParent) {
        newData.push(insertData);
      } else if (dragItemParent.id !== parent.id) {
        newData.push(insertData);
        // 断开旧的连接
        // FIXME: 多人协同的情况下,这里可能拿不到最新的祖先信息
        newData.push({
          recordId: dragItemParent.id,
          fieldId: linkFieldId,
          value: without(dragItemParent.data.linkIds, dragItem.id),
        });
      } else {
        const dragIndex = parent.data.linkIds.findIndex(linkId => linkId === dragItem.id);
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
          className={classNames(
            styles.ghost, 
            horizontal && styles.horizontal
          )}
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
