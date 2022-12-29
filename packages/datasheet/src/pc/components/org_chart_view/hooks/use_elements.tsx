import { IFieldMap, ISnapshot, IViewRow, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import {
  getRenderData, IRenderData,
} from '../utils';
import { CARD_WIDTH, NodeType } from '../constants';
import { getRecordName } from 'pc/components/expand_record';
import styles from '../styles.module.less';
import { IDegree, IEdge, IDegrees, IAdj, IGraphData, INode, INodeStateMap } from '../interfaces';
import { useCreation } from 'ahooks';

export const useElements = (props: {
  fieldMap: IFieldMap;
  getCardHeight: (recordId: string | null) => number;
  nodeStateMap: INodeStateMap;
  rows,
  datasheetId: string;
  linkFieldId: string;
  primaryFieldId: string;
  snapshot: ISnapshot;
  fieldVisible: boolean;
  fieldEditable: boolean;
  horizontal: boolean;
}): IRenderData => {

  const {
    fieldMap,
    getCardHeight,
    nodeStateMap,
    rows,
    datasheetId,
    linkFieldId,
    primaryFieldId,
    snapshot,
    fieldVisible,
    fieldEditable,
    horizontal,
  } = props;

  return useCreation(() => {
    const state = store.getState();

    const otherEdges: IEdge[] = [];
    const degrees: IDegrees = {};
    const adj: IAdj = {};

    rows.forEach((row) => {
      degrees[row.recordId] = {
        degree: 0,
        inDegree: 0,
        outDegree: 0,
      };

      const linkIds = Selectors.getCellValue(
        state,
        snapshot,
        row.recordId,
        linkFieldId
      ) || [];

      adj[row.recordId] = linkIds;
    });

    const baseHeight = rows.length && getCardHeight(rows[0].recordId) - 16;
    const data = rows.reduce(
      (graph, row: IViewRow) => {
        let linkIds = adj[row.recordId];
        if (!Array.isArray(linkIds)) {
          linkIds = [];
        }
        const firstCellValue = Selectors.getCellValue(
          state,
          snapshot,
          row.recordId,
          primaryFieldId
        );

        const recordName = getRecordName(
          firstCellValue,
          fieldMap[primaryFieldId]
        );

        const cardHeight = baseHeight + (nodeStateMap[row.recordId]?.collapsed ? 24 : 0);
        const node: INode = {
          id: row.recordId,
          data: {
            datasheetId,
            linkIds,
            recordName,
            degree: {} as IDegree,
            parents: [] as INode[],
            width: CARD_WIDTH,
            height: cardHeight,
          },
          width: CARD_WIDTH,
          height: cardHeight,
          size: [CARD_WIDTH, cardHeight],
          position: { x: 0, y: 0 },
        };
        graph.nodes.push(node);
        graph.edges?.push(
          ...linkIds?.map((id) => {
            degrees[row.recordId].degree++;
            degrees[row.recordId].outDegree++;
            degrees[id] && degrees[id].degree++;
            degrees[id] && degrees[id].inDegree++;

            // The information of degree should be read while counting, and if the node entry is greater than 1, then use the dashed line
            if (degrees[id]?.inDegree > 1) {
              otherEdges.push({
                id: `${row.recordId}-${id}`,
                source: row.recordId,
                target: id,
                type: 'bezier',
                sourceHandle: row.recordId,
                targetHandle: id,
                className: styles.bezierEdge,
              });
              return null;
            }

            return {
              id: `${row.recordId}-${id}`,
              source: row.recordId,
              target: id,
              sourceHandle: row.recordId,
              targetHandle: id,
              type: NodeType.CustomEdge,
            };
          }).filter(Boolean)
        );
        return graph;
      },
      { nodes: [], edges: [] } as IGraphData
    );

    const renderData = getRenderData({
      data,
      nodeStateMap,
      degrees,
      otherEdges,
      adj,
      fieldVisible,
      fieldEditable,
      cardHeight: baseHeight,
      horizontal,
    });

    return renderData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, fieldVisible, nodeStateMap, snapshot, linkFieldId, primaryFieldId, fieldMap, datasheetId, horizontal]);
};
