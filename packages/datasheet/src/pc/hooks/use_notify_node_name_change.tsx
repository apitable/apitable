import { Api, IReduxState } from '@apitable/core';
import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const useNotifyNOdeNameChange = () => {
  const nodeId = useSelector(state => {
    return state.pageParams.nodeId;
  });

  const { socketData, spaceId, treeNodesMap } =
    useSelector((state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      socketData: state.catalogTree.socketData,
      spaceId: state.space.activeId,
    }), shallowEqual);

  useEffect(() => {
    if (!socketData) return;
    if (!nodeId) return;
    if (socketData.type !== 'nodeUpdate') return;
    if (socketData.spaceId !== spaceId) return;

    const socketNodeId = socketData.data.nodeId;

    if (!socketNodeId || socketNodeId !== nodeId) return;

    Api.getNodeInfo(nodeId).then(res => {
      const { data } = res.data;
      const nodeInfo = data[0];

      if (nodeInfo.nodeName === treeNodesMap[nodeId].nodeName) return;

      window.parent.postMessage({
        message: 'changeNodeName', data: {
          roomId: nodeId,
          nodeName: nodeInfo.nodeName
        }
      }, '*');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData]);
};
