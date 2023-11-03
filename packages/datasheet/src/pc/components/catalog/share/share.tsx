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

import { FC } from 'react';
import { IReduxState } from '@apitable/core';
import { ShareNode } from '../share_node';

import {useAppSelector} from "pc/store/react-redux";

export interface IShareProps {
  nodeId: string;
  onClose?: () => void;
  isTriggerRender?: boolean;
}

export const Share: FC<React.PropsWithChildren<IShareProps>> = ({ nodeId, onClose, isTriggerRender }) => {
  const treeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  if (!nodeId) {
    return null;
  }
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
      isTriggerRender={isTriggerRender}
    />
  );
};
