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

import { lightColors } from '@apitable/components';
import { ArrowHeadType, Elements } from '@apitable/react-flow';
import { CYCLE_NODE_WIDTH, CYCLE_NODE_HEIGHT, NodeType } from '../constants';
import { IAdj, INodesMap, INode } from '../interfaces';

export function getCycleElements(params: { adj: IAdj; nodesMap: INodesMap; cycle: Array<string> }) {
  const { adj, nodesMap, cycle } = params;

  const els = cycle.slice(0, -1);
  const cycleElements: Elements = els.map((id, index) => ({
    id,
    position: {
      x: 400,
      y: index * 80 + 200,
    },
    type: NodeType.CycleNode,
    data: {
      recordName: nodesMap[id].data.recordName,
      linkIds: adj[id],
    },
    style: {
      width: CYCLE_NODE_WIDTH,
      height: CYCLE_NODE_HEIGHT,
      cursor: 'default',
    },
  }));

  els.forEach((id, index) => {
    const isLast = index + 1 > els.length - 1;
    const target = els[isLast ? 0 : index + 1];
    cycleElements.push({
      id: `${id}-${target}`,
      source: id,
      target: target,
      type: isLast ? NodeType.CustomCycleEdge : 'straight',
      style: {
        stroke: lightColors.primaryColor,
        fill: 'none',
        strokeWidth: 2,
      },
      arrowHeadType: isLast ? ArrowHeadType.Arrow : undefined,
    });
  });

  return {
    initialElements: [] as INode[],
    unhandledNodes: [] as INode[],
    cycleElements: cycleElements as INode[],
    nodesMap,
    handlingCount: 0,
    pre: {},
    bounds: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };
}
