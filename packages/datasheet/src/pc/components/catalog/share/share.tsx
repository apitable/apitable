import { FC } from 'react';
import { IReduxState } from '@vikadata/core';
import { useSelector } from 'react-redux';
import { ShareNode } from '../share_node';

export interface IShareProps {
  nodeId: string;
  onClose: () => void;
}

export const Share: FC<IShareProps> = ({ nodeId, onClose }) => {
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  if (!nodeId) { return null; }
  return (
    <ShareNode
      data={{
        nodeId: nodeId,
        type: treeNodesMap[nodeId]?.type,
        icon: treeNodesMap[nodeId]?.icon,
        name: treeNodesMap[nodeId]?.nodeName,
      }}
      onClose={onClose}
      visible
    />
  );
};
