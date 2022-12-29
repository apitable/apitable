import { IGraphData, INodesMap, INodeStateMap, IPre } from '../interfaces';

export function markHiddenNodes(params: {
  data: IGraphData;
  pre: IPre;
  nodeStateMap: INodeStateMap;
  nodesMap: INodesMap;
}) {

  const {
    data,
    pre,
    nodeStateMap,
    nodesMap,
  } = params;

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