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

import { ICollaborator, IResourceRevision } from '@apitable/core';

export interface INodeCopyRo {
  /**
   * original node ID
   */
  nodeId: string;
  /**
   * copied node ID
   */
  copyNodeId: string;
  /**
   * reference field IDs that need to be transformed
   */
  fieldIds: string[];
  /**
   * user ID
   */
  userId: string;
  /**
   * uuid
   */
  uuid: string;
}

export interface INodeDeleteRo {
  /**
   * deleted Node ID
   */
  deleteNodeId: string[];
  /**
   * the deleted node's reference node's ID
   */
  linkNodeId: string[];

  /**
   * user ID
   */
  userId: string;
  /**
   * uuid
   */
  uuid: string;
}

export interface IWatchRoomRo {
  roomId: string;
  clientId: string;
  cookie: string;
  socketIds: string[];
  shareId?: string;
}

export interface IWatchRoomVo {
  resourceRevisions: IResourceRevision[];
  collaborators: ICollaborator[];
  collaborator: ICollaborator;
}

export interface ILeaveRoomRo {
  clientId: string;
}
