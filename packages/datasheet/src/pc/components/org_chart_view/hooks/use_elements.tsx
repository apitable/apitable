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

import { useCreation } from 'ahooks';
import { IFieldMap, ISnapshot, IViewRow, Selectors } from '@apitable/core';
import { Edge } from '@apitable/react-flow';
import { getRecordName } from 'pc/components/expand_record';
import { store } from 'pc/store';
import { CARD_WIDTH, NodeType } from '../constants';
import { IDegree, IEdge, IDegrees, IAdj, IGraphData, INode, INodeStateMap } from '../interfaces';
import styles from '../styles.module.less';
import { getRenderData, IRenderData } from '../utils';

export const useElements = (props: {
  fieldMap: IFieldMap;
  getCardHeight: (recordId: string | null) => number;
  nodeStateMap: INodeStateMap;
  rows: IViewRow[];
  datasheetId: string;
  linkFieldId: string;
  primaryFieldId: string;
  snapshot: ISnapshot;
  fieldVisible: boolean;
  fieldEditable: boolean;
  horizontal: boolean;
}): IRenderData => {
  const { fieldMap, getCardHeight, nodeStateMap, rows, datasheetId, linkFieldId, primaryFieldId, snapshot, fieldVisible, fieldEditable, horizontal } =
    props;

  return useCreation(() => {
    const state = store.getState();

    const otherEdges: IEdge[] = [];
    const degrees: IDegrees = {};
    const adj: IAdj = {};

    rows.forEach((row: any) => {
      degrees[row.recordId] = {
        degree: 0,
        inDegree: 0,
        outDegree: 0,
      };

      const linkIds = Selectors.getCellValue(state, snapshot, row.recordId, linkFieldId) || [];

      adj[row.recordId] = linkIds;
    });

    const baseHeight = rows.length && getCardHeight(rows[0].recordId) - 16;
    const data = rows.reduce(
      (graph: any, row: IViewRow) => {
        let linkIds = adj[row.recordId];
        if (!Array.isArray(linkIds)) {
          linkIds = [];
        }
        const firstCellValue = Selectors.getCellValue(state, snapshot, row.recordId, primaryFieldId);

        const recordName = getRecordName(firstCellValue, fieldMap[primaryFieldId]);

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
          ...(linkIds
            ?.map((id) => {
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
            })
            .filter(Boolean) as Edge<any>[]),
        );
        return graph;
      },
      { nodes: [], edges: [] } as IGraphData,
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
    // eslint-disable-next-line
  }, [rows, fieldVisible, nodeStateMap, snapshot, linkFieldId, primaryFieldId, fieldMap, datasheetId, horizontal]);
};
