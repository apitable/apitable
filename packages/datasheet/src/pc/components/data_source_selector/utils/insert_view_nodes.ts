import * as React from 'react';
import { ConfigConstant, ViewType } from '@apitable/core';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';

export const insertViewNode = ({
  currentMeta, nodes, currentDatasheetId, localDispatch,
}: Pick<ISearchPanelState, 'currentMeta' | 'nodes' | 'currentDatasheetId'> & {
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>
}) => {
  if (!currentMeta || !nodes.length) return;

  const views = currentMeta.views;
  const viewNodes = views
    .filter(view => {
      return view.type === ViewType.Grid;
    })
    .map(({ id, name, type, columns }) => ({
      nodeId: id,
      nodeName: name,
      type: ConfigConstant.NodeType.VIEW,
      viewType: type,
      columns,
    }));
  const tempNodes = nodes.filter(node => node.type !== ConfigConstant.NodeType.VIEW);
  const index = tempNodes.findIndex(node => node.nodeId === currentDatasheetId);
  tempNodes.splice(index + 1, 0, ...viewNodes);
  localDispatch({ nodes: tempNodes });
  if (viewNodes.length) {
    localDispatch({
      currentViewId: viewNodes[0].nodeId,
    });
  }
  localDispatch({
    loading: false,
  });
};
