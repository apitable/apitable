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

import { IGraphData, INodesMap, INodeStateMap, IPre } from '../interfaces';

export function markHiddenNodes(params: { data: IGraphData; pre: IPre; nodeStateMap: INodeStateMap; nodesMap: INodesMap }) {
  const { data, pre, nodeStateMap, nodesMap } = params;

  /** bfs
   *  mark hidden nodes
   *  n = nodes.length
   *  time: O(n)
   *  memory: O(n)
   * */
  const vis = {};
  data.nodes.forEach((node) => {
    if (vis[node.id]) {
      return;
    }
    const parent = pre[node.id][0];
    if (parent && nodeStateMap[parent.id]?.collapsed) {
      const queue = [parent];
      vis[parent.id] = true;
      while (queue.length) {
        const cur = queue.shift();
        cur?.data?.linkIds?.forEach((linkId) => {
          const linkNode = nodesMap[linkId];
          linkNode.isHidden = true;
          queue.push(linkNode);
          vis[linkNode.id] = true;
        });
      }
    }
  });
}
