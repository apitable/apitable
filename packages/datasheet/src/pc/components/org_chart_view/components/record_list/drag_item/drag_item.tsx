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
import { FC, memo, useContext } from 'react';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { useContextMenu } from '@apitable/components';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { GRID_RECORD_MENU } from 'pc/components/multi_grid/context_menu/record_menu';
import { DragNodeType } from 'pc/components/org_chart_view/constants';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import { INode } from 'pc/components/org_chart_view/interfaces';
import styles from './styles.module.less';

interface IDrag {
  node: INode;
  style?: React.CSSProperties;
}

const DragItemBase: FC<React.PropsWithChildren<IDrag>> = ({ node, style }) => {
  const { id } = node;

  const { unhandledNodes, currentSearchCell, fieldEditable, linkField } = useContext(FlowContext);

  const canDrag = linkField && fieldEditable;

  const { show } = useContextMenu({
    id: GRID_RECORD_MENU,
  });

  const onContextMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    show(e, {
      props: {
        recordId: id,
      },
    });
  };

  const { recordName } = node.data;

  const [, drag] = useDrag(
    () => ({
      type: DragNodeType.OTHER_NODE,
      item: {
        id,
        data: node.data,
        type: DragNodeType.OTHER_NODE,
      },
      canDrag,
    }),
    [unhandledNodes, canDrag],
  );

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
        <span style={{ cursor: 'pointer' }}>{recordName}</span>
      </div>
    </div>
  );
};

export const DragItem = memo(DragItemBase);
