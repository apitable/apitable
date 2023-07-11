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

import { useRequest } from 'pc/hooks';

import {
  IReduxState, StoreActions, Selectors,
  ConfigConstant, t, Strings, ResourceIdPrefix,
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
    nodeName?: string,
  ) => {
    if (addNodeLoading) {
      return;
    }
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
    if (type === ConfigConstant.NodeType.DATASHEET) {
      extra = { viewName: t(Strings.default_view) };
    }
    addNode(parentNodeId, type, nodeName, undefined, extra);
  };

  return {
    addTreeNode,
    checkRepeat,
  };
};
