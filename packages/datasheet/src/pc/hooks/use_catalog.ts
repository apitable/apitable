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

import { useDispatch } from 'react-redux';
import { IReduxState, StoreActions, Selectors, ConfigConstant, t, Strings, ResourceIdPrefix } from '@apitable/core';
import { useRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getPropertyByTree } from 'pc/utils';
import { useCatalogTreeRequest } from './use_catalogtree_request';

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
  const {
    treeNodesMap, rootId, expandedKeys, editNodeId,
    privateTreeNodesMap, privateEditNodeId
  } = useAppSelector((state: IReduxState) => state.catalogTree);
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const catalogTreeActiveType = useAppSelector((state) => state.catalogTree.activeType);
  const isPrivate = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE;
  const nodesMap = isPrivate ? privateTreeNodesMap : treeNodesMap;
  const userUnitId = useAppSelector((state) => state.user.info?.unitId);
  const { addNodeReq } = useCatalogTreeRequest();
  const dispatch = useDispatch();
  const { run: addNode, loading: addNodeLoading } = useRequest(addNodeReq, { manual: true });

  const checkRepeat = (nodeId: string, str: string, type?: number): boolean => {
    const _editNodeId = isPrivate ? privateEditNodeId : editNodeId;
    const parentNodeId = nodesMap[nodeId].parentId;
    const names = getPropertyByTree(nodesMap, parentNodeId, [_editNodeId], 'nodeName');
    if (type) {
      const types = getPropertyByTree(nodesMap, parentNodeId, [_editNodeId], 'type');
      return names.filter((item, index) => item === str && types[index] === type).length >= 1;
    }
    return names.filter((item) => item === str).length >= 1;
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
      parentNodeId = activeNodeId ? nodesMap[activeNodeId].parentId : rootId;
    }
    if (parentNodeId !== rootId) {
      dispatch(StoreActions.setExpandedKeys([...expandedKeys, parentNodeId], catalogTreeActiveType));
    }
    const childNodes = nodesMap[parentNodeId]?.children || [];
    if (type === ConfigConstant.NodeType.FORM) {
      if (!nodeName) {
        const existForm = childNodes.reduce((acc, item) => {
          if (item.startsWith(ResourceIdPrefix.Form)) {
            return acc + 1;
          }
          return acc;
        }, 0);
        nodeName = existForm ? `${t(Strings.view_form)}${existForm + 1}` : t(Strings.view_form);
      }
    } else if (type === ConfigConstant.NodeType.DATASHEET) {
      extra = { viewName: t(Strings.default_view) };
    } else if (type === ConfigConstant.NodeType.AI) {
      // nodeName = t(Strings.ai_new_chatbot);
    }
    const unitId = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE ? userUnitId : undefined;
    addNode(parentNodeId, type, nodeName, undefined, extra, unitId);
  };

  return {
    addTreeNode,
    checkRepeat,
  };
};
