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

import {
  CollaCommandManager, ComputeRefManager, Engine, IError, IJOTAction, IReduxState, IResourceOpsCollect, OPEventManager, ResourceType
} from 'core';
import { Store } from 'redux';
import { databus } from '@apitable/core';

export interface IResourceService {
  init (): void;
  createCollaEngine (resourceId: string, resourceType: ResourceType): boolean;
  readonly socket: SocketIOClient.Socket;
  /**
   * @deprecated This is a temporary member. All dependencies of CommandManager in the front-end will be removed in the future.
   */
  readonly commandManager: CollaCommandManager;
  readonly currentResource: databus.Datasheet | undefined;
  readonly opEventManager: OPEventManager;
  readonly computeRefManager: ComputeRefManager;
  getCollaEngine(resourceId: string): Engine | undefined;
  destroy(): void;
  reset(resourceId: string, resourceType: ResourceType): void
  getCollaEngineKeys(): IterableIterator<string>
  checkRoomExist(): boolean;
  switchResource(params: { from?: string, to: string, resourceType: ResourceType }): void;
  onNewChanges(resourceType: ResourceType, resourceId: string, actions: IJOTAction[]): any
  applyOperations(
    store: Store<IReduxState>,
    resourceOpsCollects: IResourceOpsCollect[]
  ): void;
}

export type IServiceError = (error: IError, type: 'modal' | 'message' | 'subscribeUsage') => void;
