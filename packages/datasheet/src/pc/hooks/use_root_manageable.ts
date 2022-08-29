import { useSelector } from 'react-redux';

export function useRootManageable(): {
  rootManageable: boolean;
  isRootNodeId: (nodeId: string) => boolean;
  } {
  const spacePermissions = useSelector(
    (state) => state.spacePermissionManage.spaceResource?.permissions
  );
  const isSpaceAdmin =
    spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  const spaceFeatures = useSelector((state) => state.space.spaceFeatures);
  const rootManageable = Boolean(isSpaceAdmin || spaceFeatures?.rootManageable);

  const rootId = useSelector((state) => state.catalogTree.rootId);
  const topLevelIds = useSelector(
    (state) => state.catalogTree.treeNodesMap[rootId]?.children || []
  );

  const isRootNodeId = (nodeId: string) => topLevelIds.includes(nodeId);

  return {
    rootManageable,
    isRootNodeId,
  };
}
