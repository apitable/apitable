import {
  CollaCommandManager, ComputeRefManager, Engine, IError, IJOTAction, IReduxState, IResourceOpsCollect, OPEventManager, ResourceType
} from 'core';
import { Store } from 'redux';

export interface IResourceService {
  init (): void;
  createCollaEngine (resourceId: string, resourceType: ResourceType): boolean;
  socket: SocketIOClient.Socket;
  commandManager: CollaCommandManager;
  opEventManager: OPEventManager;
  computeRefManager: ComputeRefManager;
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
