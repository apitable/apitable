import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { Api, ConfigConstant, INodeMeta, IReduxState, StoreActions } from '@apitable/core';
import { useDispatch } from 'pc/hooks/use_dispatch';

import { useAppSelector } from 'pc/store/react-redux';

export const useNotifyNOdeNameChange = () => {
  const dispatch = useDispatch();
  const nodeId = useAppSelector((state) => {
    return state.pageParams.nodeId;
  });

  const { socketData, spaceId, treeNodesMap } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      socketData: state.catalogTree.socketData,
      spaceId: state.space.activeId,
    }),
    shallowEqual,
  );

  // Updating data sources, e.g. directory tree count tables, form data sources
  const updateNodeInfo = (
    nodeId: string,
    nodeType: ConfigConstant.NodeType,
    data: Partial<Omit<INodeMeta, 'name'> & { nodeName?: string; showRecordHistory?: ConfigConstant.ShowRecordHistory }>,
  ) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, data));
    const { nodeName: name, ...info } = data;
    const nodeData = name ? { ...info, name } : info;
    switch (nodeType) {
      case ConfigConstant.NodeType.DATASHEET: {
        dispatch(StoreActions.updateDatasheet(nodeId, nodeData));
        break;
      }
      case ConfigConstant.NodeType.DASHBOARD: {
        dispatch(StoreActions.updateDashboard(nodeId, nodeData));
        break;
      }
    }
  };

  useEffect(() => {
    if (!socketData) return;
    if (!nodeId) return;
    if (socketData.type !== 'nodeUpdate') return;
    if (socketData.spaceId !== spaceId) return;

    const socketNodeId = socketData.data.nodeId;

    if (!socketNodeId || socketNodeId !== nodeId) return;

    Api.getNodeInfo(nodeId).then((res) => {
      const { data } = res.data;
      const nodeInfo = data[0];

      if (nodeInfo.nodeName === treeNodesMap[nodeId].nodeName) return;

      updateNodeInfo(nodeId, treeNodesMap[nodeId].type, nodeInfo);

      window.parent.postMessage(
        {
          message: 'changeNodeName',
          data: {
            roomId: nodeId,
            nodeName: nodeInfo.nodeName,
          },
        },
        '*',
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData]);
};
