import { CARD_WIDTH, NodeType, GHOST_NODE_SIZE } from '../constants';
import { IAdj, IEdge, INode, INodesMap } from '../interfaces';

export function createGhostNodes(params: {
  adj: IAdj;
  nodesMap: INodesMap;
  cardHeight: number;
  horizontal: boolean;
}) {

  const {
    adj,
    nodesMap,
    cardHeight,
    horizontal,
  } = params;

  const ghostWrapperSize = GHOST_NODE_SIZE;

  const createGhostNode = (cur: INode, next: INode, horizontal: boolean, index: number, size: number) => {
    if (horizontal) {
      if (index === 0 && cur === next) {
        return {
          id: `none-${cur.id}`,
          position: {
            x: cur.position.x,
            y: cur.position.y - (ghostWrapperSize),
          },
          style: {
            width: CARD_WIDTH,
            height: ghostWrapperSize,
            pointerEvents: 'none',
            // paddingBottom: BASE_PADDING,
          },
          data: {
            recordName: `none-${cur.data.recordName}`,
            parents: cur.data.parents,
          },
          type: NodeType.GhostNode,
        } as INode;
      }

      if (index === size - 1) {
        return {
          id: `${cur.id}-none`,
          position: {
            x: cur.position.x,
            y: cur.position.y + cardHeight,
          },
          style: {
            width: CARD_WIDTH,
            height: ghostWrapperSize,
            pointerEvents: 'none',
            // paddingTop: BASE_PADDING,
          },
          data: {
            recordName: `${cur.data.recordName}-none`,
            parents: cur.data.parents,
          },
          type: NodeType.GhostNode,

        } as INode;

      }

      return {
        id: `${cur.id}-${next.id}-ghost`,
        position: {
          x: cur.position.x,
          y: cur.position.y + cardHeight,
        },
        style: {
          width: CARD_WIDTH,
          height: next.position.y - cur.position.y - cardHeight,
          pointerEvents: 'none',
        },
        data: {
          recordName: `${cur.data.recordName}-${next.data.recordName}`,
          parents: nodesMap[cur.id].data.parents,
        },
        type: NodeType.GhostNode

      } as INode;
    }

    if (index === 0 && cur === next) {

      return {
        id: `none-${cur.id}`,
        position: {
          x: cur.position.x - (ghostWrapperSize),
          y: cur.position.y,
        },
        style: {
          width: ghostWrapperSize,
          height: cardHeight,
          pointerEvents: 'none',
          // paddingRight: BASE_PADDING,
        },
        data: {
          recordName: `none-${cur.data.recordName}`,
          parents: cur.data.parents,
        },
        type: NodeType.GhostNode

      } as INode;
    }

    if (index === size - 1) {
      return {
        id: `${cur.id}-none`,
        position: {
          x: cur.position.x + CARD_WIDTH,
          y: cur.position.y,
        },
        style: {
          width: ghostWrapperSize,
          height: cardHeight,
          pointerEvents: 'none',
          // paddingLeft: BASE_PADDING,
        },
        data: {
          recordName: `${cur.data.recordName}-none`,
          parents: cur.data.parents,
        },
        type: NodeType.GhostNode

      } as INode;
    }

    return {
      id: `${cur.id}-${next.id}-ghost`,
      position: {
        x: cur.position.x + CARD_WIDTH,
        y: cur.position.y,
      },
      style: {
        width: next.position.x - cur.position.x - CARD_WIDTH,
        height: cardHeight,
        pointerEvents: 'none',
      },
      data: {
        recordName: `${cur.data.recordName} - ${next.data.recordName}`,
        parents: nodesMap[cur.id].data.parents,
      },
      type: NodeType.GhostNode,
    } as INode;
  };

  const {
    ghostNodes,
    ghostEdges,
  } = Object.keys(adj).filter(id => adj[id].length >= 1).reduce((prev, id) => {
    adj[id].forEach((linkId, index) => {
      const cur = nodesMap[linkId];
      const nextId = adj[id][index + 1];
      const next = nodesMap[nextId];
      const isLastCursor = index === adj[id].length - 1;

      if (!cur || cur?.isHidden || (!next && !isLastCursor)) {
        return;
      }

      if (isLastCursor) {
        const lastGhostNode = createGhostNode(cur, next, horizontal, index, adj[id].length);
        prev.ghostNodes.push(lastGhostNode);
        prev.ghostEdges.push({
          id: `${id}-${lastGhostNode.id}-ghost`,
          source: id,
          target: lastGhostNode.id,
          type: NodeType.GhostEdge,
        } as IEdge);
        return;
      }

      const ghostNode = createGhostNode(cur, next, horizontal, index, adj[id].length);

      const ghostEdge = {
        id: `${id}-${ghostNode.id}-ghost`,
        source: id,
        target: ghostNode.id,
        type: NodeType.GhostEdge,
      } as IEdge;
      prev.ghostEdges.push(ghostEdge);
      prev.ghostNodes.push(ghostNode);
    });

    const firstNode = nodesMap[adj[id][0]];

    if (firstNode && !firstNode.isHidden) {
      const firstGhostNode = createGhostNode(firstNode, firstNode, horizontal, 0, 1);
      prev.ghostNodes.push(firstGhostNode);
      prev.ghostEdges.push({
        id: `${id}-${firstNode.id}-ghost`,
        source: id,
        target: firstGhostNode.id,
        type: NodeType.GhostEdge,
      } as IEdge);

    }

    return prev;
  }, { ghostNodes: [] as INode[], ghostEdges: [] as IEdge[] });

  return {
    ghostNodes,
    ghostEdges,
  };
}