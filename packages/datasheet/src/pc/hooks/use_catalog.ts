import { useRequest } from 'pc/hooks';

import {
  IReduxState, StoreActions, Selectors,
  ConfigConstant, t, Strings, ResourceIdPrefix
} from '@apitable/core';
import { useSelector, useDispatch } from 'react-redux';
import { useCatalogTreeRequest } from './use_catalogtree_request';
import { getPropertyByTree } from 'pc/utils';

export enum NodeChangeInfoType {
  Create = 'nodeCreate',
  Update = 'nodeUpdate',
  Move = 'nodeMove',
  Delete = 'nodeDelete',
  UpdateRole = 'nodeUpdateRole',
  Share = 'nodeShare',
  Favorite = 'nodeFavorite',
}

export const useCatalog = () => {
  const { treeNodesMap, rootId, expandedKeys, editNodeId } = useSelector((state: IReduxState) => state.catalogTree);
  const activeNodeId = useSelector(state => Selectors.getNodeId(state));
  const { addNodeReq } = useCatalogTreeRequest();
  const dispatch = useDispatch();
  const { run: addNode, loading: addNodeLoading } = useRequest(addNodeReq, { manual: true });

  const checkRepeat = (nodeId: string, str: string, type?: number): boolean => {
    const parentNodeId = treeNodesMap[nodeId].parentId;
    const names = getPropertyByTree(treeNodesMap, parentNodeId, [editNodeId], 'nodeName');
    if (type) {
      const types = getPropertyByTree(treeNodesMap, parentNodeId, [editNodeId], 'type');
      return ((names.filter((item, index) => item === str && types[index] === type).length >= 1));
    }
    return names.filter(item => item === str).length >= 1;
  };

  const addTreeNode = (
    parentNodeId?: string,
    type: ConfigConstant.NodeType = ConfigConstant.NodeType.DATASHEET,
    extra?: { [key: string]: any },
    nodeName?: string) => {
    if (addNodeLoading) { return; }
    if (!parentNodeId) {
      parentNodeId = activeNodeId ? treeNodesMap[activeNodeId].parentId : rootId;
    }
    if (parentNodeId !== rootId) {
      dispatch(StoreActions.setExpandedKeys([...expandedKeys, parentNodeId]));
    }
    const childNodes = treeNodesMap[parentNodeId]?.children || [];
    if (!nodeName && type === ConfigConstant.NodeType.FORM) {
      const existForm = childNodes.reduce((acc, item) => {
        if (item.startsWith(ResourceIdPrefix.Form)) {
          return acc + 1;
        }
        return acc;
      }, 0);
      nodeName = existForm ? `${t(Strings.view_form)}${existForm + 1}` : t(Strings.view_form);
    }
    addNode(parentNodeId, type, nodeName, undefined, extra);
  };

  return {
    addTreeNode,
    checkRepeat,
  };
};
