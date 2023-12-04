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

import { Api } from '../exports/api';
import { IResourceOpsCollect } from 'command_manager/command_manager';
import { ConfigConstant, StatusCode } from 'config';
import { NodeTypeReg } from 'config/constant';
import dayjs from 'dayjs';
import { Engine, ILocalChangeset, IOperation, IRemoteChangeset } from 'engine';
import { BufferStorage, ILocalForage, ILsStore } from 'engine/buffer_storage';
import { Strings, t } from '../exports/i18n';
import { IO } from 'io';
import { keyBy, throttle } from 'lodash';
import { Events, Player } from '../modules/shared/player';
import { AnyAction, Store } from 'redux';
import 'socket.io-client';
import { DEFAULT_FIELD_PERMISSION } from 'modules/shared/store/constants';
import { IResourceRevision } from '../exports/store/interfaces';
import { getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { ICollaborator, IReduxState } from '../exports/store/interfaces';
import { EnhanceError } from 'sync/enhance_error';
import { ErrorCode, IError, ModalType, OnOkType, ResourceType } from 'types';
import { errorCapture, numbersBetween } from 'utils';
import { socketGuard } from 'utils/socket_guard';
import {
  BroadcastTypes, IClientRoomMessage, IEngagementCursorData, IFieldPermissionMessage, INewChangesData, INodeShareDisabledData, ISocketResponseData,
  IWatchResponse, OtErrorCode, SyncRequestTypes,
} from './types';
import {
  fetchFieldPermission,cursorMove,
  deactivateCollaborator,
  resetResource, activeCollaborator, changeResourceSyncingStatus, resetFieldPermissionMap, roomInfoSync, setResourceConnect, updateFieldPermissionMap, updateFieldPermissionSetting,
} from 'modules/database/store/actions/resource';
// The maximum number of data retransmission actions is online, beyond this value, no timeout retry operation will be performed
const MAX_RETRY_LENGTH = 5000;
const VIKA_OP_BACKUP = 'VIKA_OP_BACKUP';

interface IRoomEvent {
  onError?(error: IError): void;
  destroy?: () => void;
  getRoomIOClear: () => boolean;
  setRoomIOClear: (status: boolean) => void;
  getRoomLastSendTime: () => number | undefined;
  setRoomLastSendTime: () => void;
}

/**
 * Room module, responsible for data synchronization in the collaborative room, retry, sending and receiving messages
 * It is not coupled with the resource entity, and the operation of the data entity is handled by CollaEngine
 * 1 Room can manage multiple CollaEngines
 */
export class RoomService {
  collaEngineMap = new Map<string, Engine>();
  event: IRoomEvent;
  private io = new IO(this.roomId, this.socket);
  private sendingWatcherTimer?: any;
  private connected = false;
  backupDB: ILocalForage;

  /**
   * Create a roomId based on the resource main resource ID
   * What is a resource resource, a resource is a summary of data entities,
   * such as a datasheet, a widget, and a dashboard. Their data are collectively referred to as resources
   * The main resource ID generally refers to the node page that the current user mainly accesses, such as the datasheet, dashboard, etc.
   * The main resource may come with multiple other resources, such as an associated table of a table, a widget on a dashboard
   * @param resourceId Resource ID, which can be the ID of entity resources such as datasheetId, DashboardId, WidgetId, etc.
   */
  static createRoomId(resourceId: string) {
    return `${resourceId}`;
  }

  constructor(
    public roomId: string,
    private socket: SocketIOClient.Socket,
    private isConnect: () => boolean,
    private store: Store<IReduxState, AnyAction>,
    collaEngineMap: Map<string, Engine> | undefined,
    event: IRoomEvent,
    private fetchResource: (resourceId: string, resourceType: ResourceType) => Promise<any>,
    public lsStore: ILsStore,
    public localForage: ILocalForage
  ) {
    this.event = event;
    this.backupDB = localForage.createInstance({ name: VIKA_OP_BACKUP });
    if (!collaEngineMap) {
      return;
    }
    collaEngineMap.forEach(engine => {
      this.addCollaEngine(engine);
    });
  }

  /**
   * Add an OT engine responsible for real-time collaborative collaboration on resources.
   */
  addCollaEngine(collaEngine: Engine) {
    if (collaEngine.cancelQuit) {
      collaEngine.cancelQuit();
      return;
    }

    // await collaEngine.prepare();
    if (this.collaEngineMap.has(collaEngine.resourceId)) {
      console.error('Do not add CollaEngine');
    }
    this.collaEngineMap.set(collaEngine.resourceId, collaEngine);
  }

  private async nextTick() {
    await new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  async init(firstRoomInit = false) {
    // Ensure that the collaborative engine has been initialized
    const hasCollaEngine = () => {
      return this.collaEngineMap.has(this.roomId);
    };
    do {
      await this.nextTick();
    } while (!hasCollaEngine());
    firstRoomInit && this.sendLocalChangesetWithInit();
    // Initialize the collaboration engine first
    await Promise.all(Array.from(this.collaEngineMap.keys()).map(resourceId => {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      return collaEngine.waitPrepareComplete();
    }));

    await this.watch();
  }

  // When initializing, you need to send the locally cached localPendingChangeset (if any) to the server
  @errorCapture<RoomService>()
  async sendLocalChangesetWithInit() {
    const localPendingChangesetStorage = this.lsStore.namespace(BufferStorage.pendingChangesetsNamespace);
    const opBufferStorage = this.lsStore.namespace(BufferStorage.bufferStorageNamespace);

    const changesetMap = localPendingChangesetStorage.getAll();
    const opBufferMap = opBufferStorage.getAll();

    if (!Object.keys(changesetMap).length && !Object.keys(opBufferMap).length) {
      return;
    }
    this.event.setRoomIOClear(false);
    opBufferStorage.clearAll();
    localPendingChangesetStorage.clearAll();

    this.clearAllStorage();
    try {
      await this.applyLocalData(changesetMap, opBufferMap);
    } catch (e) {
      try {
        await this.backupDB.setItem(String(Date.now()), {
          changesetMap,
          opBufferMap
        });
      } catch (e) {
        if ((e as any).name === 'QuotaExceededError') {
          await this.backupDB.clear();
          await this.backupDB.setItem(String(Date.now()), { changesetMap, opBufferMap });
        }
      }

      const timestamps = await this.backupDB.keys();
      await Promise.all(timestamps.map(async timestamp => {
        // Clean up data whose backup time is greater than two weeks
        if (dayjs().diff(Date.now(), 'day') > 14) {
          await this.backupDB.removeItem(timestamp);
        }
      }));

      Player.doTrigger(Events.app_error_logger, {
        error: new Error(`Failed to initialize applyChangeset: ${(e as any).message}`),
        metaData: {
          roomId: this.roomId,
          changesetMap: JSON.stringify(changesetMap),
          opBufferMap: JSON.stringify(opBufferMap)
        },
      });

      throw new EnhanceError({
        code: ErrorCode.CollaModalError,
        message: t(Strings.initialization_failed_message),
        modalType: ModalType.Warning
      });

    }

    this.event.setRoomIOClear(true);
  }

  async applyLocalData(changesetMap: Record<string, ILocalChangeset>, opBufferMap: Record<string, IOperation[]>) {
    if (Object.keys(changesetMap).length) {
      const res = await Api.applyResourceChangesets(Object.values(changesetMap), this.roomId);
      const { success, message, code } = res.data;
      if (!success && code !== 4001) {
        throw new Error(`changesetMap: ${message}`);
      }
    }

    if (Object.keys(opBufferMap).length) {
      const changesets: ILocalChangeset[] = [];
      for (const resourceId in opBufferMap) {
        if (changesetMap[resourceId]) {
          const changeset = BufferStorage.ops2Changeset(
            opBufferMap[resourceId]!,
            changesetMap[resourceId]!.baseRevision + 1,
            resourceId,
            changesetMap[resourceId]!.resourceType
          );
          changesets.push(changeset);
          continue;
        }
        const opBuffer = opBufferMap[resourceId]!;
        const revision = opBuffer[0]!.revision;
        const resourceType = opBuffer[0]!.resourceType;
        const changeset = BufferStorage.ops2Changeset(opBuffer, revision as number, resourceId, resourceType as ResourceType);

        if (opBuffer.every(operation => !operation.mainLinkDstId)) {
          const res = await Api.applyResourceChangesets([changeset], this.roomId);
          const { success, message } = res.data;
          if (!success) {
            throw new Error(`single changesets: ${message}`);
          }
          delete opBufferMap[resourceId];
          continue;
        }

        changesets.push(changeset);
      }

      if (!changesets.length) {
        return;
      }

      const res = await Api.applyResourceChangesets(Object.values(changesets), this.roomId);
      const { success, message } = res.data;
      if (!success) {
        throw new Error(`opBufferMap: ${message}`);
      }
    }
  }

  /**
   * The backend server actively pushes changesets submitted by others
   * Or actively compensate for missing versions of changeset
   */
  @errorCapture<RoomService>()
  handleNewChanges(data: INewChangesData) {
    data.changesets.forEach(cs => {
      const resourceId = cs.resourceId;
      const collaEngine = this.collaEngineMap.get(resourceId);
      if (collaEngine) {
        void collaEngine.handleNewChanges(cs);
      } else if (
        resourceId.startsWith(NodeTypeReg.DATASHEET) &&
        !getDatasheet(this.store.getState(), resourceId)
      ) {
        // The data obtained at this time is the latest version, no need to apply cs anymore
        void this.fetchResource(resourceId, ResourceType.Datasheet);
      }
    });
  }

  /**
   * The @description watch method is mainly used to do 3 things
   * 1. Create a room on the client side and add it to the service
   * 2. Register listening events for various sockets
   * 3. Start the event coordination monitor on the client to ensure that blocked messages will be processed at intervals
   * Originally considered to compensate for the missing version in watch,
   * but the compensation behavior is already in init, handled by each engine itself,
   * so watch does not need to pay attention to version compensation anymore
   * @returns
   */
  @errorCapture<RoomService>()
  async watch() {
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    const embedId = state.pageParams.embedId;
    const watchResponse = await this.io.watch<IWatchResponse, any>(this.roomId, shareId, embedId).catch(e => {
      throw new EnhanceError(e);
    });

    this.setConnected(true);
    if (!watchResponse) {
      return;
    }
    const { resourceRevisions, collaborators } = watchResponse.data!;
    // console.log('resourceRevisions:', resourceRevisions);
    const collaEngine = this.collaEngineMap.get(this.roomId);
    if (!collaEngine) {
      return;
    }
    await this.checkVersion(resourceRevisions);
    const resourceType = collaEngine.resourceType;
    this.store.dispatch(roomInfoSync(this.roomId, resourceType, collaborators || []));
    this.store.dispatch(setResourceConnect(this.roomId, resourceType));
    this.loadFieldPermissionMap();
    this.bindSocketMessage();
    this.setSendingWatcher();

  }

  /**
   * Switching resources or reconnecting after disconnection requires the column permissions of all data tables in the room
   */
  loadFieldPermissionMap() {
    const dstIds: string[] = [];
    this.collaEngineMap.forEach(collaEngine => {
      if (collaEngine.resourceType !== ResourceType.Datasheet) {
        return;
      }
      dstIds.push(collaEngine.resourceId);
    });
    dstIds.length && this.store.dispatch(fetchFieldPermission(dstIds) as any);
  }

  @errorCapture<RoomService>()
  async checkVersion(resourceRevisions: IResourceRevision[] | null) {
    const missVersionEngines: { collaEngine: Engine; revision: number }[] = [];

    if (!resourceRevisions || !resourceRevisions.length) {
      console.log('The current resource has not been operated for a long time, and the data is automatically updated');
      await this.collaEngineMap.get(this.roomId)?.event.reloadResourceData();
      return;
    }

    for (const { resourceId, revision } of resourceRevisions) {
      const collaEngine = this.collaEngineMap.get(resourceId);

      if (!collaEngine) {
        continue;
      }

      const baseRevision = collaEngine.getRevision();
      const versionDiffs = numbersBetween(baseRevision, revision + 1);
      if (!versionDiffs.length) {
        continue;
      }
      if (versionDiffs.length >= 100) {
        throw new EnhanceError({
          code: StatusCode.FRONT_VERSION_ERROR,
          message: t(Strings.changeset_diff_big_tip),
          modalType: ModalType.Info
        });
      }
      missVersionEngines.push({ collaEngine, revision });
    }

    return await Promise.all(missVersionEngines.map<Promise<any>>(({ collaEngine, revision }) => {
      return collaEngine.prepare(revision + 1);
    }));
  }

  /**
   * @description unwatch no longer needs to pay attention to whether the coordinator queue is emptied,
   * there are two cases here: switch table and complete disconnection of ƒ socket.
   * The processing of the latter needs to rely on locally stored data, and the unwatch event here will not be triggered.
   * For the former, the service has already converted the engine data in the process of switching rooms,
   * which ensures that even if there is unsent data in the previous room, it can be coordinated after switching rooms.
   * So here you only need to pay attention to the notification that the middle server(room) leaves the room
   * @private
   */
  private async unwatch() {
    await this.io.unWatch();
  }

  /**
   * leave room
   * 1. Remove long chain message monitoring
   * 2. Clear data sending status monitoring timer
   */
  async leaveRoom() {
    this.setConnected(false);
    /**
     * After switching the space, the socket of the previous space is closed, so the event of leave_room will not be triggered, so
     * You can check the connection status of the item socket here
     */
    if (this.socket.connected) {
      await this.unwatch();
    } else {
      console.log('socket has been closed, room needn\'t leave again');
    }
    this.clearSendingWatcher();
    return this.collaEngineMap;
  }

  /**
   * @description supports a single Resource to exit the current collaborative Room without destroying the current Room
   * @param {string} resourceId
   * @returns
   */
  quit(resourceId: string) {
    const collaEngine = this.collaEngineMap.get(resourceId);
    if (!collaEngine) {
      return;
    }

    if (collaEngine.isStorageClear()) {
      this.collaEngineMap.delete(resourceId);
      collaEngine.cancelQuit?.();
      this.store.dispatch(resetResource(resourceId, collaEngine.resourceType));
      return;
    }

    if (collaEngine.cancelQuit) {
      return;
    }

    const cancelId = setInterval(() => {
      this.quit(resourceId);
    }, 100);

    collaEngine.cancelQuit = () => {
      clearInterval(cancelId);
    };
  }

  /**
    * Data sending status listener
    * Regular polling to check whether user data has been sent and confirmed
    * If it has not been confirmed for a long time (1 minute), execute a retry mechanism
    * This situation usually occurs with an error
   */
  private setSendingWatcher() {
    this.clearSendingWatcher();
    this.sendingWatcherTimer = setInterval(() => {
      if (!this.isConnect()) {
        return;
      }
      const changesets: ILocalChangeset[] = [];
      for (const key of this.collaEngineMap.keys()) {
        const localChangeset = this.collaEngineMap.get(key)!.bufferStorage.localPendingChangeset;

        if (localChangeset) {
          changesets.push(localChangeset);
        }
      }

      if (changesets.length > 0 && Date.now() - this.event.getRoomLastSendTime()! > 60 * 1000) {
        this.forceSend(changesets);
      }
    }, 10 * 1000);
  }

  private clearSendingWatcher() {
    clearInterval(this.sendingWatcherTimer);
  }

  // Force data to be sent to the server to avoid data jamming and not sending due to process problems.
  // As long as a persistent connection exists, data will be sent.
  private forceSend(changesets: ILocalChangeset[]) {
    const actionLength = changesets.reduce((pre, cur) => {
      return pre + cur.operations.reduce((p, c) => {
        return p + c.actions.length;
      }, 0);
    }, 0);

    // Note: In the case of pasting large data, the server may return slowly, and the data will not be re-sent at this time.
    if (actionLength > MAX_RETRY_LENGTH) {
      console.error('Paste data in large batches, the retry operation will not be performed');
      return;
    }

    Player.doTrigger(Events.app_error_logger, {
      error: new Error('force send userChanges'),
    });
    this.event.setRoomLastSendTime();

    void this.sendUserChanges(changesets);
  }

  /**
   * Send user-generated changeset
   */
  private sendUserChanges = (changesets: ILocalChangeset[]) => {
    console.log('Submission data: ', changesets, changesets.length);
    // mark the send queue waiting to return
    this.event.setRoomIOClear(false);
    this.event.setRoomLastSendTime();
    if (!this.connected) {
      console.error('room has been destroy,can\'t send anything');
      return;
    }
    // Load after 500ms, to prevent the icon from flashing when the network is fast
    const collaEngine = this.collaEngineMap.get(this.roomId);
    const resourceType = collaEngine?.resourceType!;
    const timer = setTimeout(() => {
      this.store.dispatch(changeResourceSyncingStatus(this.roomId, resourceType, true));
    }, 500);
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    return this.io.request<ISocketResponseData, IClientRoomMessage>({
      type: SyncRequestTypes.CLIENT_ROOM_CHANGE,
      roomId: this.roomId,
      changesets,
      shareId,
    }).then((data) => {
      clearTimeout(timer);
      this.event.setRoomIOClear(true);
      if (data.success && data.data) {
        this.store.dispatch(changeResourceSyncingStatus(this.roomId, resourceType, false));
        return this.handleAcceptCommit(data.data.changesets);
      }
      // Unsuccessful requests, divert traffic to the following catch
      return Promise.reject(data);
    }).catch(async e => {
      this.event.setRoomIOClear(true);
      let errMsg = e;
      clearTimeout(timer);
      if (!('success' in errMsg)) {
        errMsg = {
          success: false,
          code: 0,
          message: t(Strings.exception_network_exception),
        };
      }
      await this.handleRejectCommit(errMsg);
      return Promise.reject();
    });
  };

  @errorCapture<RoomService>()
  async handleAcceptCommit(changesets: IRemoteChangeset[]) {
    for (const cs of changesets) {
      const collaEngine = this.collaEngineMap.get(cs.resourceId)!;
      if (!collaEngine) {
        console.log('The room has been switched, the collaEngine is updated');
        continue;
      }
      await collaEngine.handleAcceptCommit(cs);
      // TODO: There are cookies in changesets to be removed in the middle layer
      console.log('Data returned successfully: ', cs);
    }

    this.nextSend();
  }

  @errorCapture<RoomService>()
  @socketGuard()
  async handleRejectCommit(data: ISocketResponseData, clearAllStorage = true) {
    // If the message is repeated, no need to refresh
    if (data.code === OtErrorCode.MSG_ID_DUPLICATE) {
      console.log(data.message);
      this.nextSend();
      return;
    }

    const bufferStorage = this.collaEngineMap.get(this.roomId)?.bufferStorage;

    Player.doTrigger(Events.app_error_logger, {
      error: new Error(`Incorrect op message: ${data.message}`),
      metaData: {
        roomId: this.roomId,
        connected: this.connected,
        socketConnected: this.io.socket.connected,
        opBuffer: JSON.stringify(bufferStorage?.opBuffer),
        localPendingChangeset: JSON.stringify(bufferStorage?.localPendingChangeset),
      },
    });

    if (clearAllStorage) {
      // Before clearing the data, make a local backup of the cleared data
      await this.backupDB.setItem(String(Date.now()), {
        opBufferMap: this.getBufferOperateMap(),
        changesetMap: keyBy(this.getLocalPendingChangesets(), 'resourceId')
      });
      this.clearAllStorage();
    }

    console.trace('Wrong op information');
    throw new EnhanceError(data);
  }

  private getBufferOperateMap() {
    const bufferOperateMap: Record<string, IOperation[]> = {};
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const operate = collaEngine.getOpBuffer();
      if (operate) {
        bufferOperateMap[resourceId] = operate;
      }
    }
    return bufferOperateMap;
  }

  private getLocalPendingChangesets() {
    const localPendingChangeset: ILocalChangeset[] = [];
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const cs = collaEngine.getLocalPendingChangeset();
      if (cs) {
        localPendingChangeset.push(cs);
      }
    }
    return localPendingChangeset;
  }

  // Clear all pending ops and pending changesets
  private clearAllStorage() {
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      collaEngine.clearLocalPendingChangeset();
      collaEngine.clearOpBuffer();
    }
  }

  /**
   * @description for the next round of sending
   * @private
   * When there are currently no queued requests, you can start sending directly
   * Otherwise, after waiting for the current request to end, opBuffer will be sent automatically
   * Called immediately when triggered for the first time, and will be called again after the interval expires
   */
  private nextSend = throttle(() => {
    if (!this.event.getRoomIOClear()) {
      console.error('throttledNextSend pending reject');
      return;
    }

    const nextChangesets: ILocalChangeset[] = [];
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      const cs = collaEngine.getNextChangeset();
      if (cs) {
        nextChangesets.push(cs);
      }
    }
    if (nextChangesets.length) {
      this.event.setRoomLastSendTime();
      void this.sendUserChanges(nextChangesets);
    }
  }, 500);

  /**
   * Push the operation into the send queue, SyncEngine will ensure that the data is sent to the server in version order
   * And provide temporary local persistence capabilities to
   * prevent users from losing data in the case of accidental network disconnection and active refresh
   *
   * Notice: Multiple operations may be merged into one changeset and sent to the server at one time
   *
   */
  @errorCapture<RoomService>()
  syncOperations(localOperations: IResourceOpsCollect[]) {
    localOperations.forEach(lop => {
      const collaEngine = this.collaEngineMap.get(lop.resourceId);
      lop.operations.forEach(op => collaEngine?.pushOpBuffer(op));
    });

    this.nextSend();
  }

  /**
   * Is it safe to close?
   * When there is still data that has not been successfully synchronized, return false, otherwise return true
   */
  isSafeToClose(): boolean {
    for (const resourceId of this.collaEngineMap.keys()) {
      const collaEngine = this.collaEngineMap.get(resourceId)!;
      if (!collaEngine.isStorageClear()) {
        return false;
      }
    }
    return true;
  }

  /**
   * A simple message sender for situations where only notifications need to be sent and no persistence is required.
   * message will be sent to all online
   */
  sendMessages(type: string, data?: Record<string, any>) {
    return this.io.request({
      type,
      ...data,
    });
  }

  getCollaEngine() {
    return this.collaEngineMap.get(this.roomId);
  }

  /**
   * Activate the collaborator. After calling this method,
   * the avatar of the current user will be displayed on the interface of all collaborators who open this table
   */
  handleActiveCollaborators(data: { collaborators: ICollaborator[] }) {
    console.log('active collaborators', data);
    const collaEngine = this.getCollaEngine();
    if (!collaEngine) {
      return;
    }
    data.collaborators.forEach(item => {
      this.store.dispatch(activeCollaborator(item, this.roomId, collaEngine.resourceType));
    });
  }

  /**
   * Deactivate the collaborator.
   * After calling this method, the avatar of the current user will be left on the interface of all collaborators who open this table
   */
  handleDeactivateCollaborator(data: ICollaborator) {
    // console.log('deactivate collaborator', data);
    const collaEngine = this.getCollaEngine();
    if (!collaEngine) {
      return;
    }
    this.store.dispatch(deactivateCollaborator(data, this.roomId, collaEngine.resourceType));
  }

  handleCursor(data: IEngagementCursorData) {
    // console.log('RECEIVED IEngagementCursorData: ', { data });
    const { cursorInfo } = data;
    this.store.dispatch(cursorMove({
      fieldId: cursorInfo.fieldId,
      recordId: cursorInfo.recordId,
      time: cursorInfo.time,
      socketId: data.socketId,
    }, this.roomId));
  }

  @errorCapture<RoomService>()
  handleNodeShareDisabled(data: INodeShareDisabledData) {
    console.log('RECEIVED INodeShareDisabledData: ', { data });
    const state = this.store.getState();
    const shareId = state.pageParams.shareId;
    if (shareId && data.shareIds.includes(shareId)) {
      this.event.destroy?.();
      throw new EnhanceError({
        code: StatusCode.NODE_NOT_EXIST,
        message: t(Strings.error_please_close_sharing_page),
        okText: t(Strings.okay),
        modalType: ModalType.Warning,
        onOkType: OnOkType.BackWorkBench
      });
    }
  }

  generateStdFieldPermission(data: IFieldPermissionMessage, manageable = false) {
    return {
      [data.fieldId]: {
        role: data.role || ConfigConstant.Role.None,
        setting: data.setting || {
          formSheetAccessible: false,
        },
        permission: data.permission || DEFAULT_FIELD_PERMISSION,
        manageable,
      },
    };
  }

  // Enable column permissions
  handleFieldPermissionEnabled(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionEnabled: ', { data });
    const fieldPermission = this.generateStdFieldPermission(data, true);
    this.store.dispatch(updateFieldPermissionMap(fieldPermission, data.datasheetId));

  }

  // change column permissions
  handleFieldPermissionChange(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionChange: ', { data });
    const fieldPermission = this.generateStdFieldPermission(data);
    this.store.dispatch(updateFieldPermissionMap(fieldPermission, data.datasheetId));
  }

  // disable column permissions
  handleFieldPermissionDisabled(data: IFieldPermissionMessage) {
    console.log('RECEIVED handleFieldPermissionDisabled: ', { data });
    this.store.dispatch(resetFieldPermissionMap(data.fieldId, data.datasheetId));
  }

  // Modify the configuration of column permissions
  // 0.7 don't handle the event
  handleFieldPermissionSetting(data: IFieldPermissionMessage) {
    console.log('RECEIVED IFieldPermissionMessage: ', { data });
    if (!data.setting) {
      return;
    }
    this.store.dispatch(updateFieldPermissionSetting(data.fieldId, data.setting, data.datasheetId));
  }

  /**
   * Handle messages actively pushed by io
   */
  private bindSocketMessage = () => {
    if (!this.io.socket) {
      throw new Error(t(Strings.error_please_bind_message_after_connected));
    }
    this.io.offAll();

    this.io.on<INewChangesData>(BroadcastTypes.SERVER_ROOM_CHANGE, (data) => {
      void this.handleNewChanges(data);
    });

    this.io.on<IEngagementCursorData & { datasheetId: string }>(BroadcastTypes.ENGAGEMENT_CURSOR, (data) => {
      this.handleCursor(data);
    });

    this.io.on<{ collaborators: ICollaborator[] }>(BroadcastTypes.ACTIVATE_COLLABORATORS, data => {
      this.handleActiveCollaborators(data);
    });

    this.io.on<ICollaborator>(BroadcastTypes.DEACTIVATE_COLLABORATOR, data => {
      this.handleDeactivateCollaborator(data);
    });

    this.io.on<INodeShareDisabledData>(BroadcastTypes.NODE_SHARE_DISABLED, data => {
      this.handleNodeShareDisabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_ENABLE, data => {
      this.handleFieldPermissionEnabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_CHANGE, data => {
      this.handleFieldPermissionChange(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_DISABLE, data => {
      this.handleFieldPermissionDisabled(data);
    });

    this.io.on<IFieldPermissionMessage>(BroadcastTypes.FIELD_PERMISSION_SETTING_CHANGE, data => {
      this.handleFieldPermissionSetting(data);
    });
  };

  setConnected(status: boolean) {
    this.connected = status;
  }

  getStatus() {
    return this.event.getRoomIOClear();
  }
}
