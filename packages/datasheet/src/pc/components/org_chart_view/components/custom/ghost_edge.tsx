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
import { FC, memo, useContext } from 'react';
import { useDragLayer, DragLayerMonitor } from 'react-dnd';
import { useThemeColors } from '@apitable/components';
import { EdgeProps, getSmoothStepPath } from '@apitable/react-flow';
import { FlowContext } from '../../context/flow_context';
import useRafState from '../../hooks/use_raf_state';

export const GhostEdge: FC<React.PropsWithChildren<EdgeProps>> = memo(
  ({ id, source: parentId, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) => {
    const colors = useThemeColors();
    const { overGhostRef, nodesMap, pre } = useContext(FlowContext);

    const edgePath = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const { dragItem } = useDragLayer((monitor: DragLayerMonitor) => ({
      dragItem: monitor.getItem(),
    }));

    const [visible, setVisible] = useRafState(false);

    useMount(() => {
      overGhostRef.current = {
        ...overGhostRef.current,
        setEdgeVisibleFuncsMap: {
          ...overGhostRef.current?.setEdgeVisibleFuncsMap,
          [target]: setVisible,
        },
      };
    });

    const isParent = (dragId: string) => {
      let parent = nodesMap[parentId];
      if (parent?.id === dragId) {
        return true;
      }
      while (parent && pre[parent.id].length >= 1) {
        parent = pre[parent.id][0];
        if (parent.id === dragId) {
          return true;
        }
      }
      return false;
    };

    if (!visible || !dragItem || overGhostRef.current?.id !== target || overGhostRef.current?.id.includes(dragItem.id) || isParent(dragItem.id)) {
      return null;
    }

    return <path id={id} stroke={colors.orange[200]} fill="none" strokeWidth={2} d={edgePath} />;
  },
);
