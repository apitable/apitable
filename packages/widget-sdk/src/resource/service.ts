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

import { Url } from '@apitable/core';
import {
  CollaCommandManager, ComputeRefManager, Engine, Events, IError, IJOTAction, IOperation, IReduxState, IResourceOpsCollect, OP2Event, OPEventManager,
  OPEventNameEnums, Player, ResourceStashManager, ResourceType, RoomService, Selectors, StoreActions, Strings, t, TrackEvents, UndoManager,
} from 'core';
import { mainWidgetMessage } from 'iframe_message';
import localForage from 'localforage';
import { Store } from 'redux';
import SocketIO from 'socket.io-client';
import lsStore from 'store2';
import { IResourceService, IServiceError } from './interface';

const RECONNECT_DELAY = 2000;

const clientWatchedEvents = [
  OPEventNameEnums.CellUpdated,
  OPEventNameEnums.RecordCreated,
  OPEventNameEnums.RecordCommentUpdated,
  OPEventNameEnums.RecordMetaUpdated,
  OPEventNameEnums.RecordDeleted,
  OPEventNameEnums.RecordUpdated,
  OPEventNameEnums.FieldUpdated,
];
// Apply remote sync over op.
export const remoteActions2Operation = (actions: IJOTAction[]) => {
  // The new changes after the transform are applied by a special operation.
  return { cmd: 'REMOTE_NEW_CHANGES', actions };
};

export class ResourceService implements IResourceService {
  socket!: SocketIOClient.Socket;
  roomService!: RoomService;
  commandManager!: CollaCommandManager;
  initialized?: boolean;
  undoManager!: UndoManager;
  resourceStashManager!: ResourceStashManager;
  opEventManager: OPEventManager;
  computeRefManager: ComputeRefManager;
  reportSocketError = true;
  roomIOClear = true;
  roomLastSendTime?: number;
  firstRoomInit = true;

  constructor(public store: Store<IReduxState>, public onError: IServiceError) {
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: true,
        // enableCombEvent: true, // The client does not need to enable aggregated events.
      },
      // eslint-disable-next-line require-await
      getState: () => {
        return store.getState();
      },
      op2Event: new OP2Event(clientWatchedEvents),
    });
    this.computeRefManager = new ComputeRefManager();
  }

  init() {
    if (this.initialized) {
      console.error('Do not repeat the initialization of the datasheet store.');
      return;
    }
    this.initialized = true;

    this.bindBeforeUnload();
    this.socket = this.createSocket();
    this.commandManager = this.createCommandManager();
    this.resourceStashManager = new ResourceStashManager(this.store, () => {
      return this.roomService;
    });
  }

  destroy() {
    if (!this.initialized) {
      return;
    }
    this.initialized = false;

    this.roomService && Array.from(this.roomService.collaEngineMap.values()).forEach(engine => {
      this.reset(engine.resourceId);
    });

    this.socket && this.socket.removeAllListeners();
    this.socket && this.socket.close();
    this.unBindBeforeUnload();
    this.store.dispatch(StoreActions.setConnected(false));
    this.resourceStashManager.destroy();
  }

  static getResourceFetchAction(resourceType: ResourceType): any {
    switch (resourceType) {
      case ResourceType.Datasheet: {
        return StoreActions.fetchDatasheet;
      }
      case ResourceType.Dashboard: {
        return StoreActions.fetchDashboardPack;
      }
      case ResourceType.Form: {
        return StoreActions.fetchForm;
      }
      case ResourceType.Mirror: {
        return StoreActions.fetchMirrorPack;
      }
      default: {
        // TODO: Error Handling.
        return StoreActions.fetchDatasheet;
      }
    }
  }

  async switchResource(params: { from?: string, to: string, resourceType: ResourceType, extra?: { [key: string]: any } }) {
    console.log('enter datasheet', params);
    const { to, resourceType, extra } = params;
    const allowSwitchRoom = this.allowSwitchRoom();

    allowSwitchRoom && await this.switchRoom(to);

    await this.fetchResource(to, resourceType, false, extra);

    this.createUndoManager(to);
    allowSwitchRoom && await this.roomService.init(this.firstRoomInit);
    this.firstRoomInit = false;
  }

  fetchResource(to: string, resourceType: ResourceType, overWrite = false, extra?: { [key: string]: any }) {
    return new Promise<void>((resolve, reject) => {
      const fetchAction = ResourceService.getResourceFetchAction(resourceType);
      this.store.dispatch(fetchAction(to, () => {
        resolve();
      }, overWrite, extra, () => reject()) as any);
    });
  }

  applyOperations(
    store: Store<IReduxState>,
    resourceOpsCollects: IResourceOpsCollect[],
  ) {
    const changesets = resourceOpsCollects;
    const events = this.opEventManager.handleChangesets(changesets);
    this.opEventManager.handleEvents(events, true);
    changesets.forEach(changeset => {
      const { resourceType, operations, resourceId } = changeset;
      if (resourceType === ResourceType.Datasheet || resourceType === ResourceType.Widget) {
        mainWidgetMessage?.enable && mainWidgetMessage.syncOperations(operations, resourceType, resourceId);
      }
      // console.log('================= apply jot start ================');
      store.dispatch(StoreActions.applyJOTOperations(operations, resourceType, resourceId));
      // console.log('================= apply jot end ================');
    });
    // To widget synchronization operations.
    this.opEventManager.handleEvents(events, false);
  }

  /**
   * @description Simply handle the creation and destruction of rooms, and the creation of undoManager.
   * The point of this method is that it is the same as opening a datasheet,
   * but the concept of destroying/creating a room cannot exist in the "template", so this method is more pure,
   * only call when the concept of room is met.
   * @param {string} to
   * @returns {Promise<void>}
   * @private
   */
  private async switchRoom(to: string) {
    /**
     * Special handling for form, from form to datasheet, there may not be room.
     */
    const collaEngineMap = this.roomService ? await this.roomService.leaveRoom() : undefined;
    // Create a new room.
    this.roomService = new RoomService(
      RoomService.createRoomId(to),
      this.socket,
      () => this.socket.connected,
      this.store,
      collaEngineMap,
      {
        onError: (error: IError, type: 'modal' | 'subscribeUsage' = 'modal') => this.onError(error, type),
        destroy: () => this.destroy(),
        getRoomIOClear: () => {
          return this.roomIOClear;
        },
        setRoomIOClear: (status: boolean) => {
          return this.roomIOClear = status;
        },
        getRoomLastSendTime: () => {
          return this.roomLastSendTime;
        },
        setRoomLastSendTime: () => {
          this.roomLastSendTime = Date.now();
        },
      },
      this.fetchResource,
      lsStore,
      localForage,
    );
  }

  /**
   * @description undoManger is bound to the main resource that created the room,
   * and when switching the resource, it is necessary to instantiate undoManager,
   * and bind undoManger to commandManager.
   * @param {string} resourceId
   */
  createUndoManager(resourceId: string) {
    const undoManager = this.resourceStashManager.getUndoManager(resourceId);
    this.undoManager = undoManager;
    undoManager.setCommandManger(this.commandManager);
    this.commandManager.addUndoStack = (cmd, result, executeType) => {
      const collaEngine = this.getCollaEngine(result.resourceId);
      if (!collaEngine) {
        throw new Error(t(Strings.error_not_initialized_datasheet_instance));
      }
      undoManager.addUndoStack({ cmd, result }, executeType);
    };
  }

  /**
   * @description Determine if the current operation is taking place "in the template",
   * no resource in the template needs to create/destroy the room.
   * @returns {boolean}
   * @private
   */
  private allowSwitchRoom() {
    const state = this.store.getState();
    return !state.pageParams.templateId;
  }

  private createSocket() {
    const state = this.store.getState();
    const spaceId = state.space.activeId || state.share.spaceId;
    const version = window['__initialization_data__'].version;
    const socket = SocketIO(Url.WEBSOCKET_NAMESPACE,
      {
        path: Url.ROOM_PATH,
        transports: ['websocket'],
        secure: true,
        query: {
          version,
          spaceId,
        },
      });
    socket.on('disconnect', (reason: any) => {
      console.warn('! ' + 'socket disconnect from server');
      // Player.doTrigger(Events.app_error_logger, { error: new Error('socket disconnect reason: ' + reason) });

      this.store.dispatch(StoreActions.setReconnecting(true));
      this.roomService.setConnected(false);
      let count = 1;

      const interval = window.setInterval(async() => {
        if (socket.connected) {
          clearInterval(interval);
          await this.roomService.watch();
          this.roomService.setConnected(true);
          this.store.dispatch(StoreActions.setReconnecting(false));
          console.log('connected');
          return;
        }
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
          console.warn('! ' + `room attempt to reconnect ${count++} ...`);
        }
      }, RECONNECT_DELAY);
    });

    socket.on('connect', () => {
      this.reportSocketError = true;
      this.store.dispatch(StoreActions.setConnected(true));
    });

    socket.on('connect_error', () => {
      if (!this.reportSocketError) {
        return;
      }
      this.reportSocketError = false;
      // Player.doTrigger(Events.app_error_logger, { error: new Error('socket has happened some error: ' + JSON.stringify(error)) });
    });
    return socket;
  }

  getCollaEngine(resourceId: string) {
    return this.roomService.collaEngineMap.get(resourceId);
  }

  // The operations generated by the application command, that is, the locally generated op.
  // If a command operates on data from multiple datasheet (associated fields), this will be called multiple times
  localOperationDispatch = (resourceOpsCollects: IResourceOpsCollect[]) => {
    resourceOpsCollects.forEach((resourceOpsCollect) => {
      const { resourceId, operations } = resourceOpsCollect;
      const collaEngine = this.getCollaEngine(resourceId);
      if (!collaEngine) {
        throw new Error(t(Strings.error_not_initialized_datasheet_instance));
      }
      operations.forEach((operation) => {
        Player.doTrigger(Events.app_tracker, {
          name: TrackEvents.Operation,
          props: {
            cmd: operation.cmd,
            actionsLength: operation.actions.length,
          },
        });
      });
    });
    this.applyOperations(this.store, resourceOpsCollects);
  };

  /**
   * @desc The method that applies command to generate an op, which is passed in as a callback function when the CommandManager is initialized.
   * This method is responsible for only two things.
   * 1. Apply the op generated by command to the local.
   * 2. Send op to intermediate layer via socket.
   * @param resourceOpsCollects
   */
  operationExecuted = (resourceOpsCollects: IResourceOpsCollect[]) => {
    this.localOperationDispatch(resourceOpsCollects);
    // Collaboration of operations to remote.
    this.roomService.syncOperations(resourceOpsCollects);

    // Send opEvent the op of all datasheets generated by this command.
    // this.opEventManager.handleOperations(resourceOpsCollects
    //   .filter(v => v.resourceType === ResourceType.Datasheet) // Only the datasheet related op needs
    //   .map(v => ({ resourceId: v.resourceId, resourceType: v.resourceType, operations: [v.operation] })), this.store);
  };

  private createCommandManager() {
    return new CollaCommandManager({
      handleCommandExecuted: this.operationExecuted,
      handleCommandExecuteError: (error: IError, type?: 'message' | 'modal' | 'subscribeUsage') => {
        this.onError?.(error, type || 'message');
      },
      getRoomId: () => {
        return this.roomService.roomId;
      },
    }, this.store);
  }

  private beforeUnload = (event: BeforeUnloadEvent): string | void => {
    // To prevent the page from closing when there is still user data that has not been sent to the server.
    if (this.roomService && !this.roomService.isSafeToClose()) {
      if (event) {
        event.returnValue = 'o/';
      }
      return 'o/';
    }
    return;
  };

  private bindBeforeUnload() {
    window.addEventListener('beforeunload', this.beforeUnload);
  }

  private unBindBeforeUnload() {
    window.removeEventListener('beforeunload', this.beforeUnload);
  }

  /**
   * @description 1. delete the resource data on the store;
   * 2. delete the resource from collaEngineMap provided that the engine has issued an op
   * @param {string} resourceId
   */
  reset(resourceId: string) {
    this.roomService.quit(resourceId);
  }

  onNewChanges(resourceType: ResourceType, resourceId: string, actions: IJOTAction[]) {
    console.log('================= change from remote ================');
    return this.applyOperations(this.store, [{
      resourceType,
      resourceId,
      operations: [remoteActions2Operation(actions)],
    }]);
  }

  /**
   * @description Create a collaborative engine (collaEngine) for each resource.
   * @param {string} resourceId
   * @param {ResourceType} resourceType
   * @returns
   */
  createCollaEngine(resourceId: string, resourceType: ResourceType) {
    const collaEngineMap = this.roomService.collaEngineMap;
    if (collaEngineMap.has(resourceId)) {
      return false;
    }
    const engine = new Engine({
      resourceId,
      resourceType,
      getRevision: () => Selectors.getResourceRevision(this.store.getState(), resourceId, resourceType)!,
      getNetworking: () => Selectors.getResourceNetworking(this.store.getState(), resourceId, resourceType)!,
      dispatch: this.store.dispatch,
      getState: this.store.getState,
      lsStore: lsStore,
      event: {
        onError: (error: IError) => {
          this.onError?.(error, 'modal');
        },
        onNewChanges: this.onNewChanges.bind(this),
        onAcceptSystemOperations: (ops: IOperation[]) => this.applyOperations(this.store, [{
          resourceType,
          resourceId,
          operations: ops,
        }]),
        getUndoManager: () => {
          return this.undoManager;
        },
        reloadResourceData: () => {
          return this.fetchResource(resourceId, resourceType, true);
        },
      },
    });
    this.roomService.addCollaEngine(engine);
    return true;
  }

  public getCollaEngineKeys() {
    return this.roomService.collaEngineMap.keys();
  }

  checkRoomExist() {
    return Boolean(this.roomService);
  }
}
