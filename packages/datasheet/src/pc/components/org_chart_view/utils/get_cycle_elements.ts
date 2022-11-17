import { ArrowHeadType, Elements } from '@apitable/react-flow';
import { lightColors } from '@apitable/components';
import { CYCLE_NODE_WIDTH, CYCLE_NODE_HEIGHT, NodeType } from '../constants';
import { IAdj, INodesMap, INode } from '../interfaces';

export function getCycleElements(params: {
  adj: IAdj;
  nodesMap: INodesMap;
  cycle: Array<string>;
}) {
  const {
    adj,
    nodesMap,
    cycle,
  } = params;

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
    }
  };

}