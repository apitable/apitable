import { FC, memo, useContext } from 'react';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import classNames from 'classnames';
import styles from './styles.module.less';
import { DragNodeType } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import { INode } from 'pc/components/org_chart_view/interfaces';
import { useContextMenu } from '@apitable/components';
import { GRID_RECORD_MENU } from 'pc/components/multi_grid/context_menu/record_menu';

interface IDrag {
  node: INode;
  style?: React.CSSProperties;
}

const DragItemBase: FC<IDrag> = ({ node, style }) => {
  const { id } = node;

  const { 
    unhandledNodes, 
    currentSearchCell,
    fieldEditable,
    linkField,
  } = useContext(FlowContext);

  const canDrag = linkField && fieldEditable;

  const { show } = useContextMenu({
    id: GRID_RECORD_MENU,
  });
  
  const onContextMenu = (e) => {
    show(e, {
      props: {
        recordId: id
      }
    });
  };

  const { recordName } = node.data;

  const [, drag] = useDrag(() => ({
    type: DragNodeType.OTHER_NODE,
    item: {
      id,
      data: node.data,
      type: DragNodeType.OTHER_NODE
    },
    canDrag,
  }), [unhandledNodes, canDrag]);

  return (
    <div
      ref={canDrag ? drag : undefined}
      className={classNames(styles.dragItem, {
        [styles.highlight]: currentSearchCell === id,
      })}
      onClick={() => expandRecordIdNavigate(id)}
      onContextMenu={onContextMenu}
      style={style}
    >
      <div className={styles.cellText}>
        <span style={{ cursor: 'pointer' }}>
          {recordName}
        </span>
      </div>
    </div>
  );
};

export const DragItem = memo(DragItemBase);
