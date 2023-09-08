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

// https://cses.fi/problemset/task/1678

// @ts-ignore
import dagre from '@futpib/dagre';
import { isNode, Position } from '@apitable/react-flow';
import { CARD_WIDTH, NODESEP, NodeType, RANKSEP } from '../constants';
import { IGraphData, IDegrees, IPre, IEdge, INodesMap, IAdj, INode, INodeStateMap, NodeHandleState, IBounds } from '../interfaces';
import { createGhostNodes } from './create_ghost_nodes';
import { getCycleElements } from './get_cycle_elements';
import { markHiddenNodes } from './mark_hidden_nodes';

// https://www.notion.so/cb051fc572b6462abc2d05ede0eaf91c
export const findCycles = (nodes: Array<string>, adj: IAdj) => {
  const pre: { [key: string]: any } = {};
  const color: { [key: string]: any } = {};

  const cycle: Array<string> = [];

  let found = false;

  Object.keys(adj).forEach((id) => {
    if (found) {
      return;
    }
    adj[id].forEach((child) => {
      if (found) {
        return;
      }
      if (id === child) {
        found = true;
        cycle.push(id);
        cycle.push(child);
        return;
      }
    });
  });

  const buildCycle = (start: string, end: string) => {
    cycle.push(start);
    for (let cur = end; cur !== start; cur = pre[cur]) {
      cycle.push(cur);
    }
    cycle.push(start);
  };

  const dfs = (source: string) => {
    if (found) {
      return;
    }
    color[source] = 1;
    adj[source]?.forEach((target) => {
      if (color[target] == null) {
        pre[target] = source;
        dfs(target);
      } else if (color[target] === 1) {
        found = true;
        buildCycle(target, source);
      }
    });
    color[source] = 2;
  };

  nodes.forEach((node) => {
    if (color[node] == null) {
      dfs(node);
    }
  });

  return cycle.reverse();
};

export const getPre = (data: IGraphData, nodesMap: INodesMap): IPre => {
  const pre: IPre = {};
  const { nodes = [] } = data;
  nodes.forEach((node) => {
    pre[node.id] = [];
  });

  nodes.forEach((node) => {
    const id = node.id;
    const { linkIds } = node.data;
    linkIds.forEach((linkId) => {
      const preNode = nodesMap[id];
      pre[linkId]?.push(preNode);
    });
  });
  return pre;
};

const getBounds = (nodes: INode[]): IBounds => {
  const xs: number[] = [];
  const ys: number[] = [];
  nodes.forEach((node) => {
    xs.push(node.position.x);
    ys.push(node.position.y);
  });
  return {
    left: Math.min(...xs),
    top: Math.min(...ys),
    right: Math.max(...xs),
    bottom: Math.max(...ys),
  };
};

export interface IRenderData {
  initialElements: INode[];
  unhandledNodes: INode[];
  handlingCount: number;
  cycleElements: INode[];
  nodesMap: INodesMap;
  pre: IPre;
  bounds: IBounds;
}

export const getRenderData = (props: {
  data: IGraphData;
  nodeStateMap: INodeStateMap | undefined;
  degrees: IDegrees;
  otherEdges: IEdge[];
  adj: IAdj;
  fieldVisible: boolean;
  fieldEditable: boolean;
  cardHeight: number;
  horizontal: boolean;
}): IRenderData => {
  const { data, nodeStateMap = {}, degrees, otherEdges, adj, fieldVisible, fieldEditable, cardHeight, horizontal } = props;

  const nodesMap: INodesMap = {};

  const DEFAULT_DATA = {
    initialElements: [],
    unhandledNodes: [],
    handlingCount: 0,
    cycleElements: [],
    nodesMap,
    pre: {},
    bounds: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };

  if (data.nodes.length === 0) {
    return DEFAULT_DATA;
  }

  if (!fieldVisible) {
    return {
      ...DEFAULT_DATA,
      unhandledNodes: data.nodes,
    };
  }

  data.nodes.forEach((node) => {
    nodesMap[node.id] = node;
  });

  const cycle = findCycles(
    data.nodes.map((n) => n.id),
    adj,
  );
  if (cycle.length) {
    return getCycleElements({
      nodesMap,
      cycle,
      adj,
    });
  }

  const pre = getPre(data, nodesMap);

  markHiddenNodes({
    data,
    nodeStateMap,
    nodesMap,
    pre,
  });

  const { renderNodes, unhandledNodes, handlingNodes } = data.nodes
    .filter((node) => !nodesMap[node.id].isHidden)
    .reduce(
      (prev, cur) => {
        if (degrees[cur.id].degree === 0) {
          if (nodeStateMap[cur.id]?.handleState === NodeHandleState.Handling) {
            prev.handlingNodes.push(cur);
          } else {
            prev.unhandledNodes.push(cur);
          }
        } else {
          prev.renderNodes.push(cur);
        }
        return prev;
      },
      { renderNodes: [], unhandledNodes: [], handlingNodes: [] } as { renderNodes: INode[]; unhandledNodes: INode[]; handlingNodes: INode[] },
    );

  const renderEdges = (data.edges || []).filter((edge) => !nodesMap[edge.source]?.isHidden && !nodesMap[edge.target]?.isHidden);

  const dagreGraph = new dagre.graphlib.Graph({
    multigraph: true,
    directed: true,
  });

  dagreGraph.setGraph({
    rankdir: horizontal ? 'LR' : 'TB',
    ranksep: RANKSEP,
    nodesep: NODESEP,
  });

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  renderNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: CARD_WIDTH, height: node.height });
  });
  renderEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, {}, edge.id);
  });

  dagre.layout(dagreGraph, {
    disableOptimalOrderHeuristic: true,
  });

  const enhancedNodes = renderNodes.map((node) => {
    const enhancedNode = {
      ...node,
      type: NodeType.CustomNode,
      position: {
        x: dagreGraph.node(node.id).x,
        y: dagreGraph.node(node.id).y,
      },
      style: {
        width: node.width,
        height: node.height,
      },
      data: {
        ...node.data,
        degree: degrees[node.id],
        parents: pre[node.id] || [],
        width: node.width,
        height: node.height,
      },
    };
    nodesMap[node.id] = enhancedNode;
    return enhancedNode;
  });

  const enhancedHandlingNodes = handlingNodes.map((node) => {
    const enhancedHandlingNode = {
      ...node,
      type: NodeType.CustomNode,
      position: {
        x: nodeStateMap[node.id]?.position?.x || 0,
        y: nodeStateMap[node.id]?.position?.y || 0,
      },
      style: {
        width: node.width,
        height: node.height,
      },
      data: {
        ...node.data,
        degree: degrees[node.id],
        parents: pre[node.id] || [],
        width: node.width,
        height: node.height,
      },
    };
    nodesMap[node.id] = enhancedHandlingNode;
    return enhancedHandlingNode;
  });

  let initialElements = [...enhancedNodes, ...enhancedHandlingNodes, ...renderEdges, ...otherEdges] as INode[];

  if (fieldEditable) {
    const { ghostNodes, ghostEdges } = createGhostNodes({
      adj,
      nodesMap,
      cardHeight,
      horizontal,
    });
    initialElements.push(...ghostNodes, ...(ghostEdges as any));
  }

  initialElements = initialElements.map((node) => {
    if (isNode(node)) {
      return {
        ...node,
        sourcePosition: horizontal ? Position.Right : Position.Bottom,
        targetPosition: horizontal ? Position.Left : Position.Top,
      };
    }
    return node;
  });

  return {
    initialElements,
    unhandledNodes,
    handlingCount: handlingNodes.length,
    cycleElements: [] as INode[],
    nodesMap,
    pre,
    bounds: getBounds(initialElements.filter(isNode)),
  };
};
