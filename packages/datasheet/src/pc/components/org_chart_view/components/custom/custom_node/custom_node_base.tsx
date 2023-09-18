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
import { FC, memo, useContext, useEffect, useState } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { RecordCard } from '../../../../record_card';
import { CARD_WIDTH, COVER_HEIGHT, DragNodeType, RANKSEP, SHOW_EPMTY_COVER, SHOW_EPMTY_FIELD } from '../../../constants';
import { FlowContext } from '../../../context/flow_context';
import { INode, INodeData } from '../../../interfaces';
import { addRecord } from '../../record_list';
import styles from '../styles.module.less';
import { Bottom } from './bottom';
import { QuickAdd } from './quick_add';

interface ICustomNodeBase {
  id: string;
  data: INodeData;
  isOver: boolean;
  isDragging: boolean;
}

export const CustomNodeBase: FC<React.PropsWithChildren<ICustomNodeBase>> = memo((props) => {
  const { id, data, isOver } = props;

  const { linkIds, height } = data;

  const {
    nodeStateMap,
    orgChartStyle,
    columns,
    fieldEditable,
    currentSearchCell,
    quickAddRecId,
    nodesMap,
    setNodeStateMap,
    onChange,
    setQuickAddRecId,
    viewId,
    rowsCount,
    horizontal,
    datasheetId,
  } = useContext(FlowContext);

  const [childId] = linkIds;
  const curNode = nodesMap[id];
  const childNode = (childId && nodesMap[childId]) as INode;

  const getQuickAddSize = () => {
    const valid = Boolean(curNode && childNode && curNode.position && childNode.position);

    if (horizontal) {
      return {
        width: valid ? childNode.position.x - curNode.position.x - CARD_WIDTH : RANKSEP,
        height,
      };
    }
    return {
      width: CARD_WIDTH,
      height: (valid ? childNode.position.y - curNode.position.y - height : RANKSEP) - 2,
    };
  };

  const { coverFieldId, isCoverFit, isColNameVisible } = orgChartStyle;

  const [{ isDragging }, dragRef, preview] = useDrag(
    () => ({
      type: DragNodeType.RENDER_NODE,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: {
        id,
        data,
        type: DragNodeType.RENDER_NODE,
      },
    }),
    [data],
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const { linkFieldId } = orgChartStyle;

  const toggleNodeCollapse = (id: string) => {
    setNodeStateMap((s) => ({
      ...s,
      [id]: {
        ...s?.[id],
        collapsed: !s?.[id]?.collapsed,
      },
    }));
  };

  const [entered, setEntered] = useState(false);

  const handleQuickAddClick = async () => {
    const newRecordId = await addRecord(viewId, rowsCount, false);
    onChange([
      {
        recordId: id,
        fieldId: linkFieldId,
        value: [...linkIds, newRecordId!],
      },
    ]);
    if (nodeStateMap?.[id]?.collapsed) {
      toggleNodeCollapse(id);
    }
    setQuickAddRecId(newRecordId!);
    setEntered(false);
  };

  const collapseVisible = nodeStateMap?.[id]?.collapsed && linkIds.length > 0;

  return (
    <div
      onMouseEnter={() => {
        setEntered(true);
      }}
      onMouseLeave={() => {
        setEntered(false);
      }}
      style={{
        position: 'relative',
      }}
    >
      <div ref={fieldEditable ? dragRef : undefined}>
        <RecordCard
          className={classNames(styles.outer, {
            [styles.canDrop]: isOver,
            [styles.isDragging]: isDragging,
            [styles.highlight]: currentSearchCell === id,
            [styles.hover]: quickAddRecId === id,
          })}
          datasheetId={datasheetId}
          showEmptyCover={SHOW_EPMTY_COVER}
          coverFieldId={coverFieldId}
          showEmptyField={SHOW_EPMTY_FIELD}
          multiTextMaxLine={4}
          coverHeight={COVER_HEIGHT}
          cardWidth={CARD_WIDTH}
          isCoverFit={isCoverFit}
          isColNameVisible={isColNameVisible}
          recordId={id}
          visibleFields={columns}
          isGallery
        />
      </div>

      {collapseVisible && <Bottom id={id} linkIds={linkIds} />}
      {!collapseVisible && !isDragging && (
        <QuickAdd
          entered={entered}
          setEntered={setEntered}
          id={id}
          style={{
            ...getQuickAddSize(),
          }}
          onClick={handleQuickAddClick}
        />
      )}
    </div>
  );
});

CustomNodeBase.displayName = 'CustomNodeBase';
